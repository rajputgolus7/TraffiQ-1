import { useState } from 'react';
import { 
  HOURLY_TRAFFIC_DATA, 
  VEHICLE_TYPE_DISTRIBUTION, 
  CORRIDOR_SPEED_DATA 
} from '../data/mockData';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { 
  BarChart3, 
  TrendingUp, 
  Gauge, 
  Car, 
  Activity, 
  Calendar, 
  Layers 
} from 'lucide-react';

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<'1H' | 'TODAY' | 'WEEK'>('TODAY');

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="ops-panel rounded-lg p-4 border border-panel-border shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <BarChart3 size={22} className="text-accent" />
            <h2 className="text-xl font-black font-mono tracking-tight text-white uppercase">
              Urban Traffic Intelligence & Spatial Analytics
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-online border border-emerald-800 font-bold">
              AGGREGATED METRICS
            </span>
          </div>
          <p className="text-xs font-mono text-gray-400 mt-0.5">
            Throughput, corridor velocities, vehicle classifications, and congestion anomalies
          </p>
        </div>

        {/* Time Range Filter */}
        <div className="flex items-center space-x-1 bg-[#0b101c] p-1 rounded border border-gray-800 font-mono text-xs">
          <Calendar size={13} className="text-gray-500 ml-1.5 mr-1" />
          {[
            { id: '1H', label: 'LAST 1 HOUR' },
            { id: 'TODAY', label: 'TODAY' },
            { id: 'WEEK', label: 'THIS WEEK' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setTimeRange(tab.id as any)}
              className={`px-3 py-1 rounded text-[11px] font-bold transition-colors ${
                timeRange === tab.id
                  ? 'bg-accent text-black'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono">
        <div className="ops-panel p-3.5 rounded-lg border border-panel-border">
          <div className="text-[10px] text-gray-400 uppercase">Hourly Throughput</div>
          <div className="text-2xl font-black text-white mt-1">1,420 <span className="text-xs text-gray-400">VEH/HR</span></div>
          <div className="text-[10px] text-online mt-1">Peak: 10:00 - 11:00 AM</div>
        </div>

        <div className="ops-panel p-3.5 rounded-lg border border-panel-border">
          <div className="text-[10px] text-gray-400 uppercase">City-Wide Mean Speed</div>
          <div className="text-2xl font-black text-accent mt-1">38.4 <span className="text-xs text-gray-400">KM/H</span></div>
          <div className="text-[10px] text-gray-400 mt-1">Legal bound: 50 km/h</div>
        </div>

        <div className="ops-panel p-3.5 rounded-lg border border-panel-border">
          <div className="text-[10px] text-gray-400 uppercase">Corridor Congestion Index</div>
          <div className="text-2xl font-black text-warning mt-1">72%</div>
          <div className="text-[10px] text-yellow-400 mt-1">Moderate-High Load</div>
        </div>

        <div className="ops-panel p-3.5 rounded-lg border border-panel-border">
          <div className="text-[10px] text-gray-400 uppercase">Reconstructed Journeys</div>
          <div className="text-2xl font-black text-telemetry mt-1">6,421</div>
          <div className="text-[10px] text-online mt-1">94.2% Re-ID Match Rate</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Traffic Volume by Hour (Area Chart - 7 Cols on LG) */}
        <div className="lg:col-span-7 ops-panel rounded-lg p-4 border border-panel-border shadow-md flex flex-col">
          <div className="flex items-center justify-between border-b border-panel-border/80 pb-2 mb-4 font-mono">
            <div>
              <h3 className="text-xs font-bold text-gray-200 uppercase tracking-wider">
                Traffic Volume & Mean Velocity Timeline
              </h3>
              <p className="text-[10px] text-gray-500">Hourly vehicle count correlated with corridor velocity</p>
            </div>
            <span className="text-[10px] text-accent font-bold">HOURLY BINS</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={HOURLY_TRAFFIC_DATA}>
                <defs>
                  <linearGradient id="volumeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11, fontFamily: 'monospace' }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11, fontFamily: 'monospace' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0b101c', borderColor: '#334155', borderRadius: '6px', fontSize: '11px', fontFamily: 'monospace' }} 
                />
                <Area type="monotone" dataKey="volume" stroke="#f97316" strokeWidth={2} fillOpacity={1} fill="url(#volumeGrad)" name="Vehicle Count" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Vehicle Classification Distribution (Pie Chart - 5 Cols on LG) */}
        <div className="lg:col-span-5 ops-panel rounded-lg p-4 border border-panel-border shadow-md flex flex-col">
          <div className="flex items-center justify-between border-b border-panel-border/80 pb-2 mb-4 font-mono">
            <div>
              <h3 className="text-xs font-bold text-gray-200 uppercase tracking-wider">
                Vehicle Type Classification
              </h3>
              <p className="text-[10px] text-gray-500">YOLOv11 neural inference class breakdown</p>
            </div>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={VEHICLE_TYPE_DISTRIBUTION}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {VEHICLE_TYPE_DISTRIBUTION.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0b101c', borderColor: '#334155', borderRadius: '6px', fontSize: '11px', fontFamily: 'monospace' }} 
                />
                <Legend 
                  formatter={(val) => <span className="text-[11px] font-mono text-gray-300">{val}</span>} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Corridor Speed Performance (Bar Chart - Full 12 Cols) */}
        <div className="lg:col-span-12 ops-panel rounded-lg p-4 border border-panel-border shadow-md flex flex-col">
          <div className="flex items-center justify-between border-b border-panel-border/80 pb-2 mb-4 font-mono">
            <div>
              <h3 className="text-xs font-bold text-gray-200 uppercase tracking-wider">
                Corridor Speed Compliance vs Speed Limit
              </h3>
              <p className="text-[10px] text-gray-500">Average measured vehicle velocity across key arterial routes</p>
            </div>
            <span className="text-[10px] text-online font-bold">RADAR TELEMETRY</span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CORRIDOR_SPEED_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="corridor" stroke="#64748b" tick={{ fontSize: 11, fontFamily: 'monospace' }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11, fontFamily: 'monospace' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0b101c', borderColor: '#334155', borderRadius: '6px', fontSize: '11px', fontFamily: 'monospace' }} 
                />
                <Bar dataKey="avgSpeed" fill="#f97316" name="Average Speed (km/h)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="targetSpeed" fill="#334155" name="Speed Limit (km/h)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
