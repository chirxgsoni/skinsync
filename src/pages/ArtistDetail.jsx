/**
 * Artist detail page — profile, portfolio, contact.
 */
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, MapPin, Calendar, ExternalLink, Image as ImageIcon } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { SkinSwatch } from '../components/SkinSwatch'
import { SkeletonText } from '../components/SkeletonLoader'
import Button from '../components/Button'

export default function ArtistDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [artist, setArtist] = useState(null)
  const [portfolio, setPortfolio] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterLevel, setFilterLevel] = useState(null)

  const loadArtist = async () => {
    setLoading(true)

    const [artistRes, portfolioRes] = await Promise.all([
      supabase.from('artists').select('*').eq('id', id).single(),
      supabase.from('portfolio_items').select('*').eq('artist_id', id).order('created_at', { ascending: false }),
    ])

    if (artistRes.data) setArtist(artistRes.data)
    if (portfolioRes.data) setPortfolio(portfolioRes.data)
    setLoading(false)
  }

  useEffect(() => {
    loadArtist()
  }, [id])

  const filteredPortfolio = filterLevel
    ? portfolio.filter((p) => p.monk_level === filterLevel)
    : portfolio

  if (loading) {
    return (
      <div className="min-h-screen bg-ivory">
        <div className="container-app py-4">
          <SkeletonText lines={5} />
        </div>
      </div>
    )
  }

  if (!artist) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-espresso mb-2">Artist not found</h2>
          <Button onClick={() => navigate('/artists')}>Browse Artists</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-ivory">
      {/* Top bar */}
      <div className="container-app flex items-center justify-between py-4">
        <button
          onClick={() => navigate('/artists')}
          className="flex items-center gap-1 text-sm text-cocoa hover:text-plum cursor-pointer transition-colors"
        >
          <ArrowLeft size={16} />
          Artists
        </button>
        <h1 className="text-lg font-semibold text-espresso">{artist.display_name}</h1>
        <div className="w-12" />
      </div>

      <div className="container-app pb-8 max-w-2xl mx-auto">
        {/* Profile header */}
        <div className="bg-white rounded-xl border border-sand p-6 mb-6">
          <h2 className="text-xl font-bold text-espresso mb-2">{artist.display_name}</h2>

          <div className="flex items-center gap-4 text-sm text-cocoa mb-4">
            <span className="flex items-center gap-1">
              <MapPin size={14} />
              {artist.city}
            </span>
            {artist.years_experience && (
              <span className="flex items-center gap-1">
                <Calendar size={14} />
                {artist.years_experience} years experience
              </span>
            )}
          </div>

          {artist.bio && (
            <p className="text-sm text-cocoa leading-relaxed mb-4">{artist.bio}</p>
          )}

          {/* Expertise swatches */}
          {artist.monk_expertise?.length > 0 && (
            <div className="mb-4">
              <p className="text-xs text-cocoa mb-2">Experienced with:</p>
              <div className="flex gap-2 flex-wrap">
                {artist.monk_expertise.map((level) => (
                  <SkinSwatch key={level} level={level} size={32} selected />
                ))}
              </div>
            </div>
          )}

          {/* Instagram */}
          {artist.instagram && (
            <a
              href={`https://instagram.com/${artist.instagram.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-plum hover:text-mulberry transition-colors"
            >
              <ExternalLink size={14} />
              Contact via Instagram
            </a>
          )}
        </div>

        {/* Portfolio */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-espresso">Portfolio</h2>
            {portfolio.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-cocoa">Filter:</span>
                <button
                  onClick={() => setFilterLevel(null)}
                  className={`text-xs px-2 py-1 rounded-full cursor-pointer transition-colors ${
                    !filterLevel ? 'bg-plum text-ivory' : 'bg-sand/50 text-cocoa hover:bg-sand'
                  }`}
                >
                  All
                </button>
                {[...new Set(portfolio.map((p) => p.monk_level))].sort((a, b) => a - b).map((level) => (
                  <button
                    key={level}
                    onClick={() => setFilterLevel(level)}
                    className={`cursor-pointer transition-colors ${
                      filterLevel === level ? 'ring-2 ring-marigold' : ''
                    }`}
                  >
                    <SkinSwatch level={level} size={24} selected={filterLevel === level} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {filteredPortfolio.length === 0 ? (
            <div className="text-center py-12">
              <ImageIcon size={40} className="mx-auto text-cocoa/30 mb-3" />
              <p className="text-sm text-cocoa">No portfolio images yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {filteredPortfolio.map((item) => (
                <div key={item.id} className="relative rounded-xl overflow-hidden aspect-square bg-sand/30 group">
                  <img
                    src={supabase.storage.from('portfolios').getPublicUrl(item.image_path).data.publicUrl}
                    alt={item.caption || `Work on Monk level ${item.monk_level} skin`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-espresso/70 to-transparent p-3">
                    <div className="flex items-center gap-1.5">
                      <SkinSwatch level={item.monk_level} size={20} />
                      <span className="text-xs text-ivory">Monk {item.monk_level}</span>
                    </div>
                    {item.caption && (
                      <p className="text-xs text-ivory/80 mt-1 line-clamp-1">{item.caption}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
