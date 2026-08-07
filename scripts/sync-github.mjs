// Placeholder for Fase 1. Real implementation: fetch GitHub API stats per repo.
import { readdirSync } from "node:fs";
import { join } from "node:path";

const reposDir = join(process.cwd(), "data", "repos");

function collectFullNames() {
  if (!reposDir || !readdirSync(reposDir, { recursive: true })) return [];
  return [];
}

console.log(`[sync:gh] found ${collectFullNames().length} repos (placeholder)`);
