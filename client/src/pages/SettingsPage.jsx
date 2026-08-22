import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, LogOut, Shield, Bell, Moon, CreditCard, ChevronRight, Trash2, AlertTriangle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getPreferredCurrency, setPreferredCurrency } from '../utils/currency';
import { useToast } from '../context/ToastContext';

export default function SettingsPage() {
  const { user, logout, deleteAccount } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [currency, setCurrencyState] = useState(getPreferredCurrency());
  const [notifications, setNotifications] = useState(true);
  const [lightMode, setLightMode] = useState(document.body.classList.contains('light-mode'));
  
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const setCurrency = (curr) => {
    setCurrencyState(curr);
    setPreferredCurrency(curr);
    addToast(`Global denomination set to ${curr}`, 'success');
  };

  const handleToggleNotifications = () => {
    setNotifications(!notifications);
    addToast(
      !notifications ? 'Push notifications enabled.' : 'Push notifications disabled.',
      !notifications ? 'success' : 'info'
    );
  };

  const handleToggleTheme = () => {
    const isLight = document.body.classList.toggle('light-mode');
    setLightMode(isLight);
    localStorage.setItem('globetrotter_theme', isLight ? 'light' : 'dark');
    addToast(`Switched to ${isLight ? 'Light' : 'Dark'} Mode`, 'info');
  };

  const executeDeleteAccount = async () => {
    setDeleting(true);
    const result = await deleteAccount();
    if (result.success) {
      addToast('Account and all associated data permanently deleted.', 'success');
      navigate('/login');
    } else {
      addToast(result.message || 'Failed to delete account.', 'error');
      setShowDeleteConfirm(false);
      setDeleting(false);
    }
  };

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

          {/* Notifications Preference */}
          <motion.div variants={itemVariants} className="bento-card p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <Bell className="w-24 h-24 -rotate-12 translate-x-4 -translate-y-4" />
            </div>
            <h3 className="font-mono text-xs uppercase tracking-widest text-white/50 mb-4 flex items-center gap-2">
              <Bell className="w-4 h-4 text-neon-orange" /> Notifications
            </h3>
            <div className="text-xl font-grotesk font-bold text-white mb-2">System Alerts</div>
            <p className="text-sm text-white/40 font-inter mb-4">Receive updates for trip modifications and budget thresholds.</p>
            <button 
              onClick={handleToggleNotifications}
              className={`w-full border rounded-lg p-3 flex items-center justify-between transition-all ${
                notifications 
                  ? 'bg-neon-orange/10 border-neon-orange' 
                  : 'bg-[#111] border-[#222] hover:border-white/20'
              }`}
            >
              <span className={`text-sm font-bold ${notifications ? 'text-neon-orange' : 'text-white/40'}`}>
                {notifications ? 'Enabled' : 'Disabled'}
              </span>
              <div className={`w-10 h-5 rounded-full relative transition-colors ${notifications ? 'bg-neon-orange/30' : 'bg-[#222]'}`}>
                <div className={`absolute top-0.5 w-4 h-4 rounded-full shadow-md transition-all ${
                  notifications ? 'right-1 bg-neon-orange shadow-[0_0_10px_rgba(255,165,0,0.5)]' : 'left-1 bg-white/40'
                }`}></div>
              </div>
            </button>
          </motion.div>

          {/* Theme Preference */}
          <motion.div variants={itemVariants} className="bento-card p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <Moon className="w-24 h-24 -rotate-12 translate-x-4 -translate-y-4" />
            </div>
            <h3 className="font-mono text-xs uppercase tracking-widest text-white/50 mb-4 flex items-center gap-2">
              <Moon className="w-4 h-4 text-neon-cyan" /> Appearance
            </h3>
            <div className="text-xl font-grotesk font-bold text-white mb-2">Display Mode</div>
            <p className="text-sm text-white/40 font-inter mb-4">Toggle between tactical dark mode and high-contrast light mode.</p>
            <button 
              onClick={handleToggleTheme}
              className={`w-full border rounded-lg p-3 flex items-center justify-between transition-all ${
                lightMode 
                  ? 'bg-neon-cyan/10 border-neon-cyan' 
                  : 'bg-[#111] border-[#222] hover:border-white/20'
              }`}
            >
              <span className={`text-sm font-bold ${lightMode ? 'text-neon-cyan' : 'text-white/40'}`}>
                {lightMode ? 'Light Mode' : 'Dark Mode'}
              </span>
              <div className={`w-10 h-5 rounded-full relative transition-colors ${lightMode ? 'bg-neon-cyan/30' : 'bg-[#222]'}`}>
                <div className={`absolute top-0.5 w-4 h-4 rounded-full shadow-md transition-all ${
                  lightMode ? 'right-1 bg-neon-cyan shadow-[0_0_10px_rgba(0,240,255,0.5)]' : 'left-1 bg-white/40'
                }`}></div>
              </div>
            </button>
          </motion.div>

          {/* Security & Data */}
          <motion.div variants={itemVariants} className="bento-card p-6">
            <h3 className="font-mono text-xs uppercase tracking-widest text-white/50 mb-4 flex items-center gap-2">
              <Shield className="w-4 h-4 text-red-500" /> Security
            </h3>
            <div className="space-y-2">
              <button 
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full flex items-center justify-between p-4 bg-red-950/20 hover:bg-red-900/40 border border-red-500/20 hover:border-red-500/50 rounded-xl transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center">
                    <Trash2 className="w-4 h-4 text-red-500 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="text-sm font-bold text-red-500 group-hover:text-red-400 transition-colors">Delete Account</div>
                </div>
                <span className="text-[10px] font-mono text-red-500/50 group-hover:text-red-500/80 transition-colors">DANGER ZONE</span>
              </button>
              
              {user?.role === 'admin' && (
                <Link 
                  to="/admin"
                  className="w-full flex items-center justify-center p-4 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/50 rounded-xl transition-all mt-4"
                >
                  <div className="text-sm font-bold text-red-500 flex items-center gap-2">
                    <Shield className="w-4 h-4" /> Admin Console
                  </div>
                </Link>
              )}
              
              <button 
                onClick={handleLogout} 
                className="w-full flex items-center justify-center p-4 bg-[#111] hover:bg-white/5 border border-[#222] hover:border-white/20 rounded-xl transition-all group mt-2"
              >
                <div className="text-sm font-bold text-white/50 group-hover:text-white transition-colors">Log Out</div>
              </button>
            </div>
          </motion.div>

        </div>
      </motion.div>

      {/* Custom Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => !deleting && setShowDeleteConfirm(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-[#0a0a0a] border border-[#222] rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center shrink-0 border border-red-500/20">
                    <AlertTriangle className="w-6 h-6 text-red-500" />
                  </div>
                  <div>
                    <h3 className="font-grotesk text-xl font-bold text-white mb-2">Delete Account?</h3>
                    <p className="text-sm text-white/50 font-inter mb-4">
                      This action cannot be undone. This will permanently delete your account, along with all of your trips, stops, activities, and financial data.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-6">
                  <button 
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={deleting}
                    className="flex-1 py-3 px-4 rounded-xl border border-[#333] hover:bg-[#111] text-white font-mono text-sm uppercase tracking-widest transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={executeDeleteAccount}
                    disabled={deleting}
                    className="flex-1 py-3 px-4 rounded-xl bg-red-500 hover:bg-red-600 text-white font-mono text-sm uppercase tracking-widest transition-colors flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(239,68,68,0.3)] disabled:opacity-50"
                  >
                    {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    Confirm Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
