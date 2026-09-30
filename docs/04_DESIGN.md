# Website Design Document: SkinSync

Design principle: **celebrate, never correct.** Every visual and word choice should make a bride feel beautiful in her own skin. Mobile-first, since most users will scan on a phone.

---

## 1. Brand

| | |
|---|---|
| **Name** | SkinSync |
| **Tagline** | Your skin. Your wedding. Enhanced, not erased. |
| **Voice** | Warm, confident, affirming. Like a friend who is also an expert. |
| **Never say** | "fix", "lighten", "brighten your tone", "flawless", "dark skin problem" |
| **Prefer** | "deep", "golden", "rich", "radiant", "your natural glow" |

## 2. Color Palette (all free, contrast-checked)

| Role | Name | Hex |
|---|---|---|
| Primary | Deep Plum | `#5B1A3A` |
| Primary hover | Mulberry | `#7A2450` |
| Accent | Marigold Gold | `#E0A526` |
| Accent 2 | Terracotta | `#C4623F` |
| Background | Warm Ivory | `#FBF6EF` |
| Surface | White | `#FFFFFF` |
| Text | Espresso | `#2B1B17` |
| Muted text | Cocoa | `#6B5750` |
| Border | Sand | `#E8DCCF` |
| Success | Sage | `#3F7D5C` |
| Warning | Amber | `#B7791F` |
| Error | Brick | `#B3382C` |

Plum on ivory and espresso on ivory pass WCAG AA for body text. Marigold is for accents and large elements only; avoid it as small text on ivory.

The 10 **Monk skin tone swatches** appear as a row of circles in results and filters (source: Monk Skin Tone Scale, Google, CC BY 4.0; credit in the footer).

## 3. Typography (Google Fonts, free)

| Use | Font | Weights |
|---|---|---|
| Headings | Playfair Display | 600, 700 |
| Body and UI | Inter | 400, 500, 600 |

Scale (mobile): H1 32px, H2 24px, H3 20px, body 16px, caption 13px. Line-height 1.5 for body.

## 4. Layout and Spacing

- 4px base unit; spacing scale 4/8/12/16/24/32/48.
- Max content width 1100px desktop; full-bleed with 16px padding on mobile.
- Border radius: 12px cards, 999px pills/buttons.
- Shadow: `0 4px 16px rgba(91,26,58,0.08)`.
- Breakpoints: 640 (sm), 768 (md), 1024 (lg).

## 5. Components

| Component | Notes |
|---|---|
| Button (primary) | Plum background, ivory text, 48px height, pill shape |
| Button (secondary) | Outlined plum, transparent |
| Skin swatch | 40px circle with 3px ring when selected, label for screen readers |
| Undertone chip | Cool / Neutral / Warm / Olive, each with a small icon plus text (not color alone) |
| Profile card | Swatch, depth range, undertone, confidence bar |
| Palette chip row | Blush / lip / highlighter swatches with names |
| Tip list | Check icon for do, cross icon for avoid |
| Artist card | Cover image, name, city, expertise swatches, rating |
| Lighting banner | Amber with a plain-language tip and a Retake button |
| Toast | Bottom on mobile, top-right on desktop |
| Skeleton loader | For artist lists and model loading |

## 6. Page Designs (wireframe descriptions)

### 6.1 Landing (`/`)
- **Hero:** big headline "Your skin. Your wedding. Enhanced, not erased." Subtext: "Get a personal Complexion Brief to take to your makeup artist." CTA: **Scan my skin** (primary), **Find an artist** (secondary).
- **Problem strip:** three short cards: *"Ashy in photos?" / "Two shades too light?" / "Artist didn't listen?"*
- **How it works:** 3 steps with icons (Scan, Get your brief, Find your artist).
- **Skin range strip:** row of 10 swatches with "Every tone. Every undertone."
- **Trust:** "Reviewed by professional makeup artists" + privacy line "Your photo never leaves your phone."
- **Footer:** links, Monk scale credit, privacy, contact.

### 6.2 Login (`/login`)
Single email field, "Send me a magic link" button, optional Google button, and a "Continue as guest" text link.

### 6.3 Scan (`/scan`)
- Full-screen camera with an oval face guide.
- Top: tips ("Face a window. No filters. Remove heavy makeup if you can.").
- Live lighting indicator (green / amber pill).
- Large circular capture button, fallback "Upload a photo".
- Privacy note pinned at the bottom: "Processed on your device. Never uploaded."

