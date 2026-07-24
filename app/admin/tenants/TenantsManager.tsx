"use client";

import { useState } from "react";
import { Pencil, Plus, Search, Trash2, Users, X } from "lucide-react";

import {
  createTenant,
  deleteTenant,
  updateTenant,
  type TenantActionState,
} from "@/app/admin/tenants/actions";
import { ActionForm } from "@/components/admin/ActionForm";
import { Modal } from "@/components/admin/Modal";
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

function TenantFields({ tenant }: { tenant?: Tenant }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <label className="block sm:col-span-2">
        <span className="text-sm font-medium text-stone-700">Name</span>
        <input
          className={inputClass}
          name="name"
          required
          defaultValue={tenant?.name ?? ""}
          placeholder="Full name"
        />
      </label>
      <label className="block">
        <span className="text-sm font-medium text-stone-700">Phone</span>
        <input
          className={inputClass}
          name="phone"
          required
          defaultValue={tenant?.phone ?? ""}
          placeholder="Phone number"
        />
      </label>
      <label className="block">
        <span className="text-sm font-medium text-stone-700">Join date</span>
        <input
          className={inputClass}
          name="join_date"
          type="date"
          defaultValue={tenant?.join_date ?? ""}
        />
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
        <input
          className={inputClass}
          name="email"
          type="email"
          defaultValue={tenant?.email ?? ""}
          placeholder="name@example.com"
        />
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
  const [searchTerm, setSearchTerm] = useState("");
  const normalizedSearch = searchTerm.trim().toLocaleLowerCase();
  const filteredTenants = normalizedSearch
    ? tenants.filter((tenant) => tenant.name.toLocaleLowerCase().includes(normalizedSearch))
    : tenants;

  return (
    <>
      <div className="sm:overflow-hidden sm:rounded-2xl sm:border sm:border-stone-200/80 sm:bg-white sm:shadow-card">
        <div className="card-surface flex flex-wrap items-center gap-3 rounded-xl border border-stone-200/80 px-4 py-4 shadow-card sm:flex-row sm:justify-between sm:rounded-none sm:border-x-0 sm:border-t-0 sm:px-5 sm:shadow-none">
          <div className="min-w-0 flex-1">
            <h2 className="text-base font-semibold text-stone-900">Residents</h2>
            <p className="mt-1 hidden text-sm text-stone-500 sm:block">
              Current and reserved residents. Assign a resident to a bed from Property.
            </p>
          </div>
          <Button
            className="h-9 shrink-0 sm:hidden"
            type="button"
            onClick={() => setIsCreateOpen(true)}
          >
            <Plus aria-hidden="true" className="size-4" />
            Add resident
          </Button>
          <div className="order-3 flex w-full gap-2 sm:order-none sm:w-auto">
            <div className="relative w-full sm:w-60">
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-stone-400"
              />
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                aria-label="Search residents by name"
                placeholder="Search by name"
                autoComplete="off"
                className="h-11 w-full rounded-lg border border-stone-200 bg-white pr-10 pl-9 text-sm text-stone-900 shadow-xs outline-none transition placeholder:text-stone-400 focus:border-stone-400 focus:ring-4 focus:ring-stone-100 sm:h-8 [&::-webkit-search-cancel-button]:hidden"
              />
              {searchTerm ? (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  aria-label="Clear resident search"
                  className="absolute top-1/2 right-1.5 flex size-7 -translate-y-1/2 items-center justify-center rounded-md text-stone-400 transition hover:bg-stone-100 hover:text-stone-700"
                >
                  <X aria-hidden="true" className="size-3.5" />
                </button>
              ) : null}
            </div>
            <Button
              className="hidden h-8 sm:inline-flex"
              type="button"
              onClick={() => setIsCreateOpen(true)}
            >
              <Plus aria-hidden="true" className="size-4" />
              Add resident
            </Button>
          </div>
          <span className="sr-only" aria-live="polite">
            {filteredTenants.length} {filteredTenants.length === 1 ? "resident" : "residents"} found
          </span>
        </div>

        {/* Mobile: stacked cards (no horizontal scrolling) */}
        <ul className="mt-3 grid gap-3 sm:hidden">
          {filteredTenants.length > 0 ? (
            filteredTenants.map((tenant) => (
              <li
                key={tenant.id}
                className="card-surface min-w-0 max-w-full overflow-hidden rounded-xl border border-stone-200/80 p-4 shadow-card"
              >
                <div className="flex min-w-0 flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-stone-900">{tenant.name}</p>
                    <p className="mt-0.5 text-xs text-stone-500">{tenant.phone}</p>
                    {tenant.email ? (
                      <p className="truncate text-xs text-stone-400">{tenant.email}</p>
                    ) : null}
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <Button
                      aria-label={`Edit ${tenant.name}`}
                      className="size-9"
                      size="icon"
                      type="button"
                      variant="outline"
                      onClick={() => setEditingTenant(tenant)}
                    >
                      <Pencil aria-hidden="true" className="size-4" />
                    </Button>
                    <Button
                      aria-label={`Delete ${tenant.name}`}
                      className="size-9"
                      size="icon"
                      type="button"
                      variant="destructive"
                      onClick={() => setDeletingTenant(tenant)}
                    >
                      <Trash2 aria-hidden="true" className="size-4" />
                    </Button>
                  </div>
                </div>
                <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 border-t border-stone-100 pt-3 text-sm">
                  <div>
                    <dt className="text-xs text-stone-400">Rent</dt>
                    <dd className="text-stone-700">{inr.format(tenant.rent_amount)}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-stone-400">Joined</dt>
                    <dd className="text-stone-700">{formatDate(tenant.join_date)}</dd>
                  </div>
                  <div className="col-span-2">
                    <dt className="text-xs text-stone-400">Placement</dt>
                    <dd className="mt-0.5">
                      <PlacementCell placement={placements[tenant.id]} />
                    </dd>
                  </div>
                </dl>
              </li>
            ))
          ) : (
            <li className="card-surface flex flex-col items-center gap-2 rounded-xl border border-stone-200/80 px-4 py-12 text-center text-stone-500 shadow-card">
              <Users aria-hidden="true" className="size-5 text-stone-300" />
              {normalizedSearch
                ? `No residents match “${searchTerm.trim()}”.`
                : "No residents yet."}
            </li>
          )}
        </ul>

        {/* Tablet/desktop: table */}
        <div className="hidden overflow-x-auto sm:block">
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
              {filteredTenants.length > 0 ? (
                filteredTenants.map((tenant) => (
                  <tr key={tenant.id} className="transition-colors hover:bg-stone-50/70">
                    <td className="px-5 py-4 font-medium text-stone-900">{tenant.name}</td>
                    <td className="px-5 py-4 text-stone-600">
                      <div>{tenant.phone}</div>
                      {tenant.email ? (
                        <div className="text-xs text-stone-400">{tenant.email}</div>
                      ) : null}
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
                      {normalizedSearch
                        ? `No residents match “${searchTerm.trim()}”.`
                        : "No residents yet."}
                    </span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isCreateOpen ? (
        <Modal title="Add resident" onClose={() => setIsCreateOpen(false)}>
          <ActionForm
            action={createTenant}
            onSuccess={() => setIsCreateOpen(false)}
            className="space-y-5"
          >
            {(state, pending) => (
              <>
                <TenantFields />
                <ActionMessage state={state} />
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                    Cancel
                  </Button>
                  <Button disabled={pending} type="submit">
                    {pending ? "Saving..." : "Save resident"}
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
                    {pending ? "Saving..." : "Update resident"}
                  </Button>
                </div>
              </>
            )}
          </ActionForm>
        </Modal>
      ) : null}

      {deletingTenant ? (
        <Modal title="Delete resident" onClose={() => setDeletingTenant(null)}>
          <ActionForm
            action={deleteTenant}
            onSuccess={() => setDeletingTenant(null)}
            className="space-y-5"
          >
            {(state, pending) => (
              <>
                <input type="hidden" name="id" value={deletingTenant.id} />
                <p className="text-sm leading-6 text-stone-600">
                  Delete <span className="font-semibold text-stone-900">{deletingTenant.name}</span>
                  ? This also frees their bed if they have one.
                </p>
                <ActionMessage state={state} />
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setDeletingTenant(null)}>
                    Cancel
                  </Button>
                  <Button disabled={pending} type="submit" variant="destructive">
                    {pending ? "Deleting..." : "Delete resident"}
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
