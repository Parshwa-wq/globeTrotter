import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Plane, Train, Car } from 'lucide-react';
import { renderToString } from 'react-dom/server';

const createNeonIcon = (IconComponent, colorClass) => {
  const iconHtml = renderToString(
    <div className={`p-2 rounded-full bg-black/80 border border-[#222] shadow-[0_0_15px_rgba(127,255,0,0.3)] backdrop-blur-md flex items-center justify-center`}>
      <IconComponent className={`w-5 h-5 ${colorClass}`} />
    </div>
  );
  return L.divIcon({ html: iconHtml, className: 'custom-neon-icon', iconSize: [40, 40], iconAnchor: [20, 20] });
};

const flightIcon = createNeonIcon(Plane, 'text-neon-orange');
const trainIcon = createNeonIcon(Train, 'text-neon-green');
const carIcon = createNeonIcon(Car, 'text-white');
const dotIcon = L.divIcon({
  html: `<div class="w-3 h-3 rounded-full bg-neon-green shadow-[0_0_10px_rgba(127,255,0,1)] animate-pulse"></div>`,
  className: 'custom-dot', iconSize: [12, 12], iconAnchor: [6, 6]
});

// Component to auto-adjust map bounds to fit all real coordinates
function MapBoundsFit({ positions }) {
  const map = useMap();
  useEffect(() => {
    if (positions.length > 0) {
      const bounds = L.latLngBounds(positions);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 8 });
    }
  }, [map, positions]);
  return null;
}

export default function RouteMap({ mode = 'flight', stations = [] }) {
  // Extract REAL coordinates returned by the Python scraper!
  const positions = stations.filter(s => s.lat && s.lng).map(s => [s.lat, s.lng]);
  
  const center = positions.length > 0 ? positions[0] : [20, 0];
  const mainIcon = mode === 'flight' ? flightIcon : mode === 'train' ? trainIcon : carIcon;
  const lineColor = mode === 'flight' ? '#ff6a00' : '#7fff00';
  const lineDash = mode === 'flight' ? '10, 10' : '0';

  return (
    <div className="w-full h-full min-h-[400px] rounded-2xl overflow-hidden border border-[#333] relative">
      <div className="absolute inset-0 z-[400] pointer-events-none opacity-20 mix-blend-overlay" style={{
        backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")'
      }}></div>

      <MapContainer 
        center={center} 
        zoom={5} 
        scrollWheelZoom={true} 
        style={{ height: '100%', width: '100%', background: '#020202' }}
        className="brightness-75 contrast-125 hover:brightness-100 transition-all duration-700"
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">Carto</a>'
        />

        <MapBoundsFit positions={positions} />

        {positions.length > 1 && (
          <Polyline positions={positions} color={lineColor} weight={3} opacity={0.6} dashArray={lineDash} className="animate-dash" />
        )}

        {stations.map((station, index) => {
          if (!station.lat || !station.lng) return null;
          const isEndpoint = index === 0 || index === stations.length - 1;
          return (
            <Marker key={index} position={[station.lat, station.lng]} icon={isEndpoint ? mainIcon : dotIcon}>
              <Popup className="custom-popup">
                <div className="bg-[#111] p-2 rounded text-white font-mono text-xs border border-[#333]">
                  <span className="text-neon-green font-bold uppercase tracking-widest">{station.type}</span>
                  <br />{station.name}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
