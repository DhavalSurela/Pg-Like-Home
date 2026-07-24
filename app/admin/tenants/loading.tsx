import { AdminPageHeading, Bar, SkeletonTable } from "@/components/admin/Skeletons";

export default function TenantsLoading() {
  return (
    <div className="admin-skeleton-page space-y-5 sm:space-y-8">
      <AdminPageHeading
        eyebrow="Residents"
        title="Residents"
        description="Everyone living at or reserved for the property, including unassigned residents."
      />
      <div>
        <div className="admin-skeleton-card card-surface mb-3 rounded-xl border border-stone-200/80 p-4 shadow-card sm:hidden">
          <div className="flex items-center justify-between gap-4">
            <Bar className="h-4 w-24" />
            <Bar className="h-9 w-28 rounded-xl" />
          </div>
          <Bar className="mt-3 h-11 w-full rounded-xl" />
        </div>
        <SkeletonTable rows={5} columns={4} />
      </div>
    </div>
  );
}
