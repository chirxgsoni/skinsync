# Roadmap: SkinSync

All phases are designed to run on **free tools and free tiers**. Timelines are estimates for a small team (3-4 people) and should be adjusted after each phase.

---

## Phase 0: Discovery (before the hackathon, 2-3 days)

- [ ] Interview 5+ brides and 3+ makeup artists about pain points
- [ ] Run a 10-question Google Form poll; collect at least 30 responses for pitch statistics
- [ ] Find 2-3 professional MUAs willing to review recommendation content
- [ ] Gather 10+ volunteer testers across the skin tone range
- [ ] Set up GitHub repo, Figma file and Supabase project

**Exit criteria:** validated problem, real quotes for the pitch, MUA reviewers confirmed.

---

## Phase 1: Hackathon MVP (24-48 hours)

| Hours | Milestone | Owner |
|---|---|---|
| 0-3 | Scope lock, Figma wireframes for 4 core screens | Design/pitch |
| 0-3 | Vite + React + Tailwind + Supabase scaffold, deploy hello-world | Frontend |
| 3-8 | Supabase auth (magic link) and protected routes | Frontend/Backend |
| 3-12 | Camera capture, MediaPipe landmarks, skin sampling | CV dev |
| 12-16 | LAB conversion, depth and undertone classifier | CV dev |
| 12-18 | Rules table (about 16 entries) and brief generator | Backend/content |
| 16-20 | Lighting check and retake flow | CV dev |
| 18-26 | Results, Brief, Show My Artist pages | Frontend |
| 24-32 | Artist directory, seeded data, filters, detail page | Frontend/Backend |
| 30-36 | Test with volunteers, tune thresholds, fix bugs | All |
| 36-42 | Demo video, slides, pitch rehearsal | Design/pitch |
| 42-48 | Buffer, polish, final deploy check | All |

**Demo-ready checklist**
- [ ] Works on a real phone over HTTPS
- [ ] 8+ diverse scans logged with accuracy notes
- [ ] 8-10 seeded artists with tagged portfolios
- [ ] Backup screen recording in case of Wi-Fi or camera issues
- [ ] 3-minute pitch rehearsed at least 3 times

**Exit criteria:** end-to-end flow (scan, brief, show artist, browse artists) works without errors.

---

## Phase 2: Beta Hardening (weeks 1-4 after hackathon)

Goal: make it trustworthy enough for real brides.

- [ ] Calibration dataset: collect 100+ consented samples with MUA-labelled ground truth
- [ ] Tune depth/undertone thresholds per depth group; document accuracy
- [ ] White-card color calibration step (F16)
- [ ] Manual override sliders on Results page
- [ ] Artist onboarding flow and portfolio upload (F13)
- [ ] Artist approval workflow (admin flag)
- [ ] "Share brief with artist" via secure link (F15)
- [ ] Google sign-in (F17)
- [ ] Vitest unit tests and GitHub Actions CI
- [ ] Privacy policy, terms, and delete-my-data
- [ ] Accessibility audit and fixes
- [ ] Closed beta with 20-30 brides and 10 artists; collect feedback

**Exit criteria:** 80% of beta users say the profile matches their skin, and no critical bugs for two weeks.

---

## Phase 3: Public Launch (months 2-3)

- [ ] Shade-accuracy reviews and ratings (F14)
- [ ] Hindi UI, then Tamil, Bengali, Marathi (i18n)
- [ ] City pages and SEO landing pages for wedding markets
- [ ] Content: "Foundation undertone guide," "Bridal makeup for deep skin," and similar posts
- [ ] Share cards for Instagram/WhatsApp ("My Complexion Brief")
- [ ] Simple analytics (free plan of Plausible-alternative or Umami self-hosted, or Vercel Analytics free tier)
- [ ] Launch on Product Hunt, Reddit wedding communities, Instagram with artist partners
- [ ] Onboard 50+ artists across 5 cities

**Exit criteria:** 1,000 completed scans, 50+ artist profiles, satisfaction above 4/5.

---

