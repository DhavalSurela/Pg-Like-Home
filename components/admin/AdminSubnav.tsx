"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

type SubnavLink = {
  href: string;
  label: string;
};

function AdminSubnav({ label, links }: { label: string; links: SubnavLink[] }) {
  const pathname = usePathname();

  return (
    <nav
      aria-label={`${label} sections`}
      className="admin-subnav overflow-x-auto [scrollbar-width:none]"
    >
      <div className="flex min-w-max rounded-xl border border-stone-200/80 bg-stone-100/70 p-1 sm:w-fit">
        {links.map((link) => {
          const active = pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex min-h-9 flex-1 items-center justify-center rounded-lg px-4 text-sm font-medium whitespace-nowrap transition",
                active
                  ? "bg-white text-stone-900 shadow-card"
                  : "text-stone-500 hover:text-stone-900"
              )}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function FinanceNav() {
  return (
    <AdminSubnav
      label="Finance"
      links={[
        { href: "/admin/rents", label: "Rents" },
        { href: "/admin/bills", label: "Bills" },
      ]}
    />
  );
}

export function ContentNav() {
  return (
    <AdminSubnav
      label="Content"
      links={[
        { href: "/admin/daily-menu", label: "Daily menu" },
        { href: "/admin/food-photos", label: "Food photos" },
        { href: "/admin/pricing", label: "Pricing" },
      ]}
    />
  );
}
