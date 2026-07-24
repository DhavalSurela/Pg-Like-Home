alter table public.block_bill_payments
  add column if not exists rent_id uuid references public.rents (id) on delete cascade;

create unique index if not exists block_bill_payments_rent_id_key
  on public.block_bill_payments (rent_id)
  where rent_id is not null;
