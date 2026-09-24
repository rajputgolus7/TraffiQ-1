import { useState } from 'react';
import { CameraStream } from '../types';
import CCTVCanvas from './CCTVCanvas';
import { 
  X, 
  Maximize2, 
  Eye, 
  EyeOff, 
  Moon, 
  ShieldAlert, 
  Activity, 
  Cpu, 
  Radio, 
  Layers, 
  Crosshair,
  ExternalLink
} from 'lucide-react';

interface CameraModalProps {
  camera: CameraStream;
  onClose: () => void;
  onSelectVehicle?: (vehicleId: string) => void;
}

export default function CameraModal({ camera, onClose, onSelectVehicle }: CameraModalProps) {
  const [nightVision, setNightVision] = useState(false);
  const [showBoxes, setShowBoxes] = useState(true);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="ops-panel-glow w-full max-w-5xl rounded-lg overflow-hidden border border-panel-border flex flex-col max-h-[92vh] shadow-2xl">
        {/* Modal Header */}
        <div className="bg-[#0b101b] border-b border-panel-border px-5 py-3.5 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="p-1.5 rounded bg-accent/20 border border-accent/40 text-accent">
              <Crosshair size={18} />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono font-bold text-accent text-base">{camera.id}</span>
                <span className="text-gray-400">•</span>
                <span className="font-semibold text-white text-base">{camera.name}</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-online/20 text-online border border-online/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-online animate-pulse mr-1.5"></span> LIVE FEED
                </span>
              </div>
              <div className="text-xs text-gray-400 font-mono mt-0.5">
                {camera.road} • {camera.location} • [LAT: {camera.coordinates[1]} N, LNG: {camera.coordinates[0]} E]
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setNightVision(!nightVision)}
              className={`p-2 rounded text-xs font-mono flex items-center space-x-1.5 border transition-all ${
                nightVision 
                  ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500' 
                  : 'bg-[#152033] text-gray-400 border-gray-700 hover:text-white'
              }`}
              title="Toggle Infrared Night Vision"
            >
              <Moon size={14} />
              <span>{nightVision ? 'IR: ON' : 'IR: OFF'}</span>
            </button>
            <button
              onClick={() => setShowBoxes(!showBoxes)}
              className={`p-2 rounded text-xs font-mono flex items-center space-x-1.5 border transition-all ${
                showBoxes 
                  ? 'bg-accent/20 text-accent border-accent/50' 
                  : 'bg-[#152033] text-gray-400 border-gray-700 hover:text-white'
              }`}
              title="Toggle AI Bounding Boxes"
            >
              {showBoxes ? <Eye size={14} /> : <EyeOff size={14} />}
              <span>{showBoxes ? 'AI HUD: ON' : 'AI HUD: OFF'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded text-gray-400 hover:text-white hover:bg-gray-800 transition-colors ml-2"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Main Feed */}
          <div className="lg:col-span-2 flex flex-col space-y-3">
            <div className="relative aspect-video rounded overflow-hidden border border-gray-800 bg-black">
              <CCTVCanvas
                cameraId={camera.id}
                roadName={camera.road}
                fps={camera.fps}
                vehicleCount={camera.vehicleCount}
                detections={camera.detections}
                nightVision={nightVision}
                showBoxes={showBoxes}
              />
              
              {/* CCTV HUD Telemetry Overlay */}
              <div className="absolute top-3 left-3 font-mono text-[11px] text-white/90 drop-shadow flex flex-col space-y-1 pointer-events-none bg-black/40 p-2 rounded border border-white/10 backdrop-blur-sm">
                <div>SOURCE: <span className="text-accent font-bold">{camera.id}</span> [CAM-IP: 192.168.10.{camera.id.slice(-2)}]</div>
                <div>RES: <span className="text-gray-300">{camera.resolution}</span></div>
                <div>TIMECODE: <span className="text-online font-bold">{new Date().toLocaleTimeString()}</span></div>
              </div>

              <div className="absolute top-3 right-3 font-mono text-[11px] text-white/90 drop-shadow flex flex-col items-end space-y-1 pointer-events-none bg-black/40 p-2 rounded border border-white/10 backdrop-blur-sm">
                <div>STREAM FPS: <span className="text-accent font-bold">{camera.fps}</span></div>
                <div>OBJECTS: <span className="text-online font-bold">{camera.vehicleCount} VEHICLES</span></div>
                <div>STATUS: <span className="text-emerald-400 font-bold">STABLE</span></div>
              </div>
            </div>

            {/* Camera Pipeline Stats */}
            <div className="grid grid-cols-4 gap-2 pt-1">
              <div className="bg-[#0f172a] border border-gray-800 p-2.5 rounded">
                <div className="text-[10px] text-gray-400 font-mono flex items-center justify-between">
                  <span>YOLOv11 DETECT</span>
                  <Activity size={12} className="text-accent" />
                </div>
                <div className="text-sm font-bold text-white mt-1">98.2% <span className="text-[10px] text-online font-normal">Active</span></div>
              </div>
              <div className="bg-[#0f172a] border border-gray-800 p-2.5 rounded">
                <div className="text-[10px] text-gray-400 font-mono flex items-center justify-between">
                  <span>BYTETRACK MOT</span>
                  <Layers size={12} className="text-telemetry" />
                </div>
                <div className="text-sm font-bold text-white mt-1">96.8% <span className="text-[10px] text-online font-normal">Sync</span></div>
              </div>
              <div className="bg-[#0f172a] border border-gray-800 p-2.5 rounded">
                <div className="text-[10px] text-gray-400 font-mono flex items-center justify-between">
                  <span>PADDLE ANPR</span>
                  <Radio size={12} className="text-warning" />
                </div>
                <div className="text-sm font-bold text-white mt-1">94.1% <span className="text-[10px] text-online font-normal">OCR</span></div>
              </div>
              <div className="bg-[#0f172a] border border-gray-800 p-2.5 rounded">
                <div className="text-[10px] text-gray-400 font-mono flex items-center justify-between">
                  <span>OSNET RE-ID</span>
                  <Cpu size={12} className="text-purple-400" />
                </div>
                <div className="text-sm font-bold text-white mt-1">92.7% <span className="text-[10px] text-online font-normal">Online</span></div>
              </div>
            </div>
          </div>

          {/* Right Column: Tracked Objects List */}
          <div className="flex flex-col space-y-4 bg-[#0a0f1d] border border-panel-border p-4 rounded-lg">
            <div>
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-gray-300 flex items-center justify-between">
                <span>Active Tracked Vehicles</span>
                <span className="text-[11px] font-normal text-accent bg-accent/10 px-2 py-0.5 rounded border border-accent/30 font-mono">
                  {camera.trackedIds.length} ACTIVE
                </span>
              </h4>
              <p className="text-[11px] text-gray-500 mt-1">Real-time local tracking IDs assigned by ByteTrack</p>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[340px]">
              {camera.detections.map(det => (
                <div
                  key={det.id}
                  className="bg-[#121c2e] border border-gray-800 hover:border-accent/60 p-3 rounded transition-all flex flex-col space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-accent text-sm">{det.id}</span>
                    <span className="px-1.5 py-0.5 bg-black/60 rounded text-[10px] font-mono font-bold text-white border border-gray-700">
                      {det.anpr || 'NO OCR'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-400 font-mono">
                    <div>TYPE: <span className="text-gray-200">{det.type} ({det.color})</span></div>
                    <div>CONF: <span className="text-online">{Math.round(det.confidence * 100)}%</span></div>
                    <div>SPEED: <span className="text-white">{det.speed} km/h</span></div>
                    <div>TIME: <span className="text-gray-300">{det.timestamp}</span></div>
                  </div>
                  {onSelectVehicle && (
                    <button
                      onClick={() => {
                        onSelectVehicle(det.id);
                        onClose();
                      }}
                      className="mt-1 w-full py-1.5 bg-accent/20 hover:bg-accent text-accent hover:text-black font-mono font-bold text-[11px] rounded transition-colors flex items-center justify-center space-x-1.5"
                    >
                      <ExternalLink size={12} />
                      <span>Reconstruct Journey</span>
                    </button>
                  )}
                </div>
              ))}

              {camera.trackedIds.filter(id => !camera.detections.some(d => d.id === id)).map(id => (
                <div key={id} className="bg-[#101826] border border-gray-800 p-2.5 rounded text-xs font-mono flex items-center justify-between text-gray-400">
                  <div className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-online"></span>
                    <span className="text-white font-bold">{id}</span>
                    <span className="text-[10px] text-gray-500">• In Transit</span>
                  </div>
                  <span className="text-[10px] text-gray-400">Tracked</span>
                </div>
              ))}
            </div>

            <div className="bg-[#121c2e] border border-panel-border p-3 rounded text-[11px] font-mono text-gray-400 flex items-start space-x-2">
              <ShieldAlert size={16} className="text-warning shrink-0 mt-0.5" />
              <span>Multi-camera Re-ID is actively broadcasting feature embeddings to adjacent nodes.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
