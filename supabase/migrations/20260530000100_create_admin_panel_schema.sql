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
