import React, { useState } from 'react';
import { Search, MapPin, Clock, ArrowRight } from 'lucide-react';

export default function VehicleJourney() {
  const [search, setSearch] = useState('PB10XX1234');

  const journey = [
    { time: '10:45 AM', location: 'NH-44 North Entry', cam: 'CAM-01', image: 'front-view' },
    { time: '11:12 AM', location: 'City Center Intersection', cam: 'CAM-02', image: 'side-view' },
    { time: '11:40 AM', location: 'West Toll Plaza', cam: 'CAM-03', image: 'rear-view' },
  ];

  return (
    <div className="h-full flex flex-col max-w-5xl mx-auto w-full space-y-6 pt-4">
      <div className="bg-panel border border-gray-800 rounded-lg p-6">
        <h2 className="text-lg font-bold mb-4 flex items-center">
          <Search className="mr-2 text-accent" /> Vehicle Search & Journey Tracking
        </h2>
        <div className="flex space-x-4">
          <input 
            type="text" 
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Enter Vehicle Plate (e.g., PB10XX1234)"
            className="flex-1 bg-black border border-gray-700 rounded px-4 py-2 text-white focus:outline-none focus:border-accent"
          />
          <button className="bg-accent text-black font-bold px-6 py-2 rounded hover:bg-orange-600 transition-colors">
            Track
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 min-h-0">
        <div className="md:col-span-1 bg-panel border border-gray-800 rounded-lg p-6 overflow-y-auto">
           <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-6">Timeline</h3>
           <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-700 before:to-transparent">
             {journey.map((stop, i) => (
               <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                 <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-panel bg-accent text-black shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                   <Clock size={16} />
                 </div>
                 <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-black p-4 rounded border border-gray-800 shadow">
                   <div className="flex items-center justify-between mb-1">
                     <div className="font-bold text-accent text-sm">{stop.time}</div>
                     <div className="text-xs text-gray-500 font-mono">{stop.cam}</div>
                   </div>
                   <div className="text-sm text-gray-300">{stop.location}</div>
                 </div>
               </div>
             ))}
           </div>
        </div>
        <div className="md:col-span-2 bg-panel border border-gray-800 rounded-lg flex items-center justify-center relative overflow-hidden">
           {/* Mock Map View for Journey */}
           <div className="absolute inset-0 bg-[url('https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json')] opacity-20 bg-cover bg-center mix-blend-overlay"></div>
           <div className="z-10 text-center">
             <MapPin size={48} className="text-accent mx-auto mb-4 opacity-50" />
             <p className="text-gray-400">Map visualization integrating MapLibre GL path rendering</p>
           </div>
        </div>
      </div>
    </div>
  );
}
