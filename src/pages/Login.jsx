/**
 * Login page — magic link email, guest option.
 */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, ArrowLeft } from 'lucide-react'
import { supabase } from '../lib/supabase'
import Button from '../components/Button'

export default function Login() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error: authError } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin + '/scan' },
    })

    setLoading(false)
    if (authError) {
      setError(authError.message)
    } else {
      setSent(true)
    }
  }

  return (
    <div className="min-h-screen bg-ivory flex flex-col">
      {/* Back button */}
      <div className="container-app py-4">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1 text-sm text-cocoa hover:text-plum transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} />
          Back
        </button>
      </div>

      {/* Login card */}
      <div className="flex-1 flex items-center justify-center px-4 pb-16">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-espresso mb-2">Welcome to HueMatch</h1>
            <p className="text-cocoa text-sm">Sign in to save your Complexion Brief and contact artists.</p>
          </div>

          {sent ? (
            <div className="bg-white rounded-xl border border-sand p-6 text-center">
              <Mail size={40} className="text-plum mx-auto mb-4" />
              <h2 className="font-semibold text-espresso mb-2">Check your email</h2>
              <p className="text-sm text-cocoa mb-4">
                We sent a magic link to <strong>{email}</strong>. Click it to sign in.
              </p>
              <Button variant="ghost" onClick={() => setSent(false)}>
                Try a different email
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-sand p-6 space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-espresso mb-1">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-xl border border-sand bg-ivory text-espresso placeholder:text-cocoa/50 focus:outline-none focus:ring-2 focus:ring-marigold"
                />
              </div>

              {error && (
                <p className="text-sm text-brick" role="alert">{error}</p>
              )}

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Sending...' : 'Send me a magic link'}
              </Button>
            </form>
          )}

          {/* Guest option */}
          <div className="text-center mt-6">
            <button
              onClick={() => navigate('/scan')}
              className="text-sm text-cocoa hover:text-plum underline underline-offset-2 cursor-pointer transition-colors"
            >
              Continue as guest
            </button>
            <p className="text-xs text-cocoa/70 mt-1">You can scan without an account</p>
          </div>
        </div>
      </div>
    </div>
  )
}
