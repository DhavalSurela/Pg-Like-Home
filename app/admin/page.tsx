import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  ArrowUpRight,
  BedDouble,
  CalendarPlus,
  CircleCheck,
  Clock3,
  FilePlus2,
  IndianRupee,
  MessageSquarePlus,
  UsersRound,
  WalletCards,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const monthLabel = new Intl.DateTimeFormat("en-IN", {
  month: "long",
  year: "numeric",
});

type MetricCardProps = {
  label: string;
  value: string;
  detail: string;
  icon: typeof BedDouble;
  tone: "dark" | "green" | "amber" | "light";
  href: string;
};

const metricTones = {
  dark: {
    card: "border-stone-800 bg-stone-900 text-white",
    label: "text-stone-400",
    detail: "text-stone-400",
    icon: "border-white/10 bg-white/10 text-stone-200",
  },
  green: {
    card: "border-emerald-200/80 bg-emerald-50/70 text-stone-900",
    label: "text-emerald-700",
    detail: "text-emerald-700/70",
    icon: "border-emerald-200 bg-white/70 text-emerald-700",
  },
  amber: {
    card: "border-amber-200/80 bg-amber-50/70 text-stone-900",
    label: "text-amber-700",
    detail: "text-amber-700/70",
    icon: "border-amber-200 bg-white/70 text-amber-700",
  },
  light: {
    card: "card-surface border-stone-200/80 text-stone-900",
    label: "text-stone-500",
    detail: "text-stone-400",
    icon: "border-stone-200 bg-stone-50 text-stone-500",
  },
} as const;

const quickLinks = [
  {
    href: "/admin/daily-menu",
    title: "Today’s menu",
    detail: "Add breakfast, lunch and dinner",
    icon: CalendarPlus,
    iconClass: "bg-amber-100 text-amber-700",
  },
  {
    href: "/admin/tenants",
    title: "Manage residents",
    detail: "Search, add or update residents",
    icon: UsersRound,
    iconClass: "bg-emerald-100 text-emerald-700",
  },
  {
    href: "/admin/inquiries?new=1",
    title: "New inquiry",
    detail: "Add a phone or walk-in inquiry",
    icon: MessageSquarePlus,
    iconClass: "bg-sky-100 text-sky-700",
  },
  {
    href: "/admin/rents?filter=unpaid",
    title: "Pending rents",
    detail: "Record outstanding collections",
    icon: WalletCards,
    iconClass: "bg-violet-100 text-violet-700",
  },
  {
    href: "/admin/bills",
    title: "Add a bill",
    detail: "Manage block and AC electricity",
    icon: FilePlus2,
    iconClass: "bg-rose-100 text-rose-700",
  },
] as const;

function MetricCard({ label, value, detail, icon: Icon, tone, href }: MetricCardProps) {
  const colors = metricTones[tone];

  return (
    <Link
      href={href}
      aria-label={`View ${label.toLowerCase()} details`}
      className={`admin-metric-card admin-tone-${tone} min-w-0 rounded-2xl border p-4 shadow-card transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900 sm:rounded-3xl sm:p-7 ${colors.card}`}
    >
      <div className="flex items-start justify-between gap-2 sm:gap-4">
        <div className="min-w-0">
          <p
            className={`admin-metric-label text-xs font-semibold tracking-[0.14em] uppercase ${colors.label}`}
          >
            {label}
          </p>
          <p className="admin-metric-value mt-3 text-xl font-semibold tracking-tight sm:mt-5 sm:text-5xl">
            {value}
          </p>
          <p
            className={`admin-metric-detail mt-1.5 text-xs leading-snug sm:mt-2 sm:text-sm ${colors.detail}`}
          >
            {detail}
          </p>
        </div>
        <span
          className={`admin-metric-icon hidden size-11 shrink-0 items-center justify-center rounded-2xl border sm:flex ${colors.icon}`}
        >
          <Icon aria-hidden="true" className="size-4 sm:size-5" />
        </span>
      </div>
    </Link>
  );
}

function clampPercent(value: number) {
  return Math.min(100, Math.max(0, Math.round(value)));
}

