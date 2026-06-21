"use client";

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

  return (
    <nav
      aria-label="Admin sections"
      className="flex items-center gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {adminLinks.map((link) => {
        const isActive =
          link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);

        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "relative shrink-0 px-3 py-2 text-sm font-medium transition-colors",
              isActive ? "text-stone-900" : "text-stone-500 hover:text-stone-900"
            )}
          >
            {link.label}
            <span
              className={cn(
                "absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-stone-900 transition-opacity",
                isActive ? "opacity-100" : "opacity-0"
              )}
            />
          </Link>
        );
      })}
    </nav>
  );
}
