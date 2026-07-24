"use client";

import { useActionState, useState } from "react";
import { BedSingle, CalendarClock, Trash2 } from "lucide-react";

import {
  assignBed,
  deleteBed,
  markBedMovedIn,
  vacateBed,
  type RoomActionState,
} from "@/app/admin/rooms/actions";
import { Modal } from "@/components/admin/Modal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Database } from "@/lib/database.types";

export type Block = Database["public"]["Tables"]["blocks"]["Row"];
export type Room = Database["public"]["Tables"]["rooms"]["Row"];
export type Bed = Database["public"]["Tables"]["beds"]["Row"];
export type Tenant = Pick<Database["public"]["Tables"]["tenants"]["Row"], "id" | "name" | "phone">;

export const idle: RoomActionState = { status: "idle", message: "" };

export const inputClass =
  "mt-2 h-10 w-full rounded-lg border border-stone-200 bg-white px-3 text-sm text-stone-900 shadow-xs outline-none transition focus:border-stone-400 focus:ring-4 focus:ring-stone-100";

export function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p.charAt(0).toUpperCase())
    .join("");
}

export function ActionMessage({ state }: { state: RoomActionState }) {
  if (state.status === "idle" || !state.message) return null;
  return (
    <p
      className={
        state.status === "success"
          ? "rounded-lg border border-emerald-200/70 bg-emerald-50/70 px-3 py-2 text-sm text-emerald-700"
          : "rounded-lg border border-red-200/70 bg-red-50/70 px-3 py-2 text-sm text-red-700"
      }
    >
      {state.message}
    </p>
  );
}

// Re-exported so existing imports (`from "@/app/admin/rooms/shared"`) keep working.
export { Modal };

export function RoomFields({ room }: { room?: Room }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <label className="block sm:col-span-2">
        <span className="text-sm font-medium text-stone-700">Room name</span>
        <input
          className={inputClass}
          name="room_number"
          required
          defaultValue={room?.room_number ?? ""}
          placeholder="e.g. Room 101 or Ground Hall"
        />
      </label>
      <label className="block">
        <span className="text-sm font-medium text-stone-700">Room type</span>
        <input
          className={inputClass}
          name="room_type"
          required
          defaultValue={room?.room_type ?? ""}
          placeholder="AC"
          list="room-type-options"
        />
        <datalist id="room-type-options">
          <option value="AC" />
          <option value="Non-AC" />
        </datalist>
      </label>
      <label className="block">
        <span className="text-sm font-medium text-stone-700">
          {room ? "Capacity" : "Beds to create"}
        </span>
        <input
          className={inputClass}
          name="capacity"
          required
          type="number"
          min="1"
          step="1"
          defaultValue={room?.capacity ?? 1}
        />
      </label>
    </div>
  );
}

