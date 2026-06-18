import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { nanoid } from 'nanoid';
import { saveUrlMapping, getUrlMapping, logClickEvent, getUrlAnalytics } from './db';
import { validateUrlSafety } from './ai';

type Bindings = {
  URL_MAPPINGS: KVNamespace;
  ANALYTICS: KVNamespace;
  AI: any;
};

const app = new Hono<{ Bindings: Bindings }>();

// Enable global CORS for all routes (important for cross-origin fetches from the frontend)
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'OPTIONS'],
  allowHeaders: ['Content-Type'],
}));

function getDeviceType(userAgent: string): string {
  const ua = userAgent.toLowerCase();
  if (ua.includes('tablet') || ua.includes('ipad') || ua.includes('playbook') || ua.includes('silk')) {
    return 'Tablet';
  }
  if (ua.includes('mobi') || ua.includes('iphone') || ua.includes('android') || ua.includes('windows phone')) {
    return 'Mobile';
  }
  return 'Desktop';
}

app.post('/shorten', async (c) => {
  try {
    const body = await c.req.json();
    const { long_url } = body; // Frontend sends long_url

    if (!long_url) {
      return c.json({ error: "Missing 'long_url' parameter." }, 400);
    }

    // Validate URL syntax
    try {
      new URL(long_url);
    } catch (_) {
      return c.json({ error: "Invalid URL format." }, 400);
    }

    // AI Threat Detection via Cloudflare Workers AI
    const safetyCheck = await validateUrlSafety(c.env.AI, long_url);
    if (!safetyCheck.isSafe) {
      return c.json({ error: "URL flagged as potentially malicious.", safetyScore: safetyCheck.safetyScore }, 403);
    }

    const shortCode = nanoid(6);
    await saveUrlMapping(c.env, shortCode, long_url, safetyCheck.safetyScore);

    return c.json({
      short_url: `https://${new URL(c.req.url).host}/${shortCode}`,
      short_code: shortCode,
      safety_score: safetyCheck.safetyScore
    }, 201);
  } catch (error) {
    console.error("Shorten Error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

app.get('/analytics/:code', async (c) => {
  try {
    const code = c.req.param('code');
    const mapping = await getUrlMapping(c.env, code);
    
    if (!mapping) {
      return c.json({ error: "URL mapping not found." }, 404);
    }

    const clicks = await getUrlAnalytics(c.env, code);
    
    const timelineMap: Record<string, number> = {};
    const deviceMap: Record<string, number> = { Desktop: 0, Mobile: 0, Tablet: 0 };

    for (const click of clicks) {
      const dateStr = new Date(click.timestamp).toISOString().split('T')[0];
      timelineMap[dateStr] = (timelineMap[dateStr] || 0) + 1;
      
      const device = getDeviceType(click.userAgent || '');
      deviceMap[device] = (deviceMap[device] || 0) + 1;
    }

    const timeline = Object.entries(timelineMap).map(([date, clicks]) => ({
      date,
      clicks
    })).sort((a, b) => a.date.localeCompare(b.date));

    return c.json({
      long_url: mapping.longUrl,
      analytics: {
        total_clicks: clicks.length,
        timeline,
        clicks_by_device: deviceMap
      }
    }, 200);
  } catch (error) {
    console.error("Analytics Error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

app.get('/:code', async (c) => {
  const code = c.req.param('code');
  if (code.length !== 6) {
    return c.notFound();
  }

  const mapping = await getUrlMapping(c.env, code);
  if (!mapping) {
    return c.text("URL not found", 404);
  }

  // Telemetry extraction
  const ip = c.req.header('cf-connecting-ip') || 'unknown';
  const country = c.req.header('cf-ipcountry') || 'unknown';
  const userAgent = c.req.header('user-agent') || 'unknown';
  
  // Hash IP natively using Web Crypto API
  const encoder = new TextEncoder();
  const ipData = encoder.encode(ip);
  const hashBuffer = await crypto.subtle.digest('SHA-256', ipData);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const ipHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

  const clickData = {
    ipHash,
    country,
    userAgent,
    timestamp: Date.now()
  };

  // Asynchronous execution without blocking the redirect
  c.executionCtx.waitUntil(logClickEvent(c.env, code, clickData));

  return c.redirect(mapping.longUrl, 302);
});

export default app;
