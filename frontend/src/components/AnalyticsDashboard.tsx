import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Search, Smartphone, MousePointerClick, Loader2, AlertCircle, BarChart3 } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export default function AnalyticsDashboard() {
  const { shortCode: initialShortCode } = useParams<{ shortCode?: string }>();
  const [shortCode, setShortCode] = useState(initialShortCode || '');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchAnalytics = async (code: string) => {
    if (!code) return;
    setLoading(true);
    setError(null);
    setData(null);
    
    try {
      const res = await fetch(`${API_URL}/analytics/${code}`);
      const result = await res.json();
      
      if (!res.ok) {
        throw new Error(result.error || 'Failed to fetch analytics');
      }
      
      setData(result);
      if (code !== initialShortCode) {
        navigate(`/analytics/${code}`);
      }
    } catch (err: any) {
      setError(err.message || 'Analytics not found');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialShortCode) {
      fetchAnalytics(initialShortCode);
    }
  }, [initialShortCode]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchAnalytics(shortCode);
  };

  return (
    <div className="w-full mt-8">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-secondary to-primary mb-4">
          Real-Time Analytics
        </h1>
        <p className="text-slate-400 text-lg">
          Track global clicks, devices, and traffic flow securely.
        </p>
      </div>

      <div className="glass-panel p-6 max-w-xl mx-auto mb-10">
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-500" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-3 border border-white/10 rounded-xl bg-slate-900/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all"
              placeholder="Enter Short Code (e.g. yT6R1a)"
              value={shortCode}
              onChange={(e) => setShortCode(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading || !shortCode}
            className="flex justify-center items-center py-3 px-6 border border-transparent rounded-xl text-md font-bold text-white bg-secondary hover:bg-secondary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary disabled:opacity-50 transition-all"
          >
            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Analyze'}
          </button>
        </form>
      </div>

      {error && (
        <div className="max-w-xl mx-auto mb-10 p-4 rounded-xl bg-danger/10 border border-danger/30 flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-danger shrink-0 mt-0.5" />
          <div>
            <h3 className="text-danger font-semibold">Error</h3>
            <p className="text-danger/80 text-sm mt-1">{error}</p>
          </div>
        </div>
      )}

      {data && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
          
          <div className="glass-panel p-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
             <div className="flex items-center gap-4">
               <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/30">
                 <MousePointerClick className="w-8 h-8 text-primary" />
               </div>
               <div>
                 <p className="text-sm font-medium text-slate-400">Total Clicks</p>
                 <h2 className="text-4xl font-bold text-white">{data.analytics.total_clicks}</h2>
               </div>
             </div>
             <div className="text-right flex-1 border-l border-white/10 pl-6">
                <p className="text-sm font-medium text-slate-400 mb-1">Target URL</p>
                <a href={data.long_url} target="_blank" rel="noreferrer" className="text-primary hover:underline text-lg break-all font-mono">
                  {data.long_url}
                </a>
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Timeline Chart */}
            <div className="glass-panel p-6">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" /> Click Timeline
              </h3>
              <div className="h-64">
                {data.analytics.timeline && data.analytics.timeline.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.analytics.timeline}>
                      <XAxis dataKey="date" stroke="#94A3B8" />
                      <YAxis stroke="#94A3B8" allowDecimals={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1A233A', borderColor: '#3B82F6', borderRadius: '8px', color: '#fff' }}
                        itemStyle={{ color: '#fff' }}
                      />
                      <Bar dataKey="clicks" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-500">No timeline data</div>
                )}
              </div>
            </div>

            {/* Devices Chart */}
            <div className="glass-panel p-6">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-secondary" /> Devices
              </h3>
              <div className="h-64 flex items-center justify-center">
                {Object.keys(data.analytics.clicks_by_device || {}).length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={Object.entries(data.analytics.clicks_by_device).map(([name, value]) => ({ name, value }))}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {Object.keys(data.analytics.clicks_by_device).map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#1A233A', borderColor: '#10B981', borderRadius: '8px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-slate-500">No device data</div>
                )}
              </div>
              <div className="flex justify-center gap-4 mt-4 text-sm text-slate-300">
                {Object.entries(data.analytics.clicks_by_device || {}).map(([name, value], index) => (
                   <div key={name} className="flex items-center gap-2">
                     <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                     {name}: {value as number}
                   </div>
                ))}
              </div>
            </div>
          </div>
          
        </div>
      )}
    </div>
  );
}
