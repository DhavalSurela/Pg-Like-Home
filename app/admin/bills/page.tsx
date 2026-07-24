import type { Metadata } from "next";
import { AlertCircle } from "lucide-react";

import { BillsManager, type AcBillView, type BlockBillView } from "@/app/admin/bills/BillsManager";
import { FinanceNav } from "@/components/admin/AdminSubnav";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Bills",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function BillsPage() {
  const supabase = await createClient();
  const [
    blocksResult,
    roomsResult,
    tenantsResult,
    blockBillsResult,
    paymentsResult,
    acBillsResult,
    chargesResult,
  ] = await Promise.all([
    supabase.from("blocks").select("id, block_name, floor").order("floor").order("block_name"),
    supabase.from("rooms").select("id, block_id, room_number").order("room_number"),
    supabase.from("tenants").select("id, name").order("name"),
    supabase.from("block_bills").select("*").order("month", { ascending: false }),
    supabase.from("block_bill_payments").select("*").order("payment_date", { ascending: false }),
    supabase.from("room_ac_bills").select("*").order("month", { ascending: false }),
    supabase.from("room_ac_charges").select("*").order("bed_number"),
  ]);

  const error =
    blocksResult.error ??
    roomsResult.error ??
    tenantsResult.error ??
    blockBillsResult.error ??
    paymentsResult.error ??
    acBillsResult.error ??
    chargesResult.error;

  const blocks = blocksResult.data ?? [];
  const rooms = roomsResult.data ?? [];
  const blockName = new Map(blocks.map((block) => [block.id, block.block_name]));
  const roomById = new Map(rooms.map((room) => [room.id, room]));

  const blockBills: BlockBillView[] = (blockBillsResult.data ?? []).map((bill) => ({
    ...bill,
    block_name: blockName.get(bill.block_id) ?? "Unknown block",
    payments: (paymentsResult.data ?? []).filter((payment) => payment.bill_id === bill.id),
  }));

  const acBills: AcBillView[] = (acBillsResult.data ?? []).map((bill) => {
    const room = roomById.get(bill.room_id);
    return {
      ...bill,
      block_name: room ? (blockName.get(room.block_id) ?? "Unknown block") : "Unknown block",
      room_name: room?.room_number ?? "Unknown room",
      charges: (chargesResult.data ?? []).filter((charge) => charge.bill_id === bill.id),
    };
  });

  const blockOptions = blocks.map((block) => ({
    id: block.id,
    label: `${block.block_name} · Floor ${block.floor}`,
  }));

  const roomOptions = rooms.map((room) => ({
    id: room.id,
    label: `${blockName.get(room.block_id) ?? "Block"} · ${room.room_number}`,
  }));

  const tenantOptions = (tenantsResult.data ?? []).map((tenant) => ({
    id: tenant.id,
    label: tenant.name,
  }));

  return (
    <div className="space-y-5 sm:space-y-8">
      <div className="hidden sm:block">
        <p className="text-xs font-semibold tracking-[0.18em] text-stone-400 uppercase">Bills</p>
        <h1 className="mt-3 text-4xl font-light tracking-tight text-stone-900 sm:text-5xl">
          Bills
        </h1>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-stone-500">
          Track block expenses and split room AC electricity across beds each month.
        </p>
      </div>

      <FinanceNav />

      {error ? (
        <div className="flex gap-3 rounded-2xl border border-amber-200/70 bg-amber-50/70 p-4 text-sm text-amber-800 shadow-card">
          <AlertCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          <p>Bills could not be loaded: {error.message}</p>
        </div>
      ) : null}

      <BillsManager
        blockBills={blockBills}
        acBills={acBills}
        blocks={blockOptions}
        rooms={roomOptions}
        tenants={tenantOptions}
        currentMonth={new Date().toISOString().slice(0, 7)}
      />
    </div>
  );
}
