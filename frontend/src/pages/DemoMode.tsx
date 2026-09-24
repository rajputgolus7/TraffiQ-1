import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Play } from 'lucide-react';
import CommandCenter from './CommandCenter';

export default function DemoMode() {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    // Hide default scrollbars and enter "kiosk" presentation mode
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-dark flex flex-col">
      <div className="bg-black text-white p-2 flex justify-between items-center border-b border-gray-800 z-50">
        <div className="flex items-center space-x-4 ml-2 text-sm text-gray-400">
          <span className="font-bold text-accent flex items-center"><Play size={14} className="mr-1" /> PRESENTATION MODE</span>
          <span>TraffiQ SIH 2026 Prototype</span>
        </div>
        <button 
          onClick={() => navigate('/')}
          className="text-gray-400 hover:text-white p-1 rounded hover:bg-gray-800 transition-colors"
          title="Exit Demo"
        >
          <X size={20} />
        </button>
      </div>
      <div className="flex-1 overflow-hidden p-4 relative pointer-events-none">
         {/* Simulate the dashboard but disable interactions for recording */}
         <CommandCenter />
         
         {/* Overlay to prevent clicks during demo if needed */}
         <div className="absolute inset-0 z-40 bg-transparent"></div>
      </div>
    </div>
  );
}
