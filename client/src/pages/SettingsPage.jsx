import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, LogOut, Shield, Bell, Moon, CreditCard, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [currency, setCurrency] = useState('USD');
  const [notifications, setNotifications] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getAvatarGradient = (name) => {
    if (!name) return 'bg-[#0a0a0a]';
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    const h1 = Math.abs(hash) % 360;
    const h2 = (h1 + 40) % 360;
    return `linear-gradient(135deg, hsl(${h1}, 70%, 20%), hsl(${h2}, 70%, 10%))`;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="w-full h-full flex flex-col pt-8">
      <div className="mb-8">
        <h1 className="font-grotesk text-4xl md:text-5xl font-bold tracking-tight text-white shadow-sm mb-2">Settings</h1>
        <p className="font-mono text-xs text-white/50 uppercase tracking-widest flex items-center gap-2">
          Manage your account preferences
        </p>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Profile Card */}
        <motion.div variants={itemVariants} className="lg:col-span-1 bento-card p-6 flex flex-col items-center text-center">
          <div 
            className="w-24 h-24 rounded-full mb-4 shadow-[0_0_30px_rgba(57,255,20,0.1)] flex items-center justify-center text-3xl font-grotesk font-bold text-white uppercase"
            style={{ background: getAvatarGradient(user?.name) }}
          >
            {user?.name?.charAt(0) || 'U'}
          </div>
          <h2 className="font-grotesk text-2xl font-bold text-white mb-1">{user?.name}</h2>
          <div className="flex items-center justify-center gap-2 text-white/50 font-mono text-xs">
            <Mail className="w-3 h-3" />
            {user?.email}
          </div>
          
          <div className="w-full h-px bg-[#222] my-6"></div>
          
          <div className="w-full flex items-center justify-between text-xs font-mono text-white/40 uppercase tracking-widest">
            <span>Account Status</span>
            <span className="text-neon-green">Active</span>
          </div>
        </motion.div>

        {/* Preferences Grid */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Theme Preference (Read Only Showcase) */}
          <motion.div variants={itemVariants} className="bento-card p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <Moon className="w-24 h-24 -rotate-12 translate-x-4 -translate-y-4" />
            </div>
            <h3 className="font-mono text-xs uppercase tracking-widest text-white/50 mb-4 flex items-center gap-2">
              <Moon className="w-4 h-4 text-neon-green" /> Theme
            </h3>
            <div className="text-xl font-grotesk font-bold text-white mb-2">Dark Mode</div>
            <p className="text-sm text-white/40 font-inter mb-4">Hardcoded to strictly adhere to Finvest visual aesthetics.</p>
            <div className="w-full bg-[#111] border border-[#222] rounded-lg p-3 flex items-center justify-between">
              <span className="text-sm text-white/70">System Sync</span>
              <div className="w-10 h-5 bg-neon-green/20 rounded-full relative">
                <div className="absolute right-1 top-0.5 w-4 h-4 bg-neon-green rounded-full shadow-[0_0_10px_rgba(57,255,20,0.5)]"></div>
              </div>
            </div>
          </motion.div>

          {/* Currency Preference (Interactive) */}
          <motion.div variants={itemVariants} className="bento-card p-6 relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <CreditCard className="w-24 h-24 -rotate-12 translate-x-4 -translate-y-4" />
            </div>
            <h3 className="font-mono text-xs uppercase tracking-widest text-white/50 mb-4 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-neon-cyan" /> Default Currency
            </h3>
            <div className="text-xl font-grotesk font-bold text-white mb-2">Base Denomination</div>
            <p className="text-sm text-white/40 font-inter mb-4">Used for budget aggregation across all international trips.</p>
            <div className="grid grid-cols-3 gap-2">
              {['USD', 'EUR', 'INR'].map((curr) => (
                <button
                  key={curr}
                  onClick={() => setCurrency(curr)}
                  className={`py-2 text-xs font-mono font-bold rounded-lg border transition-all ${
                    currency === curr 
                      ? 'bg-neon-cyan/10 border-neon-cyan text-neon-cyan' 
                      : 'bg-[#111] border-[#222] text-white/40 hover:border-white/20'
                  }`}
                >
                  {curr}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Security & Data */}
          <motion.div variants={itemVariants} className="md:col-span-2 bento-card p-6">
            <h3 className="font-mono text-xs uppercase tracking-widest text-white/50 mb-4 flex items-center gap-2">
              <Shield className="w-4 h-4 text-neon-orange" /> Security & Session
            </h3>
            <div className="space-y-2">
              <button className="w-full flex items-center justify-between p-4 bg-[#111] hover:bg-[#151515] border border-[#222] hover:border-white/20 rounded-xl transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                    <LogOut className="w-4 h-4 text-white/50 group-hover:text-red-500 transition-colors" />
                  </div>
                  <div className="text-sm font-bold text-white/80 group-hover:text-red-500 transition-colors">Sign Out Everywhere</div>
                </div>
                <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/50 transition-colors" />
              </button>
              
              <button onClick={handleLogout} className="w-full flex items-center justify-between p-4 bg-[#111] hover:bg-red-500/10 border border-[#222] hover:border-red-500/30 rounded-xl transition-all group mt-2">
                <div className="flex items-center gap-3">
                  <div className="text-sm font-bold text-red-500">Log Out of Current Session</div>
                </div>
              </button>
            </div>
          </motion.div>

        </div>
      </motion.div>
    </div>
  );
}
