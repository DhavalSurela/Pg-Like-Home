import type { Metadata } from "next";
import { AlertCircle } from "lucide-react";

import { InquiriesManager } from "@/app/admin/inquiries/InquiriesManager";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Inquiries",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function InquiriesPage() {
  const supabase = await createClient();
  const { data: inquiries, error } = await supabase
    .from("inquiries")
    .select("*")
    .order("created_at", { ascending: false });

  const newCount = (inquiries ?? []).filter((i) => i.status === "new").length;

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold tracking-[0.18em] text-stone-400 uppercase">Inquiries</p>
        <h1 className="mt-3 text-4xl font-light tracking-tight text-stone-900 sm:text-5xl">Inquiries</h1>
        <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-stone-500">
          Messages submitted through the website contact form.
          {newCount > 0 ? ` ${newCount} new.` : ""}
        </p>
      </div>

      {error ? (
        <div className="flex gap-3 rounded-2xl border border-amber-200/70 bg-amber-50/70 p-4 text-sm text-amber-800 shadow-card">
          <AlertCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          <p>Inquiries could not be loaded: {error.message}</p>
        </div>
      ) : null}

      <InquiriesManager inquiries={inquiries ?? []} />
    </div>
  );
}
