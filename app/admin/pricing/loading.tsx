import { AdminPageHeading, Bar } from "@/components/admin/Skeletons";
import { ContentNav } from "@/components/admin/AdminSubnav";

export default function PricingLoading() {
  return (
    <div className="admin-skeleton-page space-y-5 sm:space-y-8">
      <AdminPageHeading
        eyebrow="Pricing"
        title="Pricing"
        description="Manage the room plans shown on the public Rooms & Pricing page."
      />
      <ContentNav />
      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <Bar className="h-5 w-32" />
            <Bar className="h-3 w-64 max-w-full" />
          </div>
          <Bar className="h-11 w-full rounded-xl sm:h-9 sm:w-28" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="admin-skeleton-card card-surface rounded-xl border border-stone-200/80 p-5 shadow-card"
            >
              <Bar className="h-4 w-16" />
              <Bar className="mt-3 h-5 w-28" />
              <Bar className="mt-3 h-7 w-24" />
              <div className="mt-4 space-y-2">
                {Array.from({ length: 4 }).map((__, j) => (
                  <Bar key={j} className="h-3 w-full" />
                ))}
              </div>
              <Bar className="mt-5 h-8 w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
