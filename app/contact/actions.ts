"use server";

import { createClient } from "@/lib/supabase/server";

export type InquiryFormState = {
  status: "idle" | "success" | "error";
  message: string;
};

function getString(formData: FormData, key: string) {
  const value = String(formData.get(key) ?? "").trim();
  return value.length > 0 ? value : null;
}

export async function submitInquiry(
  _previousState: InquiryFormState,
  formData: FormData
): Promise<InquiryFormState> {
  const name = getString(formData, "name");
  const phone = getString(formData, "phone");
  const message = getString(formData, "message");

  if (!name || !phone || !message) {
    return { status: "error", message: "Please fill in your name, phone, and message." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("inquiries").insert({
    name,
    phone,
    email: getString(formData, "email"),
    message,
  });

  if (error) {
    return { status: "error", message: "Sorry, something went wrong. Please try again or call us." };
  }

  return { status: "success", message: "Thanks! We've received your message and will get back to you soon." };
}
