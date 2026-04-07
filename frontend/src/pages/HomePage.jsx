import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Heart, Shield, Calendar, BookOpen, AlertCircle,
  ArrowRight, Activity, Users, Clock, Star,
  CheckCircle, ChevronRight, Zap, Lock
} from 'lucide-react';
import { ScrollReveal, StaggerReveal, staggerItem } from '../components/AnimationWrappers';
import { useTheme } from '../context/ThemeContext';

const features = [
  {
    icon: Calendar,
    color: 'from-sky-500 to-blue-600',
    glow: 'glow-blue',
    title: 'Smart Appointments',
    desc: 'Book, reschedule, or cancel appointments with top doctors in seconds.',
  },
  {
    icon: AlertCircle,
    color: 'from-red-500 to-rose-600',
    glow: 'glow-red',
    title: 'Emergency Response',
    desc: 'One-tap emergency alerts with GPS location sharing to nearby hospitals.',
  },
  {
    icon: BookOpen,
    color: 'from-teal-500 to-green-600',
    glow: 'glow-teal',
    title: 'Health Library',
    desc: 'Curated articles on fitness, mental health, diet, and preventive care.',
  },
  {
    icon: Shield,
    color: 'from-purple-500 to-violet-600',
    glow: 'glow-blue',
    title: 'Secure Records',
    desc: 'Your medical history encrypted and accessible only to you and your providers.',
  },
  {
    icon: Activity,
    color: 'from-orange-500 to-amber-600',
    glow: 'glow-teal',
    title: 'Health Tracking',
    desc: 'Monitor your vitals, appointments, and wellness trends on one dashboard.',
  },
  {
    icon: Zap,
    color: 'from-cyan-500 to-sky-600',
    glow: 'glow-blue',
    title: 'Instant Alerts',
    desc: 'Real-time notifications for appointments, reminders, and health tips.',
  },
];

const stats = [
  { label: 'Active Patients', value: '50K+', icon: Users },
  { label: 'Doctors Available', value: '1,200+', icon: Heart },
  { label: 'Appointments Booked', value: '200K+', icon: Calendar },
  { label: 'Emergency Responses', value: '98%', icon: Clock },
];

const testimonials = [
  { name: 'Priya Sharma', role: 'Patient', rating: 5, text: 'MedCare made booking appointments incredibly easy. The emergency feature is a lifesaver!' },
  { name: 'Dr. Arjun Mehta', role: 'Cardiologist', rating: 5, text: 'Finally a platform that streamlines patient management. The dashboard is intuitive and powerful.' },
  { name: 'Ravi Kumar', role: 'Patient', rating: 5, text: 'The health articles are so well-curated. I feel more informed about my wellness journey.' },
];

