"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

export type DailyMenuActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

function getString(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export async function saveDailyMenu(
  _previousState: DailyMenuActionState,
  formData: FormData
): Promise<DailyMenuActionState> {
  const menuDate = getString(formData, "menu_date");
  const breakfast = getString(formData, "breakfast");
  const lunch = getString(formData, "lunch");
  const dinner = getString(formData, "dinner");

  if (!/^\d{4}-\d{2}-\d{2}$/.test(menuDate)) {
    return { status: "error", message: "Choose a valid menu date." };
  }

  if (!breakfast || !lunch || !dinner) {
    return { status: "error", message: "Please enter breakfast, lunch, and dinner." };
  }

  if ([breakfast, lunch, dinner].some((meal) => meal.length > 500)) {
    return { status: "error", message: "Each meal must be 500 characters or fewer." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("daily_menus").upsert(
    {
      menu_date: menuDate,
      breakfast,
      lunch,
      dinner,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "menu_date" }
  );

  if (error) {
    return { status: "error", message: error.message };
  }

  revalidatePath("/admin/daily-menu");
  revalidatePath("/food");

  return { status: "success", message: "Daily menu saved." };
}
