-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Events Table
create table public.events (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  description text,
  date timestamp with time zone not null,
  location text not null,
  price numeric not null default 0,
  quota integer not null,
  organizer_id uuid not null, -- References auth.users later
  status text not null default 'draft' check (status in ('draft', 'published', 'completed'))
);

-- Tickets Table
create table public.tickets (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  event_id uuid not null references public.events(id) on delete cascade,
  buyer_name text not null,
  buyer_email text not null,
  buyer_phone text,
  status text not null default 'pending' check (status in ('pending', 'paid', 'scanned', 'cancelled')),
  payment_proof_url text,
  referral_code text,
  scanned_at timestamp with time zone
);

-- Referrals Table (for Panitia)
create table public.referrals (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  event_id uuid not null references public.events(id) on delete cascade,
  code text not null unique,
  name text not null, -- Name of the committee member
  sales_count integer not null default 0
);

-- RLS Policies (Basic setup, can be refined later)
alter table public.events enable row level security;
alter table public.tickets enable row level security;
alter table public.referrals enable row level security;

-- Allow public read access to published events
create policy "Public can view published events" on public.events
  for select using (status = 'published');

-- Allow public to insert tickets (buy tickets)
create policy "Public can insert tickets" on public.tickets
  for insert with check (true);

-- Allow public to view their own ticket (needs refinement based on auth/session)
-- For MVP, we might just use a unique link or email verification
create policy "Public can view tickets" on public.tickets
  for select using (true);

-- Allow public to view referrals (for leaderboard/tracking)
create policy "Public can view referrals" on public.referrals
  for select using (true);