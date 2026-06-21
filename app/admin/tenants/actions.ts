"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

export type TenantActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

const initialError: TenantActionState = {
  status: "error",
  message: "Please fill all required fields correctly.",
};

function getString(formData: FormData, key: string) {
  const value = String(formData.get(key) ?? "").trim();
  return value.length > 0 ? value : null;
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function getAmount(formData: FormData, key: string) {
  const value = Number(formData.get(key));
  return Number.isFinite(value) && value >= 0 ? value : 0;
}

function revalidate() {
  revalidatePath("/admin/tenants");
  revalidatePath("/admin/rooms");
  revalidatePath("/admin");
}

async function syncRoomStatus(supabase: SupabaseServerClient, roomId: string) {
  const { data } = await supabase.from("beds").select("status").eq("room_id", roomId);
  const occupied = (data ?? []).some((bed) => bed.status === "occupied");
  await supabase
    .from("rooms")
    .update({ status: occupied ? "occupied" : "available" })
    .eq("id", roomId);
}

export async function createTenant(
  _previousState: TenantActionState,
  formData: FormData
): Promise<TenantActionState> {
  const name = getString(formData, "name");
  const phone = getString(formData, "phone");
  if (!name || !phone) {
    return initialError;
  }

  const supabase = await createClient();
  const { error } = await supabase.from("tenants").insert({
    name,
    phone,
    email: getString(formData, "email"),
    join_date: getString(formData, "join_date") ?? today(),
    rent_amount: getAmount(formData, "rent_amount"),
    room_id: null,
  });

  if (error) {
    return { status: "error", message: error.message };
  }

  revalidate();
  return { status: "success", message: "Tenant added." };
}

export async function updateTenant(
  _previousState: TenantActionState,
  formData: FormData
): Promise<TenantActionState> {
  const id = getString(formData, "id");
  const name = getString(formData, "name");
  const phone = getString(formData, "phone");
  if (!id || !name || !phone) {
    return initialError;
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("tenants")
    .update({
      name,
      phone,
      email: getString(formData, "email"),
      join_date: getString(formData, "join_date") ?? today(),
      rent_amount: getAmount(formData, "rent_amount"),
    })
    .eq("id", id);

  if (error) {
    return { status: "error", message: error.message };
  }

  revalidate();
  return { status: "success", message: "Tenant updated." };
}

export async function deleteTenant(
  _previousState: TenantActionState,
  formData: FormData
): Promise<TenantActionState> {
  const id = getString(formData, "id");
  if (!id) {
    return { status: "error", message: "Missing tenant id." };
  }

  const supabase = await createClient();

  // Free the tenant's bed (if any) so it doesn't stay marked occupied/reserved.
  const { data: bed } = await supabase
    .from("beds")
    .select("room_id")
    .eq("tenant_id", id)
    .maybeSingle();

  await supabase
    .from("beds")
    .update({ tenant_id: null, status: "available", expected_date: null })
    .eq("tenant_id", id);

  const { error } = await supabase.from("tenants").delete().eq("id", id);
  if (error) {
    return { status: "error", message: error.message };
  }

  if (bed?.room_id) {
    await syncRoomStatus(supabase, bed.room_id);
  }

  revalidate();
  return { status: "success", message: "Tenant deleted." };
}
