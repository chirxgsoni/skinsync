/**
 * Artist Dashboard — profile management and portfolio upload.
 * Protected route (requires auth with artist role).
 */
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Upload, Trash2, CheckCircle, Clock } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'
import { SkinSwatch } from '../components/SkinSwatch'
import Button from '../components/Button'

export default function ArtistDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [artist, setArtist] = useState(null)
  const [portfolio, setPortfolio] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Form state
  const [displayName, setDisplayName] = useState('')
  const [bio, setBio] = useState('')
  const [city, setCity] = useState('')
  const [yearsExp, setYearsExp] = useState('')
  const [instagram, setInstagram] = useState('')
  const [expertise, setExpertise] = useState([])

  // Upload state
  const [uploading, setUploading] = useState(false)
  const [uploadLevel, setUploadLevel] = useState(5)

  const loadData = async () => {
    setLoading(true)

    const { data: artistData } = await supabase
      .from('artists')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (artistData) {
      setArtist(artistData)
      setDisplayName(artistData.display_name || '')
      setBio(artistData.bio || '')
      setCity(artistData.city || '')
      setYearsExp(artistData.years_experience?.toString() || '')
      setInstagram(artistData.instagram || '')
      setExpertise(artistData.monk_expertise || [])

      const { data: portfolioData } = await supabase
        .from('portfolio_items')
        .select('*')
        .eq('artist_id', artistData.id)
        .order('created_at', { ascending: false })

      if (portfolioData) setPortfolio(portfolioData)
    }

    setLoading(false)
  }

  useEffect(() => {
    if (user) loadData()
  }, [user])

  const handleSaveProfile = async () => {
    setSaving(true)

    const profileData = {
      display_name: displayName,
      bio,
      city,
      years_experience: yearsExp ? parseInt(yearsExp) : null,
      instagram,
      monk_expertise: expertise,
    }

    if (artist) {
      await supabase.from('artists').update(profileData).eq('id', artist.id)
    } else {
      const { data } = await supabase
        .from('artists')
        .insert({ ...profileData, user_id: user.id })
        .select()
        .single()
      if (data) setArtist(data)
    }

    setSaving(false)
  }

  const handleExpertiseToggle = (level) => {
    setExpertise((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]
    )
  }

  const handleUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file || !artist) return

    setUploading(true)

    const filePath = `${user.id}/${Date.now()}_${file.name}`
    const { error: uploadError } = await supabase.storage
      .from('portfolios')
      .upload(filePath, file)

    if (!uploadError) {
      const { data: item } = await supabase
        .from('portfolio_items')
        .insert({
          artist_id: artist.id,
          image_path: filePath,
          monk_level: uploadLevel,
        })
        .select()
        .single()

      if (item) setPortfolio((prev) => [item, ...prev])
    }

    setUploading(false)
  }

  const handleDeletePortfolioItem = async (itemId, imagePath) => {
    await supabase.storage.from('portfolios').remove([imagePath])
    await supabase.from('portfolio_items').delete().eq('id', itemId)
    setPortfolio((prev) => prev.filter((p) => p.id !== itemId))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <p className="text-cocoa animate-pulse">Loading dashboard...</p>
      </div>
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
        <h1 className="text-lg font-semibold text-espresso">Artist Dashboard</h1>
        <div className="w-12" />
      </div>

      <div className="container-app pb-8 max-w-lg mx-auto space-y-6">
        {/* Approval badge */}
        {artist && (
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm ${
            artist.approved
              ? 'bg-sage/10 text-sage border border-sage/20'
              : 'bg-amber/10 text-amber border border-amber/20'
          }`}>
            {artist.approved ? (
              <><CheckCircle size={16} /> Profile is live and visible to brides</>
            ) : (
              <><Clock size={16} /> Pending approval — your profile is not yet public</>
            )}
          </div>
        )}

        {/* Profile form */}
        <div className="bg-white rounded-xl border border-sand p-5 space-y-4">
          <h2 className="text-lg font-semibold text-espresso">Profile</h2>

          <div>
            <label className="block text-sm font-medium text-espresso mb-1">Display Name *</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-sand bg-ivory text-sm focus:ring-2 focus:ring-marigold focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-espresso mb-1">City *</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-sand bg-ivory text-sm focus:ring-2 focus:ring-marigold focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-espresso mb-1">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              maxLength={200}
              className="w-full px-4 py-2.5 rounded-xl border border-sand bg-ivory text-sm focus:ring-2 focus:ring-marigold focus:outline-none resize-none"
            />
            <p className="text-xs text-cocoa mt-1">{bio.length}/200</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-espresso mb-1">Years of experience</label>
              <input
                type="number"
                min="0"
                max="50"
                value={yearsExp}
                onChange={(e) => setYearsExp(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-sand bg-ivory text-sm focus:ring-2 focus:ring-marigold focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-espresso mb-1">Instagram</label>
              <input
                type="text"
                placeholder="@handle"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-sand bg-ivory text-sm focus:ring-2 focus:ring-marigold focus:outline-none"
              />
            </div>
          </div>

          {/* Monk expertise */}
          <div>
            <label className="block text-sm font-medium text-espresso mb-2">
              Skin tones you're experienced with:
            </label>
            <div className="flex gap-2 flex-wrap">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
                <SkinSwatch
                  key={level}
                  level={level}
                  size={36}
                  selected={expertise.includes(level)}
                  onClick={handleExpertiseToggle}
                />
              ))}
            </div>
          </div>

          <Button onClick={handleSaveProfile} disabled={saving || !displayName || !city}>
            {saving ? 'Saving...' : artist ? 'Update Profile' : 'Create Profile'}
          </Button>
        </div>

        {/* Portfolio upload */}
        {artist && (
          <div className="bg-white rounded-xl border border-sand p-5 space-y-4">
            <h2 className="text-lg font-semibold text-espresso">Portfolio</h2>

            {/* Upload controls */}
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <label className="block text-sm font-medium text-espresso mb-1">
                  Monk level for this image *
                </label>
                <select
                  value={uploadLevel}
                  onChange={(e) => setUploadLevel(parseInt(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border border-sand bg-ivory text-sm focus:ring-2 focus:ring-marigold focus:outline-none"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((l) => (
                    <option key={l} value={l}>Monk {l}</option>
                  ))}
                </select>
              </div>
              <label className="cursor-pointer">
                <Button disabled={uploading} className="pointer-events-none">
                  <Upload size={16} />
                  {uploading ? 'Uploading...' : 'Upload'}
                </Button>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            </div>

            {/* Portfolio grid */}
            {portfolio.length === 0 ? (
              <p className="text-sm text-cocoa text-center py-6">
                No portfolio images yet. Upload your work to get discovered!
              </p>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {portfolio.map((item) => (
                  <div key={item.id} className="relative aspect-square rounded-lg overflow-hidden group">
                    <img
                      src={supabase.storage.from('portfolios').getPublicUrl(item.image_path).data.publicUrl}
                      alt={`Work on Monk level ${item.monk_level}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-1 left-1">
                      <SkinSwatch level={item.monk_level} size={20} />
                    </div>
                    <button
                      onClick={() => handleDeletePortfolioItem(item.id, item.image_path)}
                      className="absolute top-1 right-1 w-6 h-6 rounded-full bg-brick/80 text-ivory flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      aria-label="Delete image"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
