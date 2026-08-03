import React, { useState, useRef } from 'react';
import { useInterview } from '../hooks/useInterview.jsx';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import { 
  Briefcase, 
  User, 
  UploadCloud, 
  Sparkles, 
  FileText, 
  CheckCircle2, 
  X, 
  Cpu, 
  Zap, 
  ArrowRight, 
  Layers, 
  Terminal,
  FileUp,
  Edit3,
  Award,
  ShieldCheck,
  BarChart3,
  Trash2,
  Check
} from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

const JOB_TEMPLATES = [
  {
    title: 'Senior Frontend Engineer',
    desc: 'Seeking a Senior Frontend Engineer proficient in React 19, TypeScript, state management, web performance optimization, and scalable UI system design. 5+ years experience building complex web applications required.'
  },
  {
    title: 'AI / ML Fullstack Dev',
    desc: 'Looking for an AI Fullstack Engineer experienced with Python, Node.js, LangChain, Google Gemini API, React, RAG architectures, and vector databases. Strong background in modern web engineering.'
  },
  {
    title: 'Product Manager',
    desc: 'Product Manager role focusing on GenAI products. Requires data-driven roadmap planning, user research, agile execution, API integration knowledge, and cross-functional leadership.'
  }
];

const Home = () => {
  const { loading, handleGenerateInterviewReport } = useInterview();
  const [jobDescription, setJobDescription] = useState('');
  const [profileTab, setProfileTab] = useState('resume'); // 'resume' | 'self'
  const [selfDescription, setSelfDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const resumeInputRef = useRef();
  const heroRef = useRef();
  const step1Ref = useRef();
  const step2Ref = useRef();
  const actionRef = useRef();
  const navigate = useNavigate();

  // GSAP Entrance Animations
  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.from(heroRef.current, {
      y: 40,
      opacity: 0,
      duration: 0.8
    })
    .from(step1Ref.current, {
      y: 40,
      opacity: 0,
      duration: 0.7
    }, '-=0.4')
    .from(step2Ref.current, {
      y: 40,
      opacity: 0,
      duration: 0.7
    }, '-=0.4')
    .from(actionRef.current, {
      y: 30,
      opacity: 0,
      duration: 0.6
    }, '-=0.3');
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      if (resumeInputRef.current) {
        resumeInputRef.current.files = e.dataTransfer.files;
      }
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (resumeInputRef.current) {
      resumeInputRef.current.value = '';
    }
  };

  const handleGenerateReport = async () => {
    const resumeFile = selectedFile || (resumeInputRef.current && resumeInputRef.current.files[0]);
    const data = await handleGenerateInterviewReport({
      jobDescription,
      selfDescription,
      resumeFile
    });
    if (data?.data?.interviewReport?._id) {
      navigate(`/interview/${data.data.interviewReport._id}`);
    }
  };

  // AI Loading Overlay Screen
  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-2xl flex flex-col items-center justify-center p-8 text-center">
        <div className="absolute w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-3xl animate-pulse pointer-events-none" />
        <div className="absolute w-[500px] h-[500px] bg-cyan-500/15 rounded-full blur-3xl animate-pulse pointer-events-none delay-1000" />

        <div className="relative w-44 h-44 mb-10 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-indigo-500/30 animate-[spin_3s_linear_infinite]" />
          <div className="absolute inset-4 rounded-full border border-cyan-500/40 animate-ping opacity-25" />
          <div className="w-28 h-28 rounded-full bg-slate-900/90 border border-slate-700/80 flex items-center justify-center shadow-2xl shadow-indigo-500/30">
            <Cpu className="w-12 h-12 text-cyan-400 animate-pulse" />
          </div>
        </div>

        <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-white tracking-tight mb-4">
          Generating AI Career Strategy...
        </h2>
        <p className="text-sm sm:text-base text-slate-400 max-w-xl mb-12 leading-relaxed">
          Analyzing target position requirements, cross-referencing your profile, and generating tailored interview scenarios.
        </p>

        <div className="w-full max-w-xl bg-slate-900/80 border border-slate-800 rounded-3xl p-8 text-left space-y-5 shadow-2xl">
          <div className="flex items-center gap-4 text-sm font-semibold text-cyan-400">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>Parsing target job description</span>
          </div>
          <div className="flex items-center gap-4 text-sm font-semibold text-indigo-300">
            <Sparkles className="w-5 h-5 text-indigo-400 animate-spin shrink-0" />
            <span>Evaluating profile match & key skill gaps</span>
          </div>
          <div className="flex items-center gap-4 text-sm font-semibold text-slate-500">
            <div className="w-5 h-5 rounded-full border border-slate-700 flex items-center justify-center text-xs shrink-0">3</div>
            <span>Synthesizing technical & behavioral model answers</span>
          </div>
          <div className="flex items-center gap-4 text-sm font-semibold text-slate-500">
            <div className="w-5 h-5 rounded-full border border-slate-700 flex items-center justify-center text-xs shrink-0">4</div>
            <span>Building custom 7-day preparation roadmap</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#080B11] text-slate-100 flex flex-col items-center justify-between selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar />

      {/* Ambient Background Glows */}
      <div className="fixed top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="fixed top-60 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none animate-pulse delay-700" />

      {/* Main Centered Container */}
      <main className="w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-12 sm:py-20 relative z-10 space-y-16 sm:space-y-24 flex flex-col items-center">
        
        {/* Hero Header - Centered */}
        <div ref={heroRef} className="text-center max-w-4xl mx-auto flex flex-col items-center justify-center space-y-6">
          <div className="inline-flex items-center gap-2.5 px-4.5 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs sm:text-sm font-semibold shadow-sm">
            <Zap className="w-4 h-4 text-cyan-400" /> Next-Gen Resume & Mock Interview Intelligence
          </div>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-heading font-extrabold tracking-tight text-white leading-tight text-center">
            Supercharge Your <span className="bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">Interview Strategy</span>
          </h1>
          <p className="text-base sm:text-xl text-slate-400 font-normal leading-relaxed max-w-3xl mx-auto text-center">
            Build tailored technical questions, behavioral STAR strategies, and an actionable 7-day preparation plan powered by Gemini AI.
          </p>
        </div>

        {/* Step-by-Step Workspace Grid */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-stretch">
          
          {/* STEP 01: Target Job Position Card */}
          <div
            ref={step1Ref}
            className="p-8 sm:p-10 lg:p-12 rounded-3xl border border-slate-800/90 shadow-2xl shadow-indigo-950/20 bg-slate-900/70 backdrop-blur-2xl flex flex-col justify-between space-y-8"
          >
            <div className="space-y-8">
              {/* Header */}
              <div className="flex items-center justify-between flex-wrap gap-4 pb-6 border-b border-slate-800/80">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shadow-md">
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[11px] font-extrabold uppercase tracking-widest text-indigo-400">
                      Step 01
                    </span>
                    <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-white tracking-tight">
                      Target Job Position
                    </h2>
                  </div>
                </div>
                <span className="px-3.5 py-1 text-xs font-bold uppercase bg-indigo-500/15 text-indigo-300 rounded-full border border-indigo-500/30">
                  Required
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-sans">
                Paste the target job description or choose from preset role templates to auto-fill requirements.
              </p>

              {/* Preset Role Templates Container */}
              <div className="p-5 sm:p-6 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-4 shadow-inner">
                <div className="flex items-center justify-between flex-wrap gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-cyan-400" />
                    <span>Preset Role Templates</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-normal normal-case">Click to auto-fill</span>
                </div>

                <div className="flex flex-wrap gap-3 pt-1">
                  {JOB_TEMPLATES.map((tmpl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setJobDescription(tmpl.desc)}
                      className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-700/80 text-slate-300 hover:border-indigo-500/50 hover:text-white hover:bg-indigo-600/20 transition-all flex items-center gap-2 cursor-pointer shadow-sm hover:scale-[1.02]"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      {tmpl.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Textarea Input Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-heading font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                    <span>Job Description Text</span>
                  </label>
                  {jobDescription.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setJobDescription('')}
                      className="text-xs font-semibold text-rose-400 hover:text-rose-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Clear
                    </button>
                  )}
                </div>

                <div className="relative space-y-2">
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    maxLength={5000}
                    rows={10}
                    placeholder={`Paste target job requirements here...\n\ne.g., 'Senior Frontend Engineer at Google requires proficiency in React 19, TypeScript, state management, web performance optimization, and scalable UI system design...'`}
                    className="w-full p-6 sm:p-7 rounded-2xl bg-slate-950/90 border border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-xs sm:text-sm text-slate-100 placeholder:text-slate-600 outline-none transition-all resize-none leading-relaxed font-sans min-h-[260px]"
                  />
                  
                  {/* Textarea Bottom Status Row */}
                  <div className="flex items-center justify-between pt-1 text-xs">
                    <div className="flex items-center gap-2">
                      {jobDescription.trim() ? (
                        <span className="text-emerald-400 font-semibold flex items-center gap-1.5 text-[11px]">
                          <Check className="w-3.5 h-3.5 stroke-[3]" /> Requirements Ready
                        </span>
                      ) : (
                        <span className="text-amber-400/90 font-medium text-[11px]">
                          ⚠️ Required for strategy generation
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] font-semibold text-slate-500 bg-slate-950 px-3 py-1 rounded-lg border border-slate-800">
                      {jobDescription.length} / 5000 chars
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* STEP 02: Candidate Profile Card */}
          <div
            ref={step2Ref}
            className="p-8 sm:p-10 lg:p-12 rounded-3xl border border-slate-800/90 shadow-2xl shadow-indigo-950/20 bg-slate-900/70 backdrop-blur-2xl space-y-8 flex flex-col justify-between"
          >
            <div className="space-y-8">
              {/* Header */}
              <div className="flex items-center justify-between flex-wrap gap-4 pb-6 border-b border-slate-800/80">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shadow-md">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[11px] font-extrabold uppercase tracking-widest text-cyan-400">
                      Step 02
                    </span>
                    <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-white tracking-tight">
                      Candidate Profile Context
                    </h2>
                  </div>
                </div>
                <span className="px-3.5 py-1 text-xs font-bold uppercase bg-cyan-500/15 text-cyan-300 rounded-full border border-cyan-500/30">
                  Recommended
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-sans">
                Choose how you want to provide your experience: upload your resume document or write a quick summary.
              </p>

              {/* Profile Mode Selector Tabs */}
              <div className="flex items-center gap-3 p-2 bg-slate-950/90 border border-slate-800 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setProfileTab('resume')}
                  className={`flex-1 py-3.5 px-4 rounded-xl text-xs sm:text-sm font-heading font-bold transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer ${
                    profileTab === 'resume'
                      ? 'bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow-lg shadow-indigo-600/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                  }`}
                >
                  <FileUp className="w-4.5 h-4.5" />
                  Upload Resume PDF
                </button>
                <button
                  type="button"
                  onClick={() => setProfileTab('self')}
                  className={`flex-1 py-3.5 px-4 rounded-xl text-xs sm:text-sm font-heading font-bold transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer ${
                    profileTab === 'self'
                      ? 'bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow-lg shadow-indigo-600/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                  }`}
                >
                  <Edit3 className="w-4.5 h-4.5" />
                  Quick Self-Description
                </button>
              </div>

              {/* Tab Content 1: Resume Upload */}
              {profileTab === 'resume' && (
                <div className="space-y-4 pt-2">
                  {selectedFile ? (
                    <div className="p-6 rounded-2xl bg-indigo-950/40 border border-indigo-500/40 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="p-4 bg-indigo-600/30 rounded-2xl text-indigo-300">
                          <FileText className="w-8 h-8" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-100 truncate max-w-[240px] sm:max-w-[320px]">
                            {selectedFile.name}
                          </p>
                          <p className="text-xs text-slate-400 mt-1">
                            {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB &bull; Document attached
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={removeFile}
                        className="p-2.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-rose-500/20 transition-all cursor-pointer"
                        title="Remove File"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                      }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={handleDrop}
                      onClick={() => resumeInputRef.current && resumeInputRef.current.click()}
                      className={`border-2 border-dashed rounded-3xl p-12 sm:p-16 text-center cursor-pointer transition-all duration-300 ${
                        isDragging
                          ? 'border-cyan-400 bg-cyan-500/10'
                          : 'border-slate-800 bg-slate-950/50 hover:border-indigo-500/60 hover:bg-slate-900/80'
                      }`}
                    >
                      <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mx-auto flex items-center justify-center mb-4">
                        <UploadCloud className="w-8 h-8" />
                      </div>
                      <p className="text-sm sm:text-base font-bold text-slate-200">
                        Click to upload <span className="text-slate-400 font-normal">or drag & drop</span>
                      </p>
                      <p className="text-xs text-slate-500 mt-2">PDF or DOCX format (Max 5MB)</p>
                      <input
                        ref={resumeInputRef}
                        type="file"
                        hidden
                        accept=".pdf,.docx"
                        onChange={handleFileChange}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Tab Content 2: Self Description */}
              {profileTab === 'self' && (
                <div className="space-y-3 pt-2">
                  <label className="block text-xs font-semibold text-slate-300">
                    Quick Background Summary
                  </label>
                  <textarea
                    value={selfDescription}
                    onChange={(e) => setSelfDescription(e.target.value)}
                    rows={9}
                    placeholder="Describe your tech stack, key projects, domain experience, and years in software engineering..."
                    className="w-full p-6 rounded-2xl bg-slate-950/80 border border-slate-800 focus:border-indigo-500 text-xs sm:text-sm text-slate-200 placeholder:text-slate-600 outline-none transition-all resize-none font-sans leading-relaxed"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* STEP 03: Floating Action Card - Centered */}
        <div
          ref={actionRef}
          className="w-full p-8 sm:p-12 rounded-3xl border border-slate-800/90 shadow-2xl shadow-indigo-950/30 flex flex-col md:flex-row items-center justify-between gap-8 bg-slate-900/80 backdrop-blur-2xl"
        >
          <div className="space-y-2 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2.5 text-xs font-bold text-indigo-400 uppercase tracking-wider">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Step 03 &bull; AI Synthesis Engine</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-heading font-extrabold text-white">
              Ready to generate your personalized strategy?
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              Evaluates ATS compatibility, extracts key skill gaps, and formulates model answers.
            </p>
          </div>

          <button
            onClick={handleGenerateReport}
            disabled={!jobDescription.trim()}
            className={`w-full md:w-auto px-10 py-5 rounded-2xl font-heading font-bold text-base text-white flex items-center justify-center gap-3 shadow-2xl transition-all duration-300 ${
              jobDescription.trim()
                ? 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:scale-[1.02] shadow-indigo-500/30 cursor-pointer'
                : 'bg-slate-800 text-slate-500 border border-slate-700/50 cursor-not-allowed'
            }`}
          >
            <Sparkles className="w-5 h-5 text-cyan-300" />
            Generate My Interview Strategy
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Features Showcase Grid - Centered */}
        <div className="w-full space-y-10 pt-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-white">
              Built for Interview Excellence
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Comprehensive career preparation powered by real ATS scoring and Gemini LLM.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-8 rounded-3xl bg-slate-900/50 backdrop-blur-xl border border-slate-800/80 space-y-4 hover:border-indigo-500/40 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-heading font-bold text-white">98% ATS Match</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Calculates precise match percentage and highlights missing technical keywords.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-900/50 backdrop-blur-xl border border-slate-800/80 space-y-4 hover:border-cyan-500/40 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-heading font-bold text-white">STAR Framework</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Generates behavioral answers using Situation, Task, Action, and Result structures.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-900/50 backdrop-blur-xl border border-slate-800/80 space-y-4 hover:border-emerald-500/40 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-heading font-bold text-white">7-Day Prep Roadmap</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Custom daily action plans with interactive checklists and milestone goals.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-900/50 backdrop-blur-xl border border-slate-800/80 space-y-4 hover:border-purple-500/40 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-heading font-bold text-white">Google Gemini LLM</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Powered by state-of-the-art GenAI models for deep context extraction.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Page Footer */}
      <footer className="w-full py-8 border-t border-slate-900 text-center text-xs text-slate-500">
        <p>GenAI Resume Strategy Analyzer &copy; {new Date().getFullYear()} &bull; Built with React, Tailwind CSS & GSAP</p>
      </footer>
    </div>
  );
};

export default Home;
