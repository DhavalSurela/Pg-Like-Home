"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

export type RoomActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

const initialError: RoomActionState = {
  status: "error",
  message: "Please fill all required fields correctly.",
};

function getString(formData: FormData, key: string) {
  const value = String(formData.get(key) ?? "").trim();
  return value.length > 0 ? value : null;
}

function getInteger(formData: FormData, key: string, min?: number) {
  const value = Number(formData.get(key));
  if (!Number.isInteger(value)) return null;
  if (typeof min === "number" && value < min) return null;
  return value;
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function revalidate() {
  revalidatePath("/admin");
  revalidatePath("/admin/rooms");
}

// Keep blocks.total_rooms in sync with the actual number of rooms in the block.
async function syncBlockRoomCount(supabase: SupabaseServerClient, blockId: string) {
  const { count } = await supabase
    .from("rooms")
    .select("*", { count: "exact", head: true })
    .eq("block_id", blockId);
  await supabase.from("blocks").update({ total_rooms: count ?? 0 }).eq("id", blockId);
}

// Recompute a room's status from its beds so the dashboard occupancy stays
// correct. Only "occupied" beds count — reserved holds do not.
async function syncRoomStatus(supabase: SupabaseServerClient, roomId: string) {
  const { data } = await supabase.from("beds").select("status").eq("room_id", roomId);
  const occupied = (data ?? []).some((bed) => bed.status === "occupied");
  await supabase
    .from("rooms")
    .update({ status: occupied ? "occupied" : "available" })
    .eq("id", roomId);
}

async function nextBedNumber(supabase: SupabaseServerClient, roomId: string) {
  const { data } = await supabase.from("beds").select("bed_number").eq("room_id", roomId);
  const numbers = (data ?? []).map((b) => parseInt(b.bed_number, 10)).filter((n) => !Number.isNaN(n));
  const max = numbers.length > 0 ? Math.max(...numbers) : 0;
  return String(max + 1);
}

/* ------------------------------- Rooms -------------------------------- */

export async function createRoom(
  _previousState: RoomActionState,
  formData: FormData
): Promise<RoomActionState> {
  const blockId = getString(formData, "block_id");
  const roomNumber = getString(formData, "room_number");
  const roomType = getString(formData, "room_type");
  const capacity = getInteger(formData, "capacity", 1);

  if (!blockId || !roomNumber || !roomType || capacity === null) {
    return initialError;
  }

  const supabase = await createClient();
  const { data: room, error } = await supabase
    .from("rooms")
    .insert({
      block_id: blockId,
      room_number: roomNumber,
      room_type: roomType,
      capacity,
      status: "available",
    })
    .select("id")
    .single();

  if (error) {
    return { status: "error", message: error.message };
  }

  // Create one bed per capacity unit.
  const beds = Array.from({ length: capacity }, (_, i) => ({
    room_id: room.id,
    bed_number: String(i + 1),
  }));
  const { error: bedError } = await supabase.from("beds").insert(beds);

  if (bedError) {
    return { status: "error", message: `Room created, but beds failed: ${bedError.message}` };
  }

  await syncBlockRoomCount(supabase, blockId);
  revalidate();
  return { status: "success", message: "Room added." };
}

export async function updateRoom(
  _previousState: RoomActionState,
  formData: FormData
): Promise<RoomActionState> {
  const id = getString(formData, "id");
  const roomNumber = getString(formData, "room_number");
  const roomType = getString(formData, "room_type");
  const capacity = getInteger(formData, "capacity", 1);

  if (!id || !roomNumber || !roomType || capacity === null) {
    return initialError;
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("rooms")
    .update({ room_number: roomNumber, room_type: roomType, capacity })
    .eq("id", id);

  if (error) {
    return { status: "error", message: error.message };
  }

  revalidate();
  return { status: "success", message: "Room updated." };
}

export async function deleteRoom(
  _previousState: RoomActionState,
  formData: FormData
): Promise<RoomActionState> {
  const id = getString(formData, "id");
  if (!id) {
    return { status: "error", message: "Missing room id." };
  }

  const supabase = await createClient();
  const { data: room } = await supabase.from("rooms").select("block_id").eq("id", id).single();

  const { count, error: countError } = await supabase
    .from("beds")
    .select("*", { count: "exact", head: true })
    .eq("room_id", id)
    .not("tenant_id", "is", null);

  if (countError) {
    return { status: "error", message: countError.message };
  }

  if ((count ?? 0) > 0) {
    return { status: "error", message: "Vacate all beds before deleting this room." };
  }

  // Beds cascade-delete with the room.
  const { error } = await supabase.from("rooms").delete().eq("id", id);

  if (error) {
    return { status: "error", message: error.message };
  }

  if (room?.block_id) {
    await syncBlockRoomCount(supabase, room.block_id);
  }
  revalidate();
  return { status: "success", message: "Room deleted." };
}

/* -------------------------------- Beds -------------------------------- */

export async function addBed(
  _previousState: RoomActionState,
  formData: FormData
): Promise<RoomActionState> {
  const roomId = getString(formData, "room_id");
  if (!roomId) {
    return { status: "error", message: "Missing room id." };
  }

  const supabase = await createClient();
  const bedNumber = getString(formData, "bed_number") ?? (await nextBedNumber(supabase, roomId));

  const { error } = await supabase.from("beds").insert({ room_id: roomId, bed_number: bedNumber });

  if (error) {
    return { status: "error", message: error.message };
  }

  revalidate();
  return { status: "success", message: "Bed added." };
}

export async function deleteBed(
  _previousState: RoomActionState,
  formData: FormData
): Promise<RoomActionState> {
  const id = getString(formData, "id");
  if (!id) {
    return { status: "error", message: "Missing bed id." };
  }

  const supabase = await createClient();
  const { data: bed, error: fetchError } = await supabase
    .from("beds")
    .select("room_id, tenant_id")
    .eq("id", id)
    .single();

  if (fetchError) {
    return { status: "error", message: fetchError.message };
  }

  if (bed.tenant_id) {
    return { status: "error", message: "Vacate this bed before removing it." };
  }

  const { error } = await supabase.from("beds").delete().eq("id", id);
  if (error) {
    return { status: "error", message: error.message };
  }

  revalidate();
  return { status: "success", message: "Bed removed." };
}

export async function assignBed(
  _previousState: RoomActionState,
  formData: FormData
): Promise<RoomActionState> {
  const bedId = getString(formData, "bed_id");
  const mode = getString(formData, "mode"); // "existing" | "new"
  const placement = getString(formData, "placement") === "reserved" ? "reserved" : "occupied";
  const expectedDate = placement === "reserved" ? getString(formData, "expected_date") : null;
  if (!bedId || !mode) {
    return initialError;
  }

  const supabase = await createClient();
  const { data: bed, error: bedError } = await supabase
    .from("beds")
    .select("room_id, tenant_id")
    .eq("id", bedId)
    .single();

  if (bedError) {
    return { status: "error", message: bedError.message };
  }
  if (bed.tenant_id) {
    return { status: "error", message: "This bed is already occupied." };
  }

  let tenantId: string | null = null;

  if (mode === "existing") {
    tenantId = getString(formData, "tenant_id");
    if (!tenantId) {
      return { status: "error", message: "Please choose a tenant." };
    }
    // Keep tenants.room_id in sync with their bed's room.
    await supabase.from("tenants").update({ room_id: bed.room_id }).eq("id", tenantId);
  } else {
    const name = getString(formData, "name");
    const phone = getString(formData, "phone");
    if (!name || !phone) {
      return { status: "error", message: "Tenant name and phone are required." };
    }
    const { data: tenant, error: tenantError } = await supabase
      .from("tenants")
      .insert({
        name,
        phone,
        email: getString(formData, "email"),
        room_id: bed.room_id,
        join_date: expectedDate ?? today(),
      })
      .select("id")
      .single();

    if (tenantError) {
      return { status: "error", message: tenantError.message };
    }
    tenantId = tenant.id;
  }

  const { error } = await supabase
    .from("beds")
    .update({ tenant_id: tenantId, status: placement, expected_date: expectedDate })
    .eq("id", bedId);
  if (error) {
    return { status: "error", message: error.message };
  }

  await syncRoomStatus(supabase, bed.room_id);
  revalidate();
  return {
    status: "success",
    message: placement === "reserved" ? "Bed reserved." : "Bed assigned.",
  };
}

export async function vacateBed(
  _previousState: RoomActionState,
  formData: FormData
): Promise<RoomActionState> {
  const id = getString(formData, "id");
  if (!id) {
    return { status: "error", message: "Missing bed id." };
  }

  const supabase = await createClient();
  const { data: bed, error: bedError } = await supabase
    .from("beds")
    .select("room_id")
    .eq("id", id)
    .single();

  if (bedError) {
    return { status: "error", message: bedError.message };
  }

  const { error } = await supabase
    .from("beds")
    .update({ tenant_id: null, status: "available", expected_date: null })
    .eq("id", id);
  if (error) {
    return { status: "error", message: error.message };
  }

  await syncRoomStatus(supabase, bed.room_id);
  revalidate();
  return { status: "success", message: "Bed vacated." };
}

// Convert a reserved bed into an occupied one (the tenant has moved in).
export async function markBedMovedIn(
  _previousState: RoomActionState,
  formData: FormData
): Promise<RoomActionState> {
  const id = getString(formData, "id");
  if (!id) {
    return { status: "error", message: "Missing bed id." };
  }

  const supabase = await createClient();
  const { data: bed, error: bedError } = await supabase
    .from("beds")
    .select("room_id")
    .eq("id", id)
    .single();

  if (bedError) {
    return { status: "error", message: bedError.message };
  }

  const { error } = await supabase
    .from("beds")
    .update({ status: "occupied", expected_date: null })
    .eq("id", id);
  if (error) {
    return { status: "error", message: error.message };
  }

  await syncRoomStatus(supabase, bed.room_id);
  revalidate();
  return { status: "success", message: "Marked as moved in." };
}
