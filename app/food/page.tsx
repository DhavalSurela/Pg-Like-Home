import type { Metadata } from "next";
import {
  CalendarDays,
  CheckCircle2,
  Coffee,
  Moon,
  PartyPopper,
  Pizza,
  Sun,
  Utensils,
  UtensilsCrossed,
} from "lucide-react";
import fs from "fs";
import path from "path";
import { ImageSlider } from "@/components/ImageSlider";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Food Menu - Pure Veg Meals at PG Like Home",
  description:
    "See today's breakfast, lunch and dinner at PG Like Home, Memnagar, plus the meals served over the last 30 days. Unlimited pure vegetarian food prepared in a hygienic kitchen.",
  keywords: [
    "PG food Ahmedabad",
    "veg food hostel Memnagar",
    "PG with meals",
    "student food menu",
    "unlimited food PG",
  ],
  alternates: {
    canonical: "https://pg-like-home.vercel.app/food",
  },
  openGraph: {
    title: "Food Menu - Pure Veg Meals Daily | PG Like Home",
    description: "See today's pure veg breakfast, lunch and dinner, plus our recent daily menus.",
    url: "https://pg-like-home.vercel.app/food",
  },
};

// Helper function to get images from a directory
function getImages(category: string): string[] {
  const dirPath = path.join(process.cwd(), "public", "images", "food", category);

  try {
    if (!fs.existsSync(dirPath)) {
      return [];
    }

    const files = fs.readdirSync(dirPath);
    return files
      .filter((file) => /\.(jpg|jpeg|png|webp)$/i.test(file))
      .map((file) => `/images/food/${category}/${file}`);
  } catch (error) {
    console.error(`Error reading directory ${category}:`, error);
    return [];
  }
}

