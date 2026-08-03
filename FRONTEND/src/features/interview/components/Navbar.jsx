import React, { useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../auth/hooks/useAuth';
import { Bot, LogOut, FileText, Compass, ChevronDown, Layers } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

const Navbar = () => {
  const { user, handleLogout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const navRef = useRef(null);
  const [showDropdown, setShowDropdown] = React.useState(false);

  useGSAP(() => {
    gsap.from(navRef.current, {
      y: -30,
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out'
    });
  }, []);

  const onLogout = async () => {
    await handleLogout();
    navigate('/login');
  };

  return (
    <header ref={navRef} className="sticky top-0 z-50 w-full bg-[#0D1117]/90 backdrop-blur-md border-b border-slate-800">
      <div className="w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 h-16 sm:h-20 flex items-center justify-between gap-6">
        
        {/* Brand Logo & Title */}
        <Link to="/" className="flex items-center gap-3 group shrink-0 transition-opacity hover:opacity-90">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30 border border-indigo-400/30">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-extrabold text-lg sm:text-xl tracking-tight text-white">
                GenAI <span className="text-indigo-400">Resume</span>
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 rounded-md">
                2.0
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium hidden sm:block">AI Career Intelligence</p>
          </div>
        </Link>

        {/* Center: Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5 bg-slate-900 p-1.5 rounded-xl border border-slate-800 shadow-sm">
          <Link
            to="/"
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
              location.pathname === '/'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Interview Hub</span>
          </Link>

          <div className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-500 flex items-center gap-2 cursor-not-allowed">
            <FileText className="w-3.5 h-3.5" />
            <span>ATS Optimizer</span>
            <span className="text-[9px] font-bold text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
              Soon
            </span>
          </div>

          <div className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-500 flex items-center gap-2 cursor-not-allowed">
            <Layers className="w-3.5 h-3.5" />
            <span>Mock Audio</span>
            <span className="text-[9px] font-bold text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
              Soon
            </span>
          </div>
        </nav>

        {/* Right: Profile / Session */}
        <div className="flex items-center gap-3 shrink-0">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2.5 p-1.5 pr-3 rounded-xl bg-slate-900 border border-slate-700/80 hover:border-slate-600 transition-all text-left cursor-pointer shadow-sm"
              >
                <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white text-xs">
                  {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="hidden sm:block text-xs font-medium text-slate-200">{user.username || user.email}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-52 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl p-1.5 z-50 animate-in fade-in duration-150">
                  <div className="px-3 py-2 border-b border-slate-800">
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Signed in as</p>
                    <p className="text-xs font-medium text-slate-200 truncate mt-0.5">{user.email}</p>
                  </div>
                  <button
                    onClick={onLogout}
                    className="w-full mt-1 flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors text-left cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors shadow-sm"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
