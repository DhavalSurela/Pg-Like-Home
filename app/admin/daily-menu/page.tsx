import type { Metadata } from "next";
import { AlertCircle } from "lucide-react";

import { DailyMenuManager } from "@/app/admin/daily-menu/DailyMenuManager";
import { ContentNav } from "@/components/admin/AdminSubnav";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Daily Menu",
  robots: {
    index: false,
    follow: false,
  },
};

function indiaDate() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function daysAgo(value: string, days: number) {
  const date = new Date(`${value}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() - days);
  return date.toISOString().slice(0, 10);
}

export default async function DailyMenuPage() {
  const today = indiaDate();
  const cutoff = daysAgo(today, 29);
  const supabase = await createClient();
  const { data: menus, error } = await supabase
    .from("daily_menus")
    .select("*")
    .gte("menu_date", cutoff)
    .lte("menu_date", today)
    .order("menu_date", { ascending: false });

  return (
    <div className="space-y-5 sm:space-y-8">
      <div className="hidden sm:block">
        <p className="hidden text-xs font-semibold tracking-[0.18em] text-stone-400 uppercase sm:block">
          Food
        </p>
        <h1 className="mt-3 hidden text-4xl font-light tracking-tight text-stone-900 sm:block sm:text-5xl">
          Daily Menu
        </h1>
        <p className="mt-0 hidden max-w-xl text-[15px] leading-relaxed text-stone-500 sm:mt-3 sm:block">
          Record what was served for breakfast, lunch, and dinner. The latest 30 days appear on the
          public food page.
        </p>
      </div>

      <ContentNav />

      {error ? (
        <div className="flex gap-3 rounded-2xl border border-amber-200/70 bg-amber-50/70 p-4 text-sm text-amber-800 shadow-card">
          <AlertCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          <p>Daily menus could not be loaded: {error.message}</p>
        </div>
      ) : null}

      <DailyMenuManager menus={menus ?? []} today={today} />
    </div>
  );
}
