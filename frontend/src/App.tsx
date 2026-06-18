import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import ShortenerForm from './components/ShortenerForm';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import { Shield, BarChart3, Link as LinkIcon } from 'lucide-react';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background text-slate-200 font-sans">
        <nav className="border-b border-white/10 bg-surface/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold text-white hover:text-primary transition-colors">
              <Shield className="w-6 h-6 text-primary" />
              <span>URL Intel Platform</span>
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
        </main>
      </div>
    </Router>
  );
}

export default App;
