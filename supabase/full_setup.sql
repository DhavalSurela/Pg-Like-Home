-- PG Like Home — full database setup
-- Paste this whole file into a NEW Supabase project's SQL Editor and run once.
-- It is all migrations in order (idempotent: safe to re-run).

-- ============================================================
-- 20260530000100_create_admin_panel_schema.sql
-- ============================================================
create extension if not exists "pgcrypto" with schema "extensions";

create table if not exists public.admin_users (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  password_hash text,
  created_at timestamptz not null default now()
);

create table if not exists public.blocks (
  id uuid primary key default extensions.gen_random_uuid(),
  block_name text not null,
  block_type text not null,
  floor integer not null,
  total_rooms integer not null check (total_rooms > 0),
  created_at timestamptz not null default now()
);

create table if not exists public.rooms (
  id uuid primary key default extensions.gen_random_uuid(),
  block_id uuid not null references public.blocks (id) on delete restrict,
  room_number text not null,
  room_type text not null,
  capacity integer not null check (capacity > 0),
  status text not null default 'available' check (status in ('available', 'occupied')),
  created_at timestamptz not null default now(),
  constraint rooms_block_room_number_key unique (block_id, room_number)
);

create table if not exists public.tenants (
  id uuid primary key default extensions.gen_random_uuid(),
  name text not null,
  phone text not null,
  email text,
  room_id uuid not null references public.rooms (id) on delete restrict,
  join_date date not null,
  created_at timestamptz not null default now()
);

create table if not exists public.rents (
  id uuid primary key default extensions.gen_random_uuid(),
  tenant_id uuid references public.tenants (id) on delete set null,
  room_id uuid references public.rooms (id) on delete set null,
  month date not null,
  amount numeric(10, 2) not null check (amount >= 0),
  status text not null default 'pending' check (status in ('paid', 'pending')),
  payment_date date,
  created_at timestamptz not null default now(),
  constraint rents_month_is_first_day check (month = date_trunc('month', month)::date)
);

create table if not exists public.food_photos (
  id uuid primary key default extensions.gen_random_uuid(),
  title text not null,
  image_url text not null,
  uploaded_at timestamptz not null default now()
);

create table if not exists public.pricing (
  id uuid primary key default extensions.gen_random_uuid(),
  plan_name text not null,
  occupancy_type text not null,
  monthly_rate numeric(10, 2) not null check (monthly_rate >= 0),
  deposit numeric(10, 2) not null default 0 check (deposit >= 0),
  inclusions text,
  created_at timestamptz not null default now()
);

create table if not exists public.inquiries (
  id uuid primary key default extensions.gen_random_uuid(),
  name text not null,
  phone text not null,
  email text,
  message text not null,
  status text not null default 'new' check (status in ('new', 'responded', 'closed')),
  admin_note text,
  created_at timestamptz not null default now()
);

create index if not exists blocks_block_name_idx on public.blocks (block_name);
create index if not exists rooms_block_id_idx on public.rooms (block_id);
create index if not exists rooms_status_idx on public.rooms (status);
create index if not exists tenants_room_id_idx on public.tenants (room_id);
create index if not exists rents_tenant_id_idx on public.rents (tenant_id);
create index if not exists rents_room_id_idx on public.rents (room_id);
create index if not exists rents_month_idx on public.rents (month);
create index if not exists rents_status_idx on public.rents (status);
create index if not exists food_photos_uploaded_at_idx on public.food_photos (uploaded_at desc);
create index if not exists pricing_plan_name_idx on public.pricing (plan_name);
create index if not exists inquiries_status_idx on public.inquiries (status);
create index if not exists inquiries_created_at_idx on public.inquiries (created_at desc);

alter table public.admin_users enable row level security;
alter table public.blocks enable row level security;
alter table public.rooms enable row level security;
alter table public.tenants enable row level security;
alter table public.rents enable row level security;
alter table public.food_photos enable row level security;
alter table public.pricing enable row level security;
alter table public.inquiries enable row level security;


-- ============================================================
-- 20260603000100_add_admin_rls_policies.sql
-- ============================================================
create policy "Authenticated admins can read admin users"
on public.admin_users
for select
to authenticated
using (true);

create policy "Authenticated admins can manage blocks"
on public.blocks
for all
to authenticated
using (true)
with check (true);

create policy "Authenticated admins can manage rooms"
on public.rooms
for all
to authenticated
using (true)
with check (true);

create policy "Authenticated admins can manage tenants"
on public.tenants
for all
to authenticated
using (true)
with check (true);

create policy "Authenticated admins can manage rents"
on public.rents
for all
to authenticated
using (true)
with check (true);

