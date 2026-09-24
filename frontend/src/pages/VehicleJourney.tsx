import { useState } from 'react';
import { 
  INITIAL_VEHICLES, 
  INITIAL_CAMERAS 
} from '../data/mockData';
import MapAnalytics from '../components/MapAnalytics';
import { 
  Search, 
  Car, 
  Clock, 
  MapPin, 
  Gauge, 
  ShieldCheck, 
  ArrowRight, 
  GitFork, 
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Layers
} from 'lucide-react';

export default function VehicleJourney() {
  const [searchQuery, setSearchQuery] = useState('PB10XX1234');
  const [selectedVehicle, setSelectedVehicle] = useState(INITIAL_VEHICLES[0]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim().toUpperCase();
    const match = INITIAL_VEHICLES.find(
      v => v.plate.toUpperCase().includes(query) || v.id.toUpperCase().includes(query)
    );
    if (match) {
      setSelectedVehicle(match);
    }
  };

  const selectVehicleQuick = (vehicleId: string) => {
    const v = INITIAL_VEHICLES.find(item => item.id === vehicleId);
    if (v) {
      setSelectedVehicle(v);
      setSearchQuery(v.plate);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Search & Filter Bar */}
      <div className="ops-panel rounded-lg p-4 border border-panel-border shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-black font-mono tracking-tight text-white uppercase flex items-center space-x-2">
              <GitFork size={20} className="text-accent" />
              <span>Vehicle Journey Reconstruction</span>
            </h2>
            <p className="text-xs font-mono text-gray-400 mt-0.5">
              Multi-camera spatial-temporal correlation and automated trajectory synthesis
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            {/* Search Input Form */}
            <form onSubmit={handleSearch} className="flex items-center space-x-2">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter Plate (e.g., PB10XX1234) or ID"
                  className="bg-[#0b101c] border border-gray-700 focus:border-accent text-white font-mono text-xs pl-9 pr-3 py-2 rounded w-64 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="bg-accent hover:bg-orange-600 text-black font-mono font-bold text-xs px-4 py-2 rounded transition-colors"
              >
                TRACK
              </button>
            </form>

            {/* Quick Select Preset Buttons */}
            <div className="flex items-center space-x-1 font-mono text-[11px]">
              <span className="text-gray-500 text-[10px] mr-1">QUICK:</span>
              {INITIAL_VEHICLES.slice(0, 3).map((v) => (
                <button
                  key={v.id}
                  onClick={() => selectVehicleQuick(v.id)}
                  className={`px-2 py-1 rounded border text-[10px] font-mono transition-colors ${
                    selectedVehicle.id === v.id
                      ? 'bg-accent/20 text-accent border-accent/60 font-bold'
                      : 'bg-[#0f1728] text-gray-400 border-gray-800 hover:text-white'
                  }`}
                >
                  {v.id} ({v.plate})
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Hero Journey Overview Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono">
        <div className="ops-panel p-3.5 rounded-lg border border-panel-border">
          <div className="text-[10px] text-gray-400 uppercase flex items-center space-x-1.5">
            <GitFork size={13} className="text-telemetry" />
            <span>TOTAL DISTANCE</span>
          </div>
          <div className="text-2xl font-black text-white mt-1">
            {selectedVehicle.distanceKm} <span className="text-xs font-normal text-gray-400">KM</span>
          </div>
          <div className="text-[10px] text-gray-400 mt-1">Calculated via road graph</div>
        </div>

        <div className="ops-panel p-3.5 rounded-lg border border-panel-border">
          <div className="text-[10px] text-gray-400 uppercase flex items-center space-x-1.5">
            <Clock size={13} className="text-accent" />
            <span>TRAVEL DURATION</span>
          </div>
          <div className="text-2xl font-black text-accent mt-1">
            04:37 <span className="text-xs font-normal text-gray-400">MIN</span>
          </div>
          <div className="text-[10px] text-gray-400 mt-1">Transit time between nodes</div>
        </div>

        <div className="ops-panel p-3.5 rounded-lg border border-panel-border">
          <div className="text-[10px] text-gray-400 uppercase flex items-center space-x-1.5">
            <Gauge size={13} className="text-warning" />
            <span>AVG SPEED</span>
          </div>
          <div className="text-2xl font-black text-white mt-1">
            {selectedVehicle.avgSpeedKmh} <span className="text-xs font-normal text-gray-400">KM/H</span>
          </div>
          <div className="text-[10px] text-gray-400 mt-1">Within legal velocity envelope</div>
        </div>

        <div className="ops-panel p-3.5 rounded-lg border border-panel-border">
          <div className="text-[10px] text-gray-400 uppercase flex items-center space-x-1.5">
            <ShieldCheck size={13} className="text-online" />
            <span>MATCH CONFIDENCE</span>
          </div>
          <div className="text-2xl font-black text-online mt-1">
            {selectedVehicle.reidConfidence}%
          </div>
          <div className="text-[10px] text-gray-400 mt-1">OSNet Visual + ANPR Plate</div>
        </div>
      </div>

      {/* Main Grid: Timeline on Left, GIS Trajectory Map on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Multi-Camera Timeline (5 Columns on LG) */}
        <div className="lg:col-span-5 ops-panel rounded-lg p-4 border border-panel-border flex flex-col shadow-md">
          <div className="flex items-center justify-between border-b border-panel-border/80 pb-3 mb-4">
            <div>
              <h3 className="font-mono text-xs font-bold text-gray-200 tracking-wider uppercase">
                Chronological Node Timeline
              </h3>
              <p className="text-[11px] font-mono text-gray-500 mt-0.5">
                Target: <span className="text-white font-bold">{selectedVehicle.id}</span> • {selectedVehicle.type} ({selectedVehicle.color})
              </p>
            </div>
            <span className="font-mono text-xs bg-black/60 px-2 py-1 rounded text-white border border-gray-700 font-bold">
              {selectedVehicle.plate}
            </span>
          </div>

          {/* Timeline Nodes */}
          <div className="space-y-4 relative before:absolute before:inset-0 before:left-4 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-accent before:via-orange-500 before:to-emerald-500 pr-1 overflow-y-auto max-h-[500px]">
            {selectedVehicle.journey.length > 0 ? (
              selectedVehicle.journey.map((stop, idx) => (
                <div key={stop.cameraId} className="relative flex items-start space-x-4 pl-1">
                  {/* Step Marker */}
                  <div className="w-7 h-7 rounded-full bg-[#0d1424] border-2 border-accent text-accent font-mono font-bold text-xs flex items-center justify-center shrink-0 z-10 shadow-md">
                    {idx + 1}
                  </div>

                  {/* Card for this Stop */}
                  <div className="flex-1 bg-[#0c1220] border border-gray-800 hover:border-accent/60 p-3.5 rounded-lg transition-all text-xs font-mono">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-accent text-sm">{stop.cameraId}</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-200 font-semibold">{stop.cameraName}</span>
                      </div>
                      <span className="text-online font-bold">
                        {(stop.confidence * 100).toFixed(0)}% Match
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-400 pt-1 border-t border-gray-800/80">
                      <div>TIMESTAMP: <span className="text-white font-bold">{stop.timestamp}</span></div>
                      <div>LOCAL SPEED: <span className="text-white font-bold">{stop.speedKmh} km/h</span></div>
                      {stop.transitTimeSec && (
                        <div className="col-span-2 text-telemetry">
                          TRANSIT TIME: <span className="font-bold">{stop.transitTimeSec} seconds</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-gray-500 font-mono text-xs">
                No intermediate journey nodes recorded for this target.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Interactive Map Route (7 Columns on LG) */}
        <div className="lg:col-span-7 h-[580px]">
          <MapAnalytics 
            cameras={INITIAL_CAMERAS}
            selectedVehicleId={selectedVehicle.id}
            height="h-[580px]"
          />
        </div>
      </div>
    </div>
  );
}
