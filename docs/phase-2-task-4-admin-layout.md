# Phase 2 Task 4 Admin Layout

Task 4 adds the first admin app shell and dashboard overview.

## Implemented

- `/admin` layout with sidebar navigation.
- Sidebar links for Dashboard, Blocks, Rooms, Tenants, Rents, Food Photos, Pricing, and Inquiries.
- Logout action in the sidebar and mobile header.
- Dashboard summary cards for:
  - Total blocks
  - Total rooms
  - Total tenants
  - Pending rents
  - New inquiries
- Server Component count queries using Supabase.

## Notes

The public website chrome is hidden on `/admin/*` and `/login` through `components/SiteChrome.tsx`.

Dashboard count queries are wired now. If RLS blocks counts before Task 12 policies are added, the dashboard shows a warning and falls back to `0`.
