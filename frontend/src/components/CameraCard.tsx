import React from 'react';
import { CameraStream } from '../types';
import { Video, VideoOff, Activity } from 'lucide-react';

interface Props {
  camera: CameraStream;
}

export default function CameraCard({ camera }: Props) {
  const isOnline = camera.status === 'online';

  return (
    <div className="bg-panel border border-gray-800 rounded-lg overflow-hidden flex flex-col h-64 relative group">
      {/* Camera Header */}
      <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent p-3 z-10 flex justify-between items-start">
        <div>
          <div className="text-sm font-semibold flex items-center space-x-2">
            {isOnline ? <Video size={14} className="text-online" /> : <VideoOff size={14} className="text-alert" />}
            <span>{camera.id} - {camera.name}</span>
          </div>
          <div className="text-xs text-gray-400 mt-1">{new Date().toLocaleTimeString()}</div>
        </div>
        <div className="flex flex-col items-end">
          {isOnline && (
             <div className="flex items-center space-x-1 text-xs bg-black/50 px-2 py-1 rounded border border-gray-700">
               <Activity size={12} className="text-accent" />
               <span>{camera.fps} FPS</span>
             </div>
          )}
        </div>
      </div>

      {/* Video Feed Simulation */}
      <div className="flex-1 bg-black relative flex items-center justify-center">
        {!isOnline ? (
          <div className="text-gray-600 flex flex-col items-center">
            <VideoOff size={32} className="mb-2" />
            <span className="text-sm font-medium">NO SIGNAL</span>
          </div>
        ) : (
          <div className="w-full h-full relative overflow-hidden">
            {/* Simulated Grid overlay */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA0MCAwIEwgMCAwIDAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIiAvPjwvc3ZnPg==')] pointer-events-none opacity-50"></div>
            
            {/* Simulated Detection Box */}
            {camera.id === 'CAM-01' && (
              <div className="absolute top-[30%] left-[40%] w-24 h-20 border-2 border-accent bg-accent/10">
                <div className="absolute -top-5 left-[-2px] bg-accent text-black text-[10px] font-bold px-1 whitespace-nowrap">
                  SEDAN 94%
                </div>
                <div className="absolute -bottom-5 left-[-2px] bg-white text-black text-[10px] font-bold px-1 whitespace-nowrap border border-black">
                  PB10XX1234
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer Stats */}
      {isOnline && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 z-10 flex justify-between items-end">
          <div className="text-xs text-gray-300">
            Vehicles detected: <span className="text-white font-bold">{camera.vehicleCount}</span>
          </div>
          <div className="w-2 h-2 rounded-full bg-online animate-pulse"></div>
        </div>
      )}
    </div>
  );
}
