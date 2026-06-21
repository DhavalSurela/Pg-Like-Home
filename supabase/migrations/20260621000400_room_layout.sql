-- Spatial floor-plan layout: integer pixel coordinates on a fixed virtual canvas
-- (snapped to a grid in the UI). Rooms get position + size; beds get optional
-- positions for a future per-bed placement phase.

alter table public.rooms
  add column if not exists pos_x  integer not null default 0,
  add column if not exists pos_y  integer not null default 0,
  add column if not exists width  integer not null default 192,
  add column if not exists height integer not null default 160;

-- Forward-compat for the later per-bed placement phase (MVP does not use these).
alter table public.beds
  add column if not exists pos_x integer,
  add column if not exists pos_y integer;

-- Backfill: lay existing rooms into a tidy per-block grid so they don't stack at (0,0).
with ordered as (
  select id, row_number() over (partition by block_id order by room_number) - 1 as idx
  from public.rooms
)
update public.rooms r
set pos_x = (o.idx % 5) * 220,
    pos_y = (o.idx / 5)::int * 200
from ordered o
where r.id = o.id and r.pos_x = 0 and r.pos_y = 0;