create policy "Authenticated admins can manage food photos"
on public.food_photos
for all
to authenticated
using (true)
with check (true);

create policy "Authenticated admins can manage pricing"
on public.pricing
for all
to authenticated
using (true)
with check (true);

create policy "Authenticated admins can manage inquiries"
on public.inquiries
for all
to authenticated
using (true)
with check (true);


-- ============================================================
-- 20260621000100_food_pricing_cms.sql
-- ============================================================
-- Food photos + pricing CMS
-- Adds the columns the public site needs, opens public (anon) read access to the
-- marketing content, and provisions a Storage bucket for admin food-photo uploads.

-- 1. food_photos: category + ordering ---------------------------------------
alter table public.food_photos
  add column if not exists category text not null default 'breakfast',
  add column if not exists sort_order integer not null default 0;

create index if not exists food_photos_category_idx
  on public.food_photos (category, sort_order);

-- 2. pricing: rich card fields ----------------------------------------------
alter table public.pricing
  add column if not exists subtitle text,
  add column if not exists tag text,
  add column if not exists description text,
  add column if not exists features text[] not null default '{}',
  add column if not exists recommended boolean not null default false,
  add column if not exists sort_order integer not null default 0;

create index if not exists pricing_sort_order_idx
  on public.pricing (sort_order);

-- 3. Public read access for marketing content -------------------------------
-- The public /food and /rooms pages are rendered for anonymous visitors, so
-- the anon role needs SELECT on these two tables. Everything else stays locked
-- to authenticated admins (existing policies untouched).
drop policy if exists "Public can read food photos" on public.food_photos;
create policy "Public can read food photos"
on public.food_photos
for select
to anon
using (true);

drop policy if exists "Public can read pricing" on public.pricing;
create policy "Public can read pricing"
on public.pricing
for select
to anon
using (true);

-- 4. Storage bucket for food-photo uploads ----------------------------------
insert into storage.buckets (id, name, public)
values ('food-photos', 'food-photos', true)
on conflict (id) do update set public = true;

-- Public read of the bucket; authenticated admins can write/replace/remove.
drop policy if exists "Public read food-photos bucket" on storage.objects;
create policy "Public read food-photos bucket"
on storage.objects
for select
to public
using (bucket_id = 'food-photos');

drop policy if exists "Admins upload food-photos" on storage.objects;
create policy "Admins upload food-photos"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'food-photos');

drop policy if exists "Admins update food-photos" on storage.objects;
create policy "Admins update food-photos"
on storage.objects
for update
to authenticated
using (bucket_id = 'food-photos')
with check (bucket_id = 'food-photos');

drop policy if exists "Admins delete food-photos" on storage.objects;
create policy "Admins delete food-photos"
on storage.objects
for delete
to authenticated
using (bucket_id = 'food-photos');


-- ============================================================
-- 20260621000200_seed_food_pricing.sql
-- ============================================================
-- Seed the CMS with the content that currently lives in source code, so the
-- public site looks identical after switching to the database. Each block only
-- runs when its table is empty, so re-applying is safe and won't duplicate.

-- Pricing: mirrors the static cards previously hardcoded in app/rooms/page.tsx
insert into public.pricing
  (plan_name, subtitle, occupancy_type, monthly_rate, deposit, tag, description, features, recommended, sort_order)
select * from (values
  ('Multi Sharing', 'Non AC Hall', 'multi', 9000, 9000, 'Budget',
   'Great for building friendships and keeping costs low.',
   array['Bed & Mattress', 'Study Table', 'Shared Washroom', 'Fan & Lights'], false, 1),
  ('3 Sharing', 'Non AC Room', '3-sharing', 10000, 10000, 'Standard',
   'A balanced mix of social living and personal comfort.',
   array['Personal Cupboard', 'Study Table', 'Attached Washroom', 'Fan & Lights'], true, 2),
  ('3 Sharing', 'AC Room', '3-sharing', 11000, 11000, 'Premium',
   'Cool comfort with shared amenities.',
   array['Air Conditioner', 'Personal Cupboard', 'Study Table', 'Attached Washroom'], false, 3),
  ('2 Sharing', 'AC Room', '2-sharing', 14500, 14500, 'Elite',
   'More space and privacy with premium comfort.',
   array['Air Conditioner', 'Premium Bedding', 'Spacious Cupboard', 'Attached Washroom'], false, 4),
  ('1 Sharing', 'AC Room', 'single', 20000, 20000, 'Luxury',
   'Private room for those who prefer complete solitude and focus.',
   array['Air Conditioner', 'Private Room', 'Dedicated Workspace', 'Private Washroom'], false, 5)
) as v(plan_name, subtitle, occupancy_type, monthly_rate, deposit, tag, description, features, recommended, sort_order)
where not exists (select 1 from public.pricing);

