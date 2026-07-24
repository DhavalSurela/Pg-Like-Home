import type { Metadata } from "next";
import { AlertCircle } from "lucide-react";

import { TenantsManager, type Placement } from "@/app/admin/tenants/TenantsManager";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Residents",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function TenantsPage() {
  const supabase = await createClient();
  const [tenantsResult, bedsResult, roomsResult, blocksResult] = await Promise.all([
    supabase.from("tenants").select("*").order("created_at", { ascending: false }),
    supabase
      .from("beds")
      .select("tenant_id, room_id, bed_number, status")
      .not("tenant_id", "is", null),
    supabase.from("rooms").select("id, room_number, block_id"),
    supabase.from("blocks").select("id, block_name"),
  ]);

  const tenants = tenantsResult.data ?? [];
  const error = tenantsResult.error ?? bedsResult.error ?? roomsResult.error ?? blocksResult.error;

  const roomById = new Map((roomsResult.data ?? []).map((r) => [r.id, r]));
  const blockById = new Map((blocksResult.data ?? []).map((b) => [b.id, b]));

  const placements: Record<string, Placement> = {};
  for (const bed of bedsResult.data ?? []) {
    if (!bed.tenant_id) continue;
    const room = roomById.get(bed.room_id);
    const block = room ? blockById.get(room.block_id) : undefined;
    placements[bed.tenant_id] = {
      label: `${block?.block_name ?? "—"} · ${room?.room_number ?? "—"} · Bed ${bed.bed_number}`,
      status: bed.status,
    };
  }

  return (
    <div className="space-y-5 sm:space-y-8">
      <div className="hidden sm:block">
        <p className="hidden text-xs font-semibold tracking-[0.18em] text-stone-400 uppercase sm:block">
          Residents
        </p>
        <h1 className="mt-3 hidden text-4xl font-light tracking-tight text-stone-900 sm:block sm:text-5xl">
          Residents
        </h1>
        <p className="mt-0 hidden max-w-xl text-[15px] leading-relaxed text-stone-500 sm:mt-3 sm:block">
          Everyone living at or reserved for the property, including unassigned residents.
        </p>
      </div>

      {error ? (
        <div className="flex gap-3 rounded-2xl border border-amber-200/70 bg-amber-50/70 p-4 text-sm text-amber-800 shadow-card">
          <AlertCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          <p>Residents could not be loaded: {error.message}</p>
        </div>
      ) : null}

      <TenantsManager tenants={tenants} placements={placements} />
    </div>
  );
}
