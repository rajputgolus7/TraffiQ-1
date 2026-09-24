import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { CameraStream } from '../types';
import { Layers, Crosshair, Navigation, AlertTriangle, ShieldCheck } from 'lucide-react';

interface MapAnalyticsProps {
  cameras: CameraStream[];
  selectedVehicleId?: string;
  onSelectCamera?: (cameraId: string) => void;
  height?: string;
}

export default function MapAnalytics({
  cameras,
  selectedVehicleId = 'V-1027',
  onSelectCamera,
  height = 'h-full min-h-[300px]',
}: MapAnalyticsProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [showTrajectory, setShowTrajectory] = useState(true);
  const [showCongestion, setShowCongestion] = useState(true);

  // Nodes for V-1027 journey: CAM-01 -> CAM-02 -> CAM-04
  const trajectoryCoords = [
    [77.2090, 28.6139], // CAM-01
    [77.2280, 28.6320], // CAM-02
    [77.2450, 28.6550], // CAM-04
  ];

  useEffect(() => {
    if (!mapContainer.current) return;

    // Use dark Carto basemap
    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
      center: [77.2280, 28.6320],
      zoom: 12.2,
      attributionControl: false,
    });

    mapRef.current = map;

    map.on('load', () => {
      // 1. Add Trajectory Line GeoJSON Source
      map.addSource('route-trajectory', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: trajectoryCoords,
          },
        },
      });

      // Outer glow line
      map.addLayer({
        id: 'route-glow',
        type: 'line',
        source: 'route-trajectory',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#f97316',
          'line-width': 8,
          'line-opacity': 0.35,
        },
      });

      // Core line
      map.addLayer({
        id: 'route-core',
        type: 'line',
        source: 'route-trajectory',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#f97316',
          'line-width': 3,
          'line-dasharray': [2, 1],
        },
      });

      // 2. Add Camera Markers
      cameras.forEach((cam) => {
        const el = document.createElement('div');
        el.className = 'group relative cursor-pointer';

        const isTrajectoryNode = ['CAM-01', 'CAM-02', 'CAM-04'].includes(cam.id);
        const markerColor = isTrajectoryNode ? 'bg-accent border-white' : 'bg-online border-black';

        el.innerHTML = `
          <div class="relative flex items-center justify-center">
            <span class="animate-ping absolute inline-flex h-6 w-6 rounded-full ${isTrajectoryNode ? 'bg-accent opacity-50' : 'bg-online opacity-30'}"></span>
            <div class="w-4 h-4 rounded-full border-2 ${markerColor} flex items-center justify-center shadow-lg">
              <div class="w-1.5 h-1.5 rounded-full bg-black"></div>
            </div>
            <div class="absolute -top-6 left-1/2 -translate-x-1/2 bg-black/85 text-white font-mono text-[9px] px-1.5 py-0.5 rounded border border-gray-700 whitespace-nowrap font-bold">
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
    });

    return () => {
      map.remove();
    };
  }, [cameras]);

  return (
    <div className={`relative ops-panel rounded-lg overflow-hidden border border-panel-border shadow-md flex flex-col ${height}`}>
      {/* Map Header Overlay */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-[#080d18]/95 via-[#080d18]/80 to-transparent p-3 flex justify-between items-start pointer-events-none">
        <div>
          <div className="flex items-center space-x-2">
            <Navigation size={14} className="text-accent" />
            <h3 className="font-mono text-xs font-bold text-white tracking-wider uppercase">
              City GIS Operations & Trajectory Engine
            </h3>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/70 text-gray-300 border border-gray-700">
              OPENSTREETMAP / CARTODB
            </span>
          </div>
          <div className="text-[10px] font-mono text-gray-400 mt-0.5">
            Active Grid: 12 Surveillance Nodes • Multi-Camera Spatial Graph
          </div>
        </div>

        {/* Layer Controls */}
        <div className="flex items-center space-x-1.5 pointer-events-auto">
          <button
            onClick={() => setShowTrajectory(!showTrajectory)}
            className={`px-2 py-1 rounded text-[10px] font-mono font-bold border transition-colors ${
              showTrajectory
                ? 'bg-accent/20 text-accent border-accent/60'
                : 'bg-black/60 text-gray-400 border-gray-800'
            }`}
          >
            TRAJECTORY
          </button>
          <button
            onClick={() => setShowCongestion(!showCongestion)}
            className={`px-2 py-1 rounded text-[10px] font-mono font-bold border transition-colors ${
              showCongestion
                ? 'bg-telemetry/20 text-telemetry border-telemetry/60'
                : 'bg-black/60 text-gray-400 border-gray-800'
            }`}
          >
            DENSITY
          </button>
        </div>
      </div>

      {/* MapLibre Map Container */}
      <div ref={mapContainer} className="w-full h-full bg-[#0a0f1a] flex-1"></div>

      {/* Bottom Reconstructed Trajectory Banner */}
      <div className="absolute bottom-3 left-3 right-3 z-10 bg-[#0a1120]/90 backdrop-blur-md p-3 rounded-lg border border-accent/40 shadow-xl flex items-center justify-between text-xs font-mono">
        <div className="flex items-center space-x-3">
          <div className="p-1.5 rounded bg-accent/20 text-accent border border-accent/40">
            <Crosshair size={16} />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-white font-bold tracking-wider">ROUTE RECONSTRUCTED:</span>
              <span className="text-accent font-bold">{selectedVehicleId}</span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-300 font-semibold">CAM-01 → CAM-02 → CAM-04</span>
            </div>
            <div className="text-[10px] text-gray-400 mt-0.5">
              Corridor: NH-44 Northbound to Metro Terminal Bypass
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-[9px] text-gray-500 uppercase">MATCH CONF</div>
            <div className="text-online font-bold text-sm">94.2%</div>
          </div>
          <div className="text-right">
            <div className="text-[9px] text-gray-500 uppercase">DISTANCE</div>
            <div className="text-white font-bold text-sm">3.8 KM</div>
          </div>
          <div className="text-right">
            <div className="text-[9px] text-gray-500 uppercase">AVG SPEED</div>
            <div className="text-yellow-400 font-bold text-sm">42 KM/H</div>
          </div>
        </div>
      </div>
    </div>
  );
}
