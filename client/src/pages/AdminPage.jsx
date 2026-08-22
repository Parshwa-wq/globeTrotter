import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Users, LayoutDashboard, MapPin, Activity, Trash2, ArrowLeft, Loader2, ShieldAlert, Shield, ShieldMinus, Terminal } from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import ConfirmModal from '../components/ConfirmModal';
import { TopographicBackground } from '../components/TopographicBackground';

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
      <div className="flex items-center justify-center min-h-screen bg-[#050505]">
        <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-transparent text-white selection:bg-red-500/30 flex flex-col font-inter">
      <TopographicBackground />
      {/* Top Navbar */}
      <nav className="relative h-16 border-b border-[#222] bg-[#0a0a0a]/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Terminal className="w-5 h-5 text-red-500" />
          <span className="font-mono text-sm font-bold tracking-widest uppercase text-white/90">GT // Admin_Terminal</span>
        </div>
        <Link to="/settings" className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-white/50 hover:text-white transition-colors bg-[#111] px-4 py-2 rounded-md border border-[#333] hover:border-white/20">
          <ArrowLeft className="w-4 h-4" /> Settings
        </Link>
      </nav>

      {/* Main Content Area */}
      <div className="relative z-10 flex-1 p-6 md:p-10 max-w-[1600px] mx-auto w-full">
        <header className="mb-12 border-l-2 border-red-500 pl-6">
          <div className="flex items-center gap-3 mb-4">
            <ShieldAlert className="w-8 h-8 text-red-500" />
            <h1 className="font-grotesk text-4xl md:text-5xl font-bold tracking-tight text-white drop-shadow-md">
              System Control
            </h1>
          </div>
          <p className="text-[#888] font-mono text-sm uppercase tracking-widest drop-shadow-sm">
            Platform-Wide Tactical Overview & Operative Management
          </p>
        </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <div className="bento-inner-block bg-[#0a0a0a]/70 backdrop-blur-lg shadow-lg border-t-2 border-neon-cyan">
          <div className="flex items-center gap-2 text-white/50 mb-2">
            <Users className="w-4 h-4 text-neon-cyan" />
            <span className="font-mono text-xs uppercase tracking-widest">Total Operatives</span>
          </div>
          <div className="font-grotesk text-3xl font-bold text-white">{stats?.users || 0}</div>
        </div>
        
        <div className="bento-inner-block bg-[#0a0a0a]/70 backdrop-blur-lg shadow-lg border-t-2 border-neon-orange">
          <div className="flex items-center gap-2 text-white/50 mb-2">
            <LayoutDashboard className="w-4 h-4 text-neon-orange" />
            <span className="font-mono text-xs uppercase tracking-widest">Total Planned Trips</span>
          </div>
          <div className="font-grotesk text-3xl font-bold text-white">{stats?.trips || 0}</div>
        </div>

        <div className="bento-inner-block bg-[#0a0a0a]/70 backdrop-blur-lg shadow-lg border-t-2 border-purple-500">
          <div className="flex items-center gap-2 text-white/50 mb-2">
            <Activity className="w-4 h-4 text-purple-500" />
            <span className="font-mono text-xs uppercase tracking-widest">Capital Logged</span>
          </div>
          <div className="font-grotesk text-3xl font-bold text-white">{stats?.totalVolume || 0}</div>
        </div>

        <div className="bento-inner-block bg-[#0a0a0a]/70 backdrop-blur-lg shadow-lg border-t-2 border-neon-green">
          <div className="flex items-center gap-2 text-white/50 mb-2">
            <Activity className="w-4 h-4 text-neon-green" />
            <span className="font-mono text-xs uppercase tracking-widest">Active Operations</span>
          </div>
          <div className="font-grotesk text-3xl font-bold text-white">{stats?.activeTrips || 0}</div>
        </div>

        <div className="bento-inner-block bg-[#0a0a0a]/70 backdrop-blur-lg shadow-lg border-t-2 border-[#FF00FF]">
          <div className="flex items-center gap-2 text-white/50 mb-2">
            <Trash2 className="w-4 h-4 text-[#FF00FF]" />
            <span className="font-mono text-xs uppercase tracking-widest">Concluded Missions</span>
          </div>
          <div className="font-grotesk text-3xl font-bold text-white">{stats?.concludedTrips || 0}</div>
        </div>

        <div className="bento-inner-block bg-[#0a0a0a]/70 backdrop-blur-lg shadow-lg border-t-2 border-blue-500">
          <div className="flex items-center gap-2 text-white/50 mb-2">
            <MapPin className="w-4 h-4 text-blue-500" />
            <span className="font-mono text-xs uppercase tracking-widest">Stops Deployed</span>
          </div>
          <div className="font-grotesk text-3xl font-bold text-white">{stats?.stops || 0}</div>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {/* Active vs Concluded Trips Pie Chart */}
        <div className="bento-card bg-[#0a0a0a]/80 backdrop-blur-xl p-6 border border-[#222]">
          <h2 className="font-mono text-sm uppercase tracking-widest text-white/70 font-semibold mb-6 flex items-center gap-2">
            <Activity className="w-4 h-4 text-neon-cyan" /> Operations Status
          </h2>
          <div className="h-[250px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={
                    (stats?.activeTrips > 0 || stats?.concludedTrips > 0)
                      ? [
                          { name: 'Active', value: stats?.activeTrips || 0 },
                          { name: 'Concluded', value: stats?.concludedTrips || 0 }
                        ].filter(d => d.value > 0)
                      : [{ name: 'No Data Available', value: 1 }]
                  }
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {(stats?.activeTrips > 0 || stats?.concludedTrips > 0) ? (
                    <>
                      <Cell fill="#39FF14" />
                      <Cell fill="#FF00FF" />
                    </>
                  ) : (
                    <Cell fill="#333333" />
                  )}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff', fontFamily: 'monospace' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4 font-mono text-xs text-white/70">
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#39FF14] rounded-full shadow-[0_0_10px_#39FF1480]"></div>Active</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#FF00FF] rounded-full shadow-[0_0_10px_#FF00FF80]"></div>Concluded</div>
          </div>
        </div>

        {/* Top Destinations Bar Chart */}
        <div className="bento-card bg-[#0a0a0a]/80 backdrop-blur-xl p-6 border border-[#222]">
          <h2 className="font-mono text-sm uppercase tracking-widest text-white/70 font-semibold mb-6 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-neon-orange" /> Global Heatmap (Top 5)
          </h2>
          <div className="h-[250px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.topDestinations?.length > 0 ? stats.topDestinations : [{ name: 'No Data', value: 0 }]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                <XAxis dataKey="name" stroke="#666" tick={{ fill: '#888', fontSize: 10, fontFamily: 'monospace' }} />
                <YAxis stroke="#666" tick={{ fill: '#888', fontSize: 10, fontFamily: 'monospace' }} allowDecimals={false} />
                <Tooltip 
                  cursor={{ fill: '#222' }}
                  contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff', fontFamily: 'monospace' }}
                />
                <Bar dataKey="value" fill="#00F0FF" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* User Management Table */}
      <div className="bento-card bg-[#0a0a0a]/80 backdrop-blur-xl p-6 border border-[#222]">
        <h2 className="font-grotesk text-xl font-bold text-white mb-6">User Roster</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#333]">
                <th className="py-3 px-4 text-xs font-mono uppercase tracking-widest text-white/50">ID</th>
                <th className="py-3 px-4 text-xs font-mono uppercase tracking-widest text-white/50">Operative Name</th>
                <th className="py-3 px-4 text-xs font-mono uppercase tracking-widest text-white/50">Operative Stats</th>
                <th className="py-3 px-4 text-xs font-mono uppercase tracking-widest text-white/50">Clearance Level</th>
                <th className="py-3 px-4 text-xs font-mono uppercase tracking-widest text-white/50 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-b border-[#222] hover:bg-[#111]/50 transition-colors group">
                  <td className="py-4 px-4 font-mono text-sm text-white/40">{u.id}</td>
                  <td className="py-4 px-4">
                    <div className="font-bold text-white text-sm">{u.name}</div>
                    <div className="text-xs text-white/50 font-mono">{u.email}</div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-white/40 font-mono uppercase tracking-widest">Trips</span>
                        <span className="text-sm font-bold text-white">{u.trip_count || 0}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-white/40 font-mono uppercase tracking-widest">Vol. Logged</span>
                        <span className="text-sm font-bold text-neon-green">{u.total_spent || 0}</span>
                      </div>
                    </div>
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
    </div>
  );
}
