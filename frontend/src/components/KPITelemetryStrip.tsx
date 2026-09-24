import { Video, Car, GitFork, AlertTriangle, Gauge, Activity } from 'lucide-react';
import { SystemKPIs } from '../types';

interface KPITelemetryStripProps {
  kpis: SystemKPIs;
}

export default function KPITelemetryStrip({ kpis }: KPITelemetryStripProps) {
  const metrics = [
    {
      id: 'cams',
      label: 'ACTIVE CAMERAS',
      value: `${kpis.activeCameras} / ${kpis.totalCameras}`,
      detail: '100% OPERATIONAL',
      icon: Video,
      color: 'text-online',
      borderColor: 'border-online/40',
      glow: 'shadow-emerald-950/20',
      badge: 'STABLE'
    },
    {
      id: 'vehicles',
      label: 'ACTIVE VEHICLES',
      value: kpis.activeVehicles.toLocaleString(),
      detail: '+14 IN LAST 5 MIN',
      icon: Car,
      color: 'text-accent',
      borderColor: 'border-accent/40',
      glow: 'shadow-orange-950/20',
      badge: 'LIVE FLOW'
    },
    {
      id: 'journeys',
      label: 'TRACKED JOURNEYS',
      value: kpis.trackedJourneys.toLocaleString(),
      detail: 'MULTI-CAMERA CORRELATED',
      icon: GitFork,
      color: 'text-telemetry',
      borderColor: 'border-cyan-500/40',
      glow: 'shadow-cyan-950/20',
      badge: 'RE-ID ON'
    },
    {
      id: 'alerts',
      label: 'ACTIVE ALERTS',
      value: kpis.activeAlerts.toString(),
      detail: '3 CRITICAL WATCHLIST',
      icon: AlertTriangle,
      color: 'text-alert',
      borderColor: 'border-red-500/40',
      glow: 'shadow-red-950/20',
      badge: 'PRIORITY'
    },
    {
      id: 'speed',
      label: 'AVG SPEED',
      value: `${kpis.avgSpeedKmh} km/h`,
      detail: 'CORRIDOR STABLE',
      icon: Gauge,
      color: 'text-yellow-400',
      borderColor: 'border-amber-500/40',
      glow: 'shadow-amber-950/20',
      badge: 'NORMAL'
    },
    {
      id: 'load',
      label: 'TRAFFIC LOAD',
      value: `${kpis.trafficLoadPct}%`,
      detail: 'LEVEL: MODERATE-HIGH',
      icon: Activity,
      color: 'text-orange-400',
      borderColor: 'border-orange-500/40',
      glow: 'shadow-orange-950/20',
      badge: 'INDEX'
    },
  ];

  return (
    <div className="w-full bg-[#0d1424] border border-panel-border rounded-lg overflow-hidden shadow-lg">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 divide-y lg:divide-y-0 divide-x divide-panel-border/70">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div
              key={m.id}
              className="p-3.5 bg-gradient-to-b from-[#111a2e]/60 to-[#0c1220]/80 hover:from-[#15223c]/80 transition-colors flex flex-col justify-between relative group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono font-bold tracking-wider text-gray-400 truncate">
                  {m.label}
                </span>
                <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded bg-black/40 border border-gray-800 font-bold ${m.color}`}>
                  {m.badge}
                </span>
              </div>

              <div className="flex items-baseline space-x-2 my-1">
                <div className={`p-1.5 rounded bg-black/50 border border-gray-800 ${m.color} shrink-0`}>
                  <Icon size={16} />
                </div>
                <div className="text-xl lg:text-2xl font-black font-mono tracking-tight text-white">
                  {m.value}
                </div>
              </div>

              <div className="mt-1 flex items-center justify-between text-[10px] font-mono text-gray-400">
                <span className="truncate">{m.detail}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-online shrink-0 ml-1"></span>
              </div>

              {/* Top Accent Line */}
              <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-${m.color.replace('text-', '')} to-transparent opacity-0 group-hover:opacity-100 transition-opacity`}></div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
