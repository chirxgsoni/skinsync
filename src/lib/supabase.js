import { createClient } from '@supabase/supabase-js'

const rawUrl = import.meta.env.VITE_SUPABASE_URL
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY

/**
 * Check whether Supabase environment variables have been properly set up.
 */
export const isSupabaseConfigured = Boolean(
  rawUrl &&
  rawKey &&
  typeof rawUrl === 'string' &&
  rawUrl.startsWith('http') &&
  !rawUrl.includes('YOUR-PROJECT') &&
  !rawUrl.includes('placeholder')
)

// Safe fallback credentials so createClient never throws on startup if env vars are missing
const safeUrl = isSupabaseConfigured ? rawUrl : 'https://placeholder.supabase.co'
const safeKey = isSupabaseConfigured ? rawKey : 'placeholder-anon-key'

export const supabase = createClient(safeUrl, safeKey, {
  auth: {
    persistSession: isSupabaseConfigured,
    autoRefreshToken: isSupabaseConfigured,
  },
})
