// Sinkronisasi metrik repo dari GitHub REST API ke data/generated/gh-stats.json
// Usage: node scripts/sync-github.mjs
// Opsional: set GITHUB_TOKEN di env untuk rate limit 5000/jam (default 60/jam).
import { readdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const REPOS_DIR = join(process.cwd(), "data", "repos");
const OUT_PATH = join(process.cwd(), "data", "generated", "gh-stats.json");
const API = "https://api.github.com/repos";
const TOKEN = process.env.GITHUB_TOKEN ?? "";
const DELAY_MS = 500;
const RETRIES = 2;

function collectFullNames() {
  if (!existsSync(REPOS_DIR)) return [];
  return readdirSync(REPOS_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => {
      try {
        const data = JSON.parse(readFileSync(join(REPOS_DIR, f), "utf8"));
        return data.fullName;
      } catch {
        return null;
      }
    })
    .filter((v) => typeof v === "string" && v.includes("/"));
}

function loadCache() {
  if (!existsSync(OUT_PATH)) return {};
  try {
    return JSON.parse(readFileSync(OUT_PATH, "utf8"));
  } catch {
    return {};
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchRepo(fullName) {
  const headers = {
    Accept: "application/vnd.github+json",
    "User-Agent": "starboard-reporadar-sync",
  };
  if (TOKEN) headers.Authorization = `Bearer ${TOKEN}`;

  for (let attempt = 0; attempt <= RETRIES; attempt++) {
    const res = await fetch(`${API}/${fullName}`, { headers });
    if (res.status === 200) {
      const data = await res.json();
      return {
        stars: data.stargazers_count ?? 0,
        forks: data.forks_count ?? 0,
        openIssues: data.open_issues_count ?? 0,
        language: data.language ?? null,
        license: data.license?.spdx_id ?? null,
        createdAt: data.created_at ?? null,
        updatedAt: data.updated_at ?? null,
        topics: data.topics ?? [],
        ownerAvatar: data.owner?.avatar_url ?? "",
        archived: !!data.archived,
      };
    }
    if (res.status === 403 || res.status === 429) {
      // Rate limit: keep cache, stop gracefully.
      console.warn(`[sync:gh] rate limited on ${fullName}, keeping cached data`);
      return null;
    }
    if (res.status === 404) {
      console.warn(`[sync:gh] 404 not found: ${fullName}`);
      return null;
    }
    console.warn(`[sync:gh] ${res.status} on ${fullName}, retry ${attempt + 1}/${RETRIES}`);
    await sleep(DELAY_MS * (attempt + 2));
  }
  return null;
}

async function main() {
  const fullNames = [...new Set(collectFullNames())];
  console.log(`[sync:gh] ${fullNames.length} repos found`);

  const cache = loadCache();
  const out = { ...cache };
  let ok = 0;

  for (const fullName of fullNames) {
    const stats = await fetchRepo(fullName);
    if (stats) {
      out[fullName] = stats;
      ok++;
      console.log(`[sync:gh] ${fullName}: ${stats.stars} stars`);
    }
    await sleep(DELAY_MS);
  }

  writeFileSync(OUT_PATH, JSON.stringify(out, null, 2) + "\n", "utf8");
  console.log(`[sync:gh] done, ${ok}/${fullNames.length} updated, cache kept for the rest`);
}

main().catch((err) => {
  console.error("[sync:gh] failed:", err.message);
  process.exit(1);
});
