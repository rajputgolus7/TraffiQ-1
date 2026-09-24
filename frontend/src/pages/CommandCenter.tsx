import { useState, useEffect } from 'react';
import CameraCard from '../components/CameraCard';
import KPITelemetryStrip from '../components/KPITelemetryStrip';
import AITelemetryPanel from '../components/AITelemetryPanel';
import LiveEventsFeed from '../components/LiveEventsFeed';
import VehicleQuickInspector from '../components/VehicleQuickInspector';
import MapAnalytics from '../components/MapAnalytics';
import { 
  INITIAL_CAMERAS, 
  INITIAL_KPIS, 
  INITIAL_TELEMETRY, 
  INITIAL_EVENTS, 
  INITIAL_VEHICLES 
} from '../data/mockData';
import { CameraStream, VehicleProfile } from '../types';
import { Radio, RefreshCw, Layers } from 'lucide-react';

export default function CommandCenter() {
  const [cameras, setCameras] = useState<CameraStream[]>(INITIAL_CAMERAS.slice(0, 4));
  const [kpis] = useState(INITIAL_KPIS);
  const [telemetry] = useState(INITIAL_TELEMETRY);
  const [events] = useState(INITIAL_EVENTS);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleProfile>(INITIAL_VEHICLES[0]);
  const [wallLayout, setWallLayout] = useState<'2x2' | '3x2'>('2x2');

  const handleSelectVehicle = (vehicleId: string) => {
    const found = INITIAL_VEHICLES.find(v => v.id === vehicleId);
    if (found) {
      setSelectedVehicle(found);
    }
  };

  return (
    <div className="space-y-4">
      {/* 1. Page Header & Operations Telemetry Strip */}
      <div className="flex flex-col space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-1 gap-2">
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-black font-mono tracking-tight text-white uppercase">
                City-Wide Command Center
              </h2>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950/80 text-online border border-emerald-800">
                <span className="w-1.5 h-1.5 rounded-full bg-online animate-pulse mr-1.5"></span> LIVE INGESTION
              </span>
            </div>
            <p className="text-xs font-mono text-gray-400 mt-0.5">
              Real-time multi-camera vehicle intelligence and spatial-temporal trajectory tracking
            </p>
          </div>

          <div className="flex items-center space-x-2 font-mono text-xs">
            <span className="text-gray-500">LAYOUT:</span>
            <button
              onClick={() => {
                setWallLayout('2x2');
                setCameras(INITIAL_CAMERAS.slice(0, 4));
              }}
              className={`px-2.5 py-1 rounded border text-xs font-mono font-bold transition-all ${
                wallLayout === '2x2' 
                  ? 'bg-accent text-black border-accent' 
                  : 'bg-[#101826] text-gray-400 border-gray-800 hover:text-white'
              }`}
            >
              2x2 QUAD
            </button>
            <button
              onClick={() => {
                setWallLayout('3x2');
                setCameras(INITIAL_CAMERAS.slice(0, 6));
              }}
              className={`px-2.5 py-1 rounded border text-xs font-mono font-bold transition-all ${
                wallLayout === '3x2' 
                  ? 'bg-accent text-black border-accent' 
                  : 'bg-[#101826] text-gray-400 border-gray-800 hover:text-white'
              }`}
            >
              3x2 WALL
            </button>
          </div>
        </div>

        {/* Telemetry Strip */}
        <KPITelemetryStrip kpis={kpis} />
      </div>

      {/* 2. Middle Row: Live Camera Wall (Left) + AI Telemetry & Events Feed (Right) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        {/* CCTV Camera Wall (7 Columns on XL) */}
        <div className="xl:col-span-7 flex flex-col space-y-2">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center space-x-2">
              <Radio size={14} className="text-accent animate-pulse" />
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-gray-200">
                Live Camera Surveillance Wall ({cameras.length} Feeds)
              </span>
            </div>
            <div className="text-[10px] font-mono text-gray-400 flex items-center space-x-2">
              <span>SYNC: <strong className="text-online">0.02s</strong></span>
              <span>•</span>
              <span>CLICK TO EXPAND / INSPECT</span>
            </div>
          </div>

          <div className={`grid gap-3 ${wallLayout === '2x2' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-3'}`}>
            {cameras.map((cam) => (
              <div key={cam.id} className="h-56">
                <CameraCard camera={cam} onSelectVehicle={handleSelectVehicle} />
              </div>
            ))}
          </div>
        </div>

        {/* Right Telemetry Column (5 Columns on XL) */}
        <div className="xl:col-span-5 grid grid-cols-1 gap-4">
          {/* AI Neural Engine Telemetry */}
          <AITelemetryPanel telemetry={telemetry} />

          {/* Live Intelligence Feed */}
          <div className="h-[290px]">
            <LiveEventsFeed 
              events={events} 
              onSelectVehicle={handleSelectVehicle}
              maxHeight="h-[235px]"
            />
          </div>
        </div>
      </div>

      {/* 3. Bottom Row: GIS Map & Reconstructed Route + Vehicle Quick Inspector */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 pt-1">
        {/* City GIS Map (7 Columns on XL) */}
        <div className="xl:col-span-7 h-[360px]">
          <MapAnalytics 
            cameras={cameras} 
            selectedVehicleId={selectedVehicle.id}
            height="h-[360px]"
          />
        </div>

        {/* Selected Vehicle Intelligence Inspector (5 Columns on XL) */}
        <div className="xl:col-span-5 h-[360px]">
          <VehicleQuickInspector vehicle={selectedVehicle} />
        </div>
      </div>
    </div>
  );
}
