import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateStr) {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export function getRiskColor(risk) {
  if (!risk) return 'text-slate-400'
  const r = risk.toLowerCase()
  if (r === 'high') return 'text-red-400'
  if (r === 'moderate' || r === 'medium') return 'text-amber-400'
  if (r === 'low') return 'text-emerald-400'
  return 'text-slate-400'
}

export function getRiskBg(risk) {
  if (!risk) return 'bg-slate-800 border-slate-700'
  const r = risk.toLowerCase()
  if (r === 'high') return 'bg-red-950/40 border-red-800/50'
  if (r === 'moderate' || r === 'medium') return 'bg-amber-950/40 border-amber-800/50'
  if (r === 'low') return 'bg-emerald-950/40 border-emerald-800/50'
  return 'bg-slate-800 border-slate-700'
}

export function getRiskDot(risk) {
  if (!risk) return 'bg-slate-500'
  const r = risk.toLowerCase()
  if (r === 'high') return 'bg-red-500'
  if (r === 'moderate' || r === 'medium') return 'bg-amber-500'
  if (r === 'low') return 'bg-emerald-500'
  return 'bg-slate-500'
}
