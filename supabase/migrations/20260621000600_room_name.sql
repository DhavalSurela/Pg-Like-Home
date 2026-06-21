-- Rooms are now identified by a free-text name (e.g. "Room 101", "Ground Hall")
-- instead of a bare number shown as "Room {n}". Preserve the current look by
-- prefixing existing purely-numeric room_numbers with "Room ". Idempotent: once
-- a value is "Room 1" it no longer matches the numeric pattern.
update public.rooms
set room_number = 'Room ' || room_number
where room_number ~ '^[0-9]+$';
