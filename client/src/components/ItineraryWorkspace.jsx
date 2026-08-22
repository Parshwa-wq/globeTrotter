import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Plus, Calendar, Clock, Map, MoreVertical, Loader2, X, Navigation, Trash2, Compass } from 'lucide-react';
import api from '../services/api';
import { Skeleton } from './Skeleton';
import StopActivities from './StopActivities';
import ConfirmModal from './ConfirmModal';
import { useToast } from '../context/ToastContext';

export default function ItineraryWorkspace({ tripId, tripStartDate, tripEndDate, tripStatus }) {
  const [stops, setStops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAddingStop, setIsAddingStop] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [expandedStops, setExpandedStops] = useState([]);
  
  const isReadOnly = tripStatus === 'completed';

  const formatInputDate = (isoString) => {
    if (!isoString) return '';
    return new Date(isoString).toISOString().split('T')[0];
  };

  const minDate = formatInputDate(tripStartDate);
  const maxDate = formatInputDate(tripEndDate);

  const getGradient = (name) => {
    if (!name) return 'bg-[#0a0a0a]';
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    const h1 = Math.abs(hash) % 360;
    const h2 = (h1 + 40) % 360;
    return `linear-gradient(135deg, hsl(${h1}, 70%, 15%), hsl(${h2}, 70%, 5%))`;
  };

  const toggleStopExpansion = React.useCallback((id) => {
    setExpandedStops(prev => 
      prev.includes(id) ? prev.filter(sId => sId !== id) : [...prev, id]
    );
  }, []);

  // Form state
  const [formData, setFormData] = useState({
    stop_name: '',
    arrival_date: minDate,
    departure_date: maxDate
  });

  const fetchStops = async () => {
    try {
      const response = await api.get(`/trips/${tripId}/stops`);
      setStops(response.data.data || []);
    } catch (err) {
      console.error('Failed to fetch stops:', err);
      setError('Could not load itinerary stops.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStops();
  }, [tripId]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const { addToast } = useToast();
  const [stopToDelete, setStopToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const handleAddStop = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post(`/trips/${tripId}/stops`, formData);
      await fetchStops();
      setIsAddingStop(false);
      setFormData(prev => ({ ...prev, stop_name: '' }));
      addToast('Stop initialized successfully.', 'success');
    } catch (err) {
      console.error('Failed to add stop:', err);
      addToast('Failed to add stop. Check dates and try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const executeDeleteStop = async () => {
    if (!stopToDelete) return;
    setDeleting(true);
    try {
      await api.delete(`/trips/${tripId}/stops/${stopToDelete}`);
      await fetchStops();
      addToast('Stop and all nested activities deleted.', 'success');
    } catch (err) {
      console.error('Failed to delete stop:', err);
      addToast('Failed to delete stop.', 'error');
    } finally {
      setDeleting(false);
      setStopToDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="w-full space-y-4">
        <Skeleton className="h-32 w-full rounded-2xl" />
        <Skeleton className="h-32 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex justify-between items-end mb-6 border-b border-[#222] pb-4">
        <div>
          <h2 className="text-2xl font-bold font-grotesk flex items-center gap-2">
            <Navigation className="w-5 h-5 text-neon-green" />
            Mission Stops
          </h2>
          <p className="text-sm text-[#888] font-inter mt-1">
            Chronological layout of your destinations.
          </p>
        </div>
        
        {!isAddingStop && !isReadOnly && (
          <button 
            onClick={() => setIsAddingStop(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#111] border border-[#333] hover:border-neon-green text-white hover:text-neon-green rounded-lg transition-colors font-mono text-xs uppercase tracking-widest"
          >
            <Plus className="w-4 h-4" /> Add Stop
          </button>
        )}
      </div>

      {/* Add Stop Form */}
      <AnimatePresence>
        {isAddingStop && (
          <motion.div 
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            className="overflow-hidden"
          >
            <div className="bento-card mb-6 border-neon-green/30 bg-[#0a0a0a]">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-neon-green font-mono uppercase tracking-widest text-sm">Deploy New Stop</h3>
                <button onClick={() => setIsAddingStop(false)} className="text-[#888] hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <form onSubmit={handleAddStop} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5 md:col-span-1">
                    <label className="text-[10px] font-mono uppercase tracking-widest text-white/50 ml-1">Stop Name</label>
                    <input type="text" name="stop_name" required value={formData.stop_name} onChange={handleInputChange} placeholder="e.g. Paris or Eiffel Tower" className="w-full bg-[#111] border border-[#222] focus:border-neon-green rounded-lg py-2 px-3 text-white focus:outline-none transition-all text-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-widest text-white/50 ml-1">Arrival Date</label>
                    <input type="date" name="arrival_date" required min={minDate} max={maxDate} value={formData.arrival_date} onChange={handleInputChange} className="w-full bg-[#111] border border-[#222] focus:border-neon-green rounded-lg py-2 px-3 text-white focus:outline-none transition-all text-sm [color-scheme:dark]" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-widest text-white/50 ml-1">Departure Date</label>
                    <input type="date" name="departure_date" required min={formData.arrival_date || minDate} max={maxDate} value={formData.departure_date} onChange={handleInputChange} className="w-full bg-[#111] border border-[#222] focus:border-neon-green rounded-lg py-2 px-3 text-white focus:outline-none transition-all text-sm [color-scheme:dark]" />
                  </div>
                </div>

                <button disabled={submitting} type="submit" className="w-full mt-2 py-2.5 bg-neon-green hover:bg-neon-green/90 text-black font-bold font-mono text-sm uppercase tracking-widest rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm Stop'}
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stops Timeline */}
      {stops.length === 0 ? (
        <div className="bento-card py-16 flex flex-col items-center justify-center border-dashed border-[#333]">
          <Map className="w-12 h-12 text-white/20 mb-4" />
          <h3 className="font-mono text-sm uppercase tracking-widest text-white/50 mb-2">No Stops Deployed</h3>
          <p className="text-xs text-[#888] font-inter text-center max-w-sm">
            Your itinerary is currently empty. Initialize a new stop to begin planning your route.
          </p>
          {!isAddingStop && (
            <button onClick={() => setIsAddingStop(true)} className="mt-6 px-6 py-2 bg-neon-green text-black font-bold font-mono text-xs uppercase tracking-widest rounded-lg hover:bg-neon-green/90 transition-all">
              Initialize First Stop
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4 relative before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-[#333] before:to-transparent">
          {stops.map((stop, index) => (
            <motion.div 
              key={stop.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="relative flex items-center justify-end md:justify-between md:odd:flex-row-reverse group is-active"
            >
              {/* Timeline Icon */}
              <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-[#020202] bg-[#111] group-hover:bg-neon-green group-hover:text-black text-white/50 transition-colors shadow-[0_0_0_1px_#333] group-hover:shadow-[0_0_15px_rgba(57,255,20,0.4)] absolute left-0 md:left-1/2 -translate-x-0 md:-translate-x-1/2 z-10">
                <MapPin className="w-5 h-5" />
              </div>

              {/* Spacer for alternating layout */}
              <div className="hidden md:block w-[calc(50%-2.5rem)]"></div>

              {/* Card */}
              <div 
                className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-5 bento-card border-[#222] hover:border-white/20 transition-all duration-500 relative overflow-hidden"
                style={{ background: getGradient(stop.stop_name) }}
              >
                {/* Black overlay that fades out on hover to reveal the 'wallpaper' gradient */}
                <div className="absolute inset-0 bg-[#0a0a0a] transition-opacity duration-500 group-hover:opacity-40 pointer-events-none" />

                {/* Compass Watermark */}
                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-10 transition-all duration-500 pointer-events-none">
                  <Compass className="w-48 h-48 -rotate-12 translate-x-12 -translate-y-12 text-white scale-75 group-hover:scale-100 transition-transform duration-700" />
                </div>

                <div className="absolute top-0 right-0 p-4 z-10">
                   <span className="font-mono text-[10px] text-neon-green border border-neon-green/30 bg-black/50 backdrop-blur-sm px-2 py-1 rounded">STOP {index + 1}</span>
                </div>
                
                <div className="relative z-10">
                  <h3 className="font-grotesk text-xl font-bold mb-4 group-hover:text-neon-green transition-colors">{stop.stop_name}</h3>
                  
                  <div className="flex items-center gap-4 text-xs font-mono text-white/50">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(stop.arrival_date).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}</span>
                    </div>
                    <div className="w-1 h-px bg-[#333]"></div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(stop.departure_date).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}</span>
                    </div>
                  </div>
                </div>

                 <div className="mt-4 pt-4 border-t border-[#222] flex justify-between items-center">
                   <button 
                     onClick={() => toggleStopExpansion(stop.id)}
                     className="text-[10px] font-mono uppercase tracking-widest text-neon-green hover:text-white transition-colors flex items-center gap-2"
                   >
                     {expandedStops.includes(stop.id) ? 'Close Activities' : 'Manage Activities'}
                   </button>
                   {!isReadOnly && (
                     <button 
                       onClick={() => setStopToDelete(stop.id)}
                       className="text-white/30 hover:text-red-500 transition-colors"
                       title="Delete Stop"
                     >
                       <Trash2 className="w-4 h-4" />
                     </button>
                   )}
                 </div>

                <AnimatePresence>
                  {expandedStops.includes(stop.id) && (
                    <StopActivities stopId={stop.id} isReadOnly={isReadOnly} />
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <ConfirmModal 
        isOpen={!!stopToDelete}
        onClose={() => setStopToDelete(null)}
        onConfirm={executeDeleteStop}
        title="Delete Stop?"
        message="Are you sure you want to completely delete this stop? All activities and budget expenses associated with it will be permanently erased."
        isProcessing={deleting}
      />
    </div>
  );
}
