"use client";

import { useRef, useState } from "react";
import { Download, Upload, Trash } from "@/components/ui/icons";
import { useWatchlist } from "@/components/watchlist/WatchlistProvider";
import { RepoCard } from "@/components/repo/RepoCard";
import { Button } from "@/components/ui/Button";
import type { RepoWithStats } from "@/lib/types";

export function WatchlistPage({ repos }: { repos: RepoWithStats[] }) {
  const { watchlist, clear, importSlugs } = useWatchlist();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [confirmingClear, setConfirmingClear] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const watchedRepos = repos.filter((r) => watchlist.includes(r.slug));

  function handleExport() {
    const blob = new Blob([JSON.stringify(watchlist, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "starboard-watchlist.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        const slugs = Array.isArray(parsed)
          ? parsed.map((s) => String(s))
          : Array.isArray(parsed?.slugs)
            ? parsed.slugs.map((s: unknown) => String(s))
            : [];
        if (slugs.length === 0) throw new Error("empty");
        importSlugs(slugs);
        setNotice(`Imported ${slugs.length} repo${slugs.length === 1 ? "" : "s"}.`);
      } catch {
        setNotice("Import failed. Expected a JSON array of repo slugs.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-14">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <h1 className="text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
            Your watchlist
          </h1>
          <p className="mt-2 text-base leading-relaxed text-muted">
            Repos you are tracking. Stored locally in your browser, nothing
            leaves your device.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="secondary" onClick={handleExport} disabled={watchlist.length === 0}>
            <Download size={15} weight="bold" aria-hidden="true" />
            Export JSON
          </Button>
          <Button
            variant="secondary"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload size={15} weight="bold" aria-hidden="true" />
            Import JSON
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={handleImportFile}
            aria-label="Import watchlist JSON file"
          />
          {watchlist.length > 0 ? (
            confirmingClear ? (
              <span className="inline-flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    clear();
                    setConfirmingClear(false);
                  }}
                  className="text-sm font-medium text-red-500 hover:underline"
                >
                  Confirm clear
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmingClear(false)}
                  className="text-sm text-muted hover:text-fg"
                >
                  Cancel
                </button>
              </span>
            ) : (
              <Button
                variant="ghost"
                onClick={() => setConfirmingClear(true)}
                className="text-muted hover:text-red-500"
              >
                <Trash size={15} weight="bold" aria-hidden="true" />
                Clear all
              </Button>
            )
          ) : null}
        </div>
      </div>

      {notice ? (
        <p className="mt-4 text-sm text-accent" role="status">
          {notice}
        </p>
      ) : null}

      {watchlist.length === 0 ? (
        <div className="mt-12 rounded-lg border border-dashed border-line px-6 py-20 text-center">
          <p className="text-lg font-medium text-fg">Your radar is quiet</p>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted">
            Add repos you want to follow from the gem list and they will show
            up here.
          </p>
          <div className="mt-6">
            <Button href="/#gems">Browse gems</Button>
          </div>
        </div>
      ) : (
        <>
          <p className="mt-6 font-mono text-xs text-muted">
            {watchlist.length} {watchlist.length === 1 ? "repo" : "repos"} on the radar
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {watchedRepos.map((repo) => (
              <RepoCard key={repo.slug} repo={repo} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
