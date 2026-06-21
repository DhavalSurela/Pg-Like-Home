# Phase 2 Task 3 Auth

Task 3 is implemented with Supabase Auth email/password sessions.

## Local routes

- `/login` renders the admin email/password form.
- `/admin` is protected and redirects unauthenticated users to `/login?redirect=/admin`.
- Signed-in users who visit `/login` are redirected to `/admin`.
- Logout signs out through Supabase and redirects to `/login`.

## Supabase setup

Email/password auth is enabled by default in the local Supabase config.

For production:

1. In Supabase, open Authentication > Providers.
2. Enable Email provider with password login.
3. Create the admin user manually in Authentication > Users.
4. Add the production Supabase URL and anon key to Vercel environment variables.

## Next.js route guard

This app uses `proxy.ts` for the route guard because the project is on Next.js 16. It replaces the older `middleware.ts` convention while serving the same protected-route purpose.
