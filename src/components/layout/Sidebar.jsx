import { NavLink, useNavigate } from 'react-router-dom'
import {
  UploadCloud, Activity, XCircle, CheckCircle2,
  BrainCircuit, LogOut, ChevronRight
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { cn } from '../../lib/utils'

const navItems = [
  { to: '/app/upload', label: 'Upload Dataset', icon: UploadCloud },
  { to: '/app/running', label: 'Running Agents', icon: Activity },
  { to: '/app/failed', label: 'Failed Agents', icon: XCircle },
  { to: '/app/completed', label: 'Completed', icon: CheckCircle2 },
]

export default function Sidebar() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  async function handleSignOut() {
    await signOut()
    navigate('/')
  }

  const avatarUrl = user?.user_metadata?.avatar_url
  const name = user?.user_metadata?.full_name || user?.email || 'User'
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

  return (
    <aside className="w-64 flex flex-col h-full bg-card border-r border-border flex-shrink-0 animate-fade-in">
      {/* Brand */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-border-subtle group cursor-pointer" onClick={() => navigate('/')}>
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
          <BrainCircuit size={20} className="text-white" />
        </div>
        <div>
          <p className="text-sm font-bold text-white tracking-tight">AgentFlow</p>
          <p className="text-[10px] text-muted font-bold uppercase tracking-widest mt-0.5">Neural Hub</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-8 space-y-1.5 overflow-y-auto custom-scrollbar">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted px-3 mb-6">
          System Core
        </p>
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 group relative ring-offset-card focus:ring-2 focus:ring-accent/20 outline-none",
              isActive 
                ? "bg-accent/10 text-accent" 
                : "text-secondary hover:text-white hover:bg-card-hover"
            )}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-accent shadow-[0_0_12px_rgba(59,130,246,0.5)]" />
                )}
                <Icon size={18} className={cn("transition-transform group-hover:scale-110", isActive ? "text-accent" : "text-muted group-hover:text-white")} />
                <span className="flex-1">{label}</span>
                {isActive && <ChevronRight size={14} className="opacity-50" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User Session */}
      <div className="p-4 border-t border-border-subtle bg-base/30">
        <div className="p-3 rounded-2xl border border-white/5 bg-white/[0.02] flex items-center justify-between gap-3 group relative overflow-hidden">
          <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          
          <div className="flex items-center gap-3 min-w-0 relative z-10">
            {avatarUrl ? (
              <img src={avatarUrl} alt={name} className="w-9 h-9 rounded-full object-cover border border-white/10" />
            ) : (
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 flex items-center justify-center text-xs font-bold text-white">
                {initials}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate break-all">{name.split('@')[0]}</p>
              <p className="text-[10px] text-muted font-medium truncate uppercase tracking-tighter">Authorized</p>
            </div>
          </div>
          
          <button
            onClick={handleSignOut}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-muted hover:text-red-400 hover:bg-red-500/10 transition-all active:scale-90 relative z-10"
            title="Relinquish access"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  )
}
