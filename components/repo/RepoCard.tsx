import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Star } from "@/components/ui/icons";
import { WatchButton } from "@/components/repo/WatchButton";
import { CATEGORY_MAP } from "@/lib/constants";
import { formatNumber, initials } from "@/lib/format";
import type { RepoWithStats } from "@/lib/types";

export function RepoLogo({
  repo,
  size = 40,
}: {
  repo: RepoWithStats;
  size?: number;
}) {
  if (repo.images.logo) {
    return (
      <Image
        src={repo.images.logo}
        alt={`${repo.name} logo`}
        width={size}
        height={size}
        className="rounded-md border border-line object-contain"
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <div
      className="flex items-center justify-center rounded-md border border-line bg-gradient-to-br from-surface-elevated to-accent-soft font-mono font-semibold text-fg"
      style={{ width: size, height: size, fontSize: size * 0.34 }}
      aria-hidden="true"
    >
      {initials(repo.name)}
    </div>
  );
}

export function RepoCard({ repo }: { repo: RepoWithStats }) {
  const category = CATEGORY_MAP[repo.category];

  return (
    <article className="group flex h-full flex-col rounded-lg border border-line bg-surface p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_2px_12px_rgba(15,23,42,0.06)] dark:hover:shadow-[0_2px_12px_rgba(0,0,0,0.18)]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <RepoLogo repo={repo} size={40} />
          <div>
            <h3 className="font-semibold leading-tight text-fg">{repo.name}</h3>
            <p className="font-mono text-xs text-muted">{repo.fullName}</p>
          </div>
        </div>
        <WatchButton slug={repo.slug} compact />
      </div>

      <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted">
        {repo.tagline}
      </p>

      <div className="mt-4 flex items-center gap-3 text-xs text-muted">
        {repo.stats ? (
          <>
            <span className="inline-flex items-center gap-1">
              <Star size={13} weight="fill" className="text-star" aria-hidden="true" />
              <span className="font-mono">{formatNumber(repo.stats.stars)}</span>
            </span>
            {repo.stats.language ? (
              <span className="font-mono">{repo.stats.language}</span>
            ) : null}
          </>
        ) : null}
        <span
          className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface-elevated px-2 py-0.5 text-[10px] font-medium"
          style={{ color: category.accent }}
        >
          {category.label}
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-line pt-3">
        <Link
          href={`/repos/${repo.slug}`}
          className="inline-flex items-center gap-1 text-sm font-medium text-fg transition-colors group-hover:text-accent"
        >
          View details
          <ArrowUpRight size={14} weight="bold" aria-hidden="true" />
        </Link>
        <a
          href={`https://github.com/${repo.fullName}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-muted transition-colors hover:text-fg"
        >
          GitHub
        </a>
      </div>
    </article>
  );
}
