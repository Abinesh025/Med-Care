import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import {
  Heart,
  Menu,
  X,
  User,
  LogOut,
  Calendar,
  AlertCircle,
  BookOpen,
  LayoutDashboard,
} from "lucide-react";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/appointments", label: "Appointments", icon: Calendar },
  { to: "/emergency", label: "Emergency", icon: AlertCircle },
  { to: "/health-info", label: "Health Info", icon: BookOpen },
  { to: "/chatbot", label: "Chat Bot", icon: BookOpen },
];

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { isDark } = useTheme();

  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // ✅ TEXT COLOR CHANGE
  const textColor = scrolled ? "text-white" : "text-black";

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
      
      ${
        scrolled
          ? "backdrop-blur-xl bg-slate-900/80 border-b border-white/10 shadow-lg shadow-black/20"
          : "bg-white"
      }

      hover:backdrop-blur-2xl hover:bg-slate-900/95
      hover:shadow-[0_0_30px_rgba(56,189,248,0.3)]
      `}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-sky-500 to-teal-400">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className={`font-bold text-xl transition-colors duration-300 ${textColor}`}>
              MedCare
            </span>
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm transition-colors duration-300 ${
                    isActive
                      ? "bg-sky-500/20 text-sky-400"
                      : `${textColor} hover:text-sky-400`
                  }`
                }
              >
                {label}
              </NavLink>
            ))}

            {isAdmin && (
              <NavLink
                to="/dashboard"
                className={`px-4 py-2 text-sm transition-colors duration-300 ${textColor}`}
              >
                Dashboard
              </NavLink>
            )}
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-2">

            {isAuthenticated ? (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10"
                >
                  <div className="w-7 h-7 rounded-full bg-sky-500 flex items-center justify-center text-white text-xs">
                    {user?.name?.[0]}
                  </div>
                  <span className={`text-sm transition-colors duration-300 ${textColor}`}>
                    {user?.name}
                  </span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="text-red-400 text-sm"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="hidden md:flex gap-2">
                <Link
                  to="/login"
                  className={`text-sm transition-colors duration-300 ${textColor}`}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-1.5 bg-sky-500 text-white rounded-lg"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* MOBILE BUTTON */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2"
            >
              {isOpen ? <X className={textColor} /> : <Menu className={textColor} />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden backdrop-blur-xl bg-slate-900/90 border-t border-white/10"
          >
            <div className="p-4 flex flex-col gap-2">
              {navLinks.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setIsOpen(false)}
                  className="text-white px-3 py-2 rounded-lg hover:bg-white/5"
                >
                  {label}
                </NavLink>
              ))}

              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="text-red-400 text-left px-3 py-2"
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link to="/login" className="text-white px-3 py-2">
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-3 py-2 bg-sky-500 text-white rounded-lg text-center"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}