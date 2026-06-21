-- Per-tenant monthly rent, used to prefill rent rows and the collection form.
alter table public.tenants
  add column if not exists rent_amount numeric(10, 2) not null default 0;

-- Two more rent states: 'waived' (no charge) and 'deposit' (settled from the
-- tenant's advance deposit, e.g. when leaving).
alter table public.rents drop constraint if exists rents_status_check;
alter table public.rents
  add constraint rents_status_check check (status in ('pending', 'paid', 'waived', 'deposit'));