### 6.4 Results (`/results`)
- Captured photo thumbnail with small dots showing sample points.
- Profile card: **Depth: Monk 7-8**, **Undertone: Warm**, confidence bar.
- "Not quite right?" control lets the user nudge depth and undertone manually.
- CTAs: **View my brief**, **Retake**.

### 6.5 Brief (`/brief`)
Sections in order:
1. Your complexion summary (swatch, depth, undertone)
2. Foundation guidance and shade range
3. Correctors
4. Blush / lip / highlighter palettes (chips with names)
5. Technique tips (do list)
6. What to avoid (avoid list)
7. Trial-day checklist
- Sticky bottom bar: **Show my artist**, **Download PDF**, **Save** (prompts login for guests).

### 6.6 Show My Artist (`/show-artist`)
High-contrast single screen, large type, no navigation clutter: swatch, depth, undertone, top 5 must-dos and top 3 avoids, "Please test on jawline and neck in natural light." Designed to be shown to an artist across a table.

### 6.7 Artists (`/artists`)
- Filter bar: city dropdown, Monk swatch multi-select (pre-filled from her scan), sort (rating, experience).
- Grid of artist cards (1 column mobile, 2 tablet, 3 desktop).
- Empty state: "No artists in this city yet. Try a nearby city or join the waitlist."

### 6.8 Artist Detail (`/artists/:id`)
- Header: name, city, years of experience, Instagram link.
- Expertise swatches.
- Portfolio grid filterable by Monk level, with the level tag on each image.
- Shade-accuracy rating and reviews.
- CTA: **Share my brief** (P1) or **Contact via Instagram**.

### 6.9 Artist Dashboard (`/dashboard`)
Profile form, portfolio uploader with a required Monk level dropdown per image, approval status badge.

## 7. Key Interactions and States

| State | Behavior |
|---|---|
| Camera permission denied | Friendly card with steps to enable, plus upload fallback |
| No face found | "We couldn't see your face. Move closer and face the light." Retry button |
| Low light / uneven light | Amber banner with tip and retake |
| Model loading | Skeleton plus "Getting ready..." message |
| Offline | Toast "You're offline. Scanning still works; saving needs internet." |
| Empty artist list | Illustrated empty state with a waitlist CTA |
| Save as guest | Bottom sheet: "Create a free account to save your brief" |

## 8. Motion

- Subtle only: 150-250 ms ease-out transitions on buttons and cards.
- Results swatch fades in with a gentle scale.
- Respect `prefers-reduced-motion`.

## 9. Accessibility

- WCAG 2.1 AA contrast; visible focus rings (2px marigold outline).
- All swatches and chips have text labels; meaning is never color only.
- Touch targets at least 44x44 px.
- Semantic HTML, `aria-live` for lighting warnings and scan status.
- Alt text on portfolio images including the Monk level.
- Camera screen fully operable with a keyboard/screen reader (capture button labeled, upload alternative present).

## 10. Imagery and Inclusion Guidelines

- Use imagery of real brides across the full skin tone range, with **at least half of hero and marketing images featuring deep and olive complexions**.
- Free image sources: Unsplash, Pexels (check license), or the artists' own consented portfolio photos.
- Avoid heavy retouching or filters on any image.
- Never use before/after "lightening" comparisons.

## 11. Design Tokens (Tailwind theme snippet)

```css
@theme {
  --color-plum: #5B1A3A;
  --color-mulberry: #7A2450;
  --color-marigold: #E0A526;
  --color-terracotta: #C4623F;
  --color-ivory: #FBF6EF;
  --color-espresso: #2B1B17;
  --color-cocoa: #6B5750;
  --color-sand: #E8DCCF;
  --color-sage: #3F7D5C;
  --color-brick: #B3382C;
  --font-heading: "Playfair Display", serif;
  --font-body: "Inter", system-ui, sans-serif;
}
```

## 12. Figma Workflow (free plan)

1. Create a file with pages: Foundations, Components, Screens.
2. Set up color and text styles from the tables above.
3. Build components (button, chip, card, swatch) with variants.
4. Design 4 core mobile screens first: Scan, Results, Brief, Artists.
5. Link them in a prototype for the demo video.
6. Export the logo and icons as SVG.
