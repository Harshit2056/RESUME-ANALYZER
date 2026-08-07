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
    const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

    tl.from(heroRef.current, {
      y: 25,
      opacity: 0,
      duration: 0.6
    })
    .from(step1Ref.current, {
      y: 25,
      opacity: 0,
      duration: 0.5
    }, '-=0.3')
    .from(step2Ref.current, {
      y: 25,
      opacity: 0,
      duration: 0.5
    }, '-=0.3')
    .from(actionRef.current, {
      y: 20,
      opacity: 0,
      duration: 0.4
    }, '-=0.2');
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
      const file = e.target.files[0];
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
    if(!jobDescription?.trim()){
      alert("Job description is required to generate the interview report.");
      return;
    }

    if(!resumeFile && !selfDescription?.trim()){
      alert("Either a resume file or a self-description is required to generate the interview report.");
      return;
    }

    const data = await handleGenerateInterviewReport({
      jobDescription,
      selfDescription,
      resumeFile
    });
    if (data?.data?.interviewReport?._id) {
      navigate(`/interview/${data.data.interviewReport._id}`);
    }
  };

  // Professional AI Loading Overlay
  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-[#0D1117]/95 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center">
        <div className="relative w-20 h-20 mb-8 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-indigo-500/20 animate-spin" />
          <div className="w-12 h-12 rounded-full bg-indigo-600/10 border border-indigo-500/30 flex items-center justify-center">
            <Cpu className="w-6 h-6 text-indigo-400" />
          </div>
        </div>

        <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-white tracking-tight mb-3">
          Generating Career Strategy Plan
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-md mb-10 leading-relaxed">
          Evaluating job requirements, parsing profile data, and structuring tailored interview scenarios.
        </p>

        <div className="w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-2xl p-6 text-left space-y-4 shadow-xl">
          <div className="flex items-center gap-3 text-xs font-semibold text-slate-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Analyzing target position requirements</span>
          </div>
          <div className="flex items-center gap-3 text-xs font-semibold text-indigo-300">
            <Sparkles className="w-4 h-4 text-indigo-400 animate-spin shrink-0" />
            <span>Evaluating profile match & key skill gaps</span>
          </div>
          <div className="flex items-center gap-3 text-xs font-semibold text-slate-400">
            <div className="w-4 h-4 rounded-full border border-slate-600 flex items-center justify-center text-[10px] shrink-0">3</div>
            <span>Structuring technical & behavioral STAR answers</span>
          </div>
          <div className="flex items-center gap-3 text-xs font-semibold text-slate-400">
            <div className="w-4 h-4 rounded-full border border-slate-600 flex items-center justify-center text-[10px] shrink-0">4</div>
            <span>Building 7-day preparation roadmap</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#0D1117] text-slate-100 flex flex-col items-center justify-between selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Centered Container */}
      <main className="w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-12 sm:py-16 relative z-10 space-y-12 sm:space-y-16 flex flex-col items-center">
        
        {/* Hero Header */}
        <div ref={heroRef} className="text-center max-w-3xl mx-auto flex flex-col items-center justify-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-700/80 text-slate-200 text-xs font-medium shadow-sm">
            <Zap className="w-3.5 h-3.5 text-indigo-400" /> Professional Resume & Mock Interview Intelligence
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-heading font-extrabold tracking-tight text-white leading-tight text-center">
            Supercharge Your <span className="text-indigo-400">Interview Strategy</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto text-center">
            Build tailored technical questions, behavioral STAR strategies, and an actionable 7-day preparation plan powered by Gemini AI.
          </p>
        </div>

        {/* Step-by-Step Workspace Grid */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* STEP 01: Target Job Position Card */}
          <div
            ref={step1Ref}
            className="p-7 sm:p-9 rounded-2xl border border-slate-700/80 bg-slate-900 shadow-xl shadow-slate-950/50 flex flex-col justify-between space-y-6"
          >
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between flex-wrap gap-4 pb-5 border-b border-slate-800">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                      Step 01
                    </span>
                    <h2 className="text-lg sm:text-xl font-heading font-bold text-white tracking-tight">
                      Target Job Position
                    </h2>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 text-[10px] font-semibold uppercase bg-indigo-500/15 text-indigo-300 rounded border border-indigo-500/30">
                  Required
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                Paste the target job description or choose from preset role templates to auto-fill requirements.
              </p>

              {/* Preset Role Templates Container */}
              <div className="p-4 sm:p-5 rounded-xl bg-slate-950/90 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2 text-xs font-semibold text-slate-200">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Preset Role Templates</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-normal">Click to auto-fill</span>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {JOB_TEMPLATES.map((tmpl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setJobDescription(tmpl.desc)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900 border border-slate-700 text-slate-200 hover:border-indigo-500/50 hover:text-white transition-colors cursor-pointer"
                    >
                      {tmpl.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Textarea Input Section */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Job Description Text
                  </label>
                  {jobDescription.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setJobDescription('')}
                      className="text-xs font-medium text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" /> Clear
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    maxLength={5000}
                    rows={8}
                    placeholder={`Paste target job requirements here...\n\ne.g., 'Senior Frontend Engineer at Google requires proficiency in React 19, TypeScript, state management, web performance optimization, and scalable UI system design...'`}
                    className="w-full p-4 sm:p-5 rounded-xl bg-slate-950/90 border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 outline-none transition-all resize-none leading-relaxed font-sans min-h-[220px]"
                  />
                  
                  {/* Status Row */}
                  <div className="flex items-center justify-between pt-1 text-xs">
                    <div>
                      {jobDescription.trim() ? (
                        <span className="text-emerald-400 font-medium flex items-center gap-1 text-[11px]">
                          <Check className="w-3.5 h-3.5 stroke-[3]" /> Requirements Ready
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">
                          Required for strategy generation
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] font-medium text-slate-400">
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
            className="p-7 sm:p-9 rounded-2xl border border-slate-700/80 bg-slate-900 shadow-xl shadow-slate-950/50 space-y-6 flex flex-col justify-between"
          >
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between flex-wrap gap-4 pb-5 border-b border-slate-800">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-cyan-600/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                      Step 02
                    </span>
                    <h2 className="text-lg sm:text-xl font-heading font-bold text-white tracking-tight">
                      Candidate Profile Context
                    </h2>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 text-[10px] font-semibold uppercase bg-indigo-500/15 text-indigo-300 rounded border border-indigo-500/30">
                  Required
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                Choose how you want to provide your experience: upload your resume document or write a quick summary.
              </p>

              {/* Profile Mode Selector Tabs */}
              <div className="flex items-center gap-2 p-1.5 bg-slate-950/90 border border-slate-800 rounded-xl">
                <button
                  type="button"
                  onClick={() => setProfileTab('resume')}
                  className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    profileTab === 'resume'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <FileUp className="w-3.5 h-3.5" />
                  Upload Resume PDF
                </button>
                <button
                  type="button"
                  onClick={() => setProfileTab('self')}
                  className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    profileTab === 'self'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Self-Description
                </button>
              </div>

              {/* Tab Content 1: Resume Upload */}
              {profileTab === 'resume' && (
                <div className="space-y-4 pt-1">
                  {selectedFile ? (
                    <div className="p-4 rounded-xl bg-slate-950/90 border border-indigo-500/30 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-indigo-600/20 rounded-xl text-indigo-400">
                          <FileText className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-200 truncate max-w-[200px] sm:max-w-[280px]">
                            {selectedFile.name}
                          </p>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB &bull; Attached
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={removeFile}
                        className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                        title="Remove File"
                      >
                        <X className="w-4 h-4" />
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
                      className={`border border-dashed rounded-xl p-10 sm:p-12 text-center cursor-pointer transition-all ${
                        isDragging
                          ? 'border-indigo-500 bg-indigo-600/10'
                          : 'border-slate-700/80 bg-slate-950/50 hover:border-indigo-500/50 hover:bg-slate-950/80'
                      }`}
                    >
                      <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700/80 text-slate-300 mx-auto flex items-center justify-center mb-3">
                        <UploadCloud className="w-6 h-6" />
                      </div>
                      <p className="text-xs sm:text-sm font-semibold text-slate-200">
                        Click to upload <span className="text-slate-400 font-normal">or drag & drop</span>
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1">PDF or DOCX format (Max 5MB)</p>
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
                <div className="space-y-2 pt-1">
                  <label className="block text-xs font-semibold text-slate-300">
                    Quick Background Summary
                  </label>
                  <textarea
                    value={selfDescription}
                    onChange={(e) => setSelfDescription(e.target.value)}
                    rows={7}
                    placeholder="Describe your tech stack, key projects, domain experience, and years in software engineering..."
                    className="w-full p-4 rounded-xl bg-slate-950/90 border border-slate-700 focus:border-indigo-500 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 outline-none transition-all resize-none font-sans leading-relaxed"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* STEP 03: Floating Action Card */}
        <div
          ref={actionRef}
          className="w-full p-7 sm:p-9 rounded-2xl border border-slate-700/80 bg-slate-900 shadow-xl shadow-slate-950/50 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="space-y-1.5 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider">
              <Layers className="w-3.5 h-3.5" />
              <span>Step 03 &bull; AI Synthesis Engine</span>
            </div>
            <h3 className="text-lg sm:text-xl font-heading font-bold text-white">
              Ready to generate your personalized strategy?
            </h3>
            <p className="text-xs text-slate-300">
              Evaluates ATS compatibility, extracts key skill gaps, and formulates model answers.
            </p>
          </div>

          <button
            onClick={handleGenerateReport}
            disabled={!jobDescription.trim()}
            className={`w-full md:w-auto px-8 py-3.5 rounded-xl font-heading font-bold text-sm text-white flex items-center justify-center gap-2.5 shadow-sm transition-all ${
              jobDescription.trim()
                ? 'bg-indigo-600 hover:bg-indigo-500 cursor-pointer shadow-indigo-600/30'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
            }`}
          >
            <Sparkles className="w-4 h-4 text-indigo-200" />
            Generate Strategy
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Features Showcase Grid */}
        <div className="w-full space-y-8 pt-4">
          <div className="text-center max-w-2xl mx-auto space-y-1">
            <h2 className="text-xl sm:text-2xl font-heading font-bold text-white">
              Built for Interview Excellence
            </h2>
            <p className="text-xs text-slate-300">
              Comprehensive career preparation powered by real ATS scoring and Gemini LLM.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-700/80 space-y-3 hover:border-slate-600 transition-colors shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 text-indigo-400 flex items-center justify-center">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-heading font-bold text-white">98% ATS Match</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Calculates match percentage and highlights missing technical keywords.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-700/80 space-y-3 hover:border-slate-600 transition-colors shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 text-cyan-400 flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-base font-heading font-bold text-white">STAR Framework</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Generates behavioral answers using Situation, Task, Action, and Result structures.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-700/80 space-y-3 hover:border-slate-600 transition-colors shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-heading font-bold text-white">7-Day Prep Roadmap</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Custom daily action plans with interactive checklists and milestone goals.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-700/80 space-y-3 hover:border-slate-600 transition-colors shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 text-purple-400 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-base font-heading font-bold text-white">Google Gemini LLM</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Powered by state-of-the-art GenAI models for deep context extraction.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Page Footer */}
      <footer className="w-full py-6 border-t border-slate-800 text-center text-xs text-slate-400">
        <p>GenAI Resume Strategy Analyzer &copy; {new Date().getFullYear()} &bull; Built with React, Tailwind CSS & GSAP</p>
      </footer>
    </div>
  );
};

export default Home;
