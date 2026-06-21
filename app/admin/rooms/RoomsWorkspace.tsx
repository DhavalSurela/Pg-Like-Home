"use client";

import { useState } from "react";

import { RoomLayoutManager } from "@/app/admin/rooms/RoomLayoutManager";
import { BlockSelector, type Bed, type Block, type Room, type Tenant } from "@/app/admin/rooms/shared";

export function RoomsWorkspace({
  blocks,
  rooms,
  beds,
  tenants,
}: {
  blocks: Block[];
  rooms: Room[];
  beds: Bed[];
  tenants: Tenant[];
}) {
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(blocks[0]?.id ?? null);

  if (blocks.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center rounded-2xl border border-dashed border-stone-300 text-sm text-stone-400">
        Add a block first to start laying out rooms and beds.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <BlockSelector blocks={blocks} rooms={rooms} selectedBlockId={selectedBlockId} onSelect={setSelectedBlockId} />
      <RoomLayoutManager selectedBlockId={selectedBlockId} rooms={rooms} beds={beds} tenants={tenants} />
    </div>
  );
}
