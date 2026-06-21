import type { Metadata } from "next";
import { Building2, Lock, Mail } from "lucide-react";

import { login } from "@/app/login/actions";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: {
    index: false,
    follow: false,
  },
};

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
    redirect?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const redirectTo = params.redirect?.startsWith("/admin") ? params.redirect : "/admin";

  return (
    <section className="admin-bg flex min-h-dvh flex-col justify-center px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-md flex-col justify-center">
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-stone-800 to-stone-950 text-white shadow-card-md">
            <Building2 aria-hidden="true" className="size-5" />
          </span>
          <p className="mt-5 text-xs font-semibold tracking-[0.16em] text-stone-400 uppercase">
            Admin access
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-stone-900">
            Sign in to PG Like Home
          </h1>
          <p className="mt-3 max-w-sm text-sm leading-6 text-stone-500">
            Use the admin email and password configured in Supabase Auth.
          </p>
        </div>

        <form
          action={login}
          className="space-y-5 rounded-2xl border border-stone-200/80 bg-white p-6 shadow-card-md"
        >
          <input type="hidden" name="redirect" value={redirectTo} />

          {params.error ? (
            <div className="rounded-lg border border-red-200/70 bg-red-50/70 px-3 py-2 text-sm text-red-700">
              {params.error}
            </div>
          ) : null}

          <label className="block">
            <span className="text-sm font-medium text-stone-700">Email</span>
            <span className="mt-2 flex items-center gap-2 rounded-lg border border-stone-200 bg-white px-3 py-2 shadow-xs transition focus-within:border-stone-400 focus-within:ring-4 focus-within:ring-stone-100">
              <Mail aria-hidden="true" className="size-4 text-stone-400" />
              <input
                className="w-full border-0 bg-transparent text-sm text-stone-900 outline-none placeholder:text-stone-400"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="admin@example.com"
              />
            </span>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-stone-700">Password</span>
            <span className="mt-2 flex items-center gap-2 rounded-lg border border-stone-200 bg-white px-3 py-2 shadow-xs transition focus-within:border-stone-400 focus-within:ring-4 focus-within:ring-stone-100">
              <Lock aria-hidden="true" className="size-4 text-stone-400" />
              <input
                className="w-full border-0 bg-transparent text-sm text-stone-900 outline-none placeholder:text-stone-400"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="Enter password"
              />
            </span>
          </label>

          <Button className="w-full" size="lg" type="submit">
            Sign in
          </Button>
        </form>
      </div>
    </section>
  );
}
