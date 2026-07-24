"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const adminLinks = [
  { href: "/admin", label: "Dashboard", paths: ["/admin"], exact: true },
  { href: "/admin/rooms", label: "Property", paths: ["/admin/rooms", "/admin/blocks"] },
  { href: "/admin/tenants", label: "Residents", paths: ["/admin/tenants"] },
  { href: "/admin/rents", label: "Finance", paths: ["/admin/rents", "/admin/bills"] },
  {
    href: "/admin/daily-menu",
    label: "Content",
    paths: ["/admin/daily-menu", "/admin/food-photos", "/admin/pricing"],
  },
  { href: "/admin/inquiries", label: "Inquiries", paths: ["/admin/inquiries"] },
];

export function AdminNav() {
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);
  const activeRef = useRef<HTMLAnchorElement>(null);

  // Center the active tab in the scrollable (mobile) nav so it's never hidden
  // off-screen after navigating. No-op on the desktop nav (it doesn't overflow).
  useEffect(() => {
    const container = navRef.current;
    const active = activeRef.current;
    if (!container || !active) return;
    const cRect = container.getBoundingClientRect();
    const aRect = active.getBoundingClientRect();
    const delta = aRect.left + aRect.width / 2 - (cRect.left + cRect.width / 2);
    if (Math.abs(delta) > 1) container.scrollBy({ left: delta, behavior: "smooth" });
  }, [pathname]);

  return (
    <nav
      ref={navRef}
      aria-label="Admin sections"
      className="admin-primary-nav flex items-center gap-1 overflow-x-auto px-4 [mask-image:linear-gradient(to_right,transparent,#000_18px,#000_calc(100%-18px),transparent)] [scrollbar-width:none] lg:rounded-2xl lg:border lg:border-stone-200/80 lg:bg-stone-100/70 lg:p-1 lg:[mask-image:none] [&::-webkit-scrollbar]:hidden"
    >
      {adminLinks.map((link) => {
        const isActive = link.exact
          ? pathname === link.href
          : link.paths.some((path) => pathname.startsWith(path));

        return (
          <Link
            key={link.href}
            ref={isActive ? activeRef : undefined}
            href={link.href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "relative shrink-0 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all lg:px-3 lg:py-2",
              isActive
                ? "bg-stone-900 text-white shadow-[0_5px_14px_-6px_rgba(28,25,23,0.7)]"
                : "text-stone-500 hover:bg-white/80 hover:text-stone-900"
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
