import React from 'react';
import { Server, Video, Car, AlertTriangle } from 'lucide-react';

export default function SystemStatus() {
  const stats = [
    { label: 'Active Cameras', value: '42 / 45', icon: Video, color: 'text-blue-400' },
    { label: 'Vehicles / Hr', value: '12,450', icon: Car, color: 'text-online' },
    { label: 'Active Alerts', value: '3', icon: AlertTriangle, color: 'text-alert' },
    { label: 'Server Status', value: 'Optimal', icon: Server, color: 'text-accent' },
  ];

  return (
    <div className="bg-panel border border-gray-800 rounded-lg p-4 h-32 flex flex-col justify-center">
      <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">System Overview</h2>
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="flex items-center space-x-3">
              <div className={`p-2 rounded bg-black/30 ${stat.color}`}>
                <Icon size={20} />
              </div>
              <div>
                <div className="text-xs text-gray-500">{stat.label}</div>
                <div className="text-lg font-bold">{stat.value}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
