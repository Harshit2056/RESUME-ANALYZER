import React, { useState, useEffect, useRef } from 'react';
import { useInterview } from '../hooks/useInterview.jsx';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import { 
  Code2, 
  MessageSquare, 
  Map, 
  ChevronDown, 
  Copy, 
  Check, 
  Bookmark, 
  Download, 
  ArrowLeft, 
  Sparkles, 
  AlertTriangle, 
  Target
} from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

const NAV_ITEMS = [
  { id: 'technical', label: 'Technical Questions', icon: Code2 },
  { id: 'behavioral', label: 'Behavioral Strategy', icon: MessageSquare },
  { id: 'roadmap', label: '7-Day Action Roadmap', icon: Map }
];

// ── Question Card Component ──
const QuestionCard = ({ item, index }) => {
  const [open, setOpen] = useState(index === 0);
  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const contentRef = useRef(null);
  const cardRef = useRef(null);

  useGSAP(() => {
    if (open) {
      gsap.to(contentRef.current, {
        height: 'auto',
        opacity: 1,
        duration: 0.35,
        ease: 'power2.out'
      });
    } else {
      gsap.to(contentRef.current, {
        height: 0,
        opacity: 0,
        duration: 0.25,
        ease: 'power2.in'
      });
    }
  }, [open]);

  const copyAnswer = (e) => {
    e.stopPropagation();
    if (item.answer) {
      navigator.clipboard.writeText(item.answer);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      ref={cardRef}
      className={`rounded-3xl border transition-all duration-300 overflow-hidden ${
        open
          ? 'bg-slate-900/90 border-indigo-500/40 shadow-xl shadow-indigo-950/30'
          : 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/60'
      }`}
    >
      {/* Card Header */}
      <div
        onClick={() => setOpen(!open)}
        className="p-6 sm:p-7 flex items-start justify-between gap-5 sm:gap-6 cursor-pointer selection:bg-none select-none"
      >
        <div className="flex items-start gap-4 flex-1">
          <span className="shrink-0 w-9 h-9 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-heading font-extrabold text-xs flex items-center justify-center mt-0.5 shadow-sm">
            Q{index + 1}
          </span>
          <div className="space-y-2">
            <h3 className="text-base sm:text-lg font-semibold text-slate-100 leading-snug">
              {item.questions}
            </h3>
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <span className="text-[11px] font-bold text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700/80">
                Core Competency
              </span>
              {bookmarked && (
                <span className="text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20 flex items-center gap-1.5">
                  <Bookmark className="w-3 h-3 fill-amber-400" /> Bookmarked
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setBookmarked(!bookmarked);
            }}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              bookmarked
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200'
            }`}
            title="Bookmark Question"
          >
            <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-amber-400' : ''}`} />
          </button>
          <div
            className={`p-2 rounded-xl bg-slate-800/60 border border-slate-700/60 text-slate-400 transition-transform duration-300 ${
              open ? 'rotate-180 text-indigo-400 bg-indigo-500/10 border-indigo-500/30' : ''
            }`}
          >
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Accordion Body */}
      <div ref={contentRef} className="h-0 opacity-0 overflow-hidden">
        <div className="p-6 sm:p-7 pt-2 border-t border-slate-800/80 space-y-6">
          
          {/* Intention Section */}
          {item.intentions && (
            <div className="p-5 sm:p-6 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
                <Target className="w-4 h-4" />
                <span>Interviewer Intention</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">{item.intentions}</p>
            </div>
          )}

          {/* Model Answer Section */}
          {item.answer && (
            <div className="p-6 sm:p-7 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-300 uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>AI Recommended Strategy & Model Answer</span>
                </div>
                <button
                  type="button"
                  onClick={copyAnswer}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/40 rounded-xl transition-colors cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Copy Strategy
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line font-sans">
                {item.answer}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Roadmap Day Component ──
const RoadMapDay = ({ day }) => {
  const [completedTasks, setCompletedTasks] = useState({});

  const toggleTask = (i) => {
    setCompletedTasks((prev) => ({
      ...prev,
      [i]: !prev[i]
    }));
  };

  const tasks = day.tasks || [];
  const completedCount = Object.values(completedTasks).filter(Boolean).length;
  const progressPct = tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div className="rounded-3xl bg-slate-900/50 backdrop-blur-xl border border-slate-800/80 p-7 sm:p-8 space-y-6 hover:border-slate-700 transition-all">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <span className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-heading font-extrabold text-xs shadow-md shadow-indigo-600/20">
            Day {day.day}
          </span>
          <h3 className="text-lg font-heading font-bold text-white">{day.focus}</h3>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-28 h-2.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <span className="text-xs font-bold text-slate-400">{progressPct}% Done</span>
        </div>
      </div>

      {/* Task List */}
      <ul className="space-y-3">
        {tasks.map((task, i) => {
          const isDone = !!completedTasks[i];
          return (
            <li
              key={i}
              onClick={() => toggleTask(i)}
              className={`p-4 rounded-2xl border flex items-start gap-3.5 cursor-pointer transition-all ${
                isDone
                  ? 'bg-emerald-950/20 border-emerald-500/30 text-slate-400 line-through'
                  : 'bg-slate-950/60 border-slate-800 text-slate-200 hover:border-indigo-500/40 hover:bg-slate-900'
              }`}
            >
              <button
                type="button"
                className={`mt-0.5 shrink-0 w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                  isDone
                    ? 'bg-emerald-500 border-emerald-500 text-slate-950'
                    : 'border-slate-600 bg-slate-900'
                }`}
              >
                {isDone && <Check className="w-3 h-3 stroke-[3]" />}
              </button>
              <span className="text-xs sm:text-sm font-sans leading-relaxed">{task}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

// ── Main Dashboard Component ──
const Interview = () => {
  const [activeNav, setActiveNav] = useState('technical');
  const [severityFilter, setSeverityFilter] = useState('all');
  const { report, handleGetInterviewReportById, loading } = useInterview();
  const { interviewId } = useParams();
  const navigate = useNavigate();
  const circleRef = useRef(null);

  useEffect(() => {
    if (interviewId) {
      handleGetInterviewReportById(interviewId);
    }
  }, [interviewId]);

  useGSAP(() => {
    if (report?.mathScore !== undefined && circleRef.current) {
      const score = Math.min(Math.max(report.mathScore, 0), 100);
      const circumference = 2 * Math.PI * 45;
      const targetOffset = circumference - (circumference * score) / 100;

      gsap.fromTo(
        circleRef.current,
        { strokeDashoffset: circumference },
        {
          strokeDashoffset: targetOffset,
          duration: 1.5,
          ease: 'power3.out'
        }
      );
    }
  }, [report?.mathScore]);

  if (loading || !report) {
    return (
      <div className="min-h-screen bg-[#080B11] text-white flex flex-col items-center justify-center p-8">
        <div className="relative w-24 h-24 mb-8 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-indigo-500/30 animate-[spin_3s_linear_infinite]" />
          <div className="w-14 h-14 rounded-full bg-indigo-600/20 flex items-center justify-center">
            <Sparkles className="w-7 h-7 text-indigo-400 animate-spin" />
          </div>
        </div>
        <h1 className="text-2xl font-heading font-bold">Loading your interview plan...</h1>
      </div>
    );
  }

  const score = report.mathScore || 0;
  const scoreColorClass =
    score >= 80 ? 'text-emerald-400 stroke-emerald-400' :
    score >= 60 ? 'text-amber-400 stroke-amber-400' : 'text-rose-400 stroke-rose-400';

  const scoreBadgeText =
    score >= 80 ? 'Exceptional Match' :
    score >= 60 ? 'Moderate Match' : 'High Skill Gap';

  const skillGaps = report.skillGapSchema || [];
  const filteredSkillGaps = severityFilter === 'all'
    ? skillGaps
    : skillGaps.filter((g) => g.severity === severityFilter);

  return (
    <div className="min-h-screen bg-[#080B11] text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Navbar */}
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 sm:px-8 lg:px-10 py-10 sm:py-14 space-y-10">
        
        {/* Top Header Card */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-slate-900/70 backdrop-blur-2xl p-8 sm:p-10 rounded-3xl border border-slate-800 shadow-2xl">
          <div className="space-y-2">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-indigo-300 transition-colors mb-1 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard Hub
            </button>
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-white tracking-tight flex items-center gap-3">
              Interview Strategy Report
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300">
                AI Generated
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Personalized technical evaluation, behavioral strategy, and custom prep timeline.
            </p>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <button
              onClick={() => window.print()}
              className="px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 transition-all flex items-center gap-2.5 cursor-pointer shadow-md"
            >
              <Download className="w-4 h-4 text-cyan-400" />
              Download Resume
            </button>
          </div>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
          
          {/* Left Column (8 Cols) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Section Tab Selector */}
            <div className="flex items-center gap-3 p-2 bg-slate-950/80 border border-slate-800 rounded-2xl">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = activeNav === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveNav(item.id)}
                    className={`flex-1 py-3.5 px-4 rounded-xl text-xs sm:text-sm font-heading font-bold transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-600/30'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Technical Questions */}
            {activeNav === 'technical' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between px-1">
                  <h2 className="text-xl font-heading font-bold text-white flex items-center gap-2.5">
                    <Code2 className="w-6 h-6 text-indigo-400" /> Technical Questions
                  </h2>
                  <span className="text-xs font-semibold text-slate-400 bg-slate-900 px-3.5 py-1.5 rounded-full border border-slate-800">
                    {report.technicalQuestionSchema?.length || 0} Scenarios
                  </span>
                </div>
                <div className="space-y-5">
                  {report.technicalQuestionSchema?.map((q, idx) => (
                    <QuestionCard key={idx} item={q} index={idx} />
                  ))}
                </div>
              </div>
            )}

            {/* Behavioral Questions */}
            {activeNav === 'behavioral' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between px-1">
                  <h2 className="text-xl font-heading font-bold text-white flex items-center gap-2.5">
                    <MessageSquare className="w-6 h-6 text-cyan-400" /> Behavioral STAR Strategy
                  </h2>
                  <span className="text-xs font-semibold text-slate-400 bg-slate-900 px-3.5 py-1.5 rounded-full border border-slate-800">
                    {report.behavioralQuestionSchema?.length || 0} Questions
                  </span>
                </div>
                <div className="space-y-5">
                  {report.behavioralQuestionSchema?.map((q, idx) => (
                    <QuestionCard key={idx} item={q} index={idx} />
                  ))}
                </div>
              </div>
            )}

            {/* Roadmap */}
            {activeNav === 'roadmap' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between px-1">
                  <h2 className="text-xl font-heading font-bold text-white flex items-center gap-2.5">
                    <Map className="w-6 h-6 text-emerald-400" /> 7-Day Action Plan
                  </h2>
                  <span className="text-xs font-semibold text-slate-400 bg-slate-900 px-3.5 py-1.5 rounded-full border border-slate-800">
                    {report.preparationPlanSchema?.length || 0} Days
                  </span>
                </div>
                <div className="space-y-6">
                  {report.preparationPlanSchema?.map((day) => (
                    <RoadMapDay key={day.day} day={day} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar Widgets (4 Cols) */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* ATS Match Score Widget */}
            <div className="bg-slate-900/70 backdrop-blur-2xl p-7 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl text-center space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-36 h-36 bg-indigo-600/10 rounded-full blur-2xl pointer-events-none" />
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                ATS Qualification Score
              </p>

              {/* Animated SVG Radial Gauge */}
              <div className="relative w-40 h-40 mx-auto flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    className="stroke-slate-800 fill-none"
                    strokeWidth="8"
                  />
                  <circle
                    ref={circleRef}
                    cx="50"
                    cy="50"
                    r="45"
                    className={`fill-none transition-colors ${scoreColorClass}`}
                    strokeWidth="8"
                    strokeDasharray="282.74"
                    strokeDashoffset="282.74"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl sm:text-4xl font-heading font-extrabold text-white tracking-tight">
                    {score}%
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase mt-0.5">Match</span>
                </div>
              </div>

              <div className="pt-1 space-y-2">
                <span className={`inline-block px-3.5 py-1.5 rounded-full text-xs font-bold ${
                  score >= 80 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                  score >= 60 ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                  'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                }`}>
                  {scoreBadgeText}
                </span>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Based on semantic keyword matching against target job responsibilities.
                </p>
              </div>
            </div>

            {/* Skill Gaps Widget */}
            <div className="bg-slate-900/70 backdrop-blur-2xl p-7 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-heading font-bold text-white flex items-center gap-2.5">
                  <AlertTriangle className="w-5 h-5 text-amber-400" /> Identified Skill Gaps
                </h3>
                <span className="text-xs text-slate-400 font-semibold">
                  {skillGaps.length} Found
                </span>
              </div>

              {/* Severity Filter Tabs */}
              <div className="flex items-center gap-1.5 bg-slate-950/80 p-1.5 rounded-xl border border-slate-800/80">
                {['all', 'high', 'medium', 'low'].map((sev) => (
                  <button
                    key={sev}
                    onClick={() => setSeverityFilter(sev)}
                    className={`flex-1 py-1.5 text-[10px] uppercase font-bold rounded-lg transition-colors cursor-pointer ${
                      severityFilter === sev
                        ? 'bg-slate-800 text-white'
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {sev}
                  </button>
                ))}
              </div>

              {/* Skill Tags List */}
              <div className="flex flex-wrap gap-2.5 pt-1">
                {filteredSkillGaps.length > 0 ? (
                  filteredSkillGaps.map((gap, i) => {
                    const isHigh = gap.severity === 'high' || gap.severity === 'critical';
                    const isMed = gap.severity === 'medium' || gap.severity === 'moderate';
                    return (
                      <span
                        key={i}
                        className={`px-3.5 py-2 rounded-xl text-xs font-semibold border flex items-center gap-2 transition-transform hover:scale-105 ${
                          isHigh
                            ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                            : isMed
                            ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                            : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300'
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full ${
                          isHigh ? 'bg-rose-400 animate-ping' : isMed ? 'bg-amber-400' : 'bg-indigo-400'
                        }`} />
                        {gap.skills}
                      </span>
                    );
                  })
                ) : (
                  <p className="text-xs text-slate-500 italic py-2">No skill gaps found for this filter.</p>
                )}
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default Interview;