-- Food photos: the images already deployed under public/images/food. Their URLs
-- are the existing static paths; new admin uploads will use Storage URLs instead.
insert into public.food_photos (title, image_url, category, sort_order)
select * from (values
  ('Breakfast', '/images/food/breakfast/WhatsApp Image 2026-02-15 at 2.43.53 PM.jpeg', 'breakfast', 1),
  ('Breakfast', '/images/food/breakfast/WhatsApp Image 2026-02-15 at 3.22.52 PM.jpeg', 'breakfast', 2),
  ('Breakfast', '/images/food/breakfast/WhatsApp Image 2026-02-15 at 3.23.38 PM.jpeg', 'breakfast', 3),
  ('Breakfast', '/images/food/breakfast/WhatsApp Image 2026-02-15 at 3.24.35 PM.jpeg', 'breakfast', 4),
  ('Breakfast', '/images/food/breakfast/food-23.jpg', 'breakfast', 5),
  ('Breakfast', '/images/food/breakfast/food-28.jpg', 'breakfast', 6),
  ('Lunch & Dinner', '/images/food/lunch-dinner/food-2.jpg', 'lunch-dinner', 1),
  ('Lunch & Dinner', '/images/food/lunch-dinner/food-20.jpg', 'lunch-dinner', 2),
  ('Lunch & Dinner', '/images/food/lunch-dinner/food-26.jpg', 'lunch-dinner', 3),
  ('Lunch & Dinner', '/images/food/lunch-dinner/food-4.jpg', 'lunch-dinner', 4),
  ('Lunch & Dinner', '/images/food/lunch-dinner/food-5.jpg', 'lunch-dinner', 5),
  ('Lunch & Dinner', '/images/food/lunch-dinner/food-8.jpg', 'lunch-dinner', 6),
  ('Festival Food', '/images/food/festival-food/WhatsApp Image 2026-02-15 at 2.46.54 PM.jpeg', 'festival-food', 1),
  ('Festival Food', '/images/food/festival-food/WhatsApp Image 2026-02-15 at 2.47.38 PM.jpeg', 'festival-food', 2),
  ('Fast Food', '/images/food/fastfood/WhatsApp Image 2026-02-15 at 3.27.05 PM.jpeg', 'fastfood', 1),
  ('Fast Food', '/images/food/fastfood/WhatsApp Image 2026-02-15 at 3.28.44 PM.jpeg', 'fastfood', 2),
  ('Fast Food', '/images/food/fastfood/WhatsApp Image 2026-02-15 at 3.29.55 PM.jpeg', 'fastfood', 3),
  ('Fast Food', '/images/food/fastfood/food-10.jpg', 'fastfood', 4),
  ('Fast Food', '/images/food/fastfood/food-21.jpg', 'fastfood', 5)
) as v(title, image_url, category, sort_order)
where not exists (select 1 from public.food_photos);


-- ============================================================
-- 20260621000300_beds.sql
-- ============================================================
-- Bed-level management: each room is made of individual beds, and a bed can be
-- occupied by a specific tenant. This moves tenant placement from room-level to
-- bed-level while keeping tenants.room_id in sync for the rest of the app.

create table if not exists public.beds (
  id uuid primary key default extensions.gen_random_uuid(),
  room_id uuid not null references public.rooms (id) on delete cascade,
  bed_number text not null,
  tenant_id uuid references public.tenants (id) on delete set null,
  created_at timestamptz not null default now(),
  constraint beds_room_bed_number_key unique (room_id, bed_number),
  constraint beds_tenant_unique unique (tenant_id)
);

create index if not exists beds_room_id_idx on public.beds (room_id);

alter table public.beds enable row level security;

drop policy if exists "Authenticated admins can manage beds" on public.beds;
create policy "Authenticated admins can manage beds"
on public.beds
for all
to authenticated
using (true)
with check (true);

-- Backfill: create beds for each existing room based on its capacity.
insert into public.beds (room_id, bed_number)
select r.id, gs::text
from public.rooms r
cross join lateral generate_series(1, greatest(r.capacity, 1)) as gs
where not exists (select 1 from public.beds b where b.room_id = r.id);

