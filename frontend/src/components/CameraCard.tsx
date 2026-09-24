import { useState } from 'react';
import { CameraStream } from '../types';
import CCTVCanvas from './CCTVCanvas';
import { Video, Activity, Maximize2, Crosshair } from 'lucide-react';
import CameraModal from './CameraModal';

interface Props {
  camera: CameraStream;
  onSelectVehicle?: (vehicleId: string) => void;
}

export default function CameraCard({ camera, onSelectVehicle }: Props) {
  const [showModal, setShowModal] = useState(false);
  const isOnline = camera.status === 'online';

  return (
    <>
      <div 
        onClick={() => setShowModal(true)}
        className="group relative ops-panel rounded-lg overflow-hidden border border-panel-border hover:border-accent/60 transition-all duration-200 cursor-pointer flex flex-col h-full min-h-[220px] shadow-lg hover:shadow-orange-950/20"
      >
        {/* Camera Header Bar */}
        <div className="bg-[#0b101a]/90 border-b border-panel-border px-3 py-2 flex items-center justify-between z-10">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-online animate-pulse"></span>
            <span className="font-mono text-xs font-bold text-accent">{camera.id}</span>
            <span className="text-gray-500 text-xs">|</span>
            <span className="text-xs font-semibold text-gray-200 truncate max-w-[140px]">{camera.name}</span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono text-gray-400 bg-black/50 px-1.5 py-0.5 rounded border border-gray-800">
              {camera.fps} FPS
            </span>
            <button 
              className="text-gray-400 hover:text-white p-1 rounded hover:bg-gray-800/80 transition-colors"
              title="Expand Camera"
            >
              <Maximize2 size={13} />
            </button>
          </div>
        </div>

        {/* Live Canvas Viewport */}
        <div className="flex-1 bg-black relative overflow-hidden flex items-center justify-center">
          {isOnline ? (
            <div className="w-full h-full relative">
              <CCTVCanvas
                cameraId={camera.id}
                roadName={camera.road}
                fps={camera.fps}
                vehicleCount={camera.vehicleCount}
                detections={camera.detections}
              />

              {/* CCTV HUD Timestamp Overlay */}
              <div className="absolute top-2 left-2 font-mono text-[9px] text-white/80 bg-black/60 px-1.5 py-0.5 rounded border border-white/10 pointer-events-none backdrop-blur-sm">
                REC • {new Date().toLocaleTimeString()}
              </div>

              {/* AI Detection Active Tag */}
              <div className="absolute bottom-2 left-2 flex items-center space-x-1 font-mono text-[9px] text-online bg-black/70 px-1.5 py-0.5 rounded border border-online/30 pointer-events-none">
                <Crosshair size={10} className="animate-spin text-accent" />
                <span>AI DETECTION ACTIVE</span>
              </div>

              {/* Vehicle Count Pill */}
              <div className="absolute bottom-2 right-2 font-mono text-[9px] text-white bg-black/70 px-2 py-0.5 rounded border border-gray-700 pointer-events-none">
                <span className="text-accent font-bold">{camera.vehicleCount}</span> VEHICLES
              </div>
            </div>
          ) : (
            <div className="text-gray-600 flex flex-col items-center p-6">
              <Video size={28} className="mb-1 text-alert opacity-60" />
              <span className="text-xs font-mono font-bold text-alert">NO SIGNAL / DISCONNECTED</span>
            </div>
          )}
        </div>

        {/* Sub-footer Road Info */}
        <div className="bg-[#090e18] px-3 py-1.5 border-t border-panel-border/80 flex items-center justify-between text-[10px] font-mono text-gray-400">
          <span className="truncate max-w-[180px]">{camera.road}</span>
          <span className="text-telemetry font-bold">{camera.resolution}</span>
        </div>
      </div>

      {showModal && (
        <CameraModal
          camera={camera}
          onClose={() => setShowModal(false)}
          onSelectVehicle={onSelectVehicle}
        />
      )}
    </>
  );
}
