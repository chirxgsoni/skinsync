-- HueMatch Bridal: Database Schema
-- Run this in the Supabase SQL Editor

-- ═══════════════════════════════════════════
-- 1. TABLES
-- ═══════════════════════════════════════════

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
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
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

-- ═══════════════════════════════════════════
-- 2. INDEXES
-- ═══════════════════════════════════════════

create index on public.artists using gin (monk_expertise);
create index on public.artists (city);
create index on public.portfolio_items (artist_id, monk_level);

-- ═══════════════════════════════════════════
-- 3. ROW LEVEL SECURITY
-- ═══════════════════════════════════════════

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
