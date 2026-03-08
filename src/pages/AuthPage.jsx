import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BrainCircuit, ArrowLeft, Sparkles } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function AuthPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { signInWithGoogle } = useAuth()
  const navigate = useNavigate()

  async function handleGoogleLogin() {
    setLoading(true)
    setError(null)
    try {
      await signInWithGoogle()
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center py-12 px-4 bg-base relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#3b82f610,transparent_60%)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b11_1px,transparent_1px),linear-gradient(to_bottom,#1e293b11_1px,transparent_1px)] bg-[size:60px_60px] opacity-40"></div>
      </div>
      
      <div className="max-w-md w-full relative z-10 animate-fade-in">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-sm font-semibold text-secondary hover:text-white transition-all mb-8 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Intelligence Home
        </button>

        <div className="glass-card p-10 shadow-2xl relative overflow-hidden border-white/5 bg-slate-900/40">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-40" />
          
          <div className="text-center mb-10">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-500/20 animate-float">
              <BrainCircuit size={32} className="text-white" />
            </div>
            <h2 className="text-3xl font-black text-white tracking-tight mb-2">Welcome Back</h2>
            <p className="text-sm text-secondary font-medium">Connect with Google to access your agent swarm.</p>
          </div>

          <div className="space-y-6">
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 hover:border-white/20 transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
              )}
              Continue with Google Account
            </button>

            {error && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold text-center">
                Authentication Error: {error}
              </div>
            )}
          </div>

          <div className="mt-10 pt-6 border-t border-white/5 text-center">
            <p className="text-[10px] text-muted font-bold uppercase tracking-wider flex items-center justify-center gap-1.5">
              <Sparkles size={10} className="text-blue-500" /> Secure Multi-Agent Auth
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
