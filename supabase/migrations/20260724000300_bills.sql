-- Simple monthly bill tracking:
--   1. Block-level rent/common-electricity bills and payments made by the owner
--      or directly by a tenant.
--   2. Room-level AC bills split into editable per-bed charges.

create table if not exists public.block_bills (
  id uuid primary key default extensions.gen_random_uuid(),
  block_id uuid not null references public.blocks (id) on delete restrict,
  month date not null,
  bill_type text not null,
  total_amount numeric(12, 2) not null check (total_amount >= 0),
  notes text,
  created_at timestamptz not null default now(),
  constraint block_bills_month_is_first_day
    check (month = date_trunc('month', month)::date),
  constraint block_bills_type_check
    check (bill_type in ('rent', 'electricity')),
  constraint block_bills_block_month_type_key
    unique (block_id, month, bill_type)
);

create table if not exists public.block_bill_payments (
  id uuid primary key default extensions.gen_random_uuid(),
  bill_id uuid not null references public.block_bills (id) on delete cascade,
  payer_type text not null,
  tenant_id uuid references public.tenants (id) on delete set null,
  payer_name text not null,
  amount numeric(12, 2) not null check (amount > 0),
  payment_date date not null default current_date,
  notes text,
  created_at timestamptz not null default now(),
  constraint block_bill_payments_payer_type_check
    check (payer_type in ('owner', 'tenant'))
);

create table if not exists public.room_ac_bills (
  id uuid primary key default extensions.gen_random_uuid(),
  room_id uuid not null references public.rooms (id) on delete restrict,
  month date not null,
  total_amount numeric(12, 2) not null check (total_amount >= 0),
  notes text,
  created_at timestamptz not null default now(),
  constraint room_ac_bills_month_is_first_day
    check (month = date_trunc('month', month)::date),
  constraint room_ac_bills_room_month_key unique (room_id, month)
);

create table if not exists public.room_ac_charges (
  id uuid primary key default extensions.gen_random_uuid(),
  bill_id uuid not null references public.room_ac_bills (id) on delete cascade,
  bed_id uuid references public.beds (id) on delete set null,
  bed_number text not null,
  tenant_id uuid references public.tenants (id) on delete set null,
  tenant_name text,
  amount numeric(12, 2) not null check (amount >= 0),
  status text not null default 'pending',
  payment_date date,
  created_at timestamptz not null default now(),
  constraint room_ac_charges_status_check check (status in ('pending', 'paid')),
  constraint room_ac_charges_bill_bed_key unique (bill_id, bed_number)
);

create index if not exists block_bills_month_idx on public.block_bills (month desc);
create index if not exists block_bills_block_id_idx on public.block_bills (block_id);
create index if not exists block_bill_payments_bill_id_idx
  on public.block_bill_payments (bill_id);
create index if not exists room_ac_bills_month_idx on public.room_ac_bills (month desc);
create index if not exists room_ac_bills_room_id_idx on public.room_ac_bills (room_id);
create index if not exists room_ac_charges_bill_id_idx on public.room_ac_charges (bill_id);

alter table public.block_bills enable row level security;
alter table public.block_bill_payments enable row level security;
alter table public.room_ac_bills enable row level security;
alter table public.room_ac_charges enable row level security;

create policy "Allowlisted admins can manage block bills"
on public.block_bills
for all
to authenticated
using (
  exists (select 1 from public.admin_users where id = (select auth.uid()))
)
with check (
  exists (select 1 from public.admin_users where id = (select auth.uid()))
);

create policy "Allowlisted admins can manage block bill payments"
on public.block_bill_payments
for all
to authenticated
using (
  exists (select 1 from public.admin_users where id = (select auth.uid()))
)
with check (
  exists (select 1 from public.admin_users where id = (select auth.uid()))
);

create policy "Allowlisted admins can manage room AC bills"
on public.room_ac_bills
for all
to authenticated
using (
  exists (select 1 from public.admin_users where id = (select auth.uid()))
)
with check (
  exists (select 1 from public.admin_users where id = (select auth.uid()))
);

create policy "Allowlisted admins can manage room AC charges"
on public.room_ac_charges
for all
to authenticated
using (
  exists (select 1 from public.admin_users where id = (select auth.uid()))
)
with check (
  exists (select 1 from public.admin_users where id = (select auth.uid()))
);
