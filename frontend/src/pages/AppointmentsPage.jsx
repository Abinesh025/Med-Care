import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar, Clock, User, ChevronDown, X, CheckCircle,
  AlertCircle, RefreshCw, Filter, Plus
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { PageTransition, ScrollReveal, StaggerReveal, staggerItem } from '../components/AnimationWrappers';
import { SkeletonCard, Spinner } from '../components/LoadingSpinner';
import api from '../utils/api';
import toast from 'react-hot-toast';

const doctors = [
  { id: 'd1', name: 'Dr. Arjun Mehta', specialty: 'Cardiologist', available: true },
  { id: 'd2', name: 'Dr. Priya Nair', specialty: 'Dermatologist', available: true },
  { id: 'd3', name: 'Dr. Suresh Babu', specialty: 'Orthopedic', available: true },
  { id: 'd4', name: 'Dr. Ananya Roy', specialty: 'Pediatrician', available: true },
  { id: 'd5', name: 'Dr. Kiran Shah', specialty: 'Neurologist', available: true },
  { id: 'd6', name: 'Dr. Meena Iyer', specialty: 'Gynecologist', available: true },
];

const timeSlots = ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'];

const statusColors = {
  scheduled: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
  completed:  'bg-green-500/20 text-green-400 border-green-500/30',
  cancelled:  'bg-red-500/20 text-red-400 border-red-500/30',
};

