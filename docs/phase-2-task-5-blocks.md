# Phase 2 Task 5 Blocks

Task 5 adds `/admin/blocks`.

## Implemented

- Table listing blocks with Block Name, Type, Floor, Total Rooms, and Actions.
- Add block modal form.
- Edit block modal form.
- Delete confirmation modal.
- Server actions for create, update, and delete.
- Delete validation that prevents removing a block when rooms exist.

## Notes

The CRUD actions use the authenticated Supabase SSR client. They will be fully usable after Task 12 adds admin RLS policies.
