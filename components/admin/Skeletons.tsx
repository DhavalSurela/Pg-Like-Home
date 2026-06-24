import { cn } from "@/lib/utils";

// Real page heading (matches the actual pages) so the page "appears" instantly
// while only the data area below shows shimmering placeholders.
export function AdminPageHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div>
      <p className="text-xs font-semibold tracking-[0.18em] text-stone-400 uppercase">{eyebrow}</p>
      <h1 className="mt-3 text-4xl font-light tracking-tight text-stone-900 sm:text-5xl">{title}</h1>
      <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-stone-500">{description}</p>
    </div>
  );
}

// A single shimmer bar.
export function Bar({ className }: { className?: string }) {
  return <div className={cn("rounded bg-stone-200/80", className)} />;
}

// A generic table-shaped skeleton (header strip + rows).
export function SkeletonTable({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-card">
      <div className="flex items-center justify-between border-b border-stone-200/80 bg-stone-50/60 px-5 py-4">
        <Bar className="h-5 w-40" />
        <Bar className="h-4 w-28" />
      </div>
      <div className="divide-y divide-stone-100">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="flex items-center gap-6 px-5 py-4">
            {Array.from({ length: columns }).map((_, c) => (
              <Bar key={c} className={cn("h-4", c === 0 ? "w-32" : "w-20")} />
            ))}
            <Bar className="ml-auto h-7 w-20" />
          </div>
        ))}
      </div>
    </div>
  );
}
