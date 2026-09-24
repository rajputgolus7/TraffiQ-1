import { CameraStream, SystemKPIs, AITelemetry, IntelligenceEvent, VehicleProfile, TrafficAlert } from '../types';

export const INITIAL_KPIS: SystemKPIs = {
  activeCameras: 12,
  totalCameras: 12,
  activeVehicles: 847,
  trackedJourneys: 6421,
  activeAlerts: 23,
  avgSpeedKmh: 38.4,
  trafficLoadPct: 72,
};

export const INITIAL_TELEMETRY: AITelemetry = {
  detectionAccuracy: 98.2,
  trackingAccuracy: 96.8,
  anprAccuracy: 94.1,
  reidAccuracy: 92.7,
  inferenceFps: 24.6,
  activeStreams: 4,
  uptimeSeconds: 15697, // 04:21:37
  apiLatencyMs: 42,
};

export const INITIAL_CAMERAS: CameraStream[] = [
  {
    id: 'CAM-01',
    name: 'Rajpura Junction',
    location: 'Sector 3 Intersection',
    road: 'NH-44 Northbound Corridor',
    url: 'stream1',
    status: 'online',
    fps: 29.4,
    vehicleCount: 23,
    coordinates: [77.2090, 28.6139],
    resolution: '1080P • 60Hz',
    trackedIds: ['V-1027', 'V-3109', 'V-1188', 'V-2004'],
    detections: [
      {
        id: 'V-1027',
        type: 'SEDAN',
        confidence: 0.96,
        bbox: [32, 42, 28, 22],
        anpr: 'PB10XX1234',
        anprConfidence: 0.94,
        color: 'WHITE',
        speed: 42,
        timestamp: '13:42:21'
      }
    ]
  },
  {
    id: 'CAM-02',
    name: 'GT Road Flyover',
    location: 'Central Arterial Overpass',
    road: 'GT Expressway Mile 14',
    url: 'stream2',
    status: 'online',
    fps: 28.8,
    vehicleCount: 31,
    coordinates: [77.2280, 28.6320],
    resolution: '1080P • 60Hz',
    trackedIds: ['V-1027', 'V-4890', 'V-9122'],
    detections: [
      {
        id: 'V-1027',
        type: 'SEDAN',
        confidence: 0.94,
        bbox: [45, 52, 26, 20],
        anpr: 'PB10XX1234',
        anprConfidence: 0.93,
        color: 'WHITE',
        speed: 46,
        timestamp: '13:42:48'
      }
    ]
  },
  {
    id: 'CAM-03',
    name: 'Industrial Tollway',
    location: 'West Cargo Checkpoint',
    road: 'Freight Corridor Bypass',
    url: 'stream3',
    status: 'online',
    fps: 29.1,
    vehicleCount: 19,
    coordinates: [77.1850, 28.5840],
    resolution: '1080P • 60Hz',
    trackedIds: ['V-2041', 'V-5120', 'V-7711'],
    detections: [
      {
        id: 'V-2041',
        type: 'SUV',
        confidence: 0.91,
        bbox: [28, 38, 32, 26],
        anpr: 'HR26DK8899',
        anprConfidence: 0.91,
        color: 'BLACK',
        speed: 54,
        timestamp: '13:47:12'
      }
    ]
  },
  {
    id: 'CAM-04',
    name: 'Metro Terminal Interchange',
    location: 'Transit Hub Plaza',
    road: 'Outer Ring Boulevard',
    url: 'stream4',
    status: 'online',
    fps: 29.7,
    vehicleCount: 42,
    coordinates: [77.2450, 28.6550],
    resolution: '1080P • 60Hz',
    trackedIds: ['V-1027', 'V-6602', 'V-8831', 'V-9910'],
    detections: [
      {
        id: 'V-1027',
        type: 'SEDAN',
        confidence: 0.95,
        bbox: [38, 48, 27, 21],
        anpr: 'PB10XX1234',
        anprConfidence: 0.95,
        color: 'WHITE',
        speed: 39,
        timestamp: '13:44:15'
      }
    ]
  },
  {
    id: 'CAM-05',
    name: 'Sector 14 Ring Road',
    location: 'Residential Collector Junction',
    road: 'Inner Ring Road East',
    url: 'stream5',
    status: 'online',
    fps: 28.4,
    vehicleCount: 16,
    coordinates: [77.2150, 28.5990],
    resolution: '1080P • 60Hz',
    trackedIds: ['V-3109', 'V-5511'],
    detections: []
  },
  {
    id: 'CAM-06',
    name: 'Northern Freight Gate',
    location: 'Logistics Park Gate 2',
    road: 'Industrial Ring Highway',
    url: 'stream6',
    status: 'online',
    fps: 30.0,
    vehicleCount: 28,
    coordinates: [77.2600, 28.6750],
    resolution: '1080P • 60Hz',
    trackedIds: ['V-5120', 'V-6101', 'V-7023'],
    detections: []
  }
];

