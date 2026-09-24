import { useState } from 'react';
import { INITIAL_ALERTS } from '../data/mockData';
import { TrafficAlert, AlertSeverity } from '../types';
import { 
  BellRing, 
  AlertTriangle, 
  ShieldAlert, 
  Car, 
  Eye, 
  GitFork, 
  Clock, 
  Radio,
  CheckCircle,
  Filter
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AlertsCenter() {
  const [severityFilter, setSeverityFilter] = useState<'ALL' | 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'INFO'>('ALL');
  const navigate = useNavigate();

  const filtered = INITIAL_ALERTS.filter((a) => {
    if (severityFilter === 'ALL') return true;
    return a.severity.toUpperCase() === severityFilter;
  });

  const getSeverityBadge = (sev: AlertSeverity) => {
    switch (sev) {
      case 'critical':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-950/80 text-alert border border-red-800 flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-alert animate-ping mr-1"></span> CRITICAL SEVERITY
          </span>
        );
      case 'high':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-orange-950/80 text-accent border border-orange-800">
            HIGH SEVERITY
          </span>
        );
      case 'medium':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-950/80 text-warning border border-amber-800">
            MEDIUM SEVERITY
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950/80 text-telemetry border border-cyan-800">
            SYSTEM INFO
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="ops-panel rounded-lg p-4 border border-panel-border shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <BellRing size={22} className="text-alert" />
            <h2 className="text-xl font-black font-mono tracking-tight text-white uppercase">
              Incident Response & Alert Center
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-950/80 text-alert border border-red-800 font-bold">
              23 ACTIVE DISPATCHES
            </span>
          </div>
          <p className="text-xs font-mono text-gray-400 mt-0.5">
            Automated watchlist alerts, corridor speed violations, and cross-camera trajectory anomalies
          </p>
        </div>

        {/* Severity Filter Tabs */}
        <div className="flex items-center space-x-1 bg-[#0b101c] p-1 rounded border border-gray-800 font-mono text-xs">
          {(['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'INFO'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setSeverityFilter(tab)}
              className={`px-3 py-1 rounded text-[11px] font-bold transition-colors ${
                severityFilter === tab
                  ? 'bg-accent text-black'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {filtered.map((alert) => (
          <div
            key={alert.id}
            className={`ops-panel rounded-lg p-5 border transition-all shadow-md flex flex-col space-y-3 ${
              alert.severity === 'critical'
                ? 'border-red-900/80 bg-red-950/15 hover:border-red-500'
                : alert.severity === 'high'
                  ? 'border-orange-900/80 bg-orange-950/15 hover:border-accent'
                  : 'border-panel-border bg-[#0f1728]/70 hover:border-gray-700'
            }`}
          >
            {/* Top row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-800/80 pb-3">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded border ${
                  alert.severity === 'critical' 
                    ? 'bg-red-950 text-alert border-red-800' 
                    : 'bg-black/50 text-accent border-gray-800'
                }`}>
                  <ShieldAlert size={20} />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-gray-400">{alert.id}</span>
                    <span className="text-gray-500">•</span>
                    <h3 className="font-mono text-sm font-bold text-white uppercase">{alert.type}</h3>
                  </div>
                  <div className="text-[11px] font-mono text-gray-400 mt-0.5 flex items-center space-x-3">
                    <span className="text-accent font-bold">NODE: {alert.camera}</span>
                    <span>•</span>
                    <span className="flex items-center space-x-1">
                      <Clock size={12} className="text-gray-500" />
                      <span>{alert.timestamp} IST</span>
                    </span>
                    <span>•</span>
                    <span className="text-online font-bold">{(alert.confidence * 100).toFixed(0)}% AI CONFIDENCE</span>
                  </div>
                </div>
              </div>

              <div>{getSeverityBadge(alert.severity)}</div>
            </div>

            {/* Message & Action Recommendation */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 text-xs font-mono">
              <div className="md:col-span-8 bg-[#0b101c] p-3 rounded border border-gray-800/80 flex flex-col justify-between">
                <div className="text-gray-200 text-xs font-sans leading-relaxed">
                  {alert.message}
                </div>
                {alert.actionRequired && (
                  <div className="mt-2 pt-2 border-t border-gray-800 text-[11px] text-yellow-400 flex items-center space-x-1.5">
                    <AlertTriangle size={13} className="shrink-0" />
                    <span>RECOMMENDED PROTOCOL: <strong className="text-white">{alert.actionRequired}</strong></span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="md:col-span-4 flex flex-col justify-center space-y-2">
                <button
                  onClick={() => navigate('/journey')}
                  className="w-full py-2 bg-accent/20 hover:bg-accent text-accent hover:text-black font-mono font-bold text-xs rounded border border-accent/40 transition-colors flex items-center justify-center space-x-1.5"
                >
                  <GitFork size={13} />
                  <span>TRACK JOURNEY</span>
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="w-full py-2 bg-[#121c2e] hover:bg-gray-800 text-gray-300 hover:text-white font-mono font-bold text-xs rounded border border-gray-700 transition-colors flex items-center justify-center space-x-1.5"
                >
                  <Eye size={13} />
                  <span>VIEW LIVE CAMERA</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
