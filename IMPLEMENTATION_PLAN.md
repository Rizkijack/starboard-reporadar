# Starboard Reporadar - Implementation Plan

> **Goal:** Bangun website profesional berbahasa Inggris untuk mengkurasi repository GitHub "hidden gems" - landing page dengan tabel/bagan sortable, halaman detail per repo, fitur watchlist (localStorage), arsitektur Zero-Database, dengan estetika minimalis bertema radar.

**Architecture:** Next.js 15 App Router (Server Components sebagai default, Client Components hanya untuk interaktivitas: tabel, watchlist, toggle). Zero-Database: data sumber berada di file JSON terkurasi di `data/repos/`, metrik live (stars, forks, bahasa) disinkronkan dari GitHub REST API oleh script build ke `data/generated/gh-stats.json`. Situs tetap fully static/SSG setelah build.

**Tech Stack:** Next.js 15 + TypeScript + Tailwind CSS v4 (`@tailwindcss/postcss`) + Motion (`motion/react`) + Phosphor Icons (`@phosphor-icons/react`) + Geist Sans & Geist Mono via `next/font`.

---

## 1. Design Read (dari skill design-taste-frontend)

> Reading this as: curated GitHub discovery platform for technical/developer audience, with a precision-instrument radar aesthetic, leaning toward Tailwind v4 + Geist + restrained motion.

**Dials:** `DESIGN_VARIANCE: 6` (asimetri ringan, split hero) · `MOTION_INTENSITY: 4` (entry reveal, radar sweep halus, tanpa scroll-hijack) · `VISUAL_DENSITY: 5` (tabel data padat, sisa halaman bernafas).

**Konsep visual "Starboard Reporadar":** radar kapal di malam hari. Dark-first (deep ink blue `#0A0F14`), grid polar halus, radial sweep lambat di hero, blips = repo ditemukan. Light mode tetap disediakan (toggle, `prefers-color-scheme`).

**Aturan keras (dari skill):**
- ZERO em-dash (`—`) dan en-dash (`–`) di semua teks; pakai hyphen/period.
- Tanpa Inter/Roboto/Lucide; pakai Geist + Geist Mono + Phosphor (satu keluarga).
- Radius konsisten: 10px card/table, 6px button, pill hanya untuk tag.
- Satu accent color dipakai konsisten di seluruh halaman: radar cyan `#4CC3FF` (dark) / `#0077B6` (light). Star icon memakai gold `#FBBF24` hanya untuk ikon bintang.
- No pure black `#000000`, no pure white `#FFFFFF`; gunakan off-black/off-white.
- `prefers-reduced-motion` wajib: semua animasi collapse ke statis.
- Shadow hanya ultra-subtle (`0 2px 12px rgba(0,0,0,0.18)` dark / `rgba(15,23,42,0.06)` light).
- Table data adalah dashboard-adjacent: angka dan meta memakai Geist Mono.
- Eyebrow maks 1 per 3 section. Hero stack maks 4 elemen teks.

---

## 2. Struktur Proyek

