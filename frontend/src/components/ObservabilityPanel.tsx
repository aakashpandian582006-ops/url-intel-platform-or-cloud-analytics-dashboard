import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Activity, Server, Zap, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function ObservabilityPanel() {
  const [metrics, setMetrics] = useState({
    latency: 45,
    requestRate: 1200,
    errorRate: 0.05,
    cpu: 32,
    memory: 45
  });

  const [history, setHistory] = useState<{ time: string, latency: number }[]>([]);

  useEffect(() => {
    // Pre-fill history
    const initialHistory = Array.from({ length: 20 }).map((_, i) => ({
      time: new Date(Date.now() - (20 - i) * 1000).toLocaleTimeString([], { hour12: false, second: '2-digit', minute: '2-digit' }),
      latency: Math.floor(Math.random() * 20) + 40
    }));
    setHistory(initialHistory);

    const interval = setInterval(() => {
      setMetrics(prev => {
        // Occasional anomaly logic
        const isSpike = Math.random() > 0.95;
        const newLatency = isSpike ? Math.floor(Math.random() * 300) + 200 : Math.floor(Math.random() * 20) + 40;
        const newErrorRate = isSpike ? (Math.random() * 2 + 1).toFixed(2) : (Math.random() * 0.1).toFixed(2);
        
        const updated = {
          latency: newLatency,
          requestRate: Math.floor(Math.random() * 500) + 2000,
          errorRate: parseFloat(newErrorRate as string),
          cpu: isSpike ? Math.floor(Math.random() * 30) + 70 : Math.floor(Math.random() * 15) + 30,
          memory: prev.memory + (Math.random() > 0.5 ? 1 : -1)
        };

        setHistory(curr => {
          const newTime = new Date().toLocaleTimeString([], { hour12: false, second: '2-digit', minute: '2-digit' });
          const newHistory = [...curr.slice(1), { time: newTime, latency: updated.latency }];
          return newHistory;
        });

        return updated;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleSpike = () => {
      setMetrics(prev => {
        const updated = {
          latency: Math.floor(Math.random() * 100) + 250, // Massive latency spike
          requestRate: Math.floor(Math.random() * 2000) + 8000, // Massive traffic spike
          errorRate: 0.05,
          cpu: Math.floor(Math.random() * 15) + 85, // CPU Spike
          memory: prev.memory > 90 ? prev.memory : prev.memory + 5
        };

        setHistory(curr => {
          const newTime = new Date().toLocaleTimeString([], { hour12: false, second: '2-digit', minute: '2-digit' });
          return [...curr.slice(1), { time: newTime, latency: updated.latency }];
        });

        return updated;
      });
    };

    window.addEventListener('demo-spike', handleSpike);
    return () => window.removeEventListener('demo-spike', handleSpike);
  }, []);

  const isDegraded = metrics.latency > 200 || metrics.errorRate > 1;

  return (
    <div className="glass-panel p-6 mt-8">
      <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <Activity className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-bold text-white">Live Cloud Observability</h2>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2 ${isDegraded ? 'bg-danger/20 text-danger border border-danger/30' : 'bg-secondary/20 text-secondary border border-secondary/30'}`}>
          {isDegraded ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
          {isDegraded ? 'SYSTEM DEGRADED' : 'SYSTEM HEALTHY'}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard title="API Latency" value={`${metrics.latency}ms`} icon={<Zap className="w-5 h-5" />} isDanger={metrics.latency > 200} />
        <MetricCard title="Request Rate" value={`${metrics.requestRate} req/s`} icon={<Activity className="w-5 h-5" />} />
        <MetricCard title="Error Rate" value={`${metrics.errorRate}%`} icon={<AlertTriangle className="w-5 h-5" />} isDanger={metrics.errorRate > 1} />
        <MetricCard title="CPU Utilization" value={`${metrics.cpu}%`} icon={<Server className="w-5 h-5" />} isDanger={metrics.cpu > 80} />
      </div>

      <div className="h-64 border border-white/5 rounded-xl bg-slate-900/50 p-4">
        <h3 className="text-sm font-semibold text-slate-400 mb-4">Global API Latency (ms)</h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={history}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
            <XAxis dataKey="time" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1A233A', borderColor: '#3B82F6', borderRadius: '8px', color: '#fff' }}
              itemStyle={{ color: '#fff' }}
            />
            <Line 
              type="monotone" 
              dataKey="latency" 
              stroke={isDegraded ? '#EF4444' : '#3B82F6'} 
              strokeWidth={3} 
              dot={false}
              animationDuration={300}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon, isDanger = false }: { title: string, value: string, icon: React.ReactNode, isDanger?: boolean }) {
  return (
    <div className={`p-4 rounded-xl border ${isDanger ? 'bg-danger/10 border-danger/30' : 'bg-slate-900/50 border-white/5'} transition-colors duration-500`}>
      <div className="flex justify-between items-start mb-2">
        <p className="text-sm font-medium text-slate-400">{title}</p>
        <div className={`${isDanger ? 'text-danger' : 'text-slate-500'}`}>
          {icon}
        </div>
      </div>
      <h3 className={`text-2xl font-bold ${isDanger ? 'text-danger' : 'text-white'}`}>{value}</h3>
    </div>
  );
}
