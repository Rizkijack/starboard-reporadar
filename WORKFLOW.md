# Starboard Reporadar - Workflow Management

> **Fungsi dokumen ini:** alur pengerjaan (workflow) proyek Starboard Reporadar. Dipakai oleh agent lain sebagai referensi sinkron: apa yang sedang dikerjakan, urutan fase, aturan commit, dan definisi done per fase.

**Dokumen teknis pendamping:** baca `IMPLEMENTATION_PLAN.md` untuk arsitektur, schema data, dan spesifikasi komponen. Dokumen ini fokus ke cara mengerjakan, bukan apa yang dibangun.

---

## 1. Prinsip Kerja

- **Urutan fase wajib diikuti.** Jangan lompat fase.
- **Satu fase = satu area kerja** (data, desain, halaman, fitur). Setiap fase berakhir dengan **commit**.
- **Definisi Done (DoD) per fase** harus terpenuhi sebelum pindah ke fase berikutnya.
- **Zero-Database:** semua data di file JSON di `data/`. Tidak ada database, tidak ada backend API.
- **Test sebelum lanjut:** setelah setiap fase, jalankan `npm run lint` dan verifikasi `npm run build` berjalan (kecuali fase yang tidak menyentuh kode build).

---

## 2. Peta Fase

| Fase | Nama | Output utama | Commit |
|---|---|---|---|
| 0 | Setup Proyek | Next.js + Tailwind v4 ter-scaffold, deps terpasang | `chore: scaffold Next.js + Tailwind v4 project` |
| 1 | Fondasi Data & Types | `lib/`, `data/`, script sync GitHub | `feat: data layer, repo schema, github sync script` |
| 2 | Desain System & Layout Shell | tokens CSS, layout.tsx, Navbar, Footer, ui/ | `feat: design tokens, layout shell, navbar footer` |
| 3 | Home Page | Hero radar, Stats, Featured, Categories, RepoTable | `feat: home page with radar hero, bento grid, sortable table` |
| 4 | Detail Repo | `/repos/[slug]` + SSG + metadata | `feat: repo detail pages with SSG metadata` |
| 5 | Watchlist | Provider localStorage, halaman watchlist, export/import | `feat: localStorage watchlist with export/import` |
| 6 | About, SEO, Polish | about, sitemap, robots, not-found, a11y/perf | `feat: about, seo, a11y and perf polish` |
| 7 | Konten & Production Prep | 10-15 repo, README, build final | `chore: final content and v1.0.0 release` |

---

## 3. Detail Task per Fase

### Fase 0 - Setup Proyek
1. `npx create-next-app@latest .` dengan: TypeScript, App Router, Tailwind, ESLint, **src dir = NO**, import alias `@/*`.
2. Install dependency: `npm install motion @phosphor-icons/react`.
3. Setup `next/font` (Geist Sans + Geist Mono) di `app/layout.tsx`.
4. Pastikan `postcss.config.mjs` memakai `@tailwindcss/postcss`.
5. Buat struktur folder: `components/ lib/ data/ scripts/ public/`.
6. **DoD:** `npm run dev` jalan, halaman default muncul, lint pass.

### Fase 1 - Fondasi Data & Types
1. `lib/types.ts`: interface `Repo`, `GhStats`, `SiteConfig`, `Category`.
2. `lib/constants.ts`: daftar kategori + warna aksen. `lib/format.ts`: `formatNumber`, `formatDate`, `timeAgo`.
3. `lib/data.ts`: baca `data/repos/*.json` via `fs`, merge `gh-stats.json`, export `getRepos()`, `getRepoBySlug()`, `getRelated()`.
4. Buat `data/site.json` + 6 repo seed nyata (Listmonk, Umami, NocoDB, Coolify, PocketBase, Documenso).
5. `scripts/sync-github.mjs` + script `"sync:gh"` di package.json.
6. Jalankan `npm run sync:gh`, pastikan `data/generated/gh-stats.json` terisi.
7. **DoD:** data ter-load tanpa error, sync menghasilkan file stats.

