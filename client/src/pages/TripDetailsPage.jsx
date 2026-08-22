import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Loader2, Plane, Train, Car } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';
import { Skeleton } from '../components/Skeleton';
import ItineraryWorkspace from '../components/ItineraryWorkspace';
import RouteMap from '../components/RouteMap';

export default function TripDetailsPage() {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [savedRoute, setSavedRoute] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTripDetails = async () => {
      try {
        const [tripRes, routeRes] = await Promise.all([
          api.get(`/trips/${id}`),
          api.get(`/scrape/saved/${id}`)
        ]);
        setTrip(tripRes.data.data);
        if (routeRes.data.data) {
          setSavedRoute(routeRes.data.data);
        }
      } catch (err) {
        console.error('Error fetching trip details:', err);
        setError('Failed to retrieve trip protocol. Re-establishing link...');
      } finally {
        setLoading(false);
      }
    };
    fetchTripDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="w-full">
        <Skeleton className="h-12 w-1/3 mb-4" />
        <Skeleton className="h-6 w-1/4 mb-12" />
        <div className="bento-card">
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="w-full">
        <div className="p-5 rounded-2xl glass-panel bg-red-950/30 border-red-500/30 text-red-100 flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
          <span className="font-mono text-sm">{error || "Trip not found"}</span>
        </div>
        <Link to="/dashboard" className="mt-6 inline-flex items-center gap-2 text-neon-green font-mono text-sm hover:underline">
          <ArrowLeft className="w-4 h-4" /> Return to Command Center
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Link to="/dashboard" className="inline-flex items-center gap-2 text-neon-green mb-8 font-mono text-sm hover:underline">
        <ArrowLeft className="w-4 h-4" /> Return to Command Center
      </Link>

      <header className="mb-12 border-l-2 border-neon-green pl-6">
        <h1 className="font-grotesk text-4xl md:text-5xl font-bold tracking-tight mb-4">
          {savedRoute ? `${savedRoute.origin} → ${trip.title}` : trip.title}
        </h1>
        
        <div className="flex flex-wrap items-center gap-4">
          <span className="font-mono text-[10px] px-3 py-1 rounded-full border border-neon-green/30 bg-neon-green/10 text-neon-green uppercase tracking-widest">
            {trip.status}
          </span>
          
          {(trip.start_date || trip.end_date) && (
            <div className="flex items-center gap-2 text-sm text-gray-400 font-mono">
              <Calendar className="w-4 h-4 text-neon-orange" />
              <span>
                {trip.start_date ? new Date(trip.start_date).toLocaleDateString(undefined, {month: 'long', day: 'numeric', year: 'numeric'}) : 'TBD'} 
                {' - '} 
                {trip.end_date ? new Date(trip.end_date).toLocaleDateString(undefined, {month: 'long', day: 'numeric', year: 'numeric'}) : 'TBD'}
              </span>
            </div>
          )}

          <Link to={`/trips/${trip.id}/budget`} className="ml-auto font-mono text-xs uppercase tracking-widest text-black bg-neon-green hover:bg-neon-green/90 px-4 py-2 rounded-lg transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(57,255,20,0.2)]">
            Open Budget <ArrowLeft className="w-3 h-3 rotate-180" />
          </Link>
        </div>
        
        {trip.description && (
          <p className="mt-6 text-[#888] font-inter max-w-3xl leading-relaxed">
            {trip.description}
          </p>
        )}
      </header>

      {/* Seamless Integrated Route Display */}
      {savedRoute && (
        <div className="mb-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-[400px] rounded-2xl overflow-hidden border border-[#333] shadow-[0_0_30px_rgba(127,255,0,0.1)]">
             <RouteMap mode={savedRoute.mode} stations={savedRoute.stations_json} />
          </div>
          <div className="bento-card border border-[#222] bg-[#0a0a0a] flex flex-col">
             <h3 className="font-mono text-xs text-[#666] uppercase tracking-widest mb-6 border-b border-[#222] pb-4">Route Intelligence</h3>
             
             <div className="mb-8">
               <div>
                 <p className="text-[#666] font-mono text-[10px] uppercase mb-1">Mode</p>
                 <div className="flex items-center gap-2 text-neon-green font-mono font-bold uppercase">
                   {savedRoute.mode === 'flight' && <Plane className="w-4 h-4" />}
                   {savedRoute.mode === 'train' && <Train className="w-4 h-4" />}
                   {savedRoute.mode === 'car' && <Car className="w-4 h-4" />}
                   {savedRoute.mode}
                 </div>
               </div>
             </div>

             <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                <p className="text-[#666] font-mono text-[10px] uppercase mb-4">Transit Manifest</p>
                <div className="space-y-4">
                  {savedRoute.stations_json.map((station, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="flex flex-col items-center mt-1">
                        <div className={`w-2 h-2 rounded-full ${i===0 || i===savedRoute.stations_json.length-1 ? 'bg-neon-green shadow-[0_0_8px_rgba(127,255,0,0.8)]' : 'bg-[#444]'}`}></div>
                        {i !== savedRoute.stations_json.length - 1 && <div className="w-px h-8 bg-[#333] my-1"></div>}
                      </div>
                      <div>
                        <p className="text-white font-mono text-xs">{station.name}</p>
                        <p className="text-[#555] font-mono text-[9px] uppercase tracking-widest">{station.type}</p>
                      </div>
                    </div>
                  ))}
                </div>
             </div>

                       </div>
        </div>
      )}

      {/* Workspace Area for Stops & Activities */}
      <ItineraryWorkspace tripId={trip.id} tripStartDate={trip.start_date} tripEndDate={trip.end_date} tripStatus={trip.status} />
    </div>
  );
}
