"use client";

import { useActionState, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";

import {
  createRent,
  deleteRent,
  generateRents,
  markRentPending,
  saveRent,
  type RentActionState,
} from "@/app/admin/rents/actions";
import { ActionForm } from "@/components/admin/ActionForm";
import { Modal } from "@/components/admin/Modal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Database } from "@/lib/database.types";

type RentRow = Database["public"]["Tables"]["rents"]["Row"] & {
  tenant_name: string;
  room_name: string;
  bed_number: string | null;
  tenant_rent_amount: number;
};
type TenantOption = { id: string; name: string };
type Settlement = "pending" | "cash" | "online" | "deposit" | "waived";

function currentSettlement(rent: RentRow): Settlement {
  if (rent.status === "paid") return rent.payment_method === "online" ? "online" : "cash";
  if (rent.status === "deposit") return "deposit";
  if (rent.status === "waived") return "waived";
  return "pending";
}

const idle: RentActionState = { status: "idle", message: "" };

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function formatMonth(value: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

function formatDate(value: string | null) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()].slice(0, 3)} ${d.getUTCFullYear()}`;
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

const inputClass =
  "mt-1 h-10 w-full rounded-lg border border-stone-200 bg-white px-3 text-sm text-stone-900 shadow-xs outline-none transition focus:border-stone-400 focus:ring-4 focus:ring-stone-100";

const STATUS_META: Record<string, { label: string; badge: string; dot: string }> = {
  paid: { label: "Paid", badge: "bg-emerald-50 text-emerald-700", dot: "bg-emerald-500" },
  pending: { label: "Pending", badge: "bg-amber-50 text-amber-700", dot: "bg-amber-500" },
  waived: { label: "Waived", badge: "bg-stone-100 text-stone-500", dot: "bg-stone-400" },
  deposit: { label: "From deposit", badge: "bg-sky-50 text-sky-700", dot: "bg-sky-500" },
};

function ActionMessage({ state }: { state: RentActionState }) {
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

function StatusBadge({ status }: { status: string }) {
  const meta = STATUS_META[status] ?? STATUS_META.pending;
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium", meta.badge)}>
      <span className={cn("size-1.5 rounded-full", meta.dot)} />
      {meta.label}
    </span>
  );
}

function paymentSummary(rent: RentRow) {
  if (rent.status === "paid") {
    return (
      <span className="text-xs">
        {formatDate(rent.payment_date)} · <span className="capitalize">{rent.payment_method ?? "—"}</span>
        {rent.paid_to ? ` · ${rent.paid_to}` : ""}
      </span>
    );
  }
  if (rent.status === "deposit") return <span className="text-xs">From deposit · {formatDate(rent.payment_date)}</span>;
  if (rent.status === "waived") return <span className="text-xs">No charge</span>;
  return "—";
}

function RentModal({
  rent,
  defaultSettlement,
  onClose,
}: {
  rent: RentRow;
  defaultSettlement: Settlement;
  onClose: () => void;
}) {
  const [settlement, setSettlement] = useState<Settlement>(defaultSettlement);

  const defaultAmount = Number(rent.amount) > 0 ? rent.amount : rent.tenant_rent_amount || "";
  const showAmount = settlement !== "waived";
  const showDate = settlement === "cash" || settlement === "online" || settlement === "deposit";
  const showPaidTo = settlement === "cash" || settlement === "online";

  return (
    <Modal title={`Rent — ${rent.tenant_name}`} onClose={onClose}>
      <ActionForm action={saveRent} onSuccess={onClose} className="space-y-4">
        {(state, pending) => (
          <>
            <input type="hidden" name="id" value={rent.id} />
            <input type="hidden" name="settlement" value={settlement} />

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium text-stone-700">Month</span>
                <input className={inputClass} name="month" type="month" defaultValue={rent.month.slice(0, 7)} required />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-stone-700">Settlement</span>
                <select
                  className={inputClass}
                  value={settlement}
                  onChange={(e) => setSettlement(e.target.value as Settlement)}
                >
                  <option value="pending">Not collected</option>
                  <option value="cash">Cash</option>
                  <option value="online">Online</option>
                  <option value="deposit">From deposit</option>
                  <option value="waived">Waived (no charge)</option>
                </select>
              </label>
            </div>

            {showAmount ? (
              <div className={showDate ? "grid gap-4 sm:grid-cols-2" : ""}>
                <label className="block">
                  <span className="text-sm font-medium text-stone-700">Amount (₹)</span>
                  <input
                    className={inputClass}
                    name="amount"
                    type="number"
                    min="0"
                    step="1"
                    required={settlement !== "pending"}
                    defaultValue={defaultAmount}
                    placeholder="11000"
                  />
                </label>
                {showDate ? (
                  <label className="block">
                    <span className="text-sm font-medium text-stone-700">Date</span>
                    <input className={inputClass} name="payment_date" type="date" defaultValue={rent.payment_date ?? todayStr()} />
                  </label>
                ) : null}
              </div>
            ) : null}

            {showPaidTo ? (
              <label className="block">
                <span className="text-sm font-medium text-stone-700">Paid to / account</span>
                <input className={inputClass} name="paid_to" defaultValue={rent.paid_to ?? ""} placeholder="e.g. Raj · HDFC" />
              </label>
            ) : null}

            <ActionMessage state={state} />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={pending}>
                {pending
                  ? "Saving..."
                  : settlement === "pending"
                    ? "Save"
                    : settlement === "waived"
                      ? "Mark waived"
                      : settlement === "deposit"
                        ? "Settle"
                        : "Record"}
              </Button>
            </div>
          </>
        )}
      </ActionForm>
    </Modal>
  );
}

export function RentsManager({
  rents,
  tenants,
  currentMonth,
}: {
  rents: RentRow[];
  tenants: TenantOption[];
  currentMonth: string;
}) {
  const [month, setMonth] = useState(currentMonth);
  const [formTarget, setFormTarget] = useState<{ rent: RentRow; settlement: Settlement } | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [deleting, setDeleting] = useState<RentRow | null>(null);

  const [generateState, generateAction, isGenerating] = useActionState(generateRents, idle);
  const [, pendingAction] = useActionState(markRentPending, idle);

  // Group rents by month (already ordered month-desc from the query).
  const groups = new Map<string, RentRow[]>();
  for (const rent of rents) {
    const list = groups.get(rent.month) ?? [];
    list.push(rent);
    groups.set(rent.month, list);
  }
  // Show only the picked month (the month selector filters the view).
  const selectedKey = `${month}-01`;
  const orderedKeys = [selectedKey];

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
        <label className="block w-full sm:w-auto">
          <span className="block text-xs font-medium text-stone-500">Month</span>
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className={cn(inputClass, "block h-11 w-full sm:h-10 sm:w-44")}
          />
        </label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <form action={generateAction} className="w-full sm:w-auto">
            <input type="hidden" name="month" value={month} />
            <Button className="h-11 w-full sm:h-8 sm:w-auto" type="submit" variant="outline" disabled={isGenerating}>
              {isGenerating ? "Generating..." : "Generate from occupied"}
            </Button>
          </form>
          <Button className="h-11 w-full sm:h-8 sm:w-auto" type="button" onClick={() => setAddOpen(true)}>
            <Plus aria-hidden="true" className="size-4" />
            Add rent
          </Button>
        </div>
      </div>

      {generateState.status !== "idle" ? <ActionMessage state={generateState} /> : null}

      {orderedKeys.map((m) => {
        const rows = groups.get(m) ?? [];
        const settledCount = rows.filter((r) => r.status !== "pending").length;
        const collected = rows
          .filter((r) => r.status === "paid" || r.status === "deposit")
          .reduce((sum, r) => sum + Number(r.amount), 0);

        return (
          <div key={m} className="overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-card">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200/80 bg-gradient-to-b from-stone-50/80 to-white px-5 py-4">
              <h2 className="text-base font-semibold text-stone-900">{formatMonth(m)}</h2>
              {rows.length > 0 ? (
                <p className="text-sm text-stone-500">
                  {settledCount}/{rows.length} settled · {inr.format(collected)} collected
                </p>
              ) : null}
            </div>

            {rows.length === 0 ? (
              <div className="px-5 py-10 text-center text-sm text-stone-400">
                No rents for {formatMonth(m)} yet — use &ldquo;Generate from occupied&rdquo; or &ldquo;Add rent&rdquo;.
              </div>
            ) : (
              <>
                {/* Mobile: stacked cards */}
                <ul className="divide-y divide-stone-100 sm:hidden">
                  {rows.map((rent) => (
                    <li key={rent.id} className="px-4 py-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-medium text-stone-900">{rent.tenant_name}</p>
                          <p className="mt-0.5 text-sm text-stone-500">
                            {rent.room_name}
                            {rent.bed_number ? ` · Bed ${rent.bed_number}` : ""}
                          </p>
                        </div>
                        <StatusBadge status={rent.status} />
                      </div>
                      <div className="mt-3 flex items-end justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-lg font-semibold text-stone-900">
                            {Number(rent.amount) > 0 || rent.status === "paid" || rent.status === "deposit"
                              ? inr.format(Number(rent.amount))
                              : "—"}
                          </p>
                          <p className="truncate text-xs text-stone-400">{paymentSummary(rent)}</p>
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                          {rent.status === "pending" ? (
                            <Button type="button" size="sm" onClick={() => setFormTarget({ rent, settlement: "cash" })}>
                              Record
                            </Button>
                          ) : (
                            <form action={pendingAction}>
                              <input type="hidden" name="id" value={rent.id} />
                              <Button type="submit" size="sm" variant="ghost">
                                Undo
                              </Button>
                            </form>
                          )}
                          <Button
                            aria-label="Edit rent"
                            className="size-10"
                            size="icon"
                            type="button"
                            variant="outline"
                            onClick={() => setFormTarget({ rent, settlement: currentSettlement(rent) })}
                          >
                            <Pencil aria-hidden="true" className="size-4" />
                          </Button>
                          <Button
                            aria-label="Delete rent"
                            className="size-10"
                            size="icon"
                            type="button"
                            variant="destructive"
                            onClick={() => setDeleting(rent)}
                          >
                            <Trash2 aria-hidden="true" className="size-4" />
                          </Button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                {/* Tablet/desktop: table */}
                <div className="hidden overflow-x-auto sm:block">
                  <table className="min-w-full divide-y divide-stone-200/80 text-sm">
                  <thead className="bg-stone-50/60 text-left text-xs font-semibold tracking-wide text-stone-400 uppercase">
                    <tr>
                      <th className="px-5 py-3">Tenant</th>
                      <th className="px-5 py-3">Room</th>
                      <th className="px-5 py-3">Amount</th>
                      <th className="px-5 py-3">Status</th>
                      <th className="px-5 py-3">Payment</th>
                      <th className="px-5 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 bg-white">
                    {rows.map((rent) => (
                      <tr key={rent.id} className="transition-colors hover:bg-stone-50/70">
                        <td className="px-5 py-3 font-medium text-stone-900">{rent.tenant_name}</td>
                        <td className="px-5 py-3 text-stone-600">
                          {rent.room_name}
                          {rent.bed_number ? ` · Bed ${rent.bed_number}` : ""}
                        </td>
                        <td className="px-5 py-3 text-stone-700">
                          {Number(rent.amount) > 0 || rent.status === "paid" || rent.status === "deposit"
                            ? inr.format(Number(rent.amount))
                            : "—"}
                        </td>
                        <td className="px-5 py-3">
                          <StatusBadge status={rent.status} />
                        </td>
                        <td className="px-5 py-3 text-stone-500">{paymentSummary(rent)}</td>
                        <td className="px-5 py-3">
                          <div className="flex items-center justify-end gap-2">
                            {rent.status === "pending" ? (
                              <Button type="button" size="sm" onClick={() => setFormTarget({ rent, settlement: "cash" })}>
                                Record
                              </Button>
                            ) : (
                              <form action={pendingAction}>
                                <input type="hidden" name="id" value={rent.id} />
                                <Button type="submit" size="sm" variant="ghost">
                                  Undo
                                </Button>
                              </form>
                            )}
                            <Button
                              aria-label="Edit rent"
                              size="icon-sm"
                              type="button"
                              variant="outline"
                              onClick={() => setFormTarget({ rent, settlement: currentSettlement(rent) })}
                            >
                              <Pencil aria-hidden="true" className="size-4" />
                            </Button>
                            <Button
                              aria-label="Delete rent"
                              size="icon-sm"
                              type="button"
                              variant="destructive"
                              onClick={() => setDeleting(rent)}
                            >
                              <Trash2 aria-hidden="true" className="size-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                </div>
              </>
            )}
          </div>
        );
      })}

      {/* Record / Edit — same modal */}
      {formTarget ? (
        <RentModal
          rent={formTarget.rent}
          defaultSettlement={formTarget.settlement}
          onClose={() => setFormTarget(null)}
        />
      ) : null}

      {/* Add rent */}
      {addOpen ? (
        <Modal title="Add rent" onClose={() => setAddOpen(false)}>
          <ActionForm action={createRent} onSuccess={() => setAddOpen(false)} className="space-y-4">
            {(state, pending) => (
              <>
                <label className="block">
                  <span className="text-sm font-medium text-stone-700">Tenant</span>
                  <select className={inputClass} name="tenant_id" required defaultValue="">
                    <option value="" disabled>
                      Select a tenant…
                    </option>
                    {tenants.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </label>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-sm font-medium text-stone-700">Month</span>
                    <input className={inputClass} name="month" type="month" defaultValue={month} required />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-stone-700">Amount (₹)</span>
                    <input className={inputClass} name="amount" type="number" min="0" step="1" placeholder="Tenant's rent" />
                  </label>
                </div>
                <p className="text-xs text-stone-400">Leave amount blank to use the tenant&apos;s monthly rent.</p>
                <ActionMessage state={state} />
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setAddOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={pending}>
                    {pending ? "Saving..." : "Add rent"}
                  </Button>
                </div>
              </>
            )}
          </ActionForm>
        </Modal>
      ) : null}

      {/* Delete */}
      {deleting ? (
        <Modal title="Delete rent" onClose={() => setDeleting(null)}>
          <ActionForm action={deleteRent} onSuccess={() => setDeleting(null)} className="space-y-4">
            {(state, pending) => (
              <>
                <input type="hidden" name="id" value={deleting.id} />
                <p className="text-sm leading-6 text-stone-600">
                  Delete the {formatMonth(deleting.month)} rent for{" "}
                  <span className="font-semibold text-stone-900">{deleting.tenant_name}</span>?
                </p>
                <ActionMessage state={state} />
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setDeleting(null)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="destructive" disabled={pending}>
                    {pending ? "Deleting..." : "Delete"}
                  </Button>
                </div>
              </>
            )}
          </ActionForm>
        </Modal>
      ) : null}
    </div>
  );
}