### Fase 2 - Desain System & Layout Shell
1. `app/globals.css`: `@theme` tokens (palette di IMPLEMENTATION_PLAN §7), `.radar-bg`, animasi sweep.
2. `app/layout.tsx`: fonts, `<html lang="en" class="dark">`, ThemeScript, `WatchlistProvider`, Navbar, Footer.
3. `components/ui/`: `Button`, `Badge`, `Tag`, `SectionHeader`, `ThemeToggle`, `Reveal`.
4. Navbar: logo mark radar, nav satu baris, height ≤ 64px, border-bottom hairline. Footer minimal.
5. **DoD:** dark/light toggle jalan tanpa flash, layout konsisten di semua halaman (cek di 2-3 halaman dummy).

### Fase 3 - Home Page
1. `components/home/RadarSweep.tsx`: SVG radar (rings, sweep, blips), `useReducedMotion`.
2. `Hero` split (kiri teks, kanan radar), `StatsStrip`, `FeaturedGrid` (bento 5 cell), `CategoryIndex`.
3. `RepoTable` (client): sorting, search, filter kategori, empty state, mobile collapse.
4. Section CTA bawah. Audit copy: zero em-dash, kontras, satu accent.
5. **DoD:** semua section render, tabel interaktif penuh, Lighthouse visual ok.

### Fase 4 - Detail Repo
1. `app/repos/[slug]/page.tsx` + `RepoDetail` + `StatItem` + `WatchButton`.
2. `generateStaticParams`, `generateMetadata` (title, description, OG).
3. Related repos + curator note.
4. **DoD:** semua slug repo punya halaman statis, notFound untuk slug asing, metadata benar.

### Fase 5 - Watchlist
1. `WatchlistProvider` (hydrasi-safe), integrasi `WatchButton` ke card/tabel/detail, badge counter navbar.
2. `app/watchlist/page.tsx` + `WatchlistPage`: empty state, export/import JSON, clear with confirm.
3. **DoD:** watchlist persist setelah refresh, export/import berfungsi, counter akurat.

### Fase 6 - About, SEO, Polish
1. `app/about/page.tsx` (metodologi kurasi), `sitemap.ts`, `robots.ts`, `not-found.tsx`.
2. Audit desain (pre-flight checklist): zero em-dash, kontras CTA, dark/light, reduced-motion, eyebrow count, mobile collapse.
3. Performance: `next/image` dimensi benar, lazy-load below-fold, priority hanya hero.
4. **DoD:** Lighthouse LCP < 2.5s, CLS < 0.1, a11y ≥ 95.

### Fase 7 - Konten & Production Prep
1. Tambah 4-8 repo lagi (total 10-15) + screenshot nyata di `public/repos/{slug}/`.
2. `npm run sync:gh` final, `npm run lint`, `npm run build` (semua halaman SSG).
3. README: cara menambah repo baru, cara sync, cara deploy.
4. Commit final + tag `v1.0.0`.
5. **DoD:** build sukses, semua repo tampil, README lengkap.

---

## 4. Aturan Commit

- Commit **setiap akhir fase** (lihat tabel §2), bukan di tengah task.
- Format: `type: deskripsi singkat` (chore/feat/fix/style/refactor/docs).
- Pesan commit ditulis dalam Bahasa Inggris (konsisten dengan konten situs).
- **Jangan commit** file sementara, `node_modules`, atau hasil build lokal.

---

## 5. Sinkronisasi Antar Agent

- **Status pengerjaan** ditulis di dokumen ini (section §6 Status) sebelum/ketika agent lain mulai.
- Agent lain **wajib baca** `WORKFLOW.md` dulu (untuk status & fase) lalu `IMPLEMENTATION_PLAN.md` (untuk detail teknis) sebelum mengerjakan.
- Perubahan schema data atau arsitektur **harus** dicatat di `IMPLEMENTATION_PLAN.md` juga.

---

## 6. Status Pengerjaan

> Diisi manual oleh agent yang sedang mengerjakan. Format: fase, progress, blocker.

- **Fase aktif:** (kosong - belum dimulai, menunggu scaffold)
- **Progress:** 0%
- **Blocker:** -
- **Catatan:** -

---

## 7. Verifikasi Akhir (sebelum rilis)

Jalankan seluruh checklist di `IMPLEMENTATION_PLAN.md` §8 (Verification). Semua harus terpenuhi.
