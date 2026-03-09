import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { CheckCircle2, Search, FileBarChart, ArrowRight, Database, ExternalLink, Filter, Clock, Sparkles } from 'lucide-react'
import { formatDate } from '../lib/utils'
import { useNavigate } from 'react-router-dom'
import { cn } from '../lib/utils'

export default function CompletedAgents() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (!user) return
    async function fetchJobs() {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'completed')
        .order('updated_at', { ascending: false })
      
      if (!error) setJobs(data)
      setLoading(false)
    }
    fetchJobs()
  }, [user])

  const filteredJobs = jobs.filter(j => 
    j.dataset_url.toLowerCase().includes(search.toLowerCase()) ||
    j.target_column?.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return (
    <div className="flex h-64 items-center justify-center animate-fade-in">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-emerald-400/10 flex items-center justify-center">
          <CheckCircle2 className="text-emerald-400" size={24} />
        </div>
        <p className="text-xs font-black uppercase tracking-[0.2em] text-muted">Indexing Knowledge Base</p>
      </div>
    </div>
  )

  return (
    <div className="animate-slide-up">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-12">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={16} className="text-emerald-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">Archived Intelligence</span>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight mb-3">Completed Jobs</h1>
          <p className="text-secondary max-w-xl text-lg font-medium">Historical analysis reports, statistical audits, and generated machine learning pipelines.</p>
        </div>
        
        <div className="relative group max-w-sm w-full">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-emerald-400 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search knowledge base..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900/40 border border-white/5 rounded-2xl py-4 pl-14 pr-4 text-white font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/30 transition-all placeholder:text-slate-600"
          />
        </div>
      </header>

      {filteredJobs.length === 0 ? (
        <div className="glass-card p-24 text-center flex flex-col items-center border-dashed border-white/5 opacity-80">
          <div className="w-20 h-20 rounded-[2rem] bg-white/[0.03] flex items-center justify-center text-slate-700 mb-8 shadow-inner">
            <FileBarChart size={40} strokeWidth={1.5} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Archive satisfies no queries</h3>
          <p className="text-secondary font-medium">Historical data will manifest here upon successful agent completion.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredJobs.map(job => (
            <div 
              key={job.id} 
              onClick={() => navigate(`/app/result/${job.id}`)}
              className="glass-card p-6 group flex flex-col md:flex-row md:items-center justify-between gap-6 cursor-pointer border-white/5 hover:border-emerald-500/20 hover:bg-emerald-500/[0.02] hover:translate-x-1 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/[0.03] to-transparent rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
              
              <div className="flex items-center gap-6 flex-1 min-w-0 relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-inner">
                  <CheckCircle2 size={28} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-4 mb-2">
                    <h3 className="text-xl font-black text-white truncate group-hover:text-emerald-400 transition-colors" title={job.dataset_url}>
                      {job.result.summary.dataset_name || 'Dataset'}
                    </h3>
                    {job.result?.summary?.ml_readiness ? (
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full border border-emerald-500/20">
                        {job.result.summary.ml_readiness}
                      </span>
                    ) : (
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-white/5 text-muted px-3 py-1 rounded-full border border-white/5">Compiled</span>
                    )}
                  </div>
                  <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-muted">
                    <span className="flex items-center gap-2"><Database size={12} className="opacity-60" /> {job.target_column || 'General Audit'}</span>
                    <span className="flex items-center gap-2"><Clock size={12} className="opacity-60" /> {formatDate(job.updated_at)}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6 pl-20 md:pl-0 relative z-10">
                <div className="text-right hidden lg:block">
                  <p className="text-[10px] text-muted font-black uppercase tracking-widest mb-1">Intelligence ID</p>
                  <p className="text-xs text-white/30 font-mono tracking-tighter">{job.id.slice(0, 12)}</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-muted group-hover:bg-emerald-500 group-hover:text-white group-hover:border-emerald-400 transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                  <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

