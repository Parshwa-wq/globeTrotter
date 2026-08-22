import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Loader2, Copy } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';
import { Skeleton } from '../components/Skeleton';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { TopographicBackground } from '../components/TopographicBackground';

export default function SharedTripPage() {
  const { shareId } = useParams();
  const [tripData, setTripData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cloning, setCloning] = useState(false);
  
  const { addToast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSharedTrip = async () => {
      try {
        const response = await api.get(`/share/${shareId}`);
        setTripData(response.data.data);
      } catch (err) {
        console.error('Error fetching shared trip:', err);
        setError('This shared trip link is invalid or has expired.');
      } finally {
        setLoading(false);
      }
    };
    fetchSharedTrip();
  }, [shareId]);

  const handleClone = async () => {
    if (!user) {
      addToast('You must be logged in to clone a trip.', 'info');
      navigate('/login');
      return;
    }

    try {
      setCloning(true);
      const response = await api.post(`/share/${shareId}/clone`);
      if (response.data.success) {
        addToast('Trip successfully cloned to your account!', 'success');
        navigate(`/trips/${response.data.data.newTripId}`);
      } else {
        addToast(response.data.message || 'Failed to clone trip.', 'error');
      }
    } catch (err) {
      console.error('Error cloning trip:', err);
      addToast('An error occurred while cloning this trip.', 'error');
    } finally {
      setCloning(false);
    }
  };

  const getGradient = (text) => {
    if (!text) return '#111';
    let hash = 0;
    for (let i = 0; i < text.length; i++) hash = text.charCodeAt(i) + ((hash << 5) - hash);
    const h1 = Math.abs(hash) % 360;
    const h2 = (h1 + 40) % 360;
    return `linear-gradient(135deg, hsl(${h1}, 70%, 15%), hsl(${h2}, 70%, 5%))`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <Skeleton className="h-12 w-1/3 mb-4" />
        <Skeleton className="h-6 w-1/4 mb-12" />
        <div className="bento-card max-w-4xl mx-auto"><Skeleton className="h-40 w-full" /></div>
      </div>
    );
  }

  if (error || !tripData) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8">
        <div className="p-8 rounded-2xl glass-panel bg-red-950/30 border-red-500/30 text-red-100 flex flex-col items-center max-w-md text-center">
          <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
             <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
          </div>
          <h2 className="font-grotesk text-2xl font-bold mb-2">Link Expired</h2>
          <p className="font-mono text-sm text-red-100/70">{error}</p>
          <Link to="/" className="mt-8 px-6 py-3 bg-white text-black font-bold font-mono text-sm rounded-lg hover:bg-neon-green transition-colors">
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  }

  const { trip, stops } = tripData;

  return (
    <div className="min-h-screen bg-black text-white relative selection:bg-neon-green selection:text-black overflow-x-hidden pb-20">
      <TopographicBackground />
      
      {/* Navbar overlay */}
      <nav className="sticky top-0 z-40 w-full px-6 py-4 bg-black/50 backdrop-blur-md border-b border-white/5 flex justify-between items-center">
        <Link to="/" className="font-grotesk font-bold text-2xl tracking-tighter hover:text-neon-green transition-colors">
          Globe<span className="text-neon-green">Trotter</span>
        </Link>
        
        <div className="flex items-center gap-4">
          {!user ? (
            <Link to="/login" className="font-mono text-xs uppercase tracking-widest text-white/50 hover:text-white transition-colors">Sign In</Link>
          ) : (
            <Link to="/dashboard" className="font-mono text-xs uppercase tracking-widest text-white/50 hover:text-white transition-colors">Dashboard</Link>
          )}
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-12 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 border-l-2 border-neon-cyan pl-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neon-cyan/30 bg-neon-cyan/10 text-neon-cyan font-mono text-[10px] uppercase tracking-widest mb-4">
              <MapPin className="w-3 h-3" /> Public Itinerary
            </div>
            <h1 className="font-grotesk text-4xl md:text-6xl font-bold tracking-tight mb-4">
              {trip.title}
            </h1>
            
            {(trip.start_date || trip.end_date) && (
              <div className="flex items-center gap-2 text-sm text-gray-400 font-mono">
                <Calendar className="w-4 h-4 text-white/40" />
                <span>
                  {trip.start_date ? new Date(trip.start_date).toLocaleDateString(undefined, {month: 'long', day: 'numeric', year: 'numeric'}) : 'TBD'} 
                  {' - '} 
                  {trip.end_date ? new Date(trip.end_date).toLocaleDateString(undefined, {month: 'long', day: 'numeric', year: 'numeric'}) : 'TBD'}
                </span>
              </div>
            )}
            {trip.description && <p className="mt-4 text-[#888] font-inter max-w-2xl">{trip.description}</p>}
          </div>

          <button 
            onClick={handleClone}
            disabled={cloning}
            className="shrink-0 group relative px-6 py-4 bg-[#111] hover:bg-neon-cyan border border-[#333] hover:border-neon-cyan rounded-xl transition-all duration-300 overflow-hidden flex items-center justify-center gap-3 shadow-2xl hover:shadow-[0_0_30px_rgba(0,255,255,0.3)] disabled:opacity-50"
          >
            {cloning ? (
              <Loader2 className="w-5 h-5 animate-spin text-white group-hover:text-black" />
            ) : (
              <Copy className="w-5 h-5 text-white group-hover:text-black transition-colors" />
            )}
            <span className="font-mono font-bold uppercase tracking-widest text-sm text-white group-hover:text-black transition-colors">
              Clone Trip
            </span>
          </button>
        </div>

        {/* Read-Only Timeline */}
        <div className="relative">
           {/* Timeline central line */}
           <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#333] to-transparent -translate-x-1/2 hidden md:block"></div>

           <div className="space-y-12 md:space-y-24">
             {stops.length > 0 ? stops.map((stop) => (
               <motion.div 
                 key={stop.id}
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: 0.1 }}
                 className="relative flex items-center justify-end md:justify-between md:odd:flex-row-reverse group"
               >
                 <div className="hidden md:block w-[calc(50%-2.5rem)]"></div>

                 {/* Timeline Icon */}
                 <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-[#020202] bg-[#111] group-hover:bg-neon-cyan group-hover:text-black text-white/50 transition-colors shadow-[0_0_0_1px_#333] group-hover:shadow-[0_0_15px_rgba(0,255,255,0.4)] absolute left-0 md:left-1/2 -translate-x-0 md:-translate-x-1/2 z-10">
                   <MapPin className="w-5 h-5" />
                 </div>

                 {/* Stop Card */}
                 <div 
                   className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 bento-card border-[#222] hover:border-white/20 transition-all duration-500 relative overflow-hidden"
                   style={{ background: getGradient(stop.stop_name) }}
                 >
                   <div className="absolute inset-0 bg-[#0a0a0a] transition-opacity duration-500 group-hover:opacity-60 pointer-events-none" />
                   
                   <div className="relative z-10">
                     <h3 className="font-grotesk text-2xl font-bold mb-4 text-white group-hover:text-neon-cyan transition-colors">{stop.stop_name}</h3>
                     <div className="flex items-center gap-4 text-xs font-mono text-white/50 mb-6 pb-6 border-b border-[#333]">
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

                     <div className="space-y-3">
                       {stop.activities && stop.activities.length > 0 ? stop.activities.map(act => (
                         <div key={act.id} className="flex items-start gap-3 p-3 bg-black/40 rounded-lg border border-white/5">
                           <div className="w-1.5 h-1.5 mt-1.5 rounded-full bg-neon-cyan/50"></div>
                           <div>
                             <h4 className="font-bold text-sm text-white">{act.title}</h4>
                             {act.description && <p className="text-xs text-white/50 mt-1">{act.description}</p>}
                           </div>
                         </div>
                       )) : (
                         <p className="text-xs font-mono text-white/30 italic">No activities planned.</p>
                       )}
                     </div>
                   </div>
                 </div>
               </motion.div>
             )) : (
               <div className="text-center py-20">
                 <p className="font-mono text-white/30 uppercase tracking-widest">This itinerary is empty.</p>
               </div>
             )}
           </div>
        </div>
      </main>
    </div>
  );
}
