import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { Activity, Clock, Database, Loader2 } from 'lucide-react'
import { formatDate } from '../lib/utils'

export default function RunningAgents() {
  const { user } = useAuth()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    async function fetchJobs() {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'running')
        .order('created_at', { ascending: false })
      
      if (!error) setJobs(data)
      setLoading(false)
    }

    fetchJobs()

    // Real-time subscription
    const channel = supabase
      .channel('running_jobs')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'jobs',
        filter: `user_id=eq.${user.id}`
      }, (payload) => {
        if (payload.new.status === 'running') {
          setJobs(prev => {
            const exists = prev.find(j => j.id === payload.new.id)
            if (exists) return prev.map(j => j.id === payload.new.id ? payload.new : j)
            return [payload.new, ...prev]
          })
        } else {
          setJobs(prev => prev.filter(j => j.id !== payload.new.id))
        }
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user])

  if (loading) return <div className="flex animate-fade-in"><Loader2 className="animate-spin text-blue-500 mr-2" /> Loading...</div>

  return (
    <div className="animate-slide-up">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold text-white mb-2">Running Agents</h1>
        <p className="text-slate-400">View real-time progress of active analysis swarms.</p>
      </header>

      {jobs.length === 0 ? (
        <div className="glass-card p-20 text-center flex flex-col items-center border-dashed">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-slate-600 mb-4">
            <Activity size={32} />
          </div>
          <p className="text-slate-500 font-medium">No agents are currently running.</p>
          <p className="text-sm text-slate-600 mt-1">Start a new job in the Upload tab.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.map(job => (
            <div key={job.id} className="glass-card p-6 border-blue-500/20 shadow-lg relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-3">
                <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-bold uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                  Running
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 flex-shrink-0">
                  <Database size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-bold truncate mb-1" title={job.dataset_url}>
                    {job.dataset_url.split('/').pop() || 'Dataset'}
                  </h3>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 text-slate-500 text-xs text-nowrap">
                      <Clock size={12} /> Started {formatDate(job.created_at)}
                    </div>
                    {job.target_column && (
                      <div className="text-[10px] text-slate-600 bg-white/5 self-start px-1.5 py-0.5 rounded border border-white/5 mt-1">
                        Target: {job.target_column}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="mt-6 space-y-2">
                <div className="flex items-center justify-between text-[10px] font-semibold text-slate-500 uppercase">
                  <span>Agent Swarm Status</span>
                  <span className="text-blue-400 animate-pulse">Analysis in progress...</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full animate-progress-indefinite" style={{ width: '40%' }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
