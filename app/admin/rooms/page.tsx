import type { Metadata } from "next";
import { AlertCircle, ChevronDown } from "lucide-react";

import { BlocksManager } from "@/app/admin/blocks/BlocksManager";
import { RoomsWorkspace } from "@/app/admin/rooms/RoomsWorkspace";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Rooms",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function RoomsPage() {
  const supabase = await createClient();
  const [blocksResult, roomsResult, bedsResult, tenantsResult] = await Promise.all([
    supabase.from("blocks").select("*").order("floor", { ascending: true }).order("block_name", { ascending: true }),
    supabase.from("rooms").select("*"),
    supabase
      .from("beds")
      .select("id, room_id, bed_number, tenant_id, status, expected_date, created_at, pos_x, pos_y"),
    supabase.from("tenants").select("id, name, phone"),
  ]);

  const blocks = blocksResult.data ?? [];
  const rooms = roomsResult.data ?? [];
  const beds = bedsResult.data ?? [];
  const tenants = tenantsResult.data ?? [];
  const error =
    blocksResult.error ?? roomsResult.error ?? bedsResult.error ?? tenantsResult.error;

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold tracking-[0.18em] text-stone-400 uppercase">Rooms</p>
        <h1 className="mt-3 text-4xl font-light tracking-tight text-stone-900 sm:text-5xl">Rooms</h1>
        <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-stone-500">
          Select a block to see its rooms and beds. Click a bed to assign or vacate a tenant.
        </p>
      </div>

      {error ? (
        <div className="flex gap-3 rounded-2xl border border-amber-200/70 bg-amber-50/70 p-4 text-sm text-amber-800 shadow-card">
          <AlertCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          <p>Data could not be loaded: {error.message}</p>
        </div>
      ) : null}

      <RoomsWorkspace blocks={blocks} rooms={rooms} beds={beds} tenants={tenants} />

      {/* Block management, tucked away */}
      <details className="group rounded-2xl border border-stone-200/80 bg-white/60 shadow-card">
        <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 text-sm font-semibold text-stone-700">
          Manage blocks
          <ChevronDown
            aria-hidden="true"
            className="size-4 text-stone-400 transition-transform group-open:rotate-180"
          />
        </summary>
        <div className="border-t border-stone-200/70 p-5">
          <BlocksManager blocks={blocks} />
        </div>
      </details>
    </div>
  );
}
