"use server";

import { revalidatePath } from "next/cache";

import { INQUIRY_STATUSES } from "@/app/admin/inquiries/constants";
import { createClient } from "@/lib/supabase/server";

export type InquiryActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

function getString(formData: FormData, key: string) {
  const value = String(formData.get(key) ?? "").trim();
  return value.length > 0 ? value : null;
}

function revalidate() {
  revalidatePath("/admin/inquiries");
  revalidatePath("/admin");
}

export async function createInquiry(
  _previousState: InquiryActionState,
  formData: FormData
): Promise<InquiryActionState> {
  const name = getString(formData, "name");
  const phone = getString(formData, "phone");
  if (!name || !phone) {
    return { status: "error", message: "Name and phone are required." };
  }

  const statusRaw = getString(formData, "status") ?? "new";
  const status = (INQUIRY_STATUSES as readonly string[]).includes(statusRaw) ? statusRaw : "new";

  const supabase = await createClient();
  const { error } = await supabase.from("inquiries").insert({
    name,
    phone,
    email: getString(formData, "email"),
    message: getString(formData, "message") ?? "(added manually)",
    status,
    admin_note: getString(formData, "admin_note"),
  });

  if (error) {
    return { status: "error", message: error.message };
  }

  revalidate();
  return { status: "success", message: "Inquiry added." };
}

export async function updateInquiry(
  _previousState: InquiryActionState,
  formData: FormData
): Promise<InquiryActionState> {
  const id = getString(formData, "id");
  const statusRaw = getString(formData, "status") ?? "new";
  const status = (INQUIRY_STATUSES as readonly string[]).includes(statusRaw) ? statusRaw : "new";

  if (!id) {
    return { status: "error", message: "Missing inquiry id." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("inquiries")
    .update({ status, admin_note: getString(formData, "admin_note") })
    .eq("id", id);

  if (error) {
    return { status: "error", message: error.message };
  }

  revalidate();
  return { status: "success", message: "Saved." };
}

export async function deleteInquiry(
  _previousState: InquiryActionState,
  formData: FormData
): Promise<InquiryActionState> {
  const id = getString(formData, "id");
  if (!id) {
    return { status: "error", message: "Missing inquiry id." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("inquiries").delete().eq("id", id);

  if (error) {
    return { status: "error", message: error.message };
  }

  revalidate();
  return { status: "success", message: "Inquiry deleted." };
}
