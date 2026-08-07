"use client";

import { Moon, Sun } from "@/components/ui/icons";
import { useEffect, useState } from "react";
import { THEME_STORAGE_KEY } from "@/lib/constants";

/**
 * Hydration-safe theme toggle. The initial state is always "dark" so the
 * first client render matches the SSR markup; the saved theme / OS
 * preference is applied only after mount.
 */
export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      let next: "light" | "dark" = "dark";
      try {
        const saved = localStorage.getItem(THEME_STORAGE_KEY);
        if (saved === "light" || saved === "dark") {
          next = saved;
        } else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
          next = "light";
        }
      } catch {
        // Storage unavailable; keep dark.
      }
      setTheme(next);
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(next);
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Storage unavailable; theme still applies for this session.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-line text-fg/80 transition-colors hover:bg-accent-soft/30 hover:text-fg"
    >
      {theme === "dark" ? (
        <Sun size={16} weight="bold" />
      ) : (
        <Moon size={16} weight="bold" />
      )}
    </button>
  );
}
