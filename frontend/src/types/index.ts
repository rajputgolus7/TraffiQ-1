export interface VehicleDetection {
  id: string;
  type: string;
  confidence: number;
  bbox: [number, number, number, number];
  anpr?: string;
  timestamp: string;
}

export interface CameraStream {
  id: string;
  name: string;
  url: string;
  status: 'online' | 'offline';
  fps: number;
  vehicleCount: number;
}

export interface SystemStatus {
  activeCameras: number;
  totalVehicles: number;
  alerts: number;
  serverStatus: 'online' | 'offline';
}

export interface EventLog {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'warning' | 'alert';
}
