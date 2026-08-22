import React from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PillNavbar } from '../components/PillNavbar';
import { TopographicBackground } from '../components/TopographicBackground';

export default function MainLayout() {
  const { user } = useAuth();
  const location = useLocation();

  // Protect routes - if no user, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Force Admins to the Admin Terminal or Settings ONLY
  if (user.role === 'admin' && location.pathname !== '/settings') {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="relative min-h-[100dvh] bg-[#020202] text-white font-inter selection:bg-neon-green selection:text-black">
      <PillNavbar />
      
      {/* Interactive Topographic Canvas Background */}
      <TopographicBackground />

      {/* Background ambient glow matching UI kit aesthetic */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-neon-green/5 blur-[150px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-neon-cyan/5 blur-[150px]" />
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-8 min-h-screen flex flex-col">
        <Outlet />
      </main>
    </div>
  );
}
