import { Hero } from "@/components/home/Hero";
import { StatsStrip } from "@/components/home/StatsStrip";
import { FeaturedGrid } from "@/components/home/FeaturedGrid";
import { CategoryIndex } from "@/components/home/CategoryIndex";
import { RepoTable } from "@/components/home/RepoTable";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import {
  getCategoryCounts,
  getFeaturedRepos,
  getRepos,
} from "@/lib/data";

export default function Home() {
  const repos = getRepos();
  const featured = getFeaturedRepos(5);
  const counts = getCategoryCounts();
  const totalStars = repos.reduce(
    (sum, r) => sum + (r.stats?.stars ?? 0),
    0
  );

  return (
    <>
      <Hero />
      <StatsStrip
        repoCount={repos.length}
        totalStars={totalStars}
        categoryCount={Object.keys(counts).length}
      />
      <Reveal>
        <FeaturedGrid repos={featured} />
      </Reveal>
      <Reveal>
        <CategoryIndex counts={counts} />
      </Reveal>
      <Reveal>
        <RepoTable repos={repos} />
      </Reveal>

      {/* Bottom CTA */}
      <section className="border-t border-line">
        <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:py-24">
          <h2 className="text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
            Found something worth watching?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-base leading-relaxed text-muted">
            Build your own radar. Watch repos and keep them one click away,
            stored locally in your browser.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button href="/watchlist">Open your watchlist</Button>
          </div>
        </div>
      </section>
    </>
  );
}
