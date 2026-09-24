import { useState, useEffect, useRef } from 'react';
import CameraCard from '../components/CameraCard';
import KPITelemetryStrip from '../components/KPITelemetryStrip';
import AITelemetryPanel from '../components/AITelemetryPanel';
import LiveEventsFeed from '../components/LiveEventsFeed';
import VehicleQuickInspector from '../components/VehicleQuickInspector';
import MapAnalytics from '../components/MapAnalytics';
import { 
  INITIAL_CAMERAS, 
  INITIAL_KPIS, 
  INITIAL_TELEMETRY, 
  INITIAL_EVENTS, 
  INITIAL_VEHICLES 
} from '../data/mockData';
import { CameraStream, VehicleProfile, IntelligenceEvent } from '../types';
import { Radio, Sparkles, RotateCcw, GitFork, Maximize2, Minimize2 } from 'lucide-react';

export default function CommandCenter() {
  const [cameras, setCameras] = useState<CameraStream[]>(INITIAL_CAMERAS.slice(0, 4));
  const [kpis] = useState(INITIAL_KPIS);
  const [telemetry] = useState(INITIAL_TELEMETRY);
  const [events, setEvents] = useState<IntelligenceEvent[]>(INITIAL_EVENTS);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleProfile>(INITIAL_VEHICLES[0]);
  const [wallLayout, setWallLayout] = useState<'2x2' | '3x2'>('2x2');

  // Dynamic Route Reconstruction State
  const [isReconstructing, setIsReconstructing] = useState(false);
  const [reconstructionStage, setReconstructionStage] = useState(0); // 0: Idle, 1: Analyzing, 2: CAM-01, 3: CAM-01->02, 4: CAM-02->04, 5: Completed
  const [evidence, setEvidence] = useState<any>(null);
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const timerRef = useRef<any>(null);

  const handleSelectVehicle = (vehicleId: string) => {
    const found = INITIAL_VEHICLES.find(v => v.id === vehicleId);
    if (found) {
      setSelectedVehicle(found);
    }
  };

  // Start the interactive Route Reconstruction sequence (takes ~4.8 seconds total)
  const startRouteReconstruction = () => {
    if (isReconstructing) return;
    setIsReconstructing(true);
    setReconstructionStage(1);
    setIsMapExpanded(true); // Smoothly make map the hero
    setEvidence(null);

    // Stage 1 -> 2: (1.0s) Located CAM-01
    timerRef.current = setTimeout(() => {
      setReconstructionStage(2);

      // Append live event
      setEvents(prev => [
        {
          id: `evt-${Date.now()}-1`,
          timestamp: new Date().toLocaleTimeString(),
          type: 'DETECTION',
          vehicleId: 'V-1027',
          camera: 'CAM-01',
          confidence: 0.96,
          message: 'Historical node resolved: V-1027 (PB10XX1234) at CAM-01.'
        },
        ...prev
      ]);

      // Stage 2 -> 3: (1.3s) Segment 1 (CAM-01 -> CAM-02)
      timerRef.current = setTimeout(() => {
        setReconstructionStage(3);
        setEvidence({
          transition: 'CAM-01 → CAM-02',
          plate: 96,
          type: 99,
          color: 94,
          visual: 91,
          temporal: 95,
          spatial: 93,
          finalMatch: 94
        });

        setEvents(prev => [
          {
            id: `evt-${Date.now()}-2`,
            timestamp: new Date().toLocaleTimeString(),
            type: 'CROSS_CAMERA_MATCH',
            vehicleId: 'V-1027',
            camera: 'CAM-01',
            targetCamera: 'CAM-02',
            confidence: 0.942,
            timeGapSec: 27,
            message: 'CROSS-CAMERA MATCH: V-1027 associated CAM-01 → CAM-02 in 27s (94% Match).'
          },
          ...prev
        ]);

        // Stage 3 -> 4: (1.3s) Segment 2 (CAM-02 -> CAM-04)
        timerRef.current = setTimeout(() => {
          setReconstructionStage(4);
          setEvidence({
            transition: 'CAM-02 → CAM-04',
            plate: 95,
            type: 98,
            color: 93,
            visual: 89,
            temporal: 92,
            spatial: 91,
            finalMatch: 91
          });

          setEvents(prev => [
            {
              id: `evt-${Date.now()}-3`,
              timestamp: new Date().toLocaleTimeString(),
              type: 'CROSS_CAMERA_MATCH',
              vehicleId: 'V-1027',
              camera: 'CAM-02',
              targetCamera: 'CAM-04',
              confidence: 0.912,
              timeGapSec: 87,
              message: 'CROSS-CAMERA MATCH: V-1027 associated CAM-02 → CAM-04 (91% Match).'
            },
            ...prev
          ]);

          // Stage 4 -> 5: (1.2s) Route Completed!
          timerRef.current = setTimeout(() => {
            setReconstructionStage(5);
            setIsReconstructing(false);

            setEvents(prev => [
              {
                id: `evt-${Date.now()}-4`,
                timestamp: new Date().toLocaleTimeString(),
                type: 'TRAJECTORY',
                vehicleId: 'V-1027',
                camera: 'CAM-01',
                targetCamera: 'CAM-04',
                distanceKm: 3.8,
                confidence: 0.934,
                message: 'TRAJECTORY RECONSTRUCTED: V-1027 (3.8 km in 04:37 @ 42 km/h avg).'
              },
              ...prev
            ]);
          }, 1200);

        }, 1300);

      }, 1300);

    }, 1000);
  };

  // Reset route back to surveillance mode
  const resetRoute = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsReconstructing(false);
    setReconstructionStage(0);
    setEvidence(null);
    setIsMapExpanded(false);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div className="space-y-4">
      {/* 1. Page Header & Operations Telemetry Strip */}
      <div className="flex flex-col space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-1 gap-2">
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-black font-mono tracking-tight text-white uppercase">
                City-Wide Command Center
              </h2>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950/80 text-online border border-emerald-800">
                <span className="w-1.5 h-1.5 rounded-full bg-online animate-pulse mr-1.5"></span> LIVE INGESTION
              </span>
              {reconstructionStage > 0 && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-orange-950/80 text-accent border border-orange-800 animate-pulse">
                  <Sparkles size={11} className="mr-1" /> RECONSTRUCTION ACTIVE
                </span>
              )}
            </div>
            <p className="text-xs font-mono text-gray-400 mt-0.5">
              Real-time multi-camera vehicle intelligence and spatial-temporal trajectory tracking
            </p>
          </div>

          <div className="flex items-center space-x-2 font-mono text-xs">
            {reconstructionStage === 0 ? (
              <button
                onClick={startRouteReconstruction}
                className="bg-accent hover:bg-orange-600 text-black px-3 py-1.5 rounded font-black font-mono text-xs flex items-center space-x-1.5 shadow-md shadow-orange-950/40 transition-transform active:scale-95"
              >
                <GitFork size={14} />
                <span>RECONSTRUCT JOURNEY (V-1027)</span>
              </button>
            ) : (
              <button
                onClick={resetRoute}
                className="bg-[#121c2e] hover:bg-gray-800 text-gray-300 hover:text-white px-3 py-1.5 rounded font-bold font-mono text-xs flex items-center space-x-1.5 border border-gray-700 transition-colors"
              >
                <RotateCcw size={13} />
                <span>RESET ROUTE</span>
              </button>
            )}

            <span className="text-gray-500 pl-2">LAYOUT:</span>
            <button
              onClick={() => {
                setWallLayout('2x2');
                setCameras(INITIAL_CAMERAS.slice(0, 4));
              }}
              className={`px-2.5 py-1 rounded border text-xs font-mono font-bold transition-all ${
                wallLayout === '2x2' 
                  ? 'bg-accent text-black border-accent' 
                  : 'bg-[#101826] text-gray-400 border-gray-800 hover:text-white'
              }`}
            >
              2x2 QUAD
            </button>
          </div>
        </div>

        {/* Telemetry Strip */}
        <KPITelemetryStrip kpis={kpis} />
      </div>

      {/* 2. Middle Row: Camera Surveillance Wall + AI Telemetry & Events */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        {/* CCTV Camera Wall (7 Columns on XL) */}
        <div className="xl:col-span-7 flex flex-col space-y-2">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center space-x-2">
              <Radio size={14} className="text-accent animate-pulse" />
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-gray-200">
                Live Camera Surveillance Wall (4 Feeds • Consistent Corridor Direction)
              </span>
            </div>
            <div className="text-[10px] font-mono text-gray-400 flex items-center space-x-2">
              <span>SYNC: <strong className="text-online">0.02s</strong></span>
              <span>•</span>
              <span>CLICK TO EXPAND / INSPECT</span>
            </div>
          </div>

          <div className={`grid gap-3 ${wallLayout === '2x2' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-3'}`}>
            {cameras.map((cam) => (
              <div key={cam.id} className="h-56">
                <CameraCard 
                  camera={cam} 
                  onSelectVehicle={handleSelectVehicle} 
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right Telemetry Column (5 Columns on XL) */}
        <div className="xl:col-span-5 grid grid-cols-1 gap-4">
          <AITelemetryPanel telemetry={telemetry} />

          <div className="h-[290px]">
            <LiveEventsFeed 
              events={events} 
              onSelectVehicle={handleSelectVehicle}
              maxHeight="h-[235px]"
            />
          </div>
        </div>
      </div>

      {/* 3. Bottom Row: GIS Map & Reconstructed Route (Hero Area) + Vehicle Quick Inspector */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 pt-1 transition-all duration-300">
        {/* City GIS Map (expands to 8 cols or full prominence when reconstructing) */}
        <div className={`${isMapExpanded ? 'xl:col-span-8 h-[450px]' : 'xl:col-span-7 h-[380px]'} transition-all duration-300 relative`}>
          <MapAnalytics 
            cameras={cameras} 
            selectedVehicleId={selectedVehicle.id}
            height={isMapExpanded ? 'h-[450px]' : 'h-[380px]'}
            isReconstructing={isReconstructing}
            reconstructionStage={reconstructionStage}
            evidence={evidence}
            onResetRoute={resetRoute}
            onStartReconstruction={startRouteReconstruction}
          />

          {/* Toggle Map Expand button */}
          <button
            onClick={() => setIsMapExpanded(!isMapExpanded)}
            className="absolute bottom-4 right-4 z-20 bg-[#0b101c]/90 text-gray-300 hover:text-white p-2 rounded border border-gray-700 hover:border-accent transition-colors"
            title={isMapExpanded ? 'Collapse Map' : 'Expand Map View'}
          >
            {isMapExpanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
        </div>

        {/* Vehicle Quick Inspector */}
        <div className={`${isMapExpanded ? 'xl:col-span-4 h-[450px]' : 'xl:col-span-5 h-[380px]'} transition-all duration-300`}>
          <VehicleQuickInspector 
            vehicle={selectedVehicle} 
            isReconstructing={isReconstructing}
            reconstructionStage={reconstructionStage}
            onStartReconstruction={startRouteReconstruction}
            onResetRoute={resetRoute}
          />
        </div>
      </div>
    </div>
  );
}
