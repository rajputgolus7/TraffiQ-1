import { VehicleProfile } from '../types';
import { 
  Car, 
  MapPin, 
  Gauge, 
  Clock, 
  ShieldCheck, 
  AlertTriangle, 
  GitFork, 
  ExternalLink 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface VehicleQuickInspectorProps {
  vehicle: VehicleProfile;
  onSelectVehicle?: (vehicleId: string) => void;
}

export default function VehicleQuickInspector({ vehicle }: VehicleQuickInspectorProps) {
  const navigate = useNavigate();

  return (
    <div className="ops-panel rounded-lg p-4 border border-panel-border shadow-md flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-panel-border/80 pb-3 mb-3">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded bg-accent/20 border border-accent/40 text-accent">
            <Car size={18} />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-base font-black text-white">{vehicle.id}</span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase border ${
                vehicle.status === 'WATCHLIST'
                  ? 'bg-red-950/80 text-alert border-red-700'
                  : 'bg-emerald-950/60 text-online border-emerald-800'
              }`}>
                {vehicle.status}
              </span>
            </div>
            <div className="text-[11px] font-mono text-gray-400 mt-0.5">
              TARGET INTELLIGENCE PROFILE
            </div>
          </div>
        </div>

        {/* License Plate Display */}
        <div className="bg-white text-black px-2.5 py-1 rounded font-mono font-black text-xs tracking-wider border-2 border-gray-400 shadow-inner flex items-center space-x-1">
          <span className="text-[9px] text-gray-500 font-bold mr-1">IND</span>
          <span>{vehicle.plate}</span>
        </div>
      </div>

      {/* Grid of Attributes */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-1 font-mono text-xs">
        <div className="bg-[#0b101c] p-2 rounded border border-gray-800/80">
          <div className="text-[10px] text-gray-500 uppercase">Class & Color</div>
          <div className="font-bold text-white mt-0.5 truncate">{vehicle.type} • {vehicle.color}</div>
        </div>

        <div className="bg-[#0b101c] p-2 rounded border border-gray-800/80">
          <div className="text-[10px] text-gray-500 uppercase">First Seen</div>
          <div className="font-bold text-gray-300 mt-0.5 flex items-center space-x-1">
            <Clock size={11} className="text-gray-500" />
            <span>{vehicle.firstSeen}</span>
          </div>
        </div>

        <div className="bg-[#0b101c] p-2 rounded border border-gray-800/80">
          <div className="text-[10px] text-gray-500 uppercase">Last Seen</div>
          <div className="font-bold text-gray-300 mt-0.5 flex items-center space-x-1">
            <Clock size={11} className="text-gray-500" />
            <span>{vehicle.lastSeen}</span>
          </div>
        </div>

        <div className="bg-[#0b101c] p-2 rounded border border-gray-800/80">
          <div className="text-[10px] text-gray-500 uppercase">Cameras Visited</div>
          <div className="font-bold text-accent mt-0.5 flex items-center space-x-1">
            <MapPin size={11} className="text-accent" />
            <span>{vehicle.camerasCount.toString().padStart(2, '0')} NODES</span>
          </div>
        </div>
      </div>

      {/* Trajectory KPIs & Re-ID Confidence */}
      <div className="grid grid-cols-3 gap-2.5 my-2 font-mono text-xs">
        <div className="bg-[#0b101c] p-2 rounded border border-gray-800/80">
          <div className="text-[10px] text-gray-500 uppercase flex items-center space-x-1">
            <GitFork size={11} className="text-telemetry" />
            <span>DISTANCE</span>
          </div>
          <div className="text-sm font-bold text-white mt-0.5">{vehicle.distanceKm} KM</div>
        </div>

        <div className="bg-[#0b101c] p-2 rounded border border-gray-800/80">
          <div className="text-[10px] text-gray-500 uppercase flex items-center space-x-1">
            <Gauge size={11} className="text-warning" />
            <span>AVG SPEED</span>
          </div>
          <div className="text-sm font-bold text-white mt-0.5">{vehicle.avgSpeedKmh} KM/H</div>
        </div>

        <div className="bg-[#0b101c] p-2 rounded border border-gray-800/80">
          <div className="text-[10px] text-gray-500 uppercase flex items-center space-x-1">
            <ShieldCheck size={11} className="text-online" />
            <span>RE-ID MATCH</span>
          </div>
          <div className="text-sm font-bold text-online mt-0.5">{vehicle.reidConfidence}%</div>
        </div>
      </div>

      {/* Button to Reconstruct Full Journey */}
      <div className="pt-2 mt-1 border-t border-panel-border/80 flex items-center justify-between">
        <div className="text-[11px] font-mono text-gray-400">
          Current node: <span className="text-accent font-bold">{vehicle.currentCamera}</span>
        </div>

        <button
          onClick={() => navigate('/journey')}
          className="flex items-center space-x-1.5 bg-accent/20 hover:bg-accent text-accent hover:text-black font-mono font-bold text-xs px-3.5 py-1.5 rounded transition-all border border-accent/40"
        >
          <span>View Reconstructed Route</span>
          <ExternalLink size={13} />
        </button>
      </div>
    </div>
  );
}
