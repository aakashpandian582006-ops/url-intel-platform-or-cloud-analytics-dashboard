import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import ShortenerForm from './components/ShortenerForm';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import ObservabilityPanel from './components/ObservabilityPanel';
import TrafficRouting from './components/TrafficRouting';
import SecurityCompliance from './components/SecurityCompliance';
import { Shield, BarChart3, Link as LinkIcon } from 'lucide-react';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background text-slate-200 font-sans">
        <nav className="border-b border-white/10 bg-surface/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link to="/" className="flex flex-col">
              <div className="flex items-center gap-2 text-xl font-bold text-white hover:text-primary transition-colors">
                <Shield className="w-6 h-6 text-primary" />
                <span>URL Intel Platform</span>
              </div>
              <span className="text-xs font-medium text-slate-400 mt-0.5 tracking-wide uppercase ml-8">The Global Traffic Analytics Hub</span>
            </Link>
            <div className="flex gap-4">
              <Link to="/" className="flex items-center gap-2 hover:text-primary transition-colors font-medium">
                <LinkIcon className="w-4 h-4" /> Shorten
              </Link>
              <Link to="/analytics" className="flex items-center gap-2 hover:text-primary transition-colors font-medium">
                <BarChart3 className="w-4 h-4" /> Analytics
              </Link>
            </div>
          </div>
        </nav>

        <main className="max-w-6xl mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<ShortenerForm />} />
            <Route path="/analytics/:shortCode?" element={<AnalyticsDashboard />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          {/* Enterprise Command Center Section */}
          <div className="mt-20 pt-10 border-t border-white/10 animate-in fade-in duration-700">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-3">
                Enterprise Cloud Infrastructure
              </h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                Live Simulation: Multi-Region High-Availability Architecture & Zero-Trust Security Telemetry
              </p>
            </div>
            
            <ObservabilityPanel />
            <TrafficRouting />
            <SecurityCompliance />
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
