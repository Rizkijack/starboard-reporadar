import type { Metadata } from "next";
import { CheckCircle } from "@/components/ui/icons";
import { getRepos } from "@/lib/data";

export const metadata: Metadata = {
  title: "How we curate",
  description:
    "The curation method behind Starboard Reporadar: how gems are picked, scored, and kept honest.",
};

const criteria = [
  {
    title: "Maintenance is active",
    body: "A repo that has not been touched in a year is a museum, not a gem. We prefer projects with recent commits, responsive maintainers, and a clear release cadence.",
  },
  {
    title: "Documentation is usable",
    body: "Great software is useless if you cannot run it. We check that the README has real setup steps, and that docs exist for the non-obvious parts.",
  },
  {
    title: "The idea is differentiated",
    body: "We skip another to-do app or another URL shortener. Each pick solves a problem in a way we have not seen done well elsewhere.",
  },
  {
    title: "Potential outpaces popularity",
    body: "The core of a hidden gem: the repo is less famous than it deserves. We look for projects whose quality exceeds their star count.",
  },
];

export default function About() {
  const repos = getRepos();

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:py-20">
      <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.18em] text-accent">
        Methodology
      </p>
      <h1 className="text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
        How we pick the gems
      </h1>
      <p className="mt-4 text-base leading-relaxed text-muted">
        Starboard Reporadar is a human-curated radar of undervalued GitHub
        repositories. Every entry on this site is reviewed by hand against a
        short list of criteria before it earns a slot.
      </p>

      <section className="mt-12">
        <h2 className="text-lg font-semibold text-fg">The criteria</h2>
        <ul className="mt-5 space-y-4">
          {criteria.map((c) => (
            <li
              key={c.title}
              className="flex items-start gap-3 rounded-lg border border-line bg-surface p-5"
            >
              <CheckCircle
                size={18}
                weight="fill"
                className="mt-0.5 shrink-0 text-accent"
                aria-hidden="true"
              />
              <div>
                <h3 className="font-medium text-fg">{c.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted">{c.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="text-lg font-semibold text-fg">How metrics stay honest</h2>
        <p className="mt-3 text-base leading-relaxed text-muted">
          Stars, forks, and activity are pulled directly from the GitHub API at
          build time and cached in the repository. Nothing on the site is a
          guess: what you see is what GitHub reports today. If a repo goes
          stale or archived, the radar flags it and we drop it.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-lg font-semibold text-fg">The radar score</h2>
        <p className="mt-3 text-base leading-relaxed text-muted">
          The table sorts by momentum, which is stars per month of repo age.
          It is a rough proxy for growth velocity, not a verdict on quality.
          We keep it simple on purpose: one number, easy to scan, easy to
          argue with.
        </p>
      </section>

      <section className="mt-12 rounded-lg border border-line bg-surface p-6">
        <h2 className="text-lg font-semibold text-fg">What we do not do</h2>
        <p className="mt-3 text-base leading-relaxed text-muted">
          We do not accept submissions for payment, we do not rank by
          sponsorships, and we do not feature a repo we would not use
          ourselves. If a pick stops making sense, it leaves the radar.
        </p>
      </section>

      <p className="mt-10 border-t border-line pt-6 font-mono text-xs text-muted">
        {repos.length} repos tracked today. Updated from the GitHub API at
        every build.
      </p>
    </div>
  );
}
