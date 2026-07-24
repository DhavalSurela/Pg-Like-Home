import { AdminPageHeading, Bar } from "@/components/admin/Skeletons";
import { ContentNav } from "@/components/admin/AdminSubnav";

export default function FoodPhotosLoading() {
  return (
    <div className="admin-skeleton-page space-y-5 sm:space-y-8">
      <AdminPageHeading
        eyebrow="Food photos"
        title="Food Photos"
        description="Upload and organise the meal photos shown in the sliders on the public Food page."
      />
      <ContentNav />
      <div className="space-y-8">
        <div className="admin-skeleton-card card-surface rounded-2xl border border-stone-200/80 p-5 shadow-card">
          <Bar className="h-4 w-28" />
          <div className="mt-5 grid grid-cols-2 gap-4">
            <Bar className="h-11 w-full rounded-xl" />
            <Bar className="h-11 w-full rounded-xl" />
          </div>
          <Bar className="mt-4 h-11 w-full rounded-xl" />
          <Bar className="mt-4 h-11 w-full rounded-xl" />
        </div>
        {Array.from({ length: 2 }).map((_, c) => (
          <div key={c} className="space-y-3">
            <Bar className="h-4 w-28" />
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((__, i) => (
                <div
                  key={i}
                  className="admin-skeleton-block aspect-[4/3] animate-pulse rounded-xl border border-stone-200/80 bg-stone-100 shadow-card"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
