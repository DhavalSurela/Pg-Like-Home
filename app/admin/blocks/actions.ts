"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

export type BlockActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

const initialError = {
  status: "error" as const,
  message: "Please fill all required fields correctly.",
};

function getRequiredString(formData: FormData, key: string) {
  const value = String(formData.get(key) ?? "").trim();
  return value.length > 0 ? value : null;
}

function getRequiredInteger(formData: FormData, key: string, min?: number) {
  const value = Number(formData.get(key));

  if (!Number.isInteger(value)) {
    return null;
  }

  if (typeof min === "number" && value < min) {
    return null;
  }

  return value;
}

function getBlockPayload(formData: FormData) {
  const blockName = getRequiredString(formData, "block_name");
  const blockType = getRequiredString(formData, "block_type");
  const floor = getRequiredInteger(formData, "floor");
  const totalRooms = getRequiredInteger(formData, "total_rooms", 1);

  if (!blockName || !blockType || floor === null || totalRooms === null) {
    return null;
  }

  return {
    block_name: blockName,
    block_type: blockType,
    floor,
    total_rooms: totalRooms,
  };
}

export async function createBlock(
  _previousState: BlockActionState,
  formData: FormData
): Promise<BlockActionState> {
  const payload = getBlockPayload(formData);

  if (!payload) {
    return initialError;
  }

  const supabase = await createClient();
  const { data: block, error } = await supabase
    .from("blocks")
    .insert(payload)
    .select("id")
    .single();

  if (error) {
    return {
      status: "error",
      message: error.message,
    };
  }

  // Auto-create the declared number of rooms, each with one bed.
  if (payload.total_rooms > 0) {
    const rooms = Array.from({ length: payload.total_rooms }, (_, i) => ({
      block_id: block.id,
      room_number: `Room ${i + 1}`,
      room_type: "AC",
      capacity: 1,
      status: "available",
    }));

    const { data: createdRooms, error: roomsError } = await supabase
      .from("rooms")
      .insert(rooms)
      .select("id");

    if (roomsError) {
      return { status: "error", message: `Block created, but rooms failed: ${roomsError.message}` };
    }

    const beds = (createdRooms ?? []).map((room) => ({ room_id: room.id, bed_number: "1" }));
    if (beds.length > 0) {
      const { error: bedsError } = await supabase.from("beds").insert(beds);
      if (bedsError) {
        return { status: "error", message: `Rooms created, but beds failed: ${bedsError.message}` };
      }
    }
  }

  revalidatePath("/admin");
  revalidatePath("/admin/rooms");

  return {
    status: "success",
    message: "Block added.",
  };
}

export async function updateBlock(
  _previousState: BlockActionState,
  formData: FormData
): Promise<BlockActionState> {
  const id = getRequiredString(formData, "id");
  const blockName = getRequiredString(formData, "block_name");
  const blockType = getRequiredString(formData, "block_type");
  const floor = getRequiredInteger(formData, "floor");

  if (!id || !blockName || !blockType || floor === null) {
    return initialError;
  }

  // total_rooms is derived from actual rooms (kept in sync on room add/delete),
  // so editing a block only changes its name, type, and floor.
  const supabase = await createClient();
  const { error } = await supabase
    .from("blocks")
    .update({ block_name: blockName, block_type: blockType, floor })
    .eq("id", id);

  if (error) {
    return {
      status: "error",
      message: error.message,
    };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/rooms");

  return {
    status: "success",
    message: "Block updated.",
  };
}

export async function deleteBlock(
  _previousState: BlockActionState,
  formData: FormData
): Promise<BlockActionState> {
  const id = getRequiredString(formData, "id");

  if (!id) {
    return {
      status: "error",
      message: "Missing block id.",
    };
  }

  const supabase = await createClient();
  const { count, error: countError } = await supabase
    .from("rooms")
    .select("*", { count: "exact", head: true })
    .eq("block_id", id);

  if (countError) {
    return {
      status: "error",
      message: countError.message,
    };
  }

  if ((count ?? 0) > 0) {
    return {
      status: "error",
      message: "Cannot delete a block that has rooms.",
    };
  }

  const { error } = await supabase.from("blocks").delete().eq("id", id);

  if (error) {
    return {
      status: "error",
      message: error.message,
    };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/rooms");

  return {
    status: "success",
    message: "Block deleted.",
  };
}
