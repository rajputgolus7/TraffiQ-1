import { useEffect, useState } from 'react';
import { Radio, ShieldCheck, Video, Car, AlertTriangle, MonitorPlay } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface TopHeaderProps {
  activeCameras?: number;
  totalCameras?: number;
  activeVehicles?: number;
  activeAlerts?: number;
  isPresentationMode?: boolean;
  onTogglePresentationMode?: () => void;
}

export default function TopHeader({
  activeCameras = 12,
  totalCameras = 12,
  activeVehicles = 847,
  activeAlerts = 23,
  isPresentationMode = false,
  onTogglePresentationMode,
}: TopHeaderProps) {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
      setCurrentDate(
        now.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }).toUpperCase()
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-[#0b101c] border-b border-panel-border px-4 py-2.5 flex items-center justify-between shrink-0 select-none z-30">
      {/* LEFT: Product Identity */}
      <div className="flex items-center space-x-3.5">
        <div className="relative flex items-center justify-center w-9 h-9 rounded-md bg-gradient-to-br from-accent via-orange-600 to-amber-700 p-0.5 shadow-md shadow-orange-950/40">
          <div className="w-full h-full bg-[#0d1322] rounded-[4px] flex items-center justify-center">
            <Radio size={20} className="text-accent animate-pulse" />
          </div>
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-lg font-black tracking-wider text-white font-mono leading-none">
              TRAFFIQ
            </h1>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-orange-950/60 text-orange-400 border border-orange-800/80 font-semibold">
              SIH 26127
            </span>
          </div>
          <div className="text-[10px] font-mono tracking-widest text-gray-400 uppercase mt-0.5">
            City-Wide AI Traffic Intelligence
          </div>
        </div>
      </div>

      {/* CENTER: System Operational Status */}
      <div className="hidden md:flex items-center space-x-3 bg-[#0f172a]/90 border border-panel-border px-3 py-1.5 rounded-full backdrop-blur-sm shadow-inner">
        <div className="flex items-center space-x-2 text-xs font-mono">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-online opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-online"></span>
          </span>
          <span className="text-gray-400 font-semibold uppercase text-[11px] tracking-wider">SYSTEM STATUS:</span>
          <span className="text-online font-bold text-[11px] tracking-wide flex items-center space-x-1">
            <ShieldCheck size={13} className="text-online inline mr-1" />
            ALL SYSTEMS OPERATIONAL
          </span>
        </div>
      </div>

      {/* RIGHT: Live Telemetry Chips & Presentation Toggle */}
      <div className="flex items-center space-x-3">
        {/* KPI Pills */}
        <div className="hidden lg:flex items-center space-x-2 font-mono text-[11px]">
          <div className="flex items-center space-x-1.5 bg-[#121c2e] border border-panel-border px-2.5 py-1 rounded text-gray-300">
            <Video size={13} className="text-online" />
            <span className="font-bold text-white">{activeCameras}/{totalCameras}</span>
            <span className="text-gray-500">CAMS</span>
          </div>
          <div className="flex items-center space-x-1.5 bg-[#121c2e] border border-panel-border px-2.5 py-1 rounded text-gray-300">
            <Car size={13} className="text-telemetry" />
            <span className="font-bold text-white">{activeVehicles}</span>
            <span className="text-gray-500">VEHICLES</span>
          </div>
          <div className="flex items-center space-x-1.5 bg-[#121c2e] border border-panel-border px-2.5 py-1 rounded text-gray-300">
            <AlertTriangle size={13} className="text-alert" />
            <span className="font-bold text-alert">{activeAlerts}</span>
            <span className="text-gray-500">ALERTS</span>
          </div>
        </div>

        {/* Live Date/Time Clock */}
        <div className="text-right font-mono hidden sm:block border-l border-panel-border pl-3">
          <div className="text-xs font-bold text-white tracking-widest flex items-center space-x-1.5 justify-end">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>
            <span>{currentTime}</span>
            <span className="text-[10px] text-gray-400">IST</span>
          </div>
          <div className="text-[9px] text-gray-400 tracking-wider font-semibold">
            {currentDate}
          </div>
        </div>

        {/* Presentation / Demo Route Button */}
        {location.pathname !== '/demo' && (
          <button
            onClick={() => navigate('/demo')}
            className="flex items-center space-x-1.5 bg-accent hover:bg-orange-600 text-black font-mono font-bold text-xs px-3 py-1.5 rounded transition-all shadow-md shadow-orange-950/40"
            title="Launch Automated SIH Presentation Mode"
          >
            <MonitorPlay size={14} />
            <span className="hidden sm:inline">DEMO STORY</span>
          </button>
        )}

        {onTogglePresentationMode && (
          <button
            onClick={onTogglePresentationMode}
            className={`font-mono text-xs px-2.5 py-1.5 rounded border transition-all ${
              isPresentationMode 
                ? 'bg-accent/20 text-accent border-accent' 
                : 'bg-[#152033] text-gray-400 border-gray-700 hover:text-white'
            }`}
            title="Toggle Clean Presentation Screen"
          >
            {isPresentationMode ? 'STANDARD' : 'FULL SCREEN'}
          </button>
        )}
      </div>
    </header>
  );
}
