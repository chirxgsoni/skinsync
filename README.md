# 🎨 HueMatch Bridal

> *"Your skin. Your wedding. Enhanced, not erased."*

HueMatch Bridal is a mobile-first web application designed to empower brides — especially those with deep, warm, and olive complexions across diverse Indian skin tones — with an objective, affirming **Complexion Brief** to share with their wedding makeup artists.

---

## ✨ Features

- 📱 **Client-Side Face Detection & Skin Sampling:** Built with Google MediaPipe Tasks Vision (`FaceLandmarker`). Evaluates 478 landmarks, isolating stable regions (cheeks and forehead).
- 🔒 **100% Privacy-Preserving:** The camera stream and uploaded images **never leave the device**. All color conversions and analysis run entirely in-browser.
- 🌈 **Rigorous Color Science:** Converts sRGB to linearized XYZ (D65) and CIELAB space. Computes Individual Typology Angle (ITA) and hue angles.
- 🎚️ **Monk Skin Tone Scale (1–10):** Nearest-neighbour mapping to the 10 Monk swatches with dual-level shade range presentation (level ± 1).
- 📋 **Personalized Complexion Brief:** Deterministic rules engine (16 depth × undertone profiles) recommending foundations, color correctors, blush, lip & highlighter palettes, pro application tips, and items to avoid.
- 🔍 **Interactive Photo Landmark Viewer:** Displays sampled facial regions with cheek & forehead landmark overlays and patch agreement confidence indicator.
- 👁️ **Show My Artist Mode:** High-contrast, large-type, distraction-free view designed to be shown across a consultation table.
- 📄 **Branded PDF Export:** Generates an A4 downloadable PDF using `jspdf` or browser print styles (`@media print`).
- 🎨 **Artist Directory & Portfolio Filtering:** Search and filter verified makeup artists by city and Monk skin tone expertise. Pre-filtered directly from the bride's brief.
- 💼 **Artist Dashboard:** Profile management and portfolio uploader with required Monk-level tagging per image.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | React 19 + Vite 8 |
| **Styling** | Tailwind CSS v4 (`@theme` tokens: Plum, Marigold, Terracotta, Ivory, Espresso) |
| **Routing** | React Router v7 |
| **Computer Vision** | `@mediapipe/tasks-vision` (Face Landmarker, WASM runtime) |
| **Backend & Auth** | Supabase (PostgreSQL, Row-Level Security, Auth, Storage) |
| **PDF Generation** | `jspdf` |
| **Icons** | `lucide-react` |
| **Testing & Linting**| Vitest, Oxlint |

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18+ and npm
- A free Supabase project at [supabase.com](https://supabase.com)

### 2. Installation
```bash
git clone <repo-url>
cd huematch
npm install
```

### 3. Supabase Setup
1. In your Supabase Dashboard:
   - Go to **SQL Editor** and execute [`supabase/schema.sql`](supabase/schema.sql).
   - Execute [`supabase/seed.sql`](supabase/seed.sql) to populate 10 demo artists across Indian cities.
   - Go to **Storage** and create a public bucket named `portfolios`.
2. Create `.env.local` in the `huematch` folder:
   ```env
   VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
   VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
   ```

### 4. Running Locally
```bash
# Start development server
npm run dev

# Run unit tests (Vitest)
npm test

# Run linter (Oxlint)
npm run lint

# Production build
npm run build
```

---

## 🧪 Testing

The project includes unit tests for the core color science, classification, and rules engine:
- `tests/color.test.js`: sRGB → CIELAB conversions, ITA calculation, hue angles, distance metrics.
- `tests/classify.test.js`: Monk scale nearest-neighbour mapping, depth grouping, undertone classification.
- `tests/recommend.test.js`: Validates all 16 depth × undertone rules, ensures all required fields exist, and verifies compliance with affirming language guidelines (no prohibited bleaching/lightening terms).

Run tests at any time with:
```bash
npm test
```

---

## 📄 License & Attribution

- Built on the [Monk Skin Tone Scale](https://skintone.google) by Google, licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
