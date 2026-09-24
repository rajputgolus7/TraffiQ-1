import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { CameraStream } from '../types';
import { 
  Navigation, 
  Crosshair, 
  GitFork, 
  Activity, 
  CheckCircle2, 
  RotateCcw, 
  Cpu, 
  Zap, 
  Layers, 
  ShieldCheck 
} from 'lucide-react';

interface MatchEvidence {
  transition: string;
  plate: number;
  type: number;
  color: number;
  visual: number;
  temporal: number;
  spatial: number;
  finalMatch: number;
}

interface MapAnalyticsProps {
  cameras: CameraStream[];
  selectedVehicleId?: string;
  onSelectCamera?: (cameraId: string) => void;
  height?: string;
  isReconstructing?: boolean;
  reconstructionStage?: number; // 0: Idle, 1: Analyzing, 2: CAM-01, 3: CAM-01->CAM-02, 4: CAM-02->CAM-04, 5: Completed
  evidence?: MatchEvidence | null;
  onResetRoute?: () => void;
  onStartReconstruction?: () => void;
}

// High-fidelity road coordinate paths along urban corridors (NH-44 -> GT Road -> Metro Blvd)
const ROAD_PATH_SEGMENT_1: [number, number][] = [
  [77.2090, 28.6139], // CAM-01 (Rajpura Junction)
  [77.2135, 28.6180],
  [77.2180, 28.6235],
  [77.2225, 28.6275],
  [77.2280, 28.6320], // CAM-02 (GT Road Flyover)
];

const ROAD_PATH_SEGMENT_2: [number, number][] = [
  [77.2280, 28.6320], // CAM-02
  [77.2325, 28.6375],
  [77.2370, 28.6435],
  [77.2410, 28.6490],
  [77.2450, 28.6550], // CAM-04 (Metro Terminal Interchange)
];

const FULL_ROAD_PATH = [...ROAD_PATH_SEGMENT_1, ...ROAD_PATH_SEGMENT_2.slice(1)];

