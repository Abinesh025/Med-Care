import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Edit3, Save, X, Shield, Calendar, Heart, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { PageTransition, ScrollReveal } from '../components/AnimationWrappers';
import { Spinner } from '../components/LoadingSpinner';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, login, token } = useAuth();
  const { isDark } = useTheme();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    age: user?.age || '',
    bloodGroup: user?.bloodGroup || '',
    allergies: user?.allergies || '',
    medicalHistory: user?.medicalHistory || '',
  });

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await api.put('/auth/profile', form);
      login(data.user, token);
      setEditing(false);
      toast.success('Profile updated successfully!');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const inputClass = `input-dark ${isDark ? '' : 'bg-slate-50 text-slate-900 border-slate-200 placeholder:text-slate-400'}`;

  return (
    <PageTransition>
      <div className={`min-h-screen pt-20 pb-10 px-4 ${isDark ? '' : 'bg-slate-50'}`}>
        <div className="max-w-3xl mx-auto">
          <ScrollReveal className="mb-8">
            <h1 className={`font-display text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              My <span className="gradient-text">Profile</span>
            </h1>
            <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Manage your personal and medical information</p>
          </ScrollReveal>

          {/* Profile Card */}
          <ScrollReveal delay={0.1}>
            <div className={`rounded-3xl overflow-hidden ${isDark ? 'glass' : 'bg-white shadow-xl border border-slate-200'}`}>
              {/* Banner */}
              <div className="h-28 bg-gradient-to-r from-sky-600 via-teal-600 to-blue-700 relative">
                <div className="absolute inset-0 opacity-30 grid-pattern" />
              </div>

              {/* Avatar area */}
              <div className="px-8 pb-6">
                <div className="flex items-end justify-between -mt-10 mb-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-sky-400 to-teal-400 border-4 border-dark-900 flex items-center justify-center shadow-glow">
                    <span className="font-display text-3xl font-bold text-white">
                      {user?.name?.[0]?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {editing ? (
                      <>
                        <button onClick={() => setEditing(false)} className={`px-4 py-2 rounded-xl text-sm border transition-colors ${isDark ? 'border-white/10 text-slate-400 hover:bg-white/5' : 'border-slate-200 text-slate-600'}`}>
                          <X className="w-4 h-4" />
                        </button>
                        <motion.button onClick={handleSave} disabled={saving} whileTap={{ scale: 0.95 }}
                          className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-sky-500 to-teal-500 text-white hover:shadow-glow disabled:opacity-60">
                          {saving ? <Spinner size="sm" color="white" /> : <Save className="w-4 h-4" />} Save
                        </motion.button>
                      </>
                    ) : (
                      <button onClick={() => setEditing(true)} className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium border transition-colors ${isDark ? 'glass border-white/10 text-slate-300 hover:border-sky-500/30' : 'border-slate-200 text-slate-700 hover:border-sky-400'}`}>
                        <Edit3 className="w-4 h-4" /> Edit
                      </button>
                    )}
                  </div>
                </div>

                {/* Basic info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className={`block text-xs font-medium mb-1.5 uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Full Name</label>
                    {editing ? (
                      <input value={form.name} onChange={set('name')} className={inputClass} placeholder="Your full name" />
                    ) : (
                      <p className={`font-semibold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}><User className="w-4 h-4 text-sky-400" />{user?.name || '—'}</p>
                    )}
                  </div>
                  <div>
                    <label className={`block text-xs font-medium mb-1.5 uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Email</label>
                    <p className={`flex items-center gap-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}><Mail className="w-4 h-4 text-sky-400" />{user?.email || '—'}</p>
                  </div>
                  <div>
                    <label className={`block text-xs font-medium mb-1.5 uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Phone</label>
                    {editing ? (
                      <input value={form.phone} onChange={set('phone')} className={inputClass} placeholder="Phone number" />
                    ) : (
                      <p className={`flex items-center gap-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}><Phone className="w-4 h-4 text-teal-400" />{user?.phone || '—'}</p>
                    )}
                  </div>
                  <div>
                    <label className={`block text-xs font-medium mb-1.5 uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Role</label>
                    <p className={`flex items-center gap-2 ${isDark ? 'text-slate-300' : 'text-slate-700'} capitalize`}>
                      <Shield className="w-4 h-4 text-purple-400" />{user?.role || 'patient'}
                    </p>
                  </div>
                </div>

                {/* Medical Info divider */}
                <div className={`my-6 border-t ${isDark ? 'border-white/10' : 'border-slate-200'}`} />
                <h3 className={`font-semibold mb-5 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  <Heart className="w-5 h-5 text-red-400" /> Medical Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div>
                    <label className={`block text-xs font-medium mb-1.5 uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Age</label>
                    {editing ? (
                      <input type="number" value={form.age} onChange={set('age')} className={inputClass} placeholder="Years" min="0" max="150" />
                    ) : (
                      <p className={`flex items-center gap-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}><Calendar className="w-4 h-4 text-sky-400" />{user?.age ? `${user.age} years` : '—'}</p>
                    )}
                  </div>
                  <div>
                    <label className={`block text-xs font-medium mb-1.5 uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Blood Group</label>
                    {editing ? (
                      <select value={form.bloodGroup} onChange={set('bloodGroup')} className={`input-dark ${isDark ? '' : 'bg-slate-50 text-slate-900 border-slate-200'}`}>
                        <option value="">Select…</option>
                        {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map((b) => <option key={b} value={b}>{b}</option>)}
                      </select>
                    ) : (
                      <p className={`flex items-center gap-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        <span className="w-4 h-4 rounded-full bg-red-500 flex-shrink-0" />
                        {user?.bloodGroup || '—'}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className={`block text-xs font-medium mb-1.5 uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Allergies</label>
                    {editing ? (
                      <input value={form.allergies} onChange={set('allergies')} className={inputClass} placeholder="e.g. Penicillin, Dust" />
                    ) : (
                      <p className={`flex items-center gap-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        <AlertCircle className="w-4 h-4 text-orange-400" />{user?.allergies || 'None'}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-5">
                  <label className={`block text-xs font-medium mb-1.5 uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Medical History</label>
                  {editing ? (
                    <textarea rows={4} value={form.medicalHistory} onChange={set('medicalHistory')}
                      className={`input-dark resize-none ${isDark ? '' : 'bg-slate-50 text-slate-900 border-slate-200 placeholder:text-slate-400'}`}
                      placeholder="List any chronic conditions, previous surgeries, medications…" />
                  ) : (
                    <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {user?.medicalHistory || 'No medical history recorded.'}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </PageTransition>
  );
}
