import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import type { GhStats, Repo, RepoWithStats, SiteConfig } from "./types";

const DATA_DIR = join(process.cwd(), "data");
const REPOS_DIR = join(DATA_DIR, "repos");
const GH_STATS_PATH = join(DATA_DIR, "generated", "gh-stats.json");

function readJson<T>(path: string): T | null {
  try {
    return JSON.parse(readFileSync(path, "utf8")) as T;
  } catch {
    return null;
  }
}

let cachedRepos: RepoWithStats[] | null = null;
let cachedGhStats: Record<string, GhStats> | null = null;

export function getGhStats(): Record<string, GhStats> {
  if (!cachedGhStats) {
    cachedGhStats = readJson<Record<string, GhStats>>(GH_STATS_PATH) ?? {};
  }
  return cachedGhStats;
}

export function getRepos(): RepoWithStats[] {
  if (cachedRepos) return cachedRepos;

  const ghStats = getGhStats();
  const files = readdirSync(REPOS_DIR).filter((f) => f.endsWith(".json"));

  const parsed: Array<RepoWithStats | null> = files.map((file) => {
    const repo = readJson<Repo>(join(REPOS_DIR, file));
    if (!repo || !repo.slug) return null;
    return { ...repo, stats: ghStats[repo.fullName] };
  });

  const repos = parsed.filter((r): r is RepoWithStats => r !== null);

  repos.sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return a.name.localeCompare(b.name);
  });

  cachedRepos = repos;
  return repos;
}

export function getRepoBySlug(slug: string): RepoWithStats | undefined {
  return getRepos().find((r) => r.slug === slug);
}

export function getSiteConfig(): SiteConfig | null {
  return readJson<SiteConfig>(join(DATA_DIR, "site.json"));
}

export function getFeaturedRepos(limit = 5): RepoWithStats[] {
  const site = getSiteConfig();
  if (!site) return getRepos().filter((r) => r.featured).slice(0, limit);
  const order = site.featured;
  const bySlug = new Map(getRepos().map((r) => [r.slug, r]));
  const featured = order.map((slug) => bySlug.get(slug)).filter((r): r is RepoWithStats => !!r);
  // Fill remaining with other featured repos if the curated list is short.
  const extra = getRepos().filter((r) => r.featured && !order.includes(r.slug));
  return [...featured, ...extra].slice(0, limit);
}

export function getRelated(repo: RepoWithStats, limit = 3): RepoWithStats[] {
  const all = getRepos().filter((r) => r.slug !== repo.slug);
  const related = repo.related
    .map((slug) => all.find((r) => r.slug === slug))
    .filter((r): r is RepoWithStats => !!r);
  const sameCategory = all.filter(
    (r) => r.category === repo.category && !related.includes(r)
  );
  return [...related, ...sameCategory].slice(0, limit);
}

export function getCategoryCounts(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const repo of getRepos()) {
    counts[repo.category] = (counts[repo.category] ?? 0) + 1;
  }
  return counts;
}
