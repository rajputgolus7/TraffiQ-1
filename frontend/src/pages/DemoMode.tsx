import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  FastForward, 
  X, 
  CheckCircle2, 
  Radio, 
  ShieldCheck, 
  ShieldAlert, 
  Car, 
  GitFork, 
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Layers
} from 'lucide-react';
import { INITIAL_CAMERAS, INITIAL_VEHICLES } from '../data/mockData';
import CameraCard from '../components/CameraCard';
import MapAnalytics from '../components/MapAnalytics';

interface DemoScene {
  step: number;
  title: string;
  subtitle: string;
  badge: string;
  badgeColor: string;
}

const DEMO_SCENES: DemoScene[] = [
  {
    step: 1,
    title: 'ALL SURVEILLANCE & AI SYSTEMS ONLINE',
    subtitle: '12 Edge Nodes Synchronized • AI Pipeline Initialized • PostGIS Connected',
    badge: 'SYSTEM BOOT',
    badgeColor: 'bg-emerald-950 text-online border-emerald-800'
  },
  {
    step: 2,
    title: 'VEHICLE DETECTED AT CAM-01 (RAJPURA JUNCTION)',
    subtitle: 'YOLOv11 neural inference identifies incoming White Sedan target V-1027',
    badge: 'OBJECT DETECTION',
    badgeColor: 'bg-orange-950 text-accent border-orange-800'
  },
  {
    step: 3,
    title: 'AUTOMATIC NUMBER PLATE RECOGNITION (ANPR)',
    subtitle: 'PaddleOCR extracts license plate: PB10XX1234 with 94.1% character confidence',
    badge: 'ANPR EXTRACTION',
    badgeColor: 'bg-amber-950 text-warning border-amber-800'
  },
  {
    step: 4,
    title: 'DEPARTURE FROM CAM-01 & SPATIAL TRANSIT',
    subtitle: 'Vehicle exits CAM-01 field of view. Spatial-temporal velocity prediction initiated for CAM-02',
    badge: 'TRACK TRANSITION',
    badgeColor: 'bg-purple-950 text-purple-400 border-purple-800'
  },
  {
    step: 5,
    title: 'CROSS-CAMERA RE-ID MATCH CONFIRMED AT CAM-02',
    subtitle: 'OSNet appearance embedding matched with 94.2% confidence after 27s transit time',
    badge: 'CROSS-CAMERA MATCH',
    badgeColor: 'bg-cyan-950 text-telemetry border-cyan-800'
  },
  {
    step: 6,
    title: 'DYNAMIC TRAJECTORY SYNTHESIS IN PROGRESS',
    subtitle: 'Cartographic graph draws verified vehicle journey across NH-44 to Metro Corridor',
    badge: 'GIS TRAJECTORY',
    badgeColor: 'bg-orange-950 text-accent border-orange-800'
  },
  {
    step: 7,
    title: 'CONTINUOUS JOURNEY RECONSTRUCTION COMPLETE',
    subtitle: 'Reconstructed Journey: CAM-01 → CAM-02 → CAM-04 (3.8 km in 04:37 @ 42 km/h avg)',
    badge: 'JOURNEY COMPLETED',
    badgeColor: 'bg-emerald-950 text-online border-emerald-800'
  },
  {
    step: 8,
    title: 'PRIORITY WATCHLIST DISPATCH GENERATED',
    subtitle: 'Target V-2041 (Black SUV, HR26DK8899) flagged on municipal stolen vehicle watchlist at CAM-03',
    badge: 'CRITICAL ALERT',
    badgeColor: 'bg-red-950 text-alert border-red-800'
  },
  {
    step: 9,
    title: 'URBAN TRAFFIC INTELLIGENCE & ANALYTICS UPDATED',
    subtitle: 'Throughput counts, corridor velocity bounds, and congestion telemetry updated in real-time',
    badge: 'ANALYTICS ENGINE',
    badgeColor: 'bg-blue-950 text-blue-400 border-blue-800'
  },
  {
    step: 10,
    title: 'TRAFFIQ PLATFORM CAPABILITY VALIDATION',
    subtitle: 'One Vehicle. Multiple Cameras. One Continuous Journey.',
    badge: 'SIH 2026 CONCLUSION',
    badgeColor: 'bg-orange-950 text-accent border-orange-800'
  },
];

