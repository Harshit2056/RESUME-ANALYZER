import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import { Bot, Mail, Sparkles, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

const ForgotPassword = () => {
  const { handleForgotPassword, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const cardRef = useRef(null);

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
    setMessage('');
    setErrorMsg('');

    if (!email) {
      setErrorMsg('Please enter your email address');
      return;
    }

    try {
      const response = await handleForgotPassword({ email });
      setMessage(response?.message || `Password reset link sent to ${email}`);
      setEmail('');
    } catch (error) {
      setErrorMsg(
        error.response?.data?.message || 'Failed to send password reset email. Please try again.'
      );
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0D1117] text-slate-100 flex items-center justify-center p-6 sm:p-8 relative selection:bg-indigo-500 selection:text-white">
      {/* Soft Lighting Accent */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Modern SaaS Card Container */}
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
            Reset Password
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed max-w-xs mx-auto">
            Enter your email address and we'll send you a link to reset your password
          </p>
        </div>

        {/* Success Alert */}
        {message && (
          <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-200 text-xs font-medium flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{message}</span>
          </div>
        )}

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

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-heading font-semibold text-sm text-white shadow-md shadow-indigo-600/30 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 animate-spin text-indigo-200" /> Sending Email...
              </span>
            ) : (
              <>
                Send Reset Link <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Section */}
        <div className="text-center pt-4 border-t border-slate-800">
          <Link to="/login" className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;