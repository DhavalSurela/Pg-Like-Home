import { AdminPageHeading, SkeletonTable } from "@/components/admin/Skeletons";

export default function TenantsLoading() {
  return (
    <div className="space-y-8">
      <AdminPageHeading
        eyebrow="Tenants"
        title="Tenants"
        description="Everyone added across the property — residents, reservations, and unassigned tenants."
      />
      <div className="animate-pulse">
        <SkeletonTable rows={5} columns={4} />
      </div>
    </div>
  );
}
