"use client";

import { usePathname } from "next/navigation";

import { FloatingCTA } from "@/components/FloatingCTA";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminSurface = pathname.startsWith("/admin") || pathname === "/login";

  if (isAdminSurface) {
    return <main className="flex-grow">{children}</main>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
      <FloatingCTA />
    </>
  );
}
