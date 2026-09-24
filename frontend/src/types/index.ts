export type CameraStatus = 'online' | 'offline' | 'degraded';
export type AlertSeverity = 'critical' | 'high' | 'medium' | 'info';

export interface VehicleDetection {
  id: string;
  type: 'SEDAN' | 'SUV' | 'TRUCK' | 'BUS' | 'MOTORCYCLE';
  confidence: number;
  bbox: [number, number, number, number]; // [x, y, width, height] in %
  anpr?: string;
  anprConfidence?: number;
  color: string;
  speed: number;
  timestamp: string;
}

export interface CameraStream {
  id: string;
  name: string;
  location: string;
  road: string;
  url: string;
  status: CameraStatus;
  fps: number;
  vehicleCount: number;
  coordinates: [number, number]; // [lng, lat]
  resolution: string;
  trackedIds: string[];
  detections: VehicleDetection[];
}

export interface SystemKPIs {
  activeCameras: number;
  totalCameras: number;
  activeVehicles: number;
  trackedJourneys: number;
  activeAlerts: number;
  avgSpeedKmh: number;
  trafficLoadPct: number;
}

export interface AITelemetry {
  detectionAccuracy: number;
  trackingAccuracy: number;
  anprAccuracy: number;
  reidAccuracy: number;
  inferenceFps: number;
  activeStreams: number;
  uptimeSeconds: number;
  apiLatencyMs: number;
}

export interface IntelligenceEvent {
  id: string;
  timestamp: string;
  type: 'DETECTION' | 'ANPR' | 'CROSS_CAMERA_MATCH' | 'TRAJECTORY' | 'ALERT';
  vehicleId: string;
  plate?: string;
  camera: string;
  targetCamera?: string;
  confidence?: number;
  message: string;
  severity?: AlertSeverity;
  distanceKm?: number;
  timeGapSec?: number;
}

export interface JourneyStop {
  cameraId: string;
  cameraName: string;
  timestamp: string;
  confidence: number;
  speedKmh: number;
  transitTimeSec?: number;
  imageCrop?: string;
  plate: string;
}

export interface VehicleProfile {
  id: string;
  plate: string;
  type: string;
  color: string;
  firstSeen: string;
  lastSeen: string;
  camerasCount: number;
  distanceKm: number;
  avgSpeedKmh: number;
  reidConfidence: number;
  currentCamera: string;
  status: 'WATCHLIST' | 'NORMAL' | 'SPEED_VIOLATION' | 'UNUSUAL_ROUTE';
  journey: JourneyStop[];
}

export interface TrafficAlert {
  id: string;
  vehicleId: string;
  plate?: string;
  type: string;
  camera: string;
  timestamp: string;
  confidence: number;
  severity: AlertSeverity;
  message: string;
  actionRequired?: string;
}

export interface EventLog {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'warning' | 'alert';
}
