import { Cpu, Zap, Activity, HardDrive } from 'lucide-react';
import { AITelemetry } from '../types';

interface AITelemetryPanelProps {
  telemetry: AITelemetry;
}

export default function AITelemetryPanel({ telemetry }: AITelemetryPanelProps) {
  const models = [
    { name: 'DETECTION', model: 'YOLOv11x', accuracy: telemetry.detectionAccuracy, color: 'bg-accent' },
    { name: 'TRACKING', model: 'ByteTrack MOT', accuracy: telemetry.trackingAccuracy, color: 'bg-telemetry' },
    { name: 'ANPR', model: 'PaddleOCR v4', accuracy: telemetry.anprAccuracy, color: 'bg-warning' },
    { name: 'RE-ID', model: 'OSNet-AIN', accuracy: telemetry.reidAccuracy, color: 'bg-purple-500' },
  ];

  return (
    <div className="ops-panel rounded-lg p-4 flex flex-col justify-between border border-panel-border shadow-md">
      <div className="flex items-center justify-between border-b border-panel-border/80 pb-2 mb-3">
        <div className="flex items-center space-x-2">
          <Cpu size={16} className="text-accent" />
          <h3 className="font-mono text-xs font-bold text-gray-200 tracking-wider uppercase">
            AI Neural Engine Telemetry
          </h3>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 text-online border border-emerald-800/80 font-bold flex items-center space-x-1">
          <span className="w-1.5 h-1.5 rounded-full bg-online animate-pulse mr-1"></span>
          CUDA ACCELERATED
        </span>
      </div>

      {/* Model Accuracy Matrix */}
      <div className="space-y-2.5 my-1">
        {models.map((m) => (
          <div key={m.name} className="space-y-1">
            <div className="flex justify-between items-center text-[11px] font-mono">
              <span className="text-gray-300 font-bold">{m.name}</span>
              <span className="text-gray-500 text-[10px]">{m.model}</span>
              <span className="text-white font-bold">{m.accuracy.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-[#0c1220] h-1.5 rounded-full overflow-hidden border border-gray-800">
              <div 
                className={`h-full rounded-full ${m.color}`} 
                style={{ width: `${m.accuracy}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Inference & Hardware Stats */}
      <div className="grid grid-cols-3 gap-2 pt-3 mt-3 border-t border-panel-border/80 text-center font-mono">
        <div className="bg-[#0b101c] p-2 rounded border border-gray-800/90">
          <div className="text-[10px] text-gray-500 flex items-center justify-center space-x-1">
            <Zap size={10} className="text-yellow-400" />
            <span>INFERENCE</span>
          </div>
          <div className="text-sm font-bold text-accent mt-0.5">{telemetry.inferenceFps} <span className="text-[10px] font-normal text-gray-400">FPS</span></div>
        </div>

        <div className="bg-[#0b101c] p-2 rounded border border-gray-800/90">
          <div className="text-[10px] text-gray-500 flex items-center justify-center space-x-1">
            <Activity size={10} className="text-online" />
            <span>PROCESSING</span>
          </div>
          <div className="text-sm font-bold text-white mt-0.5">{telemetry.activeStreams} <span className="text-[10px] font-normal text-gray-400">FEEDS</span></div>
        </div>

        <div className="bg-[#0b101c] p-2 rounded border border-gray-800/90">
          <div className="text-[10px] text-gray-500 flex items-center justify-center space-x-1">
            <HardDrive size={10} className="text-telemetry" />
            <span>LATENCY</span>
          </div>
          <div className="text-sm font-bold text-telemetry mt-0.5">{telemetry.apiLatencyMs} <span className="text-[10px] font-normal text-gray-400">ms</span></div>
        </div>
      </div>
    </div>
  );
}
