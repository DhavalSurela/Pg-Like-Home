create table if not exists public.daily_menus (
  id uuid primary key default extensions.gen_random_uuid(),
  menu_date date not null unique,
  breakfast text not null,
  lunch text not null,
  dinner text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint daily_menus_breakfast_length check (char_length(btrim(breakfast)) between 1 and 500),
  constraint daily_menus_lunch_length check (char_length(btrim(lunch)) between 1 and 500),
  constraint daily_menus_dinner_length check (char_length(btrim(dinner)) between 1 and 500)
);

create index if not exists daily_menus_menu_date_idx
  on public.daily_menus (menu_date desc);

alter table public.daily_menus enable row level security;

drop policy if exists "Public can read recent daily menus" on public.daily_menus;
create policy "Public can read recent daily menus"
on public.daily_menus
for select
to anon
using (
  menu_date >= (timezone('Asia/Kolkata', now())::date - 29)
  and menu_date <= timezone('Asia/Kolkata', now())::date
);

drop policy if exists "Allowlisted admins can manage daily menus" on public.daily_menus;
create policy "Allowlisted admins can manage daily menus"
on public.daily_menus
for all
to authenticated
using (
  exists (select 1 from public.admin_users where id = (select auth.uid()))
)
with check (
  exists (select 1 from public.admin_users where id = (select auth.uid()))
);
