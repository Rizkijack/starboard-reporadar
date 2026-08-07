"use client";

import { useWatchlist } from "@/components/watchlist/WatchlistProvider";
import Link from "next/link";

export function WatchlistBadge() {
  const { watchlist, mounted } = useWatchlist();

  return (
    <Link
      href="/watchlist"
      className="relative inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm text-fg/75 transition-colors hover:bg-accent-soft/30 hover:text-fg"
      aria-label={`Watchlist with ${mounted ? watchlist.length : 0} repos`}
    >
      Watchlist
      {mounted && watchlist.length > 0 ? (
        <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1.5 font-mono text-[10px] font-semibold text-background">
          {watchlist.length}
        </span>
      ) : null}
    </Link>
  );
}
