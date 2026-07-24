"use client";

import { useState } from "react";
import { Building2, Check, CircleDollarSign, Pencil, Plus, Trash2, Zap } from "lucide-react";

import {
  addBlockBillPayment,
  createBlockBill,
  createRoomAcBill,
  deleteBlockBill,
  deleteBlockBillPayment,
  deleteRoomAcBill,
  saveRoomAcCharge,
  type BillActionState,
} from "@/app/admin/bills/actions";
import { ActionForm } from "@/components/admin/ActionForm";
import { Modal } from "@/components/admin/Modal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Database } from "@/lib/database.types";

type BlockBill = Database["public"]["Tables"]["block_bills"]["Row"];
type BlockPayment = Database["public"]["Tables"]["block_bill_payments"]["Row"];
type AcBill = Database["public"]["Tables"]["room_ac_bills"]["Row"];
type AcCharge = Database["public"]["Tables"]["room_ac_charges"]["Row"];

export type BlockBillView = BlockBill & {
  block_name: string;
  payments: BlockPayment[];
};

export type AcBillView = AcBill & {
  block_name: string;
  room_name: string;
  charges: AcCharge[];
};

export type BillOption = { id: string; label: string };

const inputClass =
  "mt-1.5 h-11 w-full rounded-xl border border-stone-200 bg-white px-3.5 text-sm text-stone-900 shadow-xs outline-none transition focus:border-stone-400 focus:ring-4 focus:ring-stone-100";

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

