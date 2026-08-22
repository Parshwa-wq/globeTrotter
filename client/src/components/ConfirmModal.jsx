import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Loader2, Trash2 } from 'lucide-react';

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm Delete', isProcessing = false }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => !isProcessing && onClose()}
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
                  <h3 className="font-grotesk text-xl font-bold text-white mb-2">{title}</h3>
                  <p className="text-sm text-white/50 font-inter mb-4">
                    {message}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-6">
                <button 
                  onClick={onClose}
                  disabled={isProcessing}
                  className="flex-1 py-3 px-4 rounded-xl border border-[#333] hover:bg-[#111] text-white font-mono text-sm uppercase tracking-widest transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={onConfirm}
                  disabled={isProcessing}
                  className="flex-1 py-3 px-4 rounded-xl bg-red-500 hover:bg-red-600 text-white font-mono text-sm uppercase tracking-widest transition-colors flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(239,68,68,0.3)] disabled:opacity-50"
                >
                  {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  {confirmText}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
