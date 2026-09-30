# HueMatch Bridal: Build Guide (React + Supabase, 100% free stack)

> *"Your skin. Your wedding. Enhanced, not erased."*

This guide walks you from an empty folder to a deployed MVP. Every tool below has a free tier that is enough for a hackathon.

---

## 1. Free Resources Used

| Purpose | Tool | Free tier note |
|---|---|---|
| Frontend | React 18 + Vite | Open source |
| Styling | Tailwind CSS | Open source |
| Routing | React Router | Open source |
| Auth + DB + Storage | Supabase | Free plan (limits change, check supabase.com/pricing) |
| Face landmarks | MediaPipe Tasks Vision (Face Landmarker) | Free, runs in browser |
| Color math | Custom JS (sRGB to CIELAB) | No dependency |
| PDF brief | `jspdf` or browser print-to-PDF | Open source |
| Hosting | Vercel or Netlify | Free hobby tier |
| Design | Figma (free), Coolors, Google Fonts | Free |
| Icons | lucide-react | Open source |
| Skin scale reference | Monk Skin Tone Scale (Google, CC BY 4.0) | Free to use with attribution |
| Version control / CI | GitHub + GitHub Actions | Free |

---

## 2. Prerequisites

- Node.js 18+ and npm
- A GitHub account
- A Supabase account (supabase.com)
- A Vercel account
- A phone with a camera for testing (HTTPS is required for camera access, and `localhost` counts)

---

## 3. Project Setup

```bash
npm create vite@latest huematch -- --template react
cd huematch
npm install
npm install @supabase/supabase-js react-router-dom @mediapipe/tasks-vision lucide-react jspdf
npm install -D tailwindcss @tailwindcss/vite
```

**vite.config.js**
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({ plugins: [react(), tailwindcss()] })
```

**src/index.css**
```css
@import "tailwindcss";
```

**.env.local** (never commit this)
```
VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR-ANON-KEY
```

---

## 4. Supabase Setup

1. Create a new project at supabase.com.
2. **Authentication > Providers:** enable Email (magic link or password) and optionally Google.
3. **Authentication > URL Configuration:** add `http://localhost:5173` and your Vercel URL to the redirect list.
4. **SQL Editor:** run the schema in `03_TRD.md` section 5.
5. **Storage:** create a public bucket named `portfolios` for artist images. Do **not** create a bucket for bride selfies (they stay on-device).
6. Copy the Project URL and anon key into `.env.local`.

**src/lib/supabase.js**
```js
import { createClient } from '@supabase/supabase-js'
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)
```

---

## 5. Folder Structure

```
src/
  lib/
    supabase.js
    color.js          # sRGB -> LAB, ITA, undertone
    classify.js       # depth + undertone classification
    recommend.js      # rules engine
  data/
    rules.json        # depth x undertone recommendations
    monk.json         # 10 Monk swatches
  hooks/
    useAuth.js
    useFaceLandmarker.js
  components/
    CameraCapture.jsx
    LightingWarning.jsx
    ProfileCard.jsx
    BriefView.jsx
    ArtistCard.jsx
    ProtectedRoute.jsx
  pages/
    Landing.jsx
    Login.jsx
    Scan.jsx
    Results.jsx
    Brief.jsx
    Artists.jsx
    ArtistDetail.jsx
    ShowArtist.jsx
    ArtistDashboard.jsx
  App.jsx
  main.jsx
```

---

## 6. Build Steps

### Step 1: Auth (Hour 0-3)

**src/hooks/useAuth.js**
```js
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export function useAuth() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session); setLoading(false)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => sub.subscription.unsubscribe()
  }, [])

  return { session, user: session?.user ?? null, loading }
}
```

**Login (email magic link)**
```js
await supabase.auth.signInWithOtp({
  email,
  options: { emailRedirectTo: window.location.origin + '/scan' }
})
```

**ProtectedRoute.jsx**
```jsx
import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <p className="p-6">Loading...</p>
  return user ? children : <Navigate to="/login" replace />
}
```

> Allow a **guest scan** without login. Require login only to save the brief or to contact artists. This keeps demo friction low.

### Step 2: Camera + Face Landmarks (Hour 3-8)