```
StarboardReporadar/
├─ app/
│  ├─ layout.tsx                 # Root layout: fonts, WatchlistProvider, Navbar, Footer, ThemeScript
│  ├─ page.tsx                   # Home: Hero + stats + featured + categories + repo table
│  ├─ globals.css                # Tailwind v4 @theme tokens, radar background utilities
│  ├─ repos/[slug]/page.tsx      # Detail repo (generateStaticParams, generateMetadata)
│  ├─ watchlist/page.tsx         # Watchlist pengguna (client page)
│  ├─ about/page.tsx             # Metodologi kurasi
│  ├─ not-found.tsx
│  └─ sitemap.ts / robots.ts
├─ components/
│  ├─ layout/Navbar.tsx          # Sticky nav, theme toggle, watchlist link + counter badge
│  ├─ layout/Footer.tsx
│  ├─ home/Hero.tsx              # Split hero + RadarSweep
│  ├─ home/RadarSweep.tsx        # SVG radar (concentric rings, sweep line, blips) - client, reduced-motion aware
│  ├─ home/StatsStrip.tsx        # Agregat (total repos, stars, categories)
│  ├─ home/FeaturedGrid.tsx      # Bento grid 5 repo unggulan
│  ├─ home/CategoryIndex.tsx     # Grid kategori dengan jumlah repo
│  ├─ home/RepoTable.tsx         # CLIENT: tabel sortable + search + filter kategori
│  ├─ repo/RepoCard.tsx          # Kartu dipakai FeaturedGrid & Watchlist
│  ├─ repo/RepoDetail.tsx        # Layout detail: header, stats, highlights, tech, images
│  ├─ repo/StatItem.tsx
│  ├─ repo/WatchButton.tsx       # CLIENT: toggle watchlist (dipakai card + detail)
│  ├─ watchlist/WatchlistProvider.tsx  # CLIENT: React context + localStorage
│  ├─ watchlist/WatchlistPage.tsx      # CLIENT: daftar, export/import JSON, empty state
│  ├─ ui/Button.tsx, ui/Badge.tsx, ui/Tag.tsx, ui/SectionHeader.tsx, ui/ThemeToggle.tsx
│  └─ ui/Reveal.tsx              # CLIENT: wrapper whileInView stagger (motion/react)
├─ lib/
│  ├─ types.ts                   # Semua interface data
│  ├─ data.ts                    # Baca data/repos/*.json + gh-stats.json, merge jadi Repo[]
│  ├─ format.ts                  # formatNumber (1.2k), formatDate, timeAgo
│  └─ constants.ts               # Kategori + warna aksennya, z-index scale
├─ data/
│  ├─ site.json                  # Nama situs, tagline, featured slugs, hero stats, social links
│  ├─ repos/*.json               # SATU FILE PER REPO (kurasi manual) - lihat schema §3
│  └─ generated/gh-stats.json    # Output script sync (di-commit sebagai cache)
├─ scripts/
│  └─ sync-github.mjs            # Sinkronisasi metrik dari GitHub API
├─ public/
│  └─ repos/{slug}/              # logo.png + screenshot.png per repo (ditempatkan manual)
├─ package.json  tsconfig.json  next.config.ts  postcss.config.mjs  .gitignore  README.md
├─ IMPLEMENTATION_PLAN.md        # Dokumen ini: blueprint teknis (source of truth)
└─ WORKFLOW.md                   # Alur pengerjaan: fase, aturan commit, definisi done
```

---

## 3. Schema Data (Zero-Database)

### `data/repos/{slug}.json` - konten kurasi (sumber kebenaran konten)

```json
{
  "slug": "listmonk",
  "name": "Listmonk",
  "fullName": "knadh/listmonk",
  "tagline": "Self-hosted newsletter & mailing list manager",
  "description": "Paragraf 2-4 kalimat: apa yang repo lakukan, mengapa menarik, siapa target user.",
  "category": "communication",
  "featured": true,
  "tags": ["self-hosted", "newsletter", "go"],
  "highlights": ["Single binary deployment", "Built-in template editor", "Fast Postgres-backed queue"],
  "techStack": ["Go", "PostgreSQL", "Vue"],
  "links": { "website": "https://listmonk.app", "docs": "https://listmonk.app/docs", "demo": "" },
  "images": { "logo": "/repos/listmonk/logo.png", "screenshot": "/repos/listmonk/screenshot.png" },
  "related": ["umami", "n8n"],
  "curatorNote": "2-3 kalimat personal kenapa repo ini layak dipantau.",
  "publishedAt": "2026-07-01"
}
```

### `data/generated/gh-stats.json` - output script (metrik, overwritten tiap sync)

```json
{
  "knadh/listmonk": {
    "stars": 67500, "forks": 3800, "openIssues": 120, "language": "Go",
    "license": "AGPL-3.0", "createdAt": "2020-03-02", "updatedAt": "2026-08-01",
    "topics": ["go", "self-hosted"], "ownerAvatar": "https://avatars...", "archived": false
  }
}
```

### Kategori (lib/constants.ts)

`developer-tools` · `self-hosting` · `data-ai` · `productivity` · `communication` · `design` · `backend` · `frontend` - masing-masing punya label, deskripsi singkat, dan warna aksen pastel (dark-mode aware).

---

## 4. Script `scripts/sync-github.mjs`

