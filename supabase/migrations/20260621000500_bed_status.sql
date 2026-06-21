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
