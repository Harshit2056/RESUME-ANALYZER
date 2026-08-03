import React, { useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../auth/hooks/useAuth';
import { Sparkles, Bot, LogOut, FileText, Compass, ChevronDown, Layers } from 'lucide-react';
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
      y: -50,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    });
  }, []);

  const onLogout = async () => {
    await handleLogout();
    navigate('/login');
  };

  return (
    <header ref={navRef} className="sticky top-0 z-50 w-full bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80">
      <div className="w-full max-w-7xl mx-auto px-8 sm:px-12 lg:px-16 h-20 flex items-center justify-between gap-6">
        
        {/* Left Side: Brand Logo & Text */}
        <Link to="/" className="flex items-center gap-3.5 group shrink-0 transition-transform duration-300 hover:scale-105">
          <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform duration-300">
            <Bot className="w-6 h-6 text-white" />
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-cyan-400 rounded-full animate-ping opacity-75" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-extrabold text-xl sm:text-2xl tracking-tight text-white">
                GenAI <span className="bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">Resume</span>
              </span>
              <span className="px-2.5 py-0.5 text-[10px] font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 rounded-full flex items-center gap-1 shadow-sm">
                <Sparkles className="w-3 h-3 text-cyan-400" /> 2.0
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">AI Career Strategy Engine</p>
          </div>
        </Link>

        {/* Center: Navigation Items */}
        <nav className="hidden md:flex items-center gap-3 bg-slate-900/90 p-2 px-3 rounded-2xl border border-slate-800 shadow-inner">
          <Link
            to="/"
            className={`px-4 py-2 rounded-xl text-xs font-heading font-bold transition-all flex items-center gap-2 ${
              location.pathname === '/'
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
            }`}
          >
            <Compass className="w-4 h-4 text-cyan-400" />
            <span>Interview Hub</span>
          </Link>

          <div className="px-4 py-2 rounded-xl text-xs font-heading font-bold text-slate-400 flex items-center gap-2 cursor-not-allowed bg-slate-950/40 border border-slate-800/60">
            <FileText className="w-4 h-4 text-slate-500" />
            <span>ATS Optimizer</span>
            <span className="text-[9px] font-extrabold uppercase bg-indigo-950 text-indigo-400 px-1.5 py-0.5 rounded border border-indigo-800/50">
              Soon
            </span>
          </div>

          <div className="px-4 py-2 rounded-xl text-xs font-heading font-bold text-slate-400 flex items-center gap-2 cursor-not-allowed bg-slate-950/40 border border-slate-800/60">
            <Layers className="w-4 h-4 text-slate-500" />
            <span>Mock Audio AI</span>
            <span className="text-[9px] font-extrabold uppercase bg-indigo-950 text-indigo-400 px-1.5 py-0.5 rounded border border-indigo-800/50">
              Soon
            </span>
          </div>
        </nav>

        {/* Right Side: User Profile Section */}
        <div className="flex items-center gap-4 shrink-0">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-3 p-2 pr-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/40 transition-all text-left cursor-pointer shadow-md"
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-heading font-extrabold text-white text-sm shadow-inner">
                  {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="hidden sm:block">
                  <p className="text-xs font-bold text-slate-100 leading-none">{user.username || user.email}</p>
                  <p className="text-[10px] text-emerald-400 font-semibold mt-1 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Active Session
                  </p>
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showDropdown ? 'rotate-180 text-indigo-400' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
                <div className="absolute right-0 mt-3 w-56 rounded-2xl bg-slate-900/95 backdrop-blur-2xl border border-slate-800 shadow-2xl p-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-3 py-2.5 border-b border-slate-800">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Signed in as</p>
                    <p className="text-xs font-bold text-slate-100 truncate mt-0.5">{user.email}</p>
                  </div>
                  <button
                    onClick={onLogout}
                    className="w-full mt-1.5 flex items-center gap-2.5 px-3 py-2.5 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors text-left cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="px-5 py-2.5 text-xs font-bold text-slate-300 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 rounded-xl transition-all shadow-lg shadow-indigo-600/30"
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