export default function AppointmentsPage() {
  const { isAuthenticated } = useAuth();
  const { isDark } = useTheme();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('all');
  const [form, setForm] = useState({ doctorId: '', date: '', timeSlot: '', reason: '' });
  const [errors, setErrors] = useState({});

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/appointments');
      setAppointments(data);
    } catch {
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (isAuthenticated) fetchAppointments(); else setLoading(false); }, [isAuthenticated]);

  const validate = () => {
    const errs = {};
    if (!form.doctorId)  errs.doctorId  = 'Please select a doctor';
    if (!form.date)      errs.date      = 'Please select a date';
    else if (new Date(form.date) < new Date().setHours(0,0,0,0)) errs.date = 'Cannot book past dates';
    if (!form.timeSlot)  errs.timeSlot  = 'Please select a time slot';
    if (!form.reason.trim()) errs.reason = 'Please describe your reason';
    return errs;
  };

  const handleBook = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitting(true);
    try {
      const doctor = doctors.find((d) => d.id === form.doctorId);
      const { data } = await api.post('/appointments', { ...form, doctorName: doctor?.name, doctorSpecialty: doctor?.specialty });
      setAppointments([data, ...appointments]);
      setShowForm(false);
      setForm({ doctorId: '', date: '', timeSlot: '', reason: '' });
      toast.success('Appointment booked successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async (id) => {
    try {
      await api.patch(`/appointments/${id}/cancel`);
      setAppointments(appointments.map((a) => a._id === id ? { ...a, status: 'cancelled' } : a));
      toast.success('Appointment cancelled');
    } catch { toast.error('Failed to cancel'); }
  };

  const minDate = new Date().toISOString().split('T')[0];
  const filtered = filter === 'all' ? appointments : appointments.filter((a) => a.status === filter);

  return (
    <PageTransition>
      <div className={`min-h-screen pt-20 pb-10 px-4 ${isDark ? '' : 'bg-slate-50'}`}>
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <ScrollReveal className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className={`font-display text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                <span className="gradient-text">Appointments</span>
              </h1>
              <p className={`mt-1 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Book and manage your doctor appointments</p>
            </div>
            {isAuthenticated && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold bg-gradient-to-r from-sky-500 to-teal-500 text-white hover:shadow-glow transition-all"
              >
                <Plus className="w-4 h-4" /> Book Appointment
              </motion.button>
            )}
          </ScrollReveal>

          {/* Filter tabs */}
          <ScrollReveal delay={0.1} className="flex items-center gap-2 mb-6 flex-wrap">
            {['all', 'scheduled', 'completed', 'cancelled'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-all ${
                  filter === f
                    ? 'bg-sky-500 text-white shadow-glow'
                    : isDark ? 'glass text-slate-400 hover:text-sky-400' : 'bg-white border border-slate-200 text-slate-600 hover:border-sky-400'
                }`}
              >
                {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
            <span className={`ml-auto text-sm ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>{filtered.length} records</span>
          </ScrollReveal>

          {/* Appointments List */}
          {!isAuthenticated ? (
            <div className={`text-center py-20 glass rounded-2xl`}>
              <Calendar className="w-12 h-12 text-sky-400 mx-auto mb-3" />
              <h3 className={`font-semibold text-lg mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>Sign in to view appointments</h3>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Create an account or log in to book and manage your appointments.</p>
            </div>
          ) : loading ? (
            <div className="grid grid-cols-1 gap-4">
              {[1,2,3].map((i) => <SkeletonCard key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className={`text-center py-20 rounded-2xl ${isDark ? 'glass' : 'bg-white border border-slate-200'}`}>
              <Calendar className="w-12 h-12 text-sky-400 mx-auto mb-3" />
              <h3 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>No appointments found</h3>
              <button onClick={() => setShowForm(true)} className="text-sky-400 text-sm hover:underline">Book your first appointment →</button>
            </div>
          ) : (
            <StaggerReveal className="space-y-4">
              {filtered.map((apt) => (
                <motion.div
                  key={apt._id}
                  variants={staggerItem}
                  whileHover={{ x: 4 }}
                  className={`rounded-2xl p-5 border transition-all ${isDark ? 'glass border-white/5 hover:border-sky-500/30' : 'bg-white border-slate-200 hover:border-sky-300 shadow-sm'}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500 to-teal-500 flex items-center justify-center flex-shrink-0">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{apt.doctorName}</h3>
                        <p className="text-sky-400 text-sm">{apt.doctorSpecialty}</p>
                        <div className={`flex flex-wrap items-center gap-3 mt-2 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{new Date(apt.date).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}</span>
                          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{apt.timeSlot}</span>
                        </div>
                        {apt.reason && <p className={`text-xs mt-2 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>Reason: {apt.reason}</p>}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border capitalize ${statusColors[apt.status]}`}>
                        {apt.status}
                      </span>
                      {apt.status === 'scheduled' && (
                        <button onClick={() => handleCancel(apt._id)} className="text-xs text-red-400 hover:text-red-300 transition-colors flex items-center gap-1">
                          <X className="w-3 h-3" /> Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </StaggerReveal>
          )}
        </div>
      </div>

      {/* Booking Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.93, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.93 }}
            className={`w-full max-w-lg rounded-3xl p-6 max-h-[90vh] overflow-y-auto ${isDark ? 'glass' : 'bg-white'}`}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className={`font-display text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Book Appointment</h2>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBook} className="space-y-4">
              {/* Doctor */}
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Select Doctor</label>
                <select value={form.doctorId} onChange={(e) => { setForm({...form, doctorId: e.target.value}); setErrors({...errors, doctorId:''}); }}
                  className={`input-dark ${isDark ? '' : 'bg-slate-50 text-slate-900 border-slate-200'}`}>
                  <option value="">Choose a doctor…</option>
                  {doctors.map((d) => <option key={d.id} value={d.id}>{d.name} — {d.specialty}</option>)}
                </select>
                {errors.doctorId && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.doctorId}</p>}
              </div>

              {/* Date */}
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Appointment Date</label>
                <input type="date" min={minDate} value={form.date}
                  onChange={(e) => { setForm({...form, date: e.target.value}); setErrors({...errors, date:''}); }}
                  className={`input-dark ${isDark ? '' : 'bg-slate-50 text-slate-900 border-slate-200'} ${errors.date ? 'border-red-500' : ''}`} />
                {errors.date && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.date}</p>}
              </div>

              {/* Time slots */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Time Slot</label>
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots.map((slot) => (
                    <button key={slot} type="button"
                      onClick={() => { setForm({...form, timeSlot: slot}); setErrors({...errors, timeSlot:''}); }}
                      className={`py-2 px-3 rounded-lg text-xs font-medium border transition-all ${
                        form.timeSlot === slot
                          ? 'bg-sky-500 text-white border-sky-500 shadow-glow'
                          : isDark ? 'glass border-white/10 text-slate-400 hover:border-sky-500/50' : 'border-slate-200 text-slate-600 hover:border-sky-400'
                      }`}
                    >{slot}</button>
                  ))}
                </div>
                {errors.timeSlot && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.timeSlot}</p>}
              </div>

              {/* Reason */}
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Reason for Visit</label>
                <textarea rows={3} value={form.reason}
                  onChange={(e) => { setForm({...form, reason: e.target.value}); setErrors({...errors, reason:''}); }}
                  placeholder="Describe your symptoms or reason for the appointment…"
                  className={`input-dark resize-none ${isDark ? '' : 'bg-slate-50 text-slate-900 border-slate-200 placeholder:text-slate-400'} ${errors.reason ? 'border-red-500':''}`} />
                {errors.reason && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.reason}</p>}
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)}
                  className={`flex-1 py-2.5 rounded-xl font-medium border transition-colors ${isDark ? 'border-white/10 text-slate-400 hover:bg-white/5' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                  Cancel
                </button>
                <button type="submit" disabled={submitting}
                  className="flex-1 py-2.5 rounded-xl font-semibold bg-gradient-to-r from-sky-500 to-teal-500 text-white hover:shadow-glow disabled:opacity-60 flex items-center justify-center gap-2">
                  {submitting ? <><Spinner size="sm" color="white" />Booking…</> : <><CheckCircle className="w-4 h-4" />Confirm</>}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </PageTransition>
  );
}