export const INITIAL_EVENTS: IntelligenceEvent[] = [
  {
    id: 'evt-01',
    timestamp: '13:42:21',
    type: 'DETECTION',
    vehicleId: 'V-1027',
    camera: 'CAM-01',
    confidence: 0.96,
    message: 'Vehicle detected at Rajpura Junction entering northbound lane.'
  },
  {
    id: 'evt-02',
    timestamp: '13:42:24',
    type: 'ANPR',
    vehicleId: 'V-1027',
    plate: 'PB10XX1234',
    camera: 'CAM-01',
    confidence: 0.94,
    message: 'ANPR identification verified: PB10XX1234 (Confidence: 94%).'
  },
  {
    id: 'evt-03',
    timestamp: '13:42:48',
    type: 'CROSS_CAMERA_MATCH',
    vehicleId: 'V-1027',
    camera: 'CAM-01',
    targetCamera: 'CAM-02',
    confidence: 0.942,
    timeGapSec: 27,
    message: 'CROSS-CAMERA MATCH: V-1027 associated from CAM-01 → CAM-02 in 27s.'
  },
  {
    id: 'evt-04',
    timestamp: '13:43:13',
    type: 'TRAJECTORY',
    vehicleId: 'V-1027',
    camera: 'CAM-02',
    targetCamera: 'CAM-04',
    distanceKm: 3.8,
    message: 'Trajectory corridor confirmed along GT Expressway (Est. Distance: 3.8 km).'
  },
  {
    id: 'evt-05',
    timestamp: '13:44:02',
    type: 'ALERT',
    vehicleId: 'V-2041',
    plate: 'HR26DK8899',
    camera: 'CAM-03',
    confidence: 0.91,
    severity: 'critical',
    message: 'CRITICAL ALERT: Priority watchlist target V-2041 flagged at Industrial Tollway.'
  },
  {
    id: 'evt-06',
    timestamp: '13:44:15',
    type: 'CROSS_CAMERA_MATCH',
    vehicleId: 'V-1027',
    camera: 'CAM-02',
    targetCamera: 'CAM-04',
    confidence: 0.938,
    timeGapSec: 87,
    message: 'Journey node confirmed at Metro Terminal Interchange (CAM-04).'
  },
  {
    id: 'evt-07',
    timestamp: '13:45:01',
    type: 'ANPR',
    vehicleId: 'V-3109',
    plate: 'DL01AB9921',
    camera: 'CAM-02',
    confidence: 0.96,
    message: 'ANPR extraction: DL01AB9921 @ GT Road Flyover.'
  }
];