## Phase 4: Growth and Monetisation (months 4-6)

| Stream | Details |
|---|---|
| Artist premium listing | Verified badge, featured placement, analytics dashboard |
| Brand partnerships | Inclusive-shade foundation brands sponsor palette recommendations (clearly labelled) |
| Affiliate links | Recommended shade ranges link to retailers |
| Bridal packages | Partner with salons, planners and photographers |
| In-app booking | Availability calendar and deposits (payment gateway with free signup) |

- [ ] Booking and inquiry system
- [ ] Trial-session checklists and reminders
- [ ] Reviews with photo proof (with consent)
- [ ] Referral program for brides and artists

**Exit criteria:** first paying artists and at least one brand partner.

---

## Phase 5: Advanced Product (months 6-12)

- [ ] AR shade try-on using face mesh overlays
- [ ] Lightweight ML model trained on the calibration dataset
- [ ] Skin concern awareness (dryness, oiliness) for prep and product guidance
- [ ] Artist training content: "Makeup for every skin tone" mini-courses and certification badge
- [ ] Wedding-day timeline planner (trial, prep, day-of)
- [ ] Native mobile app wrapper (PWA first, Capacitor if needed)
- [ ] Expansion beyond bridal: festive, editorial, everyday

---

## Feature Priority Matrix

| Feature | Impact | Effort | When |
|---|---|---|---|
| Scan + classification | High | High | Phase 1 |
| Complexion Brief | High | Medium | Phase 1 |
| Show My Artist | High | Low | Phase 1 |
| Artist directory | High | Medium | Phase 1 |
| Lighting check | High | Low | Phase 1 |
| White-card calibration | High | Medium | Phase 2 |
| Share brief with artist | Medium | Medium | Phase 2 |
| Reviews | Medium | Low | Phase 3 |
| Multilingual | High | Medium | Phase 3 |
| Booking | High | High | Phase 4 |
| AR try-on | Medium | High | Phase 5 |

---

## Team and Roles

| Role | Responsibilities |
|---|---|
| Frontend / UI | React pages, Tailwind, responsive and accessible UI |
| CV / Color | MediaPipe, LAB pipeline, classifier, calibration |
| Backend / Data | Supabase schema, RLS, seed data, rules content with MUAs |
| Design / Pitch | Figma, branding, research, demo, storytelling |

---

## Budget (target: Rs. 0 for MVP)

| Item | Cost |
|---|---|
| Hosting (Vercel) | Free |
| Backend (Supabase) | Free |
| Domain | Optional; use the free `.vercel.app` subdomain initially |
| Design (Figma) | Free |
| CI (GitHub Actions) | Free |
| Fonts / icons | Free |
| Testing devices | Team phones |

Costs to expect later: custom domain, Supabase Pro if limits are reached, payment gateway fees, and paid photography for marketing.

---

## Risks and Contingencies

| Risk | Contingency |
|---|---|
| Accuracy not good enough | Ship as "guided self-assessment": the scan suggests, the user confirms |
| Too few artists at launch | Curate a founding-artist group, offer free premium for the first year |
| Free-tier limits | Cache and paginate, archive old data, upgrade only when revenue exists |
| Privacy backlash | Keep processing on-device, publish a plain-language privacy page |
| Team time constraints | Cut P1 items first, never cut testing on diverse skin tones |

---

## Success Metrics by Phase

| Phase | Key metric |
|---|---|
| 1 | Working end-to-end demo, 8+ diverse test scans |
| 2 | 80% profile-accuracy satisfaction in beta |
| 3 | 1,000 scans, 50 artists |
| 4 | First paying artists, first brand partner |
| 5 | Retention: 30% of brides return for a second use (trial, festive looks) |

---

## Hackathon Pitch Checklist

- [ ] 30-second hook with a real story or statistic
- [ ] Live demo with a volunteer on stage
- [ ] Show accuracy results across the skin range
- [ ] Mention MUA reviewers by role (with permission)
- [ ] Clear ask and next steps (roadmap slide from this file)
- [ ] Backup video ready
