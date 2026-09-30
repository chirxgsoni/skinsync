/**
 * Landing page — hero, problem strip, how-it-works, skin range, trust bar.
 */
import { useNavigate } from 'react-router-dom'
import { Scan, FileText, Users, Camera, ShieldCheck, Heart } from 'lucide-react'
import Button from '../components/Button'
import { SwatchRow } from '../components/SkinSwatch'

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-ivory">
      {/* ── Navbar ── */}
      <nav className="container-app flex items-center justify-between py-4">
        <h1 className="text-xl font-bold text-plum" style={{ fontFamily: 'var(--font-heading)' }}>
          HueMatch
        </h1>
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={() => navigate('/artists')}>
            Find Artists
          </Button>
          <Button variant="secondary" onClick={() => navigate('/login')} className="!text-sm">
            Sign In
          </Button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="container-app text-center py-16 md:py-24">
        <h2 className="text-3xl md:text-5xl font-bold text-espresso leading-tight mb-6 max-w-3xl mx-auto">
          Your skin. Your wedding.{' '}
          <span className="text-plum">Enhanced, not erased.</span>
        </h2>
        <p className="text-lg text-cocoa max-w-xl mx-auto mb-8">
          Get a personal Complexion Brief to take to your makeup artist.
          Know your depth, undertone, and the shades that make you glow.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => navigate('/scan')}>
            <Camera size={20} />
            Scan My Skin
          </Button>
          <Button variant="secondary" onClick={() => navigate('/artists')}>
            <Users size={20} />
            Find an Artist
          </Button>
        </div>
      </section>

      {/* ── Problem strip ── */}
      <section className="bg-white py-12">
        <div className="container-app">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { emoji: '😤', title: 'Ashy in photos?', desc: 'Your foundation shouldn\'t make you look grey.' },
              { emoji: '😟', title: 'Two shades too light?', desc: 'You deserve a match, not a mask.' },
              { emoji: '🙅‍♀️', title: 'Artist didn\'t listen?', desc: 'Walk in with the words and the proof.' },
            ].map((card, i) => (
              <div key={i} className="text-center p-6 rounded-xl border border-sand bg-ivory/50">
                <span className="text-4xl mb-3 block">{card.emoji}</span>
                <h3 className="text-lg font-semibold text-espresso mb-2">{card.title}</h3>
                <p className="text-sm text-cocoa">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="container-app py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-espresso mb-10">
          How it works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
          {[
            { icon: Scan, step: '1', title: 'Scan', desc: 'Take a selfie in natural light. Our tech reads your skin tone — privately, on your phone.' },
            { icon: FileText, step: '2', title: 'Get Your Brief', desc: 'See your depth, undertone, and shade recommendations curated by makeup professionals.' },
            { icon: Heart, step: '3', title: 'Find Your Artist', desc: 'Browse artists with proven experience on skin like yours.' },
          ].map(({ icon: Icon, step, title, desc }) => (
            <div key={step} className="text-center">
              <div className="w-16 h-16 rounded-full bg-plum/10 flex items-center justify-center mx-auto mb-4">
                <Icon size={28} className="text-plum" />
              </div>
              <span className="text-xs font-semibold text-marigold uppercase tracking-wider">Step {step}</span>
              <h3 className="text-lg font-semibold text-espresso mt-1 mb-2">{title}</h3>
              <p className="text-sm text-cocoa leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Skin range strip ── */}
      <section className="bg-white py-12">
        <div className="container-app text-center">
          <h2 className="text-2xl font-bold text-espresso mb-2">Every tone. Every undertone.</h2>
          <p className="text-sm text-cocoa mb-6">Built on the Monk Skin Tone Scale</p>
          <div className="flex justify-center">
            <SwatchRow size={40} />
          </div>
        </div>
      </section>

      {/* ── Trust bar ── */}
      <section className="container-app py-12">
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 text-center">
          <div className="flex items-center gap-2 text-sm text-cocoa">
            <ShieldCheck size={20} className="text-sage" />
            <span>Your photo never leaves your phone</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-cocoa">
            <Heart size={20} className="text-terracotta" />
            <span>Reviewed by professional makeup artists</span>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-sand py-8">
        <div className="container-app text-center text-xs text-cocoa space-y-2">
          <p>HueMatch Bridal © {new Date().getFullYear()}</p>
          <p>
            Skin tone reference:{' '}
            <a href="https://skintone.google" target="_blank" rel="noopener noreferrer" className="underline hover:text-plum">
              Monk Skin Tone Scale
            </a>{' '}
            by Google (CC BY 4.0)
          </p>
        </div>
      </footer>
    </div>
  )
}
