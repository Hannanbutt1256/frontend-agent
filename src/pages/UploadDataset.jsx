import { useState, useRef } from 'react'
import { UploadCloud, Link as LinkIcon, Database, ArrowRight, X, FileText, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { uploadDatasetFile, createJob, submitJobToBackend, updateJobStatus } from '../lib/api'
import { useNavigate } from 'react-router-dom'
import { cn } from '../lib/utils'

export default function UploadDataset() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [method, setMethod] = useState('upload') // 'upload' | 'url'
  const [file, setFile] = useState(null)
  const [url, setUrl] = useState('')
  const [targetColumn, setTargetColumn] = useState('')
  const [status, setStatus] = useState('idle') // 'idle' | 'uploading' | 'submitting' | 'success' | 'error'
  const [error, setError] = useState(null)

  const fileInputRef = useRef(null)

  const handleFileChange = (e) => {
    const selected = e.target.files[0]
    if (selected) {
      if (!selected.name.match(/\.(csv|xlsx|xls)$/)) {
        setError('Only CSV, XLSX, and XLS files are supported.')
        return
      }
      setFile(selected)
      setError(null)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const dropped = e.dataTransfer.files[0]
    if (dropped) {
      if (!dropped.name.match(/\.(csv|xlsx|xls)$/)) {
        setError('Only CSV, XLSX, and XLS files are supported.')
        return
      }
      setFile(dropped)
      setError(null)
    }
  }

  const handleStartAgent = async () => {
    if (method === 'upload' && !file) {
      setError('Please select a file to upload.')
      return
    }
    if (method === 'url' && !url) {
      setError('Please provide a dataset URL.')
      return
    }

    setStatus('uploading')
    setError(null)

    try {
      let datasetUrl = url

      if (method === 'upload') {
        datasetUrl = await uploadDatasetFile(file, user.id)
      }

      setStatus('submitting')

      const job = await createJob({
        userId: user.id,
        datasetUrl,
        targetColumn: targetColumn.trim() || null
      })

      try {
        const result = await submitJobToBackend({
          jobId: job.id,
          datasetUrl,
          targetColumn: targetColumn.trim() || null
        })

        setStatus('success')
        setTimeout(() => navigate('/app/completed'), 1500)
      } catch (submitErr) {
        console.error(submitErr)
        await updateJobStatus(job.id, {
          status: 'failed',
          error_message: submitErr.message
        })
        throw submitErr
      }

    } catch (err) {
      console.error(err)
      setError(err.message || 'An unexpected error occurred.')
      setStatus('error')
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <header className="mb-12 animate-fade-in">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={16} className="text-accent" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">Initiation Node</span>
        </div>
        <h1 className="text-4xl font-black text-white tracking-tight mb-3">Upload Dataset</h1>
        <p className="text-secondary max-w-xl text-lg font-medium">Provision a new multi-agent analysis job by uploading your data infrastructure or providing an endpoint.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="space-y-8 animate-slide-up">
          {/* Step 1: Source */}
          <section className="glass-card p-8 border-white/5 bg-slate-900/40">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 rounded-lg bg-accent/10 text-accent flex items-center justify-center font-bold text-xs">01</div>
              <h2 className="text-lg font-bold text-white">Select Ingestion Method</h2>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-8">
              {[
                { id: 'upload', label: 'File Upload', icon: UploadCloud },
                { id: 'url', label: 'Endpoint URL', icon: LinkIcon }
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => { setMethod(m.id); setError(null); }}
                  className={cn(
                    "p-4 rounded-xl border flex flex-col items-center gap-3 transition-all duration-300 relative overflow-hidden group",
                    method === m.id
                      ? "bg-accent/10 border-accent/50 text-accent ring-2 ring-accent/5 shadow-lg shadow-accent/5"
                      : "bg-white/[0.03] border-white/5 text-muted hover:bg-white/[0.06] hover:text-white"
                  )}
                >
                  <m.icon size={22} className={cn("transition-transform group-hover:scale-110", method === m.id ? "text-accent" : "text-slate-500")} />
                  <span className="text-xs font-bold uppercase tracking-wider">{m.label}</span>
                </button>
              ))}
            </div>

            {method === 'upload' ? (
              <div
                onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('border-accent', 'bg-accent/5'); }}
                onDragLeave={(e) => { e.currentTarget.classList.remove('border-accent', 'bg-accent/5'); }}
                onDrop={(e) => { handleDrop(e); e.currentTarget.classList.remove('border-accent', 'bg-accent/5'); }}
                onClick={() => fileInputRef.current.click()}
                className="group border-2 border-dashed border-white/10 rounded-2xl p-10 text-center cursor-pointer hover:border-accent/40 hover:bg-accent/10 transition-all active:scale-[0.98]"
              >
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".csv,.xlsx,.xls" />
                {file ? (
                  <div className="flex flex-col items-center animate-fade-in">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4 shadow-inner">
                      <FileText size={32} />
                    </div>
                    <p className="text-white font-bold mb-1 truncate max-w-[200px]">{file.name}</p>
                    <p className="text-[10px] text-muted font-black uppercase tracking-widest">{(file.size / 1024).toFixed(1)} KB • Verified</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 text-slate-500 flex items-center justify-center mb-5 group-hover:scale-110 transition-all group-hover:bg-accent/10 group-hover:text-accent">
                      <UploadCloud size={28} />
                    </div>
                    <p className="text-white font-bold mb-2">Drop local data</p>
                    <p className="text-[10px] text-muted font-bold uppercase tracking-widest leading-loose">CSV • XLSX • XLS (MAX 50MB)</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2 animate-fade-in group">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted ml-1 mb-2 block">Direct Access Endpoint</label>
                <div className="relative">
                  <LinkIcon size={16} className="absolute inset-y-0 left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-accent transition-colors" />
                  <input
                    type="url"
                    placeholder="https://cloud.storage/dataset.csv"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full bg-white/5 border border-white/5 rounded-xl py-4 pl-12 pr-4 text-white font-medium focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/30 transition-all placeholder:text-slate-600"
                  />
                </div>
              </div>
            )}
          </section>

          {/* Step 2: Config */}
          <section className="glass-card p-8 border-white/5 bg-slate-900/40">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold text-xs">02</div>
              <h2 className="text-lg font-bold text-white">Agent Directives</h2>
            </div>

            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted ml-1">Predictive Target <span className="lowercase font-medium opacity-50">(optional)</span></label>
                  <AlertCircle size={14} className="text-slate-700 cursor-help" />
                </div>
                <div className="relative group">
                  <Database size={16} className="absolute inset-y-0 left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-indigo-400 transition-colors" />
                  <input
                    type="text"
                    placeholder="e.g. churn_risk, purchase_value"
                    value={targetColumn}
                    onChange={(e) => setTargetColumn(e.target.value)}
                    className="w-full bg-white/5 border border-white/5 rounded-xl py-4 pl-12 pr-4 text-white font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/30 transition-all placeholder:text-slate-600"
                  />
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Action Panel */}
        <div className="sticky top-10 space-y-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="glass-card p-8 border-accent/20 bg-accent/5 overflow-hidden relative">
            <div className="absolute top-[-20%] right-[-20%] w-48 h-48 bg-accent/10 rounded-full blur-[60px]" />

            <h3 className="text-white font-black mb-4 flex items-center gap-2">
              <Sparkles size={18} className="text-accent" /> Ready for Analysis
            </h3>
            <p className="text-sm text-secondary mb-8 leading-relaxed">
              Our sworn intelligence agents will perform a multi-layered audit including bias detection, leakage verification, and ML readiness scoring.
            </p>

            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3 animate-shake">
                <X size={18} className="text-red-400 mt-0.5" />
                <p className="text-xs font-bold text-red-400 leading-normal">{error}</p>
              </div>
            )}

            {status === 'success' ? (
              <div className="p-5 rounded-2xl bg-emerald-500 border border-emerald-400 text-white flex flex-col items-center gap-3 animate-fade-in shadow-xl shadow-emerald-500/20">
                <CheckCircle2 size={32} />
                <p className="font-black uppercase tracking-widest text-xs">Initialization Successful</p>
              </div>
            ) : (
              <button
                onClick={handleStartAgent}
                disabled={status !== 'idle' && status !== 'error'}
                className="w-full group relative flex items-center justify-center gap-4 px-8 py-5 rounded-2xl bg-accent text-white font-black text-lg shadow-2xl shadow-accent/20 hover:bg-blue-500 transition-all hover:-translate-y-1 active:translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none"
              >
                {status === 'idle' || status === 'error' ? (
                  <>
                    Deploy Swarm <ArrowRight size={22} className="transition-transform group-hover:translate-x-1" />
                  </>
                ) : (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span className="text-sm uppercase tracking-widest font-black">
                      {status === 'uploading' ? 'Ingesting Data' : 'Calibrating Agents'}
                    </span>
                  </>
                )}
              </button>
            )}
          </div>

          <div className="px-4">
            <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted">
              <div className="h-px bg-white/5 flex-1" />
              Intelligence Node: v1.0.4
              <div className="h-px bg-white/5 flex-1" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
