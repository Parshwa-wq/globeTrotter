import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto dismiss
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.9 }}
              className="pointer-events-auto"
            >
              <ToastItem toast={toast} onRemove={() => removeToast(toast.id)} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

const ToastItem = ({ toast, onRemove }) => {
  const getIcon = () => {
    switch (toast.type) {
      case 'error': return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'success': return <CheckCircle className="w-5 h-5 text-neon-green" />;
      default: return <Info className="w-5 h-5 text-neon-cyan" />;
    }
  };

  const getBorderColor = () => {
    switch (toast.type) {
      case 'error': return 'border-red-500/30 bg-red-950/30';
      case 'success': return 'border-neon-green/30 bg-black/80';
      default: return 'border-neon-cyan/30 bg-black/80';
    }
  };

  return (
    <div className={`flex items-start gap-3 p-4 rounded-xl border backdrop-blur-md shadow-2xl min-w-[300px] max-w-[400px] ${getBorderColor()}`}>
      <div className="shrink-0 mt-0.5">{getIcon()}</div>
      <p className="text-sm font-inter text-white/90 flex-1">{toast.message}</p>
      <button onClick={onRemove} className="shrink-0 text-white/40 hover:text-white transition-colors">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};
