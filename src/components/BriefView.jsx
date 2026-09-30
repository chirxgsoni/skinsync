import ProfileCard from './ProfileCard'
import PaletteChipRow from './PaletteChipRow'
import TipList from './TipList'

/**
 * Reusable BriefView component.
 * Renders all sections of the Complexion Brief:
 * - Complexion profile card
 * - Foundation guidance & shade range
 * - Color correctors
 * - Blush, lip & highlighter palettes
 * - Pro technique tips
 * - Avoid list
 * - Trial-day checklist
 *
 * @param {object} props
 * @param {object} props.data - Brief data { monkLevel, monkAlt, undertone, recommendation }
 * @param {boolean} [props.showChecklist=true]
 */
export default function BriefView({ data, showChecklist = true }) {
  if (!data || !data.recommendation) return null
  const rec = data.recommendation

  return (
    <div className="space-y-6">
      {/* 1. Summary */}
      <ProfileCard
        monkLevel={data.monkLevel}
        monkAlt={data.monkAlt}
        undertone={data.undertone}
      />

      {/* 2. Foundation guidance */}
      <section className="bg-white rounded-xl border border-sand p-5">
        <h2 className="text-lg font-semibold text-espresso mb-2">Foundation Guidance</h2>
        <p className="text-sm text-cocoa leading-relaxed mb-2">{rec.foundation}</p>
        <p className="text-sm text-cocoa">
          <span className="font-medium text-espresso">Shade range:</span> {rec.shadeRange}
        </p>
      </section>

      {/* 3. Correctors */}
      <section className="bg-white rounded-xl border border-sand p-5">
        <h2 className="text-lg font-semibold text-espresso mb-2">Correctors</h2>
        <p className="text-sm text-cocoa leading-relaxed">{rec.correctors}</p>
      </section>

      {/* 4. Palettes */}
      <section className="bg-white rounded-xl border border-sand p-5">
        <h2 className="text-lg font-semibold text-espresso mb-4">Your Palette</h2>
        <PaletteChipRow label="Blush" items={rec.blush} />
        <PaletteChipRow label="Lips" items={rec.lips} />
        <PaletteChipRow label="Highlighter" items={rec.highlighter} />
      </section>

      {/* 5. Techniques */}
      <section className="bg-white rounded-xl border border-sand p-5">
        <h2 className="text-lg font-semibold text-espresso mb-3">Technique Tips</h2>
        <TipList items={rec.techniques} type="do" />
      </section>

      {/* 6. What to avoid */}
      <section className="bg-white rounded-xl border border-sand p-5">
        <h2 className="text-lg font-semibold text-espresso mb-3">What to Avoid</h2>
        <TipList items={rec.avoid} type="avoid" />
      </section>

      {/* 7. Trial-day checklist */}
      {showChecklist && (
        <section className="bg-white rounded-xl border border-sand p-5">
          <h2 className="text-lg font-semibold text-espresso mb-3">Trial-Day Checklist</h2>
          <ul className="space-y-2 text-sm text-cocoa">
            {[
              'Arrive with clean, moisturised skin',
              'Bring this brief (printed or on your phone)',
              'Test foundation on jawline AND neck',
              'Check the match in natural daylight',
              'Do a flash photo test',
              'Confirm setting powder has no white cast',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id={`checklist-item-${i}`}
                  className="mt-0.5 accent-plum w-4 h-4 cursor-pointer"
                />
                <label htmlFor={`checklist-item-${i}`} className="cursor-pointer">
                  {item}
                </label>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
