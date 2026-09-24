import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

export default function MapAnalytics() {
  const mapContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
      center: [77.2090, 28.6139], // New Delhi
      zoom: 11,
      interactive: false
    });

    // Mock markers
    const cameras = [
      { lng: 77.2, lat: 28.6, status: 'online' },
      { lng: 77.22, lat: 28.63, status: 'online' },
      { lng: 77.18, lat: 28.58, status: 'offline' }
    ];

    cameras.forEach(cam => {
      const el = document.createElement('div');
      el.className = `w-3 h-3 rounded-full border-2 border-black ${cam.status === 'online' ? 'bg-online' : 'bg-alert'}`;
      
      new maplibregl.Marker(el)
        .setLngLat([cam.lng, cam.lat])
        .addTo(map);
    });

    return () => map.remove();
  }, []);

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b border-gray-800 flex justify-between items-center bg-black/50">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Live Map</h2>
        <div className="text-[10px] text-gray-500 flex space-x-2">
           <span className="flex items-center"><span className="w-2 h-2 bg-online rounded-full inline-block mr-1"></span> Online</span>
           <span className="flex items-center"><span className="w-2 h-2 bg-alert rounded-full inline-block mr-1"></span> Offline</span>
        </div>
      </div>
      <div ref={mapContainer} className="flex-1 w-full bg-black"></div>
    </div>
  );
}
