import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import { Bot, Mail, Lock, Eye, EyeOff, Sparkles, ArrowRight } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

const Login = () => {
  const { loading, handleLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const cardRef = useRef(null);
  const navigate = useNavigate();

  useGSAP(() => {
    gsap.from(cardRef.current, {
      y: 20,
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out'
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!email || !password) {
      setErrorMsg('Please enter both email and password');
      return;
    }
    const success = await handleLogin({ password, email });
    if (success) {
      navigate('/');
    } else {
      setErrorMsg('Invalid email or password credentials');
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0D1117] text-slate-100 flex items-center justify-center p-6 sm:p-8 relative selection:bg-indigo-500 selection:text-white">
      {/* Soft Lighting Accent */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Mixed Dark/Light SaaS Surface Card */}
      <div
        ref={cardRef}
        className="w-full max-w-lg p-8 sm:p-10 rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl shadow-slate-950/60 relative z-10 space-y-7"
      >
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white mx-auto shadow-md shadow-indigo-600/30 mb-3 border border-indigo-400/30">
            <Bot className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-white tracking-tight">
            Welcome back
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed max-w-xs mx-auto">
            Sign in to access your GenAI Resume strategy workspace
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-200 text-xs font-medium text-center">
            {errorMsg}
          </div>
        )}

        {/* Form Elements */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                required
                className="w-full py-3 px-4 rounded-xl bg-slate-950/90 border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Password
              </label>
              <Link to={"/forgot-password"} className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors font-medium">
                Forgot Password
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full py-3 pl-4 pr-11 rounded-xl bg-slate-950/90 border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-heading font-semibold text-sm text-white shadow-md shadow-indigo-600/30 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 animate-spin text-indigo-200" /> Signing in...
              </span>
            ) : (
              <>
                Sign In <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Section */}
        <div className="text-center pt-4 border-t border-slate-800">
          <p className="text-xs sm:text-sm text-slate-300">
            Don't have an account yet?{' '}
            <Link to="/register" className="text-indigo-400 font-semibold hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
