import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { AlertCircle, RotateCcw, Database, XCircle, Clock, CheckCircle2, Sparkles } from 'lucide-react'
import { formatDate } from '../lib/utils'
import { submitJobToBackend, updateJobStatus } from '../lib/api'
import { cn } from '../lib/utils'

export default function FailedAgents() {
  const { user } = useAuth()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [retryingIds, setRetryingIds] = useState(new Set())

  const fetchJobs = async () => {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'failed')
      .order('updated_at', { ascending: false })
    
    if (!error) setJobs(data)
    setLoading(false)
  }

  useEffect(() => {
    if (user) fetchJobs()
  }, [user])

  const handleRetry = async (job) => {
    setRetryingIds(prev => new Set(prev).add(job.id))
    try {
      await updateJobStatus(job.id, { status: 'running', error_message: null })
      const result = await submitJobToBackend({
        jobId: job.id,
        datasetUrl: job.dataset_url,
        targetColumn: job.target_column
      })

      // Update Supabase with the result
      await updateJobStatus(job.id, { 
        status: 'completed', 
        result: result
      })

      setJobs(prev => prev.filter(j => j.id !== job.id))
      // Redirect to completed page
      window.location.href = '/app/completed'
    } catch (err) {
      console.error(err)
      fetchJobs()
    } finally {
      setRetryingIds(prev => {
        const next = new Set(prev)
        next.delete(job.id)
        return next
      })
    }
  }

  if (loading) return (
    <div className="flex h-64 items-center justify-center animate-fade-in">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-red-400/10 flex items-center justify-center">
          <AlertCircle className="text-red-400" size={24} />
        </div>
        <p className="text-xs font-black uppercase tracking-[0.2em] text-muted">Retrieving Anomalies</p>
      </div>
    </div>
  )

  return (
    <div className="animate-slide-up">
      <header className="mb-12">
        <div className="flex items-center gap-2 mb-3">
          <AlertCircle size={16} className="text-red-400" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-red-400">Error Node List</span>
        </div>
        <h1 className="text-4xl font-black text-white tracking-tight mb-3">Failed Agents</h1>
        <p className="text-secondary max-w-xl text-lg font-medium">Review autonomous swarms that encountered logical barriers and re-deploy updated instructions.</p>
      </header>

      {jobs.length === 0 ? (
        <div className="glass-card p-24 text-center flex flex-col items-center border-dashed border-white/5 opacity-80">
          <div className="w-20 h-20 rounded-[2rem] bg-emerald-500/5 flex items-center justify-center text-emerald-500/30 mb-8 shadow-inner">
            <CheckCircle2 size={40} strokeWidth={1.5} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No failures detected</h3>
          <p className="text-secondary font-medium">Your agent network is operating at peak efficiency.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {jobs.map(job => (
            <div key={job.id} className="glass-card p-8 border-red-500/10 shadow-2xl relative overflow-hidden group hover:border-red-500/30 transition-all duration-500">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-500/5 to-transparent rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
                <div className="flex items-start gap-6 flex-1 min-w-0">
                  <div className="w-14 h-14 rounded-2xl bg-red-500/10 text-red-400 flex items-center justify-center flex-shrink-0 shadow-inner group-hover:scale-110 transition-transform mt-1">
                    <XCircle size={28} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-black text-white truncate max-w-md group-hover:text-red-400 transition-colors" title={job.dataset_url}>
                        {job.dataset_url.split('/').pop() || 'Dataset'}
                      </h3>
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-red-500/10 text-red-500 px-3 py-1 rounded-full border border-red-500/20">Failure</span>
                    </div>
                    
                    <div className="bg-red-950/20 border border-red-900/20 p-4 rounded-xl mb-4 relative overflow-hidden">
                       <div className="absolute top-0 left-0 w-1 h-full bg-red-500/40" />
                       <code className="text-xs text-red-300/80 font-mono leading-relaxed block italic">
                         Exception: {job.error_message || 'Unspecified runtime exception in swarm coordination layer.'}
                       </code>
                    </div>

                    <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted">
                      <span className="flex items-center gap-2"><Database size={12} className="opacity-60" /> {job.target_column || 'No Target'}</span>
                      <span className="flex items-center gap-2"><Clock size={12} className="opacity-60" /> {formatDate(job.updated_at)}</span>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => handleRetry(job)}
                  disabled={retryingIds.has(job.id)}
                  className="flex items-center justify-center gap-2 px-8 py-5 rounded-2xl bg-white/5 text-white font-black text-xs uppercase tracking-widest hover:bg-white/10 hover:border-white/20 border border-white/5 transition-all shadow-xl active:scale-95 disabled:opacity-50"
                >
                  {retryingIds.has(job.id) ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <RotateCcw size={16} />
                  )}
                  Retry Deployment
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

