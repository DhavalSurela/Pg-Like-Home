"use client";

import { X } from "lucide-react";

import { cn } from "@/lib/utils";

const sizes = {
  md: "sm:max-w-md",
  lg: "sm:max-w-lg",
  xl: "sm:max-w-2xl",
};

// Responsive modal: a centered dialog on tablet/desktop, a bottom sheet (slides
// up, full-width, rounded top, sticky header) on phones. The header stays put
// while the body scrolls.
export function Modal({
  children,
  title,
  onClose,
  size = "md",
}: {
  children: React.ReactNode;
  title: string;
  onClose: () => void;
  size?: keyof typeof sizes;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-stone-950/40 backdrop-blur-sm sm:items-center sm:p-4">
      <div
        className={cn(
          "admin-modal-panel flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-2xl border border-stone-200/80 bg-white shadow-card-md sm:max-h-[90dvh] sm:rounded-2xl",
          sizes[size]
        )}
      >
        <div className="admin-modal-header flex shrink-0 items-center justify-between border-b border-stone-200/80 bg-gradient-to-b from-stone-50 to-white px-5 py-4">
          <h2 className="text-base font-semibold text-stone-900">{title}</h2>
          <button
            aria-label="Close modal"
            className="-mr-1.5 rounded-lg p-2 text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-900"
            type="button"
            onClick={onClose}
          >
            <X aria-hidden="true" className="size-5" />
          </button>
        </div>
        <div className="overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  );
}
