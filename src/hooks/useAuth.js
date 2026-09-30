import { useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

/**
 * Auth state hook. Returns current session, user, and loading state.
 * Subscribes to auth state changes and auto-updates.
 */
export function useAuth() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false)
      return
    }

    // Get initial session
    supabase.auth.getSession()
      .then(({ data }) => {
        setSession(data?.session ?? null)
        setLoading(false)
      })
      .catch((err) => {
        console.warn('Auth session check failed:', err)
        setLoading(false)
      })

    // Listen for auth state changes (login, logout, token refresh)
    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
    })

    return () => {
      if (sub?.subscription) {
        sub.subscription.unsubscribe()
      }
    }
  }, [])

  return {
    session,
    user: session?.user ?? null,
    loading,
    isConfigured: isSupabaseConfigured,
  }
}
