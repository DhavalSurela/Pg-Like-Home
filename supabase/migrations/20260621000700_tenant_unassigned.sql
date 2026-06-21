-- Tenants can now exist without a room/bed (added from the Tenants page, then
-- assigned to a bed later from the Rooms page). Placement is tracked on beds.
alter table public.tenants alter column room_id drop not null;
