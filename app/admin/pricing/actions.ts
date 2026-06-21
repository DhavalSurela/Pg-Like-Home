"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

export type PricingActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

const initialError: PricingActionState = {
  status: "error",
  message: "Please fill all required fields correctly.",
};

function getString(formData: FormData, key: string) {
  const value = String(formData.get(key) ?? "").trim();
  return value.length > 0 ? value : null;
}

function getNumber(formData: FormData, key: string, min = 0) {
  const value = Number(formData.get(key));
  if (!Number.isFinite(value) || value < min) {
    return null;
  }
  return value;
}

function getPricingPayload(formData: FormData) {
  const planName = getString(formData, "plan_name");
  const occupancyType = getString(formData, "occupancy_type");
  const monthlyRate = getNumber(formData, "monthly_rate");

  if (!planName || !occupancyType || monthlyRate === null) {
    return null;
  }

  const features = String(formData.get("features") ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  return {
    plan_name: planName,
    subtitle: getString(formData, "subtitle"),
    occupancy_type: occupancyType,
    monthly_rate: monthlyRate,
    deposit: getNumber(formData, "deposit") ?? 0,
    tag: getString(formData, "tag"),
    description: getString(formData, "description"),
    inclusions: getString(formData, "inclusions"),
    features,
    recommended: formData.get("recommended") === "on",
    sort_order: getNumber(formData, "sort_order") ?? 0,
  };
}

function revalidate() {
  revalidatePath("/admin/pricing");
  revalidatePath("/rooms");
}

export async function createPricing(
  _previousState: PricingActionState,
  formData: FormData
): Promise<PricingActionState> {
  const payload = getPricingPayload(formData);
  if (!payload) {
    return initialError;
  }

  const supabase = await createClient();
  const { error } = await supabase.from("pricing").insert(payload);

  if (error) {
    return { status: "error", message: error.message };
  }

  revalidate();
  return { status: "success", message: "Plan added." };
}

export async function updatePricing(
  _previousState: PricingActionState,
  formData: FormData
): Promise<PricingActionState> {
  const id = getString(formData, "id");
  const payload = getPricingPayload(formData);

  if (!id || !payload) {
    return initialError;
  }

  const supabase = await createClient();
  const { error } = await supabase.from("pricing").update(payload).eq("id", id);

  if (error) {
    return { status: "error", message: error.message };
  }

  revalidate();
  return { status: "success", message: "Plan updated." };
}

export async function deletePricing(
  _previousState: PricingActionState,
  formData: FormData
): Promise<PricingActionState> {
  const id = getString(formData, "id");
  if (!id) {
    return { status: "error", message: "Missing plan id." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("pricing").delete().eq("id", id);

  if (error) {
    return { status: "error", message: error.message };
  }

  revalidate();
  return { status: "success", message: "Plan deleted." };
}
