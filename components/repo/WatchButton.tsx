"use client";

import { Eye, EyeSlash } from "@/components/ui/icons";
import { useWatchlist } from "@/components/watchlist/WatchlistProvider";

interface WatchButtonProps {
  slug: string;
  compact?: boolean;
}

export function WatchButton({ slug, compact = false }: WatchButtonProps) {
  const { isWatched, toggle, mounted } = useWatchlist();
  const watched = isWatched(slug);

  // Hydration-safe: render a neutral state until mounted.
  if (!mounted) {
    return (
      <span
        className={`inline-flex items-center justify-center gap-1.5 rounded-md border border-line text-sm text-muted ${
          compact ? "h-8 px-2.5" : "h-10 px-5"
        }`}
      >
        <Eye size={16} />
        {compact ? null : "Watch"}
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={() => toggle(slug)}
      aria-pressed={watched}
      aria-label={watched ? `Remove ${slug} from watchlist` : `Add ${slug} to watchlist`}
      className={`inline-flex items-center justify-center gap-1.5 rounded-md border text-sm font-medium transition-all duration-200 active:scale-[0.98] ${
        watched
          ? "border-accent/40 bg-accent-soft text-accent hover:bg-accent-soft/70"
          : "border-line text-fg hover:bg-accent-soft/30"
      } ${compact ? "h-8 px-2.5" : "h-10 px-5"}`}
    >
      {watched ? <EyeSlash size={16} weight="bold" /> : <Eye size={16} weight="bold" />}
      {compact ? null : watched ? "Watched" : "Watch"}
    </button>
  );
}
