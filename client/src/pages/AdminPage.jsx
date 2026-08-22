import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, LayoutDashboard, MapPin, Activity, Trash2, ArrowLeft, Loader2, ShieldAlert, Shield, ShieldMinus } from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import ConfirmModal from '../components/ConfirmModal';

export default function AdminPage() {
  const { user } = useAuth();
  const { addToast } = useToast();
  
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [statsRes, usersRes] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/admin/users')
        ]);
        setStats(statsRes.data.data);
        setUsers(usersRes.data.data);
      } catch (err) {
        console.error('Failed to load admin data:', err);
        addToast('Admin access denied or data fetch failed.', 'error');
      } finally {
        setLoading(false);
      }
    };
    
    if (user?.role === 'admin') {
      fetchAdminData();
    }
  }, [user]);

  if (!user || user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  const executeDeleteUser = async () => {
    if (!userToDelete) return;
    setDeleting(true);
    try {
      await api.delete(`/admin/users/${userToDelete}`);
      setUsers(users.filter(u => u.id !== userToDelete));
      setStats(prev => ({ ...prev, users: prev.users - 1 }));
      addToast('User and all associated data permanently purged.', 'success');
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to delete user.', 'error');
    } finally {
      setDeleting(false);
      setUserToDelete(null);
    }
  };

  const executeRoleChange = async (targetId, newRole) => {
    try {
      await api.put(`/admin/users/${targetId}/role`, { role: newRole });
      setUsers(users.map(u => u.id === targetId ? { ...u, role: newRole } : u));
      addToast(`User role updated to ${newRole.toUpperCase()}.`, 'success');
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to update user role.', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 text-neon-green animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full pb-12">
      <Link to="/dashboard" className="inline-flex items-center gap-2 text-neon-green mb-8 font-mono text-sm hover:underline">
        <ArrowLeft className="w-4 h-4" /> Return to Dashboard
      </Link>

      <header className="mb-12 border-l-2 border-red-500 pl-6">
        <div className="flex items-center gap-3 mb-4">
          <ShieldAlert className="w-8 h-8 text-red-500" />
          <h1 className="font-grotesk text-4xl md:text-5xl font-bold tracking-tight text-white">
            Admin Console
          </h1>
        </div>
        <p className="text-[#888] font-mono text-sm uppercase tracking-widest">
          Platform-Wide Tactical Overview
        </p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <div className="bento-inner-block bg-[#0a0a0a] shadow-lg border-t-2 border-neon-cyan">
          <div className="flex items-center gap-2 text-white/50 mb-2">
            <Users className="w-4 h-4 text-neon-cyan" />
            <span className="font-mono text-xs uppercase tracking-widest">Total Users</span>
          </div>
          <div className="font-grotesk text-3xl font-bold text-white">{stats?.users || 0}</div>
        </div>
        
        <div className="bento-inner-block bg-[#0a0a0a] shadow-lg border-t-2 border-neon-green">
          <div className="flex items-center gap-2 text-white/50 mb-2">
            <LayoutDashboard className="w-4 h-4 text-neon-green" />
            <span className="font-mono text-xs uppercase tracking-widest">Active Trips</span>
          </div>
          <div className="font-grotesk text-3xl font-bold text-white">{stats?.trips || 0}</div>
        </div>

        <div className="bento-inner-block bg-[#0a0a0a] shadow-lg border-t-2 border-neon-orange">
          <div className="flex items-center gap-2 text-white/50 mb-2">
            <MapPin className="w-4 h-4 text-neon-orange" />
            <span className="font-mono text-xs uppercase tracking-widest">Stops Deployed</span>
          </div>
          <div className="font-grotesk text-3xl font-bold text-white">{stats?.stops || 0}</div>
        </div>

        <div className="bento-inner-block bg-[#0a0a0a] shadow-lg border-t-2 border-purple-500">
          <div className="flex items-center gap-2 text-white/50 mb-2">
            <Activity className="w-4 h-4 text-purple-500" />
            <span className="font-mono text-xs uppercase tracking-widest">Total Capital Logged</span>
          </div>
          <div className="font-grotesk text-3xl font-bold text-white">{stats?.totalVolume || 0}</div>
        </div>
      </div>

      {/* User Management Table */}
      <div className="bento-card bg-[#0a0a0a] p-6 border border-[#222]">
        <h2 className="font-grotesk text-xl font-bold text-white mb-6">User Roster</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#333]">
                <th className="py-3 px-4 text-xs font-mono uppercase tracking-widest text-white/50">ID</th>
                <th className="py-3 px-4 text-xs font-mono uppercase tracking-widest text-white/50">Operative Name</th>
                <th className="py-3 px-4 text-xs font-mono uppercase tracking-widest text-white/50">Clearance Level</th>
                <th className="py-3 px-4 text-xs font-mono uppercase tracking-widest text-white/50 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-b border-[#222] hover:bg-[#111] transition-colors group">
                  <td className="py-4 px-4 font-mono text-sm text-white/40">{u.id}</td>
                  <td className="py-4 px-4">
                    <div className="font-bold text-white text-sm">{u.name}</div>
                    <div className="text-xs text-white/50 font-mono">{u.email}</div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 text-[10px] uppercase font-mono tracking-widest rounded-full border ${u.role === 'admin' ? 'border-red-500/30 text-red-500 bg-red-500/10' : 'border-neon-cyan/30 text-neon-cyan bg-neon-cyan/10'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    {u.id !== user.id && (
                      <div className="flex items-center justify-end gap-1">
                        {u.role === 'admin' ? (
                          <button 
                            onClick={() => executeRoleChange(u.id, 'user')}
                            className="text-white/20 hover:text-orange-500 transition-colors p-2"
                            title="Demote to User"
                          >
                            <ShieldMinus className="w-4 h-4" />
                          </button>
                        ) : (
                          <button 
                            onClick={() => executeRoleChange(u.id, 'admin')}
                            className="text-white/20 hover:text-neon-cyan transition-colors p-2"
                            title="Promote to Admin"
                          >
                            <Shield className="w-4 h-4" />
                          </button>
                        )}
                        <button 
                          onClick={() => setUserToDelete(u.id)}
                          className="text-white/20 hover:text-red-500 transition-colors p-2"
                          title="Purge User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmModal 
        isOpen={!!userToDelete}
        onClose={() => setUserToDelete(null)}
        onConfirm={executeDeleteUser}
        title="Purge Operative?"
        message="This action is irreversible. It will permanently delete this user, all their trips, activities, and logged expenses."
        isProcessing={deleting}
      />
    </div>
  );
}
