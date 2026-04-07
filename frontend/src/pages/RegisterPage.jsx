import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Heart, Mail, Lock, User, Phone, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Spinner } from '../components/LoadingSpinner';
import { PageTransition } from '../components/AnimationWrappers';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const { login } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '', role: 'patient' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const set = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
    setErrors({ ...errors, [field]: '' });
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email format';
    if (!form.phone) errs.phone = 'Phone is required';
    else if (!/^\d{10}$/.test(form.phone.replace(/\D/g, ''))) errs.phone = 'Enter a valid 10-digit phone number';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 8) errs.password = 'Minimum 8 characters';
    else if (!/(?=.*[A-Z])(?=.*\d)/.test(form.password)) errs.password = 'Must include uppercase and a number';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', {
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        role: form.role,
      });
      login(data.user, data.token);
      toast.success('Account created successfully!');
      navigate('/');
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field) =>
    `input-dark ${errors[field] ? 'border-red-500' : ''} ${isDark ? '' : 'bg-slate-50 text-slate-900 border-slate-200 placeholder:text-slate-400'}`;

  return (
    <PageTransition>
      <div className={`min-h-screen flex items-center justify-center px-4 pt-24 pb-10 ${isDark ? 'bg-animated' : 'bg-gradient-to-br from-sky-50 to-teal-50'}`}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 -left-20 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`relative w-full max-w-lg rounded-3xl p-8 ${isDark ? 'glass' : 'bg-white shadow-xl border border-sky-100'}`}
        >
          <div className="text-center mb-8">
            <div className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-teal-500 to-sky-500 mb-4 shadow-glow-teal">
              <Heart className="w-7 h-7 text-white" fill="white" />
            </div>
            <h1 className={`font-display text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Create Account</h1>
            <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Join MedCare and take control of your health</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input id="reg-name" type="text" value={form.name} onChange={set('name')} placeholder="John Doe" className={`${inputClass('name')} pl-10`} />
              </div>
              {errors.name && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input id="reg-email" type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" className={`${inputClass('email')} pl-10`} />
              </div>
              {errors.email && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.email}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input id="reg-phone" type="tel" value={form.phone} onChange={set('phone')} placeholder="9876543210" className={`${inputClass('phone')} pl-10`} />
              </div>
              {errors.phone && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.phone}</p>}
            </div>

            {/* Password */}
            <div>
              <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input id="reg-password" type={showPass ? 'text' : 'password'} value={form.password} onChange={set('password')} placeholder="Min 8 chars, uppercase & number" className={`${inputClass('password')} pl-10 pr-10`} />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input id="reg-confirm" type={showPass ? 'text' : 'password'} value={form.confirmPassword} onChange={set('confirmPassword')} placeholder="Repeat password" className={`${inputClass('confirmPassword')} pl-10`} />
              </div>
              {errors.confirmPassword && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.confirmPassword}</p>}
            </div>

            {/* Role */}
            <div>
              <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Account Type</label>
              <select
                id="reg-role"
                value={form.role}
                onChange={set('role')}
                className={`input-dark ${isDark ? '' : 'bg-slate-50 text-slate-900 border-slate-200'}`}
              >
                <option value="patient">Patient</option>
                <option value="admin">Healthcare Provider / Admin</option>
              </select>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-teal-500 to-sky-500 text-white hover:shadow-glow-teal transition-all duration-300 disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? <><Spinner size="sm" color="white" /> Creating Account…</> : 'Create Account'}
            </motion.button>
          </form>

          <p className={`text-center text-sm mt-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Already have an account?{' '}
            <Link to="/login" className="text-sky-400 hover:text-sky-300 font-medium">Sign in</Link>
          </p>
        </motion.div>
      </div>
    </PageTransition>
  );
}
