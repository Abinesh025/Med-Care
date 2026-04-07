import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Users, Calendar, AlertCircle,
  TrendingUp, Activity, Clock, CheckCircle, X,
  RefreshCw, ChevronRight, BookOpen
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { PageTransition, ScrollReveal, StaggerReveal, staggerItem } from '../components/AnimationWrappers';
import { SkeletonCard } from '../components/LoadingSpinner';
import api from '../utils/api';
import toast from 'react-hot-toast';

const StatCard = ({ icon: Icon, label, value, color, isDark }) => (
  <motion.div
    variants={staggerItem}
    whileHover={{ y: -4, scale: 1.02 }}
    className={`rounded-2xl p-5 border transition-all ${isDark ? 'glass border-white/5' : 'bg-white border-slate-200 shadow-sm'}`}
  >
    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4`}>
      <Icon className="w-5 h-5 text-white" />
    </div>
    <div className={`text-3xl font-display font-bold mb-1 gradient-text`}>{value}</div>
    <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{label}</div>
  </motion.div>
);

export default function DashboardPage() {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [stats, setStats] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [emergencies, setEmergencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('appointments');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [aptsRes, emRes] = await Promise.all([
        api.get('/appointments/all'),
        api.get('/emergency/all'),
      ]);
      const apts = aptsRes.data;
      const ems  = emRes.data;
      setAppointments(apts);
      setEmergencies(ems);
      setStats({
        total:     apts.length,
        scheduled: apts.filter((a) => a.status === 'scheduled').length,
        completed: apts.filter((a) => a.status === 'completed').length,
        emergency: ems.length,
      });
    } catch {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleStatus = async (id, status) => {
    try {
      await api.patch(`/appointments/${id}/status`, { status });
      setAppointments((prev) => prev.map((a) => a._id === id ? { ...a, status } : a));
      setStats((s) => s ? {
        ...s,
        scheduled: status === 'completed' || status === 'cancelled' ? s.scheduled - 1 : s.scheduled,
        completed: status === 'completed' ? s.completed + 1 : s.completed,
      } : s);
      toast.success(`Appointment marked as ${status}`);
    } catch { toast.error('Update failed'); }
  };

  const statCards = [
    { icon: Calendar,      label: 'Total Appointments', value: stats?.total     ?? '—', color: 'from-sky-500 to-blue-600' },
    { icon: Clock,         label: 'Scheduled',          value: stats?.scheduled ?? '—', color: 'from-amber-500 to-orange-600' },
    { icon: CheckCircle,   label: 'Completed',           value: stats?.completed ?? '—', color: 'from-green-500 to-teal-600' },
    { icon: AlertCircle,   label: 'Emergency Requests',  value: stats?.emergency ?? '—', color: 'from-red-500 to-rose-600' },
  ];

  const statusBadge = {
    scheduled: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
    completed:  'bg-green-500/20 text-green-400 border-green-500/30',
    cancelled:  'bg-red-500/20 text-red-400 border-red-500/30',
  };

  return (
    <PageTransition>
      <div className={`min-h-screen pt-20 pb-10 px-4 ${isDark ? '' : 'bg-slate-50'}`}>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <ScrollReveal className="flex items-center justify-between mb-8">
            <div>
              <h1 className={`font-display text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Admin <span className="gradient-text">Dashboard</span>
              </h1>
              <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Welcome back, {user?.name}. Here's your overview.
              </p>
            </div>
            <button onClick={fetchData} className={`p-2.5 rounded-xl border transition-all ${isDark ? 'glass border-white/10 hover:border-sky-500/30 text-slate-400 hover:text-sky-400' : 'bg-white border-slate-200 hover:border-sky-400 text-slate-500'}`}>
              <RefreshCw className="w-5 h-5" />
            </button>
          </ScrollReveal>

          {/* Stats */}
          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[1,2,3,4].map((i) => <SkeletonCard key={i} />)}
            </div>
          ) : (
            <StaggerReveal className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {statCards.map((s) => <StatCard key={s.label} {...s} isDark={isDark} />)}
            </StaggerReveal>
          )}

          {/* Tabs */}
          <ScrollReveal className={`rounded-2xl overflow-hidden ${isDark ? 'glass' : 'bg-white shadow-sm border border-slate-200'}`}>
            <div className={`flex border-b ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
              {[
                { id: 'appointments', label: 'Appointments', icon: Calendar },
                { id: 'emergencies',  label: 'Emergencies',  icon: AlertCircle },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-all ${
                    tab === id
                      ? 'border-sky-500 text-sky-400'
                      : `border-transparent ${isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-500 hover:text-slate-700'}`
                  }`}
                >
                  <Icon className="w-4 h-4" />{label}
                </button>
              ))}
            </div>

            <div className="p-6">
              {tab === 'appointments' && (
                loading ? (
                  <div className="space-y-3">{[1,2,3].map((i) => <SkeletonCard key={i} />)}</div>
                ) : appointments.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="w-10 h-10 text-slate-500 mx-auto mb-2" />
                    <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>No appointments yet</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className={`text-left ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                          {['Patient','Doctor','Specialty','Date','Time','Reason','Status','Actions'].map((h) => (
                            <th key={h} className="pb-3 pr-4 font-medium whitespace-nowrap">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="space-y-1">
                        {appointments.map((apt) => (
                          <tr key={apt._id} className={`border-t ${isDark ? 'border-white/5' : 'border-slate-100'}`}>
                            <td className={`py-3 pr-4 font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{apt.patientName || apt.userId?.name || '—'}</td>
                            <td className={`py-3 pr-4 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{apt.doctorName}</td>
                            <td className={`py-3 pr-4 text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{apt.doctorSpecialty}</td>
                            <td className={`py-3 pr-4 ${isDark ? 'text-slate-400' : 'text-slate-500'} whitespace-nowrap`}>{new Date(apt.date).toLocaleDateString('en-IN',{day:'numeric',month:'short'})}</td>
                            <td className={`py-3 pr-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{apt.timeSlot}</td>
                            <td className={`py-3 pr-4 max-w-[140px] truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{apt.reason}</td>
                            <td className="py-3 pr-4">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-medium border capitalize ${statusBadge[apt.status]}`}>{apt.status}</span>
                            </td>
                            <td className="py-3">
                              {apt.status === 'scheduled' && (
                                <div className="flex gap-2">
                                  <button onClick={() => handleStatus(apt._id, 'completed')} className="text-xs text-green-400 hover:underline">Complete</button>
                                  <button onClick={() => handleStatus(apt._id, 'cancelled')} className="text-xs text-red-400 hover:underline">Cancel</button>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )
              )}

              {tab === 'emergencies' && (
                loading ? (
                  <div className="space-y-3">{[1,2].map((i) => <SkeletonCard key={i} />)}</div>
                ) : emergencies.length === 0 ? (
                  <div className="text-center py-12">
                    <AlertCircle className="w-10 h-10 text-slate-500 mx-auto mb-2" />
                    <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>No emergency requests</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {emergencies.map((em) => (
                      <div key={em._id} className={`rounded-xl p-4 border ${isDark ? 'border-red-500/20 bg-red-500/5' : 'border-red-100 bg-red-50'}`}>
                        <div className="flex items-start justify-between">
                          <div>
                            <p className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{em.patientName}</p>
                            <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>📍 {em.location}</p>
                            {em.notes && <p className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>{em.notes}</p>}
                          </div>
                          <div className="text-right">
                            <span className="px-2.5 py-1 rounded-full text-xs bg-red-500/20 text-red-400 border border-red-500/30">SOS</span>
                            <p className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                              {new Date(em.createdAt).toLocaleString('en-IN')}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              )}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </PageTransition>
  );
}
