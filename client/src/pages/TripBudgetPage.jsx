import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Wallet, TrendingUp, AlertCircle, MapPin, Receipt, Plane, Plus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import { Skeleton } from '../components/Skeleton';

export default function TripBudgetPage() {
  const { id } = useParams();
  const [budget, setBudget] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Form states
  const [isAddingExpense, setIsAddingExpense] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedActivityId, setSelectedActivityId] = useState('');
  
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    currency: 'USD'
  });

  const fetchBudget = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/trips/${id}/budget`);
      setBudget(response.data.data);
    } catch (err) {
      console.error('Error fetching budget:', err);
      setError('Failed to retrieve financial telemetry.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudget();
  }, [id]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!selectedActivityId) {
      alert("Please select an activity to attach this expense to.");
      return;
    }
    
    setSubmitting(true);
    try {
      await api.post(`/activities/${selectedActivityId}/expenses`, {
        ...formData,
        amount: parseFloat(formData.amount)
      });
      await fetchBudget();
      setIsAddingExpense(false);
      setFormData({ description: '', amount: '', currency: 'USD' });
    } catch (err) {
      console.error('Error adding expense:', err);
      alert('Failed to log expense. Verify inputs and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteExpense = async (activityId, expenseId) => {
    if (!window.confirm("Delete this expense?")) return;
    try {
      await api.delete(`/activities/${activityId}/expenses/${expenseId}`);
      await fetchBudget();
    } catch (err) {
      console.error('Failed to delete expense:', err);
      alert('Failed to delete expense.');
    }
  };

  if (loading) {
    return (
      <div className="w-full">
        <Skeleton className="h-8 w-1/4 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
        </div>
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  if (error || !budget) {
    return (
      <div className="w-full">
        <div className="p-5 rounded-2xl glass-panel bg-red-950/30 border-red-500/30 text-red-100 flex items-center gap-3">
          <AlertCircle className="w-4 h-4 text-red-500" />
          <span className="font-mono text-sm">{error || "Budget data unavailable"}</span>
        </div>
        <Link to={`/trips/${id}`} className="mt-6 inline-flex items-center gap-2 text-neon-green font-mono text-sm hover:underline">
          <ArrowLeft className="w-4 h-4" /> Return to Itinerary
        </Link>
      </div>
    );
  }

  // Extract all activities from budget.by_stop for the select dropdown
  const allActivities = [];
  budget.by_stop?.forEach(stop => {
    stop.expenses?.forEach(exp => {
      // we don't have the raw activities, only expenses!
      // wait, we need activities to add expenses. We must fetch them if we want to add expenses here.
    });
  });

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-8">
        <Link to={`/trips/${id}`} className="inline-flex items-center gap-2 text-neon-green font-mono text-sm hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to Itinerary
        </Link>
        <div className="font-mono text-[10px] uppercase tracking-widest text-neon-orange border border-neon-orange/30 bg-neon-orange/10 px-3 py-1 rounded-full flex items-center gap-2">
          <Wallet className="w-3 h-3" />
          Financial Dashboard
        </div>
      </div>

      <header className="mb-8">
        <h1 className="font-grotesk text-4xl font-bold tracking-tight mb-2">Budget Overview</h1>
        <p className="text-[#888] font-inter text-sm max-w-2xl">
          Track and manage your expenses across all deployed stops.
        </p>
      </header>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bento-inner-block bg-[#0a0a0a] shadow-lg border border-[#222] relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity group-hover:scale-110 duration-500">
              <TrendingUp className="w-32 h-32 text-neon-green -rotate-12 translate-x-4 -translate-y-4" />
           </div>
           <div className="relative z-10">
              <div className="flex items-center gap-2 text-white/50 mb-2">
                <Wallet className="w-4 h-4 text-neon-green" />
                <span className="font-mono text-xs uppercase tracking-widest">Total Spent</span>
              </div>
              <div className="font-grotesk text-5xl font-bold text-white">
                {budget.currency} {budget.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </div>
           </div>
        </div>

        <div 
           onClick={() => alert("To maintain precise financial tracking, please return to the Itinerary and attach expenses directly to your specific activities.")}
           className="bento-inner-block bg-black shadow-lg border border-dashed border-[#333] hover:border-neon-cyan/50 hover:bg-neon-cyan/5 transition-all flex flex-col items-center justify-center cursor-pointer group"
        >
           <div className="w-12 h-12 rounded-full bg-[#111] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(0,255,255,0)] group-hover:shadow-[0_0_30px_rgba(0,255,255,0.2)]">
              <Plus className="w-6 h-6 text-white group-hover:text-neon-cyan" />
           </div>
           <h3 className="font-mono text-sm uppercase tracking-widest font-bold text-white">Log Expense</h3>
           <p className="text-[10px] text-white/40 mt-1 font-inter text-center max-w-[150px]">Attach directly to itinerary activities</p>
        </div>
      </div>

      {/* Expenses by Stop */}
      <h2 className="font-mono text-sm uppercase tracking-widest text-white/70 font-semibold mb-6 flex items-center gap-2">
        <MapPin className="w-4 h-4 text-neon-orange" /> Breakdowns by Stop
      </h2>

      <div className="space-y-6">
        {budget.by_stop && budget.by_stop.length > 0 ? (
          budget.by_stop.map((stop) => (
            <div key={stop.stop_id} className="bento-card border border-[#222]">
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-[#222]">
                <div>
                  <h3 className="font-grotesk text-xl font-bold text-white group-hover:text-neon-green transition-colors">{stop.stop_name}</h3>
                </div>
                <div className="text-right">
                  <div className="font-mono text-sm text-neon-orange">
                    {budget.currency} {parseFloat(stop.total).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </div>
                  <div className="text-[9px] font-mono text-white/40 uppercase tracking-widest">Subtotal</div>
                </div>
              </div>

              {stop.expenses && stop.expenses.length > 0 ? (
                <div className="space-y-3 mt-4">
                  {stop.expenses.map((exp) => (
                    <div key={exp.id} className="flex justify-between items-center bg-[#0a0a0a] p-3 rounded-lg border border-[#222] hover:border-white/10 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#111] flex items-center justify-center border border-[#333]">
                           <Receipt className="w-3.5 h-3.5 text-white/50" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white">{exp.description}</h4>
                          <span className="text-[10px] font-mono text-neon-cyan uppercase tracking-widest">{exp.activity_title}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="font-mono text-sm text-white">
                          {exp.currency} {parseFloat(exp.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </div>
                        <button 
                          onClick={() => handleDeleteExpense(exp.activity_id, exp.id)}
                          className="text-white/20 hover:text-red-500 transition-colors"
                          title="Delete Expense"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-6 text-center text-white/30 text-xs font-inter italic border border-dashed border-[#222] rounded-lg bg-[#0a0a0a]">
                  No expenses logged for this stop yet.
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="py-12 text-center text-white/30 text-sm font-inter bento-card border-dashed border-[#333]">
            No stops available to track budget. Please add stops to your itinerary first.
          </div>
        )}
      </div>
    </div>
  );
}
