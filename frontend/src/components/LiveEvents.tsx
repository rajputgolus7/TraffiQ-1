import React from 'react';
import { EventLog } from '../types';
import { AlertCircle, Info, AlertTriangle } from 'lucide-react';

const mockEvents: EventLog[] = [
  { id: '1', timestamp: new Date(Date.now() - 1000 * 60).toISOString(), message: 'Speed limit violation detected on NH-44', type: 'warning' },
  { id: '2', timestamp: new Date(Date.now() - 1000 * 120).toISOString(), message: 'Camera CAM-04 connection lost', type: 'alert' },
  { id: '3', timestamp: new Date(Date.now() - 1000 * 180).toISOString(), message: 'System backup completed successfully', type: 'info' },
];

export default function LiveEvents({ limit = 5 }: { limit?: number }) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'alert': return <AlertCircle size={14} className="text-alert mt-0.5" />;
      case 'warning': return <AlertTriangle size={14} className="text-accent mt-0.5" />;
      default: return <Info size={14} className="text-blue-400 mt-0.5" />;
    }
  };

  return (
    <div className="bg-panel border border-gray-800 rounded-lg p-3 h-full flex flex-col">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Live Events</h2>
        <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
      </div>
      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {mockEvents.slice(0, limit).map(event => (
          <div key={event.id} className="flex space-x-2 text-sm border-l-2 border-gray-700 pl-2 py-1">
            {getIcon(event.type)}
            <div>
              <div className="text-gray-200 text-xs">{event.message}</div>
              <div className="text-[10px] text-gray-500">{new Date(event.timestamp).toLocaleTimeString()}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
