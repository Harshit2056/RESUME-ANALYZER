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
        duration: 0.3,
        ease: 'power2.out'
      });
    } else {
      gsap.to(contentRef.current, {
        height: 0,
        opacity: 0,
        duration: 0.2,
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
      className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
        open
          ? 'bg-slate-900 border-slate-700 shadow-xl shadow-slate-950/40'
          : 'bg-slate-900/60 border-slate-700/80 hover:border-slate-600 hover:bg-slate-900'
      }`}
    >
      {/* Card Header */}
      <div
        onClick={() => setOpen(!open)}
        className="p-5 sm:p-6 flex items-start justify-between gap-4 cursor-pointer select-none"
      >
        <div className="flex items-start gap-3.5 flex-1">
          <span className="shrink-0 w-8 h-8 rounded-lg bg-indigo-600/15 border border-indigo-500/30 text-indigo-400 font-heading font-extrabold text-xs flex items-center justify-center mt-0.5">
            Q{index + 1}
          </span>
          <div className="space-y-1.5">
            <h3 className="text-base font-semibold text-slate-100 leading-snug">
              {item.questions}
            </h3>
            <div className="flex flex-wrap items-center gap-2 pt-0.5">
              <span className="text-[10px] font-semibold text-slate-300 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                Core Competency
              </span>
              {bookmarked && (
                <span className="text-[10px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 flex items-center gap-1">
                  <Bookmark className="w-3 h-3 fill-amber-400" /> Bookmarked
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setBookmarked(!bookmarked);
            }}
            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
              bookmarked
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
            title="Bookmark Question"
          >
            <Bookmark className={`w-3.5 h-3.5 ${bookmarked ? 'fill-amber-400' : ''}`} />
          </button>
          <div
            className={`p-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 transition-transform ${
              open ? 'rotate-180 text-indigo-400' : ''
            }`}
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {/* Accordion Body */}
      <div ref={contentRef} className="h-0 opacity-0 overflow-hidden">
        <div className="p-5 sm:p-6 pt-1 border-t border-slate-800 space-y-4">
          
          {/* Intention Section */}
          {item.intentions && (
            <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                <Target className="w-3.5 h-3.5" />
                <span>Interviewer Intention</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">{item.intentions}</p>
            </div>
          )}

          {/* Model Answer Section */}
          {item.answer && (
            <div className="p-5 rounded-xl bg-slate-950/90 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-200 uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span>AI Recommended Answer & Strategy</span>
                </div>
                <button
                  type="button"
                  onClick={copyAnswer}
                  className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg transition-colors cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Copy Answer
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
    <div className="rounded-2xl bg-slate-900 border border-slate-700/80 p-6 sm:p-7 space-y-5 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-lg bg-indigo-600 text-white font-heading font-bold text-xs shadow-sm">
            Day {day.day}
          </span>
          <h3 className="text-base font-heading font-bold text-white">{day.focus}</h3>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-400 transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <span className="text-xs font-semibold text-slate-300">{progressPct}% Done</span>
        </div>
      </div>

      {/* Task List */}
      <ul className="space-y-2.5">
        {tasks.map((task, i) => {
          const isDone = !!completedTasks[i];
          return (
            <li
              key={i}
              onClick={() => toggleTask(i)}
              className={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                isDone
                  ? 'bg-slate-950/50 border-slate-800/80 text-slate-500 line-through'
                  : 'bg-slate-950/90 border-slate-800 text-slate-200 hover:border-slate-700'
              }`}
            >
              <button
                type="button"
                className={`mt-0.5 shrink-0 w-4 h-4 rounded border flex items-center justify-center transition-colors ${
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
  const { report, handleGetInterviewReportById, loading,handleGenerateResumePdf } = useInterview();
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
          duration: 1.2,
          ease: 'power2.out'
        }
      );
    }
  }, [report?.mathScore]);

  if (loading || !report) {
    return (
      <div className="min-h-screen bg-[#0D1117] text-white flex flex-col items-center justify-center p-6">
        <div className="w-10 h-10 rounded-full border-2 border-indigo-500/30 border-t-indigo-500 animate-spin mb-4" />
        <h1 className="text-base font-heading font-semibold text-slate-300">Loading interview strategy plan...</h1>
      </div>
    );
  }

  const score = report.mathScore || 0;
  const scoreColorClass =
    score >= 80 ? 'stroke-emerald-400 text-emerald-400' :
    score >= 60 ? 'stroke-amber-400 text-amber-400' : 'stroke-rose-400 text-rose-400';

  const scoreBadgeText =
    score >= 80 ? 'Exceptional Match' :
    score >= 60 ? 'Moderate Match' : 'High Skill Gap';

  const skillGaps = report.skillGapSchema || [];
  const filteredSkillGaps = severityFilter === 'all'
    ? skillGaps
    : skillGaps.filter((g) => g.severity === severityFilter);

  return (
    <div className="min-h-screen bg-[#0D1117] text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Navbar */}
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 sm:px-8 lg:px-10 py-8 sm:py-12 space-y-8">
        
        {/* Top Header Card */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-700/80 shadow-xl shadow-slate-950/50">
          <div className="space-y-1.5">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors mb-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
            </button>
            <h1 className="text-xl sm:text-2xl font-heading font-extrabold text-white tracking-tight flex items-center gap-3">
              Interview Strategy Report
              <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                AI Generated
              </span>
            </h1>
            <p className="text-xs text-slate-300">
              Personalized technical evaluation, behavioral strategy, and custom prep timeline.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => handleGenerateResumePdf(interviewId)}
              className="px-4 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 transition-all flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <Download className="w-3.5 h-3.5 text-slate-300" />
              Download Resume
            </button>
          </div>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Section Tab Selector */}
            <div className="flex items-center gap-2 p-1.5 bg-slate-900 border border-slate-700/80 rounded-xl shadow-sm">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = activeNav === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveNav(item.id)}
                    className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-heading font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Technical Questions */}
            {activeNav === 'technical' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                  <h2 className="text-lg font-heading font-bold text-white flex items-center gap-2">
                    <Code2 className="w-5 h-5 text-indigo-400" /> Technical Questions
                  </h2>
                  <span className="text-xs font-medium text-slate-300 bg-slate-900 px-3 py-1 rounded-md border border-slate-700">
                    {report.technicalQuestionSchema?.length || 0} Scenarios
                  </span>
                </div>
                <div className="space-y-4">
                  {report.technicalQuestionSchema?.map((q, idx) => (
                    <QuestionCard key={idx} item={q} index={idx} />
                  ))}
                </div>
              </div>
            )}

            {/* Behavioral Questions */}
            {activeNav === 'behavioral' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                  <h2 className="text-lg font-heading font-bold text-white flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-cyan-400" /> Behavioral STAR Strategy
                  </h2>
                  <span className="text-xs font-medium text-slate-300 bg-slate-900 px-3 py-1 rounded-md border border-slate-700">
                    {report.behavioralQuestionSchema?.length || 0} Questions
                  </span>
                </div>
                <div className="space-y-4">
                  {report.behavioralQuestionSchema?.map((q, idx) => (
                    <QuestionCard key={idx} item={q} index={idx} />
                  ))}
                </div>
              </div>
            )}

            {/* Roadmap */}
            {activeNav === 'roadmap' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                  <h2 className="text-lg font-heading font-bold text-white flex items-center gap-2">
                    <Map className="w-5 h-5 text-emerald-400" /> 7-Day Action Plan
                  </h2>
                  <span className="text-xs font-medium text-slate-300 bg-slate-900 px-3 py-1 rounded-md border border-slate-700">
                    {report.preparationPlanSchema?.length || 0} Days
                  </span>
                </div>
                <div className="space-y-4">
                  {report.preparationPlanSchema?.map((day) => (
                    <RoadMapDay key={day.day} day={day} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar Widgets (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* ATS Match Score Widget */}
            <div className="bg-slate-900 p-6 sm:p-7 rounded-2xl border border-slate-700/80 shadow-xl shadow-slate-950/50 text-center space-y-5">
              <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                ATS Qualification Score
              </p>

              {/* Animated SVG Radial Gauge */}
              <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    className="stroke-slate-800 fill-none"
                    strokeWidth="7"
                  />
                  <circle
                    ref={circleRef}
                    cx="50"
                    cy="50"
                    r="45"
                    className={`fill-none transition-colors ${scoreColorClass}`}
                    strokeWidth="7"
                    strokeDasharray="282.74"
                    strokeDashoffset="282.74"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-heading font-extrabold text-white tracking-tight">
                    {score}%
                  </span>
                  <span className="text-[10px] font-medium text-slate-400 uppercase mt-0.5">Match</span>
                </div>
              </div>

              <div className="space-y-2">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                  score >= 80 ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' :
                  score >= 60 ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30' :
                  'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                }`}>
                  {scoreBadgeText}
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Based on semantic keyword matching against target job responsibilities.
                </p>
              </div>
            </div>

            {/* Skill Gaps Widget */}
            <div className="bg-slate-900 p-6 sm:p-7 rounded-2xl border border-slate-700/80 shadow-xl shadow-slate-950/50 space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-heading font-bold text-white flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" /> Skill Gap Analysis
                </h3>
                <span className="text-xs text-slate-300 font-medium">
                  {skillGaps.length} Found
                </span>
              </div>

              {/* Severity Filter Tabs */}
              <div className="flex items-center gap-1 bg-slate-950/90 p-1 rounded-lg border border-slate-800">
                {['all', 'high', 'medium', 'low'].map((sev) => (
                  <button
                    key={sev}
                    onClick={() => setSeverityFilter(sev)}
                    className={`flex-1 py-1 text-[10px] uppercase font-semibold rounded transition-colors cursor-pointer ${
                      severityFilter === sev
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {sev}
                  </button>
                ))}
              </div>

              {/* Skill Tags List */}
              <div className="flex flex-wrap gap-2 pt-1">
                {filteredSkillGaps.length > 0 ? (
                  filteredSkillGaps.map((gap, i) => {
                    const isHigh = gap.severity === 'high' || gap.severity === 'critical';
                    const isMed = gap.severity === 'medium' || gap.severity === 'moderate';
                    return (
                      <span
                        key={i}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-2 ${
                          isHigh
                            ? 'bg-rose-500/10 border-rose-500/30 text-rose-200'
                            : isMed
                            ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                            : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-200'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          isHigh ? 'bg-rose-400' : isMed ? 'bg-amber-400' : 'bg-indigo-400'
                        }`} />
                        {gap.skills}
                      </span>
                    );
                  })
                ) : (
                  <p className="text-xs text-slate-400 italic py-1">No skill gaps found for this filter.</p>
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