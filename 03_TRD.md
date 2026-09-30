# Technical Requirements Document (TRD): SkinSync

| | |
|---|---|
| **Version** | 1.0 (Hackathon MVP) |
| **Companion docs** | 02_PRD.md, 04_DESIGN.md |

---

## 1. Architecture Overview

A serverless, client-heavy architecture. All computer vision runs in the browser; Supabase provides auth, data and file storage.

```
+----------------------------- Browser (React + Vite) -----------------------------+
|  Camera > Canvas > MediaPipe Face Landmarker > Skin patches > LAB > Classifier   |
|  Rules engine (rules.json) > Brief UI > Print/PDF                                 |
+-------------------------------------+---------------------------------------------+
                                      | HTTPS (supabase-js)
                        +-------------v--------------+
                        |          Supabase          |
                        |  Auth | Postgres+RLS | Storage |
                        +----------------------------+
              Hosting: Vercel (static SPA)   CDN: jsDelivr / GCS (MediaPipe assets)
```

**Key principle:** the selfie never leaves the device. Only derived numbers are stored, and only for logged-in users.

## 2. Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| UI | React 18 + Vite | Fast dev, simple build |
| Styling | Tailwind CSS | Rapid mobile-first UI |
| Routing | React Router v6 | Standard SPA routing |
| State | React hooks + Context | Enough for MVP |
| Vision | @mediapipe/tasks-vision | In-browser, free, accurate landmarks |
| Auth | Supabase Auth | Magic link, Google, JWT sessions |
| Database | Supabase Postgres | Relational, RLS |
| Files | Supabase Storage | Portfolio images |
| PDF | Browser print CSS / jspdf | No server needed |
| Hosting | Vercel | Free HTTPS, previews |

## 3. Core Algorithms

### 3.1 Skin sampling
1. Detect 478 face landmarks on the captured still.
2. Convert chosen landmarks (left cheek, right cheek, forehead) to pixel coordinates.
3. Take a 12x12 px patch at each; use the **per-channel median** to reject highlights, freckles and blemishes.
4. Average the three patch medians into one RGB value; keep the individual values for the lighting-consistency check.

### 3.2 Color conversion
sRGB > linearise > XYZ (D65) > CIELAB. Derived metrics:

- **ITA (Individual Typology Angle)** = arctan((L* - 50) / b*) x 180/pi. Lower value means deeper skin.
- **Hue angle** h = atan2(b*, a*). Used for undertone.

### 3.3 Depth classification
Nearest neighbour in LAB between the sampled color and the 10 Monk Skin Tone swatches. Return the level and the second-nearest level to present a range.

### 3.4 Undertone classification
Hue-angle bands plus an a*/b* check for olive (yellow-green, low a*). Starting thresholds are documented in the build guide and **must be calibrated** on a diverse volunteer set. Confidence is reduced when the three patches disagree.

### 3.5 Lighting quality
| Check | Rule (tunable) |
|---|---|
| Too dark | mean L* < 35 |
| Overexposed | mean L* > 85 or > 5% clipped pixels |
| Uneven | abs(L*_leftCheek - L*_rightCheek) > 12 |
| Color cast | mean a* / b* of a neutral reference (if white card used) deviates from neutral |

Any failed check surfaces a plain-language retake tip.

### 3.6 Recommendation engine
Deterministic lookup: `rules[depthGroup + '-' + undertone]`. Depth groups: fair (1-3), light-medium (4-5), tan (6-7), deep (8-10). No runtime AI calls (keeps it free, fast and predictable).

## 4. Data Flow

```
Capture > Detect > Sample > LAB > Classify > Lighting OK?
   no > Retake prompt
   yes > Recommend > Render Brief > [logged in?] > Save to briefs table
```

## 5. Database Schema (run in Supabase SQL Editor)

```sql
-- Profiles (one row per auth user)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'bride' check (role in ('bride','artist','admin')),
  full_name text,
  city text,
  created_at timestamptz default now()
);

-- Auto-create profile on signup
create function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name) values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- Saved briefs (numbers only, no images)
create table public.briefs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  monk_level int not null check (monk_level between 1 and 10),
  monk_alt int check (monk_alt between 1 and 10),
  undertone text not null check (undertone in ('cool','neutral','warm','olive')),
  lab jsonb,
  rule_key text not null,
  created_at timestamptz default now()
);

-- Artists
create table public.artists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  display_name text not null,
  bio text,
  city text not null,
  monk_expertise int[] not null default '{}',
  years_experience int,
  instagram text,
  approved boolean not null default false,
  created_at timestamptz default now()
);

-- Portfolio images
create table public.portfolio_items (
  id uuid primary key default gen_random_uuid(),
  artist_id uuid not null references public.artists(id) on delete cascade,
  image_path text not null,
  monk_level int not null check (monk_level between 1 and 10),
  caption text,
  created_at timestamptz default now()
);

-- Shade-accuracy reviews (P1)
create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  artist_id uuid not null references public.artists(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  shade_accuracy int not null check (shade_accuracy between 1 and 5),
  comment text,
  created_at timestamptz default now(),
  unique (artist_id, user_id)
);

create index on public.artists using gin (monk_expertise);
create index on public.artists (city);
create index on public.portfolio_items (artist_id, monk_level);
```

## 6. Row Level Security

