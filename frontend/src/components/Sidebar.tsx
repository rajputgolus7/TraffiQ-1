import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Cctv, 
  CarFront, 
  GitFork, 
  Map, 
  BellRing, 
  BarChart3, 
  PlaySquare, 
  ChevronLeft, 
  ChevronRight, 
  Cpu, 
  Server, 
  Database,
  Clock
} from 'lucide-react';

interface SidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export default function Sidebar({ 
  collapsed: externalCollapsed, 
  onToggleCollapse 
}: SidebarProps) {
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const isCollapsed = externalCollapsed !== undefined ? externalCollapsed : internalCollapsed;

  const toggle = () => {
    if (onToggleCollapse) {
      onToggleCollapse();
    } else {
      setInternalCollapsed(!internalCollapsed);
    }
  };

  const navItems = [
    { label: 'COMMAND CENTER', path: '/', icon: LayoutDashboard },
    { label: 'LIVE MONITORING', path: '/cameras', icon: Cctv },
    { label: 'VEHICLES', path: '/vehicles', icon: CarFront },
    { label: 'JOURNEYS', path: '/journey', icon: GitFork },
    { label: 'CITY MAP', path: '/map', icon: Map },
    { label: 'ALERTS', path: '/alerts', icon: BellRing, badge: '23' },
    { label: 'ANALYTICS', path: '/analytics', icon: BarChart3 },
    { label: 'DEMO STORY', path: '/demo', icon: PlaySquare, highlight: true },
  ];

  return (
    <aside 
      className={`bg-[#0a0f1a] border-r border-panel-border transition-all duration-200 flex flex-col justify-between shrink-0 select-none z-20 ${
        isCollapsed ? 'w-16' : 'w-56'
      }`}
    >
      {/* Navigation Top */}
      <div className="flex flex-col py-3">
        <div className="px-3 pb-2 flex items-center justify-between border-b border-panel-border/60 mb-2">
          {!isCollapsed && (
            <span className="text-[10px] font-mono tracking-widest text-gray-400 uppercase font-bold">
              Navigation
            </span>
          )}
          <button
            onClick={toggle}
            className="p-1 rounded text-gray-400 hover:text-white hover:bg-gray-800 transition-colors mx-auto"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        <nav className="space-y-1 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `
                  flex items-center space-x-3 px-3 py-2 rounded-md font-mono text-xs transition-all
                  ${isActive 
                    ? 'bg-accent/15 text-accent border border-accent/40 font-bold shadow-sm shadow-orange-950/20' 
                    : item.highlight 
                      ? 'text-orange-400 hover:bg-orange-950/20 hover:text-orange-300' 
                      : 'text-gray-400 hover:text-gray-100 hover:bg-gray-850/60'
                  }
                  ${isCollapsed ? 'justify-center px-0' : ''}
                `}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon size={18} className="shrink-0" />
                {!isCollapsed && (
                  <div className="flex-1 flex items-center justify-between truncate">
                    <span className="truncate">{item.label}</span>
                    {item.badge && (
                      <span className="text-[10px] font-mono bg-red-950/80 text-alert border border-red-800/80 px-1.5 py-0.2 rounded-full font-bold">
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Sub-System Health Telemetry */}
      <div className="p-3 border-t border-panel-border/80 bg-[#070b13] space-y-2 font-mono text-[11px]">
        {!isCollapsed ? (
          <>
            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">
              Sub-System Matrix
            </div>

            <div className="flex items-center justify-between text-gray-300 py-0.5">
              <span className="flex items-center space-x-1.5">
                <Cpu size={12} className="text-telemetry" />
                <span>AI ENGINE</span>
              </span>
              <span className="text-online font-bold flex items-center text-[10px]">
                <span className="w-1.5 h-1.5 rounded-full bg-online mr-1"></span> ONLINE
              </span>
            </div>

            <div className="flex items-center justify-between text-gray-300 py-0.5">
              <span className="flex items-center space-x-1.5">
                <Server size={12} className="text-accent" />
                <span>API GATEWAY</span>
              </span>
              <span className="text-online font-bold flex items-center text-[10px]">
                <span className="w-1.5 h-1.5 rounded-full bg-online mr-1"></span> ONLINE
              </span>
            </div>

            <div className="flex items-center justify-between text-gray-300 py-0.5">
              <span className="flex items-center space-x-1.5">
                <Database size={12} className="text-purple-400" />
                <span>DATABASE</span>
              </span>
              <span className="text-online font-bold flex items-center text-[10px]">
                <span className="w-1.5 h-1.5 rounded-full bg-online mr-1"></span> POSTGIS
              </span>
            </div>

            <div className="pt-2 border-t border-gray-800/80 flex items-center justify-between text-[10px] text-gray-400">
              <span className="flex items-center space-x-1">
                <Clock size={11} />
                <span>UPTIME</span>
              </span>
              <span className="text-white font-mono font-bold">04:21:37</span>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center space-y-2 py-1">
            <span className="w-2 h-2 rounded-full bg-online" title="AI Engine Online"></span>
            <span className="w-2 h-2 rounded-full bg-online" title="API Gateway Online"></span>
            <span className="w-2 h-2 rounded-full bg-online" title="Database Connected"></span>
          </div>
        )}
      </div>
    </aside>
  );
}
