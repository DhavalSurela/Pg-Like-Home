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
