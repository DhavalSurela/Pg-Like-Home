"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2, Users, X } from "lucide-react";

import {
  createTenant,
  deleteTenant,
  updateTenant,
  type TenantActionState,
} from "@/app/admin/tenants/actions";
import { ActionForm } from "@/components/admin/ActionForm";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Database } from "@/lib/database.types";

type Tenant = Database["public"]["Tables"]["tenants"]["Row"];
export type Placement = { label: string; status: string };

const inputClass =
  "mt-2 h-10 w-full rounded-lg border border-stone-200 bg-white px-3 text-sm text-stone-900 shadow-xs outline-none transition focus:border-stone-400 focus:ring-4 focus:ring-stone-100";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

// Locale-independent + UTC so server and client render identically (no hydration
// mismatch) and date-only values don't shift a day across timezones.
function formatDate(value: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

function ActionMessage({ state }: { state: TenantActionState }) {
  if (state.status === "idle" || !state.message) return null;
  return (
    <p
      className={
        state.status === "success"
          ? "rounded-lg border border-emerald-200/70 bg-emerald-50/70 px-3 py-2 text-sm text-emerald-700"
          : "rounded-lg border border-red-200/70 bg-red-50/70 px-3 py-2 text-sm text-red-700"
      }
    >
      {state.message}
    </p>
  );
}

function Modal({ children, title, onClose }: { children: React.ReactNode; title: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/30 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-card-md">
        <div className="flex items-center justify-between border-b border-stone-200/80 bg-gradient-to-b from-stone-50 to-white px-5 py-4">
          <h2 className="text-base font-semibold text-stone-900">{title}</h2>
          <button
            aria-label="Close modal"
            className="rounded-lg p-1 text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-900"
            type="button"
            onClick={onClose}
          >
            <X aria-hidden="true" className="size-5" />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

function TenantFields({ tenant }: { tenant?: Tenant }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <label className="block sm:col-span-2">
        <span className="text-sm font-medium text-stone-700">Name</span>
        <input className={inputClass} name="name" required defaultValue={tenant?.name ?? ""} placeholder="Full name" />
      </label>
      <label className="block">
        <span className="text-sm font-medium text-stone-700">Phone</span>
        <input className={inputClass} name="phone" required defaultValue={tenant?.phone ?? ""} placeholder="Phone number" />
      </label>
      <label className="block">
        <span className="text-sm font-medium text-stone-700">Join date</span>
        <input className={inputClass} name="join_date" type="date" defaultValue={tenant?.join_date ?? ""} />
      </label>
      <label className="block">
        <span className="text-sm font-medium text-stone-700">Monthly rent (₹)</span>
        <input
          className={inputClass}
          name="rent_amount"
          type="number"
          min="0"
          step="1"
          defaultValue={tenant?.rent_amount ?? 0}
        />
      </label>
      <label className="block sm:col-span-2">
        <span className="text-sm font-medium text-stone-700">Email (optional)</span>
        <input className={inputClass} name="email" type="email" defaultValue={tenant?.email ?? ""} placeholder="name@example.com" />
      </label>
    </div>
  );
}

function PlacementCell({ placement }: { placement?: Placement }) {
  if (!placement) {
    return (
      <span className="inline-flex items-center rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-medium text-stone-400">
        Unassigned
      </span>
    );
  }
  return (
    <span className="flex items-center gap-2">
      <span
        className={cn(
          "size-2 rounded-full",
          placement.status === "occupied" ? "bg-stone-800" : "bg-stone-300"
        )}
      />
      <span className="text-stone-600">{placement.label}</span>
    </span>
  );
}

export function TenantsManager({
  tenants,
  placements,
}: {
  tenants: Tenant[];
  placements: Record<string, Placement>;
}) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);
  const [deletingTenant, setDeletingTenant] = useState<Tenant | null>(null);

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-card">
        <div className="flex flex-col gap-3 border-b border-stone-200/80 bg-gradient-to-b from-stone-50/80 to-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-stone-900">All tenants</h2>
            <p className="mt-1 text-sm text-stone-500">
              Residents and reservations. Assign a tenant to a bed from the Rooms tab.
            </p>
          </div>
          <Button type="button" onClick={() => setIsCreateOpen(true)}>
            <Plus aria-hidden="true" className="size-4" />
            Add tenant
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-stone-200/80 text-sm">
            <thead className="bg-stone-50/60 text-left text-xs font-semibold tracking-wide text-stone-400 uppercase">
              <tr>
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Contact</th>
                <th className="px-5 py-3">Rent</th>
                <th className="px-5 py-3">Placement</th>
                <th className="px-5 py-3">Joined</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 bg-white">
              {tenants.length > 0 ? (
                tenants.map((tenant) => (
                  <tr key={tenant.id} className="transition-colors hover:bg-stone-50/70">
                    <td className="px-5 py-4 font-medium text-stone-900">{tenant.name}</td>
                    <td className="px-5 py-4 text-stone-600">
                      <div>{tenant.phone}</div>
                      {tenant.email ? <div className="text-xs text-stone-400">{tenant.email}</div> : null}
                    </td>
                    <td className="px-5 py-4 text-stone-600">{inr.format(tenant.rent_amount)}</td>
                    <td className="px-5 py-4">
                      <PlacementCell placement={placements[tenant.id]} />
                    </td>
                    <td className="px-5 py-4 text-stone-600">{formatDate(tenant.join_date)}</td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <Button
                          aria-label={`Edit ${tenant.name}`}
                          size="icon-sm"
                          type="button"
                          variant="outline"
                          onClick={() => setEditingTenant(tenant)}
                        >
                          <Pencil aria-hidden="true" className="size-4" />
                        </Button>
                        <Button
                          aria-label={`Delete ${tenant.name}`}
                          size="icon-sm"
                          type="button"
                          variant="destructive"
                          onClick={() => setDeletingTenant(tenant)}
                        >
                          <Trash2 aria-hidden="true" className="size-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-5 py-12 text-center text-stone-500" colSpan={6}>
                    <span className="flex flex-col items-center gap-2">
                      <Users aria-hidden="true" className="size-5 text-stone-300" />
                      No tenants yet.
                    </span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isCreateOpen ? (
        <Modal title="Add tenant" onClose={() => setIsCreateOpen(false)}>
          <ActionForm action={createTenant} onSuccess={() => setIsCreateOpen(false)} className="space-y-5">
            {(state, pending) => (
              <>
                <TenantFields />
                <ActionMessage state={state} />
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                    Cancel
                  </Button>
                  <Button disabled={pending} type="submit">
                    {pending ? "Saving..." : "Save tenant"}
                  </Button>
                </div>
              </>
            )}
          </ActionForm>
        </Modal>
      ) : null}

      {editingTenant ? (
        <Modal title={`Edit ${editingTenant.name}`} onClose={() => setEditingTenant(null)}>
          <ActionForm
            key={editingTenant.id}
            action={updateTenant}
            onSuccess={() => setEditingTenant(null)}
            className="space-y-5"
          >
            {(state, pending) => (
              <>
                <input type="hidden" name="id" value={editingTenant.id} />
                <TenantFields tenant={editingTenant} />
                <ActionMessage state={state} />
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setEditingTenant(null)}>
                    Cancel
                  </Button>
                  <Button disabled={pending} type="submit">
                    {pending ? "Saving..." : "Update tenant"}
                  </Button>
                </div>
              </>
            )}
          </ActionForm>
        </Modal>
      ) : null}

      {deletingTenant ? (
        <Modal title="Delete tenant" onClose={() => setDeletingTenant(null)}>
          <ActionForm action={deleteTenant} onSuccess={() => setDeletingTenant(null)} className="space-y-5">
            {(state, pending) => (
              <>
                <input type="hidden" name="id" value={deletingTenant.id} />
                <p className="text-sm leading-6 text-stone-600">
                  Delete <span className="font-semibold text-stone-900">{deletingTenant.name}</span>? This also frees
                  their bed if they have one.
                </p>
                <ActionMessage state={state} />
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setDeletingTenant(null)}>
                    Cancel
                  </Button>
                  <Button disabled={pending} type="submit" variant="destructive">
                    {pending ? "Deleting..." : "Delete tenant"}
                  </Button>
                </div>
              </>
            )}
          </ActionForm>
        </Modal>
      ) : null}
    </>
  );
}