export default function HomePage() {
  const { isDark } = useTheme();

  return (
    <div className={isDark ? '' : 'bg-white text-slate-900'}>
      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Background */}
        <div className={`absolute inset-0 ${isDark ? 'bg-animated grid-pattern' : 'bg-gradient-to-br from-sky-50 to-teal-50'}`} />
        {/* Orbs */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-sky-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-sky-500/30 text-sky-400 text-sm font-medium mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Next-Gen Healthcare Platform • Now Live
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6"
          >
            Your Health,{' '}
            <span className="gradient-text">Reimagined</span>
            <br />
            for the Digital Age
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className={`text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}
          >
            MedCare connects patients, doctors, and emergency services in one seamless experience.
            Book appointments, access health records, and get help when it matters most.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Link
              to="/register"
              className="flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold bg-gradient-to-r from-sky-500 to-teal-500 text-white hover:shadow-glow-lg transition-all duration-300 hover:scale-105"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/emergency"
              className={`flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold border transition-all duration-300 hover:scale-105 ${
                isDark
                  ? 'border-white/20 text-white hover:bg-white/10'
                  : 'border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <AlertCircle className="w-4 h-4 text-red-400" />
              Emergency Services
            </Link>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="flex flex-wrap justify-center gap-6 text-sm"
          >
            {['HIPAA Compliant', 'SSL Encrypted', '24/7 Support', 'ISO Certified'].map((badge) => (
              <span key={badge} className={`flex items-center gap-1.5 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                <CheckCircle className="w-4 h-4 text-green-400" />
                {badge}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-6 h-10 border-2 border-sky-500/40 rounded-full flex justify-center pt-2"
          >
            <div className="w-1 h-2 bg-sky-400 rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* ── STATS ── */}
      <section className={`py-16 ${isDark ? 'bg-dark-800' : 'bg-sky-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <StaggerReveal className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map(({ label, value, icon: Icon }) => (
              <motion.div key={label} variants={staggerItem} className={`text-center p-6 rounded-2xl glass ${isDark ? '' : 'glass-light'}`}>
                <Icon className="w-6 h-6 text-sky-400 mx-auto mb-3" />
                <div className="font-display text-3xl font-bold gradient-text mb-1">{value}</div>
                <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{label}</div>
              </motion.div>
            ))}
          </StaggerReveal>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-sky-600/10 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center mb-16">
            <span className={`text-sm font-semibold text-sky-400 tracking-widest uppercase`}>Everything You Need</span>
            <h2 className="font-display text-4xl font-bold mt-3 mb-4">
              Comprehensive <span className="gradient-text">Healthcare Features</span>
            </h2>
            <p className={`max-w-xl mx-auto ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              From routine check-ups to emergency care, MedCare covers every aspect of your healthcare journey.
            </p>
          </ScrollReveal>

          <StaggerReveal className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, color, glow, title, desc }) => (
              <motion.div
                key={title}
                variants={staggerItem}
                whileHover={{ y: -6, scale: 1.02 }}
                className={`group p-6 rounded-2xl glass border border-white/5 hover:border-sky-500/30 transition-all duration-300 cursor-pointer`}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-5 group-hover:${glow} group-hover:shadow-glow transition-all duration-300`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className={`font-semibold text-lg mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>{title}</h3>
                <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{desc}</p>
                <div className="flex items-center gap-1 mt-4 text-sky-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Learn more <ChevronRight className="w-4 h-4" />
                </div>
              </motion.div>
            ))}
          </StaggerReveal>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className={`py-24 ${isDark ? 'bg-dark-800' : 'bg-slate-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center mb-16">
            <span className="text-sm font-semibold text-teal-400 tracking-widest uppercase">Simple Process</span>
            <h2 className="font-display text-4xl font-bold mt-3">
              Get Started in <span className="gradient-text">3 Simple Steps</span>
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-1/4 right-1/4 h-px bg-gradient-to-r from-sky-500/50 via-teal-500/50 to-sky-500/50" />
            {[
              { step: '01', icon: Lock, title: 'Create Account', desc: 'Sign up securely and complete your health profile in minutes.' },
              { step: '02', icon: Calendar, title: 'Book or Explore', desc: 'Schedule appointments or browse our health information library.' },
              { step: '03', icon: Heart, title: 'Stay Healthy', desc: 'Manage records, get reminders, and access care whenever you need.' },
            ].map(({ step, icon: Icon, title, desc }, i) => (
              <ScrollReveal key={title} delay={i * 0.15} direction="up" className="relative text-center">
                <div className={`w-24 h-24 mx-auto rounded-full glass border-2 border-sky-500/30 flex items-center justify-center mb-6 relative z-10 ${isDark ? '' : 'bg-white shadow-lg'}`}>
                  <Icon className="w-8 h-8 text-sky-400" />
                  <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-gradient-to-br from-sky-500 to-teal-500 flex items-center justify-center text-white text-xs font-bold">{step}</span>
                </div>
                <h3 className={`font-semibold text-xl mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>{title}</h3>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{desc}</p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center mb-16">
            <span className="text-sm font-semibold text-purple-400 tracking-widest uppercase">Testimonials</span>
            <h2 className="font-display text-4xl font-bold mt-3">
              Trusted by <span className="gradient-text-purple">Thousands</span>
            </h2>
          </ScrollReveal>
          <StaggerReveal className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map(({ name, role, rating, text }) => (
              <motion.div
                key={name}
                variants={staggerItem}
                whileHover={{ y: -4 }}
                className={`p-6 rounded-2xl glass border border-white/5 hover:border-purple-500/30 transition-all`}
              >
                <div className="flex mb-3">
                  {Array.from({ length: rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className={`text-sm leading-relaxed mb-5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>"{text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold">
                    {name[0]}
                  </div>
                  <div>
                    <div className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>{name}</div>
                    <div className="text-xs text-slate-400">{role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </StaggerReveal>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="relative rounded-3xl overflow-hidden p-10 text-center">
              <div className="absolute inset-0 bg-gradient-to-r from-sky-600 via-teal-600 to-blue-700" />
              <div className="absolute inset-0 opacity-30 grid-pattern" />
              <div className="relative z-10">
                <h2 className="font-display text-4xl font-bold text-white mb-4">
                  Ready to Transform Your Healthcare?
                </h2>
                <p className="text-sky-100 mb-8 text-lg">
                  Join 50,000+ patients who trust MedCare for their health needs.
                </p>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold bg-white text-sky-600 hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  Start Your Journey Free <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
