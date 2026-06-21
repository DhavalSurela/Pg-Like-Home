"use server";

import { revalidatePath } from "next/cache";

import { FOOD_CATEGORY_VALUES } from "@/lib/foodCategories";
import { createClient } from "@/lib/supabase/server";

export type FoodPhotoActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

const BUCKET = "food-photos";
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

function getString(formData: FormData, key: string) {
  const value = String(formData.get(key) ?? "").trim();
  return value.length > 0 ? value : null;
}

function getCategory(formData: FormData) {
  const value = getString(formData, "category");
  return value && FOOD_CATEGORY_VALUES.includes(value) ? value : null;
}

function getNumber(formData: FormData, key: string) {
  const value = Number(formData.get(key));
  return Number.isFinite(value) ? value : 0;
}

function revalidate() {
  revalidatePath("/admin/food-photos");
  revalidatePath("/food");
}

// Derive the storage object path from a public URL, or null for non-storage
// URLs (e.g. the seeded /images/food/... static paths).
function storagePathFromUrl(url: string) {
  const marker = `/storage/v1/object/public/${BUCKET}/`;
  const index = url.indexOf(marker);
  if (index === -1) return null;
  return decodeURIComponent(url.slice(index + marker.length));
}

export async function createFoodPhoto(
  _previousState: FoodPhotoActionState,
  formData: FormData
): Promise<FoodPhotoActionState> {
  const category = getCategory(formData);
  const title = getString(formData, "title") ?? "Food photo";
  const file = formData.get("file");

  if (!category) {
    return { status: "error", message: "Please choose a valid category." };
  }

  if (!(file instanceof File) || file.size === 0) {
    return { status: "error", message: "Please choose an image to upload." };
  }

  if (!file.type.startsWith("image/")) {
    return { status: "error", message: "Only image files are allowed." };
  }

  if (file.size > MAX_BYTES) {
    return { status: "error", message: "Image must be 5 MB or smaller." };
  }

  const supabase = await createClient();

  const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
  const objectPath = `${category}/${Date.now()}-${safeName}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(objectPath, file, { contentType: file.type, upsert: false });

  if (uploadError) {
    return { status: "error", message: `Upload failed: ${uploadError.message}` };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET).getPublicUrl(objectPath);

  const { error: insertError } = await supabase.from("food_photos").insert({
    title,
    image_url: publicUrl,
    category,
    sort_order: getNumber(formData, "sort_order"),
  });

  if (insertError) {
    // Roll back the orphaned upload so storage and the table stay consistent.
    await supabase.storage.from(BUCKET).remove([objectPath]);
    return { status: "error", message: insertError.message };
  }

  revalidate();
  return { status: "success", message: "Photo uploaded." };
}

export async function updateFoodPhoto(
  _previousState: FoodPhotoActionState,
  formData: FormData
): Promise<FoodPhotoActionState> {
  const id = getString(formData, "id");
  const category = getCategory(formData);
  const title = getString(formData, "title") ?? "Food photo";

  if (!id || !category) {
    return { status: "error", message: "Missing photo details." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("food_photos")
    .update({ title, category, sort_order: getNumber(formData, "sort_order") })
    .eq("id", id);

  if (error) {
    return { status: "error", message: error.message };
  }

  revalidate();
  return { status: "success", message: "Photo updated." };
}

export async function deleteFoodPhoto(
  _previousState: FoodPhotoActionState,
  formData: FormData
): Promise<FoodPhotoActionState> {
  const id = getString(formData, "id");
  const imageUrl = getString(formData, "image_url");

  if (!id) {
    return { status: "error", message: "Missing photo id." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("food_photos").delete().eq("id", id);

  if (error) {
    return { status: "error", message: error.message };
  }

  // Remove the underlying file too, but only if it lives in our bucket.
  if (imageUrl) {
    const path = storagePathFromUrl(imageUrl);
    if (path) {
      await supabase.storage.from(BUCKET).remove([path]);
    }
  }

  revalidate();
  return { status: "success", message: "Photo deleted." };
}
