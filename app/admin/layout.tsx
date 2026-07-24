import Link from "next/link";
import { Home, LogOut } from "lucide-react";

import { logout } from "@/app/login/actions";
import { AdminNav } from "@/components/admin/AdminNav";
import { MobileThemeToggle } from "@/components/admin/MobileThemeToggle";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";

const mobileThemeScript = `
  (() => {
    try {
      const theme = window.localStorage.getItem("admin-mobile-theme");
      document.documentElement.classList.toggle("admin-dark", theme === "dark");
    } catch {}
  })();
`;

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userEmail = user?.email ?? "Admin user";
  const initials = userEmail.slice(0, 2).toUpperCase();

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: mobileThemeScript }} />
      <div className="admin-bg min-h-dvh text-stone-900">
        <header className="admin-header sticky top-0 z-30 border-b border-stone-200/80 bg-[#fbfaf7]/90 shadow-[0_8px_30px_-24px_rgba(41,37,36,0.5)] backdrop-blur-xl">
          <div className="admin-topbar mx-auto flex h-[4.5rem] max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
            {/* Brand */}
            <Link
              href="/admin"
              className="group flex min-w-0 items-center gap-3 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-stone-400 focus-visible:ring-offset-4"
            >
              <span className="admin-brand-icon relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-stone-900 text-white shadow-[0_8px_20px_-8px_rgba(28,25,23,0.55)] transition-transform group-hover:-translate-y-0.5">
                <span className="absolute -top-3 -right-3 size-8 rounded-full bg-amber-300/25 blur-sm" />
                <Home aria-hidden="true" className="relative size-[1.15rem]" strokeWidth={2.25} />
              </span>
              <span className="block min-w-0">
                <span className="block truncate text-[15px] font-semibold tracking-[-0.02em] text-stone-950">
                  PG Like Home
                </span>
                <span className="mt-0.5 block truncate text-[11px] font-medium tracking-[0.08em] text-stone-400 uppercase">
                  Admin workspace
                </span>
              </span>
            </Link>

            {/* Centered nav (desktop) */}
            <div className="hidden min-w-0 flex-1 justify-center px-3 lg:flex">
              <AdminNav />
            </div>

            {/* Actions */}
            <div className="ml-auto flex shrink-0 items-center gap-2 lg:ml-0">
              <div className="hidden items-center gap-2.5 rounded-xl border border-stone-200/80 bg-white/70 py-1.5 pr-3 pl-1.5 shadow-card sm:flex">
                <span className="flex size-8 items-center justify-center rounded-lg bg-stone-100 text-[11px] font-bold text-stone-700 ring-1 ring-stone-200/80">
                  {initials}
                </span>
                <span className="hidden min-w-0 lg:block">
                  <span className="block max-w-36 truncate text-xs font-semibold text-stone-700">
                    {userEmail}
                  </span>
                  <span className="mt-0.5 block text-[10px] font-medium tracking-wide text-stone-400 uppercase">
                    Administrator
                  </span>
                </span>
              </div>
              <MobileThemeToggle />
              <span className="flex size-9 items-center justify-center rounded-xl bg-stone-100 text-[11px] font-bold text-stone-700 ring-1 ring-stone-200 sm:hidden">
                {initials}
              </span>
              <form action={logout}>
                <Button
                  type="submit"
                  variant="outline"
                  aria-label="Log out"
                  title="Log out"
                  className="size-9 rounded-xl border-stone-200/80 bg-white/70 p-0 text-stone-500 shadow-card hover:border-stone-300 hover:bg-white hover:text-stone-900"
                >
                  <LogOut aria-hidden="true" className="size-4" />
                </Button>
              </form>
            </div>
          </div>

          {/* Scrollable nav (tablet / mobile) — full-bleed so tabs scroll to the edges */}
          <div className="admin-mobile-nav border-t border-stone-200/60 bg-white/30 py-2 lg:hidden">
            <AdminNav />
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8 lg:py-10">
          <div className="min-w-0">{children}</div>
        </main>
      </div>
    </>
  );
}
