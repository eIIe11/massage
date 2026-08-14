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

-- Lightweight contact/enquiry tracking (phone tap, WhatsApp, email, socials…).
-- Anyone may INSERT; only the signed-in owner/dev may read.
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  type text not null,                  -- e.g. whatsapp_enquiry | phone_click | email_enquiry | instagram_click
  detail text
);

-- Private notification config for dev Telegram pings. RLS on with NO policy,
-- so it is unreadable by anon/authenticated — only the security-definer
-- trigger (and the service role) can read the token.
create table if not exists public.notify_config (
  id int primary key default 1,
  telegram_token text,
  telegram_chat_id text
);

create index if not exists bookings_date_idx on public.bookings (booking_date);
create index if not exists blocks_date_idx on public.blocks (block_date);
create index if not exists events_created_idx on public.events (created_at);

-- =========================================================================
-- Row Level Security
-- =========================================================================
alter table public.bookings      enable row level security;
alter table public.blocks        enable row level security;
alter table public.events        enable row level security;
alter table public.notify_config enable row level security;

-- Public may log a contact event (no reading).
drop policy if exists "anon insert events" on public.events;
create policy "anon insert events"
  on public.events for insert
  to anon, authenticated
  with check (true);

-- Only the signed-in owner/dev can read events (for stats).
drop policy if exists "owner read events" on public.events;
create policy "owner read events"
  on public.events for select to authenticated using (true);

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

-- =========================================================================
-- Capacity-aware availability. With several therapists on shift a slot stays
-- open until every therapist is busy, so this returns how many therapists are
-- occupied per hourly slot plus whether the owner blocked it outright.
-- Multi-person bookings occupy one therapist per guest. No PII exposed.
-- =========================================================================
create or replace function public.slot_load(d date)
returns table (slot_time text, busy int, blocked boolean)
language sql
security definer
set search_path = public
as $$
  with occupied as (
    select to_char(
             (b.booking_time::time) + make_interval(hours => g.i),
             'HH24:MI'
           ) as slot_time,
           greatest(1, coalesce(b.people, 1)) as people
    from public.bookings b
    cross join lateral generate_series(0, greatest(0, ceil(b.minutes / 60.0)::int - 1)) as g(i)
    where b.booking_date = d
      and b.status <> 'cancelled'
  ),
  busy_by_slot as (
    select o.slot_time, sum(o.people)::int as busy
    from occupied o
    group by o.slot_time
  ),
  blocked_slots as (
    select substring(bl.block_time from 1 for 5) as slot_time
    from public.blocks bl
    where bl.block_date = d
  ),
  all_slots as (
    select slot_time from busy_by_slot
    union
    select slot_time from blocked_slots
  )
  select s.slot_time,
         coalesce(bb.busy, 0) as busy,
         (bs.slot_time is not null) as blocked
  from all_slots s
  left join busy_by_slot bb on bb.slot_time = s.slot_time
  left join blocked_slots bs on bs.slot_time = s.slot_time;
$$;

grant execute on function public.slot_load(date) to anon, authenticated;

-- =========================================================================
-- Dev Telegram pings — fire on every new booking and contact event.
-- Uses pg_net to POST to the Telegram Bot API. The bot token + chat id live
-- in the private notify_config table (never in the repo). Insert them once:
--
--   insert into public.notify_config (id, telegram_token, telegram_chat_id)
--   values (1, '<BOT_TOKEN>', '<CHAT_ID>')
--   on conflict (id) do update
--     set telegram_token = excluded.telegram_token,
--         telegram_chat_id = excluded.telegram_chat_id;
--
-- If notify_config is empty the trigger is a no-op (bookings still save).
-- =========================================================================
create extension if not exists pg_net;

create or replace function public.notify_telegram()
returns trigger
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  cfg public.notify_config%rowtype;
  msg text;
begin
  select * into cfg from public.notify_config where id = 1;
  if cfg.telegram_token is null or cfg.telegram_chat_id is null then
    return new;
  end if;

  if tg_table_name = 'bookings' then
    msg := '🗓 New booking' || chr(10)
        || new.service_name || ' · ' || new.minutes || 'm · '
        || (case when new.mode = 'home' then 'In-villa' else 'Studio' end)
        || ' · ' || new.people || 'p' || chr(10)
        || new.booking_date || ' ' || new.booking_time || chr(10)
        || coalesce(new.name, '—');
  else
    msg := '📩 New enquiry: ' || new.type
        || coalesce(chr(10) || new.detail, '');
  end if;

  perform net.http_post(
    url := 'https://api.telegram.org/bot' || cfg.telegram_token || '/sendMessage',
    body := jsonb_build_object('chat_id', cfg.telegram_chat_id, 'text', msg),
    headers := '{"Content-Type": "application/json"}'::jsonb
  );
  return new;
end;
$$;

drop trigger if exists trg_notify_booking on public.bookings;
create trigger trg_notify_booking
  after insert on public.bookings
  for each row execute function public.notify_telegram();

drop trigger if exists trg_notify_event on public.events;
create trigger trg_notify_event
  after insert on public.events
  for each row execute function public.notify_telegram();
