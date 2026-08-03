import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import { Bot, Mail, Lock, User, Eye, EyeOff, Sparkles, ArrowRight } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

const Register = () => {
  const { loading, handleRegister } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const cardRef = useRef(null);
  const navigate = useNavigate();

  useGSAP(() => {
    gsap.from(cardRef.current, {
      y: 35,
      opacity: 0,
      scale: 0.96,
      duration: 0.8,
      ease: 'power3.out'
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!username || !email || !password || !confirmPassword) {
      setErrorMsg('Please fill in all required fields');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }

    try {
      const success = await handleRegister({ username, email, password });
      if (success) {
        navigate('/');
      } else {
        setErrorMsg('Registration failed. Please check your details.');
      }
    } catch (err) {
      setErrorMsg('Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#080B11] text-slate-100 flex items-center justify-center p-6 sm:p-8 relative overflow-hidden selection:bg-indigo-500 selection:text-white">
      {/* Ambient Background Light Orbs */}
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/3 w-[500px] h-[500px] bg-cyan-500/15 rounded-full blur-3xl pointer-events-none animate-pulse delay-1000" />

      {/* Production-Level Card (Matching Login.jsx Exactly) */}
      <div
        ref={cardRef}
        className="w-full min-h-[500px] flex flex-col justify-center max-w-2xl p-10 sm:p-14 rounded-[32px] bg-slate-900/70 backdrop-blur-2xl border border-slate-800/90 shadow-2xl shadow-indigo-950/40 relative z-10 space-y-8"
      >
        {/* Brand & Header Section */}
        <div className="flex flex-col items-center justify-center text-center">
          <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-500 mx-auto flex items-center justify-center shadow-lg shadow-indigo-500/25 mb-3 group hover:scale-105 transition-transform duration-300">
            <Bot className="w-10 h-10 text-white" />
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-cyan-400 rounded-full animate-ping opacity-75" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-heading font-extrabold text-white tracking-normal leading-tight text-center">
            Create Account
          </h1>
          <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-lg mx-auto text-center">
            Join the GenAI Resume Platform & build tailored career strategy plans
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold text-center animate-in fade-in duration-200">
            {errorMsg}
          </div>
        )}

        {/* Form Elements */}
        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-6">
          {/* Full Name / Username Field */}
          <div className="space-y-2 flex flex-col gap-1">
            <label className="block text-sm font-semibold text-slate-300 uppercase tracking-wider">
              Full Name / Username
            </label>
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="John Doe"
                required
                className="w-full h-14 pl-8 pr-5 rounded-2xl bg-slate-950/80 border border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-base text-slate-200 placeholder:text-slate-600 outline-none transition-all"
              />
            </div>
          </div>

          {/* Email Address Field */}
          <div className="space-y-2 flex flex-col gap-1">
            <label className="block text-sm font-semibold text-slate-300 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                required
                className="w-full h-14 pl-8 pr-5 rounded-2xl bg-slate-950/80 border border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-base text-slate-200 placeholder:text-slate-600 outline-none transition-all"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2 flex flex-col gap-1">
            <label className="block text-sm font-semibold text-slate-300 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full h-14 pl-8 pr-5 rounded-2xl bg-slate-950/80 border border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-base text-slate-200 placeholder:text-slate-600 outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-[17px] text-slate-500 hover:text-slate-300 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>


          {/* Submit Button */}
          <div className="flex justify-center mt-10 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="relative w-[500px] h-[40px] py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 font-heading font-extrabold text-lg text-white shadow-xl shadow-indigo-600/30 transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer hover:scale-[1.01]"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 animate-spin text-cyan-300" /> Registering...
                </span>
              ) : (
                <>
                  Create Account <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Footer Section */}
        <div className="text-center">
          <p className="text-base text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-400 font-semibold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
