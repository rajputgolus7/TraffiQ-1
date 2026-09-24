import { useState } from 'react';
import { IntelligenceEvent } from '../types';
import { 
  Radio, 
  GitCommit, 
  Car, 
  AlertTriangle, 
  ArrowRight,
  Filter
} from 'lucide-react';

interface LiveEventsFeedProps {
  events: IntelligenceEvent[];
  onSelectVehicle?: (vehicleId: string) => void;
  maxHeight?: string;
}

export default function LiveEventsFeed({ 
  events, 
  onSelectVehicle, 
  maxHeight = 'h-[360px]' 
}: LiveEventsFeedProps) {
  const [filter, setFilter] = useState<'ALL' | 'MATCH' | 'ANPR' | 'ALERT'>('ALL');

  const filteredEvents = events.filter((e) => {
    if (filter === 'MATCH') return e.type === 'CROSS_CAMERA_MATCH';
    if (filter === 'ANPR') return e.type === 'ANPR';
    if (filter === 'ALERT') return e.type === 'ALERT';
    return true;
  });

  const getEventBadge = (type: IntelligenceEvent['type']) => {
    switch (type) {
      case 'CROSS_CAMERA_MATCH':
        return (
          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-cyan-950/80 text-telemetry border border-cyan-800/80">
            RE-ID MATCH
          </span>
        );
      case 'ANPR':
        return (
          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-950/80 text-warning border border-amber-800/80">
            ANPR RESULT
          </span>
        );
      case 'ALERT':
        return (
          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-red-950/80 text-alert border border-red-800/80">
            PRIORITY ALERT
          </span>
        );
      case 'TRAJECTORY':
        return (
          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-purple-950/80 text-purple-400 border border-purple-800/80">
            TRAJECTORY
          </span>
        );
      default:
        return (
          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-orange-950/80 text-accent border border-orange-800/80">
            DETECTION
          </span>
        );
    }
  };

  return (
    <div className="ops-panel rounded-lg flex flex-col border border-panel-border shadow-md h-full">
      {/* Feed Header */}
      <div className="bg-[#0b111c] border-b border-panel-border px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Radio size={14} className="text-accent animate-pulse" />
          <h3 className="font-mono text-xs font-bold text-gray-200 tracking-wider uppercase">
            Live Intelligence Feed
          </h3>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-1 font-mono text-[10px]">
          <Filter size={11} className="text-gray-500 mr-1" />
          {(['ALL', 'MATCH', 'ANPR', 'ALERT'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-2 py-0.5 rounded transition-colors ${
                filter === tab
                  ? 'bg-accent text-black font-bold'
                  : 'text-gray-400 hover:text-white bg-[#101827]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Events Stream */}
      <div className={`flex-1 overflow-y-auto p-3 space-y-2.5 ${maxHeight}`}>
        {filteredEvents.map((evt) => (
          <div
            key={evt.id}
            onClick={() => onSelectVehicle && onSelectVehicle(evt.vehicleId)}
            className={`p-2.5 rounded border transition-all text-xs font-mono relative cursor-pointer group ${
              evt.type === 'ALERT'
                ? 'bg-red-950/20 border-red-900/60 hover:border-red-500'
                : evt.type === 'CROSS_CAMERA_MATCH'
                  ? 'bg-cyan-950/20 border-cyan-900/60 hover:border-cyan-400'
                  : 'bg-[#0f1728]/70 border-gray-800/90 hover:border-accent/60'
            }`}
          >
            {/* Top row: Timestamp, Type Badge, Camera */}
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center space-x-2">
                <span className="text-gray-400 font-bold">{evt.timestamp}</span>
                {getEventBadge(evt.type)}
              </div>

              <div className="text-[11px] text-gray-400">
                {evt.targetCamera ? (
                  <span className="text-telemetry font-bold flex items-center space-x-1">
                    <span>{evt.camera}</span>
                    <ArrowRight size={10} className="inline mx-0.5" />
                    <span>{evt.targetCamera}</span>
                  </span>
                ) : (
                  <span className="text-accent font-bold">{evt.camera}</span>
                )}
              </div>
            </div>

            {/* Core Event Message */}
            <div className="text-gray-200 text-[11px] font-sans leading-tight">
              {evt.message}
            </div>

            {/* Bottom details if available */}
            <div className="mt-2 pt-1.5 border-t border-gray-800/60 flex items-center justify-between text-[10px] text-gray-400">
              <div className="flex items-center space-x-2">
                <Car size={11} className="text-gray-500" />
                <span className="text-white font-bold">{evt.vehicleId}</span>
                {evt.plate && (
                  <span className="bg-black/60 px-1 py-0.2 rounded border border-gray-700 text-gray-300">
                    {evt.plate}
                  </span>
                )}
              </div>

              {evt.confidence && (
                <div className="text-online font-bold">
                  {(evt.confidence * 100).toFixed(1)}% CONF
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
