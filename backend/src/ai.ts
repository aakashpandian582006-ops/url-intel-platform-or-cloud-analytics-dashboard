export async function validateUrlSafety(ai: any, url: string): Promise<{ isSafe: boolean; safetyScore: number }> {
  // Pre-process URL into tokens
  const urlWithoutProtocol = url.replace(/^(https?:\/\/)/, "");
  const tokens = urlWithoutProtocol.split(/[-/_?&=#.]+/).filter(Boolean);
  const textToAnalyze = tokens.join(" ");

  const lowerUrl = url.toLowerCase();
  
  // Trusted domains bypass to prevent false positives on common sites
  const trustedDomains = ['github.com', 'google.com', 'microsoft.com', 'apple.com', 'linkedin.com', 'twitter.com', 'youtube.com'];
  const isTrusted = trustedDomains.some(domain => lowerUrl.includes(domain));
  if (isTrusted) {
    return { isSafe: true, safetyScore: 100 };
  }

  // Keywords that often signal phishing when found in path/domain
  const suspiciousKeywords = ['login', 'signin', 'bank', 'secure', 'account', 'verify', 'update', 'password', 'wallet'];
  const hasSuspiciousKeyword = suspiciousKeywords.some(keyword => lowerUrl.includes(keyword));

  try {
    const response = await ai.run('@cf/huggingface/distilbert-sst-2-int8', {
      text: textToAnalyze
    });
    
    // DistilBERT SST-2 returns POSITIVE / NEGATIVE probabilities
    const negativeScore = response.find((r: any) => r.label === 'NEGATIVE')?.score || 0;
    
    // Convert to a 0-100 safety score
    const safetyScore = Math.max(0, 100 - (negativeScore * 100));
    
    // If it has suspicious keywords, be more sensitive (block if safetyScore < 40)
    // Otherwise, require very high negative sentiment to block (safetyScore < 15, meaning >85% negative)
    let isSafe = true;
    if (hasSuspiciousKeyword && safetyScore < 40) {
      isSafe = false;
    } else if (safetyScore < 15) {
      isSafe = false;
    }
    
    return {
      isSafe,
      safetyScore: Math.round(safetyScore)
    };
  } catch (err) {
    console.error("AI Validation failed:", err);
    // Fail open if AI fails
    return { isSafe: true, safetyScore: 100 };
  }
}

