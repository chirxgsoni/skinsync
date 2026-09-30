import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

/**
 * Auth state hook. Returns current session, user, and loading state.
 * Subscribes to auth state changes and auto-updates.
 */
export function useAuth() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })

    // Listen for auth state changes (login, logout, token refresh)
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => sub.subscription.unsubscribe()
  }, [])

  return {
    session,
    user: session?.user ?? null,
    loading,
  }
}
