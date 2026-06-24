"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const adminLinks = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/rooms", label: "Rooms" },
  { href: "/admin/tenants", label: "Tenants" },
  { href: "/admin/rents", label: "Rents" },
  { href: "/admin/food-photos", label: "Food Photos" },
  { href: "/admin/pricing", label: "Pricing" },
  { href: "/admin/inquiries", label: "Inquiries" },
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
      className="flex items-center gap-1 overflow-x-auto px-4 [mask-image:linear-gradient(to_right,transparent,#000_18px,#000_calc(100%-18px),transparent)] [scrollbar-width:none] lg:px-0 lg:[mask-image:none] [&::-webkit-scrollbar]:hidden"
    >
      {adminLinks.map((link) => {
        const isActive =
          link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);

        return (
          <Link
            key={link.href}
            ref={isActive ? activeRef : undefined}
            href={link.href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "relative shrink-0 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors lg:py-2",
              isActive ? "text-stone-900" : "text-stone-500 hover:text-stone-900"
            )}
          >
            {link.label}
            <span
              className={cn(
                "absolute inset-x-3.5 -bottom-px h-0.5 rounded-full bg-stone-900 transition-opacity",
                isActive ? "opacity-100" : "opacity-0"
              )}
            />
          </Link>
        );
      })}
    </nav>
  );
}
