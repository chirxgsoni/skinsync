/**
 * Profile card: skin depth range, undertone, and confidence indicator.
 */
import { SkinSwatch } from './SkinSwatch'
import UndertoneChip from './UndertoneChip'

export default function ProfileCard({ monkLevel, monkAlt, undertone, confidence }) {
  const rangeMin = Math.min(monkLevel, monkAlt)
  const rangeMax = Math.max(monkLevel, monkAlt)

  return (
    <div className="bg-white rounded-xl border border-sand p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-espresso">Your Skin Profile</h3>
        {confidence != null && (
          <div className="text-right">
            <span className="text-xs font-semibold text-sage bg-sage/10 px-2.5 py-1 rounded-full">
              {confidence}% match confidence
            </span>
          </div>
        )}
      </div>

      {/* Depth display */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex gap-1.5">
          <SkinSwatch level={rangeMin} selected size={44} />
          {rangeMin !== rangeMax && (
            <>
              <span className="text-cocoa self-center text-sm">–</span>
              <SkinSwatch level={rangeMax} selected size={44} />
            </>
          )}
        </div>
        <div>
          <p className="text-sm text-cocoa">Depth</p>
          <p className="font-semibold text-espresso">
            Monk {rangeMin === rangeMax ? rangeMin : `${rangeMin}–${rangeMax}`}
          </p>
        </div>
      </div>

      {/* Undertone display */}
      <div className="mb-4">
        <p className="text-sm text-cocoa mb-1.5">Undertone</p>
        <UndertoneChip undertone={undertone} selected />
      </div>

      {/* Confidence Bar */}
      {confidence != null && (
        <div className="mb-4">
          <div className="flex justify-between text-xs text-cocoa mb-1">
            <span>Sampling Agreement</span>
            <span>{confidence}%</span>
          </div>
          <div className="w-full bg-sand/40 h-2 rounded-full overflow-hidden">
            <div
              className="bg-plum h-full rounded-full transition-all duration-500"
              style={{ width: `${confidence}%` }}
            />
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <p className="text-xs text-cocoa mt-4 leading-relaxed">
        Results are a guide. Always confirm shades in natural light with your artist.
      </p>
    </div>
  )
}
