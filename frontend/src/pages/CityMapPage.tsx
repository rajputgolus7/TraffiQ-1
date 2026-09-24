import { useState } from 'react';
import { INITIAL_CAMERAS, INITIAL_VEHICLES } from '../data/mockData';
import MapAnalytics from '../components/MapAnalytics';
import { Map, Layers, Radio, Video, Navigation, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CityMapPage() {
  const [selectedCamId, setSelectedCamId] = useState<string>('CAM-01');
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="ops-panel rounded-lg p-4 border border-panel-border shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Map size={22} className="text-accent" />
            <h2 className="text-xl font-black font-mono tracking-tight text-white uppercase">
              City-Wide GIS Operations & Spatial Graph
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-orange-950/80 text-orange-400 border border-orange-800 font-bold">
              TOPOLOGY: CARTOGRAPHIC DARK
            </span>
          </div>
          <p className="text-xs font-mono text-gray-400 mt-0.5">
            Georeferenced camera network nodes, road velocity bounds, and live vehicle trajectory links
          </p>
        </div>

        <div className="flex items-center space-x-2 font-mono text-xs">
          <button
            onClick={() => navigate('/journey')}
            className="px-3 py-1.5 rounded bg-accent/20 hover:bg-accent text-accent hover:text-black font-mono font-bold text-xs border border-accent/40 transition-colors"
          >
            VIEW JOURNEY TIMELINE →
          </button>
        </div>
      </div>

      {/* Main Map Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Full Interactive Map */}
        <div className="lg:col-span-9 h-[680px]">
          <MapAnalytics 
            cameras={INITIAL_CAMERAS}
            selectedVehicleId="V-1027"
            onSelectCamera={(id) => setSelectedCamId(id)}
            height="h-[680px]"
          />
        </div>

        {/* Camera Node Telemetry Sidebar */}
        <div className="lg:col-span-3 ops-panel rounded-lg p-4 border border-panel-border shadow-md flex flex-col justify-between space-y-4 max-h-[680px] overflow-hidden">
          <div className="flex-1 flex flex-col space-y-3 overflow-hidden">
            <div className="border-b border-panel-border/80 pb-2">
              <h3 className="font-mono text-xs font-bold text-gray-200 uppercase tracking-wider flex items-center justify-between">
                <span>Surveillance Nodes</span>
                <span className="text-accent">{INITIAL_CAMERAS.length} NODES</span>
              </h3>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {INITIAL_CAMERAS.map((c) => (
                <div
                  key={c.id}
                  onClick={() => setSelectedCamId(c.id)}
                  className={`p-3 rounded border font-mono text-xs cursor-pointer transition-all ${
                    selectedCamId === c.id
                      ? 'bg-accent/15 border-accent text-white font-bold'
                      : 'bg-[#0c1220] border-gray-800 text-gray-400 hover:text-white hover:border-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-accent font-bold">{c.id}</span>
                    <span className="text-[10px] text-online flex items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-online mr-1"></span> {c.fps} FPS
                    </span>
                  </div>
                  <div className="text-xs text-gray-200 truncate">{c.name}</div>
                  <div className="text-[10px] text-gray-500 mt-1 truncate">{c.road}</div>
                  <div className="mt-2 pt-1 border-t border-gray-800/80 flex items-center justify-between text-[10px] text-gray-400">
                    <span>{c.vehicleCount} Vehicles</span>
                    <span className="text-telemetry">{c.resolution}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#0b101c] p-3 rounded border border-gray-800 font-mono text-[11px] text-gray-400 space-y-1">
            <div className="text-white font-bold text-xs flex items-center space-x-1.5">
              <ShieldAlert size={14} className="text-warning" />
              <span>Spatial Correlation Engine</span>
            </div>
            <div>Travel times estimated via velocity limits and Euclidean road network matrices.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