export const INITIAL_VEHICLES: VehicleProfile[] = [
  {
    id: 'V-1027',
    plate: 'PB10XX1234',
    type: 'SEDAN',
    color: 'WHITE',
    firstSeen: '13:42:21',
    lastSeen: '13:46:58',
    camerasCount: 3,
    distanceKm: 3.8,
    avgSpeedKmh: 42.0,
    reidConfidence: 94.2,
    currentCamera: 'CAM-04',
    status: 'NORMAL',
    journey: [
      {
        cameraId: 'CAM-01',
        cameraName: 'Rajpura Junction',
        timestamp: '13:42:21',
        confidence: 0.96,
        speedKmh: 38,
        plate: 'PB10XX1234'
      },
      {
        cameraId: 'CAM-02',
        cameraName: 'GT Road Flyover',
        timestamp: '13:42:48',
        confidence: 0.94,
        speedKmh: 46,
        transitTimeSec: 27,
        plate: 'PB10XX1234'
      },
      {
        cameraId: 'CAM-04',
        cameraName: 'Metro Terminal Interchange',
        timestamp: '13:44:15',
        confidence: 0.95,
        speedKmh: 41,
        transitTimeSec: 87,
        plate: 'PB10XX1234'
      }
    ]
  },
  {
    id: 'V-2041',
    plate: 'HR26DK8899',
    type: 'SUV',
    color: 'BLACK',
    firstSeen: '13:40:10',
    lastSeen: '13:47:12',
    camerasCount: 2,
    distanceKm: 2.1,
    avgSpeedKmh: 54.0,
    reidConfidence: 91.0,
    currentCamera: 'CAM-03',
    status: 'WATCHLIST',
    journey: [
      {
        cameraId: 'CAM-05',
        cameraName: 'Sector 14 Ring Road',
        timestamp: '13:40:10',
        confidence: 0.89,
        speedKmh: 52,
        plate: 'HR26DK8899'
      },
      {
        cameraId: 'CAM-03',
        cameraName: 'Industrial Tollway',
        timestamp: '13:47:12',
        confidence: 0.91,
        speedKmh: 54,
        transitTimeSec: 422,
        plate: 'HR26DK8899'
      }
    ]
  },
  {
    id: 'V-3109',
    plate: 'DL01AB9921',
    type: 'SEDAN',
    color: 'SILVER',
    firstSeen: '13:38:05',
    lastSeen: '13:45:01',
    camerasCount: 2,
    distanceKm: 2.9,
    avgSpeedKmh: 36.5,
    reidConfidence: 95.8,
    currentCamera: 'CAM-02',
    status: 'NORMAL',
    journey: [
      {
        cameraId: 'CAM-01',
        cameraName: 'Rajpura Junction',
        timestamp: '13:38:05',
        confidence: 0.95,
        speedKmh: 35,
        plate: 'DL01AB9921'
      },
      {
        cameraId: 'CAM-02',
        cameraName: 'GT Road Flyover',
        timestamp: '13:45:01',
        confidence: 0.96,
        speedKmh: 38,
        transitTimeSec: 416,
        plate: 'DL01AB9921'
      }
    ]
  },
  {
    id: 'V-4890',
    plate: 'CH01TC5512',
    type: 'BUS',
    color: 'YELLOW',
    firstSeen: '13:30:15',
    lastSeen: '13:43:20',
    camerasCount: 3,
    distanceKm: 5.2,
    avgSpeedKmh: 28.0,
    reidConfidence: 97.1,
    currentCamera: 'CAM-02',
    status: 'NORMAL',
    journey: []
  },
  {
    id: 'V-5120',
    plate: 'UP16BZ7733',
    type: 'TRUCK',
    color: 'BLUE',
    firstSeen: '13:25:00',
    lastSeen: '13:46:10',
    camerasCount: 2,
    distanceKm: 4.6,
    avgSpeedKmh: 32.0,
    reidConfidence: 93.4,
    currentCamera: 'CAM-06',
    status: 'NORMAL',
    journey: []
  }
];