**Behavior:**
1. Scan `data/repos/*.json`, kumpulkan `fullName` unik.
2. Fetch `GET https://api.github.com/repos/{fullName}` (tanpa token: 60 req/jam, cukup untuk 30-50 repo; bila env `GITHUB_TOKEN` ada, otomatis terpakai untuk 5000 req/jam).
3. Ambil field: `stargazers_count`, `forks_count`, `open_issues_count`, `language`, `license.spdx_id`, `created_at`, `updated_at`, `topics`, `owner.avatar_url`, `archived`.
4. Rate-limit friendly: delay 500ms antar request, retry 2x saat 403/5xx, abort dan tetap pakai cache lama bila gagal.
5. Hitung derived field: `momentum` (stars / umur bulan) untuk sorting tabel.
6. Tulis `data/generated/gh-stats.json` + print summary ke console.

**Run:** `npm run sync:gh` (prebuild hook: `"prebuild": "node scripts/sync-github.mjs"`).

**Catatan:** gambar (logo, screenshot) tetap ditempatkan manual ke `public/repos/{slug}/` - tidak otomatis diunduh. Untuk repo yang belum punya aset, komponen render fallback: placeholder radial-gradient + inisial nama repo (bukan picsum random, biar konsisten dengan estetika).

---

## 5. Halaman & Komponen Kunci

### 5.1 Home (`app/page.tsx`)
1. **Hero (split):** kiri = eyebrow "Curated GitHub discovery", H1 ≤ 6 kata (mis. "Hidden gems, tracked like radar."), subtext ≤ 20 kata, 1 primary CTA ("Browse gems") + 1 secondary ("How we curate"). Kanan = `RadarSweep` SVG. Hero top padding ≤ `pt-24`.
2. **StatsStrip:** agregat dari semua repo (total gems, total stars, categories count) - font mono, hairline dividers, tanpa kartu.
3. **FeaturedGrid:** bento asimetris 5 repo unggulan dari `site.json.featured` - 2 besar (screenshot) + 3 kecil (kartu kompak). Cell count = 5, tidak ada cell kosong.
4. **CategoryIndex:** grid 2 kolom kategori dengan jumlah repo + aksen warna masing-masing.
5. **RepoTable (client):** kolom = Repo (logo+nama+tagline), Category (tag), Language, Stars (sortable), Momentum (sortable), Updated (sortable), Watch button. Fitur: search input (nama/tag), filter pill kategori, sorting klik header (asc/desc), state kosong elegan ("No repos match your filters"). Mobile: collapse ke kartu list. Data di-pass dari server component (sudah di-merge), sorting/filter murni client-side (jumlah data kecil, tanpa backend).
6. **CTA bawah + Footer.**

### 5.2 Detail Repo (`app/repos/[slug]/page.tsx`)
- `generateStaticParams()` dari semua slugs; `generateMetadata()` (title, description, OG image dari screenshot).
- Layout: breadcrumb back, header (logo + nama + fullName + tag + WatchButton), stat grid 2x3 (Stars, Forks, Open issues, Language, License, Updated - font mono), screenshot utama (16:9, `next/image`, priority untuk LCP), section "Why it stands out" (highlights checklist ikon Phosphor), tech stack (badge tags), curator note (blockquote editorial), links (GitHub/Website/Docs/Demo), related repos (3 kartu berdasarkan `related` + fallback kategori sama).
- `notFound()` bila slug tidak dikenal.

### 5.3 Watchlist (`app/watchlist/page.tsx`)
- Client page. Kosong: empty state terkurasi ("Your radar is quiet" + CTA ke home). Terisi: grid RepoCard + tombol "Export JSON" (download blob) & "Import JSON" (file input, merge by slug) + "Clear all" dengan konfirmasi inline.
- Badge counter di Navbar (jumlah item dari context).

### 5.4 About
- Metodologi kurasi: kriteria pemilihan (skor momentum, kualitas docs, maintenance aktif, "hidden gem" = stars rendah-ke-menengah tapi fitur bagus), alur review, disclaimer.

---

## 6. Watchlist (Zero-Database, localStorage)

- `WatchlistProvider` (client): `useState<string[]>` diinisialisasi dari `localStorage.getItem("sb-radar-watchlist")`, persist via `useEffect` pada perubahan; API: `watchlist`, `isWatched(slug)`, `toggle(slug)`, `clear()`, `importSlugs([])`.
- Hydration-safe: render counter/toggle state hanya setelah `mounted` (guard `useEffect`), supaya tidak mismatch SSR.
- Dipakai di: `WatchButton` (card & detail), tabel (kolom aksi), halaman watchlist, navbar badge.

