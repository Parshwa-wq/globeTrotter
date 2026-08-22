import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';
import { Skeleton } from '../components/Skeleton';
import ItineraryWorkspace from '../components/ItineraryWorkspace';

export default function TripDetailsPage() {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTripDetails = async () => {
      try {
        const response = await api.get(`/trips/${id}`);
        setTrip(response.data.data);
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
          {trip.title}
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
        </div>
        
        {trip.description && (
          <p className="mt-6 text-[#888] font-inter max-w-3xl leading-relaxed">
            {trip.description}
          </p>
        )}
      </header>

      {/* Workspace Area for Stops & Activities */}
      <ItineraryWorkspace tripId={trip.id} tripStartDate={trip.start_date} tripEndDate={trip.end_date} />
    </div>
  );
}
