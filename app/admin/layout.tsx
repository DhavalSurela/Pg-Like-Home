import Link from "next/link";
import { Home, LogOut } from "lucide-react";

import { logout } from "@/app/login/actions";
import { AdminNav } from "@/components/admin/AdminNav";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userEmail = user?.email ?? "Admin user";
  const initials = userEmail.slice(0, 2).toUpperCase();

  return (
    <div className="admin-bg min-h-dvh text-stone-900">
      <header className="sticky top-0 z-30 border-b border-stone-200/70 bg-[#faf8f2]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
          {/* Brand */}
          <Link href="/admin" className="flex min-w-0 items-center gap-2.5">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-stone-700 to-stone-900 text-white shadow-card">
              <Home aria-hidden="true" className="size-5" strokeWidth={2.5} />
            </span>
            <span className="block min-w-0">
              <span className="block truncate text-sm font-semibold tracking-tight text-stone-900">
                PG Like Home
              </span>
              <span className="block truncate text-xs text-stone-400">Admin panel</span>
            </span>
          </Link>

          {/* Centered nav (desktop) */}
          <div className="hidden flex-1 justify-center lg:flex">
            <AdminNav />
          </div>

          {/* Actions */}
          <div className="ml-auto flex items-center gap-3 lg:ml-0">
            <span className="hidden max-w-44 truncate text-sm text-stone-500 xl:block">
              {userEmail}
            </span>
            <span className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-stone-200 to-stone-300 text-xs font-semibold text-stone-700 ring-1 ring-stone-300/60">
              {initials}
            </span>
            <form action={logout}>
              <Button type="submit" variant="outline">
                <LogOut aria-hidden="true" className="size-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </form>
          </div>
        </div>

        {/* Scrollable nav (tablet / mobile) — full-bleed so tabs scroll to the edges */}
        <div className="border-t border-stone-200/60 py-2 lg:hidden">
          <AdminNav />
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="min-w-0">{children}</div>
      </main>
    </div>
  );
}