---

## 7. Desain System (globals.css, Tailwind v4)

```css
@import "tailwindcss";
@custom-variant dark (&:where(.dark, .dark *));   /* class-based dark mode via ThemeToggle */

@theme {
  --font-sans: var(--font-geist-sans), sans-serif;
  --font-mono: var(--font-geist-mono), monospace;
  --color-ink-950: #0A0F14;   /* page bg dark */
  --color-ink-900: #0D141C;   /* surface dark */
  --color-ink-800: #111B26;   /* elevated dark */
  --color-line-dark: rgba(148, 190, 233, 0.09);
  --color-fog-100: #E8EEF5;   /* text dark */
  --color-fog-400: #8FA3B8;   /* muted dark */
  --color-radar-400: #4CC3FF; /* accent */
  --color-radar-600: #0077B6; /* accent light */
  --color-star: #FBBF24;
  /* light mode set: bg #F7F8FA, surface #FFFFFF, line rgba(15,23,42,0.08), text #1A2430 */
}
```
- Background utility `.radar-bg`: radial-gradient halus + grid polar SVG (fixed, `pointer-events-none`, opacity 0.04-0.06) hanya di hero; grain/halos tidak menempel di scrolling container.
- Animasi: `radar-sweep` (rotate 8s linear infinite, transform-only), entry reveal `Reveal` component (motion/react `whileInView`, `translateY(12px)` + opacity, 600ms, stagger 80ms), semua digate `prefers-reduced-motion`.
- Tabel: header sticky, row hover `background: rgba(148,190,233,0.04)`, hairline `border-b` antar row, angka mono kanan-align.

---

## 8. Verification

| Check | Command / Action | Expected |
|---|---|---|
| Sync data | `npm run sync:gh` | gh-stats.json terisi semua fullName, summary print |
| Lint | `npm run lint` | 0 error |
| Build SSG | `npm run build` | Semua route static, repos/[slug] N halaman |
| Runtime | `npm run dev` + manual | Tabel sort/search/filter jalan, toggle watchlist persist setelah refresh, export/import jalan, dark/light toggle tanpa flash |
| Detail | Buka 2-3 `/repos/*` | Metadata title benar, notFound untuk slug asing |
| Lighthouse | `npx @lhci/cli` atau Chrome DevTools | LCP < 2.5s, CLS < 0.1, a11y ≥ 95 |
| Desain audit | Pre-flight checklist skill (zero em-dash, kontras, satu accent, reduced-motion) | Semua terpenuhi |

---

## 9. Risiko & Mitigasi

| Risiko | Mitigasi |
|---|---|
| GitHub API rate-limit tanpa token (60/jam) | Cache di repo (`gh-stats.json` di-commit), sync tetap jalan meski gagal (pakai cache), env `GITHUB_TOKEN` opsional untuk 5000/jam |
| Gambar repo tidak tersedia | Fallback radial-gradient + inisial; screenshot diunduh manual saat kurasi |
| Watchlist hilang saat ganti browser | Disengaja (Zero-Database); mitigasi via export/import JSON |
| Data stale setelah publish | `prebuild` hook otomatis re-sync sebelum setiap build |
| Mismatch hydration localStorage | Guard `mounted` pada semua client state yang baca localStorage |

## 10. Open Questions (asumsi yang dipakai)

- **Dark-first** dengan toggle light: dipilih karena konsep radar paling kuat di dark; light mode tetap diuji penuh.
- **Konten seed**: 6 repo contoh nyata saat fase 1, diperluas ke 10-15 saat fase 7. Kurasi final repo mana yang "hidden gem" ada di tangan user.
- **Tanpa chart library**: bagan/momentum cukup pakai angka mono + sparkline sederhana (SVG inline) - tidak menambah dependency berat (recharts dll) untuk scope ini.
- **Deploy target**: Vercel (build statis, `output: "export"` tidak diperlukan; tetap SSG via generateStaticParams).

---

## 11. Referensi Alur Pengerjaan

- Alur pengerjaan (fase, urutan, aturan commit, definisi done) ada di **`WORKFLOW.md`** di root project yang sama.
- Dokumen ini adalah source of truth untuk arsitektur, schema data, dan spesifikasi komponen.
