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

export default async function RoomsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const initialBedFilter = status === "occupied" || status === "available" ? status : "all";
  const supabase = await createClient();
  const [blocksResult, roomsResult, bedsResult, tenantsResult] = await Promise.all([
    supabase
      .from("blocks")
      .select("*")
      .order("floor", { ascending: true })
      .order("block_name", { ascending: true }),
    supabase.from("rooms").select("*"),
    supabase
      .from("beds")
      .select(
        "id, room_id, bed_number, tenant_id, status, expected_date, created_at, pos_x, pos_y"
      ),
    supabase.from("tenants").select("id, name, phone"),
  ]);

  const blocks = blocksResult.data ?? [];
  const rooms = roomsResult.data ?? [];
  const beds = bedsResult.data ?? [];
  const tenants = tenantsResult.data ?? [];
  const error = blocksResult.error ?? roomsResult.error ?? bedsResult.error ?? tenantsResult.error;

  return (
    <div className="space-y-5 sm:space-y-8">
      <div className="hidden sm:block">
        <p className="hidden text-xs font-semibold tracking-[0.18em] text-stone-400 uppercase sm:block">
          Rooms
        </p>
        <h1 className="mt-3 hidden text-4xl font-light tracking-tight text-stone-900 sm:block sm:text-5xl">
          Rooms
        </h1>
        <p className="mt-0 hidden max-w-xl text-[15px] leading-relaxed text-stone-500 sm:mt-3 sm:block">
          Select a block to see its rooms and beds. Click a bed to assign or vacate a tenant.
        </p>
      </div>

      {error ? (
        <div className="flex gap-3 rounded-2xl border border-amber-200/70 bg-amber-50/70 p-4 text-sm text-amber-800 shadow-card">
          <AlertCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          <p>Data could not be loaded: {error.message}</p>
        </div>
      ) : null}

      <RoomsWorkspace
        blocks={blocks}
        rooms={rooms}
        beds={beds}
        tenants={tenants}
        initialBedFilter={initialBedFilter}
      />

      {/* Block management, tucked away */}
      <details className="card-surface group rounded-2xl border border-stone-200/80 shadow-card">
        <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 text-sm font-semibold text-stone-700">
          Manage blocks
          <ChevronDown
            aria-hidden="true"
            className="size-4 text-stone-400 transition-transform group-open:rotate-180"
          />
        </summary>
        <div className="border-t border-stone-200/70">
          <BlocksManager blocks={blocks} />
        </div>
      </details>
    </div>
  );
}
