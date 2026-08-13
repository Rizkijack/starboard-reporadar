"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowDown, ArrowUp, MagnifyingGlass, Star } from "@/components/ui/icons";
import { RepoLogo } from "@/components/repo/RepoCard";
import { WatchButton } from "@/components/repo/WatchButton";
import { CategoryTag } from "@/components/ui/Badge";
import { CATEGORIES, CATEGORY_MAP } from "@/lib/constants";
import { formatNumber, momentum, timeAgo } from "@/lib/format";
import type { RepoWithStats } from "@/lib/types";

type SortKey = "stars" | "momentum" | "updated" | "name";

const SORTS: Array<{ key: SortKey; label: string; className?: string }> = [
  { key: "stars", label: "Stars" },
  { key: "momentum", label: "Momentum" },
  { key: "updated", label: "Updated" },
];

export function RepoTable({ repos }: { repos: RepoWithStats[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [sortKey, setSortKey] = useState<SortKey>("stars");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  // Date.now()-derived cells (Updated, Momentum) are frozen at null until
  // mount so the SSR markup and the hydration render match exactly; the
  // real values appear right after hydration.
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    const syncCategory = () => {
      const params = new URLSearchParams(window.location.search);
      const catParam = params.get("category");
      if (catParam && CATEGORIES.some((c) => c.id === catParam)) {
        setCategory(catParam);
      }
    };
    syncCategory();
    window.addEventListener("popstate", syncCategory);
    const raf = requestAnimationFrame(() => setNow(Date.now()));
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("popstate", syncCategory);
    };
  }, []);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let rows = repos.filter((r) => {
      const matchCat = category === "all" || r.category === category;
      const matchQuery =
        !q ||
        r.name.toLowerCase().includes(q) ||
        r.tagline.toLowerCase().includes(q) ||
        r.fullName.toLowerCase().includes(q) ||
        r.tags.some((t) => t.toLowerCase().includes(q));
      return matchCat && matchQuery;
    });

    rows = [...rows].sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      switch (sortKey) {
        case "stars":
          return ((a.stats?.stars ?? 0) - (b.stats?.stars ?? 0)) * dir;
        case "momentum": {
          const ma = momentum(a.stats?.stars, a.stats?.createdAt);
          const mb = momentum(b.stats?.stars, b.stats?.createdAt);
          return (ma - mb) * dir;
        }
        case "updated": {
          const ta = a.stats?.updatedAt ?? "";
          const tb = b.stats?.updatedAt ?? "";
          return ta.localeCompare(tb) * dir;
        }
        case "name":
          return a.name.localeCompare(b.name) * dir;
      }
    });

    return rows;
  }, [repos, query, category, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "name" ? "asc" : "desc");
    }
  }

  function SortHeader({ sort }: { sort: (typeof SORTS)[number] }) {
    const active = sortKey === sort.key;
    return (
      <th
        scope="col"
        className={`px-4 py-3 text-right font-medium ${sort.key === "stars" ? "w-[100px]" : sort.key === "momentum" ? "w-[110px]" : "w-[100px]"}`}
        aria-sort={
          active ? (sortDir === "asc" ? "ascending" : "descending") : "none"
        }
      >
        <button
          type="button"
          onClick={() => toggleSort(sort.key)}
          className={`inline-flex items-center gap-1 text-xs uppercase tracking-wide transition-colors hover:text-fg ${
            active ? "text-accent" : "text-muted"
          }`}
        >
          {sort.label}
          {active ? (
            sortDir === "asc" ? (
              <ArrowUp size={12} weight="bold" aria-hidden="true" />
            ) : (
              <ArrowDown size={12} weight="bold" aria-hidden="true" />
            )
          ) : null}
        </button>
      </th>
    );
  }

  return (
    <section id="gems" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
            All gems
          </h2>
          <p className="mt-3 text-base leading-relaxed text-muted">
            Every repo on the radar, ranked by what moves.
          </p>
        </div>
        <label className="relative block w-full sm:w-72">
          <span className="sr-only">Search repos</span>
          <MagnifyingGlass
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, tag, or repo"
            className="h-10 w-full rounded-md border border-line bg-surface pl-9 pr-3 text-sm text-fg placeholder:text-muted focus:border-accent focus:outline-none"
          />
        </label>
      </div>

      {/* Category filter pills */}
      <div className="mb-6 flex flex-wrap gap-2">
        <FilterPill
          active={category === "all"}
          onClick={() => setCategory("all")}
          label="All"
        />
        {CATEGORIES.map((cat) => (
          <FilterPill
            key={cat.id}
            active={category === cat.id}
            onClick={() => setCategory(cat.id)}
            label={cat.label}
            accent={cat.accent}
          />
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden overflow-x-auto rounded-lg border border-line md:block">
        <table className="w-full table-fixed border-collapse text-sm">
          <thead className="border-b border-line bg-surface-elevated/60">
            <tr>
              <th scope="col" className="w-[40%] px-4 py-3 text-left font-medium">
                <button
                  type="button"
                  onClick={() => toggleSort("name")}
                  className="inline-flex items-center gap-1 text-xs uppercase tracking-wide text-muted transition-colors hover:text-fg"
                >
                  Repo
                  {sortKey === "name" ? (
                    sortDir === "asc" ? (
                      <ArrowUp size={12} weight="bold" aria-hidden="true" />
                    ) : (
                      <ArrowDown size={12} weight="bold" aria-hidden="true" />
                    )
                  ) : null}
                </button>
              </th>
              <th scope="col" className="w-[120px] px-4 py-3 text-left font-medium">
                <span className="text-xs uppercase tracking-wide text-muted">
                  Category
                </span>
              </th>
              <th scope="col" className="w-[100px] px-4 py-3 text-left font-medium">
                <span className="text-xs uppercase tracking-wide text-muted">
                  Language
                </span>
              </th>
              {SORTS.map((s) => (
                <SortHeader key={s.key} sort={s} />
              ))}
              <th scope="col" className="w-[48px] px-4 py-3 text-right">
                <span className="sr-only">Watch</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {filtered.map((repo) => {
              const cat = CATEGORY_MAP[repo.category];
              return (
                <tr
                  key={repo.slug}
                  className="transition-colors hover:bg-accent-soft/20"
                >
                  <td className="max-w-0 px-4 py-3">
                    <Link
                      href={`/repos/${repo.slug}`}
                      className="group flex items-center gap-3"
                    >
                      <RepoLogo repo={repo} size={32} />
                      <div className="min-w-0">
                        <p className="font-medium text-fg group-hover:text-accent">
                          {repo.name}
                        </p>
                        <p className="truncate text-xs text-muted">
                          {repo.tagline}
                        </p>
                      </div>
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <CategoryTag label={cat.label} accent={cat.accent} />
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-muted">
                    {repo.stats?.language ?? "-"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="inline-flex items-center gap-1 font-mono text-fg">
                      <Star
                        size={13}
                        weight="fill"
                        className="text-star"
                        aria-hidden="true"
                      />
                      {formatNumber(repo.stats?.stars)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-xs text-muted">
                    {now
                      ? formatNumber(
                          momentum(
                            repo.stats?.stars,
                            repo.stats?.createdAt,
                            now
                          )
                        )
                      : "-"}
                    <span className="sr-only"> stars per month</span>
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-xs text-muted">
                    {now ? timeAgo(repo.stats?.updatedAt, now) : "-"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <WatchButton slug={repo.slug} compact />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile: card list */}
      <ul className="space-y-3 md:hidden">
        {filtered.map((repo) => {
          const cat = CATEGORY_MAP[repo.category];
          return (
            <li
              key={repo.slug}
              className="rounded-lg border border-line bg-surface p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <Link
                  href={`/repos/${repo.slug}`}
                  className="flex items-center gap-3"
                >
                  <RepoLogo repo={repo} size={36} />
                  <div>
                    <p className="font-medium text-fg">{repo.name}</p>
                    <p className="text-xs text-muted">{repo.tagline}</p>
                  </div>
                </Link>
                <WatchButton slug={repo.slug} compact />
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted">
                <CategoryTag label={cat.label} accent={cat.accent} />
                <span className="font-mono">
                  {repo.stats?.language ?? "-"}
                </span>
                <span className="inline-flex items-center gap-1 font-mono">
                  <Star size={12} weight="fill" className="text-star" aria-hidden="true" />
                  {formatNumber(repo.stats?.stars)}
                </span>
                <span className="font-mono">
                  {now ? timeAgo(repo.stats?.updatedAt, now) : "-"}
                </span>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Empty state */}
      {filtered.length === 0 ? (
        <div className="rounded-lg border border-dashed border-line px-6 py-16 text-center">
          <p className="text-base font-medium text-fg">No repos match your filters</p>
          <p className="mt-1 text-sm text-muted">
            Try a different search term or clear the category filter.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setCategory("all");
            }}
            className="mt-4 text-sm font-medium text-accent hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : null}
    </section>
  );
}

function FilterPill({
  active,
  onClick,
  label,
  accent,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  accent?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-xs font-medium transition-colors ${
        active
          ? "border-accent/50 bg-accent-soft text-accent"
          : "border-line bg-surface text-muted hover:text-fg"
      }`}
    >
      {accent ? (
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: accent }}
          aria-hidden="true"
        />
      ) : null}
      {label}
    </button>
  );
}
