import { AdminPageHeading, Bar } from "@/components/admin/Skeletons";

export default function InquiriesLoading() {
  return (
    <div className="admin-skeleton-page space-y-5 sm:space-y-8">
      <AdminPageHeading
        eyebrow="Inquiries"
        title="Inquiries"
        description="Messages submitted through the website contact form."
      />
      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-2 overflow-hidden">
            {Array.from({ length: 3 }).map((_, index) => (
              <Bar key={index} className="h-9 w-24 shrink-0 rounded-xl" />
            ))}
          </div>
          <Bar className="h-11 w-full rounded-xl sm:h-9 sm:w-28" />
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="admin-skeleton-card card-surface rounded-2xl border border-stone-200/80 p-4 shadow-card"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <Bar className="h-4 w-32" />
                  <Bar className="h-3 w-24" />
                </div>
                <Bar className="size-9 rounded-xl" />
              </div>
              <Bar className="mt-5 h-3 w-full" />
              <Bar className="mt-2 h-3 w-4/5" />
              <div className="mt-5 flex gap-2">
                <Bar className="h-8 w-24 rounded-xl" />
                <Bar className="h-8 w-20 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
