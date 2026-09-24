import React, { useState, useEffect } from 'react';
import CameraCard from '../components/CameraCard';
import SystemStatus from '../components/SystemStatus';
import LiveEvents from '../components/LiveEvents';
import MapAnalytics from '../components/MapAnalytics';
import { CameraStream } from '../types';

const mockCameras: CameraStream[] = [
  { id: 'CAM-01', name: 'NH-44 North', url: 'stream1', status: 'online', fps: 30, vehicleCount: 142 },
  { id: 'CAM-02', name: 'City Center', url: 'stream2', status: 'online', fps: 28, vehicleCount: 89 },
  { id: 'CAM-03', name: 'West Toll Plaza', url: 'stream3', status: 'online', fps: 29, vehicleCount: 201 },
  { id: 'CAM-04', name: 'Industrial Area', url: 'stream4', status: 'offline', fps: 0, vehicleCount: 0 },
];

export default function CommandCenter() {
  const [cameras, setCameras] = useState<CameraStream[]>(mockCameras);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCameras(prev => prev.map(cam => 
        cam.status === 'online' 
          ? { ...cam, fps: Math.floor(25 + Math.random() * 6), vehicleCount: cam.vehicleCount + Math.floor(Math.random() * 3) } 
          : cam
      ));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full flex flex-col space-y-4">
      {/* Top row: Status and Events */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 shrink-0">
        <div className="lg:col-span-3">
          <SystemStatus />
        </div>
        <div className="lg:col-span-1 h-32">
           <LiveEvents limit={3} />
        </div>
      </div>

      {/* Bottom row: Cameras and Map */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 flex-1 min-h-0">
        <div className="lg:col-span-3 grid grid-cols-2 gap-4 h-full overflow-y-auto pr-2">
          {cameras.map(cam => (
            <CameraCard key={cam.id} camera={cam} />
          ))}
        </div>
        <div className="lg:col-span-1 flex flex-col h-full bg-panel border border-gray-800 rounded-lg overflow-hidden">
          <MapAnalytics />
        </div>
      </div>
    </div>
  );
}
