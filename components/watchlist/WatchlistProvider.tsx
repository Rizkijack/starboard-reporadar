"use client";

import {
  createContext,
  useCallback,
  useContext,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { WATCHLIST_STORAGE_KEY } from "@/lib/constants";

interface WatchlistContextValue {
  watchlist: string[];
  isWatched: (slug: string) => boolean;
  toggle: (slug: string) => void;
  clear: () => void;
  importSlugs: (slugs: string[]) => void;
  mounted: boolean;
}

const WatchlistContext = createContext<WatchlistContextValue | null>(null);

/**
 * Minimal external store backed by localStorage.
 * useSyncExternalStore keeps hydration-safe (SSR snapshot = []).
 */
const listeners = new Set<() => void>();
let snapshot: string[] | null = null;

function readSnapshot(): string[] {
  if (snapshot) return snapshot;
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(WATCHLIST_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    snapshot = Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    snapshot = [];
  }
  return snapshot;
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

function notify() {
  snapshot = null; // invalidate cached snapshot
  for (const cb of listeners) cb();
}

function persist(slugs: string[]) {
  snapshot = [...slugs];
  try {
    localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(slugs));
  } catch {
    // Storage unavailable; in-memory only.
  }
  notify();
}

export function WatchlistProvider({ children }: { children: ReactNode }) {
  const watchlist = useSyncExternalStore(subscribe, readSnapshot, () => []);

  const isWatched = useCallback(
    (slug: string) => watchlist.includes(slug),
    [watchlist]
  );

  const toggle = useCallback((slug: string) => {
    const current = readSnapshot();
    const next = current.includes(slug)
      ? current.filter((s) => s !== slug)
      : [...current, slug];
    persist(next);
  }, []);

  const clear = useCallback(() => persist([]), []);

  const importSlugs = useCallback((slugs: string[]) => {
    const next = [...new Set([...readSnapshot(), ...slugs])];
    persist(next);
  }, []);

  return (
    <WatchlistContext.Provider
      value={{ watchlist, isWatched, toggle, clear, importSlugs, mounted: true }}
    >
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlist(): WatchlistContextValue {
  const ctx = useContext(WatchlistContext);
  if (!ctx) throw new Error("useWatchlist must be used within WatchlistProvider");
  return ctx;
}
