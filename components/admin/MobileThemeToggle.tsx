"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

const STORAGE_KEY = "admin-mobile-theme";
const DARK_CLASS = "admin-dark";

export function MobileThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains(DARK_CLASS));
  }, []);

  function toggleTheme() {
    const nextIsDark = !document.documentElement.classList.contains(DARK_CLASS);
    document.documentElement.classList.toggle(DARK_CLASS, nextIsDark);
    setIsDark(nextIsDark);

    try {
      window.localStorage.setItem(STORAGE_KEY, nextIsDark ? "dark" : "light");
    } catch {
      // The theme still works for this session when storage is unavailable.
    }
  }

  return (
    <button
      type="button"
      className="admin-theme-toggle flex size-9 items-center justify-center rounded-xl border border-stone-200/80 bg-white/70 text-stone-500 shadow-card transition-colors hover:border-stone-300 hover:bg-white hover:text-stone-900 sm:hidden"
      aria-label={isDark ? "Use light theme" : "Use dark theme"}
      aria-pressed={isDark}
      title={isDark ? "Use light theme" : "Use dark theme"}
      onClick={toggleTheme}
    >
      <Moon aria-hidden="true" className="admin-theme-icon-light size-4" />
      <Sun aria-hidden="true" className="admin-theme-icon-dark hidden size-4" />
    </button>
  );
}
