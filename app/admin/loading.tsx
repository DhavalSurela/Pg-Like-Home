import { Bar } from "@/components/admin/Skeletons";

const sections = [
  { label: "Beds", tones: ["admin-tone-dark", "admin-tone-green"] },
  { label: "Rent", tones: ["admin-tone-light", "admin-tone-amber"] },
] as const;

export default function DashboardLoading() {
  return (
    <div className="admin-dashboard admin-skeleton-page space-y-6 sm:space-y-10">
      {sections.map((section) => (
        <section className="admin-dashboard-section" key={section.label}>
          <div className="admin-section-heading mb-3 flex items-center justify-between gap-3 sm:mb-4">
            <h2 className="text-base font-semibold text-stone-900 sm:text-lg">{section.label}</h2>
            <Bar className="h-3 w-28 sm:w-44" />
          </div>

          <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
            {section.tones.map((tone) => (
              <div
                key={tone}
                className={`admin-metric-card admin-skeleton-card ${tone} min-w-0 rounded-2xl border border-stone-200/80 p-4 shadow-card sm:h-44 sm:rounded-3xl sm:p-7`}
              >
                <Bar className="h-2.5 w-16" />
                <Bar className="admin-metric-icon size-8 rounded-xl" />
                <Bar className="mt-6 h-6 w-20 sm:mt-10 sm:h-10 sm:w-32" />
                <Bar className="mt-3 h-2.5 w-24" />
              </div>
            ))}
          </div>

          <div className="admin-progress-card admin-skeleton-card card-surface mt-2.5 rounded-xl border border-stone-200/80 p-3 shadow-card sm:mt-4 sm:rounded-2xl sm:p-4">
            <div className="flex items-center justify-between gap-4">
              <Bar className="h-3 w-28" />
              <Bar className="h-3 w-10" />
            </div>
            <Bar className="mt-3 h-2 w-full rounded-full" />
            <div className="mt-3 flex gap-4">
              <Bar className="h-2.5 w-20" />
              <Bar className="h-2.5 w-20" />
            </div>
          </div>
        </section>
      ))}

      <section className="admin-dashboard-section">
        <div className="admin-section-heading mb-3 sm:mb-4">
          <h2 className="text-base font-semibold text-stone-900 sm:text-lg">Quick actions</h2>
        </div>
        <div className="-mx-4 flex snap-x gap-3 overflow-hidden pb-2 before:block before:min-w-1 before:shrink-0 before:content-[''] after:block after:min-w-[11%] after:shrink-0 after:content-[''] sm:mx-0 sm:grid sm:grid-cols-2 sm:pb-0 sm:before:hidden sm:after:hidden lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className={`admin-quick-card admin-skeleton-card card-surface flex min-w-[78%] flex-col rounded-2xl border border-stone-200/80 p-4 shadow-card sm:min-w-0 ${
                index > 1 ? "hidden sm:flex" : ""
              }`}
            >
              <div className="flex items-start justify-between">
                <Bar className="size-10 rounded-xl" />
                <Bar className="size-4" />
              </div>
              <Bar className="mt-5 h-4 w-28" />
              <Bar className="mt-2 h-3 w-40 max-w-full" />
              <Bar className="mt-2 h-3 w-28" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
