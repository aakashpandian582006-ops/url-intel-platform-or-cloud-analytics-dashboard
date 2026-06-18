import { useState } from 'react';
import { Globe2, Server, ShieldCheck, PowerOff, RefreshCw } from 'lucide-react';

export default function TrafficRouting() {
  const [failover, setFailover] = useState(false);

  return (
    <div className="glass-panel p-6 mt-8 animate-in fade-in slide-in-from-bottom-4 relative overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-12 border-b border-white/10 pb-4 gap-4">
        <div className="flex items-center gap-3">
          <Globe2 className="w-6 h-6 text-secondary" />
          <h2 className="text-xl font-bold text-white">Multi-Region Traffic Routing</h2>
        </div>
        <button
          onClick={() => setFailover(!failover)}
          className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-bold transition-all shadow-lg ${
            failover ? 'bg-danger text-white hover:bg-danger/90 shadow-danger/20' : 'bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white shadow-black/50'
          }`}
        >
          <RefreshCw className={`w-4 h-4 ${failover ? 'animate-spin-slow' : ''}`} />
          {failover ? 'Failover Active (us-west-2)' : 'Simulate Regional Failover'}
        </button>
      </div>

      <div className="relative flex flex-col md:flex-row items-center justify-center gap-6 md:gap-0 min-h-[300px]">
        
        {/* Global User */}
        <div className="flex flex-col items-center z-10 md:w-1/4">
          <div className="w-16 h-16 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center mb-3 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
            <Globe2 className="w-8 h-8 text-primary animate-pulse" />
          </div>
          <span className="font-bold text-white tracking-wide">Global Users</span>
        </div>

        {/* User to Gateway SVG Connector (Desktop) */}
        <div className="hidden md:block w-24 h-24 relative z-0">
          <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path 
              d="M 0,50 L 100,50" 
              fill="none" 
              stroke="#3B82F6" 
              strokeWidth="4" 
              strokeDasharray="8 8" 
              className="animate-[dash_1s_linear_infinite]"
              style={{ filter: 'drop-shadow(0 0 4px rgba(59,130,246,0.8))' }}
            />
          </svg>
        </div>

        {/* API Gateway */}
        <div className="z-10 px-8 py-5 rounded-2xl bg-[#0f172a] border border-white/20 shadow-2xl text-center min-w-[200px]">
          <ShieldCheck className="w-10 h-10 text-secondary mx-auto mb-3 drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
          <span className="font-bold text-white text-lg block tracking-wide">Cloudflare</span>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest mt-1 block">API Gateway / WAF</span>
        </div>

        {/* Gateway to Regions SVG Connectors (Desktop) */}
        <div className="hidden md:block flex-1 h-64 relative z-0 -mx-4">
          <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Path to Top Region (us-east-1) */}
            <path 
              d="M 0,50 C 40,50 40,20 100,20" 
              fill="none" 
              stroke={failover ? "#334155" : "#3B82F6"} 
              strokeWidth={failover ? "2" : "5"} 
              strokeDasharray={failover ? "none" : "10 10"} 
              className={failover ? "opacity-30" : "animate-[dash_1s_linear_infinite]"}
              style={{ filter: failover ? 'none' : 'drop-shadow(0 0 6px rgba(59,130,246,0.8))' }}
            />
            {/* Path to Bottom Region (us-west-2) */}
            <path 
              d="M 0,50 C 40,50 40,80 100,80" 
              fill="none" 
              stroke={!failover ? "#334155" : "#10B981"} 
              strokeWidth={!failover ? "2" : "5"} 
              strokeDasharray={!failover ? "none" : "10 10"} 
              className={!failover ? "opacity-30" : "animate-[dash_1s_linear_infinite]"}
              style={{ filter: !failover ? 'none' : 'drop-shadow(0 0 6px rgba(16,185,129,0.8))' }}
            />
          </svg>
        </div>

        {/* Regions */}
        <div className="flex flex-col justify-between h-64 w-full md:w-1/3 z-10 gap-6 md:gap-0">
          {/* Primary Region */}
          <div className={`relative p-5 rounded-2xl border transition-all duration-700 flex items-center gap-4 ${
            failover ? 'bg-slate-900/50 border-white/5 opacity-50 scale-95' : 'bg-primary/10 border-primary/40 shadow-[0_0_25px_rgba(59,130,246,0.15)] scale-100'
          }`}>
            <div className={`w-3 h-3 rounded-full shadow-lg ${failover ? 'bg-danger shadow-danger/50' : 'bg-primary animate-ping'}`}></div>
            <Server className={`w-10 h-10 ${failover ? 'text-slate-500' : 'text-primary'}`} />
            <div>
              <h4 className="font-bold text-white text-lg tracking-wide">us-east-1</h4>
              <p className="text-sm font-medium text-slate-400 mt-0.5">{failover ? 'OFFLINE (Simulated)' : 'Active - 100% Traffic'}</p>
            </div>
            {failover && <PowerOff className="absolute right-5 w-6 h-6 text-danger opacity-70" />}
          </div>

          {/* Secondary Region */}
          <div className={`relative p-5 rounded-2xl border transition-all duration-700 flex items-center gap-4 ${
            !failover ? 'bg-slate-900/50 border-white/5 opacity-50 scale-95' : 'bg-secondary/10 border-secondary/40 shadow-[0_0_25px_rgba(16,185,129,0.15)] scale-100'
          }`}>
            <div className={`w-3 h-3 rounded-full shadow-lg ${!failover ? 'bg-slate-600' : 'bg-secondary animate-ping'}`}></div>
            <Server className={`w-10 h-10 ${!failover ? 'text-slate-500' : 'text-secondary'}`} />
            <div>
              <h4 className="font-bold text-white text-lg tracking-wide">us-west-2</h4>
              <p className="text-sm font-medium text-slate-400 mt-0.5">{!failover ? 'Standby - 0% Traffic' : 'Active - 100% Traffic'}</p>
            </div>
          </div>
        </div>

      </div>

      <style>{`
        @keyframes dash {
          to { stroke-dashoffset: -20; }
        }
      `}</style>
    </div>
  );
}
