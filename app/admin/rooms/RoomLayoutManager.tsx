"use client";

import { useActionState, useState } from "react";
import { DoorOpen, Pencil, Plus, Trash2 } from "lucide-react";

import { addBed, createRoom, deleteRoom, updateRoom } from "@/app/admin/rooms/actions";
import {
  ActionMessage,
  BedModal,
  BedTile,
  Modal,
  RoomFields,
  idle,
  type Bed,
  type Room,
  type Tenant,
} from "@/app/admin/rooms/shared";
import { ActionForm } from "@/components/admin/ActionForm";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type BedFilter = "all" | "available" | "reserved" | "occupied";

export function RoomLayoutManager({
  selectedBlockId,
  rooms,
  beds,
  tenants,
  initialBedFilter,
}: {
  selectedBlockId: string | null;
  rooms: Room[];
  beds: Bed[];
  tenants: Tenant[];
  initialBedFilter: "all" | "occupied" | "available";
}) {
  const [addRoomOpen, setAddRoomOpen] = useState(false);
  const [editRoomTarget, setEditRoomTarget] = useState<Room | null>(null);
  const [deleteRoomTarget, setDeleteRoomTarget] = useState<Room | null>(null);
  const [bedTarget, setBedTarget] = useState<Bed | null>(null);
  const [bedFilter, setBedFilter] = useState<BedFilter>(initialBedFilter);

  const [addBedState, addBedAction] = useActionState(addBed, idle);

  const tenantById = new Map(tenants.map((t) => [t.id, t]));
  const assignedTenantIds = new Set(beds.map((b) => b.tenant_id).filter(Boolean) as string[]);
  const unassignedTenants = tenants.filter((t) => !assignedTenantIds.has(t.id));

  const selectedRooms = rooms
    .filter((r) => r.block_id === selectedBlockId)
    .sort((a, b) => a.room_number.localeCompare(b.room_number, undefined, { numeric: true }));

  const bedsByRoom = new Map<string, Bed[]>();
  for (const bed of beds) {
    const list = bedsByRoom.get(bed.room_id) ?? [];
    list.push(bed);
    bedsByRoom.set(bed.room_id, list);
  }

  const selectedRoomIds = new Set(selectedRooms.map((r) => r.id));
  const blockBeds = beds.filter((b) => selectedRoomIds.has(b.room_id));
  const emptyCount = blockBeds.filter((b) => b.status === "available").length;
  const reservedCount = blockBeds.filter((b) => b.status === "reserved").length;
  const occupiedCount = blockBeds.filter((b) => b.status === "occupied").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            type="button"
            aria-pressed={bedFilter === "all"}
            onClick={() => setBedFilter("all")}
            className={cn(
              "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-sm font-medium transition",
              bedFilter === "all"
                ? "border-stone-900 bg-stone-900 text-white"
                : "border-stone-200 bg-white text-stone-600 hover:border-stone-300 hover:text-stone-900"
            )}
          >
            All
            <span
              className={cn(
                "rounded-full px-1.5 py-0.5 text-[10px] leading-none",
                bedFilter === "all" ? "bg-white/15 text-white" : "bg-stone-100 text-stone-500"
              )}
            >
              {blockBeds.length}
            </span>
          </button>
          <button
            type="button"
            aria-pressed={bedFilter === "available"}
            onClick={() => setBedFilter("available")}
            className={cn(
              "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-sm font-medium transition",
              bedFilter === "available"
                ? "border-stone-900 bg-stone-900 text-white"
                : "border-stone-200 bg-white text-stone-600 hover:border-stone-300 hover:text-stone-900"
            )}
          >
            <span className="size-2.5 rounded-sm border border-dashed border-stone-300 bg-white" />
            Empty
            <span
              className={cn(
                "rounded-full px-1.5 py-0.5 text-[10px] leading-none",
                bedFilter === "available" ? "bg-white/15 text-white" : "bg-stone-100 text-stone-500"
              )}
            >
              {emptyCount}
            </span>
          </button>
          <button
            type="button"
            aria-pressed={bedFilter === "reserved"}
            onClick={() => setBedFilter("reserved")}
            className={cn(
              "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-sm font-medium transition",
              bedFilter === "reserved"
                ? "border-stone-900 bg-stone-900 text-white"
                : "border-stone-200 bg-white text-stone-600 hover:border-stone-300 hover:text-stone-900"
            )}
          >
            <span className="size-2.5 rounded-sm bg-stone-300" />
            Reserved
            <span
              className={cn(
                "rounded-full px-1.5 py-0.5 text-[10px] leading-none",
                bedFilter === "reserved" ? "bg-white/15 text-white" : "bg-stone-100 text-stone-500"
              )}
            >
              {reservedCount}
            </span>
          </button>
          <button
            type="button"
            aria-pressed={bedFilter === "occupied"}
            onClick={() => setBedFilter("occupied")}
            className={cn(
              "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-sm font-medium transition",
              bedFilter === "occupied"
                ? "border-stone-900 bg-stone-900 text-white"
                : "border-stone-200 bg-white text-stone-600 hover:border-stone-300 hover:text-stone-900"
            )}
          >
            <span className="size-2.5 rounded-sm bg-stone-800" />
            Occupied
            <span
              className={cn(
                "rounded-full px-1.5 py-0.5 text-[10px] leading-none",
                bedFilter === "occupied" ? "bg-white/15 text-white" : "bg-stone-100 text-stone-500"
              )}
            >
              {occupiedCount}
            </span>
          </button>
        </div>
        <Button type="button" disabled={!selectedBlockId} onClick={() => setAddRoomOpen(true)}>
          <Plus aria-hidden="true" className="size-4" />
          Add room
        </Button>
      </div>

      {addBedState.status === "error" ? <ActionMessage state={addBedState} /> : null}

      {selectedRooms.length > 0 ? (
        <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {selectedRooms.map((room) => {
            const roomBeds = (bedsByRoom.get(room.id) ?? []).sort((a, b) =>
              a.bed_number.localeCompare(b.bed_number, undefined, { numeric: true })
            );
            const visibleBeds =
              bedFilter === "all" ? roomBeds : roomBeds.filter((bed) => bed.status === bedFilter);
            const freeCount = roomBeds.filter((b) => !b.tenant_id).length;

            if (visibleBeds.length === 0) return null;

            return (
              <div
                key={room.id}
                className="card-surface rounded-2xl border border-stone-200/80 p-5 shadow-card"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-base font-semibold text-stone-900">{room.room_number}</h3>
                    <p className="text-xs text-stone-400">
                      {room.room_type} · {freeCount} free / {roomBeds.length}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <form action={addBedAction}>
                      <input type="hidden" name="room_id" value={room.id} />
                      <button
                        aria-label="Add bed"
                        title="Add bed"
                        type="submit"
                        className="rounded-lg p-1.5 text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-700"
                      >
                        <Plus aria-hidden="true" className="size-4" />
                      </button>
                    </form>
                    <button
                      aria-label="Edit room"
                      type="button"
                      onClick={() => setEditRoomTarget(room)}
                      className="rounded-lg p-1.5 text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-700"
                    >
                      <Pencil aria-hidden="true" className="size-4" />
                    </button>
                    <button
                      aria-label="Delete room"
                      type="button"
                      onClick={() => setDeleteRoomTarget(room)}
                      className="rounded-lg p-1.5 text-stone-400 transition-colors hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 aria-hidden="true" className="size-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2.5">
                  {visibleBeds.map((bed) => (
                    <BedTile
                      key={bed.id}
                      bed={bed}
                      tenant={bed.tenant_id ? (tenantById.get(bed.tenant_id) ?? null) : null}
                      onClick={() => setBedTarget(bed)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex h-40 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-stone-300 text-sm text-stone-400">
          <DoorOpen aria-hidden="true" className="size-5 text-stone-300" />
          No rooms in this block yet.
        </div>
      )}

      {/* Add room */}
      {addRoomOpen ? (
        <Modal title="Add room" onClose={() => setAddRoomOpen(false)}>
          <ActionForm
            action={createRoom}
            onSuccess={() => setAddRoomOpen(false)}
            className="space-y-5"
          >
            {(state, pending) => (
              <>
                <input type="hidden" name="block_id" value={selectedBlockId ?? ""} />
                <RoomFields />
                <ActionMessage state={state} />
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setAddRoomOpen(false)}>
                    Cancel
                  </Button>
                  <Button disabled={pending} type="submit">
                    {pending ? "Saving..." : "Save room"}
                  </Button>
                </div>
              </>
            )}
          </ActionForm>
        </Modal>
      ) : null}

      {/* Edit room */}
      {editRoomTarget ? (
        <Modal title={`Edit ${editRoomTarget.room_number}`} onClose={() => setEditRoomTarget(null)}>
          <ActionForm
            key={editRoomTarget.id}
            action={updateRoom}
            onSuccess={() => setEditRoomTarget(null)}
            className="space-y-5"
          >
            {(state, pending) => (
              <>
                <input type="hidden" name="id" value={editRoomTarget.id} />
                <RoomFields room={editRoomTarget} />
                <p className="text-xs text-stone-400">
                  Changing capacity here does not add or remove beds — use the bed tiles for that.
                </p>
                <ActionMessage state={state} />
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setEditRoomTarget(null)}>
                    Cancel
                  </Button>
                  <Button disabled={pending} type="submit">
                    {pending ? "Saving..." : "Update room"}
                  </Button>
                </div>
              </>
            )}
          </ActionForm>
        </Modal>
      ) : null}

      {/* Delete room */}
      {deleteRoomTarget ? (
        <Modal title="Delete room" onClose={() => setDeleteRoomTarget(null)}>
          <ActionForm
            action={deleteRoom}
            onSuccess={() => setDeleteRoomTarget(null)}
            className="space-y-5"
          >
            {(state, pending) => (
              <>
                <input type="hidden" name="id" value={deleteRoomTarget.id} />
                <p className="text-sm leading-6 text-stone-600">
                  Delete{" "}
                  <span className="font-semibold text-stone-900">
                    {deleteRoomTarget.room_number}
                  </span>{" "}
                  and its beds? This is only allowed when no beds are occupied.
                </p>
                <ActionMessage state={state} />
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setDeleteRoomTarget(null)}>
                    Cancel
                  </Button>
                  <Button disabled={pending} type="submit" variant="destructive">
                    {pending ? "Deleting..." : "Delete room"}
                  </Button>
                </div>
              </>
            )}
          </ActionForm>
        </Modal>
      ) : null}

      {/* Bed: assign / vacate / remove */}
      {bedTarget ? (
        <BedModal
          bed={bedTarget}
          tenant={bedTarget.tenant_id ? (tenantById.get(bedTarget.tenant_id) ?? null) : null}
          unassignedTenants={unassignedTenants}
          onClose={() => setBedTarget(null)}
        />
      ) : null}
    </div>
  );
}
