import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Activity, Map as MapIcon, PlayCircle } from 'lucide-react';
import CommandCenter from './pages/CommandCenter';
import VehicleJourney from './pages/VehicleJourney';
import DemoMode from './pages/DemoMode';

function NavLinks() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path ? 'text-accent' : 'text-gray-400 hover:text-accent';

  return (
    <nav className="flex space-x-6 text-sm font-medium">
      <Link to="/" className={`${isActive('/')} flex items-center space-x-2 transition-colors`}>
        <Activity size={16} /> <span>Dashboard</span>
      </Link>
      <Link to="/journey" className={`${isActive('/journey')} flex items-center space-x-2 transition-colors`}>
        <MapIcon size={16} /> <span>Vehicle Journey</span>
      </Link>
      <Link to="/demo" className={`${isActive('/demo')} flex items-center space-x-2 transition-colors`}>
        <PlayCircle size={16} /> <span>Demo Mode</span>
      </Link>
    </nav>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="h-screen bg-dark text-white flex flex-col overflow-hidden">
        <header className="bg-panel border-b border-gray-800 p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="bg-accent p-1.5 rounded-md">
              <Activity size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-wider leading-tight">TraffiQ</h1>
              <div className="text-xs text-gray-500 uppercase tracking-widest">Ops Center v2.0</div>
            </div>
          </div>
          <NavLinks />
        </header>
        <main className="flex-1 overflow-auto p-4">
          <Routes>
            <Route path="/" element={<CommandCenter />} />
            <Route path="/journey" element={<VehicleJourney />} />
            <Route path="/demo" element={<DemoMode />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
