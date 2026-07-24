import { FinanceNav } from "@/components/admin/AdminSubnav";
import { AdminPageHeading, Bar } from "@/components/admin/Skeletons";

function BillCardSkeleton() {
  return (
    <article className="admin-skeleton-card card-surface rounded-2xl border border-stone-200/80 p-4 shadow-card sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <Bar className="h-6 w-24 rounded-full" />
          <Bar className="mt-3 h-4 w-32" />
        </div>
        <Bar className="size-8 rounded-xl" />
      </div>
      <div className="mt-5 grid grid-cols-3 gap-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="space-y-2">
            <Bar className="h-2.5 w-10" />
            <Bar className="h-3.5 w-16 max-w-full" />
          </div>
        ))}
      </div>
      <Bar className="mt-4 h-2 w-full rounded-full" />
      <div className="mt-4 border-t border-stone-200/70 pt-3">
        <Bar className="h-3 w-full" />
        <Bar className="mt-2 h-3 w-4/5" />
      </div>
      <Bar className="mt-4 h-9 w-full rounded-xl" />
    </article>
  );
}

export default function BillsLoading() {
  return (
    <div className="admin-skeleton-page space-y-5 sm:space-y-8">
      <AdminPageHeading
        eyebrow="Bills"
        title="Bills"
        description="Track block expenses and split room AC electricity across beds each month."
      />
      <FinanceNav />

      <Bar className="h-11 w-full rounded-xl sm:w-48" />

      {["Block bills", "Room AC electricity"].map((section) => (
        <section key={section}>
          <div className="mb-3 flex items-center justify-between gap-3 sm:mb-4">
            <Bar className="h-4 w-36" />
            <Bar className="h-9 w-24 rounded-xl" />
          </div>
          <div className="grid gap-3 lg:grid-cols-2">
            <BillCardSkeleton />
            <div className="hidden lg:block">
              <BillCardSkeleton />
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
