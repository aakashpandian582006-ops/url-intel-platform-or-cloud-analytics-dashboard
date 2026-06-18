import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { ShieldCheck, Server, AlertCircle } from 'lucide-react';

const WAF_DATA = [
  { name: 'WAF Active', value: 98 },
  { name: 'Anomaly Detected', value: 2 },
];
const COLORS = ['#10B981', '#EF4444'];

const AUDIT_LOGS = [
  { id: 1, time: '09:12:45', principal: 'sys-admin-role', action: 'Update WAF Rule', resource: 'waf-policy-main', result: 'Success' },
  { id: 2, time: '09:14:22', principal: 'lambda-exec-role', action: 'Assume Role', resource: 'db-access-role', result: 'Success' },
  { id: 3, time: '09:18:05', principal: 'unknown-identity', action: 'API Invoke', resource: 'analytics-api', result: 'Blocked' },
  { id: 4, time: '09:22:11', principal: 'sys-admin-role', action: 'Rotate Keys', resource: 'kms-master-key', result: 'Success' },
  { id: 5, time: '09:25:33', principal: 'cloudflare-worker', action: 'Cache Purge', resource: 'edge-cache-01', result: 'Success' },
];

export default function SecurityCompliance() {
  return (
    <div className="mt-8 rounded-2xl overflow-hidden border border-white/10 bg-surface/50 backdrop-blur-md shadow-2xl animate-in fade-in slide-in-from-bottom-4">
      {/* Header */}
      <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-slate-900/50">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-bold text-white">Security & Access Overview (Compliance View)</h2>
        </div>
        <div className="flex items-center gap-2 text-sm font-semibold text-secondary bg-secondary/10 px-3 py-1 rounded-full border border-secondary/20">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
          </span>
          Zero-Trust Enforced
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
        
        {/* Column 1: Visual Status */}
        <div className="lg:col-span-3 flex flex-col items-center justify-center p-4 border border-white/5 rounded-xl bg-slate-900/30">
          <h3 className="text-sm font-semibold text-slate-400 mb-2">Compliance Status</h3>
          <div className="h-32 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={WAF_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={35}
                  outerRadius={50}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {WAF_DATA.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-xl font-bold text-white">98%</span>
            </div>
          </div>
          <div className="flex flex-col gap-1 w-full mt-2">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-secondary"></div> WAF Active</span>
              <span className="font-bold">98%</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-danger"></div> Anomaly Detected</span>
              <span className="font-bold">2%</span>
            </div>
          </div>
        </div>

        {/* Column 2: Cloud Metrics Summary */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <div className="flex-1 p-4 border border-white/5 rounded-xl bg-slate-900/30 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-1">
              <Server className="w-4 h-4 text-primary" />
              <p className="text-sm font-medium text-slate-400">Total IAM Roles Scanned</p>
            </div>
            <h3 className="text-3xl font-bold text-white">45</h3>
          </div>
          <div className="flex-1 p-4 border border-white/5 rounded-xl bg-slate-900/30 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-1">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              <p className="text-sm font-medium text-slate-400">Active Policy Alerts</p>
            </div>
            <h3 className="text-3xl font-bold text-amber-500">3</h3>
          </div>
        </div>

        {/* Column 3: Key Audit Events Ledger */}
        <div className="lg:col-span-6 border border-white/5 rounded-xl bg-slate-900/30 overflow-hidden flex flex-col">
          <h3 className="text-sm font-semibold text-slate-400 p-4 border-b border-white/5">Key Audit Events Ledger</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-800/50 text-xs uppercase text-slate-400 border-b border-white/5">
                <tr>
                  <th className="px-4 py-3 font-medium">Timestamp</th>
                  <th className="px-4 py-3 font-medium">Principal</th>
                  <th className="px-4 py-3 font-medium">Action</th>
                  <th className="px-4 py-3 font-medium">Resource</th>
                  <th className="px-4 py-3 font-medium">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {AUDIT_LOGS.map((log) => (
                  <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-2 font-mono text-xs">{log.time}</td>
                    <td className="px-4 py-2 font-mono text-xs text-primary">{log.principal}</td>
                    <td className="px-4 py-2">{log.action}</td>
                    <td className="px-4 py-2 font-mono text-xs text-slate-400">{log.resource}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${log.result === 'Success' ? 'bg-secondary/10 text-secondary' : 'bg-danger/10 text-danger'}`}>
                        {log.result}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
