import type { Metadata } from "next";
import {
  AlertCircle,
  BedDouble,
  Building2,
  IndianRupee,
  Inbox,
  UserPlus,
  Users,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

function timeAgo(value: string) {
  const then = new Date(value).getTime();
  const seconds = Math.max(1, Math.round((Date.now() - then) / 1000));
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.round(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.round(months / 12)}y ago`;
}

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const segmentShades = ["bg-stone-800", "bg-stone-500", "bg-stone-300", "bg-stone-200"];

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const greetingName = (user?.email?.split("@")[0] ?? "there").replace(/[._-]/g, " ");
  const displayName = greetingName.charAt(0).toUpperCase() + greetingName.slice(1);

  const [blocks, tenants, rooms, rents, recentInquiries, recentTenants] = await Promise.all([
    supabase.from("blocks").select("*", { count: "exact", head: true }),
    supabase.from("tenants").select("*", { count: "exact", head: true }),
    supabase.from("rooms").select("status"),
    supabase.from("rents").select("amount, status"),
    supabase
      .from("inquiries")
      .select("id, name, status, created_at")
      .order("created_at", { ascending: false })
      .limit(6),
    supabase
      .from("tenants")
      .select("id, name, created_at")
      .order("created_at", { ascending: false })
      .limit(6),
  ]);

  const hasError =
    blocks.error ||
    tenants.error ||
    rooms.error ||
    rents.error ||
    recentInquiries.error ||
    recentTenants.error;

  // Occupancy from real room statuses.
  const roomRows = rooms.data ?? [];
  const totalRooms = roomRows.length;
  const statusCounts = new Map<string, number>();
  for (const room of roomRows) {
    const key = room.status ?? "unknown";
    statusCounts.set(key, (statusCounts.get(key) ?? 0) + 1);
  }
  const occupiedRooms = statusCounts.get("occupied") ?? 0;
  const occupancyPct = totalRooms ? Math.round((occupiedRooms / totalRooms) * 100) : 0;
  const segments = [...statusCounts.entries()].sort((a, b) => b[1] - a[1]);

  // Rent figures from real rows.
  const rentRows = rents.data ?? [];
  const rentCollected = rentRows
    .filter((r) => r.status === "paid")
    .reduce((sum, r) => sum + (r.amount ?? 0), 0);
  const pendingRents = rentRows.filter((r) => r.status === "pending").length;

  const summaries = [
    {
      key: "blocks",
      label: "Blocks",
      value: String(blocks.count ?? 0),
      caption: "Flats & units",
      icon: Building2,
    },
    {
      key: "rooms",
      label: "Rooms",
      value: String(totalRooms),
      caption: totalRooms ? `${occupiedRooms} occupied` : "No rooms yet",
      icon: BedDouble,
    },
    {
      key: "tenants",
      label: "Tenants",
      value: String(tenants.count ?? 0),
      caption: "Current residents",
      icon: Users,
    },
    {
      key: "rent",
      label: "Rent collected",
      value: inr.format(rentCollected),
      caption: pendingRents ? `${pendingRents} pending` : "All settled",
      icon: IndianRupee,
    },
  ];

  // Real activity feed: recent inquiries + recent tenant joins, merged.
  const activity = [
    ...(recentInquiries.data ?? []).map((row) => ({
      id: `inq-${row.id}`,
      name: row.name,
      action: "submitted a new inquiry",
      date: row.created_at,
      icon: Inbox,
    })),
    ...(recentTenants.data ?? []).map((row) => ({
      id: `ten-${row.id}`,
      name: row.name,
      action: "joined as a tenant",
      date: row.created_at,
      icon: UserPlus,
    })),
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6);

  return (
    <div className="space-y-10">
      {/* Page header */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold tracking-[0.18em] text-stone-400 uppercase">
            Dashboard
          </p>
          <h1 className="mt-3 text-4xl font-light tracking-tight text-stone-900 sm:text-5xl">
            Overview
          </h1>
          <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-stone-500">
            Welcome back, {displayName} — a calm look at how your property is performing today.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 self-start rounded-full border border-stone-200/80 bg-white/70 px-3.5 py-2 text-sm text-stone-600 shadow-card">
          <span className="size-1.5 rounded-full bg-emerald-500" />
          All systems operational
        </div>
      </div>

      {hasError ? (
        <div className="flex gap-3 rounded-2xl border border-amber-200/70 bg-amber-50/70 p-4 text-sm text-amber-800 shadow-card">
          <AlertCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          <p>
            Some data is unavailable until admin RLS policies are added. Counts and activity will
            populate once authenticated admin access is allowed.
          </p>
        </div>
      ) : null}

      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {summaries.map((summary) => {
          const Icon = summary.icon;
          return (
            <div
              key={summary.key}
              className="card-surface group rounded-2xl border border-stone-200/80 p-6 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-md"
            >
              <div className="flex items-start justify-between">
                <p className="text-xs font-semibold tracking-[0.12em] text-stone-400 uppercase">
                  {summary.label}
                </p>
                <span className="flex size-9 items-center justify-center rounded-lg border border-stone-200 text-stone-400 transition-colors group-hover:text-stone-600">
                  <Icon aria-hidden="true" className="size-4" />
                </span>
              </div>
              <p className="mt-6 text-4xl font-semibold tracking-tight text-stone-900">
                {summary.value}
              </p>
              <p className="mt-2 text-xs text-stone-400">{summary.caption}</p>
            </div>
          );
        })}
      </div>

      {/* Detail panels */}
      <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        {/* Occupancy */}
        <div className="card-surface rounded-2xl border border-stone-200/80 p-6 shadow-card">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-base font-semibold text-stone-900">Occupancy</h2>
              <p className="mt-1 text-sm text-stone-500">Live room status across all blocks</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-semibold tracking-tight text-stone-900">
                {occupancyPct}%
              </p>
              <p className="text-xs text-stone-400">{occupiedRooms} of {totalRooms} rooms</p>
            </div>
          </div>

          {totalRooms > 0 ? (
            <div className="mt-7">
              <div className="flex h-3 w-full overflow-hidden rounded-full bg-stone-100">
                {segments.map(([status, count], index) => (
                  <div
                    key={status}
                    className={segmentShades[index] ?? "bg-stone-200"}
                    style={{ width: `${(count / totalRooms) * 100}%` }}
                  />
                ))}
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {segments.map(([status, count], index) => (
                  <div key={status} className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-stone-600">
                      <span
                        className={`size-2.5 rounded-full ${segmentShades[index] ?? "bg-stone-200"}`}
                      />
                      <span className="capitalize">{status}</span>
                    </span>
                    <span className="font-medium text-stone-900">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-8 flex h-40 items-center justify-center rounded-xl border border-dashed border-stone-200 text-sm text-stone-400">
              No rooms added yet
            </div>
          )}
        </div>

        {/* Recent activity */}
        <div className="card-surface rounded-2xl border border-stone-200/80 p-6 shadow-card">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-stone-900">Recent activity</h2>
          </div>
          {activity.length > 0 ? (
            <ul className="mt-5 space-y-5">
              {activity.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.id} className="flex gap-3">
                    <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-400">
                      <Icon aria-hidden="true" className="size-3.5" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm leading-snug text-stone-600">
                        <span className="font-medium text-stone-900">{item.name}</span>{" "}
                        {item.action}
                      </p>
                      <p className="mt-0.5 text-xs text-stone-400">{timeAgo(item.date)}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="mt-8 flex h-40 items-center justify-center rounded-xl border border-dashed border-stone-200 text-sm text-stone-400">
              No activity yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
