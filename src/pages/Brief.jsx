/**
 * Complexion Brief page — the core deliverable.
 * Foundation guidance, palette swatches, technique tips, avoid list, trial checklist.
 */
import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft, Download, Eye, Save, Printer, Users } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import BriefView from '../components/BriefView'
import Button from '../components/Button'
import Toast from '../components/Toast'
import { exportBriefToPdf } from '../lib/pdf'

export default function Brief() {
  const navigate = useNavigate()
  const location = useLocation()
  const data = location.state
  const { user } = useAuth()

  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null) // { message, type }

  useEffect(() => {
    if (!data || !data.recommendation) {
      navigate('/scan', { replace: true })
    }
  }, [data, navigate])

  if (!data || !data.recommendation) return null

  const handleSave = async () => {
    if (!isSupabaseConfigured) {
      setToast({
        message: 'Cloud sync requires Supabase configuration. You can download your PDF brief directly below!',
        type: 'info',
      })
      return
    }

    if (!user) {
      setToast({
        message: 'Please sign in to save your brief to your profile.',
        type: 'info',
      })
      setTimeout(() => navigate('/login'), 1200)
      return
    }

    setSaving(true)
    try {
      const { error } = await supabase.from('briefs').insert({
        user_id: user.id,
        monk_level: data.monkLevel,
        monk_alt: data.monkAlt,
        undertone: data.undertone,
        lab: data.lab,
        rule_key: data.ruleKey,
      })

      if (error) throw error
      setSaved(true)
      setToast({ message: 'Complexion Brief saved to your profile!', type: 'success' })
    } catch (err) {
      console.error('Error saving brief:', err)
      setToast({ message: 'Could not save brief. Please try again.', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const handleDownloadPdf = () => {
    try {
      exportBriefToPdf(data)
      setToast({ message: 'PDF generated and downloaded!', type: 'success' })
    } catch (err) {
      console.error('PDF export failed:', err)
      window.print()
    }
  }

  const handleFindArtists = () => {
    navigate('/artists', { state: { monkLevel: data.monkLevel } })
  }

  return (
    <div className="min-h-screen bg-ivory">
      {/* Toast Alert */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Top bar */}
      <div className="container-app flex items-center justify-between py-4 no-print">
        <button
          onClick={() => navigate('/results', { state: data })}
          className="flex items-center gap-1 text-sm text-cocoa hover:text-plum cursor-pointer transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Results
        </button>
        <h1 className="text-lg font-semibold text-espresso">Your Complexion Brief</h1>
        <button
          onClick={() => window.print()}
          title="Print brief"
          className="text-cocoa hover:text-plum cursor-pointer p-1.5 rounded-lg border border-sand bg-white"
        >
          <Printer size={16} />
        </button>
      </div>

      <div className="container-app pb-36 max-w-lg mx-auto space-y-6">
        {/* Core Brief Content */}
        <BriefView data={data} showChecklist={true} />

        {/* Find matching artists CTA */}
        <div className="bg-plum/5 rounded-xl border border-plum/15 p-5 text-center space-y-3 no-print">
          <h3 className="font-semibold text-espresso">Looking for an experienced artist?</h3>
          <p className="text-xs text-cocoa">
            Find certified makeup artists with verified portfolios matching Monk tone {data.monkLevel}.
          </p>
          <Button onClick={handleFindArtists} className="w-full">
            <Users size={16} />
            Find Artists for Monk {data.monkLevel}
          </Button>
        </div>
      </div>

      {/* Sticky bottom bar */}
      <div className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-sm border-t border-sand p-3.5 no-print z-40">
        <div className="container-app max-w-lg mx-auto flex gap-2 sm:gap-3">
          <Button
            variant="secondary"
            onClick={() => navigate('/show-artist', { state: data })}
            className="flex-1 !px-2.5 !text-xs sm:!text-sm"
          >
            <Eye size={15} />
            Show Artist
          </Button>
          <Button
            variant="secondary"
            onClick={handleDownloadPdf}
            className="flex-1 !px-2.5 !text-xs sm:!text-sm"
          >
            <Download size={15} />
            Download PDF
          </Button>
          <Button
            onClick={handleSave}
            disabled={saved || saving}
            className="flex-1 !px-2.5 !text-xs sm:!text-sm"
          >
            <Save size={15} />
            {saved ? 'Saved' : saving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>
    </div>
  )
}
