import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ShieldAlert, Link as LinkIcon, Loader2, ArrowRight } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function ShortenerForm() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleShorten = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    // Trigger functional live-demo integration for Observability Panel
    window.dispatchEvent(new Event('demo-spike'));

    try {
      // Basic validation
      new URL(url);

      const res = await fetch(`${API_URL}/shorten`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ long_url: url }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || data.reason || 'Failed to shorten URL');
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Invalid URL or Server Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto w-full mt-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-4">
          Intelligent URL Shortening
        </h1>
        <p className="text-slate-400 text-lg">
          Powered by Cloudflare Workers AI to block spam, phishing, and harmful content in real-time.
        </p>
      </div>

      <div className="glass-panel p-8">
        <form onSubmit={handleShorten} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Destination URL</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LinkIcon className="h-5 w-5 text-slate-500" />
              </div>
              <input
                type="url"
                required
                className="block w-full pl-10 pr-3 py-3 border border-white/10 rounded-xl bg-slate-900/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="https://example.com/very/long/url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !url}
            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl text-md font-bold text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                Scanning & Shortening...
              </>
            ) : (
              'Shorten & Protect URL'
            )}
          </button>
        </form>

        {error && (
          <div className="mt-6 p-4 rounded-xl bg-danger/10 border border-danger/30 flex items-start gap-3">
            <ShieldAlert className="w-6 h-6 text-danger shrink-0 mt-0.5" />
            <div>
              <h3 className="text-danger font-semibold">Security Alert or Error</h3>
              <p className="text-danger/80 text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        {result && (
          <div className="mt-8 p-6 rounded-xl bg-secondary/10 border border-secondary/30 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center gap-3 mb-4">
              <ShieldCheck className="w-6 h-6 text-secondary" />
              <h3 className="text-secondary font-semibold text-lg">URL Secured & Shortened!</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-400 mb-1">Short Link</p>
                <div className="flex items-center gap-2">
                  <a 
                    href={`${API_URL}/${result.short_code}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-primary hover:underline font-mono text-lg break-all"
                  >
                    {API_URL}/{result.short_code}
                  </a>
                </div>
              </div>
              
              <button 
                onClick={() => navigate(`/analytics/${result.short_code}`)}
                className="inline-flex items-center text-sm text-slate-300 hover:text-white transition-colors"
              >
                View Analytics <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