export default async function AdminPage() {
  const supabase = await createClient();
  const now = new Date();
  const currentMonth = `${now.toISOString().slice(0, 7)}-01`;

  const [bedsResult, rentsResult] = await Promise.all([
    supabase.from("beds").select("status"),
    supabase.from("rents").select("amount, status").eq("month", currentMonth),
  ]);

  const hasError = bedsResult.error || rentsResult.error;
  const beds = bedsResult.data ?? [];
  const rents = rentsResult.data ?? [];

  const occupiedBeds = beds.filter((bed) => bed.status === "occupied").length;
  const availableBeds = beds.filter((bed) => bed.status === "available").length;
  const reservedBeds = beds.filter((bed) => bed.status === "reserved").length;
  const totalBeds = beds.length;
  const occupancyRate = totalBeds ? clampPercent((occupiedBeds / totalBeds) * 100) : 0;

  const paidRents = rents.filter((rent) => rent.status === "paid");
  const pendingRents = rents.filter((rent) => rent.status === "pending");
  const rentCollected = paidRents.reduce((sum, rent) => sum + Number(rent.amount ?? 0), 0);
  const rentPending = pendingRents.reduce((sum, rent) => sum + Number(rent.amount ?? 0), 0);
  const collectibleRent = rentCollected + rentPending;
  const collectionRate = collectibleRent
    ? clampPercent((rentCollected / collectibleRent) * 100)
    : 0;

  return (
    <div className="admin-dashboard space-y-6 sm:space-y-10">
      {hasError ? (
        <div className="flex gap-3 rounded-2xl border border-amber-200/70 bg-amber-50/70 p-4 text-sm text-amber-800 shadow-card">
          <AlertCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          <p>Some dashboard data could not be loaded. Please refresh or check admin access.</p>
        </div>
      ) : null}

      <section className="admin-dashboard-section" aria-labelledby="beds-heading">
        <div className="admin-section-heading mb-3 flex items-end justify-between gap-3 sm:mb-4 sm:gap-4">
          <div>
            <h2 id="beds-heading" className="text-base font-semibold text-stone-900 sm:text-lg">
              Beds
            </h2>
            <p className="mt-1 hidden text-sm text-stone-500 sm:block">
              {totalBeds} beds across the property
            </p>
          </div>
          <p className="text-right text-xs text-stone-500 sm:hidden">
            {totalBeds} beds across the property
          </p>
          <Link
            href="/admin/rooms"
            className="group hidden items-center gap-1.5 text-sm font-medium text-stone-600 hover:text-stone-900 sm:inline-flex"
          >
            Manage beds
            <ArrowRight
              aria-hidden="true"
              className="size-4 transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
          <MetricCard
            label="Occupied"
            value={String(occupiedBeds)}
            detail={`${occupancyRate}% occupancy`}
            icon={BedDouble}
            tone="dark"
            href="/admin/rooms?status=occupied"
          />
          <MetricCard
            label="Available"
            value={String(availableBeds)}
            detail={reservedBeds ? `${reservedBeds} more reserved` : "Ready for new tenants"}
            icon={CircleCheck}
            tone="green"
            href="/admin/rooms?status=available"
          />
        </div>

        <div className="admin-progress-card card-surface mt-2.5 rounded-xl border border-stone-200/80 p-3 shadow-card sm:mt-4 sm:rounded-2xl sm:p-4">
          <div className="flex items-center justify-between gap-4 text-sm">
            <span className="text-stone-500">Occupancy</span>
            <span className="font-semibold text-stone-900">{occupancyRate}%</span>
          </div>
          <div className="mt-2 flex h-2 overflow-hidden rounded-full bg-stone-100 sm:mt-3 sm:h-2.5">
            <span className="bg-stone-800" style={{ width: `${occupancyRate}%` }} />
            {totalBeds ? (
              <span
                className="bg-stone-300"
                style={{ width: `${(reservedBeds / totalBeds) * 100}%` }}
              />
            ) : null}
          </div>
          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1.5 text-[11px] text-stone-500 sm:mt-3 sm:gap-x-5 sm:gap-y-2 sm:text-xs">
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-stone-800" />
              {occupiedBeds} occupied
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-stone-300" />
              {reservedBeds} reserved
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-stone-100 ring-1 ring-stone-200" />
              {availableBeds} available
            </span>
          </div>
        </div>
      </section>

      <section className="admin-dashboard-section" aria-labelledby="rent-heading">
        <div className="admin-section-heading mb-3 flex items-end justify-between gap-3 sm:mb-4 sm:gap-4">
          <div>
            <h2 id="rent-heading" className="text-base font-semibold text-stone-900 sm:text-lg">
              Rent
            </h2>
            <p className="mt-1 hidden text-sm text-stone-500 sm:block">
              {monthLabel.format(now)} collection
            </p>
          </div>
          <p className="text-right text-xs text-stone-500 sm:hidden">
            {monthLabel.format(now)} collection
          </p>
          <Link
            href="/admin/rents"
            className="group hidden items-center gap-1.5 text-sm font-medium text-stone-600 hover:text-stone-900 sm:inline-flex"
          >
            Manage rents
            <ArrowRight
              aria-hidden="true"
              className="size-4 transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
          <MetricCard
            label="Collected"
            value={inr.format(rentCollected)}
            detail={`${paidRents.length} ${paidRents.length === 1 ? "payment" : "payments"} received`}
            icon={IndianRupee}
            tone="light"
            href="/admin/rents?filter=paid"
          />
          <MetricCard
            label="Pending"
            value={inr.format(rentPending)}
            detail={`${pendingRents.length} ${pendingRents.length === 1 ? "payment needs" : "payments need"} follow-up`}
            icon={Clock3}
            tone={pendingRents.length ? "amber" : "green"}
            href="/admin/rents?filter=unpaid"
          />
        </div>

        <div className="admin-progress-card card-surface mt-2.5 rounded-xl border border-stone-200/80 p-3 shadow-card sm:mt-4 sm:rounded-2xl sm:p-4">
          <div className="flex items-center justify-between gap-4 text-sm">
            <span className="text-stone-500">Collection progress</span>
            <span className="font-semibold text-stone-900">{collectionRate}%</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-amber-100 sm:mt-3 sm:h-2.5">
            <div
              className="h-full rounded-full bg-emerald-600"
              style={{ width: `${collectionRate}%` }}
            />
          </div>
          <p className="mt-2 text-[11px] text-stone-500 sm:mt-3 sm:text-xs">
            {collectibleRent
              ? `${inr.format(rentCollected)} collected out of ${inr.format(collectibleRent)} due`
              : "No collected or pending rent records for this month"}
          </p>
        </div>
      </section>

      <section className="admin-dashboard-section" aria-labelledby="quick-actions-heading">
        <div className="admin-section-heading mb-3 sm:mb-4">
          <h2
            id="quick-actions-heading"
            className="text-base font-semibold text-stone-900 sm:text-lg"
          >
            Quick actions
          </h2>
          <p className="mt-1 hidden text-sm text-stone-500 sm:block">
            Jump directly to the tasks you use most.
          </p>
        </div>

        <div className="-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto pb-2 [scrollbar-width:none] before:block before:min-w-1 before:shrink-0 before:content-[''] after:block after:min-w-[11%] after:shrink-0 after:content-[''] sm:mx-0 sm:grid sm:grid-cols-2 sm:pb-0 sm:before:hidden sm:after:hidden lg:grid-cols-5 [&::-webkit-scrollbar]:hidden">
          {quickLinks.map((item, index) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`admin-quick-card card-surface group flex flex-col rounded-2xl border border-stone-200/80 p-4 shadow-card transition hover:-translate-y-0.5 hover:border-stone-300 hover:shadow-card-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900 sm:min-w-0 sm:snap-none ${
                  index === 0 ? "min-w-[78%] snap-start" : "min-w-[78%] snap-center"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <span
                    className={`flex size-10 items-center justify-center rounded-xl ${item.iconClass}`}
                  >
                    <Icon aria-hidden="true" className="size-[1.1rem]" />
                  </span>
                  <ArrowUpRight
                    aria-hidden="true"
                    className="size-4 text-stone-300 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-stone-600"
                  />
                </div>
                <h3 className="mt-4 text-sm font-semibold text-stone-900">{item.title}</h3>
                <p className="mt-1 text-xs leading-5 text-stone-500">{item.detail}</p>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
