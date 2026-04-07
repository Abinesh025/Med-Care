import { motion } from 'framer-motion';

export function Spinner({ size = 'md', color = 'sky' }) {
  const sizes = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' };
  const colors = {
    sky: 'border-sky-500',
    teal: 'border-teal-500',
    white: 'border-white',
  };
  return (
    <div className={`${sizes[size]} border-2 ${colors[color]} border-t-transparent rounded-full animate-spin`} />
  );
}

export function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-900">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-4"
      >
        <div className="relative">
          <div className="w-16 h-16 border-2 border-sky-500/20 rounded-full" />
          <div className="absolute inset-0 w-16 h-16 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
          <div className="absolute inset-2 w-12 h-12 border-2 border-teal-500/30 border-b-transparent rounded-full animate-spin" style={{ animationDuration: '1.5s', animationDirection: 'reverse' }} />
        </div>
        <p className="text-slate-400 text-sm animate-pulse">Loading MedCare…</p>
      </motion.div>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="glass rounded-2xl p-6 animate-pulse space-y-3">
      <div className="h-4 bg-white/10 rounded w-3/4" />
      <div className="h-3 bg-white/5 rounded w-1/2" />
      <div className="h-3 bg-white/5 rounded w-2/3" />
      <div className="h-8 bg-white/5 rounded-lg mt-4" />
    </div>
  );
}
