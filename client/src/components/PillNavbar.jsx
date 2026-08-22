import React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Map, Activity, Settings } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export function PillNavbar() {
  const location = useLocation();
  
  const navItems = [
    { id: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: '/trips', label: 'Trips', icon: Map },
    { id: '/budget', label: 'Budget', icon: Activity },
  ];

  return (
    <>
      {/* Main Core Navigation */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
        <div className="flex items-center gap-1 p-1.5 bg-[#0a0a0a]/80 backdrop-blur-xl border border-[#1a1a1a] rounded-full shadow-2xl">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.id);
            const Icon = item.icon;
            
            return (
              <Link
                key={item.id}
                to={item.id}
                className="relative px-5 py-2.5 rounded-full flex items-center gap-2 text-sm font-mono uppercase tracking-widest transition-colors duration-300"
                style={{ color: isActive ? '#000' : 'rgba(255,255,255,0.5)' }}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute inset-0 bg-neon-green rounded-full"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  <span className="hidden md:block font-bold">{item.label}</span>
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

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
