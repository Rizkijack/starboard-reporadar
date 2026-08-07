# Starboard Reporadar

A curated directory of GitHub "hidden gems": undervalued repositories with real potential, presented with a precision-instrument radar aesthetic. The landing page ships a sortable, searchable, filterable table of every curated repo, each repo gets its own detail page with live metrics and curator notes, and visitors can build a personal watchlist that persists in localStorage. The whole site runs on a zero-database architecture: curated content lives in plain JSON files, metrics are synced from the GitHub API at build time, and the output is fully static.

## Tech stack

- Next.js App Router (Server Components by default) + TypeScript
- Tailwind CSS v4
- Motion (scroll reveals, reduced-motion aware)
- Phosphor Icons
- Geist Sans and Geist Mono via `next/font`

Dark-first theme with a light mode toggle (class-based, flash-free via an inline theme script).

## How it works

Zero database. Three sources of truth:

1. `data/repos/{slug}.json` - one curated content file per repo, the single source of truth for content.
2. `data/generated/gh-stats.json` - live metrics (stars, forks, open issues, language, license, last update) synced from the GitHub REST API by `scripts/sync-github.mjs` and committed as a cache.
3. `public/repos/{slug}/` - `logo.png` and `screenshot.png` per repo, placed manually.

At build time, `lib/data.ts` merges the curated files with the metrics cache into a single `Repo[]` and every route is statically generated (SSG via `generateStaticParams`). The site has no backend and no runtime data fetching.

## Adding a new repo

1. Create `data/repos/{slug}.json` following the schema in `IMPLEMENTATION_PLAN.md`, section 3:

   - `slug` - URL slug, matches the file name
   - `name` - display name
   - `fullName` - GitHub `owner/repo`, used for the API sync
   - `tagline` - one-line summary
   - `description` - 2-4 sentence write-up
   - `category` - one of: `developer-tools`, `self-hosting`, `data-ai`, `productivity`, `communication`, `design`, `backend`, `frontend`
   - `featured` - boolean, whether it appears in the home bento grid
   - `tags` - string tags
   - `highlights` - 3-5 standout bullets shown on the detail page
   - `techStack` - technology badges
   - `links` - `{ website, docs, demo }`
   - `images` - `{ logo, screenshot }` paths under `/repos/{slug}/`
   - `related` - slugs of related repos
   - `curatorNote` - a short personal note on why it is worth watching
   - `publishedAt` - ISO date

2. Drop `logo.png` and `screenshot.png` into `public/repos/{slug}/`. Until images exist, the site renders a gradient fallback with the repo initials.
3. Run `npm run sync:gh` to fetch live metrics into `data/generated/gh-stats.json`.
4. Optionally add the slug to `featured` in `data/site.json` (max 5) to feature it on the home bento grid.

## Syncing GitHub metrics

```bash
npm run sync:gh
```

The script scans every `fullName` in `data/repos/`, calls the GitHub REST API, and rewrites `data/generated/gh-stats.json`. It is rate-limit friendly: 500 ms delay between requests, retries on 403/5xx, and it keeps the committed cache if the API fails. It also runs automatically before every `npm run build` via the `prebuild` hook.

Rate limits:

- 60 requests/hour unauthenticated (enough for tens of repos)
- 5000 requests/hour with `GITHUB_TOKEN` set

```bash
# .env.local (not committed)
GITHUB_TOKEN=ghp_your_token
```

The committed cache keeps the site working even when the API is exhausted or unreachable.

## Development

```bash
npm install
npm run dev       # local dev server
npm run lint      # ESLint
npm run build     # sync + static export
npm run start     # serve the production build
```

## Deploy

The site is fully static after build, so any Node platform works. On Vercel:

1. Import the repository.
2. Set the build command to `npm run build`.
3. No environment variables are required; `GITHUB_TOKEN` is optional and only used to raise the sync rate limit during the prebuild hook.

## Project structure

```
app/                Routes: home, /repos/[slug], /watchlist, /about, sitemap, robots
components/         Layout, home, repo, watchlist, and shared UI components
lib/                Types, data layer (merge + read), formatting, constants
data/repos/*.json   Curated repo content, one file per repo
data/site.json      Site config and featured slugs
data/generated/     GitHub stats cache (committed)
scripts/            GitHub sync script
public/repos/{slug} Repo logo + screenshot images
```

## Docs

- `IMPLEMENTATION_PLAN.md` - technical blueprint: architecture, data schema, design system, verification checklist.
- `WORKFLOW.md` - phase workflow and definition of done per phase.
