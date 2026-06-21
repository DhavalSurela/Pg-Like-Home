create policy "Authenticated admins can read admin users"
on public.admin_users
for select
to authenticated
using (true);

create policy "Authenticated admins can manage blocks"
on public.blocks
for all
to authenticated
using (true)
with check (true);

create policy "Authenticated admins can manage rooms"
on public.rooms
for all
to authenticated
using (true)
with check (true);

create policy "Authenticated admins can manage tenants"
on public.tenants
for all
to authenticated
using (true)
with check (true);

create policy "Authenticated admins can manage rents"
on public.rents
for all
to authenticated
using (true)
with check (true);

create policy "Authenticated admins can manage food photos"
on public.food_photos
for all
to authenticated
using (true)
with check (true);

create policy "Authenticated admins can manage pricing"
on public.pricing
for all
to authenticated
using (true)
with check (true);

create policy "Authenticated admins can manage inquiries"
on public.inquiries
for all
to authenticated
using (true)
with check (true);
