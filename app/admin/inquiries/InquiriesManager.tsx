"use client";

import { useActionState, useState } from "react";
import { ArrowDownUp, Inbox, LayoutGrid, List, Mail, Phone, Plus, Trash2, X } from "lucide-react";

import {
  createInquiry,
  deleteInquiry,
  updateInquiry,
  type InquiryActionState,
} from "@/app/admin/inquiries/actions";
import { INQUIRY_STATUSES } from "@/app/admin/inquiries/constants";
import { ActionForm } from "@/components/admin/ActionForm";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Database } from "@/lib/database.types";

type Inquiry = Database["public"]["Tables"]["inquiries"]["Row"];

const idle: InquiryActionState = { status: "idle", message: "" };

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatDate(value: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

const statusStyles: Record<string, string> = {
  new: "bg-stone-900 text-white",
  responded: "bg-stone-200 text-stone-700",
  closed: "bg-stone-100 text-stone-400",
};

const inputClass =
  "w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 shadow-xs outline-none transition focus:border-stone-400 focus:ring-4 focus:ring-stone-100";

function InquiryCard({ inquiry, onDelete }: { inquiry: Inquiry; onDelete: () => void }) {
  const [state, action, pending] = useActionState(updateInquiry, idle);

  return (
    <div className="card-surface rounded-2xl border border-stone-200/80 p-5 shadow-card">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-stone-900">{inquiry.name}</h3>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase",
                statusStyles[inquiry.status] ?? "bg-stone-100 text-stone-500"
              )}
            >
              {inquiry.status}
            </span>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-stone-500">
            <a href={`tel:${inquiry.phone}`} className="flex items-center gap-1.5 hover:text-stone-900">
              <Phone aria-hidden="true" className="size-3.5" />
              {inquiry.phone}
            </a>
            {inquiry.email ? (
              <a href={`mailto:${inquiry.email}`} className="flex items-center gap-1.5 hover:text-stone-900">
                <Mail aria-hidden="true" className="size-3.5" />
                {inquiry.email}
              </a>
            ) : null}
          </div>
        </div>
        <span className="text-xs text-stone-400">{formatDate(inquiry.created_at)}</span>
      </div>

      <p className="mt-4 rounded-xl border border-stone-100 bg-stone-50/60 p-3 text-sm leading-6 whitespace-pre-line text-stone-700">
        {inquiry.message}
      </p>

      <form action={action} className="mt-4 space-y-3">
        <input type="hidden" name="id" value={inquiry.id} />
        <div className="grid gap-3 sm:grid-cols-[160px_1fr] sm:items-start">
          <label className="block">
            <span className="text-xs font-medium text-stone-500">Status</span>
            <select className={cn(inputClass, "mt-1")} name="status" defaultValue={inquiry.status}>
              {INQUIRY_STATUSES.map((s) => (
                <option key={s} value={s} className="capitalize">
                  {s}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-xs font-medium text-stone-500">Internal note</span>
            <textarea
              className={cn(inputClass, "mt-1")}
              name="admin_note"
              rows={2}
              defaultValue={inquiry.admin_note ?? ""}
              placeholder="Add a private note (not shown to the visitor)"
            />
          </label>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs text-emerald-600">
            {state.status === "success" ? state.message : null}
            {state.status === "error" ? <span className="text-red-600">{state.message}</span> : null}
          </span>
          <div className="flex gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={onDelete}>
              <Trash2 aria-hidden="true" className="size-4" />
              Delete
            </Button>
            <Button type="submit" size="sm" disabled={pending}>
              {pending ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

function InquiryRow({ inquiry, onDelete }: { inquiry: Inquiry; onDelete: () => void }) {
  const [, action, pending] = useActionState(updateInquiry, idle);

  return (
    <tr className="transition-colors hover:bg-stone-50/70">
      <td className="px-5 py-3 align-top">
        <div className="font-medium text-stone-900">{inquiry.name}</div>
        <div className="text-xs text-stone-400">{formatDate(inquiry.created_at)}</div>
      </td>
      <td className="px-5 py-3 align-top text-stone-600">
        <div>{inquiry.phone}</div>
        {inquiry.email ? <div className="text-xs text-stone-400">{inquiry.email}</div> : null}
      </td>
      <td className="max-w-xs px-5 py-3 align-top">
        <p className="truncate text-stone-600" title={inquiry.message}>
          {inquiry.message}
        </p>
      </td>
      <td className="px-5 py-3 align-top">
        {/* Changing the status auto-saves; admin_note is preserved via the hidden field. */}
        <form action={action}>
          <input type="hidden" name="id" value={inquiry.id} />
          <input type="hidden" name="admin_note" value={inquiry.admin_note ?? ""} />
          <select
            name="status"
            defaultValue={inquiry.status}
            disabled={pending}
            onChange={(e) => e.currentTarget.form?.requestSubmit()}
            className={cn(inputClass, "h-9 w-32 capitalize")}
          >
            {INQUIRY_STATUSES.map((s) => (
              <option key={s} value={s} className="capitalize">
                {s}
              </option>
            ))}
          </select>
        </form>
      </td>
      <td className="px-5 py-3 text-right align-top">
        <Button aria-label={`Delete ${inquiry.name}`} size="icon-sm" type="button" variant="destructive" onClick={onDelete}>
          <Trash2 aria-hidden="true" className="size-4" />
        </Button>
      </td>
    </tr>
  );
}

export function InquiriesManager({ inquiries }: { inquiries: Inquiry[] }) {
  const [deleting, setDeleting] = useState<Inquiry | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [view, setView] = useState<"cards" | "list">("cards");
  const [sortAsc, setSortAsc] = useState(false);

  const sorted = [...inquiries].sort((a, b) => {
    const diff = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    return sortAsc ? diff : -diff;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex gap-1 rounded-xl border border-stone-200/70 bg-stone-100/60 p-1">
            {(
              [
                { key: "cards", label: "Cards", icon: LayoutGrid },
                { key: "list", label: "List", icon: List },
              ] as const
            ).map((option) => {
              const Icon = option.icon;
              const isActive = view === option.key;
              return (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => setView(option.key)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-all",
                    isActive ? "bg-white text-stone-900 shadow-card" : "text-stone-500 hover:text-stone-900"
                  )}
                >
                  <Icon aria-hidden="true" className="size-4" />
                  <span className="hidden sm:inline">{option.label}</span>
                </button>
              );
            })}
          </div>
          <Button type="button" variant="outline" onClick={() => setSortAsc((v) => !v)}>
            <ArrowDownUp aria-hidden="true" className="size-4" />
            {sortAsc ? "Oldest first" : "Newest first"}
          </Button>
        </div>
        <Button type="button" onClick={() => setCreateOpen(true)}>
          <Plus aria-hidden="true" className="size-4" />
          Add inquiry
        </Button>
      </div>

      {inquiries.length === 0 ? (
        <div className="flex h-48 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-stone-300 text-sm text-stone-400">
          <Inbox aria-hidden="true" className="size-5 text-stone-300" />
          No inquiries yet. Add one manually, or submissions from the website contact form will appear here.
        </div>
      ) : view === "cards" ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {sorted.map((inquiry) => (
            <InquiryCard key={inquiry.id} inquiry={inquiry} onDelete={() => setDeleting(inquiry)} />
          ))}
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-card">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-stone-200/80 text-sm">
              <thead className="bg-stone-50/60 text-left text-xs font-semibold tracking-wide text-stone-400 uppercase">
                <tr>
                  <th className="px-5 py-3">Name</th>
                  <th className="px-5 py-3">Contact</th>
                  <th className="px-5 py-3">Message</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 bg-white">
                {sorted.map((inquiry) => (
                  <InquiryRow key={inquiry.id} inquiry={inquiry} onDelete={() => setDeleting(inquiry)} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {createOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/30 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-stone-200/80 bg-white shadow-card-md">
            <div className="sticky top-0 flex items-center justify-between border-b border-stone-200/80 bg-gradient-to-b from-stone-50 to-white px-5 py-4">
              <h2 className="text-base font-semibold text-stone-900">Add inquiry</h2>
              <button
                aria-label="Close modal"
                className="rounded-lg p-1 text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-900"
                type="button"
                onClick={() => setCreateOpen(false)}
              >
                <X aria-hidden="true" className="size-5" />
              </button>
            </div>
            <ActionForm action={createInquiry} onSuccess={() => setCreateOpen(false)} className="space-y-4 p-5">
              {(state, pending) => (
                <>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className="text-sm font-medium text-stone-700">Name</span>
                      <input className={cn(inputClass, "mt-1")} name="name" required placeholder="Full name" />
                    </label>
                    <label className="block">
                      <span className="text-sm font-medium text-stone-700">Phone</span>
                      <input className={cn(inputClass, "mt-1")} name="phone" required placeholder="Phone number" />
                    </label>
                  </div>
                  <label className="block">
                    <span className="text-sm font-medium text-stone-700">Email (optional)</span>
                    <input className={cn(inputClass, "mt-1")} name="email" type="email" placeholder="name@example.com" />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-stone-700">Message / note</span>
                    <textarea
                      className={cn(inputClass, "mt-1")}
                      name="message"
                      rows={3}
                      placeholder="What are they looking for? (e.g. walked in asking about AC rooms)"
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-stone-700">Status</span>
                    <select className={cn(inputClass, "mt-1")} name="status" defaultValue="new">
                      {INQUIRY_STATUSES.map((s) => (
                        <option key={s} value={s} className="capitalize">
                          {s}
                        </option>
                      ))}
                    </select>
                  </label>
                  {state.status === "error" ? (
                    <p className="rounded-lg border border-red-200/70 bg-red-50/70 px-3 py-2 text-sm text-red-700">
                      {state.message}
                    </p>
                  ) : null}
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={pending}>
                      {pending ? "Saving..." : "Add inquiry"}
                    </Button>
                  </div>
                </>
              )}
            </ActionForm>
          </div>
        </div>
      ) : null}

      {deleting ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/30 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-card-md">
            <div className="flex items-center justify-between border-b border-stone-200/80 bg-gradient-to-b from-stone-50 to-white px-5 py-4">
              <h2 className="text-base font-semibold text-stone-900">Delete inquiry</h2>
              <button
                aria-label="Close modal"
                className="rounded-lg p-1 text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-900"
                type="button"
                onClick={() => setDeleting(null)}
              >
                <X aria-hidden="true" className="size-5" />
              </button>
            </div>
            <ActionForm action={deleteInquiry} onSuccess={() => setDeleting(null)} className="space-y-5 p-5">
              {(state, pending) => (
                <>
                  <input type="hidden" name="id" value={deleting.id} />
                  <p className="text-sm leading-6 text-stone-600">
                    Delete the inquiry from <span className="font-semibold text-stone-900">{deleting.name}</span>? This
                    can&apos;t be undone.
                  </p>
                  {state.status === "error" ? (
                    <p className="rounded-lg border border-red-200/70 bg-red-50/70 px-3 py-2 text-sm text-red-700">
                      {state.message}
                    </p>
                  ) : null}
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
          </div>
        </div>
      ) : null}
    </div>
  );
}
