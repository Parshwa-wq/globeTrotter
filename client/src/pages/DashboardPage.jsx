import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Calendar, ArrowRight, Zap, Target, Activity } from 'lucide-react';

import api from '../services/api';
import { Skeleton } from '../components/Skeleton';
import { Link } from 'react-router-dom';

export default function DashboardPage() {
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
        setError("Failed to load your tactical trips. Re-establishing link...");
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  // Compute metrics
  const activeTrips = trips.filter(t => t.status !== 'completed').length;
  const upcomingTrip = trips
    .filter(t => t.start_date && new Date(t.start_date) >= new Date(new Date().setHours(0,0,0,0)))
    .sort((a, b) => new Date(a.start_date) - new Date(b.start_date))[0];

  return (
    <div className="w-full">
      <header className="mb-8">
        <h1 className="font-grotesk text-5xl md:text-6xl font-bold tracking-tight mb-3">
          Command Center
        </h1>
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs uppercase tracking-widest text-neon-green border border-neon-green/30 bg-neon-green/10 px-3 py-1 rounded-full flex items-center gap-2">
            <Zap className="w-3 h-3" />
            Active Session
          </span>
        </div>
      </header>

      {/* Quick Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bento-inner-block bg-[#0a0a0a] shadow-lg">
          <div className="flex items-center gap-2 text-white/50 mb-2">
            <Target className="w-4 h-4 text-neon-cyan" />
            <span className="font-mono text-xs uppercase tracking-widest">Total Trips</span>
          </div>
          <div className="font-grotesk text-3xl font-bold">{trips.length}</div>
        </div>
        <div className="bento-inner-block bg-[#0a0a0a] shadow-lg">
          <div className="flex items-center gap-2 text-white/50 mb-2">
            <Activity className="w-4 h-4 text-neon-green" />
            <span className="font-mono text-xs uppercase tracking-widest">Active Trips</span>
          </div>
          <div className="font-grotesk text-3xl font-bold">{activeTrips}</div>
        </div>
        
        {/* Next Upcoming Departure Widget */}
        <div className="bento-inner-block bg-[#0a0a0a] shadow-lg md:col-span-2 flex flex-col justify-center">
          <div className="flex items-center gap-2 text-white/50 mb-2">
             <Calendar className="w-4 h-4 text-neon-orange" />
             <span className="font-mono text-xs uppercase tracking-widest">Next Departure</span>
          </div>
          {upcomingTrip ? (
             <div className="flex items-center justify-between">
                <div>
                  <div className="font-grotesk text-xl font-bold text-white truncate max-w-[200px]">{upcomingTrip.title}</div>
                  <div className="font-mono text-xs text-neon-orange mt-1">
                    {new Date(upcomingTrip.start_date).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
                  </div>
                </div>
                <Link to={`/trips/${upcomingTrip.id}`} className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
                  <ArrowRight className="w-4 h-4 text-white" />
                </Link>
             </div>
          ) : (
             <div className="font-inter text-sm text-white/40 italic">
               No upcoming departures scheduled.
             </div>
          )}
        </div>
      </div>

      <div className="flex justify-between items-end mb-6">
         <h2 className="font-mono text-sm uppercase tracking-widest text-white/70 font-semibold">Your Itineraries</h2>
      </div>

      {/* Trips Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Create Trip Bento Card */}
        <Link to="/trips/new" className="block h-full group">
          <div className="bento-card h-full flex flex-col items-center justify-center min-h-[220px] border-dashed border-[#333] group-hover:border-neon-green group-hover:bg-neon-green/5 transition-all">
            <div className="w-14 h-14 rounded-full bg-[#111] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(127,255,0,0)] group-hover:shadow-[0_0_30px_rgba(127,255,0,0.2)]">
              <Plus className="w-6 h-6 text-white group-hover:text-neon-green transition-colors" />
            </div>
            <h3 className="font-mono text-sm uppercase tracking-widest font-bold">Plan New Trip</h3>
            <p className="text-xs text-white/40 font-inter mt-2 text-center px-4">Start building your next travel adventure.</p>
          </div>
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
            const isCompleted = trip.status === 'completed';
            const statusColor = isCompleted ? 'text-neon-cyan border-neon-cyan/20 bg-neon-cyan/10' : 'text-neon-green border-neon-green/20 bg-neon-green/10';

            return (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                key={trip.id} 
                className="bento-card h-full flex flex-col min-h-[220px] group"
              >
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-xl font-grotesk truncate pr-4">{trip.title}</h3>
                    <span className={`font-mono text-[9px] px-2 py-1 rounded border whitespace-nowrap uppercase ${statusColor}`}>
                      {trip.status || 'ACTIVE'}
                    </span>
                  </div>
                  
                  {trip.description && (
                    <p className="text-sm text-gray-400 font-inter line-clamp-2 mb-4">
                      {trip.description}
                    </p>
                  )}
                  
                  <div className="space-y-2 mt-auto">
                    {(trip.start_date || trip.end_date) && (
                      <div className="flex items-center gap-2 text-xs text-[#666] font-mono bg-white/5 w-fit px-3 py-1.5 rounded-lg border border-white/5">
                        <Calendar className="w-3 h-3 text-neon-orange" />
                        <span>
                          {trip.start_date ? new Date(trip.start_date).toLocaleDateString(undefined, {month: 'short', day: 'numeric'}) : 'TBD'} 
                          {' → '} 
                          {trip.end_date ? new Date(trip.end_date).toLocaleDateString(undefined, {month: 'short', day: 'numeric'}) : 'TBD'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                <Link 
                  to={`/trips/${trip.id}`}
                  className="mt-6 w-full flex items-center justify-center gap-2 py-2.5 bg-[#111] hover:bg-[#1a1a1a] border border-[#222] rounded-lg transition-colors font-mono text-[11px] uppercase tracking-widest text-white group-hover:border-white/20 group-hover:text-neon-green"
                >
                  Access Data <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
