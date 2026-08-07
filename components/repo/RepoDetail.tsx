import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowUpRight,
  CheckCircle,
  GithubLogo,
} from "@/components/ui/icons";
import { RepoLogo } from "@/components/repo/RepoCard";
import { RepoCard } from "@/components/repo/RepoCard";
import { StatItem } from "@/components/repo/StatItem";
import { WatchButton } from "@/components/repo/WatchButton";
import { CategoryTag, Tag } from "@/components/ui/Badge";
import { CATEGORY_MAP } from "@/lib/constants";
import {
  formatDate,
  formatFullNumber,
  formatNumber,
  momentum,
  timeAgo,
} from "@/lib/format";
import type { RepoWithStats } from "@/lib/types";

export function RepoDetail({
  repo,
  related,
}: {
  repo: RepoWithStats;
  related: RepoWithStats[];
}) {
  const cat = CATEGORY_MAP[repo.category];
  const stats = repo.stats;

  return (
    <article className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:py-14">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-8">
        <Link
          href="/#gems"
          className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-fg"
        >
          <ArrowLeft size={14} weight="bold" aria-hidden="true" />
          All gems
        </Link>
      </nav>

      {/* Header */}
      <header className="flex flex-col gap-6 border-b border-line pb-8 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <RepoLogo repo={repo} size={56} />
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
                {repo.name}
              </h1>
              <a
                href={`https://github.com/${repo.fullName}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-sm text-muted transition-colors hover:text-accent"
              >
                {repo.fullName}
              </a>
            </div>
            <p className="mt-2 max-w-xl text-base leading-relaxed text-fg/80">
              {repo.tagline}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <CategoryTag label={cat.label} accent={cat.accent} />
              {repo.tags.slice(0, 4).map((t) => (
                <Tag key={t}>{t}</Tag>
              ))}
            </div>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <WatchButton slug={repo.slug} />
          <a
            href={`https://github.com/${repo.fullName}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 items-center gap-2 rounded-md border border-line px-4 text-sm font-medium text-fg transition-colors hover:bg-accent-soft/30"
          >
            <GithubLogo size={16} weight="bold" aria-hidden="true" />
            GitHub
          </a>
        </div>
      </header>

      {/* Stats grid */}
      <dl className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatItem label="Stars" value={formatFullNumber(stats?.stars)} />
        <StatItem label="Forks" value={formatFullNumber(stats?.forks)} />
        <StatItem label="Open issues" value={formatFullNumber(stats?.openIssues)} />
        <StatItem label="Language" value={stats?.language ?? "-"} />
        <StatItem label="License" value={stats?.license ?? "-"} />
        <StatItem
          label="Updated"
          value={timeAgo(stats?.updatedAt)}
          mono={false}
        />
      </dl>

      {/* Screenshot */}
      {repo.images.screenshot ? (
        <div className="relative mt-8 overflow-hidden rounded-lg border border-line">
          <Image
            src={repo.images.screenshot}
            alt={`${repo.name} interface screenshot`}
            width={1600}
            height={900}
            priority
            className="h-auto w-full object-cover"
          />
        </div>
      ) : null}

      {/* Description */}
      <section className="mt-10 max-w-2xl">
        <h2 className="text-lg font-semibold text-fg">What it is</h2>
        <p className="mt-3 text-base leading-relaxed text-fg/80">
          {repo.description}
        </p>
      </section>

      {/* Highlights */}
      {repo.highlights.length > 0 ? (
        <section className="mt-10">
          <h2 className="text-lg font-semibold text-fg">Why it stands out</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {repo.highlights.map((h) => (
              <li
                key={h}
                className="flex items-start gap-2.5 rounded-lg border border-line bg-surface px-4 py-3"
              >
                <CheckCircle
                  size={17}
                  weight="fill"
                  className="mt-0.5 shrink-0 text-accent"
                  aria-hidden="true"
                />
                <span className="text-sm leading-relaxed text-fg/85">{h}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* Tech stack */}
      {repo.techStack.length > 0 ? (
        <section className="mt-10">
          <h2 className="text-lg font-semibold text-fg">Tech stack</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {repo.techStack.map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
          </div>
        </section>
      ) : null}

      {/* Curator note */}
      {repo.curatorNote ? (
        <section className="mt-10 rounded-lg border border-line bg-surface p-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">
            Curator note
          </p>
          <p className="mt-3 text-base leading-relaxed text-fg/85">
            &ldquo;{repo.curatorNote}&rdquo;
          </p>
        </section>
      ) : null}

      {/* Links */}
      <section className="mt-10 flex flex-wrap gap-3">
        <a
          href={`https://github.com/${repo.fullName}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-10 items-center gap-2 rounded-md border border-line px-4 text-sm font-medium text-fg transition-colors hover:bg-accent-soft/30"
        >
          GitHub
          <ArrowUpRight size={14} weight="bold" aria-hidden="true" />
        </a>
        {repo.links.website ? (
          <a
            href={repo.links.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 items-center gap-2 rounded-md border border-line px-4 text-sm font-medium text-fg transition-colors hover:bg-accent-soft/30"
          >
            Website
            <ArrowUpRight size={14} weight="bold" aria-hidden="true" />
          </a>
        ) : null}
        {repo.links.docs ? (
          <a
            href={repo.links.docs}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 items-center gap-2 rounded-md border border-line px-4 text-sm font-medium text-fg transition-colors hover:bg-accent-soft/30"
          >
            Docs
            <ArrowUpRight size={14} weight="bold" aria-hidden="true" />
          </a>
        ) : null}
        {repo.links.demo ? (
          <a
            href={repo.links.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 items-center gap-2 rounded-md border border-line px-4 text-sm font-medium text-fg transition-colors hover:bg-accent-soft/30"
          >
            Demo
            <ArrowUpRight size={14} weight="bold" aria-hidden="true" />
          </a>
        ) : null}
      </section>

      {/* Meta footer */}
      <footer className="mt-10 border-t border-line pt-5 text-xs text-muted">
        <p>
          Published {formatDate(repo.publishedAt)} ·{" "}
          {stats
            ? `Created ${formatDate(stats.createdAt)} · ~${formatNumber(
                momentum(stats.stars, stats.createdAt)
              )} stars/mo`
            : "Stats unavailable"}
        </p>
      </footer>

      {/* Related */}
      {related.length > 0 ? (
        <section className="mt-12 border-t border-line pt-10">
          <h2 className="text-lg font-semibold text-fg">Also worth a look</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => (
              <RepoCard key={r.slug} repo={r} />
            ))}
          </div>
        </section>
      ) : null}
    </article>
  );
}
