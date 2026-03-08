import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import {
  ArrowLeft, Download, ExternalLink, Database,
  ShieldAlert, Fingerprint, Activity, Layers,
  Wrench, Cpu, Code2, FileText, ClipboardList,
  ChevronRight, Copy, Check, Sparkles, TrendingUp, XCircle
} from 'lucide-react'
import { formatDate, getRiskColor, getRiskBg, getRiskDot, cn } from '../lib/utils'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'

export default function ResultDashboard() {
  const { jobId } = useParams()
  const navigate = useNavigate()
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    async function fetchJob() {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', jobId)
        .single()

      if (!error) setJob(data)
      setLoading(false)
    }
    fetchJob()
  }, [jobId])

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-96 space-y-6 animate-fade-in">
      <div className="relative">
        <div className="w-20 h-20 border-3 border-accent/20 border-t-accent rounded-[2rem] animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Cpu className="text-accent animate-pulse" size={24} />
        </div>
      </div>
      <div className="text-center">
        <p className="text-sm font-black uppercase tracking-[0.3em] text-white mb-1">Synthesizing Intel</p>
        <p className="text-[10px] text-muted font-bold uppercase tracking-widest">Accessing Neural Archive</p>
      </div>
    </div>
  )

  if (!job || !job.result) return (
    <div className="text-center py-32 glass-card border-red-500/10">
      <div className="w-20 h-20 rounded-[2rem] bg-red-400/5 flex items-center justify-center text-red-400 mx-auto mb-8 shadow-inner">
        <ShieldAlert size={40} />
      </div>
      <h2 className="text-2xl font-black text-white tracking-tight">Report Unavailable</h2>
      <p className="text-secondary mt-3 max-w-sm mx-auto font-medium">The specific intelligence signature could not be verified or is yet to be compiled.</p>
      <button
        onClick={() => navigate('/app/completed')}
        className="mt-10 px-8 py-3 rounded-2xl bg-white/5 border border-white/5 text-white font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all active:scale-95"
      >
        Return to Registry
      </button>
    </div>
  )

  const { result } = job
  const summary = result.summary || {}

  const tabs = [
    { id: 'overview', label: 'Analysis Overview', icon: ClipboardList },
    { id: 'schema', label: 'Schema Architecture', icon: Layers },
    { id: 'bias', label: 'Bias Intelligence', icon: ShieldAlert },
    { id: 'quality', label: 'Data Quality', icon: Activity },
    { id: 'strategy', label: 'Neural Strategy', icon: Wrench },
    { id: 'leakage', label: 'Leakage Audit', icon: Fingerprint },
    { id: 'code', label: 'Generated Script', icon: Code2 },
    { id: 'report', label: 'Executive Report', icon: FileText },
  ]

  return (
    <div className="animate-fade-in space-y-12 pb-24">
      {/* Top Controller */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <button
          onClick={() => navigate('/app/completed')}
          className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-muted hover:text-white transition-all group"
        >
          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
          </div>
          Return to Archive
        </button>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/5 text-white font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all shadow-lg">
            <Download size={14} className="text-accent" /> Export Data
          </button>
          <a
            href={job.dataset_url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-accent text-white hover:bg-blue-500 transition-all font-black text-[10px] uppercase tracking-widest shadow-xl shadow-accent/20"
          >
            <ExternalLink size={14} /> Dataset Source
          </a>
        </div>
      </div>

      {/* Hero Analytics */}
      <header className="relative p-10 rounded-[2.5rem] bg-slate-900/40 border border-white/5 overflow-hidden group">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] pointer-events-none group-hover:bg-accent/10 transition-all duration-1000" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-10">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent shadow-inner">
                <TrendingUp size={24} />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-accent">Intel Report // v1.2</span>
                <h1 className="text-5xl font-black text-white tracking-tighter mt-1">{summary.dataset_name || 'Neural Analysis'}</h1>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-8 text-[10px] font-bold uppercase tracking-widest text-muted">
              <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/5 border border-white/5">
                <Database size={14} className="text-accent" /> {job.dataset_url.split('/').pop()}
              </div>
              <div className="flex items-center gap-2.5">
                <Fingerprint size={14} className="text-indigo-400" /> NODE_{job.id.slice(0, 10).toUpperCase()}
              </div>
              <div className="flex items-center gap-2.5">
                <Activity size={14} className="text-emerald-400" /> COMPILED_{formatDate(job.updated_at).toUpperCase()}
              </div>
              {summary.target_variable && (
                <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-accent/20 border border-accent/30 text-accent">
                  <Sparkles size={14} /> TARGET: {summary.target_variable.toUpperCase()}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            {[
              { label: 'Neural Readiness', value: summary.ml_readiness || '0%', icon: Cpu },
              { label: 'Security Risk', value: summary.bias_risk || 'NONE', icon: ShieldAlert, color: getRiskColor(summary.bias_risk) },
            ].map((stat, i) => (
              <div key={i} className="px-8 py-5 rounded-[2rem] bg-white/[0.03] border border-white/5 flex flex-col items-center min-w-[160px]">
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted mb-2">{stat.label}</span>
                <p className={cn("text-2xl font-black tracking-tight", stat.color || "text-white")}>{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Total Vectors', value: summary.total_rows, icon: Layers },
          { label: 'Feature Count', value: summary.total_columns, icon: Database },
          { label: 'Bias Risk', risk: summary.bias_risk },
          { label: 'Leakage Risk', risk: summary.leakage_risk },
          { label: 'Quality Risk', risk: summary.data_quality_risk },
          { label: 'ML Readiness', value: summary.ml_readiness, icon: Sparkles },
        ].map((item, i) => (
          <div key={i} className={cn(
            "glass-card p-6 border flex flex-col justify-between min-h-[140px] group hover:scale-[1.02] transition-transform duration-300",
            item.risk ? cn(getRiskBg(item.risk), "border-white/5") : "bg-white/[0.02] border-white/5"
          )}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-black text-muted uppercase tracking-[0.2em]">{item.label}</span>
              {item.icon ? <item.icon size={16} className="text-muted group-hover:text-accent transition-colors" /> : <div className={cn("w-2 h-2 rounded-full animate-pulse", getRiskDot(item.risk))} />}
            </div>
            <p className={cn("text-2xl font-black truncate", item.risk ? getRiskColor(item.risk) : "text-white")}>
              {item.value || item.risk || '---'}
            </p>
          </div>
        ))}
      </div>

      {/* Main Analysis Container */}
      <div className="space-y-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <div className="flex items-center gap-1 bg-white/[0.02] p-1.5 rounded-2xl border border-white/5 max-w-fit overflow-x-auto no-scrollbar">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2.5 px-6 py-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all rounded-xl relative",
                activeTab === tab.id
                  ? "text-accent bg-accent/10 border border-accent/20 shadow-lg shadow-accent/5"
                  : "text-muted hover:text-white hover:bg-white/5 border border-transparent"
              )}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="min-h-[500px]">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
                <section className="glass-card p-8 border-white/5 bg-slate-900/40 col-span-1 md:col-span-2">
                  <h3 className="text-lg font-black text-white mb-8 flex items-center gap-3 font-jakarta">
                    <Sparkles size={20} className="text-accent" /> Actionable Intelligence
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(Array.isArray(result.recommendations) ? result.recommendations : []).map((rec, i) => (
                      <div key={i} className="flex items-start gap-4 p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-accent/30 transition-all">
                        <div className="w-6 h-6 rounded-lg bg-accent/10 text-accent flex items-center justify-center text-[10px] font-black flex-shrink-0 mt-0.5">
                          {i + 1}
                        </div>
                        <p className="text-slate-300 text-xs font-medium leading-relaxed">{rec}</p>
                      </div>
                    ))}
                  </div>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 col-span-1 md:col-span-2">
                  <section className="glass-card p-8 border-white/5 bg-slate-900/40 relative group overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-accent/10 transition-all" />
                    <h3 className="text-lg font-black text-white mb-8 flex items-center gap-3 relative z-10 font-jakarta">
                      <Cpu size={20} className="text-accent" /> Recommended Architecture
                    </h3>
                    <div className="grid grid-cols-1 gap-3 relative z-10">
                      {(Array.isArray(result.model_compatibility_analysis?.recommended_models) ? result.model_compatibility_analysis.recommended_models : []).map((model, i) => (
                        <div key={i} className="flex items-center gap-4 p-5 rounded-2xl bg-white/[0.02] border border-white/5 group/item hover:border-accent/30 hover:bg-accent/[0.02] transition-all cursor-default">
                          <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center text-[10px] font-black shadow-inner">0{i + 1}</div>
                          <span className="text-white text-sm font-bold tracking-tight">{model}</span>
                          <ChevronRight size={14} className="ml-auto text-muted group-hover/item:text-accent group-hover/item:translate-x-1 transition-all" />
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className="glass-card p-8 border-white/5 bg-slate-900/40">
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-lg font-black text-white flex items-center gap-3 font-jakarta">
                        <Layers size={20} className="text-indigo-400" /> Structure Snapshot
                      </h3>
                      <button onClick={() => setActiveTab('schema')} className="text-[10px] font-black text-accent uppercase tracking-widest hover:underline">Full Schema</button>
                    </div>
                    <div className="space-y-1">
                      {Object.entries(result.schema_analysis?.column_schema || {}).slice(0, 8).map(([col, info]) => (
                        <div key={col} className="flex items-center justify-between py-3 border-b border-white/[0.03] group hover:bg-white/[0.01] transition-colors rounded-lg px-2">
                          <span className="text-slate-300 text-sm font-bold font-mono tracking-tight">{col}</span>
                          <span className="text-[9px] font-black text-muted bg-white/5 px-2.5 py-1 rounded-lg uppercase tracking-widest">{info.type}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              </div>
            )}

          {activeTab === 'schema' && (
            <div className="glass-card overflow-hidden animate-fade-in border-white/5">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-white/[0.03]">
                      <th className="px-8 py-5 text-[10px] font-black text-muted uppercase tracking-[0.2em]">Attribute Signature</th>
                      <th className="px-8 py-5 text-[10px] font-black text-muted uppercase tracking-[0.2em]">Data Type</th>
                      <th className="px-8 py-5 text-[10px] font-black text-muted uppercase tracking-[0.2em]">Completeness Density</th>
                      <th className="px-8 py-5 text-[10px] font-black text-muted uppercase tracking-[0.2em]">Entropy // Uniqueness</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.03]">
                    {Object.entries(result.schema_analysis?.column_schema || {}).map(([col, info]) => (
                      <tr key={col} className="hover:bg-accent/[0.01] group transition-colors">
                        <td className="px-8 py-5 text-sm font-black text-white group-hover:text-accent transition-colors">
                          <div className="flex items-center gap-3">
                            <Database size={14} className="text-muted" /> {col}
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <span className="text-[9px] font-black bg-accent/5 text-accent px-2.5 py-1.5 rounded-lg uppercase tracking-widest border border-accent/10">{info.type}</span>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-4">
                            <div className="w-32 h-1.5 bg-white/5 rounded-full overflow-hidden shadow-inner">
                              <div className={cn("h-full transition-all duration-1000", info.missing_values_percent > 20 ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]" : "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]")} style={{ width: `${100 - info.missing_values_percent}%` }} />
                            </div>
                            <span className="text-xs font-bold text-slate-400">{100 - info.missing_values_percent}%</span>
                          </div>
                        </td>
                        <td className="px-8 py-5 text-sm text-slate-500 font-mono tracking-tighter italic">{info.unique_values} distinct vectors</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'code' && (
            <div className="animate-fade-in space-y-6">
              <div className="flex items-center justify-between p-6 rounded-[2rem] bg-slate-900/40 border border-white/5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-accent/10 text-accent flex items-center justify-center">
                    <Code2 size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white tracking-tight">Deployment Script</h3>
                    <p className="text-[10px] font-bold text-muted uppercase tracking-[0.2em]">Standardized Python Runtime</p>
                  </div>
                </div>
                <button
                  onClick={() => copyToClipboard(result.pipeline_code)}
                  className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-white/5 text-[10px] font-black text-white uppercase tracking-widest hover:bg-white/10 hover:border-white/20 border border-white/5 transition-all shadow-xl active:scale-95"
                >
                  {copied ? <><Check size={16} className="text-emerald-400" /> Sequence Captured</> : <><Copy size={16} /> Copy Protocol</>}
                </button>
              </div>
              <div className="rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl relative group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent to-indigo-600 opacity-50" />
                <SyntaxHighlighter
                  language="python"
                  style={atomDark}
                  customStyle={{
                    margin: 0,
                    padding: '3rem',
                    fontSize: '0.9rem',
                    lineHeight: '1.6',
                    background: '#070b14',
                    fontFamily: '"JetBrains Mono", monospace',
                    fontWeight: '500'
                  }}
                  showLineNumbers
                  lineNumberStyle={{ color: '#2a3a5a', paddingRight: '2rem' }}
                >
                  {result.pipeline_code || '# Intelligence protocol compilation failed.'}
                </SyntaxHighlighter>
              </div>
            </div>
          )}

          {activeTab === 'report' && (
            <div className="glass-card p-10 md:p-16 animate-fade-in overflow-hidden border-white/5 bg-slate-900/40 relative">
              <div className="absolute top-0 right-0 p-8 h-full pointer-events-none opacity-[0.03]">
                <FileText size={400} className="text-white" />
              </div>
              <div className="markdown-body max-w-4xl mx-auto relative z-10">
                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                  {result.human_report || '# Executive summary acquisition failed.'}
                </ReactMarkdown>
              </div>
            </div>
          )}

          {activeTab === 'bias' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
              <section className="glass-card p-8 border-white/5 bg-slate-900/40">
                <h3 className="text-lg font-black text-white mb-8 flex items-center gap-3 font-jakarta">
                  <Activity size={20} className="text-accent" /> Class Imbalance Audit
                </h3>
                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                  <p className="text-sm font-medium text-slate-300 leading-relaxed mb-4">{result.bias_analysis?.class_imbalance}</p>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 bg-accent/20 rounded-full flex-1 overflow-hidden">
                      <div className="h-full bg-accent" style={{ width: '40%' }} />
                    </div>
                    <span className="text-[10px] font-black text-muted uppercase">Distribution Verified</span>
                  </div>
                </div>
              </section>

              <section className="glass-card p-8 border-red-500/10 bg-red-500/[0.01]">
                <h3 className="text-lg font-black text-white mb-8 flex items-center gap-3 font-jakarta">
                  <ShieldAlert size={20} className="text-red-400" /> High-Risk Identities
                </h3>
                <div className="space-y-3">
                  {(Array.isArray(result.bias_analysis?.high_risk_groups) ? result.bias_analysis.high_risk_groups : []).map((group, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-red-400/5 border border-red-400/10 text-red-400">
                      <XCircle size={14} />
                      <span className="text-xs font-bold leading-tight uppercase tracking-wide">{group}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="glass-card p-8 border-white/5 bg-slate-900/40 col-span-1 md:col-span-2">
                <h3 className="text-lg font-black text-white mb-8 flex items-center gap-3 font-jakarta">
                  <Fingerprint size={20} className="text-indigo-400" /> Protected Feature Set
                </h3>
                <div className="flex flex-wrap gap-3">
                  {(Array.isArray(result.bias_analysis?.sensitive_attributes) ? result.bias_analysis.sensitive_attributes : []).map((attr, i) => (
                    <div key={i} className="px-5 py-3 rounded-xl bg-white/[0.03] border border-white/5 text-slate-300 text-[10px] font-black uppercase tracking-widest">
                      {attr}
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {activeTab === 'quality' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in">
              <section className="glass-card p-8 border-white/5 bg-slate-900/40">
                <h3 className="text-lg font-black text-white mb-8 flex items-center gap-3 font-jakarta">
                  <TrendingUp size={20} className="text-emerald-400" /> Outlier Detection
                </h3>
                <div className="space-y-4">
                  {Object.entries(result.data_quality_analysis?.outliers || {}).map(([col, desc], i) => (
                    <div key={i} className="p-5 rounded-2xl bg-white/[0.02] border border-white/5">
                      <span className="text-[10px] font-black text-accent uppercase tracking-widest mb-2 block">{col}</span>
                      <p className="text-xs text-slate-400 font-medium">{desc}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="glass-card p-8 border-white/5 bg-slate-900/40">
                <h3 className="text-lg font-black text-white mb-8 flex items-center gap-3 font-jakarta">
                  <Activity size={20} className="text-orange-400" /> Distribution Skewness
                </h3>
                <div className="space-y-4">
                  {Object.entries(result.data_quality_analysis?.skewness || {}).map(([col, desc], i) => (
                    <div key={i} className="p-5 rounded-2xl bg-white/[0.02] border border-white/5">
                      <span className="text-[10px] font-black text-orange-400 uppercase tracking-widest mb-2 block">{col}</span>
                      <p className="text-xs text-slate-400 font-medium">{desc}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="glass-card p-8 border-white/5 bg-slate-900/40">
                <h3 className="text-lg font-black text-white mb-8 flex items-center gap-3 font-jakarta">
                  <Layers size={20} className="text-blue-400" /> Information Density
                </h3>
                <div className="space-y-4">
                  {Object.entries(result.data_quality_analysis?.missing_values || {}).map(([col, percent], i) => (
                    <div key={i} className="flex justify-between items-center p-5 rounded-2xl bg-white/[0.02] border border-white/5">
                      <span className="text-xs font-bold text-white font-mono">{col}</span>
                      <span className="text-[10px] font-black text-red-400 bg-red-400/5 px-3 py-1.5 rounded-lg border border-red-400/10">{percent} Missing</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {activeTab === 'strategy' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
              <section className="glass-card p-8 border-white/5 bg-slate-900/40">
                <h3 className="text-lg font-black text-white mb-8 flex items-center gap-3 font-jakarta">
                  <Cpu size={20} className="text-accent" /> Feature Readiness
                </h3>
                <div className="space-y-6">
                  {result.feature_readiness_analysis && Object.entries(result.feature_readiness_analysis).map(([key, val], i) => (
                    <div key={i} className="flex flex-col gap-2 p-5 rounded-2xl bg-white/[0.02] border border-white/5">
                      <span className="text-[10px] font-black text-muted uppercase tracking-widest">{key.replace('_', ' ')}</span>
                      <p className="text-sm font-bold text-white leading-relaxed">{val}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="glass-card p-8 border-white/5 bg-slate-900/40">
                <h3 className="text-lg font-black text-white mb-8 flex items-center gap-3 font-jakarta">
                  <Wrench size={20} className="text-indigo-400" /> Preprocessing Strategy
                </h3>
                <div className="space-y-6">
                  {result.preprocessing_plan && Object.entries(result.preprocessing_plan).map(([key, val], i) => (
                    <div key={i} className="flex flex-col gap-2 p-5 rounded-2xl bg-white/[0.02] border border-white/5">
                      <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{key.replace('_', ' ')}</span>
                      <p className="text-sm font-medium text-slate-300 leading-relaxed italic">"{val}"</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {activeTab === 'leakage' && (
            <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
              <section className="glass-card p-10 border-red-500/10 bg-red-500/[0.01]">
                <h3 className="text-xl font-black text-white mb-4 flex items-center gap-3 font-jakarta">
                  <ShieldAlert size={24} className="text-red-400" /> Target Leakage Detected
                </h3>
                <p className="text-slate-400 font-medium mb-10 leading-relaxed">{result.leakage_analysis?.recommendations}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(Array.isArray(result.leakage_analysis?.high_risk_columns) ? result.leakage_analysis.high_risk_columns : []).map((col, i) => (
                    <div key={i} className="flex items-center gap-4 p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                      <div className="w-10 h-10 rounded-xl bg-red-400/10 flex items-center justify-center text-red-400">
                        <Fingerprint size={20} />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] font-black text-red-500 uppercase tracking-widest block mb-1">High Risk Feature</span>
                        <p className="text-lg font-bold text-white truncate font-mono">{col}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
