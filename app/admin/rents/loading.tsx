import { AdminPageHeading, Bar, SkeletonTable } from "@/components/admin/Skeletons";

export default function RentsLoading() {
  return (
    <div className="space-y-8">
      <AdminPageHeading
        eyebrow="Rents"
        title="Rents"
        description="Monthly rent for each tenant. Record payments with date, amount, method, and account."
      />
      <div className="animate-pulse space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <Bar className="h-10 w-44" />
          <div className="flex gap-2">
            <Bar className="h-10 w-48" />
            <Bar className="h-10 w-28" />
          </div>
        </div>
        <SkeletonTable rows={4} columns={5} />
      </div>
    </div>
  );
}
