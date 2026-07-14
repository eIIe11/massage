-- Luxe Health Massage — booking + availability schema
-- Run this in the Supabase SQL editor (or via `supabase db push`).

-- =========================================================================
-- Tables
-- =========================================================================

-- Customer booking requests. Anyone may INSERT; only the owner may read/manage.
create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  service_name text not null,
  minutes int not null,
  mode text not null default 'spa',
  people int not null default 1,
  booking_date date not null,
  booking_time text not null,          -- 'HH:MM'
  name text,
  notes text,
  status text not null default 'pending'  -- pending | confirmed | cancelled
);

-- Manual "unavailable" slots the owner blocks off in the dashboard.
create table if not exists public.blocks (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  block_date date not null,
  block_time text not null,            -- 'HH:MM'
  unique (block_date, block_time)
);

create index if not exists bookings_date_idx on public.bookings (booking_date);
create index if not exists blocks_date_idx on public.blocks (block_date);

-- =========================================================================
-- Row Level Security
-- =========================================================================
alter table public.bookings enable row level security;
alter table public.blocks   enable row level security;

-- Public may create a booking request (no reading of others' data).
drop policy if exists "anon insert bookings" on public.bookings;
create policy "anon insert bookings"
  on public.bookings for insert
  to anon, authenticated
  with check (true);

-- Only signed-in owner can read/update/delete bookings.
drop policy if exists "owner read bookings" on public.bookings;
create policy "owner read bookings"
  on public.bookings for select to authenticated using (true);

drop policy if exists "owner update bookings" on public.bookings;
create policy "owner update bookings"
  on public.bookings for update to authenticated using (true) with check (true);

drop policy if exists "owner delete bookings" on public.bookings;
create policy "owner delete bookings"
  on public.bookings for delete to authenticated using (true);

-- Only the signed-in owner manages manual blocks.
drop policy if exists "owner manage blocks" on public.blocks;
create policy "owner manage blocks"
  on public.blocks for all to authenticated using (true) with check (true);

-- =========================================================================
-- Public availability RPC — returns only the taken hourly slots for a date,
-- expanding each booking across the hours its duration occupies. Exposes no
-- customer PII, so it is safe to call anonymously.
-- =========================================================================
create or replace function public.taken_slots(d date)
returns table (slot_time text)
language sql
security definer
set search_path = public
as $$
  -- expand each active booking into the hourly slots it occupies
  select to_char(
           (b.booking_time::time) + make_interval(hours => g.i),
           'HH24:MI'
         ) as slot_time
  from public.bookings b
  cross join lateral generate_series(0, greatest(0, ceil(b.minutes / 60.0)::int - 1)) as g(i)
  where b.booking_date = d
    and b.status <> 'cancelled'
  union
  select bl.block_time
  from public.blocks bl
  where bl.block_date = d;
$$;

grant execute on function public.taken_slots(date) to anon, authenticated;
