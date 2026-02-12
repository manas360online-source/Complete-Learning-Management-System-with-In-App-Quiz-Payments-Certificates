
import React, { useState, useEffect, useRef } from 'react';
import { HashRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Award, 
  CheckCircle2, 
  Lock, 
  ChevronRight, 
  CreditCard,
  User,
  Timer,
  X,
  Printer,
  Share2,
  QrCode,
  Linkedin,
  ShieldCheck,
  Star,
  Zap,
  Camera,
  LogOut,
  ChevronDown
} from 'lucide-react';
import LandingPage from './pages/LandingPage';
import ModuleViewer from './pages/ModuleViewer';
import CertificateVerification from './pages/CertificateVerification';
import { UserProgress, Certificate } from './types';
import { NLP_MODULES } from './constants';

const App: React.FC = () => {
  const [progress, setProgress] = useState<UserProgress>(() => {
    const saved = localStorage.getItem('nlp_lms_progress');
    return saved ? JSON.parse(saved) : {
      userId: 'user_123',
      studentName: 'Alex Johnson',
      profileImage: `https://api.dicebear.com/7.x/avataaars/svg?seed=Alex&backgroundColor=b6e3f4`,
      enrolledModules: ['ATMT_0.1'],
      completedModules: [],
      quizScores: {},
      certificates: []
    };
  });

  const [activeCert, setActiveCert] = useState<Certificate | null>(null);

  useEffect(() => {
    localStorage.setItem('nlp_lms_progress', JSON.stringify(progress));
  }, [progress]);

  const handleEnroll = (moduleCode: string) => {
    if (!progress.enrolledModules.includes(moduleCode)) {
      setProgress(prev => ({
        ...prev,
        enrolledModules: [...prev.enrolledModules, moduleCode]
      }));
    }
  };

  const updateProfile = (updates: Partial<UserProgress>) => {
    setProgress(prev => ({ ...prev, ...updates }));
  };

  const handleCompleteModule = (moduleCode: string, score: number) => {
    setProgress(prev => {
      const isNewlyCompleted = !prev.completedModules.includes(moduleCode);
      const newCompleted = isNewlyCompleted 
        ? [...prev.completedModules, moduleCode] 
        : prev.completedModules;
      
      const module = NLP_MODULES.find(m => m.code === moduleCode);
      const newlyUnlocked = module?.unlocks_modules.filter(m => !prev.enrolledModules.includes(m)) || [];
      const newEnrolled = [...prev.enrolledModules, ...newlyUnlocked];

      let newCertificates = [...prev.certificates];
      if (isNewlyCompleted && module?.level !== 'introduction') {
        const cert: Certificate = {
          id: `MF-${Math.random().toString(36).substr(2, 6).toUpperCase()}-${moduleCode}`,
          moduleCode,
          moduleTitle: module?.title || '',
          issueDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
          verificationToken: Math.random().toString(36).substr(2, 12),
          studentName: prev.studentName
        };
        newCertificates.push(cert);
        
        const targetModules = ['ATMT_1', 'ATMT_2', 'ATMT_3', 'ATMT_4', 'ATMT_5', 'ATMT_6'];
        const allDone = targetModules.every(m => newCompleted.includes(m));
        
        if (allDone && !newCertificates.some(c => c.moduleCode === 'MASTER')) {
          const masterCert: Certificate = {
            id: `MF-MASTER-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
            moduleCode: 'MASTER',
            moduleTitle: 'Master NLP Practitioner (Clinical)',
            issueDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
            verificationToken: `MASTER-${Math.random().toString(36).substr(2, 12)}`,
            studentName: prev.studentName
          };
          newCertificates.push(masterCert);
          setTimeout(() => setActiveCert(masterCert), 2000);
        } else {
          setTimeout(() => setActiveCert(cert), 1500);
        }
      }

      return {
        ...prev,
        completedModules: newCompleted,
        enrolledModules: Array.from(new Set(newEnrolled)),
        quizScores: { ...prev.quizScores, [moduleCode]: score },
        certificates: newCertificates
      };
    });
  };

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col bg-[#F1F7FE]">
        <Header progress={progress} updateProfile={updateProfile} certificates={progress.certificates} onViewCert={setActiveCert} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage progress={progress} onEnroll={handleEnroll} />} />
            <Route 
              path="/module/:code" 
              element={<ModuleViewer progress={progress} onComplete={handleCompleteModule} />} 
            />
            <Route path="/verify/:token" element={<CertificateVerification />} />
          </Routes>
        </main>
        <Footer />
        {activeCert && <CertificateModal cert={activeCert} onClose={() => setActiveCert(null)} />}
      </div>
    </HashRouter>
  );
};

const Header: React.FC<{ progress: UserProgress, updateProfile: (p: Partial<UserProgress>) => void, certificates: Certificate[], onViewCert: (c: Certificate) => void }> = ({ progress, updateProfile, certificates, onViewCert }) => {
  const [showProfile, setShowProfile] = useState(false);
  const [timeLeft, setTimeLeft] = useState("23:59:59");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      const diff = endOfDay.getTime() - now.getTime();
      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateProfile({ profileImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const scrollToSection = (id: string) => {
    if (location.pathname !== '/') {
      navigate(`/#${id}`);
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header className="sticky top-0 z-50 glass-card border-b border-stone-200/50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-[#0066FF] rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
            <BookOpen className="text-white w-6 h-6" />
          </div>
          <span className="font-serif text-2xl font-bold text-slate-800 tracking-tight">MindFlow</span>
        </Link>

        <nav className="hidden lg:flex items-center space-x-10">
          <button onClick={() => scrollToSection('curriculum')} className="text-sm font-semibold text-slate-500 hover:text-[#0066FF] transition-colors">Curriculum</button>
          <button onClick={() => scrollToSection('specializations')} className="text-sm font-semibold text-slate-500 hover:text-[#0066FF] transition-colors">Specializations</button>
          <button onClick={() => scrollToSection('impact')} className="text-sm font-semibold text-slate-500 hover:text-[#0066FF] transition-colors">Impact</button>
        </nav>

        <div className="flex items-center space-x-6">
          <div className="relative">
            <button 
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center space-x-3 group"
            >
              <div className="text-right hidden sm:block">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{progress.studentName}</p>
                <p className="text-sm font-bold text-slate-800 group-hover:text-[#0066FF] transition-colors flex items-center">
                  {progress.completedModules.length >= 6 ? 'Master Practitioner' : 'Practitioner Path'}
                  <ChevronDown className={`w-3 h-3 ml-2 transition-transform ${showProfile ? 'rotate-180' : ''}`} />
                </p>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-stone-100 flex items-center justify-center border-2 border-white shadow-sm ring-1 ring-blue-500/20 group-hover:ring-[#0066FF] transition-all overflow-hidden relative">
                 <img src={progress.profileImage} alt="avatar" className="w-full h-full object-cover" />
              </div>
            </button>

            {showProfile && (
              <div className="absolute right-0 mt-4 w-80 bg-white rounded-[2.5rem] shadow-2xl border border-stone-100 p-6 z-50 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex items-center space-x-4 mb-8">
                  <div className="relative group/avatar">
                    <img src={progress.profileImage} className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-50 shadow-sm" />
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 bg-slate-900/40 rounded-2xl opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center text-white"
                    >
                      <Camera className="w-5 h-5" />
                    </button>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">{progress.studentName}</h4>
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-300">Student ID: {progress.userId}</p>
                  </div>
                </div>

                <h4 className="font-serif text-lg font-bold text-slate-800 mb-4 px-2 flex items-center">
                  <Award className="w-5 h-5 mr-2 text-amber-500" /> Clinical Diplomas
                </h4>
                <div className="space-y-2 mb-6 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                  {certificates.length > 0 ? (
                    certificates.map(c => (
                      <button 
                        key={c.id} 
                        onClick={() => { onViewCert(c); setShowProfile(false); }}
                        className={`w-full flex items-center p-3 rounded-[1.2rem] transition-colors group text-left border ${
                          c.moduleCode === 'MASTER' ? 'bg-amber-50 border-amber-200 hover:bg-amber-100' : 'hover:bg-blue-50 border-transparent hover:border-blue-100'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 shrink-0 ${
                          c.moduleCode === 'MASTER' ? 'bg-amber-200 text-amber-700' : 'bg-blue-100 text-[#0066FF]'
                        }`}>
                          <Star className="w-3 h-3 fill-current" />
                        </div>
                        <div className="flex-grow overflow-hidden">
                          <p className="text-xs font-bold text-slate-800 truncate">{c.moduleTitle}</p>
                          <p className="text-[8px] text-slate-400 font-black uppercase tracking-tighter">{c.issueDate}</p>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="text-center py-6 bg-stone-50 rounded-2xl">
                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest px-4">Assessments Pending</p>
                    </div>
                  )}
                </div>
                <div className="pt-6 border-t border-stone-100">
                  <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase mb-3 tracking-widest">
                    <span>Clinical Registry Progress</span>
                    <span>{Math.round((progress.completedModules.length / (NLP_MODULES.length - 1)) * 100)}%</span>
                  </div>
                  <div className="h-2 w-full bg-stone-50 rounded-full overflow-hidden border border-stone-100">
                    <div className="h-full bg-[#0066FF] transition-all duration-1000" style={{ width: `${(progress.completedModules.length / (NLP_MODULES.length - 1)) * 100}%` }}></div>
                  </div>
                  <button className="w-full mt-6 flex items-center justify-center text-[10px] font-black uppercase tracking-widest text-red-400 hover:text-red-500 transition-colors py-2">
                     <LogOut className="w-3 h-3 mr-2" /> End Session
                   </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="bg-[#0066FF]/95 backdrop-blur-md text-white py-2 overflow-hidden relative border-t border-blue-500/30">
        <div className="max-w-7xl mx-auto flex items-center justify-center text-[10px] font-black uppercase tracking-[0.2em]">
          <Zap className="w-3 h-3 mr-2 animate-pulse" />
          Early Release: Special 20% discount ends in <span className="ml-2 text-blue-100 font-mono">{timeLeft}</span>
        </div>
      </div>
    </header>
  );
};

const CertificateModal: React.FC<{ cert: Certificate, onClose: () => void }> = ({ cert, onClose }) => {
  const shareOnLinkedIn = () => {
    const url = encodeURIComponent(`${window.location.origin}/#/verify/${cert.verificationToken}`);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xl animate-in fade-in duration-500 no-print">
      <div className="max-w-4xl w-full bg-white rounded-[4rem] shadow-2xl relative overflow-hidden flex flex-col max-h-[95vh] border border-white/20">
        <button onClick={onClose} className="absolute top-8 right-8 z-10 w-12 h-12 bg-white/50 backdrop-blur-md rounded-2xl flex items-center justify-center hover:bg-white transition-all shadow-lg">
          <X className="w-6 h-6 text-slate-400" />
        </button>

        <div className="overflow-y-auto p-12 md:p-20 custom-scrollbar">
          <div id="certificate-print-area" className="relative border-[16px] border-blue-50 p-16 rounded-[3.5rem] text-center shadow-inner overflow-hidden bg-white">
            {cert.moduleCode === 'MASTER' && (
              <div className="absolute top-[-50px] left-[-50px] w-64 h-64 bg-amber-100/30 rounded-full blur-[60px] animate-pulse"></div>
            )}
            
            <div className="mb-12 relative">
              <div className={`w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl ${
                cert.moduleCode === 'MASTER' ? 'bg-amber-500 shadow-amber-200' : 'bg-[#0066FF] shadow-blue-200'
              }`}>
                <Award className="text-white w-12 h-12" />
              </div>
              <h1 className="font-serif text-5xl font-bold text-slate-900 mb-2">Certification</h1>
              <p className="text-slate-400 font-black uppercase tracking-[0.4em] text-[10px]">MindFlow Practitioner Institute</p>
            </div>

            <div className="my-16">
              <p className="text-stone-300 font-black uppercase tracking-widest text-[9px] mb-4">Institutional Credential Verification</p>
              <h2 className="text-6xl font-serif font-bold text-slate-800 mb-8">{cert.studentName}</h2>
              <p className="text-slate-500 font-medium italic mb-8">has attained clinical mastery and verified registry status in</p>
              <h3 className={`text-4xl font-bold font-serif uppercase tracking-tight ${
                cert.moduleCode === 'MASTER' ? 'text-amber-600' : 'text-blue-700'
              }`}>{cert.moduleTitle}</h3>
            </div>

            <div className="grid grid-cols-2 gap-16 mt-20 text-center border-t border-stone-50 pt-16">
              <div>
                <div className="font-serif text-2xl text-slate-800 italic border-b-2 border-stone-100 pb-2 mb-2">Julian MindFlow</div>
                <p className="text-[9px] font-black uppercase text-slate-300 tracking-[0.2em]">Clinical Director</p>
              </div>
              <div>
                <div className="font-mono text-xl text-slate-800 border-b-2 border-stone-100 pb-2 mb-2 uppercase">{cert.issueDate}</div>
                <p className="text-[9px] font-black uppercase text-slate-300 tracking-[0.2em]">Registry Date</p>
              </div>
            </div>

            <div className="mt-20 flex flex-col items-center">
               <div className="w-24 h-24 p-3 border-2 border-stone-100 rounded-[2rem] bg-slate-50 mb-4">
                  <QrCode className="w-full h-full text-[#0066FF]" />
               </div>
               <p className="text-[9px] font-bold text-[#0066FF] font-mono tracking-tighter">VERIFICATION ID: {cert.id}</p>
            </div>
          </div>
          
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <button onClick={handlePrint} className="bg-slate-900 text-white py-6 rounded-[2.5rem] font-black uppercase tracking-[0.2em] text-[10px] hover:bg-slate-800 transition-all flex items-center justify-center shadow-2xl">
              <Printer className="w-5 h-5 mr-3" /> Save to PDF
            </button>
            <button onClick={shareOnLinkedIn} className="bg-[#0077B5] text-white py-6 rounded-[2.5rem] font-black uppercase tracking-[0.2em] text-[10px] hover:bg-[#00669c] transition-all flex items-center justify-center shadow-2xl">
              <Linkedin className="w-5 h-5 mr-3 fill-current" /> LinkedIn
            </button>
            <button className="bg-white text-slate-700 border-2 border-stone-100 py-6 rounded-[2.5rem] font-black uppercase tracking-[0.2em] text-[10px] hover:bg-stone-50 transition-all flex items-center justify-center">
              <Share2 className="w-5 h-5 mr-3" /> Share Link
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Footer: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (id: string) => {
    if (location.pathname !== '/') {
      navigate(`/#${id}`);
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <footer className="bg-[#F1F7FE] border-t border-stone-200 py-24 no-print">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-20 mb-20">
          <div className="col-span-1 lg:col-span-2">
            <Link to="/" className="flex items-center space-x-3 mb-8">
              <div className="w-10 h-10 bg-[#0066FF] rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
                <BookOpen className="text-white w-6 h-6" />
              </div>
              <span className="font-serif text-3xl font-bold text-slate-800 tracking-tight">MindFlow</span>
            </Link>
            <p className="text-slate-500 text-xl max-w-lg leading-relaxed font-medium">Standardizing Neuro-Linguistic Programming for clinical excellence. Authorized global practitioner registry.</p>
          </div>
          <div>
            <h4 className="font-black text-slate-900 mb-8 uppercase tracking-[0.3em] text-[10px]">Ecosystem</h4>
            <ul className="space-y-4 text-slate-400 font-bold text-sm">
              <li><button onClick={() => scrollToSection('specializations')} className="hover:text-[#0066FF] transition-colors">Specializations</button></li>
              <li><button onClick={() => scrollToSection('impact')} className="hover:text-[#0066FF] transition-colors">Registry</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-slate-900 mb-8 uppercase tracking-[0.3em] text-[10px]">Institutional</h4>
            <ul className="space-y-4 text-slate-400 font-bold text-sm">
              <li><button onClick={() => scrollToSection('impact')} className="hover:text-[#0066FF] transition-colors">Verification</button></li>
              <li><a href="#" className="hover:text-[#0066FF] transition-colors">Ethics Board</a></li>
            </ul>
          </div>
        </div>
        <div className="pt-12 border-t border-stone-200 flex flex-col md:flex-row justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">
          <span>&copy; {new Date().getFullYear()} MindFlow International Institute.</span>
          <div className="flex space-x-8 mt-6 md:mt-0">
            <a href="#" className="hover:text-slate-800 transition-colors">Terms of Practice</a>
            <a href="#" className="hover:text-slate-800 transition-colors">Privacy Ethics</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default App;
