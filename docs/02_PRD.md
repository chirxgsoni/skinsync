# Product Requirements Document (PRD): HueMatch Bridal

| | |
|---|---|
| **Version** | 1.0 (Hackathon MVP) |
| **Status** | Draft |
| **Tagline** | Your skin. Your wedding. Enhanced, not erased. |

---

## 1. Background and Problem

Brides with deeper, olive, or warm/cool-toned skin often report that makeup artists (MUAs) apply one default "fair and lovely" style look to every client. The result is ashy, cakey, over-lightened makeup that doesn't look like the bride and looks wrong in photographs.

**Root causes**

1. **Bias:** a lighter complexion is treated as the ideal.
2. **Skill and product gap:** limited training and limited shade ranges in the artist's kit.
3. **Communication gap:** brides lack the vocabulary (undertone, depth, corrector) to say what they need, and artists lack a structured intake.

## 2. Vision and Goals

**Vision:** every bride sees herself on her wedding day, radiant and recognisably herself.

| Goal | Success metric (MVP) |
|---|---|
| Give brides a clear language for their skin | 80% of testers say the brief "describes my skin accurately" |
| Give artists an actionable brief | 70% of artists rate the brief "useful for a trial" |
| Make the scan trustworthy | Depth within +/- 1 Monk level for 80% of test volunteers |
| Fast experience | Scan to brief in under 60 seconds |

**Non-goals (MVP):** AR try-on, payments, booking, e-commerce, medical/skin-condition diagnosis, storing selfies.

## 3. Target Users and Personas

**Persona 1: Meera, the bride (primary)**
26, Chennai, deep-warm skin, planning her wedding. Was made up two shades too light at her last trial. Wants to walk in with something concrete.
*Needs:* an accurate skin profile, words to describe it, an artist who has done work on skin like hers.

**Persona 2: Riya, the MUA (secondary)**
31, freelance bridal artist. Wants to serve every client well but lacks a reliable intake process and struggles to showcase work on deeper tones.
*Needs:* a structured client brief, a portfolio that is discoverable by skin range, and new bookings.

**Persona 3: Aman, the wedding planner (tertiary)**
Coordinates vendors and wants trustworthy artist recommendations for diverse clients.

## 4. User Stories

### Brides
- As a bride, I can scan my face in natural light and see my skin depth and undertone.
- As a bride, I can see a warning when the photo lighting is unreliable.
- As a bride, I can get a Complexion Brief with shade ranges and technique tips.
- As a bride, I can show my artist a clean one-screen summary.
- As a bride, I can download or share the brief as a PDF/link.
- As a bride, I can browse artists filtered by skin-tone expertise and city.
- As a bride, I can sign up to save my brief and shortlist artists.
- As a bride, I can rate an artist on "shade accuracy" after the wedding (P1).

### Artists
- As an artist, I can create a profile with city, services and bio.
- As an artist, I can upload portfolio photos and tag each with a Monk level.
- As an artist, I can see briefs that brides choose to share with me (P1).

### Admin (P1)
- As an admin, I can approve artist profiles and remove abusive reviews.

## 5. Functional Requirements

Priority: **P0** = must ship for demo, **P1** = should, **P2** = later.

| ID | Requirement | Priority |
|---|---|---|
| F1 | Camera capture with permission handling and a photo-upload fallback | P0 |
| F2 | Face detection and skin-patch sampling (cheeks, forehead) in browser | P0 |
| F3 | Depth (Monk 1-10) and undertone (cool / neutral / warm / olive) classification | P0 |
| F4 | Lighting quality check with retake prompt | P0 |
| F5 | Rules-based recommendation engine (foundation, correctors, blush, lips, highlighter, techniques, avoid-list) | P0 |
| F6 | Complexion Brief page with print/PDF export | P0 |
| F7 | "Show my artist" mode with trial checklist | P0 |
| F8 | Email authentication via Supabase (magic link) | P0 |
| F9 | Guest scan without account | P0 |
| F10 | Save briefs to account | P0 |
| F11 | Artist directory with Monk-level and city filters | P0 |
| F12 | Artist profile page with tagged portfolio | P0 |
| F13 | Artist onboarding and portfolio upload | P1 |
| F14 | Shade-accuracy rating and review | P1 |
| F15 | Share brief with a specific artist | P1 |
| F16 | White-card color calibration step | P1 |
| F17 | Google sign-in | P1 |
| F18 | Multilingual UI (Hindi first) | P2 |
| F19 | AR shade preview | P2 |

## 6. Non-Functional Requirements

| Area | Requirement |
|---|---|
| **Privacy** | Selfies processed in-browser only, never uploaded or stored. Only numeric results (depth, undertone, LAB values) are saved, and only if the user is logged in and consents. |
| **Performance** | Model loads < 5s on 4G; scan result < 3s after capture |
| **Accessibility** | WCAG 2.1 AA contrast, 44px touch targets, screen-reader labels, no reliance on color alone |
| **Compatibility** | Latest Chrome/Safari on Android and iOS; desktop Chrome/Edge |
| **Security** | Row Level Security on all tables; no secrets in the client except the Supabase anon key |
| **Reliability** | Graceful failures: no camera, no face, low light |
| **Cost** | Runs entirely on free tiers |
| **Inclusivity** | Tested on volunteers across the full Monk scale before release |

## 7. Key User Flows

**Bride flow:** Landing > Scan (guest OK) > Lighting check > Results > Brief > (Sign up to save) > Artists > Artist detail > Show my artist.

**Artist flow:** Sign up > Choose "I'm an artist" > Profile > Upload and tag portfolio > Profile live (pending approval in P1).

## 8. Content Requirements

- Recommendation content reviewed by at least 2 professional MUAs with experience on deeper skin tones.
- Language is affirming: describe skin as "deep, warm, golden" rather than "dark" or "problem".
- Never recommend lightening, whitening or "brightening" the base tone.
- Disclaimer: "Results are a guide. Always confirm shades in natural light with your artist."

## 9. Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Camera/lighting distorts color | Wrong recommendation | Lighting check, white-card step, show a range not a single shade |
| Classifier biased toward lighter skin | Undermines product mission | Test on diverse faces, publish accuracy, tune thresholds per depth |
| Rules lack credibility | Low trust | MUA review and attribution |
| Artist cold-start (empty directory) | Weak marketplace | Seed demo data, partner with a few artists early |
| Privacy concerns about face scans | Low adoption | On-device processing, clear privacy notice |
| Scope creep | Missed demo | Strict P0 list, roadmap the rest |

## 10. Success Metrics (post-launch)

- Scan completion rate > 70%
- Brief download/share rate > 50% of completed scans
- Artist profiles created > 50 in first 3 months
- Bride-reported shade accuracy satisfaction > 4/5

## 11. Assumptions and Open Questions

- Users have a phone camera and can access natural light.
- Which regional shade brands should the first version reference? (Leave brand-neutral for MVP.)
- Should artists pay for listing? (Deferred to the roadmap.)
- Which languages come after English and Hindi?

## 12. Release Criteria for Hackathon Demo

- [ ] All P0 requirements working on a real phone
- [ ] Tested with 8+ diverse volunteers
- [ ] 8-10 seeded artist profiles
- [ ] Deployed on a public HTTPS URL
- [ ] Privacy note visible on the scan screen
