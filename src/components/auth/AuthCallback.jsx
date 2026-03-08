import { Navigate, useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'

export default function AuthCallback() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(() => {
      setLoading(false)
      window.location.href = '/app/upload'
    })
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-base)' }}>
      <div className="text-center">
        <div className="w-12 h-12 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p style={{ color: 'var(--text-secondary)' }}>Completing sign in...</p>
      </div>
    </div>
  )
}
