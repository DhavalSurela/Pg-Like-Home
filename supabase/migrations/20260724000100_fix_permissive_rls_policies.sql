-- Restrict admin access to users explicitly allowlisted in public.admin_users.
-- A plain authenticated session is not sufficient for administrative access.

drop policy if exists "Authenticated admins can read admin users" on public.admin_users;
create policy "Admins can read their own admin record"
on public.admin_users
for select
to authenticated
using (id = (select auth.uid()));

drop policy if exists "Authenticated admins can manage blocks" on public.blocks;
create policy "Allowlisted admins can manage blocks"
on public.blocks
for all
to authenticated
using (
  exists (select 1 from public.admin_users where id = (select auth.uid()))
)
with check (
  exists (select 1 from public.admin_users where id = (select auth.uid()))
);

drop policy if exists "Authenticated admins can manage rooms" on public.rooms;
create policy "Allowlisted admins can manage rooms"
on public.rooms
for all
to authenticated
using (
  exists (select 1 from public.admin_users where id = (select auth.uid()))
)
with check (
  exists (select 1 from public.admin_users where id = (select auth.uid()))
);

drop policy if exists "Authenticated admins can manage tenants" on public.tenants;
create policy "Allowlisted admins can manage tenants"
on public.tenants
for all
to authenticated
using (
  exists (select 1 from public.admin_users where id = (select auth.uid()))
)
with check (
  exists (select 1 from public.admin_users where id = (select auth.uid()))
);

drop policy if exists "Authenticated admins can manage rents" on public.rents;
create policy "Allowlisted admins can manage rents"
on public.rents
for all
to authenticated
using (
  exists (select 1 from public.admin_users where id = (select auth.uid()))
)
with check (
  exists (select 1 from public.admin_users where id = (select auth.uid()))
);

drop policy if exists "Authenticated admins can manage food photos" on public.food_photos;
create policy "Allowlisted admins can manage food photos"
on public.food_photos
for all
to authenticated
using (
  exists (select 1 from public.admin_users where id = (select auth.uid()))
)
with check (
  exists (select 1 from public.admin_users where id = (select auth.uid()))
);

drop policy if exists "Authenticated admins can manage pricing" on public.pricing;
create policy "Allowlisted admins can manage pricing"
on public.pricing
for all
to authenticated
using (
  exists (select 1 from public.admin_users where id = (select auth.uid()))
)
with check (
  exists (select 1 from public.admin_users where id = (select auth.uid()))
);

drop policy if exists "Authenticated admins can manage inquiries" on public.inquiries;
create policy "Allowlisted admins can manage inquiries"
on public.inquiries
for all
to authenticated
using (
  exists (select 1 from public.admin_users where id = (select auth.uid()))
)
with check (
  exists (select 1 from public.admin_users where id = (select auth.uid()))
);

drop policy if exists "Authenticated admins can manage beds" on public.beds;
create policy "Allowlisted admins can manage beds"
on public.beds
for all
to authenticated
using (
  exists (select 1 from public.admin_users where id = (select auth.uid()))
)
with check (
  exists (select 1 from public.admin_users where id = (select auth.uid()))
);

-- Anonymous visitors may create only a fresh, bounded inquiry. They cannot set
-- workflow fields or an admin note through the public API.
drop policy if exists "Public can submit inquiries" on public.inquiries;
create policy "Public can submit valid inquiries"
on public.inquiries
for insert
to anon
with check (
  status = 'new'
  and admin_note is null
  and char_length(btrim(name)) between 1 and 120
  and char_length(btrim(phone)) between 1 and 40
  and char_length(btrim(message)) between 1 and 5000
  and (email is null or char_length(btrim(email)) between 3 and 320)
);

-- Public buckets serve object URLs without a SELECT policy. Dropping this
-- policy prevents anonymous clients from listing every stored object.
drop policy if exists "Public read food-photos bucket" on storage.objects;

drop policy if exists "Admins upload food-photos" on storage.objects;
create policy "Allowlisted admins upload food-photos"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'food-photos'
  and exists (select 1 from public.admin_users where id = (select auth.uid()))
);

drop policy if exists "Admins update food-photos" on storage.objects;
create policy "Allowlisted admins update food-photos"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'food-photos'
  and exists (select 1 from public.admin_users where id = (select auth.uid()))
)
with check (
  bucket_id = 'food-photos'
  and exists (select 1 from public.admin_users where id = (select auth.uid()))
);

drop policy if exists "Admins delete food-photos" on storage.objects;
create policy "Allowlisted admins delete food-photos"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'food-photos'
  and exists (select 1 from public.admin_users where id = (select auth.uid()))
);
