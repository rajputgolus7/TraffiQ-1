import { useState } from 'react';
import { INITIAL_VEHICLES } from '../data/mockData';
import { VehicleProfile } from '../types';
import { 
  CarFront, 
  Search, 
  Filter, 
  ShieldAlert, 
  Clock, 
  ExternalLink, 
  MapPin, 
  Gauge, 
  ShieldCheck 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function VehiclesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'WATCHLIST' | 'NORMAL'>('ALL');
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleProfile>(INITIAL_VEHICLES[0]);
  const navigate = useNavigate();

  const filtered = INITIAL_VEHICLES.filter((v) => {
    const matchesSearch = 
      v.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (statusFilter === 'WATCHLIST') return matchesSearch && v.status === 'WATCHLIST';
    if (statusFilter === 'NORMAL') return matchesSearch && v.status === 'NORMAL';
    return matchesSearch;
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="ops-panel rounded-lg p-4 border border-panel-border shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <CarFront size={22} className="text-accent" />
            <h2 className="text-xl font-black font-mono tracking-tight text-white uppercase">
              Vehicle Intelligence & Track Database
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/80 text-telemetry border border-cyan-800 font-bold">
              847 TARGETS ENROLLED
            </span>
          </div>
          <p className="text-xs font-mono text-gray-400 mt-0.5">
            Active multi-camera trajectory tracking index and cross-camera Re-ID embeddings
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex items-center space-x-2 font-mono text-xs">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Plate, ID, Type..."
              className="bg-[#0b101c] border border-gray-700 focus:border-accent text-white pl-9 pr-3 py-1.5 rounded w-56 text-xs focus:outline-none"
            />
          </div>

          <div className="flex items-center space-x-1 bg-[#0b101c] p-1 rounded border border-gray-800">
            {(['ALL', 'WATCHLIST', 'NORMAL'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-2.5 py-1 rounded text-[11px] transition-colors ${
                  statusFilter === tab
                    ? 'bg-accent text-black font-bold'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Layout: Table on Left, Details on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Table Column (8 Cols on LG) */}
        <div className="lg:col-span-8 ops-panel rounded-lg border border-panel-border overflow-hidden shadow-md flex flex-col">
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-[#0b101c] border-b border-panel-border text-gray-400 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Vehicle ID</th>
                  <th className="py-3 px-4">License Plate</th>
                  <th className="py-3 px-4">Class & Color</th>
                  <th className="py-3 px-4">Current Camera</th>
                  <th className="py-3 px-4">Nodes Visited</th>
                  <th className="py-3 px-4">Speed</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/80">
                {filtered.map((v) => (
                  <tr
                    key={v.id}
                    onClick={() => setSelectedVehicle(v)}
                    className={`hover:bg-[#121c2e] transition-colors cursor-pointer ${
                      selectedVehicle.id === v.id ? 'bg-[#142036] border-l-2 border-accent' : ''
                    }`}
                  >
                    <td className="py-3 px-4 font-bold text-accent">{v.id}</td>
                    <td className="py-3 px-4">
                      <span className="bg-white text-black font-bold px-1.5 py-0.5 rounded text-[11px] border border-gray-400">
                        {v.plate}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-300">{v.type} ({v.color})</td>
                    <td className="py-3 px-4 text-telemetry font-bold">{v.currentCamera}</td>
                    <td className="py-3 px-4 text-gray-300">{v.camerasCount} Cams</td>
                    <td className="py-3 px-4 text-white font-bold">{v.avgSpeedKmh} km/h</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        v.status === 'WATCHLIST'
                          ? 'bg-red-950 text-alert border border-red-800'
                          : 'bg-emerald-950 text-online border border-emerald-800'
                      }`}>
                        {v.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate('/journey');
                        }}
                        className="p-1 rounded bg-accent/20 hover:bg-accent text-accent hover:text-black transition-colors"
                        title="View Full Journey"
                      >
                        <ExternalLink size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Vehicle Profile Card (4 Cols on LG) */}
        <div className="lg:col-span-4 ops-panel rounded-lg p-5 border border-panel-border shadow-md flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-panel-border/80 pb-3">
              <div>
                <h3 className="font-mono text-sm font-black text-white flex items-center space-x-2">
                  <span>{selectedVehicle.id}</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-accent">{selectedVehicle.type}</span>
                </h3>
                <p className="text-[11px] font-mono text-gray-400 mt-0.5">
                  Appearance Color: <strong className="text-white">{selectedVehicle.color}</strong>
                </p>
              </div>

              <div className="bg-white text-black font-mono font-black text-xs px-2 py-1 rounded border border-gray-400">
                {selectedVehicle.plate}
              </div>
            </div>

            {/* Metric Blocks */}
            <div className="grid grid-cols-2 gap-2.5 font-mono text-xs">
              <div className="bg-[#0b101c] p-2.5 rounded border border-gray-800">
                <div className="text-[10px] text-gray-500 uppercase">First Seen</div>
                <div className="text-white font-bold mt-1 flex items-center space-x-1">
                  <Clock size={12} className="text-gray-400" />
                  <span>{selectedVehicle.firstSeen}</span>
                </div>
              </div>

              <div className="bg-[#0b101c] p-2.5 rounded border border-gray-800">
                <div className="text-[10px] text-gray-500 uppercase">Last Seen</div>
                <div className="text-white font-bold mt-1 flex items-center space-x-1">
                  <Clock size={12} className="text-gray-400" />
                  <span>{selectedVehicle.lastSeen}</span>
                </div>
              </div>

              <div className="bg-[#0b101c] p-2.5 rounded border border-gray-800">
                <div className="text-[10px] text-gray-500 uppercase">Total Distance</div>
                <div className="text-white font-bold mt-1">{selectedVehicle.distanceKm} KM</div>
              </div>

              <div className="bg-[#0b101c] p-2.5 rounded border border-gray-800">
                <div className="text-[10px] text-gray-500 uppercase">Avg Velocity</div>
                <div className="text-warning font-bold mt-1">{selectedVehicle.avgSpeedKmh} KM/H</div>
              </div>
            </div>

            {/* Re-ID Feature Confidence */}
            <div className="bg-[#0b101c] p-3 rounded border border-gray-800 space-y-1.5 font-mono">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400 flex items-center space-x-1">
                  <ShieldCheck size={13} className="text-online" />
                  <span>Cross-Camera Re-ID Confidence</span>
                </span>
                <span className="text-online font-bold">{selectedVehicle.reidConfidence}%</span>
              </div>
              <div className="w-full bg-[#162135] h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-online h-full rounded-full" 
                  style={{ width: `${selectedVehicle.reidConfidence}%` }}
                ></div>
              </div>
              <div className="text-[10px] text-gray-500 pt-1">
                Cosine similarity computed against OSNet 512-dim visual embeddings.
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate('/journey')}
            className="w-full py-2.5 bg-accent hover:bg-orange-600 text-black font-mono font-bold text-xs rounded transition-colors flex items-center justify-center space-x-2 shadow-md shadow-orange-950/40"
          >
            <ExternalLink size={14} />
            <span>Launch Complete Trajectory Reconstruction</span>
          </button>
        </div>
      </div>
    </div>
  );
}
