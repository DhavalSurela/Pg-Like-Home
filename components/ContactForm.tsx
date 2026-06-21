"use client";

import { useActionState } from "react";
import { CheckCircle2, Send } from "lucide-react";

import { submitInquiry, type InquiryFormState } from "@/app/contact/actions";

const initialState: InquiryFormState = { status: "idle", message: "" };

const fieldClass =
  "mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20 placeholder:text-slate-400";

export function ContactForm({ className = "" }: { className?: string }) {
  const [state, action, pending] = useActionState(submitInquiry, initialState);

  if (state.status === "success") {
    return (
      <div
        className={`flex flex-col items-center justify-center gap-3 rounded-2xl border border-brand-green/30 bg-white p-8 text-center shadow-sm ${className}`}
      >
        <span className="flex size-12 items-center justify-center rounded-full bg-brand-green/15 text-brand-teal">
          <CheckCircle2 className="size-6" />
        </span>
        <h3 className="text-lg font-bold text-slate-900">Message sent</h3>
        <p className="max-w-sm text-sm text-slate-600">{state.message}</p>
      </div>
    );
  }

  return (
    <form
      action={action}
      className={`space-y-4 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm ${className}`}
    >
      <h3 className="text-xl font-bold text-slate-900">Send us a message</h3>
      <p className="text-sm text-slate-500">
        Have a question or want to book a visit? Drop your details and we&apos;ll reach out.
      </p>

      {state.status === "error" ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{state.message}</p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Name</span>
          <input className={fieldClass} name="name" required placeholder="Your name" />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Phone</span>
          <input className={fieldClass} name="phone" required placeholder="Phone number" />
        </label>
      </div>

      <label className="block">
        <span className="text-sm font-medium text-slate-700">Email (optional)</span>
        <input className={fieldClass} name="email" type="email" placeholder="name@example.com" />
      </label>

      <label className="block">
        <span className="text-sm font-medium text-slate-700">Message</span>
        <textarea
          className={fieldClass}
          name="message"
          required
          rows={4}
          placeholder="Tell us what you're looking for (room type, move-in date, etc.)"
        />
      </label>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-brand-teal px-6 py-3 font-semibold text-white transition-colors hover:bg-[#005f6b] disabled:opacity-60"
      >
        <Send className="size-4" />
        {pending ? "Sending..." : "Send message"}
      </button>
    </form>
  );
}
