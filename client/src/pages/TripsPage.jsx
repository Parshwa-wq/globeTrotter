import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ArrowRight, Map, Plane } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Skeleton } from '../components/Skeleton';

export default function TripsPage() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await api.get('/trips');
        setTrips(response.data.data || []);
      } catch (err) {
        console.error("Error fetching trips:", err);
        setError("Failed to load your itineraries.");
      } finally {
        setLoading(false);
      }
    };
    fetchTrips();
  }, []);

  return (
    <div className="w-full">
      <header className="mb-8 border-l-2 border-neon-green pl-6">
        <h1 className="font-grotesk text-4xl md:text-5xl font-bold tracking-tight mb-2">
          Your Itineraries
        </h1>
        <p className="text-[#888] font-inter">Manage and review all your planned travel protocols.</p>
      </header>

      {/* Trips Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* The 'Create New' Card */}
        <Link to="/trips/new" className="bento-card h-full min-h-[220px] flex flex-col items-center justify-center group hover:border-neon-green/50 transition-all cursor-pointer border-dashed border-[#333] hover:bg-neon-green/5">
          <div className="w-12 h-12 rounded-full bg-[#111] border border-[#222] flex items-center justify-center group-hover:scale-110 transition-transform group-hover:border-neon-green/50 group-hover:text-neon-green mb-4">
            <Map className="w-5 h-5 text-white/50 group-hover:text-neon-green transition-colors" />
          </div>
          <h3 className="font-grotesk font-bold text-lg text-white group-hover:text-neon-green transition-colors">Plan New Trip</h3>
          <p className="text-xs text-white/40 font-mono mt-2 uppercase tracking-widest">Initialize Sequence</p>
        </Link>

        {/* Loading Skeletons */}
        {loading && (
          <>
            <div className="bento-card h-full min-h-[220px] flex flex-col justify-between">
               <div>
                  <Skeleton className="h-6 w-3/4 mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
               </div>
               <Skeleton className="h-10 w-full rounded-lg mt-6" />
            </div>
            <div className="bento-card h-full min-h-[220px] flex flex-col justify-between hidden md:flex">
               <div>
                  <Skeleton className="h-6 w-2/3 mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-1/2" />
               </div>
               <Skeleton className="h-10 w-full rounded-lg mt-6" />
            </div>
          </>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="col-span-full p-5 rounded-2xl glass-panel bg-red-950/30 border-red-500/30 text-red-100 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
            <span className="font-mono text-sm">{error}</span>
          </div>
        )}

    {/* Render Trips */}
        <AnimatePresence>
          {!loading && !error && trips.map((trip) => {
            
            const getTripStatus = (start, end) => {
              if (!start || !end) return { status: "draft", text: trip.status || "DRAFT", color: "text-white/40", dot: "bg-white/20" };
              const today = new Date();
              today.setHours(0,0,0,0);
              const sDate = new Date(start);
              sDate.setHours(0,0,0,0);
              const eDate = new Date(end);
              eDate.setHours(0,0,0,0);
              
              if (trip.status === 'completed' || today > eDate) {
                return { status: "concluded", text: "Concluded", color: "text-white/40", dot: "bg-white/20" };
              } else if (today < sDate) {
                const diffTime = Math.abs(sDate - today);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                return { status: "upcoming", text: `Starts in ${diffDays} Days`, color: "text-neon-orange", dot: "bg-neon-orange animate-pulse" };
              } else {
                const diffTime = Math.abs(today - sDate);
                const currentDay = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
                const totalDays = Math.ceil(Math.abs(eDate - sDate) / (1000 * 60 * 60 * 24)) + 1;
                return { status: "live", text: `Live / Day ${currentDay} of ${totalDays}`, color: "text-neon-green", dot: "bg-neon-green animate-[pulse_2s_infinite]" };
              }
            };

            const getGradient = (name) => {
              if (!name) return 'bg-[#0a0a0a]';
              let hash = 0;
              for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
              const h1 = Math.abs(hash) % 360;
              const h2 = (h1 + 40) % 360;
              return `linear-gradient(135deg, hsl(${h1}, 70%, 15%), hsl(${h2}, 70%, 5%))`;
            };

            const statusInfo = getTripStatus(trip.start_date, trip.end_date);

            return (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                key={trip.id} 
                className="bento-card group relative overflow-hidden flex flex-col shadow-lg hover:shadow-xl transition-all h-full min-h-[220px]"
                style={{ background: getGradient(trip.title) }}
              >
                {/* Dark overlay to ensure text readability */}
                <div className="absolute inset-0 bg-black/40 pointer-events-none" />
                
                {/* Status Pill */}
                <div className="absolute top-4 right-4 z-10 flex items-center gap-2 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shadow-sm">
                  <div className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`} />
                  <span className={`text-[10px] font-mono font-bold uppercase tracking-widest ${statusInfo.color}`}>
                    {statusInfo.text}
                  </span>
                </div>

                {/* Plane Watermark */}
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                  <Plane className="w-48 h-48 -rotate-12 translate-x-12 -translate-y-12 text-white" />
                </div>
                
                <div className="flex-1 relative z-10 pr-12">
                  <h3 className="font-grotesk text-2xl font-bold text-white mb-2 shadow-sm line-clamp-2">{trip.title}</h3>
                  
                  {(trip.start_date || trip.end_date) && (
                    <p className="font-mono text-[10px] text-white/50 uppercase tracking-widest flex items-center gap-2 mb-4">
                      <Calendar className="w-3 h-3" />
                      {trip.start_date ? new Date(trip.start_date).toLocaleDateString(undefined, {month: 'short', day: 'numeric'}) : 'TBD'} 
                      {' - '} 
                      {trip.end_date ? new Date(trip.end_date).toLocaleDateString(undefined, {month: 'short', day: 'numeric'}) : 'TBD'}
                    </p>
                  )}

                  {trip.description && (
                    <p className="text-sm text-white/60 font-inter line-clamp-2 mb-4">
                      {trip.description}
                    </p>
                  )}
                </div>
                
                <Link 
                  to={`/trips/${trip.id}`}
                  className="relative z-10 mt-auto w-full flex items-center justify-center gap-2 py-3 bg-black/40 hover:bg-black/60 border border-white/10 hover:border-white/30 rounded-xl transition-all font-mono text-xs font-bold uppercase tracking-widest text-white backdrop-blur-md"
                >
                  Access Trip <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
