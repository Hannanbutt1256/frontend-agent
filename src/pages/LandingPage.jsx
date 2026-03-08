import { useNavigate } from 'react-router-dom'
import { BrainCircuit, ArrowRight, ShieldCheck, Zap, Database, Cpu, Search, Sparkles } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function LandingPage() {
  const navigate = useNavigate()
  const { user } = useAuth()

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col bg-base selection:bg-blue-500/30">
      {/* Premium Background: Grid + Blobs */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-50 contrast-150 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,#3b82f615,transparent_50%)]"></div>
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-600/5 rounded-full blur-[120px] animate-pulse-glow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-600/5 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: '2s' }}></div>
        
        {/* Subtle grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b11_1px,transparent_1px),linear-gradient(to_bottom,#1e293b11_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      </div>

      {/* Navigation */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-8 flex items-center justify-between animate-fade-in">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group hover:scale-105 transition-transform">
            <BrainCircuit size={22} className="text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white font-sans">AgentFlow</span>
        </div>
        
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex items-center gap-8 mr-4">
            {['Features', 'Intelligence', 'Security'].map((item) => (
              <a key={item} href="#" className="text-sm font-medium text-secondary hover:text-white transition-colors capitalize">{item}</a>
            ))}
          </nav>
          <button
            onClick={() => navigate(user ? '/app/upload' : '/auth')}
            className="px-6 py-2.5 rounded-full font-bold text-sm bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20 transition-all active:scale-95 shadow-xl"
          >
            {user ? 'Dashboard' : 'Sign In'}
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pt-16 pb-32 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-widest mb-8 animate-slide-up shadow-sm">
          <Sparkles size={12} className="animate-pulse" /> The Next Generation of Data Auditing
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-8 animate-slide-up leading-[1.05] [text-wrap:balance]">
          Intelligence at the <span className="gradient-text">Speed of Swarms</span>
        </h1>
        
        <p className="text-lg md:text-xl text-secondary mb-12 max-w-3xl leading-relaxed animate-fade-in [text-wrap:balance]" style={{ animationDelay: '0.2s' }}>
          Deploy specialized AI agents to analyze, audit, and optimize your data infrastructure. 
          Generate production-ready pipelines with cryptographic precision.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <button
            onClick={() => navigate(user ? '/app/upload' : '/auth')}
            className="group px-8 py-5 rounded-2xl bg-blue-600 text-white font-extrabold text-lg shadow-2xl shadow-blue-500/20 hover:bg-blue-500 transition-all hover:-translate-y-1 active:translate-y-0.5 flex items-center gap-3"
          >
            Start Analyzing Data <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button className="px-8 py-5 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-lg hover:bg-white/10 transition-all">
            Documentation
          </button>
        </div>

        {/* Dynamic Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-32 w-full animate-fade-in" style={{ animationDelay: '0.6s' }}>
          {[
            { 
              icon: Database, 
              title: 'Automated Insight', 
              desc: 'Seamlessly ingest complex datasets via direct upload or authenticated API endpoints.',
              color: 'text-blue-400', bg: 'bg-blue-400/10'
            },
            { 
              icon: Cpu, 
              title: 'Neural Pipelines', 
              desc: 'Specialized agents generate high-performance ML code tailored to your data schema.',
              color: 'text-indigo-400', bg: 'bg-indigo-400/10'
            },
            { 
              icon: ShieldCheck, 
              title: 'Bias Audit', 
              desc: 'Detect and mitigate hidden biases and leakage before they reach your models.',
              color: 'text-emerald-400', bg: 'bg-emerald-400/10'
            },
          ].map((feat, i) => (
            <div key={i} className="glass-card p-10 text-left group hover:border-blue-500/30 transition-all duration-500 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/5 to-transparent rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
              <div className={`w-14 h-14 rounded-2xl ${feat.bg} ${feat.color} flex items-center justify-center mb-8 shadow-inner`}>
                <feat.icon size={26} />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">{feat.title}</h3>
              <p className="text-secondary text-sm leading-relaxed mb-6">{feat.desc}</p>
              <div className="flex items-center gap-2 text-xs font-bold text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
                Learn more <ArrowRight size={14} />
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="relative z-10 py-16 px-6 border-t border-white/5 bg-black/20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3 opacity-50">
            <BrainCircuit size={20} className="text-blue-500" />
            <span className="text-sm font-bold text-white tracking-widest uppercase">AgentFlow</span>
          </div>
          <p className="text-xs text-muted font-medium">© 2026 AgentFlow Intelligence. All neural networks reserved.</p>
          <div className="flex items-center gap-6">
            {['Twitter', 'GitHub', 'Discord'].map(s => <a key={s} href="#" className="text-xs font-bold text-muted hover:text-white transition-colors">{s}</a>)}
          </div>
        </div>
      </footer>
    </div>
  )
}
