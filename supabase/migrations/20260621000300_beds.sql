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
