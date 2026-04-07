import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Heart, Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Spinner } from '../components/LoadingSpinner';
import { PageTransition } from '../components/AnimationWrappers';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { login } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email format';
    if (!form.password) errs.password = 'Password is required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', form);
      login(data.user, data.token);
      toast.success(`Welcome back, ${data.user.name}!`);
      navigate(from, { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className={`min-h-screen flex items-center justify-center px-4 pt-20 pb-10 ${isDark ? 'bg-animated' : 'bg-gradient-to-br from-sky-50 to-teal-50'}`}>
        {/* Background orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 -left-20 w-80 h-80 bg-sky-500/15 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-teal-500/15 rounded-full blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`relative w-full max-w-md rounded-3xl p-8 ${isDark ? 'glass' : 'bg-white shadow-xl border border-sky-100'}`}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-sky-500 to-teal-500 mb-4 shadow-glow">
              <Heart className="w-7 h-7 text-white" fill="white" />
            </div>
            <h1 className={`font-display text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Welcome Back
            </h1>
            <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Sign in to access your MedCare account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="login-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => { setForm({ ...form, email: e.target.value }); setErrors({ ...errors, email: '' }); }}
                  placeholder="you@example.com"
                  className={`input-dark pl-10 ${errors.email ? 'border-red-500' : ''} ${isDark ? '' : 'bg-slate-50 text-slate-900 border-slate-200 placeholder:text-slate-400'}`}
                />
              </div>
              {errors.email && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="login-password"
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => { setForm({ ...form, password: e.target.value }); setErrors({ ...errors, password: '' }); }}
                  placeholder="Enter your password"
                  className={`input-dark pl-10 pr-10 ${errors.password ? 'border-red-500' : ''} ${isDark ? '' : 'bg-slate-50 text-slate-900 border-slate-200 placeholder:text-slate-400'}`}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.password}</p>}
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-sky-500 to-teal-500 text-white hover:shadow-glow transition-all duration-300 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? <><Spinner size="sm" color="white" /> Signing in…</> : 'Sign In'}
            </motion.button>
          </form>

          <p className={`text-center text-sm mt-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Don't have an account?{' '}
            <Link to="/register" className="text-sky-400 hover:text-sky-300 font-medium">
              Create one free
            </Link>
          </p>

          {/* Demo credentials */}
          <div className={`mt-4 p-3 rounded-xl text-xs text-center ${isDark ? 'bg-white/5 text-slate-500' : 'bg-slate-50 text-slate-500'}`}>
            <strong>Demo Admin:</strong> admin@medcare.com / Admin@123
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
}
