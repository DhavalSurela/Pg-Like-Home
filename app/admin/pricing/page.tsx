import type { Metadata } from "next";
import { AlertCircle } from "lucide-react";

import { PricingManager } from "@/app/admin/pricing/PricingManager";
import { ContentNav } from "@/components/admin/AdminSubnav";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Pricing",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function PricingPage() {
  const supabase = await createClient();
  const { data: plans, error } = await supabase
    .from("pricing")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("monthly_rate", { ascending: true });

  return (
    <div className="space-y-5 sm:space-y-8">
      <div className="hidden sm:block">
        <p className="hidden text-xs font-semibold tracking-[0.18em] text-stone-400 uppercase sm:block">
          Pricing
        </p>
        <h1 className="mt-3 hidden text-4xl font-light tracking-tight text-stone-900 sm:block sm:text-5xl">
          Pricing
        </h1>
        <p className="mt-0 hidden max-w-xl text-[15px] leading-relaxed text-stone-500 sm:mt-3 sm:block">
          Manage the room plans shown on the public Rooms &amp; Pricing page.
        </p>
      </div>

      <ContentNav />

      {error ? (
        <div className="flex gap-3 rounded-2xl border border-amber-200/70 bg-amber-50/70 p-4 text-sm text-amber-800 shadow-card">
          <AlertCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          <p>Pricing could not be loaded: {error.message}</p>
        </div>
      ) : null}

      <PricingManager plans={plans ?? []} />
    </div>
  );
}
