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
