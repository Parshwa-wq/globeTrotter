import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Wallet, TrendingUp, AlertCircle, MapPin, Receipt, Plane, Plus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import { Skeleton } from '../components/Skeleton';
import { getPreferredCurrency, formatCurrency, convertCurrency } from '../utils/currency';
import { useToast } from '../context/ToastContext';
import ConfirmModal from '../components/ConfirmModal';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

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

  const { addToast } = useToast();
  const [expenseToDelete, setExpenseToDelete] = useState(null); // { activityId, expenseId }
  const [deleting, setDeleting] = useState(false);

  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!selectedActivityId) {
      addToast("Please select an activity to attach this expense to.", "info");
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
      addToast('Expense logged successfully.', 'success');
    } catch (err) {
      console.error('Error adding expense:', err);
      addToast('Failed to log expense. Verify inputs and try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const executeDeleteExpense = async () => {
    if (!expenseToDelete) return;
    setDeleting(true);
    try {
      await api.delete(`/activities/${expenseToDelete.activityId}/expenses/${expenseToDelete.expenseId}`);
      await fetchBudget();
      addToast('Expense deleted.', 'success');
    } catch (err) {
      console.error('Failed to delete expense:', err);
      addToast('Failed to delete expense.', 'error');
    } finally {
      setDeleting(false);
      setExpenseToDelete(null);
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

  const prefCurrency = getPreferredCurrency();

  // FX Normalization: Recalculate true totals using static exchange rates
  let trueTotal = 0;
  const normalizedStops = budget?.by_stop?.map(stop => {
    let stopTotal = 0;
    stop.expenses?.forEach(exp => {
      const amount = parseFloat(exp.amount);
      const converted = convertCurrency(amount, exp.currency || 'USD', prefCurrency);
      stopTotal += converted;
    });
    trueTotal += stopTotal;
    return { ...stop, normalizedTotal: stopTotal };
  }) || [];

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
                <span className="font-mono text-xs uppercase tracking-widest">Total Spent ({prefCurrency})</span>
              </div>
              <div className="font-grotesk text-5xl font-bold text-white">
                {formatCurrency(trueTotal, prefCurrency)}
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

      {/* Budget Analytics */}
      {trueTotal > 0 && (
        <div className="bento-card border border-[#222] p-6 mb-8 bg-[#0a0a0a]">
          <h2 className="font-mono text-sm uppercase tracking-widest text-white/70 font-semibold mb-6 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-neon-cyan" /> Spending Distribution
          </h2>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={normalizedStops.filter(s => s.normalizedTotal > 0).map(s => ({ name: s.stop_name, value: s.normalizedTotal }))}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {normalizedStops.filter(s => s.normalizedTotal > 0).map((entry, index) => {
                    const COLORS = ['#39FF14', '#00F0FF', '#FF6600', '#8B5CF6', '#EC4899'];
                    return <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />;
                  })}
                </Pie>
                <Tooltip 
                  formatter={(value) => formatCurrency(value, prefCurrency)}
                  contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff', fontFamily: 'monospace' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* Custom Legend */}
          <div className="flex flex-wrap justify-center gap-6 mt-4">
            {normalizedStops.filter(s => s.normalizedTotal > 0).map((entry, index) => {
              const COLORS = ['#39FF14', '#00F0FF', '#FF6600', '#8B5CF6', '#EC4899'];
              return (
                <div key={entry.stop_name} className="flex items-center gap-2 font-mono text-xs text-white/70">
                  <div className="w-3 h-3 rounded-full shadow-lg" style={{ backgroundColor: COLORS[index % COLORS.length], boxShadow: `0 0 10px ${COLORS[index % COLORS.length]}40` }}></div>
                  {entry.stop_name}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Expenses by Stop */}
      <h2 className="font-mono text-sm uppercase tracking-widest text-white/70 font-semibold mb-6 flex items-center gap-2">
        <MapPin className="w-4 h-4 text-neon-orange" /> Breakdowns by Stop
      </h2>

      <div className="space-y-6">
        {normalizedStops.length > 0 ? (
          normalizedStops.map((stop) => (
            <div key={stop.stop_id} className="bento-card border border-[#222]">
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-[#222]">
                <div>
                  <h3 className="font-grotesk text-xl font-bold text-white group-hover:text-neon-green transition-colors">{stop.stop_name}</h3>
                </div>
                <div className="text-right">
                  <div className="font-mono text-sm text-neon-orange">
                    {formatCurrency(stop.normalizedTotal, prefCurrency)}
                  </div>
                  <div className="text-[9px] font-mono text-white/40 uppercase tracking-widest">Subtotal ({prefCurrency})</div>
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
                        <div className="flex flex-col items-end">
                          <div className="font-mono text-sm text-white">
                            {formatCurrency(parseFloat(exp.amount), exp.currency || 'USD')}
                          </div>
                          {(exp.currency || 'USD') !== prefCurrency && (
                             <div className="text-[9px] font-mono text-neon-orange/80">
                               ≈ {formatCurrency(convertCurrency(parseFloat(exp.amount), exp.currency || 'USD', prefCurrency), prefCurrency)}
                             </div>
                          )}
                        </div>
                        <button 
                          onClick={() => setExpenseToDelete({ activityId: exp.activity_id, expenseId: exp.id })}
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

      <ConfirmModal 
        isOpen={!!expenseToDelete}
        onClose={() => setExpenseToDelete(null)}
        onConfirm={executeDeleteExpense}
        title="Delete Expense?"
        message="Are you sure you want to permanently delete this expense from your budget?"
        isProcessing={deleting}
      />
    </div>
  );
}
