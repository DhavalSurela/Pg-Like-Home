# Phase 2 Task 2 Schema

The initial admin panel schema is in:

```text
supabase/migrations/20260530000100_create_admin_panel_schema.sql
```

It creates:

- `admin_users`
- `blocks`
- `rooms`
- `tenants`
- `rents`
- `food_photos`
- `pricing`
- `inquiries`

The migration also adds primary keys, foreign keys, status checks, amount/capacity checks, indexes for common admin filters, and enables RLS on every app table. Task 12 should add the actual admin-only RLS policies.

## Local apply

Docker Desktop must be running before local Supabase commands work on Windows. This project uses the `553xx` local Supabase ports because Windows reserved the default `5432x` range on this machine.

```bash
npm run supabase:start
npm run supabase:reset
npm run supabase:types
```

## Production apply

After linking the hosted Supabase project:

```bash
npx supabase link --project-ref your-project-ref
npm run supabase:push
npx supabase gen types typescript --project-id your-project-ref --schema public > lib/database.types.ts
```
