"use client";

import { useState } from "react";
import { IndianRupee, Pencil, Plus, Star, Trash2, X } from "lucide-react";

import {
  createPricing,
  deletePricing,
  updatePricing,
  type PricingActionState,
} from "@/app/admin/pricing/actions";
import { ActionForm } from "@/components/admin/ActionForm";
import { Button } from "@/components/ui/button";
import type { Database } from "@/lib/database.types";

type Plan = Database["public"]["Tables"]["pricing"]["Row"];

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

function ActionMessage({ state }: { state: PricingActionState }) {
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

const inputClass =
  "mt-2 w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 shadow-xs outline-none transition focus:border-stone-400 focus:ring-4 focus:ring-stone-100";

function PlanFormFields({ plan }: { plan?: Plan }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <label className="block">
        <span className="text-sm font-medium text-stone-700">Plan name</span>
        <input className={inputClass} name="plan_name" required defaultValue={plan?.plan_name ?? ""} placeholder="3 Sharing" />
      </label>
      <label className="block">
        <span className="text-sm font-medium text-stone-700">Subtitle</span>
        <input className={inputClass} name="subtitle" defaultValue={plan?.subtitle ?? ""} placeholder="AC Room" />
      </label>
      <label className="block">
        <span className="text-sm font-medium text-stone-700">Tag</span>
        <input className={inputClass} name="tag" defaultValue={plan?.tag ?? ""} placeholder="Premium" />
      </label>
      <label className="block">
        <span className="text-sm font-medium text-stone-700">Occupancy type</span>
        <input className={inputClass} name="occupancy_type" required defaultValue={plan?.occupancy_type ?? ""} placeholder="3-sharing" />
      </label>
      <label className="block">
        <span className="text-sm font-medium text-stone-700">Monthly rate (₹)</span>
        <input className={inputClass} name="monthly_rate" required type="number" min="0" step="1" defaultValue={plan?.monthly_rate ?? ""} placeholder="11000" />
      </label>
      <label className="block">
        <span className="text-sm font-medium text-stone-700">Deposit (₹)</span>
        <input className={inputClass} name="deposit" type="number" min="0" step="1" defaultValue={plan?.deposit ?? 0} />
      </label>
      <label className="block sm:col-span-2">
        <span className="text-sm font-medium text-stone-700">Description</span>
        <textarea className={inputClass} name="description" rows={2} defaultValue={plan?.description ?? ""} placeholder="Cool comfort with shared amenities." />
      </label>
      <label className="block sm:col-span-2">
        <span className="text-sm font-medium text-stone-700">Features</span>
        <span className="mt-0.5 block text-xs text-stone-400">One per line — these become the bullet list on the card.</span>
        <textarea
          className={inputClass}
          name="features"
          rows={4}
          defaultValue={(plan?.features ?? []).join("\n")}
          placeholder={"Air Conditioner\nStudy Table\nAttached Washroom"}
        />
      </label>
      <label className="block">
        <span className="text-sm font-medium text-stone-700">Inclusions (optional)</span>
        <input className={inputClass} name="inclusions" defaultValue={plan?.inclusions ?? ""} placeholder="Food, Wi-Fi, housekeeping" />
      </label>
      <label className="block">
        <span className="text-sm font-medium text-stone-700">Sort order</span>
        <input className={inputClass} name="sort_order" type="number" step="1" defaultValue={plan?.sort_order ?? 0} />
      </label>
      <label className="flex items-center gap-2 sm:col-span-2">
        <input
          className="size-4 rounded border-stone-300 text-stone-900 focus:ring-stone-300"
          name="recommended"
          type="checkbox"
          defaultChecked={plan?.recommended ?? false}
        />
        <span className="text-sm font-medium text-stone-700">Highlight as &ldquo;Most popular&rdquo;</span>
      </label>
    </div>
  );
}

