import { AdminPageHeading, Bar } from "@/components/admin/Skeletons";

export default function RoomsLoading() {
  return (
    <div className="space-y-8">
      <AdminPageHeading
        eyebrow="Rooms"
        title="Rooms"
        description="Select a block to see its rooms and beds. Click a bed to assign or vacate a tenant."
      />
      <div className="animate-pulse space-y-6">
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Bar key={i} className="h-14 w-36 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="card-surface rounded-2xl border border-stone-200/80 p-5 shadow-card">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <Bar className="h-5 w-24" />
                  <Bar className="h-3 w-20" />
                </div>
                <Bar className="h-7 w-16" />
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2.5">
                {Array.from({ length: 3 }).map((__, j) => (
                  <Bar key={j} className="aspect-square rounded-xl" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
