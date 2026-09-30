/**
 * Artist directory page — grid with city and Monk-level filters.
 */
import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft, Search, Users, X } from 'lucide-react'
import { supabase } from '../lib/supabase'
import ArtistCard from '../components/ArtistCard'
import { SwatchRow } from '../components/SkinSwatch'
import { SkeletonCard } from '../components/SkeletonLoader'

export default function Artists() {
  const navigate = useNavigate()
  const location = useLocation()
  const initialLevel = location.state?.monkLevel

  const [artists, setArtists] = useState([])
  const [loading, setLoading] = useState(true)
  const [city, setCity] = useState('')
  const [selectedLevels, setSelectedLevels] = useState(initialLevel ? [initialLevel] : [])

  const fetchArtists = async () => {
    setLoading(true)
    let query = supabase.from('artists').select('*').eq('approved', true)

    if (city.trim()) {
      query = query.ilike('city', `%${city.trim()}%`)
    }

    if (selectedLevels.length > 0) {
      query = query.contains('monk_expertise', selectedLevels)
    }

    query = query.order('years_experience', { ascending: false })

    const { data, error } = await query
    if (!error) setArtists(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchArtists()
  }, [city, selectedLevels])

  const handleSwatchSelect = (level) => {
    setSelectedLevels((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]
    )
  }

  return (
    <div className="min-h-screen bg-ivory">
      {/* Top bar */}
      <div className="container-app flex items-center justify-between py-4">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1 text-sm text-cocoa hover:text-plum cursor-pointer transition-colors"
        >
          <ArrowLeft size={16} />
          Home
        </button>
        <h1 className="text-lg font-semibold text-espresso">Find an Artist</h1>
        <div className="w-12" />
      </div>

      <div className="container-app pb-8">
        {/* Filters */}
        <div className="bg-white rounded-xl border border-sand p-4 mb-6 space-y-4">
          {/* City search */}
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-cocoa/50" />
            <input
              type="text"
              placeholder="Search by city..."
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-sand bg-ivory text-sm text-espresso placeholder:text-cocoa/50 focus:outline-none focus:ring-2 focus:ring-marigold"
            />
          </div>

          {/* Monk level filter */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-cocoa">Filter by skin tone expertise:</p>
              {selectedLevels.length > 0 && (
                <button
                  onClick={() => setSelectedLevels([])}
                  className="text-xs text-plum hover:underline cursor-pointer flex items-center gap-1"
                >
                  <X size={12} /> Clear tone filter
                </button>
              )}
            </div>
            <SwatchRow selectedLevels={selectedLevels} onSelect={handleSwatchSelect} size={30} />
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : artists.length === 0 ? (
          <div className="text-center py-16">
            <Users size={48} className="mx-auto text-cocoa/30 mb-4" />
            <h2 className="text-lg font-semibold text-espresso mb-2">No artists found</h2>
            <p className="text-sm text-cocoa">
              {city
                ? `No artists in "${city}" yet. Try a nearby city.`
                : 'Try adjusting your filters.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {artists.map((artist) => (
              <ArtistCard
                key={artist.id}
                artist={artist}
                onClick={(id) => navigate(`/artists/${id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
