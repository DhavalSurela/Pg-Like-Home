"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

export type BillActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

const invalid: BillActionState = {
  status: "error",
  message: "Please fill all required fields correctly.",
};

function getString(formData: FormData, key: string) {
  const value = String(formData.get(key) ?? "").trim();
  return value || null;
}

function getAmount(formData: FormData, key: string, allowZero = false) {
  const amount = Number(formData.get(key));
  if (!Number.isFinite(amount) || (allowZero ? amount < 0 : amount <= 0)) return null;
  return Math.round(amount * 100) / 100;
}

function monthToDate(value: string | null) {
  return value && /^\d{4}-\d{2}$/.test(value) ? `${value}-01` : null;
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function refreshBills() {
  revalidatePath("/admin/bills");
}

export async function createBlockBill(
  _previousState: BillActionState,
  formData: FormData
): Promise<BillActionState> {
  const blockId = getString(formData, "block_id");
  const month = monthToDate(getString(formData, "month"));
  const billType = getString(formData, "bill_type");
  const totalAmount = getAmount(formData, "total_amount", true);

  if (
    !blockId ||
    !month ||
    !billType ||
    !["rent", "electricity"].includes(billType) ||
    totalAmount === null
  ) {
    return invalid;
  }

  const supabase = await createClient();
  const { error } = await supabase.from("block_bills").insert({
    block_id: blockId,
    month,
    bill_type: billType,
    total_amount: totalAmount,
    notes: getString(formData, "notes"),
  });

  if (error) {
    return {
      status: "error",
      message:
        error.code === "23505" ? "This block bill already exists for that month." : error.message,
    };
  }

  refreshBills();
  return { status: "success", message: "Block bill added." };
}

export async function addBlockBillPayment(
  _previousState: BillActionState,
  formData: FormData
): Promise<BillActionState> {
  const billId = getString(formData, "bill_id");
  const payerType = getString(formData, "payer_type");
  const amount = getAmount(formData, "amount");
  const paymentDate = getString(formData, "payment_date") ?? today();

  if (!billId || !payerType || !["owner", "tenant"].includes(payerType) || amount === null) {
    return invalid;
  }

  const supabase = await createClient();
  const [{ data: bill }, { data: existingPayments }] = await Promise.all([
    supabase.from("block_bills").select("total_amount").eq("id", billId).single(),
    supabase.from("block_bill_payments").select("amount").eq("bill_id", billId),
  ]);
  if (!bill) return { status: "error", message: "This bill could not be found." };

  const alreadyPaid = (existingPayments ?? []).reduce(
    (sum, payment) => sum + Number(payment.amount),
    0
  );
  if (alreadyPaid + amount > Number(bill.total_amount)) {
    return {
      status: "error",
      message: `Only ₹${Math.max(0, Number(bill.total_amount) - alreadyPaid).toLocaleString("en-IN")} remains on this bill.`,
    };
  }

  let tenantId: string | null = null;
  let payerName = "Owner";

  if (payerType === "tenant") {
    tenantId = getString(formData, "tenant_id");
    if (!tenantId) return { status: "error", message: "Choose the tenant who paid." };

    const { data: tenant, error: tenantError } = await supabase
      .from("tenants")
      .select("name")
      .eq("id", tenantId)
      .single();
    if (tenantError || !tenant) {
      return { status: "error", message: "The selected tenant could not be found." };
    }
    payerName = tenant.name;
  }

  const { error } = await supabase.from("block_bill_payments").insert({
    bill_id: billId,
    payer_type: payerType,
    tenant_id: tenantId,
    payer_name: payerName,
    amount,
    payment_date: paymentDate,
    notes: getString(formData, "notes"),
  });

  if (error) return { status: "error", message: error.message };

  refreshBills();
  return { status: "success", message: "Payment recorded." };
}

export async function deleteBlockBillPayment(
  _previousState: BillActionState,
  formData: FormData
): Promise<BillActionState> {
  const id = getString(formData, "id");
  if (!id) return invalid;

  const supabase = await createClient();
  const { error } = await supabase.from("block_bill_payments").delete().eq("id", id);
  if (error) return { status: "error", message: error.message };

  refreshBills();
  return { status: "success", message: "Payment removed." };
}

export async function deleteBlockBill(
  _previousState: BillActionState,
  formData: FormData
): Promise<BillActionState> {
  const id = getString(formData, "id");
  if (!id) return invalid;

  const supabase = await createClient();
  const { error } = await supabase.from("block_bills").delete().eq("id", id);
  if (error) return { status: "error", message: error.message };

  refreshBills();
  return { status: "success", message: "Block bill deleted." };
}

export async function createRoomAcBill(
  _previousState: BillActionState,
  formData: FormData
): Promise<BillActionState> {
  const roomId = getString(formData, "room_id");
  const month = monthToDate(getString(formData, "month"));
  const totalAmount = getAmount(formData, "total_amount", true);
  if (!roomId || !month || totalAmount === null) return invalid;

  const supabase = await createClient();
  const { data: beds, error: bedsError } = await supabase
    .from("beds")
    .select("id, bed_number, tenant_id, status")
    .eq("room_id", roomId)
    .order("bed_number");

  if (bedsError) return { status: "error", message: bedsError.message };
  if (!beds?.length) return { status: "error", message: "Add beds to this room first." };

  const occupiedBeds = beds.filter((bed) => bed.status === "occupied" && bed.tenant_id);
  const chargeBeds = occupiedBeds.length ? occupiedBeds : beds;
  const tenantIds = chargeBeds.flatMap((bed) => (bed.tenant_id ? [bed.tenant_id] : []));
  const tenantNames = new Map<string, string>();

  if (tenantIds.length) {
    const { data: tenants } = await supabase.from("tenants").select("id, name").in("id", tenantIds);
    for (const tenant of tenants ?? []) tenantNames.set(tenant.id, tenant.name);
  }

  const { data: bill, error: billError } = await supabase
    .from("room_ac_bills")
    .insert({
      room_id: roomId,
      month,
      total_amount: totalAmount,
      notes: getString(formData, "notes"),
    })
    .select("id")
    .single();

  if (billError || !bill) {
    return {
      status: "error",
      message:
        billError?.code === "23505"
          ? "An AC bill already exists for this room and month."
          : (billError?.message ?? "The AC bill could not be created."),
    };
  }

  const totalPaise = Math.round(totalAmount * 100);
  const basePaise = Math.floor(totalPaise / chargeBeds.length);
  let remainder = totalPaise - basePaise * chargeBeds.length;
  const charges = chargeBeds.map((bed) => {
    const paise = basePaise + (remainder-- > 0 ? 1 : 0);
    return {
      bill_id: bill.id,
      bed_id: bed.id,
      bed_number: bed.bed_number,
      tenant_id: bed.tenant_id,
      tenant_name: bed.tenant_id ? (tenantNames.get(bed.tenant_id) ?? null) : null,
      amount: paise / 100,
      status: "pending",
    };
  });

  const { error: chargeError } = await supabase.from("room_ac_charges").insert(charges);
  if (chargeError) {
    await supabase.from("room_ac_bills").delete().eq("id", bill.id);
    return { status: "error", message: chargeError.message };
  }

  refreshBills();
  return {
    status: "success",
    message: `AC bill split across ${chargeBeds.length} ${chargeBeds.length === 1 ? "bed" : "beds"}.`,
  };
}

export async function saveRoomAcCharge(
  _previousState: BillActionState,
  formData: FormData
): Promise<BillActionState> {
  const id = getString(formData, "id");
  const amount = getAmount(formData, "amount", true);
  const status = getString(formData, "status");
  if (!id || amount === null || !status || !["pending", "paid"].includes(status)) return invalid;

  const supabase = await createClient();
  const { error } = await supabase
    .from("room_ac_charges")
    .update({
      amount,
      status,
      payment_date: status === "paid" ? (getString(formData, "payment_date") ?? today()) : null,
    })
    .eq("id", id);

  if (error) return { status: "error", message: error.message };

  refreshBills();
  return { status: "success", message: "Bed charge updated." };
}

export async function deleteRoomAcBill(
  _previousState: BillActionState,
  formData: FormData
): Promise<BillActionState> {
  const id = getString(formData, "id");
  if (!id) return invalid;

  const supabase = await createClient();
  const { error } = await supabase.from("room_ac_bills").delete().eq("id", id);
  if (error) return { status: "error", message: error.message };

  refreshBills();
  return { status: "success", message: "Room AC bill deleted." };
}
