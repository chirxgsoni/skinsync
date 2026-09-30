/**
 * Artist card for the directory listing.
 * Cover image, name, city, expertise swatches, years of experience.
 */
import { MapPin, Calendar } from 'lucide-react'
import { SkinSwatch } from './SkinSwatch'

export default function ArtistCard({ artist, onClick }) {
  return (
    <button
      type="button"
      onClick={() => onClick?.(artist.id)}
      className="w-full text-left bg-white rounded-xl border border-sand overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer group"
    >
      {/* Cover image */}
      <div className="aspect-[4/3] bg-sand/50 overflow-hidden">
        {artist.coverImage ? (
          <img
            src={artist.coverImage}
            alt={`${artist.display_name}'s work`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-cocoa/40">
            <Calendar size={48} />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-semibold text-espresso text-base mb-1">{artist.display_name}</h3>

        <div className="flex items-center gap-1 text-cocoa text-sm mb-3">
          <MapPin size={14} />
          <span>{artist.city}</span>
          {artist.years_experience && (
            <span className="ml-2">· {artist.years_experience}y exp</span>
          )}
        </div>

        {/* Expertise swatches */}
        {artist.monk_expertise?.length > 0 && (
          <div className="flex gap-1.5 flex-wrap">
            {artist.monk_expertise.map((level) => (
              <SkinSwatch key={level} level={level} size={24} />
            ))}
          </div>
        )}
      </div>
    </button>
  )
}