function Modal({ children, title, onClose }: { children: React.ReactNode; title: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/30 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-stone-200/80 bg-white shadow-card-md">
        <div className="sticky top-0 flex items-center justify-between border-b border-stone-200/80 bg-gradient-to-b from-stone-50 to-white px-5 py-4">
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

export function PricingManager({ plans }: { plans: Plan[] }) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [deletingPlan, setDeletingPlan] = useState<Plan | null>(null);

  return (
    <>
      <div className="card-surface overflow-hidden rounded-2xl border border-stone-200/80 shadow-card">
        <div className="flex flex-col gap-3 border-b border-stone-200/80 bg-gradient-to-b from-stone-50/80 to-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-stone-900">Pricing plans</h2>
            <p className="mt-1 text-sm text-stone-500">These cards appear on the public Rooms &amp; Pricing page.</p>
          </div>
          <Button type="button" onClick={() => setIsCreateOpen(true)}>
            <Plus aria-hidden="true" className="size-4" />
            Add plan
          </Button>
        </div>

        {plans.length > 0 ? (
          <div className="grid gap-4 p-5 sm:grid-cols-2 xl:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="relative flex flex-col rounded-xl border border-stone-200/80 bg-white p-5 shadow-card"
              >
                {plan.recommended ? (
                  <span className="absolute top-4 right-4 inline-flex items-center gap-1 rounded-full bg-stone-900 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-white uppercase">
                    <Star aria-hidden="true" className="size-3" /> Popular
                  </span>
                ) : null}
                {plan.tag ? (
                  <span className="inline-flex w-fit items-center rounded-full bg-stone-100 px-2.5 py-0.5 text-[10px] font-semibold tracking-widest text-stone-500 uppercase">
                    {plan.tag}
                  </span>
                ) : null}
                <h3 className="mt-2 text-lg font-semibold text-stone-900">{plan.plan_name}</h3>
                {plan.subtitle ? <p className="text-sm text-stone-500">{plan.subtitle}</p> : null}
                <p className="mt-3 flex items-baseline gap-1 text-2xl font-semibold tracking-tight text-stone-900">
                  {inr.format(Number(plan.monthly_rate))}
                  <span className="text-xs font-normal text-stone-400">/mo</span>
                </p>
                {plan.features.length > 0 ? (
                  <ul className="mt-4 space-y-1.5 text-sm text-stone-600">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="size-1 rounded-full bg-stone-400" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                ) : null}
                <div className="mt-5 flex gap-2 border-t border-stone-100 pt-4">
                  <Button className="flex-1" size="sm" type="button" variant="outline" onClick={() => setEditingPlan(plan)}>
                    <Pencil aria-hidden="true" className="size-3.5" />
                    Edit
                  </Button>
                  <Button aria-label={`Delete ${plan.plan_name}`} size="icon-sm" type="button" variant="destructive" onClick={() => setDeletingPlan(plan)}>
                    <Trash2 aria-hidden="true" className="size-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 px-5 py-16 text-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-stone-100 text-stone-400">
              <IndianRupee aria-hidden="true" className="size-5" />
            </span>
            <p className="text-sm text-stone-500">No pricing plans yet. Add your first plan to populate the Rooms page.</p>
          </div>
        )}
      </div>

      {isCreateOpen ? (
        <Modal title="Add pricing plan" onClose={() => setIsCreateOpen(false)}>
          <ActionForm action={createPricing} onSuccess={() => setIsCreateOpen(false)} className="space-y-5">
            {(state, pending) => (
              <>
                <PlanFormFields />
                <ActionMessage state={state} />
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                    Cancel
                  </Button>
                  <Button disabled={pending} type="submit">
                    {pending ? "Saving..." : "Save plan"}
                  </Button>
                </div>
              </>
            )}
          </ActionForm>
        </Modal>
      ) : null}

      {editingPlan ? (
        <Modal title={`Edit ${editingPlan.plan_name}`} onClose={() => setEditingPlan(null)}>
          <ActionForm
            key={editingPlan.id}
            action={updatePricing}
            onSuccess={() => setEditingPlan(null)}
            className="space-y-5"
          >
            {(state, pending) => (
              <>
                <input name="id" type="hidden" value={editingPlan.id} />
                <PlanFormFields plan={editingPlan} />
                <ActionMessage state={state} />
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setEditingPlan(null)}>
                    Cancel
                  </Button>
                  <Button disabled={pending} type="submit">
                    {pending ? "Saving..." : "Update plan"}
                  </Button>
                </div>
              </>
            )}
          </ActionForm>
        </Modal>
      ) : null}

      {deletingPlan ? (
        <Modal title="Delete plan" onClose={() => setDeletingPlan(null)}>
          <ActionForm action={deletePricing} onSuccess={() => setDeletingPlan(null)} className="space-y-5">
            {(state, pending) => (
              <>
                <input name="id" type="hidden" value={deletingPlan.id} />
                <p className="text-sm leading-6 text-stone-600">
                  Delete <span className="font-semibold text-stone-900">{deletingPlan.plan_name}</span>? It will be
                  removed from the public Rooms page immediately.
                </p>
                <ActionMessage state={state} />
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setDeletingPlan(null)}>
                    Cancel
                  </Button>
                  <Button disabled={pending} type="submit" variant="destructive">
                    {pending ? "Deleting..." : "Delete plan"}
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
