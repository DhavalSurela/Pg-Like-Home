# Phase 2 Task 1 Setup

## Local configuration

1. Copy Supabase project values into `.env.local`.

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

2. Start local Supabase when migrations are added.

```bash
npm run supabase:start
```

3. Generate local database types after migrations are applied.

```bash
npm run supabase:types
```

## Production setup

1. Create the production Supabase project.
2. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to the Vercel project environment variables.
3. Connect the repository to Vercel with automatic deployments from the main branch.
4. Apply production migrations with the Supabase CLI once Task 2 migrations exist.
