import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Star } from "@/components/ui/icons";
import { RepoLogo } from "@/components/repo/RepoCard";
import { CATEGORY_MAP } from "@/lib/constants";
import { formatNumber } from "@/lib/format";
import type { RepoWithStats } from "@/lib/types";

/**
 * Asymmetric bento: first two repos are large screenshot tiles,
 * remaining three are compact cards. Exactly 5 cells.
 */
export function FeaturedGrid({ repos }: { repos: RepoWithStats[] }) {
  if (repos.length === 0) return null;
  const [big1, big2, ...small] = repos;

  return (
    <section id="featured" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
      <div className="mb-8 max-w-2xl">
        <h2 className="text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
          Featured on the radar
        </h2>
        <p className="mt-3 text-base leading-relaxed text-muted">
          The picks we keep coming back to. Strong defaults, active maintenance,
          and a clear reason to exist.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {big1 ? <FeaturedTile repo={big1} large /> : null}
        {big2 ? <FeaturedTile repo={big2} large /> : null}
        <div className="flex flex-col gap-5">
          {small.slice(0, 3).map((repo) => (
            <CompactTile key={repo.slug} repo={repo} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedTile({ repo, large = false }: { repo: RepoWithStats; large?: boolean }) {
  const category = CATEGORY_MAP[repo.category];
  return (
    <Link
      href={`/repos/${repo.slug}`}
      className={`group relative flex flex-col justify-end overflow-hidden rounded-lg border border-line bg-surface ${
        large ? "min-h-[280px] lg:min-h-[340px]" : "min-h-[200px]"
      }`}
    >
      {repo.images.screenshot ? (
        <Image
          src={repo.images.screenshot}
          alt={`${repo.name} screenshot`}
          fill
          sizes="(min-width: 1024px) 40vw, 100vw"
          className="object-cover opacity-70 transition-opacity duration-300 group-hover:opacity-90"
        />
      ) : (
        <div
          className="absolute inset-0 bg-gradient-to-br from-surface-elevated via-surface to-accent-soft"
          aria-hidden="true"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/40 to-transparent" aria-hidden="true" />
      <div className="relative flex items-end justify-between gap-3 p-5">
        <div className="flex items-center gap-3">
          <RepoLogo repo={repo} size={40} />
          <div>
            <h3 className="font-semibold text-fg">{repo.name}</h3>
            <p className="text-sm text-fg/70">{repo.tagline}</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {repo.stats ? (
            <span className="inline-flex items-center gap-1 font-mono text-sm text-fg/80">
              <Star size={14} weight="fill" className="text-star" aria-hidden="true" />
              {formatNumber(repo.stats.stars)}
            </span>
          ) : null}
          <ArrowUpRight
            size={16}
            weight="bold"
            className="text-fg/60 transition-colors group-hover:text-accent"
            aria-hidden="true"
          />
        </div>
      </div>
      <span
        className="absolute left-5 top-4 inline-flex items-center gap-1.5 rounded-full border border-line bg-bg/70 px-2 py-0.5 text-[10px] font-medium backdrop-blur-sm"
        style={{ color: category.accent }}
      >
        {category.label}
      </span>
    </Link>
  );
}

function CompactTile({ repo }: { repo: RepoWithStats }) {
  const category = CATEGORY_MAP[repo.category];
  return (
    <Link
      href={`/repos/${repo.slug}`}
      className="group flex flex-1 items-center gap-4 rounded-lg border border-line bg-surface p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/30"
    >
      <RepoLogo repo={repo} size={36} />
      <div className="min-w-0 flex-1">
        <h3 className="truncate font-medium text-fg">{repo.name}</h3>
        <p className="truncate text-xs text-muted">{repo.tagline}</p>
      </div>
      <div className="flex shrink-0 items-center gap-2 text-xs text-muted">
        {repo.stats ? (
          <span className="inline-flex items-center gap-1 font-mono">
            <Star size={12} weight="fill" className="text-star" aria-hidden="true" />
            {formatNumber(repo.stats.stars)}
          </span>
        ) : null}
        <span style={{ color: category.accent }} aria-hidden="true">
          ●
        </span>
      </div>
    </Link>
  );
}
