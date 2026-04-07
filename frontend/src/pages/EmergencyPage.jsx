import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertCircle, MapPin, Phone, Clock, CheckCircle,
  Loader2, Navigation, Hospital, Shield, Siren
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { PageTransition, ScrollReveal, StaggerReveal, staggerItem } from '../components/AnimationWrappers';
import api from '../utils/api';
import toast from 'react-hot-toast';

const nearbyHospitals = [
  { name: 'Apollo Hospitals', distance: '1.2 km', phone: '+91 98765 43210', open24h: true, emergency: true },
  { name: 'Fortis Healthcare', distance: '2.5 km', phone: '+91 87654 32109', open24h: true, emergency: true },
  { name: 'MIOT International', distance: '3.8 km', phone: '+91 76543 21098', open24h: false, emergency: true },
  { name: 'SRM Hospitals', distance: '4.1 km', phone: '+91 65432 10987', open24h: true, emergency: true },
  { name: 'Kauvery Hospital', distance: '5.2 km', phone: '+91 54321 09876', open24h: true, emergency: false },
  { name: 'Vijaya Hospital',  distance: '6.0 km', phone: '+91 43210 98765', open24h: false, emergency: false },
];

export default function EmergencyPage() {
  const { isAuthenticated, user } = useAuth();
  const { isDark } = useTheme();
  const [alertState, setAlertState] = useState('idle'); // idle | sending | sent
  const [location, setLocation] = useState({ address: '', lat: '', lng: '' });
  const [useGPS, setUseGPS] = useState(false);
  const [manualAddress, setManualAddress] = useState('');
  const [notes, setNotes] = useState('');

  const detectLocation = () => {
    setUseGPS(true);
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude.toFixed(6), lng: pos.coords.longitude.toFixed(6), address: 'GPS Location Detected' });
        toast.success('Location detected!');
      },
      () => {
        toast.error('Could not detect location. Please enter manually.');
        setUseGPS(false);
      }
    );
  };

  const handleEmergency = async () => {
    if (alertState !== 'idle') return;
    const finalLocation = useGPS && location.lat ? `${location.lat}, ${location.lng}` : manualAddress;
    if (!finalLocation.trim()) {
      toast.error('Please provide your location first');
      return;
    }
    setAlertState('sending');
    try {
      await api.post('/emergency', {
        location: finalLocation,
        patientName: user?.name || 'Anonymous',
        notes,
        type: 'SOS',
      });
      setAlertState('sent');
      toast.success('Emergency alert sent! Help is on the way.', { duration: 5000 });
    } catch {
      toast.error('Failed to send alert. Call 108 immediately!');
      setAlertState('idle');
    }
  };

  return (
    <PageTransition>
      <div className={`min-h-screen pt-20 pb-10 px-4 ${isDark ? '' : 'bg-slate-50'}`}>
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <ScrollReveal className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/20 border border-red-500/30 text-red-400 text-sm font-medium mb-4">
              <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" /> Emergency Services Active
            </div>
            <h1 className={`font-display text-4xl font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Emergency <span className="text-red-400">SOS</span>
            </h1>
            <p className={`max-w-xl mx-auto ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Trigger an emergency alert and get connected to the nearest hospitals instantly.
              Your safety is our top priority.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* SOS Panel */}
            <ScrollReveal direction="left">
              <div className={`rounded-3xl p-8 ${isDark ? 'glass border border-red-500/20' : 'bg-white shadow-xl border border-red-100'}`}>
                <h2 className={`font-display text-xl font-bold mb-6 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  <Siren className="w-5 h-5 text-red-400" /> Send Emergency Alert
                </h2>

                {/* SOS Button */}
                <div className="flex justify-center mb-8">
                  <AnimatePresence mode="wait">
                    {alertState === 'sent' ? (
                      <motion.div
                        key="sent"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-40 h-40 rounded-full bg-green-500/20 border-4 border-green-500 flex flex-col items-center justify-center text-green-400"
                      >
                        <CheckCircle className="w-12 h-12 mb-2" />
                        <span className="text-sm font-bold">SENT</span>
                      </motion.div>
                    ) : (
                      <motion.button
                        key="sos"
                        id="emergency-sos-btn"
                        onClick={handleEmergency}
                        disabled={alertState === 'sending'}
                        whileTap={{ scale: 0.95 }}
                        className="w-40 h-40 rounded-full bg-gradient-to-br from-red-500 to-rose-600 text-white flex flex-col items-center justify-center font-display font-bold text-2xl btn-pulse shadow-glow-red cursor-pointer disabled:opacity-80 relative overflow-hidden"
                      >
                        {alertState === 'sending' ? (
                          <>
                            <Loader2 className="w-10 h-10 animate-spin mb-1" />
                            <span className="text-sm">Sending…</span>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-10 h-10 mb-1" />
                            <span>SOS</span>
                            <span className="text-xs font-normal opacity-80 mt-0.5">Tap to Alert</span>
                          </>
                        )}
                        <div className="absolute inset-0 rounded-full border-4 border-white/20 animate-ping opacity-30" />
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>

                {/* Location */}
                <div className="space-y-3 mb-5">
                  <label className={`block text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Your Location
                  </label>
                  <button onClick={detectLocation}
                    className={`w-full py-2.5 rounded-xl border text-sm font-medium flex items-center justify-center gap-2 transition-all ${
                      useGPS && location.lat
                        ? 'border-green-500/50 text-green-400 bg-green-500/10'
                        : isDark ? 'border-white/10 text-sky-400 hover:bg-white/5' : 'border-sky-200 text-sky-600 hover:bg-sky-50'
                    }`}
                  >
                    <Navigation className="w-4 h-4" />
                    {useGPS && location.lat ? `GPS: ${location.lat}, ${location.lng}` : 'Use My GPS Location'}
                  </button>
                  <div className={`text-center text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>— or enter manually —</div>
                  <input
                    type="text"
                    value={manualAddress}
                    onChange={(e) => setManualAddress(e.target.value)}
                    placeholder="e.g. 42, Anna Nagar, Chennai – 600040"
                    className={`input-dark ${isDark ? '' : 'bg-slate-50 text-slate-900 border-slate-200 placeholder:text-slate-400'}`}
                  />
                </div>

                {/* Notes */}
                <div className="mb-5">
                  <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Emergency Notes (optional)
                  </label>
                  <textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)}
                    placeholder="Describe the emergency, injuries, or any critical info…"
                    className={`input-dark resize-none ${isDark ? '' : 'bg-slate-50 text-slate-900 border-slate-200 placeholder:text-slate-400'}`} />
                </div>

                {/* Emergency numbers */}
                <div className={`p-4 rounded-xl ${isDark ? 'bg-red-500/10 border border-red-500/20' : 'bg-red-50 border border-red-200'}`}>
                  <p className="text-sm font-semibold text-red-400 mb-2">📞 Emergency Hotlines</p>
                  {[['Medical Emergency', '108'], ['Police', '100'], ['Fire', '101'], ['Disaster Relief', '1078']].map(([label, num]) => (
                    <div key={num} className={`flex justify-between text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      <span>{label}</span><span className="font-bold text-red-400">{num}</span>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            {/* Nearby Hospitals */}
            <ScrollReveal direction="right">
              <div>
                <h2 className={`font-display text-xl font-bold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  <Hospital className="w-5 h-5 text-sky-400" /> Nearby Hospitals
                </h2>
                <StaggerReveal className="space-y-3">
                  {nearbyHospitals.map((h) => (
                    <motion.div
                      key={h.name}
                      variants={staggerItem}
                      whileHover={{ x: 4 }}
                      className={`rounded-2xl p-4 border transition-all cursor-pointer ${isDark ? 'glass border-white/5 hover:border-sky-500/30' : 'bg-white border-slate-200 hover:border-sky-300 shadow-sm'}`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{h.name}</h3>
                          <div className={`flex flex-wrap items-center gap-3 mt-1 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-sky-400" />{h.distance}</span>
                            <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-teal-400" />{h.phone}</span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-1 items-end">
                          {h.emergency && <span className="px-2 py-0.5 rounded-full text-xs bg-red-500/20 text-red-400 border border-red-500/30">Emergency</span>}
                          {h.open24h && <span className={`px-2 py-0.5 rounded-full text-xs flex items-center gap-1 ${isDark ? 'bg-green-500/20 text-green-400' : 'bg-green-50 text-green-600 border border-green-200'}`}><Clock className="w-2.5 h-2.5" />24/7</span>}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </StaggerReveal>
              </div>
            </ScrollReveal>
          </div>

          {/* Safety Tip */}
          <ScrollReveal delay={0.3} className="mt-8">
            <div className={`rounded-2xl p-5 flex items-start gap-4 ${isDark ? 'bg-sky-500/10 border border-sky-500/20' : 'bg-sky-50 border border-sky-200'}`}>
              <Shield className="w-6 h-6 text-sky-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className={`font-semibold text-sm mb-1 ${isDark ? 'text-sky-300' : 'text-sky-700'}`}>Stay Safe</p>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  This system supplements emergency services — always call <strong>108</strong> directly for life-threatening emergencies. MedCare emergency alerts are dispatched within 2 minutes of submission.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </PageTransition>
  );
}
