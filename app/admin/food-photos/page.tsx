import type { Metadata } from "next";
import { AlertCircle } from "lucide-react";

import { FoodPhotosManager } from "@/app/admin/food-photos/FoodPhotosManager";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Food Photos",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function FoodPhotosPage() {
  const supabase = await createClient();
  const { data: photos, error } = await supabase
    .from("food_photos")
    .select("*")
    .order("category", { ascending: true })
    .order("sort_order", { ascending: true });

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold tracking-[0.18em] text-stone-400 uppercase">Food photos</p>
        <h1 className="mt-3 text-4xl font-light tracking-tight text-stone-900 sm:text-5xl">Food Photos</h1>
        <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-stone-500">
          Upload and organise the meal photos shown in the sliders on the public Food page.
        </p>
      </div>

      {error ? (
        <div className="flex gap-3 rounded-2xl border border-amber-200/70 bg-amber-50/70 p-4 text-sm text-amber-800 shadow-card">
          <AlertCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          <p>Photos could not be loaded: {error.message}</p>
        </div>
      ) : null}

      <FoodPhotosManager photos={photos ?? []} />
    </div>
  );
}
