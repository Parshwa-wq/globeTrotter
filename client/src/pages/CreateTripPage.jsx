import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Loader2, Calendar as CalendarIcon, Type, AlignLeft, Plane, Train, Car, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';

export default function CreateTripPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    title: '', // Acts as Destination
    description: '',
    start_date: '',
    end_date: '',
    mode: 'flight' // Default mode
  });

  const [origin, setOrigin] = useState('');
  const [geoStatus, setGeoStatus] = useState('Checking GPS...');

  // Automatically fetch origin on load
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            setGeoStatus('Resolving coordinates...');
            const { latitude, longitude } = position.coords;
            // Free Reverse Geocoding (No API Key Required)
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
            const data = await res.json();
            const city = data.address.city || data.address.town || data.address.village || data.address.state || 'Unknown';
            setOrigin(city);
            setGeoStatus(`Origin Auto-Locked: ${city}`);
          } catch (err) {
            setGeoStatus('Failed to resolve city. Please type it.');
          }
        },
        () => setGeoStatus('GPS Denied. Please type your origin city manually.')
      );
    } else {
      setGeoStatus('GPS not available. Please type your origin city manually.');
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!origin) {
      setError('Origin city is required to calculate routes.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      // 1. Scrape the route first
      let routeData;
      try {
        const scrapeRes = await api.get(`/scrape/route?from=${encodeURIComponent(origin)}&to=${encodeURIComponent(formData.title)}&mode=${formData.mode}`);
        routeData = scrapeRes.data;
      } catch (scrapeErr) {
        throw new Error(scrapeErr.response?.data?.error || scrapeErr.message || 'Route calculation failed.');
      }

      // 2. If scraping successful, create the trip
      const tripRes = await api.post('/trips', formData);
      const tripId = tripRes.data.tripId;

      // 3. Save the scraped route to the database
      await api.post(`/scrape/save/${tripId}`, {
        origin: routeData.origin,
        destination: routeData.destination,
        mode: routeData.mode,
        stations: routeData.stations
      });

      // 4. Navigate to Trip Page
      navigate(`/trips/${tripId}`);

    } catch (err) {
      console.error('Failed to create trip:', err);
      setError(err.message || err.response?.data?.message || 'Failed to deploy new trip protocol.');
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto pb-12">
      <div className="mb-4">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors font-mono text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bento-card p-0 overflow-hidden shadow-2xl shadow-black/50"
      >
        <div className="p-6 border-b border-[#222]">
          <h1 className="text-2xl font-bold text-white mb-1 font-grotesk tracking-tight flex items-center gap-3">
             <div className="w-2 h-5 bg-neon-green rounded-full"></div>
             Plan New Trip
          </h1>
          <p className="text-[#888] text-sm font-inter">
            Enter your destination and we will automatically calculate the route.
          </p>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-950/30 border border-red-500/30 text-red-100 flex items-center gap-3">
               <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
               <span className="font-mono text-sm">{error}</span>
            </div>
          )}

          <form id="trip-form" onSubmit={handleSubmit} className="space-y-5">
            
            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase tracking-widest text-white/50 ml-1 flex items-center justify-between">
                <span>Origin (From)</span>
                <span className="text-[9px] text-neon-green">{geoStatus}</span>
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neon-green" />
                <input
                  type="text"
                  required
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  placeholder="e.g. New York"
                  className="w-full bg-[#0a0a0a] border border-[#333] focus:border-neon-green rounded-xl py-2.5 pl-11 pr-4 text-neon-green font-mono placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-neon-green transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase tracking-widest text-white/50 ml-1">Destination (To)</label>
              <div className="relative">
                <Type className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Paris"
                  className="w-full bg-[#111] border border-[#222] focus:border-neon-green rounded-xl py-2.5 pl-11 pr-4 text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-neon-green transition-all"
                />
              </div>
            </div>

            

            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-mono uppercase tracking-widest text-white/50 ml-1">Description</label>
              <div className="relative">
                <AlignLeft className="absolute left-4 top-3.5 w-4 h-4 text-white/20" />
                <textarea
                  name="description"
                  rows="2"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Where are you heading and what's the plan?"
                  className="w-full bg-[#111] border border-[#222] focus:border-neon-green rounded-xl py-2.5 pl-11 pr-4 text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-neon-green transition-all resize-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-widest text-white/50 ml-1">Start Date</label>
                <div className="relative">
                  <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neon-orange" />
                  <input
                    type="date"
                    name="start_date"
                    required
                    value={formData.start_date}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full bg-[#111] border border-[#222] focus:border-neon-green rounded-xl py-2.5 pl-11 pr-4 text-white focus:outline-none focus:ring-1 focus:ring-neon-green transition-all [color-scheme:dark]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-widest text-white/50 ml-1">End Date</label>
                <div className="relative">
                  <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neon-orange" />
                  <input
                    type="date"
                    name="end_date"
                    required
                    value={formData.end_date}
                    onChange={handleChange}
                    min={formData.start_date || new Date().toISOString().split('T')[0]}
                    className="w-full bg-[#111] border border-[#222] focus:border-neon-green rounded-xl py-2.5 pl-11 pr-4 text-white focus:outline-none focus:ring-1 focus:ring-neon-green transition-all [color-scheme:dark]"
                  />
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-[#222] bg-[#0a0a0a]/50">
          <button
            type="submit"
            form="trip-form"
            disabled={loading}
            className="w-full py-3.5 bg-neon-green hover:bg-neon-green/90 text-black font-bold font-mono uppercase tracking-widest rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(57,255,20,0.15)]"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Calculating Route & Deploying...
              </>
            ) : (
              'Calculate & Create Trip'
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
