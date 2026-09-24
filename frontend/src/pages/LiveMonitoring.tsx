import { useState } from 'react';
import { INITIAL_CAMERAS } from '../data/mockData';
import CameraCard from '../components/CameraCard';
import { Cctv, Filter, Grid, Radio, Sliders } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function LiveMonitoring() {
  const [filter, setFilter] = useState<'ALL' | 'ONLINE' | 'ACTIVE_DETECTION'>('ALL');
  const [gridCols, setGridCols] = useState<'2' | '3'>('3');
  const navigate = useNavigate();

  const filteredCameras = INITIAL_CAMERAS.filter(c => {
    if (filter === 'ONLINE') return c.status === 'online';
    if (filter === 'ACTIVE_DETECTION') return c.detections.length > 0;
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Header Bar */}
      <div className="ops-panel rounded-lg p-4 border border-panel-border shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Cctv size={22} className="text-accent" />
            <h2 className="text-xl font-black font-mono tracking-tight text-white uppercase">
              Live Surveillance Wall & Edge Monitoring
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-online border border-emerald-800 font-bold">
              12 STREAMS ENROLLED
            </span>
          </div>
          <p className="text-xs font-mono text-gray-400 mt-0.5">
            Synchronized RTSP video ingestion with local edge AI neural inference
          </p>
        </div>

        {/* Filter & View Controls */}
        <div className="flex items-center space-x-3 font-mono text-xs">
          {/* Status Filter */}
          <div className="flex items-center space-x-1 bg-[#0b101c] p-1 rounded border border-gray-800">
            {(['ALL', 'ONLINE', 'ACTIVE_DETECTION'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-2.5 py-1 rounded text-[11px] transition-colors ${
                  filter === tab
                    ? 'bg-accent text-black font-bold'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab.replace('_', ' ')}
              </button>
            ))}
          </div>

          {/* Grid Toggle */}
          <div className="flex items-center space-x-1 bg-[#0b101c] p-1 rounded border border-gray-800">
            <button
              onClick={() => setGridCols('2')}
              className={`px-2.5 py-1 rounded text-[11px] ${gridCols === '2' ? 'bg-gray-800 text-white font-bold' : 'text-gray-400'}`}
            >
              2 COL
            </button>
            <button
              onClick={() => setGridCols('3')}
              className={`px-2.5 py-1 rounded text-[11px] ${gridCols === '3' ? 'bg-gray-800 text-white font-bold' : 'text-gray-400'}`}
            >
              3 COL
            </button>
          </div>
        </div>
      </div>

      {/* Camera Grid Wall */}
      <div className={`grid gap-4 ${gridCols === '2' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
        {filteredCameras.map((cam) => (
          <div key={cam.id} className="h-64">
            <CameraCard 
              camera={cam} 
              onSelectVehicle={(id) => navigate('/journey')}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
