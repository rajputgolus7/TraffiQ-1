import { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import TopHeader from './components/TopHeader';
import Sidebar from './components/Sidebar';
import CommandCenter from './pages/CommandCenter';
import LiveMonitoring from './pages/LiveMonitoring';
import VehiclesPage from './pages/VehiclesPage';
import VehicleJourney from './pages/VehicleJourney';
import CityMapPage from './pages/CityMapPage';
import AlertsCenter from './pages/AlertsCenter';
import AnalyticsPage from './pages/AnalyticsPage';
import DemoMode from './pages/DemoMode';

function AppLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isPresentationMode, setIsPresentationMode] = useState(false);
  const location = useLocation();

  // If in /demo route, it manages its own full-screen presentation UI
  if (location.pathname === '/demo') {
    return <DemoMode />;
  }

  return (
    <div className="h-screen bg-[#080c14] text-white flex flex-col overflow-hidden bg-tech-grid">
      {/* Persistent Operations Top Header */}
      {!isPresentationMode && (
        <TopHeader
          activeCameras={12}
          totalCameras={12}
          activeVehicles={847}
          activeAlerts={23}
          isPresentationMode={isPresentationMode}
          onTogglePresentationMode={() => setIsPresentationMode(!isPresentationMode)}
        />
      )}

      {/* Main Operations Frame */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Collapsible Command Sidebar */}
        {!isPresentationMode && (
          <Sidebar
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          />
        )}

        {/* Dynamic Route Content */}
        <main className="flex-1 overflow-y-auto p-4 relative">
          {/* Subtle floating toggle to restore UI if in presentation mode */}
          {isPresentationMode && (
            <button
              onClick={() => setIsPresentationMode(false)}
              className="absolute top-4 right-4 z-40 bg-accent text-black font-mono font-bold text-xs px-3 py-1.5 rounded shadow-lg border border-orange-400 opacity-80 hover:opacity-100 transition-opacity"
            >
              EXIT FULL SCREEN
            </button>
          )}

          <Routes>
            <Route path="/" element={<CommandCenter />} />
            <Route path="/cameras" element={<LiveMonitoring />} />
            <Route path="/vehicles" element={<VehiclesPage />} />
            <Route path="/journey" element={<VehicleJourney />} />
            <Route path="/map" element={<CityMapPage />} />
            <Route path="/alerts" element={<AlertsCenter />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/demo" element={<DemoMode />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}
