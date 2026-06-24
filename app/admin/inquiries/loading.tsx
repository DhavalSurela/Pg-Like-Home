import { AdminPageHeading, Bar } from "@/components/admin/Skeletons";

export default function InquiriesLoading() {
  return (
    <div className="space-y-8">
      <AdminPageHeading
        eyebrow="Inquiries"
        title="Inquiries"
        description="Messages submitted through the website contact form."
      />
      <div className="animate-pulse space-y-4">
        <div className="flex items-center justify-between gap-3">
          <Bar className="h-9 w-40 rounded-xl" />
          <Bar className="h-9 w-28" />
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card-surface h-44 rounded-2xl border border-stone-200/80 shadow-card" />
          ))}
        </div>
      </div>
    </div>
  );
}
