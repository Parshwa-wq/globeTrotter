import React from 'react';
import { motion, LayoutGroup } from 'framer-motion';
import { LayoutDashboard, Map, Activity, Settings } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function PillNavbar() {
  const location = useLocation();
  const { user } = useAuth();
  
  const navItems = [
    { id: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: '/trips', label: 'Trips', icon: Map }
  ];

  return (
    <>
      {/* Main Core Navigation */}
      {user?.role !== 'admin' && (
        <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
          <div className="relative flex items-center p-1.5 bg-[#0a0a0a]/80 backdrop-blur-xl border border-[#1a1a1a] rounded-full shadow-2xl">
            
            {/* The Single Sliding Background Pill */}
            <motion.div
              className="absolute top-1.5 bottom-1.5 left-1.5 w-[140px] bg-neon-green rounded-full shadow-[0_0_15px_rgba(57,255,20,0.3)]"
              initial={false}
              animate={{
                x: Math.max(0, navItems.findIndex(item => location.pathname.startsWith(item.id))) * 140,
              }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />

            {navItems.map((item) => {
              const isActive = location.pathname.startsWith(item.id);
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.id}
                  to={item.id}
                  className={`relative z-10 w-[140px] py-2.5 rounded-full flex items-center justify-center gap-2 text-sm font-mono uppercase tracking-widest transition-colors duration-300 ${isActive ? 'text-black font-bold' : 'text-white/50 hover:text-white'}`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden md:block">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      )}

      {/* Floating Settings Button in Top Right */}
      <div className="fixed top-6 right-6 z-50">
        <Link
          to="/settings"
          className="flex items-center justify-center w-12 h-12 bg-[#0a0a0a]/80 backdrop-blur-xl border border-[#1a1a1a] hover:border-white/20 hover:text-white rounded-full shadow-2xl transition-all duration-300 text-gray-400 hover:rotate-90 group"
        >
          <Settings className="w-5 h-5 group-hover:text-neon-green transition-colors" />
        </Link>
      </div>
    </>
  );
}