function indiaDate() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function daysAgo(value: string, days: number) {
  const date = new Date(`${value}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() - days);
  return date.toISOString().slice(0, 10);
}

const menuDateFormat = new Intl.DateTimeFormat("en-IN", {
  weekday: "long",
  day: "numeric",
  month: "long",
  timeZone: "UTC",
});

function displayMenuDate(value: string) {
  return menuDateFormat.format(new Date(`${value}T12:00:00Z`));
}

export default async function Food() {
  const features = [
    {
      title: "Daily menu updates",
      desc: "See what was prepared today and browse the meals served over the last 30 days.",
    },
    {
      title: "Unlimited food",
      desc: "Eat as much as you want, ensuring you're always satisfied.",
    },
    {
      title: "Sunday Feast",
      desc: "Special meal with Sweet/Farsan every Sunday.",
    },
    {
      title: "Buttermilk provided daily",
      desc: "Fresh Buttermilk available daily for all residents.",
    },
    {
      title: "Kitchen Hygiene",
      desc: "Our kitchen is cleaned twice daily. We use high-quality oil, fresh vegetables, and RO water for cooking. Parents are welcome to inspect our kitchen at any time.",
    },
  ];

  // Prefer admin-managed photos from the database; fall back to the bundled
  // filesystem images per category if the DB has none (or is unreachable).
  const dbByCategory = new Map<string, string[]>();
  const today = indiaDate();
  const cutoff = daysAgo(today, 29);
  let dailyMenus: Array<{
    id: string;
    menu_date: string;
    breakfast: string;
    lunch: string;
    dinner: string;
  }> = [];

  try {
    const supabase = await createClient();
    const [photosResult, menusResult] = await Promise.all([
      supabase
        .from("food_photos")
        .select("image_url, category, sort_order")
        .order("sort_order", { ascending: true }),
      supabase
        .from("daily_menus")
        .select("id, menu_date, breakfast, lunch, dinner")
        .gte("menu_date", cutoff)
        .lte("menu_date", today)
        .order("menu_date", { ascending: false }),
    ]);

    for (const photo of photosResult.data ?? []) {
      const existing = dbByCategory.get(photo.category) ?? [];
      existing.push(photo.image_url);
      dbByCategory.set(photo.category, existing);
    }

    dailyMenus = menusResult.data ?? [];
  } catch {
    // Ignore and use filesystem fallback below.
  }

  const categoryImages = (category: string) => {
    const fromDb = dbByCategory.get(category);
    return fromDb && fromDb.length > 0 ? fromDb : getImages(category);
  };

  // Get images for each category
  const breakfastImages = categoryImages("breakfast");
  const lunchDinnerImages = categoryImages("lunch-dinner");
  const festivalImages = categoryImages("festival-food");
  const fastFoodImages = categoryImages("fastfood");
  const todayMenu = dailyMenus.find((menu) => menu.menu_date === today);
  const previousMenus = dailyMenus.filter((menu) => menu.menu_date !== today);

  return (
    <div className="bg-brand-cream min-h-dvh pb-20">
      <div className="bg-brand-teal text-white py-16">
        <div className="container mx-auto px-6 md:px-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold">Hygiene & Taste</h1>
          <p className="mt-4 text-slate-300 max-w-2xl mx-auto">
            We believe that good food is essential for good health and better studies. Pure
            vegetarian meals prepared with love.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 md:px-12 mt-12">
        {/* Daily Menu */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-slate-900 mb-3 text-center flex items-center justify-center gap-2">
            <Utensils className="text-brand-orange" />
            Today&apos;s Menu
          </h2>
          <p className="mb-8 text-center text-sm text-slate-500">{displayMenuDate(today)}</p>

          {todayMenu ? (
            <div className="mx-auto grid max-w-4xl gap-4 md:grid-cols-3">
              {[
                {
                  label: "Breakfast",
                  value: todayMenu.breakfast,
                  icon: Coffee,
                  iconClass: "bg-amber-100 text-amber-700",
                },
                {
                  label: "Lunch",
                  value: todayMenu.lunch,
                  icon: Sun,
                  iconClass: "bg-orange-100 text-orange-700",
                },
                {
                  label: "Dinner",
                  value: todayMenu.dinner,
                  icon: Moon,
                  iconClass: "bg-indigo-100 text-indigo-700",
                },
              ].map((meal) => {
                const Icon = meal.icon;
                return (
                  <article
                    key={meal.label}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <div
                      className={`flex size-10 items-center justify-center rounded-xl ${meal.iconClass}`}
                    >
                      <Icon className="size-5" aria-hidden="true" />
                    </div>
                    <p className="mt-4 text-xs font-bold tracking-wider text-slate-400 uppercase">
                      {meal.label}
                    </p>
                    <p className="mt-2 font-semibold leading-relaxed text-slate-800">
                      {meal.value}
                    </p>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="mx-auto max-w-2xl rounded-2xl border border-dashed border-slate-300 bg-white/60 px-6 py-10 text-center">
              <CalendarDays className="mx-auto size-8 text-slate-300" aria-hidden="true" />
              <p className="mt-3 font-semibold text-slate-700">
                Today&apos;s menu will be updated soon.
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Please check again later for breakfast, lunch, and dinner.
              </p>
            </div>
          )}

          <div className="mt-12">
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Past menus</h3>
                <p className="mt-1 text-sm text-slate-500">
                  What we served during the last 30 days
                </p>
              </div>
              <span className="shrink-0 whitespace-nowrap rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-500 ring-1 ring-slate-200">
                {dailyMenus.length} days
              </span>
            </div>

            {previousMenus.length ? (
              <div className="grid items-start gap-3 md:grid-cols-2">
                {previousMenus.map((menu) => (
                  <details
                    key={menu.id}
                    className="group rounded-xl border border-slate-200 bg-white shadow-sm"
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-4 font-semibold text-slate-800">
                      {displayMenuDate(menu.menu_date)}
                      <span className="text-lg font-normal text-slate-400 transition group-open:rotate-45">
                        +
                      </span>
                    </summary>
                    <div className="grid gap-3 border-t border-slate-100 px-4 py-4 text-sm">
                      <div>
                        <p className="text-xs font-bold tracking-wider text-amber-700 uppercase">
                          Breakfast
                        </p>
                        <p className="mt-1 text-slate-700">{menu.breakfast}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold tracking-wider text-orange-700 uppercase">
                          Lunch
                        </p>
                        <p className="mt-1 text-slate-700">{menu.lunch}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold tracking-wider text-indigo-700 uppercase">
                          Dinner
                        </p>
                        <p className="mt-1 text-slate-700">{menu.dinner}</p>
                      </div>
                    </div>
                  </details>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-slate-200 bg-white px-5 py-8 text-center text-sm text-slate-500">
                Past menus will appear here as they are recorded.
              </div>
            )}
          </div>
        </div>

        {/* Food Categories Sliders */}
        <div className="mt-20 space-y-20">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">
            Our Delicious Meals
          </h2>

          {/* Breakfast */}
          <div id="breakfast" className="space-y-4 scroll-mt-24">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-yellow-100 rounded-lg text-yellow-700">
                <Coffee className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800">Breakfast</h3>
            </div>
            <ImageSlider images={breakfastImages} category="Breakfast" />
          </div>

          {/* Lunch & Dinner */}
          <div id="lunch-dinner" className="space-y-4 scroll-mt-24">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-orange-100 rounded-lg text-orange-700">
                <UtensilsCrossed className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800">Lunch & Dinner</h3>
            </div>
            <ImageSlider images={lunchDinnerImages} category="Lunch & Dinner" />
          </div>

          {/* Festival Food */}
          <div id="festival-food" className="space-y-4 scroll-mt-24">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-100 rounded-lg text-purple-700">
                <PartyPopper className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800">Festival Day Food</h3>
            </div>
            <ImageSlider images={festivalImages} category="Festival Food" />
          </div>

          {/* Fast Food */}
          <div id="fast-food" className="space-y-4 scroll-mt-24">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-lg text-red-700">
                <Pizza className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800">Fast Food</h3>
            </div>
            <ImageSlider images={fastFoodImages} category="Fast Food" />
          </div>
        </div>

        {/* Features */}
        <div className="mt-20 rounded-2xl border border-slate-200 bg-white p-8">
          <h3 className="mb-8 text-center text-xl font-bold text-slate-900">Special Features</h3>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="bg-brand-green/20 text-brand-green mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">{feature.title}</h3>
                  <p className="mt-1 text-sm text-slate-600">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
