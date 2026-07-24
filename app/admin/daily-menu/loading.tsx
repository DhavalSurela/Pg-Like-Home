import { ContentNav } from "@/components/admin/AdminSubnav";
import { AdminPageHeading, Bar } from "@/components/admin/Skeletons";

export default function DailyMenuLoading() {
  return (
    <div className="admin-skeleton-page space-y-5 sm:space-y-8">
      <AdminPageHeading
        eyebrow="Food"
        title="Daily Menu"
        description="Record what was served for breakfast, lunch, and dinner."
      />
      <ContentNav />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.8fr)]">
        <section className="admin-skeleton-card card-surface rounded-2xl border border-stone-200/80 p-5 shadow-card sm:p-6">
          <Bar className="h-5 w-36" />
          <Bar className="mt-2 h-3 w-64 max-w-full" />

          <div className="mt-6 space-y-5">
            <div>
              <Bar className="h-3 w-24" />
              <Bar className="mt-2 h-11 w-full rounded-xl" />
            </div>
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index}>
                <Bar className="h-3 w-20" />
                <Bar className="mt-2 h-20 w-full rounded-xl" />
              </div>
            ))}
            <Bar className="h-11 w-full rounded-xl sm:w-36" />
          </div>
        </section>

        <section className="admin-skeleton-card card-surface overflow-hidden rounded-2xl border border-stone-200/80 shadow-card">
          <div className="border-b border-stone-200/80 px-5 py-4">
            <Bar className="h-4 w-28" />
            <Bar className="mt-2 h-3 w-24" />
          </div>
          <div className="divide-y divide-stone-100">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="px-5 py-4">
                <div className="flex items-center justify-between">
                  <Bar className="h-4 w-28" />
                  <Bar className="size-4" />
                </div>
                <Bar className="mt-3 h-3 w-full" />
                <Bar className="mt-2 h-3 w-4/5" />
                <Bar className="mt-2 h-3 w-3/5" />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
