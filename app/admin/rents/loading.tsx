import { AdminPageHeading, Bar, SkeletonTable } from "@/components/admin/Skeletons";
import { FinanceNav } from "@/components/admin/AdminSubnav";

export default function RentsLoading() {
  return (
    <div className="admin-skeleton-page space-y-5 sm:space-y-8">
      <AdminPageHeading
        eyebrow="Rents"
        title="Rents"
        description="Monthly rent for each tenant. Record payments with date, amount, method, and account."
      />
      <FinanceNav />
      <div className="space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
          <Bar className="h-11 w-full rounded-xl sm:h-10 sm:w-44" />
          <div className="flex flex-col gap-2 sm:flex-row">
            <Bar className="h-11 w-full rounded-xl sm:h-10 sm:w-48" />
            <Bar className="h-11 w-full rounded-xl sm:h-10 sm:w-28" />
          </div>
        </div>
        <div className="flex gap-2 overflow-hidden sm:hidden">
          {Array.from({ length: 3 }).map((_, index) => (
            <Bar key={index} className="h-9 w-24 shrink-0 rounded-full" />
          ))}
        </div>
        <div className="flex items-center justify-between px-1 sm:hidden">
          <Bar className="h-4 w-24" />
          <Bar className="h-3 w-36" />
        </div>
        <SkeletonTable rows={4} columns={5} />
      </div>
    </div>
  );
}
