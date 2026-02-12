
import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { 
  Lock, 
  CheckCircle2, 
  ChevronRight, 
  PlayCircle, 
  CreditCard, 
  Sparkles,
  Zap,
  Star,
  ShieldCheck,
  Award,
  BookOpen,
  X,
  Timer,
  Eye,
  TrendingUp,
  Percent,
  Users,
  Globe,
  Coins,
  Search,
  BadgeCheck,
  ArrowRight,
  TrendingDown,
  Activity,
  Quote,
  BarChart3,
  Stethoscope,
  Heart
} from 'lucide-react';
import { UserProgress, NLPModule, ModuleLevel } from '../types';
import { NLP_MODULES, BUNDLES } from '../constants';

interface LandingPageProps {
  progress: UserProgress;
  onEnroll: (code: string) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ progress, onEnroll }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPaymentModal, setShowPaymentModal] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState("23:59:59");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [paymentPlan, setPaymentPlan] = useState<'full' | 'emi'>('full');

  useEffect(() => {
    // Handle scrolling if navigated with a hash
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 300);
      }
    }
  }, [location]);

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

  const getModuleStatus = (module: NLPModule) => {
    if (progress.completedModules.includes(module.code)) return 'completed';
    if (progress.enrolledModules.includes(module.code)) return 'available';
    
    const prereqsMet = module.prerequisite_modules.length === 0 || 
                      module.prerequisite_modules.every(p => progress.completedModules.includes(p));
    
    if (prereqsMet) return 'ready-to-buy';
    return 'locked';
  };

  const handleModuleClick = (module: NLPModule) => {
    const status = getModuleStatus(module);
    if (status === 'completed' || status === 'available') {
      navigate(`/module/${module.code}`);
    } else if (status === 'ready-to-buy') {
      setShowPaymentModal(module.code);
    }
  };

  const processPayment = (code: string) => {
    onEnroll(code);
    setShowPaymentModal(null);
    navigate(`/module/${code}`);
  };

  const currentModuleToBuy = NLP_MODULES.find(m => m.code === showPaymentModal);

  const handleSearch = () => {
    if (!searchQuery) return;
    setIsSearching(true);
    setTimeout(() => setIsSearching(false), 800);
  };

  return (
    <div className="pb-32 bg-[#F1F7FE]">
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center space-x-2 bg-blue-50 text-[#0066FF] px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-10 border border-blue-100 animate-in fade-in slide-in-from-bottom-4 duration-700">
             <Star className="w-3 h-3 fill-[#0066FF]" /> 
             <span>Authorized Clinical NLP Certification</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-serif font-bold text-slate-800 mb-8 tracking-tight leading-tight">
            Elevate Your <br/> 
            <span className="text-[#0066FF] italic">Clinical Depth.</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-500 max-w-2xl mx-auto mb-14 leading-relaxed font-medium">
            Join 5,500+ certified practitioners. Master the core frameworks of empathy and neuro-conditioning at an <span className="text-slate-800 font-bold">irresistible value.</span>
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-5 sm:space-y-0 sm:space-x-8">
            <button 
              onClick={() => {
                const el = document.getElementById('curriculum');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-[#0066FF] text-white px-10 py-6 rounded-full font-bold shadow-2xl shadow-blue-200/50 hover:bg-[#0052cc] transition-all flex items-center text-lg group"
            >
              Start Your Journey <ChevronRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
            <div className="flex items-center text-slate-400 text-xs font-black uppercase tracking-widest">
              <Zap className="w-5 h-5 mr-2 text-amber-500" />
              Early Bird Active: Under ₹320!
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section - Metrics & Social Proof */}
      <section id="impact" className="max-w-7xl mx-auto px-6 mb-32 scroll-mt-24">
        <div className="text-center mb-16">
           <h2 className="text-4xl font-serif font-bold text-slate-800 mb-4">Global Practitioner Impact</h2>
           <p className="text-slate-400 font-medium max-w-2xl mx-auto">Scaling clinical empathy across borders. Our metrics reflect our commitment to excellence.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { label: 'Verified Graduates', val: '5,500+', icon: Users },
            { label: 'Global Registry Status', val: 'Active', icon: Globe },
            { label: 'Success Rating', val: '4.9/5', icon: Star },
            { label: 'ISO Standardized', val: 'Compliant', icon: ShieldCheck }
          ].map((stat, i) => (
            <div key={i} className="bg-white p-10 rounded-[3rem] border border-stone-100 text-center shadow-sm hover:shadow-xl transition-all group">
              <stat.icon className="w-8 h-8 mx-auto mb-4 text-[#0066FF] group-hover:scale-110 transition-transform" />
              <div className="text-3xl font-serif font-bold text-slate-800 mb-1">{stat.val}</div>
              <div className="text-[10px] font-black uppercase text-slate-300 tracking-[0.2em]">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-2 gap-10">
          {[
            { name: 'Dr. Sarah Chen', role: 'Clinical Psychologist', quote: 'MindFlow standardized my approach to patient rapport. The 5Why framework is a clinical game-changer.', img: '1' },
            { name: 'Marcus Thorne', role: 'Executive Coach', quote: 'The submodalities mastery course allowed me to help clients overcome performance anxiety in minutes, not months.', img: '2' }
          ].map((t, idx) => (
            <div key={idx} className="bg-white p-12 rounded-[4rem] border border-stone-100 shadow-xl relative">
              <Quote className="absolute top-10 right-10 w-12 h-12 text-blue-50 opacity-50" />
              <p className="text-slate-600 text-lg italic mb-10 leading-relaxed">"{t.quote}"</p>
              <div className="flex items-center">
                 <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${t.name}`} className="w-14 h-14 rounded-2xl bg-blue-50 mr-4" />
                 <div>
                    <h4 className="font-bold text-slate-800">{t.name}</h4>
                    <p className="text-[10px] font-black uppercase text-slate-300 tracking-widest">{t.role}</p>
                 </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Curriculum Section */}
      <section id="curriculum" className="max-w-7xl mx-auto px-6 mb-48 scroll-mt-24">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-16 px-4 gap-6">
           <div>
             <h2 className="text-4xl font-serif font-bold text-slate-800">Learning Path Architecture</h2>
             <p className="text-slate-400 font-medium text-sm mt-1">Structured clinical progression from Orientation to Master Practitioner.</p>
           </div>
           <div className="flex items-center bg-white px-8 py-4 rounded-full border border-stone-100 shadow-sm text-[10px] font-black text-slate-400 uppercase tracking-widest">
             <Timer className="w-4 h-4 mr-3 text-[#0066FF] animate-pulse" /> 
             <span>Early Bird Strategy Active:</span> 
             <span className="text-[#0066FF] ml-3 font-mono text-base">{timeLeft}</span>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {NLP_MODULES.map((module) => {
            const status = getModuleStatus(module);
            const isMandatory = module.level === ModuleLevel.MANDATORY;
            const isEarlyBird = module.price > 0 && module.early_bird_price < module.price;
            
            return (
              <div 
                key={module.code}
                onClick={() => handleModuleClick(module)}
                className={`group relative p-12 rounded-[4rem] border-2 transition-all cursor-pointer overflow-hidden flex flex-col ${
                  status === 'locked' 
                    ? 'bg-stone-50/50 border-stone-100 grayscale opacity-40' 
                    : 'bg-white border-white shadow-2xl shadow-slate-200/30 hover:shadow-blue-100 hover:-translate-y-2'
                }`}
              >
                {isMandatory && status !== 'locked' && (
                  <div className="absolute top-0 right-0 bg-[#0066FF] text-white px-6 py-2 rounded-bl-3xl text-[9px] font-black uppercase tracking-[0.2em] z-10">
                    Mandatory Core
                  </div>
                )}
                
                <div className="flex items-start justify-between mb-12">
                  <div className={`w-16 h-16 rounded-[2rem] flex items-center justify-center transition-all group-hover:rotate-6 duration-500 ${
                    status === 'completed' ? 'bg-blue-50 text-[#0066FF]' : 
                    status === 'locked' ? 'bg-stone-100 text-stone-300' : 'bg-[#0066FF] text-white shadow-lg shadow-blue-100'
                  }`}>
                    {status === 'completed' ? <CheckCircle2 className="w-8 h-8" /> :
                     status === 'locked' ? <Lock className="w-7 h-7" /> : <PlayCircle className="w-8 h-8" />}
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-300 block mb-2">{module.code}</span>
                    {status === 'ready-to-buy' && (
                      <div className="flex flex-col items-end">
                        <div className="flex items-center space-x-2">
                          {isEarlyBird && <span className="text-stone-300 line-through text-sm">₹{module.price}</span>}
                          <span className="text-3xl font-serif font-bold text-slate-800">₹{module.early_bird_price}</span>
                        </div>
                        {isEarlyBird && <div className="text-[#0066FF] text-[9px] font-black uppercase tracking-tighter mt-1 bg-blue-50 px-2 py-0.5 rounded">Special ₹319 Early Bird!</div>}
                      </div>
                    )}
                  </div>
                </div>

                <h3 className="text-2xl font-serif font-bold text-slate-800 mb-4 leading-tight">{module.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-12 font-medium flex-grow">{module.description}</p>
                
                {module.code === 'ATMT_1' && status === 'ready-to-buy' && (
                  <div className="mb-8 flex items-center bg-stone-50 p-4 rounded-2xl border border-stone-100">
                    <Coins className="w-5 h-5 text-[#0066FF] mr-3" />
                    <div>
                      <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Payment Plan</p>
                      <p className="text-xs font-bold text-slate-600">₹133 × 3 months available</p>
                    </div>
                  </div>
                )}

                <div className="pt-8 border-t border-stone-50 flex items-center justify-between">
                   <span className="text-[10px] font-black text-[#0066FF] uppercase tracking-widest">
                      {status === 'completed' ? 'Certified Access' : status === 'locked' ? 'Core Required' : status === 'ready-to-buy' ? 'Secure Unlock' : 'Continue Track'}
                   </span>
                   <ChevronRight className="w-4 h-4 text-[#0066FF] group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Specializations Section - Bundles */}
      <section id="specializations" className="max-w-7xl mx-auto px-6 mb-48 scroll-mt-24">
        <div className="text-center mb-20">
           <div className="inline-flex items-center space-x-2 bg-amber-50 text-amber-700 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6 border border-amber-100">
             <TrendingUp className="w-3 h-3" /> 
             <span>Credential Specialization Tracks</span>
          </div>
           <h2 className="text-5xl font-serif font-bold text-slate-800 mb-6">Expertise Bundles</h2>
           <p className="text-slate-400 text-lg font-medium max-w-xl mx-auto">Choose your focus area. Our bundles are curated to provide the deepest impact for your specific clinical or professional practice.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {BUNDLES.map((bundle) => (
            <div 
              key={bundle.id}
              className={`relative p-12 rounded-[4.5rem] flex flex-col transition-all duration-700 hover:shadow-2xl ${
                bundle.id === 'master' 
                  ? 'bg-slate-900 text-white shadow-2xl shadow-blue-900/40 border-t-8 border-[#0066FF]' 
                  : 'bg-white text-slate-600 shadow-2xl shadow-slate-200/50 border border-stone-100'
              }`}
            >
              {bundle.id === 'master' && (
                <div className="absolute top-10 right-10 bg-[#0066FF] text-white px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] flex items-center">
                   <Sparkles className="w-3 h-3 mr-2" /> Most Professional Value
                </div>
              )}
              
              <h3 className="text-3xl font-serif font-bold mb-4">{bundle.title}</h3>
              <p className="text-[10px] mb-12 font-black opacity-60 leading-relaxed uppercase tracking-[0.2em]">{bundle.description}</p>
              
              <div className="mb-12">
                <span className="text-6xl font-serif font-bold">₹{bundle.price}</span>
                {bundle.savings > 0 && (
                  <div className={`inline-block ml-4 px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest ${bundle.id === 'master' ? 'bg-[#0066FF] text-white shadow-lg' : 'bg-blue-50 text-[#0066FF]'}`}>
                    Save ₹{bundle.savings}
                  </div>
                )}
              </div>

              <div className="space-y-6 mb-16 flex-grow">
                {bundle.modules.map(mCode => (
                  <div key={mCode} className="flex items-start text-sm font-semibold leading-relaxed">
                    <CheckCircle2 className={`w-5 h-5 mr-4 shrink-0 mt-0.5 ${bundle.id === 'master' ? 'text-[#0066FF]' : 'text-blue-600'}`} />
                    <span>{NLP_MODULES.find(mod => mod.code === mCode)?.title}</span>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => {
                  if (bundle.id === 'foundation') setShowPaymentModal('ATMT_1');
                  else {
                    // In a real app, this would trigger a bundle-specific flow
                    setShowPaymentModal('ATMT_1'); 
                  }
                }}
                className={`w-full py-7 rounded-full font-black uppercase tracking-[0.3em] text-[10px] transition-all ${
                bundle.id === 'master'
                  ? 'bg-[#0066FF] text-white hover:bg-[#0052cc]'
                  : 'bg-slate-900 text-white hover:bg-slate-800'
              }`}>
                Unlock Mastery Bundle
              </button>
            </div>
          ))}
        </div>

        {/* Specialized Tracks Info */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-12">
           {[
             { title: 'Clinical Psych', desc: 'Deep dive into trauma healing and Timeline Therapy protocols.', icon: Stethoscope },
             { title: 'Executive Coaching', desc: 'Focus on Anchoring, State Control, and Performance Conditioning.', icon: BarChart3 },
             { title: 'Holistic Wellness', desc: 'Submodalities and Neuro-Associative conditioning for lifestyle shifts.', icon: Heart }
           ].map((track, i) => (
             <div key={i} className="text-center group">
               <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-sm group-hover:bg-[#0066FF] group-hover:text-white transition-all group-hover:rotate-6">
                 <track.icon className="w-10 h-10 text-[#0066FF] group-hover:text-white transition-colors" />
               </div>
               <h4 className="text-xl font-serif font-bold text-slate-800 mb-3">{track.title}</h4>
               <p className="text-slate-400 text-sm leading-relaxed px-6">{track.desc}</p>
             </div>
           ))}
        </div>
      </section>

      {/* Impact Timeline (Re-emphasizing Impact) */}
      <section className="max-w-7xl mx-auto px-6 mb-48">
        <div className="bg-slate-900 rounded-[4.5rem] p-16 md:p-24 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]"></div>
          <div className="relative z-10">
            <div className="text-center mb-16">
              <div className="inline-flex items-center space-x-2 bg-blue-500/10 text-blue-400 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6 border border-blue-500/20">
                <Activity className="w-3 h-3" /> 
                <span>Institutional Scalability</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">Standardizing Global Care</h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto font-medium opacity-80">Our ₹399 strategy is designed for maximum accessibility without compromising institutional depth.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                { period: 'Month 1', goal: '275 Paid Enrollments', focus: '55% Target Conversion', metric: '₹1.78L Revenue' },
                { period: 'Month 3', goal: '1,100 Core Grads', focus: '300 Active Certificates', metric: '₹9.06L Revenue' },
                { period: 'Year 1', goal: '5,500 Certified Pros', focus: 'Global Registry Full Launch', metric: '₹45.3L Revenue' }
              ].map((milestone, idx) => (
                <div key={idx} className="bg-white/5 border border-white/10 p-12 rounded-[3.5rem] relative group hover:bg-white/10 transition-all">
                  <span className="text-[#0066FF] font-black text-[10px] uppercase tracking-[0.3em] block mb-4">{milestone.period}</span>
                  <h3 className="text-2xl font-serif font-bold mb-2">{milestone.goal}</h3>
                  <p className="text-slate-400 text-sm font-medium mb-8 leading-relaxed">{milestone.focus}</p>
                  <div className="pt-8 border-t border-white/10 flex items-center justify-between">
                    <span className="text-xl font-bold font-mono">{milestone.metric}</span>
                    <TrendingUp className="w-5 h-5 text-[#0066FF] opacity-50 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Practitioner Registry Search */}
      <section className="max-w-4xl mx-auto px-6 mb-48">
        <div className="bg-white rounded-[4.5rem] p-16 md:p-24 border border-stone-100 shadow-2xl relative overflow-hidden text-center">
           <div className="absolute top-0 left-0 w-full h-2 bg-[#0066FF]"></div>
           <div className="w-20 h-20 bg-blue-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-inner">
             <BadgeCheck className="w-10 h-10 text-[#0066FF]" />
           </div>
           <h2 className="text-4xl font-serif font-bold text-slate-900 mb-6">Verified Registry Search</h2>
           <p className="text-slate-400 text-lg mb-12 font-medium">Any institution can verify MindFlow certified professional via this portal.</p>
           
           <div className="relative max-w-xl mx-auto group">
              <input 
                type="text" 
                placeholder="Search practitioner by name..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-16 pr-40 py-8 bg-stone-50 border-2 border-transparent focus:border-blue-200 focus:bg-white rounded-full font-bold text-slate-800 outline-none transition-all"
              />
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 w-6 h-6 group-focus-within:text-[#0066FF] transition-colors" />
              <button 
                onClick={handleSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-slate-900 text-white px-8 py-5 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all"
              >
                {isSearching ? 'Verifying...' : 'Verify'}
              </button>
           </div>
           
           {searchQuery === progress.studentName && !isSearching && (
             <div className="mt-12 bg-blue-50 p-8 rounded-[3rem] border border-blue-100 flex items-center text-left animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="w-16 h-16 rounded-2xl bg-white border border-blue-100 overflow-hidden mr-6 shadow-sm">
                   <img src={progress.profileImage} alt="Result" />
                </div>
                <div>
                   <h4 className="font-bold text-blue-900 text-lg">{progress.studentName}</h4>
                   <p className="text-blue-700 text-sm font-semibold">Authorized Registered Practitioner • Registry Index {progress.userId}</p>
                </div>
                <div className="ml-auto">
                   <Link to={`/verify/${progress.userId}`} className="flex items-center text-[#0066FF] font-black text-[10px] uppercase tracking-widest hover:underline">
                      Public Profile <ArrowRight className="w-4 h-4 ml-2" />
                   </Link>
                </div>
             </div>
           )}
        </div>
      </section>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-6 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[4.5rem] p-12 max-w-lg w-full shadow-2xl relative border border-white">
            <button onClick={() => setShowPaymentModal(null)} className="absolute top-10 right-10 text-stone-300 hover:text-stone-500 transition-colors">
              <X className="w-8 h-8" />
            </button>
            <div className="text-center mb-10">
              <div className="w-20 h-20 bg-blue-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-blue-50">
                <CreditCard className="w-10 h-10 text-[#0066FF]" />
              </div>
              <h3 className="text-3xl font-serif font-bold text-slate-800 mb-2 tracking-tight">Secure Payment</h3>
              <p className="text-slate-400 font-medium leading-relaxed px-10">Institutional enrollment in {currentModuleToBuy?.title}.</p>
            </div>
            
            <div className="bg-stone-50 rounded-[3.5rem] p-10 mb-10 space-y-8 border border-stone-100">
              <div className="flex justify-around bg-white p-2 rounded-full border border-stone-100">
                <button 
                  onClick={() => setPaymentPlan('full')}
                  className={`flex-grow py-4 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${paymentPlan === 'full' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400'}`}
                >
                  Pay in Full
                </button>
                <button 
                  onClick={() => setPaymentPlan('emi')}
                  className={`flex-grow py-4 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${paymentPlan === 'emi' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400'}`}
                >
                  EMI Plan
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex justify-between items-baseline opacity-30">
                  <span className="text-[10px] font-black uppercase tracking-widest">Market Price</span>
                  <span className="text-lg font-bold line-through">₹{currentModuleToBuy?.price}</span>
                </div>
                <div className="flex justify-between items-baseline text-[#0066FF]">
                  <span className="text-[10px] font-black uppercase tracking-widest flex items-center">
                    <Zap className="w-3 h-3 mr-2" /> Applied Early Bird
                  </span>
                  <span className="text-lg font-black">- ₹{(currentModuleToBuy?.price || 0) - (currentModuleToBuy?.early_bird_price || 0)}</span>
                </div>
                <div className="pt-8 border-t border-stone-200 flex justify-between items-baseline">
                  <span className="text-[11px] font-black uppercase text-slate-400 tracking-[0.2em]">
                    {paymentPlan === 'emi' ? 'EMI (3 Months)' : 'One-time Payment'}
                  </span>
                  <span className="text-5xl font-serif font-bold text-slate-900">
                    ₹{paymentPlan === 'emi' ? Math.ceil(currentModuleToBuy?.early_bird_price! / 3) : currentModuleToBuy?.early_bird_price}
                  </span>
                </div>
              </div>
            </div>

            <button 
              onClick={() => processPayment(showPaymentModal)} 
              className="w-full bg-slate-900 text-white py-8 rounded-full font-black uppercase tracking-[0.3em] text-[11px] shadow-2xl hover:bg-slate-800 transition-all active:scale-95"
            >
              Secure via Razorpay
            </button>
            <div className="mt-10 text-center opacity-20 grayscale flex justify-center space-x-8 items-center">
               <span className="font-serif font-black text-[10px]">RAZORPAY</span>
               <div className="h-4 w-[1px] bg-slate-400"></div>
               <span className="font-serif font-black text-[10px]">ISO 27001</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
