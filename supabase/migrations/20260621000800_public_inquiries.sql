-- Allow anonymous visitors to submit the public contact form. Reading/managing
-- inquiries stays restricted to authenticated admins (existing policy).
drop policy if exists "Public can submit inquiries" on public.inquiries;
create policy "Public can submit inquiries"
on public.inquiries
for insert
to anon
with check (true);