export const INITIAL_ALERTS: TrafficAlert[] = [
  {
    id: 'ALT-101',
    vehicleId: 'V-2041',
    plate: 'HR26DK8899',
    type: 'PRIORITY WATCHLIST TARGET',
    camera: 'CAM-03',
    timestamp: '13:47:12',
    confidence: 0.91,
    severity: 'critical',
    message: 'Vehicle V-2041 on Municipal Stolen/Suspicious Watchlist detected at West Cargo Checkpoint.',
    actionRequired: 'Dispatch Intercept Unit to Exit Gate 4'
  },
  {
    id: 'ALT-102',
    vehicleId: 'V-1027',
    plate: 'PB10XX1234',
    type: 'CROSS-CAMERA VELOCITY ANOMALY',
    camera: 'CAM-02',
    timestamp: '13:42:48',
    confidence: 0.94,
    severity: 'high',
    message: 'Transit between CAM-01 and CAM-02 completed in 27s, exceeding designated 60 km/h velocity bound.',
    actionRequired: 'Log Speed Violation Citation'
  },
  {
    id: 'ALT-103',
    vehicleId: 'V-8831',
    type: 'UNAUTHORIZED ACCESS / NO PLATE',
    camera: 'CAM-04',
    timestamp: '13:41:05',
    confidence: 0.88,
    severity: 'high',
    message: 'Commercial heavy vehicle entered Bus Transit Corridor without valid commercial plate recognition.',
    actionRequired: 'Automated Lane Gate Lockout'
  },
  {
    id: 'ALT-104',
    vehicleId: 'N/A',
    type: 'CONGESTION THRESHOLD EXCEEDED',
    camera: 'CAM-04',
    timestamp: '13:43:50',
    confidence: 0.97,
    severity: 'medium',
    message: 'Corridor density surpassed 85 vehicles/minute at Metro Terminal Interchange.',
    actionRequired: 'Adjust Signal Cycle to 90s Green'
  },
  {
    id: 'ALT-105',
    vehicleId: 'N/A',
    type: 'EDGE VISION PIPELINE RE-INDEX',
    camera: 'SYSTEM',
    timestamp: '13:30:00',
    confidence: 1.0,
    severity: 'info',
    message: 'Vehicle appearance feature index updated with 12,400 embeddings across 12 edge nodes.',
    actionRequired: 'None'
  }
];

export const HOURLY_TRAFFIC_DATA = [
  { time: '08:00', volume: 640, speed: 45, density: 42 },
  { time: '09:00', volume: 1180, speed: 32, density: 78 },
  { time: '10:00', volume: 1420, speed: 28, density: 88 },
  { time: '11:00', volume: 980, speed: 36, density: 64 },
  { time: '12:00', volume: 890, speed: 40, density: 55 },
  { time: '13:00', volume: 847, speed: 38.4, density: 72 },
  { time: '14:00', volume: 920, speed: 39, density: 68 },
];

export const VEHICLE_TYPE_DISTRIBUTION = [
  { name: 'Sedans', value: 48, color: '#f97316' },
  { name: 'SUVs', value: 24, color: '#06b6d4' },
  { name: 'Trucks / Freight', value: 14, color: '#8b5cf6' },
  { name: 'Public Buses', value: 8, color: '#10b981' },
  { name: 'Two-Wheelers', value: 6, color: '#f59e0b' },
];

export const CORRIDOR_SPEED_DATA = [
  { corridor: 'NH-44 North', avgSpeed: 48, targetSpeed: 60, status: 'Optimal' },
  { corridor: 'GT Expressway', avgSpeed: 36, targetSpeed: 50, status: 'Moderate' },
  { corridor: 'West Industrial', avgSpeed: 52, targetSpeed: 60, status: 'Optimal' },
  { corridor: 'Metro Terminal', avgSpeed: 24, targetSpeed: 40, status: 'Congested' },
  { corridor: 'Ring Road East', avgSpeed: 38, targetSpeed: 50, status: 'Moderate' },
];