export default function MapAnalytics({
  cameras,
  selectedVehicleId = 'V-1027',
  onSelectCamera,
  height = 'h-full min-h-[360px]',
  isReconstructing = false,
  reconstructionStage = 0,
  evidence = null,
  onResetRoute,
  onStartReconstruction,
}: MapAnalyticsProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const vehicleMarkerRef = useRef<maplibregl.Marker | null>(null);
  const [activeSegmentIndex, setActiveSegmentIndex] = useState(0);

  // Initialize MapLibre GL instance
  useEffect(() => {
    if (!mapContainer.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
      center: [77.2280, 28.6320],
      zoom: 12.3,
      attributionControl: false,
    });

    mapRef.current = map;

    map.on('load', () => {
      // 1. Add Trajectory GeoJSON Source (initially empty)
      map.addSource('route-trajectory', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: [],
          },
        },
      });

      // Outer glow line
      map.addLayer({
        id: 'route-glow',
        type: 'line',
        source: 'route-trajectory',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': '#f97316',
          'line-width': 9,
          'line-opacity': 0.4,
        },
      });

      // Core line with animated dash
      map.addLayer({
        id: 'route-core',
        type: 'line',
        source: 'route-trajectory',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': '#f97316',
          'line-width': 3.5,
        },
      });

      // 2. Add Camera Markers
      cameras.forEach((cam) => {
        const el = document.createElement('div');
        el.className = 'group relative cursor-pointer';

        const isHeroCamera = ['CAM-01', 'CAM-02', 'CAM-04'].includes(cam.id);

        el.innerHTML = `
          <div class="relative flex items-center justify-center">
            <span class="animate-ping absolute inline-flex h-6 w-6 rounded-full ${isHeroCamera ? 'bg-orange-500 opacity-60' : 'bg-emerald-500 opacity-30'}"></span>
            <div class="w-4 h-4 rounded-full border-2 ${isHeroCamera ? 'bg-accent border-white shadow-orange-500/50' : 'bg-online border-black'} flex items-center justify-center shadow-lg">
              <div class="w-1.5 h-1.5 rounded-full bg-black"></div>
            </div>
            <div class="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#0b101c] text-white font-mono text-[9px] px-1.5 py-0.5 rounded border border-gray-700 whitespace-nowrap font-bold shadow-md">
              ${cam.id}
            </div>
          </div>
        `;

        el.addEventListener('click', () => {
          if (onSelectCamera) onSelectCamera(cam.id);
        });

        new maplibregl.Marker({ element: el })
          .setLngLat(cam.coordinates)
          .addTo(map);
      });

      // 3. Create Moving Vehicle Marker (hidden initially)
      const vEl = document.createElement('div');
      vEl.className = 'relative flex items-center justify-center pointer-events-none transition-transform duration-300';
      vEl.innerHTML = `
        <div class="w-6 h-6 rounded-full bg-accent border-2 border-white flex items-center justify-center shadow-xl shadow-orange-950/80 animate-pulse">
          <div class="w-2 h-2 rounded-full bg-black"></div>
        </div>
        <div class="absolute -bottom-5 bg-black/90 text-white font-mono text-[8px] font-bold px-1 rounded border border-accent whitespace-nowrap">
          V-1027
        </div>
      `;

      const vMarker = new maplibregl.Marker({ element: vEl })
        .setLngLat(FULL_ROAD_PATH[0]);

      vehicleMarkerRef.current = vMarker;
    });

    return () => {
      map.remove();
    };
  }, [cameras]);

  // Update Dynamic Route Path Based on Reconstruction Stage
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;

    const source = map.getSource('route-trajectory') as maplibregl.GeoJSONSource | undefined;
    if (!source) return;

    let coords: [number, number][] = [];

    if (reconstructionStage <= 1) {
      // Idle / Analyzing -> No route drawn
      coords = [];
      if (vehicleMarkerRef.current) vehicleMarkerRef.current.remove();
    } else if (reconstructionStage === 2) {
      // Node 1 (CAM-01) active
      coords = [ROAD_PATH_SEGMENT_1[0]];
      if (vehicleMarkerRef.current) {
        vehicleMarkerRef.current.setLngLat(ROAD_PATH_SEGMENT_1[0]).addTo(map);
      }
    } else if (reconstructionStage === 3) {
      // Segment 1 (CAM-01 -> CAM-02)
      coords = ROAD_PATH_SEGMENT_1;
      if (vehicleMarkerRef.current) {
        vehicleMarkerRef.current.setLngLat(ROAD_PATH_SEGMENT_1[ROAD_PATH_SEGMENT_1.length - 1]).addTo(map);
      }
    } else if (reconstructionStage >= 4) {
      // Full Route (CAM-01 -> CAM-02 -> CAM-04)
      coords = FULL_ROAD_PATH;
      if (vehicleMarkerRef.current) {
        vehicleMarkerRef.current.setLngLat(FULL_ROAD_PATH[FULL_ROAD_PATH.length - 1]).addTo(map);
      }
    }

    source.setData({
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: coords,
      },
    });
  }, [reconstructionStage]);

  const getPipelineStatusText = () => {
    switch (reconstructionStage) {
      case 1:
        return '● ANALYZING VEHICLE HISTORY...';
      case 2:
        return '● LOCATED INITIAL NODE: CAM-01';
      case 3:
        return '● MATCHING CAMERAS: CAM-01 → CAM-02';
      case 4:
        return '● VALIDATING SPATIAL PATH: CAM-02 → CAM-04';
      case 5:
        return '✓ JOURNEY RECONSTRUCTED';
      default:
        return 'SURVEILLANCE GRID IDLE';
    }
  };

  return (
    <div className={`relative ops-panel rounded-lg overflow-hidden border border-panel-border shadow-md flex flex-col ${height}`}>
      {/* Top Map Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-[#080d18]/95 via-[#080d18]/80 to-transparent p-3 flex justify-between items-start pointer-events-none">
        <div>
          <div className="flex items-center space-x-2">
            <Navigation size={14} className="text-accent" />
            <h3 className="font-mono text-xs font-bold text-white tracking-wider uppercase">
              City GIS Operations & Trajectory Engine
            </h3>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/70 text-gray-300 border border-gray-700">
              CARTOGRAPHIC DARK • SPATIAL GRAPH
            </span>
          </div>
          <div className="text-[10px] font-mono text-gray-400 mt-0.5">
            Real-time Georeferenced Camera Nodes & Corridor Road Paths
          </div>
        </div>

        {/* Dynamic Status / Actions */}
        <div className="flex items-center space-x-2 pointer-events-auto">
          {reconstructionStage === 0 && onStartReconstruction && (
            <button
              onClick={onStartReconstruction}
              className="bg-accent hover:bg-orange-600 text-black font-mono font-bold text-xs px-3 py-1.5 rounded transition-all shadow-md shadow-orange-950/40 flex items-center space-x-1.5"
            >
              <GitFork size={13} />
              <span>RECONSTRUCT JOURNEY</span>
            </button>
          )}

          {reconstructionStage > 0 && onResetRoute && (
            <button
              onClick={onResetRoute}
              className="bg-[#121c2e] hover:bg-gray-800 text-gray-300 hover:text-white font-mono font-bold text-xs px-2.5 py-1.5 rounded border border-gray-700 transition-colors flex items-center space-x-1"
              title="Reset Route Visualization"
            >
              <RotateCcw size={12} />
              <span>RESET ROUTE</span>
            </button>
          )}
        </div>
      </div>

      {/* MapLibre Canvas Container */}
      <div ref={mapContainer} className="w-full h-full bg-[#0a0f1a] flex-1"></div>

      {/* Floating Status HUD: Trajectory Pipeline */}
      {reconstructionStage > 0 && (
        <div className="absolute top-14 left-3 z-10 bg-[#090f1c]/90 backdrop-blur-md border border-accent/60 p-3 rounded-lg font-mono text-xs shadow-2xl space-y-2 min-w-[240px] animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-gray-800 pb-1.5">
            <span className="text-gray-400 text-[10px] uppercase font-bold flex items-center space-x-1">
              <Cpu size={12} className="text-accent" />
              <span>TRAJECTORY PIPELINE</span>
            </span>
            <span className="text-accent font-bold text-[10px]">{selectedVehicleId}</span>
          </div>

          <div className="text-xs font-bold text-white tracking-wide">
            {getPipelineStatusText()}
          </div>

          {/* Stepper Dots */}
          <div className="flex items-center space-x-1.5 pt-1">
            {[1, 2, 3, 4, 5].map((step) => (
              <div
                key={step}
                className={`h-1.5 flex-1 rounded-full transition-all ${
                  reconstructionStage >= step ? 'bg-accent' : 'bg-gray-800'
                }`}
              ></div>
            ))}
          </div>
        </div>
      )}

      {/* Camera Match Evidence Card (Revealed during Segment Matching) */}
      {evidence && reconstructionStage >= 3 && reconstructionStage <= 4 && (
        <div className="absolute top-14 right-3 z-10 bg-[#090f1c]/95 backdrop-blur-md border border-cyan-500/60 p-3 rounded-lg font-mono text-xs shadow-2xl space-y-2 min-w-[250px] animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-gray-800 pb-1.5">
            <span className="text-telemetry font-bold text-[10px] uppercase flex items-center space-x-1">
              <ShieldCheck size={12} className="text-telemetry" />
              <span>RE-ID MATCH EVIDENCE</span>
            </span>
            <span className="bg-cyan-950 text-telemetry font-bold px-1.5 py-0.2 rounded border border-cyan-800 text-[10px]">
              {evidence.transition}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[10px] text-gray-300">
            <div>PLATE: <span className="text-white font-bold">{evidence.plate}%</span></div>
            <div>VEHICLE TYPE: <span className="text-white font-bold">{evidence.type}%</span></div>
            <div>COLOR: <span className="text-white font-bold">{evidence.color}%</span></div>
            <div>VISUAL EMBED: <span className="text-white font-bold">{evidence.visual}%</span></div>
            <div>TEMPORAL: <span className="text-white font-bold">{evidence.temporal}%</span></div>
            <div>SPATIAL: <span className="text-white font-bold">{evidence.spatial}%</span></div>
          </div>

          <div className="pt-1.5 border-t border-gray-800 flex items-center justify-between text-xs">
            <span className="text-gray-400 font-bold">TOTAL MATCH:</span>
            <span className="text-online font-black text-sm">{evidence.finalMatch}%</span>
          </div>
        </div>
      )}

      {/* Bottom Route Summary Banner (Revealed when Route is Completed) */}
      {reconstructionStage === 5 ? (
        <div className="absolute bottom-3 left-3 right-3 z-10 bg-[#0a1120]/95 backdrop-blur-md p-3.5 rounded-lg border border-accent shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono animate-in slide-in-from-bottom duration-300">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded bg-accent text-black font-black">
              <CheckCircle2 size={18} />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-accent font-black tracking-wider uppercase">ROUTE RECONSTRUCTED:</span>
                <span className="text-white font-black">{selectedVehicleId}</span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-200 font-bold">CAM-01 → CAM-02 → CAM-04</span>
              </div>
              <div className="text-[10px] text-gray-400 mt-0.5">
                Multi-camera spatial trajectory confirmed along NH-44 Northbound Corridor
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-[9px] text-gray-500 uppercase font-semibold">RE-ID CONF</div>
              <div className="text-online font-black text-sm">93.4%</div>
            </div>
            <div className="text-right">
              <div className="text-[9px] text-gray-500 uppercase font-semibold">DISTANCE</div>
              <div className="text-white font-black text-sm">3.8 KM</div>
            </div>
            <div className="text-right">
              <div className="text-[9px] text-gray-500 uppercase font-semibold">TRAVEL TIME</div>
              <div className="text-accent font-black text-sm">04:37</div>
            </div>
            <div className="text-right">
              <div className="text-[9px] text-gray-500 uppercase font-semibold">AVG SPEED</div>
              <div className="text-yellow-400 font-black text-sm">42 KM/H</div>
            </div>
          </div>
        </div>
      ) : reconstructionStage === 0 ? (
        /* Idle Prompt */
        <div className="absolute bottom-3 left-3 z-10 bg-[#080d18]/85 backdrop-blur-md px-3 py-1.5 rounded border border-panel-border text-[11px] font-mono text-gray-400 flex items-center space-x-2 pointer-events-none">
          <span className="w-2 h-2 rounded-full bg-online animate-pulse"></span>
          <span>Click <strong>RECONSTRUCT JOURNEY</strong> to trigger real-time multi-camera path synthesis</span>
        </div>
      ) : null}
    </div>
  );
}
