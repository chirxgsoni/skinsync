/**
 * Results page — shows skin profile after scan.
 * Includes photo thumbnail with landmark sample points and manual adjustment controls.
 */
import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft, RotateCcw, ChevronUp, ChevronDown, CheckCircle2 } from 'lucide-react'
import ProfileCard from '../components/ProfileCard'
import UndertoneChip from '../components/UndertoneChip'
import Button from '../components/Button'
import { ruleKey as buildRuleKey } from '../lib/classify'
import { getRecommendation } from '../lib/recommend'

export default function Results() {
  const navigate = useNavigate()
  const location = useLocation()
  const data = location.state

  const [monkLevel, setMonkLevel] = useState(data?.monkLevel ?? 5)
  const [monkAlt, setMonkAlt] = useState(data?.monkAlt ?? 6)
  const [undertone, setUndertone] = useState(data?.undertone ?? 'warm')
  const [adjusted, setAdjusted] = useState(false)

  useEffect(() => {
    if (!data) {
      navigate('/scan', { replace: true })
    }
  }, [data, navigate])

  if (!data) return null

  const handleNudgeDepth = (dir) => {
    const newLevel = Math.max(1, Math.min(10, monkLevel + dir))
    setMonkLevel(newLevel)
    setMonkAlt(Math.max(1, Math.min(10, newLevel + (dir > 0 ? -1 : 1))))
    setAdjusted(true)
  }

  const handleUndertoneChange = (ut) => {
    setUndertone(ut)
    setAdjusted(true)
  }

  const handleViewBrief = () => {
    const key = buildRuleKey(monkLevel, undertone)
    const recommendation = getRecommendation(monkLevel, undertone)

    navigate('/brief', {
      state: {
        monkLevel,
        monkAlt,
        undertone,
        confidence: data.confidence,
        lab: data.lab,
        ruleKey: key,
        recommendation,
      },
    })
  }

  return (
    <div className="min-h-screen bg-ivory">
      {/* Top bar */}
      <div className="container-app flex items-center justify-between py-4">
        <button
          onClick={() => navigate('/scan')}
          className="flex items-center gap-1 text-sm text-cocoa hover:text-plum cursor-pointer transition-colors"
        >
          <ArrowLeft size={16} />
          Retake Scan
        </button>
        <h1 className="text-lg font-semibold text-espresso">Scan Analysis</h1>
        <div className="w-12" />
      </div>

      <div className="container-app pb-32 max-w-md mx-auto space-y-6">
        {/* Sampled Photo Thumbnail with sample points if available */}
        {data.capturedImage && data.samplePoints && (
          <div className="bg-white rounded-xl border border-sand p-4 text-center">
            <p className="text-xs font-medium text-cocoa mb-3">
              Sampled Regions (Cheeks & Forehead)
            </p>
            <div className="relative inline-block w-48 aspect-[3/4] rounded-lg overflow-hidden border border-sand shadow-inner mx-auto bg-espresso/5">
              <img
                src={data.capturedImage}
                alt="Captured sample"
                className="w-full h-full object-cover"
              />
              {/* Sample points overlay */}
              {data.samplePoints.forehead && (
                <div
                  className="absolute w-3.5 h-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-marigold shadow-md"
                  style={{
                    left: `${(data.samplePoints.forehead.relX ?? 0.5) * 100}%`,
                    top: `${(data.samplePoints.forehead.relY ?? 0.3) * 100}%`,
                  }}
                  title="Forehead sample point"
                />
              )}
              {data.samplePoints.leftCheek && (
                <div
                  className="absolute w-3.5 h-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-marigold shadow-md"
                  style={{
                    left: `${(data.samplePoints.leftCheek.relX ?? 0.35) * 100}%`,
                    top: `${(data.samplePoints.leftCheek.relY ?? 0.55) * 100}%`,
                  }}
                  title="Left cheek sample point"
                />
              )}
              {data.samplePoints.rightCheek && (
                <div
                  className="absolute w-3.5 h-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-marigold shadow-md"
                  style={{
                    left: `${(data.samplePoints.rightCheek.relX ?? 0.65) * 100}%`,
                    top: `${(data.samplePoints.rightCheek.relY ?? 0.55) * 100}%`,
                  }}
                  title="Right cheek sample point"
                />
              )}
            </div>
            <p className="text-[11px] text-cocoa/70 mt-2">
              Values averaged using per-channel median filtering to reject highlights.
            </p>
          </div>
        )}

        {/* Profile card */}
        <ProfileCard
          monkLevel={monkLevel}
          monkAlt={monkAlt}
          undertone={undertone}
          confidence={data.confidence}
        />

        {/* Manual adjustment */}
        <div className="bg-white rounded-xl border border-sand p-5">
          <p className="text-sm font-medium text-espresso mb-4">
            Not quite right? Fine-tune your match:
          </p>

          {/* Depth nudge */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-sm text-espresso font-medium block">Depth Range</span>
              <span className="text-xs text-cocoa">Monk Scale (1-10)</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleNudgeDepth(-1)}
                disabled={monkLevel <= 1}
                className="w-8 h-8 rounded-full border border-sand flex items-center justify-center cursor-pointer disabled:opacity-30 hover:bg-sand/30 transition-colors"
                aria-label="Decrease depth"
              >
                <ChevronDown size={16} />
              </button>
              <span className="font-semibold text-espresso w-8 text-center">{monkLevel}</span>
              <button
                onClick={() => handleNudgeDepth(1)}
                disabled={monkLevel >= 10}
                className="w-8 h-8 rounded-full border border-sand flex items-center justify-center cursor-pointer disabled:opacity-30 hover:bg-sand/30 transition-colors"
                aria-label="Increase depth"
              >
                <ChevronUp size={16} />
              </button>
            </div>
          </div>

          {/* Undertone selection */}
          <div>
            <span className="text-sm text-cocoa block mb-2">Undertone</span>
            <div className="flex flex-wrap gap-2">
              {['cool', 'neutral', 'warm', 'olive'].map((ut) => (
                <UndertoneChip
                  key={ut}
                  undertone={ut}
                  selected={undertone === ut}
                  onClick={handleUndertoneChange}
                />
              ))}
            </div>
          </div>

          {adjusted && (
            <p className="text-xs text-sage mt-3 flex items-center gap-1.5 font-medium">
              <CheckCircle2 size={13} />
              Adjusted manually. Your customized brief will reflect this.
            </p>
          )}
        </div>
      </div>

      {/* Sticky bottom bar */}
      <div className="fixed bottom-0 inset-x-0 bg-white border-t border-sand p-4 no-print">
        <div className="container-app max-w-md mx-auto flex gap-3">
          <Button variant="secondary" onClick={() => navigate('/scan')} className="flex-1">
            <RotateCcw size={16} />
            Retake
          </Button>
          <Button onClick={handleViewBrief} className="flex-1">
            View My Brief
          </Button>
        </div>
      </div>
    </div>
  )
}
