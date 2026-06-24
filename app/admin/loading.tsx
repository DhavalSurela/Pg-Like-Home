import { Bar } from "@/components/admin/Skeletons";

// Dashboard skeleton (matches app/admin/page.tsx).
export default function DashboardLoading() {
  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold tracking-[0.18em] text-stone-400 uppercase">Dashboard</p>
          <h1 className="mt-3 text-4xl font-light tracking-tight text-stone-900 sm:text-5xl">Overview</h1>
          <Bar className="mt-4 h-4 w-80 max-w-full" />
        </div>
        <Bar className="h-9 w-44 rounded-full" />
      </div>

      <div className="grid animate-pulse gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="card-surface rounded-2xl border border-stone-200/80 p-6 shadow-card">
            <div className="flex items-start justify-between">
              <Bar className="h-3 w-16" />
              <Bar className="size-9 rounded-lg" />
            </div>
            <Bar className="mt-6 h-9 w-20" />
            <Bar className="mt-2 h-3 w-24" />
          </div>
        ))}
      </div>

      <div className="grid animate-pulse gap-4 lg:grid-cols-[1.6fr_1fr]">
        <div className="card-surface h-64 rounded-2xl border border-stone-200/80 shadow-card" />
        <div className="card-surface h-64 rounded-2xl border border-stone-200/80 shadow-card" />
      </div>
    </div>
  );
}