**src/hooks/useFaceLandmarker.js**
```js
import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision'

let landmarker
export async function getLandmarker() {
  if (landmarker) return landmarker
  const vision = await FilesetResolver.forVisionTasks(
    'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm'
  )
  landmarker = await FaceLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath:
        'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task'
    },
    runningMode: 'IMAGE',
    numFaces: 1
  })
  return landmarker
}
```

**Camera capture**: use `navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } })`, draw a frame to a `<canvas>`, then pass the canvas to `landmarker.detect(canvas)`.

### Step 3: Skin Sampling (Hour 8-12)

Sample small patches (about 12x12 px) at stable landmark regions: **left cheek, right cheek, forehead center**. Avoid the eyes, lips, brows, hair and nostrils.

Suggested MediaPipe landmark indices (verify visually with a debug overlay):

| Region | Landmark index |
|---|---|
| Left cheek | 50 |
| Right cheek | 280 |
| Forehead | 151 |

```js
function samplePatch(ctx, x, y, size = 12) {
  const { data } = ctx.getImageData(x - size/2, y - size/2, size, size)
  const px = []
  for (let i = 0; i < data.length; i += 4) px.push([data[i], data[i+1], data[i+2]])
  // use the median per channel to reject specular highlights and blemishes
  const med = c => px.map(p => p[c]).sort((a,b)=>a-b)[Math.floor(px.length/2)]
  return [med(0), med(1), med(2)]
}
```

### Step 4: Color Science (Hour 12-16)

**src/lib/color.js**
```js
const lin = c => { c/=255; return c <= 0.04045 ? c/12.92 : ((c+0.055)/1.055)**2.4 }

export function rgbToLab([r,g,b]) {
  const R=lin(r), G=lin(g), B=lin(b)
  const X = (R*0.4124 + G*0.3576 + B*0.1805) / 0.95047
  const Y = (R*0.2126 + G*0.7152 + B*0.0722)
  const Z = (R*0.0193 + G*0.1192 + B*0.9505) / 1.08883
  const f = t => t > 0.008856 ? Math.cbrt(t) : 7.787*t + 16/116
  return { L: 116*f(Y)-16, a: 500*(f(X)-f(Y)), b: 200*(f(Y)-f(Z)) }
}

// Individual Typology Angle: lower = deeper skin
export const ita = ({L, b}) => Math.atan((L-50)/b) * 180/Math.PI

// Hue angle: higher = warmer/yellower, lower = pinker/cooler
export const hue = ({a, b}) => Math.atan2(b, a) * 180/Math.PI
```

**src/lib/classify.js**: map to a depth level (1-10) using nearest-neighbour distance in LAB to the 10 Monk swatches, and classify undertone using hue angle plus a* / b* balance.

```js
import monk from '../data/monk.json' // [{level:1, hex:'#f6ede4'}, ...]
import { rgbToLab, hue } from './color'

export function classifyDepth(lab) {
  let best = { level: 1, d: Infinity }
  for (const s of monk) {
    const m = rgbToLab(hexToRgb(s.hex))
    const d = Math.hypot(lab.L-m.L, lab.a-m.a, lab.b-m.b)
    if (d < best.d) best = { level: s.level, d }
  }
  return best.level
}

// STARTING thresholds. Calibrate with real, diverse test photos.
export function classifyUndertone(lab) {
  const h = hue(lab)
  if (h < 50) return 'cool'       // pink / red leaning
  if (h < 60) return 'neutral'
  if (h < 68) return 'warm'       // golden / peach
  return 'olive'                  // yellow-green leaning: check lab.a is low
}
```

> The thresholds above are a **starting point only**. Run 15-20 volunteers across the full range, log the results, and tune. Present output as a *recommended range* (level +/- 1), never as a single exact shade.

### Step 5: Lighting Check (Hour 16-18)

- Compute mean luminance of the frame. If it is too low (<35 L*) or too high (>85 L*), prompt a retake.
- Compare the average of the left and right cheek L*. If the difference exceeds ~12, warn "uneven lighting, face a window".
- Optional: add a white-card reference step and normalise RGB by the card's average.

### Step 6: Recommendation Engine (Hour 18-24)