export function BlockSelector({
  blocks,
  rooms,
  selectedBlockId,
  onSelect,
}: {
  blocks: Block[];
  rooms: Room[];
  selectedBlockId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {blocks.map((block) => {
        const isActive = block.id === selectedBlockId;
        const roomCount = rooms.filter((r) => r.block_id === block.id).length;
        return (
          <button
            key={block.id}
            type="button"
            onClick={() => onSelect(block.id)}
            className={cn(
              "rounded-xl border px-4 py-2.5 text-left transition-all",
              isActive
                ? "border-stone-300 bg-white shadow-card ring-1 ring-stone-200/80"
                : "border-stone-200/70 bg-white/50 hover:bg-white"
            )}
          >
            <span className="block text-sm font-semibold text-stone-900">{block.block_name}</span>
            <span className="block text-xs text-stone-400">
              Floor {block.floor} · {roomCount} {roomCount === 1 ? "room" : "rooms"}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// A single bed tile (occupied = dark, empty = dashed). The "bed-tile" class lets
// the floor-plan canvas exclude beds from the room drag handle.
export function BedTile({
  bed,
  tenant,
  onClick,
  className,
}: {
  bed: Bed;
  tenant: Tenant | null;
  onClick: () => void;
  className?: string;
}) {
  const occupied = bed.status === "occupied";
  const reserved = bed.status === "reserved";
  return (
    <button
      type="button"
      title={
        occupied
          ? (tenant?.name ?? "Occupied")
          : reserved
            ? `Reserved${bed.expected_date ? ` · coming ${fmtDate(bed.expected_date)}` : ""}`
            : `Bed ${bed.bed_number} — empty, tap to assign`
      }
      onClick={onClick}
      className={cn(
        "bed-tile flex aspect-square flex-col items-center justify-center gap-1 rounded-xl border p-1 text-center transition-all",
        occupied && "border-stone-800 bg-stone-800 text-white hover:bg-stone-900",
        reserved && "border-stone-300 bg-stone-200 text-stone-700 hover:bg-stone-300",
        !occupied &&
          !reserved &&
          "border-dashed border-stone-300 bg-white text-stone-400 hover:border-stone-400 hover:text-stone-600",
        className
      )}
    >
      <BedSingle
        aria-hidden="true"
        className={cn(
          "size-6",
          occupied ? "text-white" : reserved ? "text-stone-500" : "text-stone-400"
        )}
      />
      {occupied ? (
        <span className="max-w-full truncate px-1 text-[11px] font-medium text-stone-100">
          {tenant?.name ?? "Tenant"}
        </span>
      ) : reserved ? (
        <span className="max-w-full truncate px-1 text-[11px] font-medium text-stone-700">
          {tenant?.name ?? "Reserved"}
        </span>
      ) : (
        <span className="text-[10px]">Bed {bed.bed_number}</span>
      )}
    </button>
  );
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Locale-independent + UTC so server and client render identically (no hydration
// mismatch) and date-only values don't shift a day across timezones.
function fmtDate(value: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

export function BedModal({
  bed,
  tenant,
  unassignedTenants,
  onClose,
}: {
  bed: Bed;
  tenant: Tenant | null;
  unassignedTenants: Tenant[];
  onClose: () => void;
}) {
  const [mode, setMode] = useState<"existing" | "new">(
    unassignedTenants.length > 0 ? "existing" : "new"
  );
  const [placement, setPlacement] = useState<"occupied" | "reserved">("occupied");

  const [assignState, assignAction, isAssigning] = useCloseAction(assignBed, onClose);
  const [vacateState, vacateAction, isVacating] = useCloseAction(vacateBed, onClose);
  const [removeState, removeAction, isRemoving] = useCloseAction(deleteBed, onClose);
  const [moveInState, moveInAction, isMovingIn] = useCloseAction(markBedMovedIn, onClose);

  // Occupied → show tenant, allow vacate.
  if (bed.status === "occupied") {
    return (
      <Modal title={`Bed ${bed.bed_number}`} onClose={onClose}>
        <div className="space-y-5">
          <div className="rounded-xl border border-stone-200 bg-stone-50 p-4">
            <p className="text-sm font-semibold text-stone-900">{tenant?.name ?? "Tenant"}</p>
            {tenant?.phone ? <p className="mt-0.5 text-sm text-stone-500">{tenant.phone}</p> : null}
          </div>
          <ActionMessage state={vacateState} />
          <form action={vacateAction}>
            <input type="hidden" name="id" value={bed.id} />
            <Button className="w-full" disabled={isVacating} type="submit" variant="destructive">
              {isVacating ? "Vacating..." : "Vacate bed"}
            </Button>
          </form>
        </div>
      </Modal>
    );
  }

  // Reserved → show who it's held for, allow move-in or cancel.
  if (bed.status === "reserved") {
    return (
      <Modal title={`Bed ${bed.bed_number}`} onClose={onClose}>
        <div className="space-y-5">
          <div className="rounded-xl border border-stone-200 bg-stone-50 p-4">
            <p className="text-xs font-semibold tracking-wide text-stone-500 uppercase">Reserved</p>
            <p className="mt-1 text-sm font-semibold text-stone-900">{tenant?.name ?? "Tenant"}</p>
            {tenant?.phone ? <p className="mt-0.5 text-sm text-stone-500">{tenant.phone}</p> : null}
            {bed.expected_date ? (
              <p className="mt-2 flex items-center gap-1.5 text-sm text-stone-600">
                <CalendarClock aria-hidden="true" className="size-4" />
                Coming on {fmtDate(bed.expected_date)}
              </p>
            ) : null}
          </div>
          <ActionMessage state={moveInState.status === "error" ? moveInState : vacateState} />
          <form action={moveInAction}>
            <input type="hidden" name="id" value={bed.id} />
            <Button className="w-full" disabled={isMovingIn} type="submit">
              {isMovingIn ? "Updating..." : "Mark as moved in"}
            </Button>
          </form>
          <form action={vacateAction}>
            <input type="hidden" name="id" value={bed.id} />
            <Button className="w-full" disabled={isVacating} type="submit" variant="outline">
              {isVacating ? "Cancelling..." : "Cancel reservation"}
            </Button>
          </form>
        </div>
      </Modal>
    );
  }

  // Available → assign (move in now) or reserve (token / coming next month).
  return (
    <Modal title={`Bed ${bed.bed_number}`} onClose={onClose}>
      <div className="space-y-5">
        <form action={assignAction} className="space-y-5">
          <input type="hidden" name="bed_id" value={bed.id} />
          <input type="hidden" name="mode" value={mode} />
          <input type="hidden" name="placement" value={placement} />

          <div className="grid grid-cols-2 gap-1 rounded-xl border border-stone-200/70 bg-stone-100/60 p-1">
            <button
              type="button"
              onClick={() => setPlacement("occupied")}
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm font-medium transition-all",
                placement === "occupied" ? "bg-white text-stone-900 shadow-card" : "text-stone-500"
              )}
            >
              Move in now
            </button>
            <button
              type="button"
              onClick={() => setPlacement("reserved")}
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm font-medium transition-all",
                placement === "reserved" ? "bg-white text-stone-900 shadow-card" : "text-stone-500"
              )}
            >
              Reserve
            </button>
          </div>

          {placement === "reserved" ? (
            <label className="block">
              <span className="text-sm font-medium text-stone-700">Coming on (optional)</span>
              <input className={inputClass} name="expected_date" type="date" />
            </label>
          ) : null}

          <div className="grid grid-cols-2 gap-1 rounded-xl border border-stone-200/70 bg-stone-100/60 p-1">
            <button
              type="button"
              onClick={() => setMode("existing")}
              disabled={unassignedTenants.length === 0}
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm font-medium transition-all disabled:opacity-40",
                mode === "existing" ? "bg-white text-stone-900 shadow-card" : "text-stone-500"
              )}
            >
              Existing tenant
            </button>
            <button
              type="button"
              onClick={() => setMode("new")}
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm font-medium transition-all",
                mode === "new" ? "bg-white text-stone-900 shadow-card" : "text-stone-500"
              )}
            >
              New tenant
            </button>
          </div>

          {mode === "existing" ? (
            <label className="block">
              <span className="text-sm font-medium text-stone-700">Choose tenant</span>
              <select className={inputClass} name="tenant_id" defaultValue="">
                <option value="" disabled>
                  Select an unassigned tenant…
                </option>
                {unassignedTenants.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} · {t.phone}
                  </option>
                ))}
              </select>
            </label>
          ) : (
            <div className="space-y-4">
              <label className="block">
                <span className="text-sm font-medium text-stone-700">Name</span>
                <input className={inputClass} name="name" placeholder="Full name" />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-stone-700">Phone</span>
                <input className={inputClass} name="phone" placeholder="Phone number" />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-stone-700">Email (optional)</span>
                <input
                  className={inputClass}
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                />
              </label>
            </div>
          )}

          <ActionMessage state={assignState} />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button disabled={isAssigning} type="submit">
              {placement === "reserved"
                ? isAssigning
                  ? "Reserving..."
                  : "Reserve bed"
                : isAssigning
                  ? "Assigning..."
                  : "Assign bed"}
            </Button>
          </div>
        </form>

        <div className="border-t border-stone-100 pt-4">
          <ActionMessage state={removeState} />
          <form action={removeAction} className="mt-2">
            <input type="hidden" name="id" value={bed.id} />
            <Button variant="ghost" disabled={isRemoving} type="submit">
              <Trash2 aria-hidden="true" className="size-4" />
              {isRemoving ? "Removing..." : "Remove this empty bed"}
            </Button>
          </form>
        </div>
      </div>
    </Modal>
  );
}

// useActionState wrapper that runs onSuccess (closing the modal) inside the
// reducer — never in an effect (keeps the set-state-in-effect lint rule happy).
function useCloseAction(
  action: (prev: RoomActionState, fd: FormData) => Promise<RoomActionState>,
  onSuccess: () => void
) {
  return useActionState(async (prev: RoomActionState, fd: FormData) => {
    const res = await action(prev, fd);
    if (res.status === "success") onSuccess();
    return res;
  }, idle);
}
