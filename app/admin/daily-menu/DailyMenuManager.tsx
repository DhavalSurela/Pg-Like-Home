"use client";

import { useMemo, useState } from "react";
import { CalendarDays, Coffee, Moon, Pencil, Sun } from "lucide-react";

import { saveDailyMenu, type DailyMenuActionState } from "@/app/admin/daily-menu/actions";
import { ActionForm } from "@/components/admin/ActionForm";
import { Button } from "@/components/ui/button";
import type { Database } from "@/lib/database.types";

type DailyMenu = Database["public"]["Tables"]["daily_menus"]["Row"];

const inputClass =
  "mt-2 w-full rounded-xl border border-stone-200 bg-white px-3.5 py-3 text-sm text-stone-900 shadow-xs outline-none transition placeholder:text-stone-300 focus:border-stone-400 focus:ring-4 focus:ring-stone-100";

const dateFormat = new Intl.DateTimeFormat("en-IN", {
  weekday: "short",
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

function displayDate(value: string) {
  return dateFormat.format(new Date(`${value}T12:00:00Z`));
}

function ActionMessage({ state }: { state: DailyMenuActionState }) {
  if (state.status === "idle" || !state.message) return null;

  return (
    <p
      className={
        state.status === "success"
          ? "rounded-lg border border-emerald-200/70 bg-emerald-50/70 px-3 py-2 text-sm text-emerald-700"
          : "rounded-lg border border-red-200/70 bg-red-50/70 px-3 py-2 text-sm text-red-700"
      }
    >
      {state.message}
    </p>
  );
}

export function DailyMenuManager({ menus, today }: { menus: DailyMenu[]; today: string }) {
  const todayMenu = useMemo(() => menus.find((menu) => menu.menu_date === today), [menus, today]);
  const [selected, setSelected] = useState<DailyMenu | null>(todayMenu ?? null);
  const formDate = selected?.menu_date ?? today;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.8fr)]">
      <section className="card-surface rounded-2xl border border-stone-200/80 p-5 shadow-card sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-stone-900">
              {selected ? "Edit menu" : "Add today’s menu"}
            </h2>
            <p className="mt-1 text-sm text-stone-500">Saving an existing date updates its menu.</p>
          </div>
          {selected && selected.menu_date !== today ? (
            <Button type="button" variant="outline" onClick={() => setSelected(todayMenu ?? null)}>
              Today
            </Button>
          ) : null}
        </div>

        <ActionForm key={formDate} action={saveDailyMenu} className="mt-6 space-y-5">
          {(state, pending) => (
            <>
              <label className="block">
                <span className="flex items-center gap-2 text-sm font-medium text-stone-700">
                  <CalendarDays aria-hidden="true" className="size-4 text-stone-400" />
                  Menu date
                </span>
                <input
                  className={inputClass}
                  name="menu_date"
                  type="date"
                  required
                  max={today}
                  defaultValue={formDate}
                />
              </label>

              <label className="block">
                <span className="flex items-center gap-2 text-sm font-medium text-stone-700">
                  <Coffee aria-hidden="true" className="size-4 text-amber-600" />
                  Breakfast
                </span>
                <textarea
                  className={inputClass}
                  name="breakfast"
                  rows={2}
                  maxLength={500}
                  required
                  defaultValue={selected?.breakfast ?? ""}
                  placeholder="Example: Poha, tea and bananas"
                />
              </label>

              <label className="block">
                <span className="flex items-center gap-2 text-sm font-medium text-stone-700">
                  <Sun aria-hidden="true" className="size-4 text-orange-600" />
                  Lunch
                </span>
                <textarea
                  className={inputClass}
                  name="lunch"
                  rows={2}
                  maxLength={500}
                  required
                  defaultValue={selected?.lunch ?? ""}
                  placeholder="Example: Dal, rice, roti, sabzi and chaas"
                />
              </label>

              <label className="block">
                <span className="flex items-center gap-2 text-sm font-medium text-stone-700">
                  <Moon aria-hidden="true" className="size-4 text-indigo-600" />
                  Dinner
                </span>
                <textarea
                  className={inputClass}
                  name="dinner"
                  rows={2}
                  maxLength={500}
                  required
                  defaultValue={selected?.dinner ?? ""}
                  placeholder="Example: Paneer sabzi, roti, rice and salad"
                />
              </label>

              <ActionMessage state={state} />
              <Button className="h-11 w-full sm:w-auto" disabled={pending} type="submit">
                {pending ? "Saving..." : "Save daily menu"}
              </Button>
            </>
          )}
        </ActionForm>
      </section>

      <section className="card-surface overflow-hidden rounded-2xl border border-stone-200/80 shadow-card">
        <div className="border-b border-stone-200/80 px-5 py-4">
          <h2 className="text-base font-semibold text-stone-900">Last 30 days</h2>
          <p className="mt-1 text-sm text-stone-500">{menus.length} recorded menus</p>
        </div>

        {menus.length ? (
          <div className="max-h-[680px] divide-y divide-stone-100 overflow-y-auto">
            {menus.map((menu) => (
              <button
                key={menu.id}
                type="button"
                onClick={() => setSelected(menu)}
                className="group w-full px-5 py-4 text-left transition hover:bg-stone-50"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-stone-900">
                    {menu.menu_date === today ? "Today" : displayDate(menu.menu_date)}
                  </p>
                  <Pencil
                    aria-hidden="true"
                    className="size-3.5 text-stone-300 group-hover:text-stone-600"
                  />
                </div>
                <p className="mt-2 line-clamp-1 text-xs text-stone-500">
                  <span className="font-medium text-stone-700">Breakfast:</span> {menu.breakfast}
                </p>
                <p className="mt-1 line-clamp-1 text-xs text-stone-500">
                  <span className="font-medium text-stone-700">Lunch:</span> {menu.lunch}
                </p>
                <p className="mt-1 line-clamp-1 text-xs text-stone-500">
                  <span className="font-medium text-stone-700">Dinner:</span> {menu.dinner}
                </p>
              </button>
            ))}
          </div>
        ) : (
          <div className="px-6 py-16 text-center">
            <CalendarDays aria-hidden="true" className="mx-auto size-8 text-stone-300" />
            <p className="mt-3 text-sm text-stone-500">No daily menus recorded yet.</p>
          </div>
        )}
      </section>
    </div>
  );
}
