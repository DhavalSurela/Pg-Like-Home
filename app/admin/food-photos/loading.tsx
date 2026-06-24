import { AdminPageHeading, Bar } from "@/components/admin/Skeletons";

export default function FoodPhotosLoading() {
  return (
    <div className="space-y-8">
      <AdminPageHeading
        eyebrow="Food photos"
        title="Food Photos"
        description="Upload and organise the meal photos shown in the sliders on the public Food page."
      />
      <div className="animate-pulse space-y-8">
        <div className="card-surface h-44 rounded-2xl border border-stone-200/80 shadow-card" />
        {Array.from({ length: 2 }).map((_, c) => (
          <div key={c} className="space-y-3">
            <Bar className="h-4 w-28" />
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((__, i) => (
                <div
                  key={i}
                  className="aspect-[4/3] rounded-xl border border-stone-200/80 bg-stone-100 shadow-card"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
