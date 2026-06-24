import { AdminPageHeading, Bar } from "@/components/admin/Skeletons";

export default function PricingLoading() {
  return (
    <div className="space-y-8">
      <AdminPageHeading
        eyebrow="Pricing"
        title="Pricing"
        description="Manage the room plans shown on the public Rooms & Pricing page."
      />
      <div className="card-surface animate-pulse overflow-hidden rounded-2xl border border-stone-200/80 shadow-card">
        <div className="flex items-center justify-between border-b border-stone-200/80 px-5 py-4">
          <Bar className="h-5 w-32" />
          <Bar className="h-9 w-28" />
        </div>
        <div className="grid gap-4 p-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-stone-200/80 bg-white p-5 shadow-card">
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
