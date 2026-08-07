# Starboard Reporadar

A hand-curated radar of undervalued GitHub repositories with real potential. Browse, sort, filter, and watch the gems worth following. Zero database: all content lives in JSON files, and live metrics (stars, forks, language) are pulled from the GitHub API at build time.

## Tech stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4
- Motion (scroll reveals, reduced-motion aware)
- Phosphor Icons
- Geist Sans / Geist Mono via `next/font`

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project layout

```
app/                Routes: home, /repos/[slug], /watchlist, /about, sitemap, robots
components/         UI, layout, home, repo, watchlist components
lib/                Types, data layer, formatting, constants
data/repos/*.json   Curated repo content, one file per repo
data/site.json      Site config and featured slugs
data/generated/     GitHub stats cache (committed, refreshed on build)
scripts/            GitHub sync script
public/repos/{slug} Repo logo + screenshot images
```

## Adding a new repo

1. Create `data/repos/<slug>.json` following the schema in `IMPLEMENTATION_PLAN.md` (name, fullName, tagline, description, category, highlights, techStack, links, images, related, curatorNote).
2. Drop `logo.png` and `screenshot.png` into `public/repos/<slug>/`. If you do not have them yet, the site renders a gradient fallback with the repo initials.
3. Add the slug to `site.json.featured` if you want it featured on the home bento grid.
4. Run `npm run sync:gh` to fetch live metrics into `data/generated/gh-stats.json`.
5. Verify with `npm run lint` and `npm run build`.

## Syncing GitHub metrics

```bash
npm run sync:gh
```

The script reads every `fullName` in `data/repos/`, calls the GitHub API, and writes `data/generated/gh-stats.json`. It is rate-limit friendly (500 ms delay, retries, keeps the cache on failure) and runs automatically before every `next build` via the `prebuild` hook. Without a token you get 60 requests/hour, which covers ~50 repos. For the 5000/hour limit:

```bash
# .env.local (not committed)
GITHUB_TOKEN=ghp_your_token
```

## Deploying

The site is fully static after build (SSG via `generateStaticParams`), so any Node platform works. Recommended:

1. Push to GitHub.
2. Import the repo in Vercel.
3. Build command `npm run build`.

Set `GITHUB_TOKEN` in the hosting provider's environment variables to avoid rate limits during the prebuild sync.

## Docs for contributors

- `IMPLEMENTATION_PLAN.md` - technical blueprint: architecture, data schema, design system, verification checklist.
- `WORKFLOW.md` - phase workflow, commit conventions, and definition of done per phase.
