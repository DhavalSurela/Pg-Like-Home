"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/database.types";

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

export type RentActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

const initialError: RentActionState = {
  status: "error",
  message: "Please fill all required fields correctly.",
};

function getString(formData: FormData, key: string) {
  const value = String(formData.get(key) ?? "").trim();
  return value.length > 0 ? value : null;
}

function getNumber(formData: FormData, key: string, min = 0) {
  const value = Number(formData.get(key));
  if (!Number.isFinite(value) || value < min) return null;
  return value;
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

// 'YYYY-MM' (month input) -> 'YYYY-MM-01' (date column), or null if malformed.
function monthToDate(month: string | null) {
  if (!month || !/^\d{4}-\d{2}$/.test(month)) return null;
  return `${month}-01`;
}

function revalidate() {
  revalidatePath("/admin/rents");
  revalidatePath("/admin");
}

async function roomForTenant(supabase: SupabaseServerClient, tenantId: string) {
  const { data } = await supabase.from("beds").select("room_id").eq("tenant_id", tenantId).maybeSingle();
  return data?.room_id ?? null;
}

// Create pending rent rows for every currently-occupied tenant who doesn't yet
// have a row for the chosen month.
export async function generateRents(
  _previousState: RentActionState,
  formData: FormData
): Promise<RentActionState> {
  const month = monthToDate(getString(formData, "month"));
  if (!month) {
    return { status: "error", message: "Pick a valid month." };
  }

  const supabase = await createClient();
  const { data: occupied, error } = await supabase
    .from("beds")
    .select("tenant_id, room_id")
    .eq("status", "occupied")
    .not("tenant_id", "is", null);

  if (error) {
    return { status: "error", message: error.message };
  }

  const { data: existing } = await supabase.from("rents").select("tenant_id").eq("month", month);
  const have = new Set((existing ?? []).map((r) => r.tenant_id));

  const pending = (occupied ?? []).filter((b) => b.tenant_id && !have.has(b.tenant_id));

  // Prefill each row with the tenant's monthly rent.
  const tenantIds = pending.map((b) => b.tenant_id as string);
  const rentByTenant = new Map<string, number>();
  if (tenantIds.length > 0) {
    const { data: tenantRows } = await supabase
      .from("tenants")
      .select("id, rent_amount")
      .in("id", tenantIds);
    for (const t of tenantRows ?? []) rentByTenant.set(t.id, Number(t.rent_amount) || 0);
  }

  const rows = pending.map((b) => ({
    tenant_id: b.tenant_id,
    room_id: b.room_id,
    month,
    amount: rentByTenant.get(b.tenant_id as string) ?? 0,
    status: "pending",
  }));

  if (rows.length === 0) {
    return { status: "success", message: "Every occupied tenant already has a row for this month." };
  }

  const { error: insertError } = await supabase.from("rents").insert(rows);
  if (insertError) {
    return { status: "error", message: insertError.message };
  }

  revalidate();
  return { status: "success", message: `Added ${rows.length} rent ${rows.length === 1 ? "row" : "rows"}.` };
}

export async function createRent(
  _previousState: RentActionState,
  formData: FormData
): Promise<RentActionState> {
  const tenantId = getString(formData, "tenant_id");
  const month = monthToDate(getString(formData, "month"));
  if (!tenantId || !month) {
    return initialError;
  }

  const supabase = await createClient();
  const roomId = await roomForTenant(supabase, tenantId);

  // Default the amount to the tenant's monthly rent when left blank.
  let amount = getNumber(formData, "amount");
  if (amount === null) {
    const { data: tenant } = await supabase.from("tenants").select("rent_amount").eq("id", tenantId).single();
    amount = Number(tenant?.rent_amount) || 0;
  }

  const { error } = await supabase.from("rents").insert({
    tenant_id: tenantId,
    room_id: roomId,
    month,
    amount,
    status: "pending",
  });

  if (error) {
    return { status: "error", message: error.message };
  }

  revalidate();
  return { status: "success", message: "Rent added." };
}

// Save a rent from the unified Record/Edit modal. The "settlement" decides the
// resulting status; "month" and the payment fields are updated alongside:
//   pending     -> pending (not collected)
//   cash/online -> paid (records method + account)
//   deposit     -> deposit (adjusted from the tenant's advance)
//   waived      -> waived (no charge)
export async function saveRent(
  _previousState: RentActionState,
  formData: FormData
): Promise<RentActionState> {
  const id = getString(formData, "id");
  const settlement = getString(formData, "settlement");
  if (!id || !settlement) {
    return initialError;
  }

  const update: Database["public"]["Tables"]["rents"]["Update"] = {};
  const month = monthToDate(getString(formData, "month"));
  if (month) update.month = month;

  if (settlement === "pending") {
    update.status = "pending";
    update.amount = getNumber(formData, "amount") ?? 0;
    update.payment_date = null;
    update.payment_method = null;
    update.paid_to = null;
  } else if (settlement === "waived") {
    update.status = "waived";
    update.amount = 0;
    update.payment_date = null;
    update.payment_method = null;
    update.paid_to = null;
  } else {
    const amount = getNumber(formData, "amount");
    if (amount === null) {
      return { status: "error", message: "Enter the amount." };
    }
    update.amount = amount;
    update.payment_date = getString(formData, "payment_date") ?? today();
    if (settlement === "deposit") {
      update.status = "deposit";
      update.payment_method = null;
      update.paid_to = null;
    } else if (settlement === "cash" || settlement === "online") {
      update.status = "paid";
      update.payment_method = settlement;
      update.paid_to = getString(formData, "paid_to");
    } else {
      return initialError;
    }
  }

  const supabase = await createClient();
  const { error } = await supabase.from("rents").update(update).eq("id", id);
  if (error) {
    return { status: "error", message: error.message };
  }

  revalidate();
  return { status: "success", message: "Rent saved." };
}

export async function markRentPending(
  _previousState: RentActionState,
  formData: FormData
): Promise<RentActionState> {
  const id = getString(formData, "id");
  if (!id) {
    return { status: "error", message: "Missing rent id." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("rents")
    .update({ status: "pending", payment_date: null, payment_method: null, paid_to: null })
    .eq("id", id);

  if (error) {
    return { status: "error", message: error.message };
  }

  revalidate();
  return { status: "success", message: "Marked as pending." };
}

export async function deleteRent(
  _previousState: RentActionState,
  formData: FormData
): Promise<RentActionState> {
  const id = getString(formData, "id");
  if (!id) {
    return { status: "error", message: "Missing rent id." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("rents").delete().eq("id", id);
  if (error) {
    return { status: "error", message: error.message };
  }

  revalidate();
  return { status: "success", message: "Rent deleted." };
}
