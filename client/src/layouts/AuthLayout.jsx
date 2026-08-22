import React from 'react';
import { Outlet } from 'react-router-dom';
import { TopographicBackground } from '../components/TopographicBackground';

export default function AuthLayout() {
  return (
    <div className="relative min-h-[100dvh] bg-[#020202] text-white font-inter selection:bg-neon-green selection:text-black flex items-center justify-center p-5">
      {/* Interactive Topographic Canvas Background */}
      <TopographicBackground />
      
      {/* Top Left Logo (Hacker style) */}
      <div className="absolute top-6 left-8 z-20 font-grotesk font-bold text-xl tracking-widest flex items-center gap-1">
        GLOBE<span className="text-neon-green">TROTTER</span>
      </div>

      {/* Content wrapper with z-index to sit above the canvas */}
      <div className="relative z-10 w-full max-w-md">
        <Outlet />
      </div>
    </div>
  );
}
