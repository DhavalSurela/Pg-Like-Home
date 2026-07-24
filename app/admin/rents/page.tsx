import type { Metadata } from "next";
import { AlertCircle } from "lucide-react";

import { RentsManager } from "@/app/admin/rents/RentsManager";
import { FinanceNav } from "@/components/admin/AdminSubnav";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Rents",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function RentsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const { filter } = await searchParams;
  const initialFilter = filter === "paid" || filter === "unpaid" ? filter : "all";
  const supabase = await createClient();
  const [rentsResult, tenantsResult, roomsResult, bedsResult] = await Promise.all([
    supabase
      .from("rents")
      .select("*")
      .order("month", { ascending: false })
      .order("created_at", { ascending: true }),
    supabase.from("tenants").select("id, name, rent_amount").order("name", { ascending: true }),
    supabase.from("rooms").select("id, room_number"),
    supabase.from("beds").select("tenant_id, bed_number"),
  ]);

  const tenants = tenantsResult.data ?? [];
  const error = rentsResult.error ?? tenantsResult.error ?? roomsResult.error ?? bedsResult.error;

  const tenantName = new Map(tenants.map((t) => [t.id, t.name]));
  const tenantRent = new Map(tenants.map((t) => [t.id, Number(t.rent_amount) || 0]));
  const roomName = new Map((roomsResult.data ?? []).map((r) => [r.id, r.room_number]));
  const bedByTenant = new Map<string, string>();
  for (const bed of bedsResult.data ?? []) {
    if (bed.tenant_id) bedByTenant.set(bed.tenant_id, bed.bed_number);
  }

  const rents = (rentsResult.data ?? []).map((rent) => ({
    ...rent,
    tenant_name: rent.tenant_id ? (tenantName.get(rent.tenant_id) ?? "—") : "—",
    room_name: rent.room_id ? (roomName.get(rent.room_id) ?? "—") : "—",
    bed_number: rent.tenant_id ? (bedByTenant.get(rent.tenant_id) ?? null) : null,
    tenant_rent_amount: rent.tenant_id ? (tenantRent.get(rent.tenant_id) ?? 0) : 0,
  }));

  const currentMonth = new Date().toISOString().slice(0, 7);

  return (
    <div className="space-y-5 sm:space-y-8">
      <div className="hidden sm:block">
        <p className="hidden text-xs font-semibold tracking-[0.18em] text-stone-400 uppercase sm:block">
          Rents
        </p>
        <h1 className="mt-3 hidden text-4xl font-light tracking-tight text-stone-900 sm:block sm:text-5xl">
          Rents
        </h1>
        <p className="mt-0 hidden max-w-xl text-[15px] leading-relaxed text-stone-500 sm:mt-3 sm:block">
          Monthly rent for each tenant. Record payments with date, amount, method, and account.
        </p>
      </div>

      <FinanceNav />

      {error ? (
        <div className="flex gap-3 rounded-2xl border border-amber-200/70 bg-amber-50/70 p-4 text-sm text-amber-800 shadow-card">
          <AlertCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          <p>Rents could not be loaded: {error.message}</p>
        </div>
      ) : null}

      <RentsManager
        rents={rents}
        tenants={tenants}
        currentMonth={currentMonth}
        initialFilter={initialFilter}
      />
    </div>
  );
}