**src/data/rules.json** shape:
```json
{
  "deep-warm": {
    "label": "Deep, warm undertone",
    "foundation": "Look for shades with golden-red or mahogany bases. Avoid grey-toned or white-based shades.",
    "shadeRange": "Monk 8-9",
    "correctors": "Orange or deep-red corrector for dark circles. Never use peach on deep skin.",
    "blush": ["Berry", "Burnt orange", "Deep coral"],
    "lips": ["Wine", "Brick red", "Rich plum", "Warm terracotta"],
    "highlighter": ["Bronze", "Copper", "Rich gold"],
    "techniques": [
      "Test shades on jawline AND neck in natural light",
      "Do not use setting powder with white or grey cast; use a deep translucent or tinted one",
      "Skip flash-heavy SPF products for photos; do a flash test at the trial"
    ],
    "avoid": ["Lightening the whole face", "Heavy white-based powder", "Chalky nude lipstick"]
  }
}
```

Keys are `{depthGroup}-{undertone}`. Groups: `fair` (1-3), `light-medium` (4-5), `tan` (6-7), `deep` (8-10). Three depth groups multiplied by four undertones gives roughly 16 entries. Review the content with 2-3 professional MUAs before demo day.

### Step 7: Brief + Show My Artist (Hour 24-28)

- **Brief page:** render skin profile, shade range, product palette swatches and a technique list.
- **Export:** `window.print()` with a print stylesheet, or `jspdf`.
- **Show My Artist page:** a large-type, high-contrast, single-screen summary with a "Trial checklist" the bride can tick off.
- Save briefs to the `briefs` table for logged-in users (numbers only, no image).

### Step 8: Artist Directory (Hour 28-34)

- Artists sign up, choose the "artist" role and fill in a profile.
- Upload portfolio images to the Supabase Storage `portfolios` bucket with a Monk-level tag on each.
- Brides filter by `Monk level` and `city`.
- Seed 8-10 demo artists with a SQL insert script.

### Step 9: Deploy (Hour 34-38)

```bash
git init && git add . && git commit -m "HueMatch MVP"
# push to GitHub, then import the repo in Vercel
# add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Vercel > Settings > Environment Variables
```

Add the Vercel URL to Supabase's redirect URLs.

---

## 7. Testing Checklist

- [ ] Scan works on Android Chrome and iOS Safari
- [ ] Tested with volunteers across at least Monk 2, 4, 6, 8, 10
- [ ] Bad lighting triggers the warning
- [ ] No face detected shows a friendly retry message
- [ ] Guest flow works without login
- [ ] Magic link login and logout work
- [ ] RLS blocks reading other users' briefs (test with two accounts)
- [ ] Camera permission denied shows a clear message
- [ ] Lighthouse mobile performance > 80

---

## 8. Reusable AI Prompts (ART format)

Use these with any AI assistant to speed up the build.

### Prompt A: Recommendation content
**A:** Act as a professional bridal makeup artist with 15 years of experience working on all skin tones.
**R:** Write recommendations for the combination `[depth group] + [undertone]`.
**T:** Return JSON matching the `rules.json` shape. Include foundation guidance, correctors, blush, lips, highlighter, 3 technique tips and 3 things to avoid. Never suggest lightening the skin. Keep each tip under 20 words.

### Prompt B: Component generation
**A:** Act as a senior React engineer who writes accessible, mobile-first Tailwind code.
**R:** Build the `[ComponentName]` component described below.
**T:** Functional component with hooks, Tailwind only, no extra libraries, WCAG AA contrast, touch targets >= 44px, add short comments, return a single file.

### Prompt C: Test data
**A:** Act as a QA engineer.
**R:** Generate 10 seed artist profiles for the `artists` table.
**T:** SQL insert statements only. Diverse cities in India, Monk-level expertise arrays, realistic bios under 40 words, no real people's names.

---

## 9. Troubleshooting

| Problem | Fix |
|---|---|
| Camera doesn't open | Must use HTTPS or localhost; check browser permissions |
| MediaPipe model won't load | Check the network tab; self-host the `.task` file in `/public` |
| Colors look wrong on some phones | Auto white balance and beauty filters: disable the filter, use the white-card step |
| Magic link redirects wrongly | Add exact URLs in Supabase Auth > URL Configuration |
| RLS returns empty data | Confirm policies exist and the user is authenticated |