-- Backfill: place existing room-level tenants onto free beds in their room.
with free_beds as (
  select b.id as bed_id, b.room_id,
         row_number() over (partition by b.room_id order by b.bed_number) as rn
  from public.beds b
  where b.tenant_id is null
),
room_tenants as (
  select t.id as tenant_id, t.room_id,
         row_number() over (partition by t.room_id order by t.created_at) as rn
  from public.tenants t
)
update public.beds bb
set tenant_id = rt.tenant_id
from free_beds fb
join room_tenants rt on rt.room_id = fb.room_id and rt.rn = fb.rn
where bb.id = fb.bed_id;

-- Keep room.status consistent with bed occupancy.
update public.rooms r
set status = case
  when exists (select 1 from public.beds b where b.room_id = r.id and b.tenant_id is not null)
    then 'occupied'
  else 'available'
end;


-- ============================================================
-- 20260621000400_room_layout.sql
-- ============================================================
-- Spatial floor-plan layout: integer pixel coordinates on a fixed virtual canvas
-- (snapped to a grid in the UI). Rooms get position + size; beds get optional
-- positions for a future per-bed placement phase.

alter table public.rooms
  add column if not exists pos_x  integer not null default 0,
  add column if not exists pos_y  integer not null default 0,
  add column if not exists width  integer not null default 192,
  add column if not exists height integer not null default 160;

-- Forward-compat for the later per-bed placement phase (MVP does not use these).
alter table public.beds
  add column if not exists pos_x integer,
  add column if not exists pos_y integer;

-- Backfill: lay existing rooms into a tidy per-block grid so they don't stack at (0,0).
with ordered as (
  select id, row_number() over (partition by block_id order by room_number) - 1 as idx
  from public.rooms
)
update public.rooms r
set pos_x = (o.idx % 5) * 220,
    pos_y = (o.idx / 5)::int * 200
from ordered o
where r.id = o.id and r.pos_x = 0 and r.pos_y = 0;


-- ============================================================
-- 20260621000500_bed_status.sql
-- ============================================================
-- Three-state beds: empty (available), reserved (token given / inquiry /
-- coming next month), or occupied. Reserved beds may carry an expected move-in
-- date. Occupancy (room status, dashboard) continues to mean only "occupied".

alter table public.beds
  add column if not exists status text not null default 'available',
  add column if not exists expected_date date;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'beds_status_check') then
    alter table public.beds
      add constraint beds_status_check check (status in ('available', 'reserved', 'occupied'));
  end if;
end
$$;

-- Backfill: any bed that already has a tenant was, until now, "occupied".
update public.beds set status = 'occupied' where tenant_id is not null and status = 'available';


-- ============================================================
-- 20260621000600_room_name.sql
-- ============================================================
-- Rooms are now identified by a free-text name (e.g. "Room 101", "Ground Hall")
-- instead of a bare number shown as "Room {n}". Preserve the current look by
-- prefixing existing purely-numeric room_numbers with "Room ". Idempotent: once
-- a value is "Room 1" it no longer matches the numeric pattern.
update public.rooms
set room_number = 'Room ' || room_number
where room_number ~ '^[0-9]+$';


-- ============================================================
-- 20260621000700_tenant_unassigned.sql
-- ============================================================
-- Tenants can now exist without a room/bed (added from the Tenants page, then
-- assigned to a bed later from the Rooms page). Placement is tracked on beds.
alter table public.tenants alter column room_id drop not null;


-- ============================================================
-- 20260621000800_public_inquiries.sql
-- ============================================================
-- Allow anonymous visitors to submit the public contact form. Reading/managing
-- inquiries stays restricted to authenticated admins (existing policy).
drop policy if exists "Public can submit inquiries" on public.inquiries;
create policy "Public can submit inquiries"
on public.inquiries
for insert
to anon
with check (true);


-- ============================================================
-- 20260621000900_rent_payment.sql
-- ============================================================
-- Capture how a rent was paid: cash or online, and to whom / which account.
-- (amount, payment_date, status already exist on rents.)
alter table public.rents
  add column if not exists payment_method text,
  add column if not exists paid_to text;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'rents_payment_method_check') then
    alter table public.rents
      add constraint rents_payment_method_check check (payment_method in ('cash', 'online'));
  end if;
end
$$;


-- ============================================================
-- 20260621001000_rent_amount_status.sql
-- ============================================================
-- Per-tenant monthly rent, used to prefill rent rows and the collection form.
alter table public.tenants
  add column if not exists rent_amount numeric(10, 2) not null default 0;

-- Two more rent states: 'waived' (no charge) and 'deposit' (settled from the
-- tenant's advance deposit, e.g. when leaving).
alter table public.rents drop constraint if exists rents_status_check;
alter table public.rents
  add constraint rents_status_check check (status in ('pending', 'paid', 'waived', 'deposit'));


