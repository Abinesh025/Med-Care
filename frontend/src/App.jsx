import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import HealthcareChatbot from './pages/Chatbot';

import HomePage        from './pages/HomePage';
import LoginPage       from './pages/LoginPage';
import RegisterPage    from './pages/RegisterPage';
import AppointmentsPage from './pages/AppointmentsPage';
import EmergencyPage   from './pages/EmergencyPage';
import HealthInfoPage  from './pages/HealthInfoPage';
import DashboardPage   from './pages/DashboardPage';
import ProfilePage     from './pages/ProfilePage';

function AppRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/"             element={<HomePage />} />
        <Route path="/login"        element={<LoginPage />} />
        <Route path="/register"     element={<RegisterPage />} />
        <Route path="/appointments" element={<AppointmentsPage />} />
        <Route path="/emergency"    element={<EmergencyPage />} />
        <Route path="/health-info"  element={<HealthInfoPage />} />
        <Route path="/profile"      element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/dashboard"    element={<ProtectedRoute adminOnly><DashboardPage /></ProtectedRoute>} />
        <Route path="/chatbot"    element={<HealthcareChatbot /> }/>
        <Route path="*"             element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
}

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <div className="text-8xl font-display font-bold gradient-text mb-4">404</div>
      <h2 className="text-2xl font-semibold text-white mb-2">Page Not Found</h2>
      <p className="text-slate-400 mb-6">The page you're looking for doesn't exist.</p>
      <a href="/" className="px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-teal-500 text-white font-semibold hover:shadow-glow transition-all">
        Go Home
      </a>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
              <AppRoutes />
            </main>
            <Footer />
          </div>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#1e293b',
                color: '#f8fafc',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                fontSize: '14px',
              },
              success: { iconTheme: { primary: '#22c55e', secondary: '#fff' } },
              error:   { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
            }}
          />
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