export default function DemoMode() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const navigate = useNavigate();

  // Scene duration logic
  useEffect(() => {
    if (!isPlaying) return;
    if (currentStep >= 10) return; // Stop at scene 10

    const sceneDuration = (currentStep === 1 || currentStep === 10 ? 5000 : 4000) / speedMultiplier;
    const timer = setTimeout(() => {
      setCurrentStep(prev => Math.min(prev + 1, 10));
    }, sceneDuration);

    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, speedMultiplier]);

  const activeScene = DEMO_SCENES[currentStep - 1];

  return (
    <div className="fixed inset-0 z-50 bg-[#070b13] text-white flex flex-col select-none overflow-hidden">
      {/* Top Demo Command Bar */}
      <div className="bg-[#0b101c] border-b border-panel-border px-5 py-2.5 flex items-center justify-between z-50">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-accent to-orange-700 flex items-center justify-center text-black font-black font-mono">
            TQ
          </div>
          <div>
            <div className="flex items-center space-x-2 font-mono">
              <span className="text-base font-black text-white tracking-wider">TRAFFIQ</span>
              <span className="text-gray-400">•</span>
              <span className="text-xs font-bold text-accent uppercase">Automated Demonstration Engine</span>
              <span className="px-1.5 py-0.2 rounded bg-orange-950/80 text-orange-400 border border-orange-800 text-[10px] font-bold">
                SIH 26127
              </span>
            </div>
            <div className="text-[10px] font-mono text-gray-400">
              Evaluator Mode • Real-Time Multi-Camera Track Correlation Sequence
            </div>
          </div>
        </div>

        {/* Scene Navigation Stepper */}
        <div className="hidden lg:flex items-center space-x-1.5 font-mono text-xs">
          {DEMO_SCENES.map((scene) => (
            <button
              key={scene.step}
              onClick={() => setCurrentStep(scene.step)}
              className={`w-7 h-7 rounded flex items-center justify-center font-bold transition-all text-xs ${
                currentStep === scene.step
                  ? 'bg-accent text-black scale-110 shadow-md shadow-orange-950/50'
                  : currentStep > scene.step
                    ? 'bg-emerald-950 text-online border border-emerald-800'
                    : 'bg-[#121c2e] text-gray-500 border border-gray-800 hover:text-gray-300'
              }`}
              title={`Scene ${scene.step}: ${scene.title}`}
            >
              {scene.step}
            </button>
          ))}
        </div>

        {/* Playback Controls & Exit */}
        <div className="flex items-center space-x-2 font-mono text-xs">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded font-bold transition-colors ${
              isPlaying
                ? 'bg-amber-600/20 text-warning border border-amber-500/50 hover:bg-amber-600/30'
                : 'bg-accent text-black hover:bg-orange-600'
            }`}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
            <span>{isPlaying ? 'PAUSE' : 'START DEMO'}</span>
          </button>

          <button
            onClick={() => {
              setCurrentStep(1);
              setIsPlaying(true);
            }}
            className="p-2 rounded bg-[#121c2e] text-gray-300 hover:text-white border border-gray-700 hover:bg-gray-800 transition-colors"
            title="Reset to Scene 1"
          >
            <RotateCcw size={14} />
          </button>

          <button
            onClick={() => setSpeedMultiplier(prev => (prev === 1 ? 2 : 1))}
            className={`px-2.5 py-1.5 rounded border transition-colors ${
              speedMultiplier === 2 
                ? 'bg-telemetry/20 text-telemetry border-telemetry/50 font-bold' 
                : 'bg-[#121c2e] text-gray-400 border-gray-700 hover:text-white'
            }`}
            title="Toggle 2x Playback Speed"
          >
            {speedMultiplier}X SPEED
          </button>

          <button
            onClick={() => navigate('/')}
            className="p-2 rounded text-gray-400 hover:text-white hover:bg-gray-800 transition-colors ml-2"
            title="Exit Demo Mode"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Hero Scenario Narrative Banner */}
      <div className="bg-[#0e1627] border-b border-accent/40 px-6 py-3 flex items-center justify-between shadow-lg">
        <div className="flex items-center space-x-4">
          <div className="p-2 rounded bg-accent/20 text-accent border border-accent/40 font-mono font-bold text-xs shrink-0">
            SCENE {currentStep} OF 10
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${activeScene.badgeColor}`}>
                {activeScene.badge}
              </span>
              <h2 className="text-base font-black font-mono tracking-tight text-white uppercase">
                {activeScene.title}
              </h2>
            </div>
            <p className="text-xs font-mono text-gray-300 mt-0.5">
              {activeScene.subtitle}
            </p>
          </div>
        </div>

        {/* Live Status indicator */}
        <div className="hidden sm:flex items-center space-x-2 font-mono text-xs">
          <span className="w-2 h-2 rounded-full bg-online animate-pulse"></span>
          <span className="text-online font-bold">SIMULATION ACTIVE</span>
        </div>
      </div>

      {/* Main Viewport Content - Changes with Scene */}
      <div className="flex-1 overflow-hidden p-4 relative">
        {currentStep === 10 ? (
          /* Final Scene 10: Polished Full-Screen Conclusion */
          <div className="w-full h-full flex flex-col items-center justify-center text-center p-8 bg-gradient-to-b from-[#080d18] via-[#0d1629] to-[#080d18] rounded-xl border border-accent/40 shadow-2xl relative overflow-hidden">
            {/* Background geometric accents */}
            <div className="absolute inset-0 bg-tech-grid opacity-30 pointer-events-none"></div>

            <div className="relative z-10 max-w-3xl space-y-6 animate-in zoom-in-95 duration-500">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-orange-950/80 text-orange-400 border border-orange-700/80 font-mono text-xs font-bold">
                <Sparkles size={14} className="text-accent" />
                <span>SMART INDIA HACKATHON 2026 • PROBLEM STATEMENT 26127</span>
              </div>

              <h1 className="text-5xl lg:text-7xl font-black font-mono tracking-wider text-white">
                TRAFFIQ
              </h1>

              <div className="text-lg font-mono tracking-widest text-accent font-bold uppercase">
                City-Wide AI Traffic Intelligence
              </div>

              <div className="py-6 border-y border-gray-800 space-y-2">
                <p className="text-2xl lg:text-3xl font-black font-mono text-gray-100 tracking-tight leading-snug">
                  "ONE VEHICLE.<br />
                  MULTIPLE CAMERAS.<br />
                  <span className="text-accent">ONE CONTINUOUS JOURNEY."</span>
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-2 font-mono text-xs text-gray-400">
                <div className="bg-[#121c2e] p-3 rounded border border-gray-800">
                  <div className="text-white font-bold text-base">94.2%</div>
                  <div className="text-[11px] text-gray-400 mt-0.5">Re-ID Match Rate</div>
                </div>
                <div className="bg-[#121c2e] p-3 rounded border border-gray-800">
                  <div className="text-white font-bold text-base">12 Nodes</div>
                  <div className="text-[11px] text-gray-400 mt-0.5">Edge Surveillance</div>
                </div>
                <div className="bg-[#121c2e] p-3 rounded border border-gray-800">
                  <div className="text-white font-bold text-base">24.6 FPS</div>
                  <div className="text-[11px] text-gray-400 mt-0.5">Inference Velocity</div>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-center space-x-4">
                <button
                  onClick={() => {
                    setCurrentStep(1);
                    setIsPlaying(true);
                  }}
                  className="px-6 py-2.5 bg-accent hover:bg-orange-600 text-black font-mono font-bold text-xs rounded transition-colors flex items-center space-x-2 shadow-lg shadow-orange-950/50"
                >
                  <RotateCcw size={14} />
                  <span>REPLAY DEMO STORY</span>
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="px-6 py-2.5 bg-[#142036] hover:bg-gray-800 text-white font-mono font-bold text-xs rounded border border-gray-700 transition-colors"
                >
                  EXPLORE COMMAND CENTER
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Scenes 1-9: Live Operations Screen with Automated Story Highlights */
          <div className="w-full h-full grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Left Column: Focused Camera Feeds (6 Cols on LG) */}
            <div className="lg:col-span-6 flex flex-col space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-gray-300 px-1">
                <span className="font-bold uppercase flex items-center space-x-2">
                  <Radio size={14} className="text-accent animate-pulse" />
                  <span>Live Feeds Under Scene Inspection</span>
                </span>
                <span className="text-online font-bold">CAM-01 • CAM-02 • CAM-03 • CAM-04</span>
              </div>

              <div className="grid grid-cols-2 gap-3 flex-1">
                {INITIAL_CAMERAS.slice(0, 4).map((cam) => {
                  const isHighlighted = 
                    (currentStep <= 4 && cam.id === 'CAM-01') ||
                    (currentStep === 5 && cam.id === 'CAM-02') ||
                    (currentStep === 6 && ['CAM-01', 'CAM-02', 'CAM-04'].includes(cam.id)) ||
                    (currentStep === 8 && cam.id === 'CAM-03');

                  return (
                    <div 
                      key={cam.id} 
                      className={`rounded-lg overflow-hidden transition-all duration-300 relative ${
                        isHighlighted 
                          ? 'ring-2 ring-accent shadow-xl shadow-orange-950/40' 
                          : 'opacity-70'
                      }`}
                    >
                      <CameraCard camera={cam} />
                      {isHighlighted && (
                        <div className="absolute top-2 right-2 bg-accent text-black font-mono font-black text-[9px] px-1.5 py-0.5 rounded shadow">
                          ACTIVE SCENE TARGET
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: GIS Route Animation & Telemetry Overlay (6 Cols on LG) */}
            <div className="lg:col-span-6 flex flex-col space-y-3">
              <div className="flex-1 rounded-lg overflow-hidden border border-panel-border relative">
                <MapAnalytics 
                  cameras={INITIAL_CAMERAS}
                  selectedVehicleId="V-1027"
                  height="h-full"
                />
              </div>

              {/* Dynamic Telemetry Box for Current Scene */}
              <div className="ops-panel p-4 rounded-lg border border-accent/40 font-mono text-xs space-y-2">
                <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                  <div className="text-accent font-bold uppercase flex items-center space-x-1.5">
                    <ShieldCheck size={14} />
                    <span>Real-Time Scene Telemetry</span>
                  </div>
                  <span className="text-gray-400">Step {currentStep} of 10</span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center pt-1">
                  <div className="bg-[#0b101c] p-2 rounded border border-gray-800">
                    <div className="text-[10px] text-gray-500 uppercase">Target Vehicle</div>
                    <div className="text-sm font-bold text-white mt-0.5">V-1027</div>
                  </div>
                  <div className="bg-[#0b101c] p-2 rounded border border-gray-800">
                    <div className="text-[10px] text-gray-500 uppercase">License Plate</div>
                    <div className="text-sm font-bold text-accent mt-0.5">PB10XX1234</div>
                  </div>
                  <div className="bg-[#0b101c] p-2 rounded border border-gray-800">
                    <div className="text-[10px] text-gray-500 uppercase">Re-ID Match</div>
                    <div className="text-sm font-bold text-online mt-0.5">94.2% Conf</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
