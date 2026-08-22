import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Clock, Tag, X, Loader2, Trash2 } from 'lucide-react';
import api from '../services/api';
import ConfirmModal from './ConfirmModal';
import { useToast } from '../context/ToastContext';

const CATEGORIES = [
  'sightseeing', 'food', 'adventure', 'shopping', 
  'transport', 'accommodation', 'nightlife', 'culture', 'other'
];

const CATEGORY_COLORS = {
  sightseeing: 'text-neon-cyan border-neon-cyan/30 bg-neon-cyan/10',
  food: 'text-neon-orange border-neon-orange/30 bg-neon-orange/10',
  adventure: 'text-neon-green border-neon-green/30 bg-neon-green/10',
  shopping: 'text-pink-400 border-pink-400/30 bg-pink-400/10',
  transport: 'text-blue-400 border-blue-400/30 bg-blue-400/10',
  accommodation: 'text-purple-400 border-purple-400/30 bg-purple-400/10',
  nightlife: 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10',
  culture: 'text-red-400 border-red-400/30 bg-red-400/10',
  other: 'text-white/70 border-white/30 bg-white/10',
};

const StopActivities = ({ stopId, onClose, isReadOnly }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [isAdding, setIsAdding] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'sightseeing',
    start_time: '',
    end_time: ''
  });

  // Expense states
  const [addingExpenseFor, setAddingExpenseFor] = useState(null);
  const [expenseData, setExpenseData] = useState({
    description: '',
    amount: '',
    currency: 'USD'
  });

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/stops/${stopId}/activities`);
      setActivities(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch activities:', err);
      setError('Failed to load activities.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (stopId) fetchActivities();
  }, [stopId]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      alert("Title is required.");
      return false;
    }
    if (formData.start_time && formData.end_time) {
      if (formData.start_time >= formData.end_time) {
        alert("End time must be after start time.");
        return false;
      }
    }
    return true;
  };

  const { addToast } = useToast();
  const [activityToDelete, setActivityToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const handleAddActivity = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setSubmitting(true);
    try {
      await api.post(`/stops/${stopId}/activities`, formData);
      await fetchActivities();
      setIsAdding(false);
      setFormData({
        title: '',
        description: '',
        category: 'sightseeing',
        start_time: '',
        end_time: ''
      });
      addToast('Activity scheduled successfully.', 'success');
    } catch (err) {
      console.error('Error adding activity:', err);
      addToast('Failed to add activity.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddExpense = async (e, activityId) => {
    e.preventDefault();
    if (!expenseData.amount || expenseData.amount <= 0) {
      addToast("Please enter a valid monetary amount.", "info");
      return;
    }

    setSubmitting(true);
    try {
      await api.post(`/activities/${activityId}/expenses`, {
        ...expenseData,
        amount: parseFloat(expenseData.amount)
      });
      addToast("Expense logged successfully! View it in the Budget Dashboard.", "success");
      setAddingExpenseFor(null);
      setExpenseData({ description: '', amount: '', currency: 'USD' });
    } catch (err) {
      console.error('Error adding expense:', err);
      addToast('Failed to log expense. ' + (err.response?.data?.message || ''), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const executeDeleteActivity = async () => {
    if (!activityToDelete) return;
    setDeleting(true);
    try {
      await api.delete(`/stops/${stopId}/activities/${activityToDelete}`);
      await fetchActivities();
      addToast('Activity deleted.', 'success');
    } catch (err) {
      console.error('Error deleting activity:', err);
      addToast('Failed to delete activity.', 'error');
    } finally {
      setDeleting(false);
      setActivityToDelete(null);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="mt-4 pt-4 border-t border-[#222] overflow-hidden"
    >
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-mono text-xs uppercase tracking-widest text-white/70">Activities Schedule</h4>
        {!isAdding && (
          <button onClick={() => setIsAdding(true)} className="text-[10px] flex items-center gap-1 font-mono uppercase tracking-widest text-neon-green hover:text-white transition-colors">
            <Plus className="w-3 h-3" /> Add
          </button>
        )}
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.form 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onSubmit={handleAddActivity}
            className="mb-6 p-4 bg-[#0a0a0a] border border-[#333] rounded-xl space-y-3"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-mono text-[10px] uppercase text-neon-green tracking-widest">New Activity</span>
              <button type="button" onClick={() => setIsAdding(false)} className="text-white/40 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <input type="text" name="title" required value={formData.title} onChange={handleInputChange} placeholder="Activity Title" className="w-full bg-[#111] border border-[#222] focus:border-neon-green rounded-lg py-2 px-3 text-white focus:outline-none transition-all text-sm" />
            
            <div className="grid grid-cols-2 gap-3">
              <select name="category" value={formData.category} onChange={handleInputChange} className="w-full bg-[#111] border border-[#222] focus:border-neon-green rounded-lg py-2 px-3 text-white focus:outline-none transition-all text-sm">
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                ))}
              </select>
              
              <div className="flex gap-2">
                <input type="time" name="start_time" value={formData.start_time} onChange={handleInputChange} className="w-full bg-[#111] border border-[#222] focus:border-neon-green rounded-lg py-2 px-2 text-white focus:outline-none transition-all text-sm [color-scheme:dark]" />
                <input type="time" name="end_time" value={formData.end_time} onChange={handleInputChange} className="w-full bg-[#111] border border-[#222] focus:border-neon-green rounded-lg py-2 px-2 text-white focus:outline-none transition-all text-sm [color-scheme:dark]" />
              </div>
            </div>
            
            <input type="text" name="description" value={formData.description} onChange={handleInputChange} placeholder="Optional notes..." className="w-full bg-[#111] border border-[#222] focus:border-neon-green rounded-lg py-2 px-3 text-white focus:outline-none transition-all text-sm" />

            <button disabled={submitting} type="submit" className="w-full py-2 bg-[#222] hover:bg-neon-green text-white hover:text-black font-bold font-mono text-xs uppercase tracking-widest rounded-lg transition-all disabled:opacity-50">
              {submitting ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Save Activity'}
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="flex justify-center p-4"><Loader2 className="w-5 h-5 text-neon-green animate-spin" /></div>
      ) : activities.length === 0 ? (
        <div className="text-center p-4 text-xs text-white/30 font-inter italic">No activities planned yet.</div>
      ) : (
        <div className="space-y-3">
          {activities.map(act => (
            <div key={act.id} className="group relative bg-[#0a0a0a] border border-[#222] hover:border-white/20 rounded-xl p-3 transition-colors flex gap-3">
              <div className={`mt-1 font-mono text-[9px] uppercase tracking-widest px-2 py-1 rounded border h-fit whitespace-nowrap ${CATEGORY_COLORS[act.category] || CATEGORY_COLORS.other}`}>
                {act.category}
              </div>
              <div className="flex-1">
                <h5 className="font-bold text-white text-sm flex items-center justify-between">
                  {act.title}
                  {!isReadOnly && (
                    <button onClick={() => setActivityToDelete(act.id)} className="text-white/10 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100" title="Delete Activity">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </h5>
                {(act.start_time || act.end_time) && (
                  <p className="font-mono text-[10px] text-white/40 flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3" />
                    {act.start_time ? act.start_time.slice(0,5) : '?'} - {act.end_time ? act.end_time.slice(0,5) : '?'}
                  </p>
                )}
                {act.description && (
                  <p className="text-xs text-white/60 font-inter mt-1.5">{act.description}</p>
                )}
                
                {/* Add Expense Toggle */}
                {!isReadOnly && (
                  <div className="mt-3 pt-3 border-t border-[#222]">
                     <button 
                       onClick={() => {
                         setAddingExpenseFor(addingExpenseFor === act.id ? null : act.id);
                         setExpenseData({ description: '', amount: '', currency: 'USD' });
                       }}
                       className="text-[10px] font-mono uppercase tracking-widest text-neon-orange hover:text-white transition-colors"
                     >
                       {addingExpenseFor === act.id ? 'Cancel' : '+ Log Expense'}
                     </button>
                     
                     <AnimatePresence>
                       {addingExpenseFor === act.id && (
                         <motion.form 
                           initial={{ opacity: 0, height: 0 }}
                           animate={{ opacity: 1, height: 'auto' }}
                           exit={{ opacity: 0, height: 0 }}
                           onSubmit={(e) => handleAddExpense(e, act.id)}
                           className="mt-3 flex flex-wrap gap-2 overflow-hidden"
                         >
                           <input 
                             type="text" 
                             required
                             value={expenseData.description}
                             onChange={(e) => setExpenseData({...expenseData, description: e.target.value})}
                             placeholder="What was this for?" 
                             className="flex-1 min-w-[120px] bg-[#111] border border-[#333] focus:border-neon-orange rounded-md py-1.5 px-2 text-white text-[10px] font-mono focus:outline-none" 
                           />
                           <input 
                             type="number" 
                             required
                             min="0"
                             step="0.01"
                             value={expenseData.amount}
                             onChange={(e) => setExpenseData({...expenseData, amount: e.target.value})}
                             placeholder="Amount" 
                             className="w-20 bg-[#111] border border-[#333] focus:border-neon-orange rounded-md py-1.5 px-2 text-white text-[10px] font-mono focus:outline-none" 
                           />
                           <select 
                             value={expenseData.currency}
                             onChange={(e) => setExpenseData({...expenseData, currency: e.target.value})}
                             className="bg-[#111] border border-[#333] focus:border-neon-orange rounded-md py-1.5 px-2 text-white text-[10px] font-mono focus:outline-none"
                           >
                             <option value="INR">INR</option>
                             <option value="USD">USD</option>
                             <option value="EUR">EUR</option>
                             <option value="GBP">GBP</option>
                           </select>
                           <button type="submit" disabled={submitting} className="bg-neon-orange text-black font-bold font-mono text-[10px] uppercase px-3 rounded-md hover:bg-neon-orange/90 disabled:opacity-50">
                             Save
                           </button>
                         </motion.form>
                       )}
                     </AnimatePresence>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal 
        isOpen={!!activityToDelete}
        onClose={() => setActivityToDelete(null)}
        onConfirm={executeDeleteActivity}
        title="Delete Activity?"
        message="Are you sure you want to delete this activity? Any logged expenses tied to it will also be erased."
        isProcessing={deleting}
      />
    </motion.div>
  );
};

export default React.memo(StopActivities);