function ActionMessage({ state }: { state: BillActionState }) {
  if (state.status === "idle" || !state.message) return null;
  return (
    <p
      className={cn(
        "rounded-xl border px-3 py-2 text-sm",
        state.status === "success"
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-red-200 bg-red-50 text-red-700"
      )}
    >
      {state.message}
    </p>
  );
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-2 overflow-hidden rounded-full bg-stone-100">
      <div
        className="h-full rounded-full bg-emerald-600 transition-[width]"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

export function BillsManager({
  blockBills,
  acBills,
  blocks,
  rooms,
  tenants,
  currentMonth,
}: {
  blockBills: BlockBillView[];
  acBills: AcBillView[];
  blocks: BillOption[];
  rooms: BillOption[];
  tenants: BillOption[];
  currentMonth: string;
}) {
  const [month, setMonth] = useState(currentMonth);
  const [addBlockOpen, setAddBlockOpen] = useState(false);
  const [paymentBill, setPaymentBill] = useState<BlockBillView | null>(null);
  const [deleteBlockTarget, setDeleteBlockTarget] = useState<BlockBillView | null>(null);
  const [addAcOpen, setAddAcOpen] = useState(false);
  const [chargeTarget, setChargeTarget] = useState<AcCharge | null>(null);
  const [deleteAcTarget, setDeleteAcTarget] = useState<AcBillView | null>(null);
  const [payerType, setPayerType] = useState<"owner" | "tenant">("owner");

  const visibleBlockBills = blockBills.filter((bill) => bill.month.slice(0, 7) === month);
  const visibleAcBills = acBills.filter((bill) => bill.month.slice(0, 7) === month);

  return (
    <>
      <div className="mb-6 flex items-end justify-between gap-3 sm:mb-8">
        <label className="block w-full sm:w-48">
          <span className="block text-xs font-medium text-stone-500">Billing month</span>
          <input
            type="month"
            value={month}
            onChange={(event) => setMonth(event.target.value)}
            className={inputClass}
          />
        </label>
        <div className="hidden text-right sm:block">
          <p className="text-xs text-stone-400">Monthly overview</p>
          <p className="mt-0.5 text-sm font-semibold text-stone-700">
            {visibleBlockBills.length} block · {visibleAcBills.length} AC
          </p>
        </div>
      </div>

      <section aria-labelledby="block-bills-heading">
        <div className="mb-3 flex items-center justify-between gap-3 sm:mb-4">
          <div>
            <h2
              id="block-bills-heading"
              className="text-base font-semibold text-stone-900 sm:text-lg"
            >
              Block bills
            </h2>
            <p className="mt-0.5 hidden text-sm text-stone-500 sm:block">
              Rent and common electricity paid by the owner or tenants.
            </p>
          </div>
          <Button type="button" onClick={() => setAddBlockOpen(true)} className="h-9">
            <Plus aria-hidden="true" className="size-4" />
            Add bill
          </Button>
        </div>

        {visibleBlockBills.length ? (
          <div className="grid gap-3 lg:grid-cols-2">
            {visibleBlockBills.map((bill) => {
              const paid = bill.payments.reduce((sum, payment) => sum + Number(payment.amount), 0);
              const balance = Math.max(0, Number(bill.total_amount) - paid);
              const progress = Number(bill.total_amount)
                ? (paid / Number(bill.total_amount)) * 100
                : 100;

              return (
                <article
                  key={bill.id}
                  className="card-surface rounded-2xl border border-stone-200/80 p-4 shadow-card sm:p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-2.5 py-1 text-[10px] font-semibold tracking-[0.12em] text-stone-500 uppercase ring-1 ring-stone-200/70">
                        {bill.bill_type === "rent" ? (
                          <Building2 aria-hidden="true" className="size-3" />
                        ) : (
                          <Zap aria-hidden="true" className="size-3 text-amber-600" />
                        )}
                        {bill.bill_type === "rent" ? "Block rent" : "Electricity"}
                      </span>
                      <h3 className="mt-2 text-base font-semibold text-stone-900">
                        {bill.block_name}
                      </h3>
                    </div>
                    <Button
                      aria-label={`Delete ${bill.block_name} bill`}
                      size="icon-sm"
                      type="button"
                      variant="ghost"
                      className="text-stone-400 hover:text-red-600"
                      onClick={() => setDeleteBlockTarget(bill)}
                    >
                      <Trash2 aria-hidden="true" className="size-4" />
                    </Button>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-3">
                    <div>
                      <p className="text-[10px] font-medium tracking-wide text-stone-400 uppercase">
                        Due
                      </p>
                      <p className="mt-1 text-sm font-semibold text-stone-900">
                        {inr.format(Number(bill.total_amount))}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-medium tracking-wide text-stone-400 uppercase">
                        Paid
                      </p>
                      <p className="mt-1 text-sm font-semibold text-emerald-700">
                        {inr.format(paid)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-medium tracking-wide text-stone-400 uppercase">
                        Balance
                      </p>
                      <p className="mt-1 text-sm font-semibold text-amber-700">
                        {inr.format(balance)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3">
                    <ProgressBar value={progress} />
                  </div>

                  {bill.payments.length ? (
                    <div className="mt-4 space-y-2 border-t border-stone-200/70 pt-3">
                      {bill.payments.map((payment) => (
                        <div
                          key={payment.id}
                          className="flex items-center justify-between gap-3 text-xs"
                        >
                          <span className="min-w-0 truncate text-stone-500">
                            {payment.payer_name}
                            <span className="text-stone-400">
                              {" "}
                              · {payment.payer_type === "owner" ? "Owner" : "Tenant"}
                            </span>
                          </span>
                          <span className="flex shrink-0 items-center gap-1.5">
                            <span className="font-semibold text-stone-700">
                              {inr.format(Number(payment.amount))}
                            </span>
                            {payment.rent_id ? (
                              <span className="rounded-full bg-stone-100 px-1.5 py-0.5 text-[9px] font-semibold tracking-wide text-stone-400 uppercase">
                                Rent
                              </span>
                            ) : (
                              <ActionForm action={deleteBlockBillPayment} className="flex">
                                {(_, pending) => (
                                  <>
                                    <input type="hidden" name="id" value={payment.id} />
                                    <button
                                      type="submit"
                                      disabled={pending}
                                      aria-label={`Remove payment by ${payment.payer_name}`}
                                      className="flex size-6 items-center justify-center rounded-md text-stone-300 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                                    >
                                      <Trash2 aria-hidden="true" className="size-3" />
                                    </button>
                                  </>
                                )}
                              </ActionForm>
                            )}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-4 border-t border-stone-200/70 pt-3 text-xs text-stone-400">
                      No payments recorded yet.
                    </p>
                  )}

                  <Button
                    className="mt-4 h-9 w-full"
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setPayerType("owner");
                      setPaymentBill(bill);
                    }}
                  >
                    <CircleDollarSign aria-hidden="true" className="size-4" />
                    Record payment
                  </Button>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="card-surface rounded-2xl border border-dashed border-stone-300 px-4 py-10 text-center text-sm text-stone-500">
            No block bills for this month.
          </div>
        )}
      </section>

      <section aria-labelledby="ac-bills-heading" className="mt-8 sm:mt-10">
        <div className="mb-3 flex items-center justify-between gap-3 sm:mb-4">
          <div>
            <h2 id="ac-bills-heading" className="text-base font-semibold text-stone-900 sm:text-lg">
              Room AC electricity
            </h2>
            <p className="mt-0.5 hidden text-sm text-stone-500 sm:block">
              A room total split into editable per-bed charges.
            </p>
          </div>
          <Button type="button" onClick={() => setAddAcOpen(true)} className="h-9">
            <Plus aria-hidden="true" className="size-4" />
            Add AC bill
          </Button>
        </div>

        {visibleAcBills.length ? (
          <div className="grid gap-3 lg:grid-cols-2">
            {visibleAcBills.map((bill) => {
              const paidCharges = bill.charges.filter((charge) => charge.status === "paid");
              const collected = paidCharges.reduce((sum, charge) => sum + Number(charge.amount), 0);

              return (
                <article
                  key={bill.id}
                  className="card-surface rounded-2xl border border-stone-200/80 p-4 shadow-card sm:p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-semibold tracking-[0.12em] text-amber-700 uppercase ring-1 ring-amber-200/70">
                        <Zap aria-hidden="true" className="size-3" />
                        AC electricity
                      </span>
                      <h3 className="mt-2 text-base font-semibold text-stone-900">
                        {bill.block_name} · {bill.room_name}
                      </h3>
                      <p className="mt-0.5 text-xs text-stone-500">
                        {inr.format(Number(bill.total_amount))} total · {inr.format(collected)}{" "}
                        collected
                      </p>
                    </div>
                    <Button
                      aria-label={`Delete AC bill for ${bill.room_name}`}
                      size="icon-sm"
                      type="button"
                      variant="ghost"
                      className="text-stone-400 hover:text-red-600"
                      onClick={() => setDeleteAcTarget(bill)}
                    >
                      <Trash2 aria-hidden="true" className="size-4" />
                    </Button>
                  </div>

                  <div className="mt-4 divide-y divide-stone-200/70 overflow-hidden rounded-xl border border-stone-200/70 bg-white/55">
                    {bill.charges.map((charge) => (
                      <button
                        key={charge.id}
                        type="button"
                        onClick={() => setChargeTarget(charge)}
                        className="flex w-full items-center justify-between gap-3 px-3 py-3 text-left transition hover:bg-white/80"
                      >
                        <span className="min-w-0">
                          <span className="block text-sm font-medium text-stone-800">
                            Bed {charge.bed_number}
                          </span>
                          <span className="block truncate text-xs text-stone-400">
                            {charge.tenant_name ?? "No tenant assigned"}
                          </span>
                        </span>
                        <span className="flex shrink-0 items-center gap-3">
                          <span className="text-sm font-semibold text-stone-800">
                            {inr.format(Number(charge.amount))}
                          </span>
                          <span
                            className={cn(
                              "inline-flex size-7 items-center justify-center rounded-full",
                              charge.status === "paid"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-amber-100 text-amber-700"
                            )}
                          >
                            {charge.status === "paid" ? (
                              <Check aria-hidden="true" className="size-3.5" />
                            ) : (
                              <Pencil aria-hidden="true" className="size-3.5" />
                            )}
                          </span>
                        </span>
                      </button>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="card-surface rounded-2xl border border-dashed border-stone-300 px-4 py-10 text-center text-sm text-stone-500">
            No room AC bills for this month.
          </div>
        )}
      </section>

      {addBlockOpen ? (
        <Modal title="Add block bill" onClose={() => setAddBlockOpen(false)}>
          <ActionForm
            action={createBlockBill}
            onSuccess={() => setAddBlockOpen(false)}
            className="space-y-4"
          >
            {(state, pending) => (
              <>
                <label className="block">
                  <span className="text-sm font-medium text-stone-700">Block</span>
                  <select className={inputClass} name="block_id" required defaultValue="">
                    <option value="" disabled>
                      Choose block
                    </option>
                    {blocks.map((block) => (
                      <option key={block.id} value={block.id}>
                        {block.label}
                      </option>
                    ))}
                  </select>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="block">
                    <span className="text-sm font-medium text-stone-700">Month</span>
                    <input
                      className={inputClass}
                      name="month"
                      type="month"
                      defaultValue={month}
                      required
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-stone-700">Type</span>
                    <select className={inputClass} name="bill_type" defaultValue="rent">
                      <option value="rent">Rent</option>
                      <option value="electricity">Electricity</option>
                    </select>
                  </label>
                </div>
                <label className="block">
                  <span className="text-sm font-medium text-stone-700">Total bill amount</span>
                  <input
                    className={inputClass}
                    name="total_amount"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="24000"
                    required
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-stone-700">Note (optional)</span>
                  <input className={inputClass} name="notes" placeholder="Landlord or meter note" />
                </label>
                <ActionMessage state={state} />
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setAddBlockOpen(false)}>
                    Cancel
                  </Button>
                  <Button disabled={pending} type="submit">
                    {pending ? "Saving..." : "Add bill"}
                  </Button>
                </div>
              </>
            )}
          </ActionForm>
        </Modal>
      ) : null}

      {paymentBill ? (
        <Modal title="Record payment" onClose={() => setPaymentBill(null)}>
          <ActionForm
            action={addBlockBillPayment}
            onSuccess={() => setPaymentBill(null)}
            className="space-y-4"
          >
            {(state, pending) => (
              <>
                <input type="hidden" name="bill_id" value={paymentBill.id} />
                <div className="rounded-xl border border-stone-200 bg-stone-50 p-3 text-sm">
                  <p className="font-semibold text-stone-800">{paymentBill.block_name}</p>
                  <p className="mt-0.5 text-xs text-stone-500">
                    {paymentBill.bill_type === "rent" ? "Block rent" : "Electricity"} ·{" "}
                    {inr.format(Number(paymentBill.total_amount))}
                  </p>
                </div>
                <label className="block">
                  <span className="text-sm font-medium text-stone-700">Paid by</span>
                  <select
                    className={inputClass}
                    name="payer_type"
                    value={payerType}
                    onChange={(event) => setPayerType(event.target.value as "owner" | "tenant")}
                  >
                    <option value="owner">Owner</option>
                    <option value="tenant">Tenant directly</option>
                  </select>
                </label>
                {payerType === "tenant" ? (
                  <label className="block">
                    <span className="text-sm font-medium text-stone-700">Tenant</span>
                    <select className={inputClass} name="tenant_id" required defaultValue="">
                      <option value="" disabled>
                        Choose tenant
                      </option>
                      {tenants.map((tenant) => (
                        <option key={tenant.id} value={tenant.id}>
                          {tenant.label}
                        </option>
                      ))}
                    </select>
                  </label>
                ) : null}
                <div className="grid grid-cols-2 gap-3">
                  <label className="block">
                    <span className="text-sm font-medium text-stone-700">Amount</span>
                    <input
                      className={inputClass}
                      name="amount"
                      type="number"
                      min="0.01"
                      step="0.01"
                      required
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-stone-700">Paid on</span>
                    <input
                      className={inputClass}
                      name="payment_date"
                      type="date"
                      defaultValue={new Date().toISOString().slice(0, 10)}
                      required
                    />
                  </label>
                </div>
                <ActionMessage state={state} />
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setPaymentBill(null)}>
                    Cancel
                  </Button>
                  <Button disabled={pending} type="submit">
                    {pending ? "Saving..." : "Record payment"}
                  </Button>
                </div>
              </>
            )}
          </ActionForm>
        </Modal>
      ) : null}

      {addAcOpen ? (
        <Modal title="Add room AC bill" onClose={() => setAddAcOpen(false)}>
          <ActionForm
            action={createRoomAcBill}
            onSuccess={() => setAddAcOpen(false)}
            className="space-y-4"
          >
            {(state, pending) => (
              <>
                <label className="block">
                  <span className="text-sm font-medium text-stone-700">Room</span>
                  <select className={inputClass} name="room_id" required defaultValue="">
                    <option value="" disabled>
                      Choose room
                    </option>
                    {rooms.map((room) => (
                      <option key={room.id} value={room.id}>
                        {room.label}
                      </option>
                    ))}
                  </select>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="block">
                    <span className="text-sm font-medium text-stone-700">Month</span>
                    <input
                      className={inputClass}
                      name="month"
                      type="month"
                      defaultValue={month}
                      required
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-stone-700">Room total</span>
                    <input
                      className={inputClass}
                      name="total_amount"
                      type="number"
                      min="0"
                      step="0.01"
                      required
                    />
                  </label>
                </div>
                <p className="rounded-xl border border-amber-200/70 bg-amber-50/70 px-3 py-2 text-xs leading-5 text-amber-800">
                  The total is split equally across occupied beds. You can adjust each bed
                  afterward.
                </p>
                <label className="block">
                  <span className="text-sm font-medium text-stone-700">Note (optional)</span>
                  <input
                    className={inputClass}
                    name="notes"
                    placeholder="Meter reading or period"
                  />
                </label>
                <ActionMessage state={state} />
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setAddAcOpen(false)}>
                    Cancel
                  </Button>
                  <Button disabled={pending} type="submit">
                    {pending ? "Splitting..." : "Create and split"}
                  </Button>
                </div>
              </>
            )}
          </ActionForm>
        </Modal>
      ) : null}

      {chargeTarget ? (
        <Modal
          title={`Bed ${chargeTarget.bed_number} AC charge`}
          onClose={() => setChargeTarget(null)}
        >
          <ActionForm
            key={chargeTarget.id}
            action={saveRoomAcCharge}
            onSuccess={() => setChargeTarget(null)}
            className="space-y-4"
          >
            {(state, pending) => (
              <>
                <input type="hidden" name="id" value={chargeTarget.id} />
                <p className="text-sm text-stone-500">
                  {chargeTarget.tenant_name ?? "No tenant assigned"}
                </p>
                <label className="block">
                  <span className="text-sm font-medium text-stone-700">Bed amount</span>
                  <input
                    className={inputClass}
                    name="amount"
                    type="number"
                    min="0"
                    step="0.01"
                    defaultValue={chargeTarget.amount}
                    required
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-stone-700">Status</span>
                  <select className={inputClass} name="status" defaultValue={chargeTarget.status}>
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                  </select>
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-stone-700">Payment date</span>
                  <input
                    className={inputClass}
                    name="payment_date"
                    type="date"
                    defaultValue={
                      chargeTarget.payment_date ?? new Date().toISOString().slice(0, 10)
                    }
                  />
                </label>
                <ActionMessage state={state} />
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setChargeTarget(null)}>
                    Cancel
                  </Button>
                  <Button disabled={pending} type="submit">
                    {pending ? "Saving..." : "Save charge"}
                  </Button>
                </div>
              </>
            )}
          </ActionForm>
        </Modal>
      ) : null}

      {deleteBlockTarget ? (
        <Modal title="Delete block bill" onClose={() => setDeleteBlockTarget(null)}>
          <ActionForm
            action={deleteBlockBill}
            onSuccess={() => setDeleteBlockTarget(null)}
            className="space-y-4"
          >
            {(state, pending) => (
              <>
                <input type="hidden" name="id" value={deleteBlockTarget.id} />
                <p className="text-sm leading-6 text-stone-600">
                  Delete this {deleteBlockTarget.bill_type} bill for{" "}
                  <span className="font-semibold text-stone-900">
                    {deleteBlockTarget.block_name}
                  </span>
                  ? Its recorded payments will also be removed.
                </p>
                <ActionMessage state={state} />
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setDeleteBlockTarget(null)}
                  >
                    Cancel
                  </Button>
                  <Button disabled={pending} type="submit" variant="destructive">
                    {pending ? "Deleting..." : "Delete bill"}
                  </Button>
                </div>
              </>
            )}
          </ActionForm>
        </Modal>
      ) : null}

      {deleteAcTarget ? (
        <Modal title="Delete room AC bill" onClose={() => setDeleteAcTarget(null)}>
          <ActionForm
            action={deleteRoomAcBill}
            onSuccess={() => setDeleteAcTarget(null)}
            className="space-y-4"
          >
            {(state, pending) => (
              <>
                <input type="hidden" name="id" value={deleteAcTarget.id} />
                <p className="text-sm leading-6 text-stone-600">
                  Delete the AC bill for{" "}
                  <span className="font-semibold text-stone-900">
                    {deleteAcTarget.block_name} · {deleteAcTarget.room_name}
                  </span>
                  ? All per-bed charges will also be removed.
                </p>
                <ActionMessage state={state} />
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setDeleteAcTarget(null)}>
                    Cancel
                  </Button>
                  <Button disabled={pending} type="submit" variant="destructive">
                    {pending ? "Deleting..." : "Delete bill"}
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