```sql
alter table public.profiles        enable row level security;
alter table public.briefs          enable row level security;
alter table public.artists         enable row level security;
alter table public.portfolio_items enable row level security;
alter table public.reviews         enable row level security;

-- profiles: read/update own
create policy "own profile read"   on public.profiles for select using (auth.uid() = id);
create policy "own profile update" on public.profiles for update using (auth.uid() = id);

-- briefs: full control of own rows only
create policy "own briefs" on public.briefs for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- artists: public can read approved; owner can manage own
create policy "public read approved artists" on public.artists for select using (approved = true);
create policy "owner read own artist"  on public.artists for select using (auth.uid() = user_id);
create policy "owner insert artist"    on public.artists for insert with check (auth.uid() = user_id);
create policy "owner update artist"    on public.artists for update using (auth.uid() = user_id);

-- portfolio: public read for approved artists; owner writes
create policy "public read portfolio" on public.portfolio_items for select
  using (exists (select 1 from public.artists a where a.id = artist_id and a.approved));
create policy "owner manage portfolio" on public.portfolio_items for all
  using (exists (select 1 from public.artists a where a.id = artist_id and a.user_id = auth.uid()))
  with check (exists (select 1 from public.artists a where a.id = artist_id and a.user_id = auth.uid()));

-- reviews: public read, authors write own
create policy "public read reviews" on public.reviews for select using (true);
create policy "own review write"    on public.reviews for insert with check (auth.uid() = user_id);
```

**Storage policy (bucket `portfolios`):** public read; authenticated users may upload only to a folder named with their own user id (`(storage.foldername(name))[1] = auth.uid()::text`).

> For the hackathon demo, set `approved = true` on seeded artists manually. Never expose the `service_role` key in the client.

## 7. Client API Usage

| Action | Call |
|---|---|
| Sign in (magic link) | `supabase.auth.signInWithOtp({ email })` |
| Session | `supabase.auth.getSession()` / `onAuthStateChange` |
| Save brief | `supabase.from('briefs').insert({...})` |
| List artists by tone | `supabase.from('artists').select('*').contains('monk_expertise',[level]).eq('city',city)` |
| Portfolio for artist | `supabase.from('portfolio_items').select('*').eq('artist_id', id)` |
| Upload image | `supabase.storage.from('portfolios').upload(`${uid}/${file.name}`, file)` |

## 8. Routing Map

| Route | Access | Page |
|---|---|---|
| `/` | Public | Landing |
| `/login` | Public | Login |
| `/scan` | Public (guest OK) | Camera and capture |
| `/results` | Public | Detected profile |
| `/brief` | Public; save needs login | Complexion Brief |
| `/show-artist` | Public | One-screen artist view |
| `/artists` | Public | Directory |
| `/artists/:id` | Public | Artist detail |
| `/dashboard` | Auth (artist role) | Manage profile and portfolio |

## 9. Security and Privacy

- Selfie frames stay in memory and are discarded after analysis; no upload endpoints for them.
- RLS on every table; the anon key is safe to expose only because RLS is on.
- Validate and limit uploads (JPEG/PNG/WebP, max 5 MB, resized client-side).
- Sanitise any user-rendered text (React escapes by default; avoid `dangerouslySetInnerHTML`).
- Provide a clear privacy notice and a "delete my data" option (P1).
- HTTPS everywhere (Vercel default).

## 10. Performance Budget

| Metric | Target |
|---|---|
| First load JS (excluding model) | < 250 KB gzip |
| MediaPipe model | Lazy-load on the Scan page only |
| Time to interactive (4G) | < 4s |
| Scan compute | < 1s after capture |
| Images | Resize to max 1200px before upload; lazy-load in lists |

## 11. Testing Strategy

| Type | Approach |
|---|---|
| Unit | Vitest for `color.js`, `classify.js`, `recommend.js` with known RGB fixtures |
| Manual accuracy | 15-20 volunteers, compare app output to a MUA's assessment, log deviation |
| Device | Android Chrome, iOS Safari, desktop Chrome |
| Security | Two-account test to confirm RLS isolation |
| Accessibility | Lighthouse and axe DevTools, keyboard-only pass |

## 12. CI/CD and Environments

- **Repo:** GitHub, `main` protected, feature branches.
- **CI:** GitHub Actions running `npm ci && npm run lint && npm test && npm run build`.
- **CD:** Vercel auto-deploys `main`, preview URL per PR.
- **Environments:** local, preview, production (one Supabase project is fine for the hackathon; split later).
- **Secrets:** `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` in Vercel env vars.

## 13. Known Technical Risks

| Risk | Mitigation |
|---|---|
| Phone beauty filters and auto white balance alter color | Advise disabling filters, white-card calibration |
| Undertone is subjective and hard to measure | Present confidence and let the user confirm or adjust manually |
| MediaPipe CDN outage | Self-host wasm and model in `/public` |
| Supabase free-tier limits or project pausing when idle | Keep the project active before demo; export SQL for quick restore |
| iOS Safari camera quirks | Use `playsinline`, test early, offer photo-upload fallback |

## 14. Future Technical Work

- Edge Function for artist-brief sharing via secure links
- Server-side rate limiting and abuse controls
- Model calibration dataset and per-device profiles
- Optional lightweight ML classifier trained on labeled samples
- i18n with react-i18next
