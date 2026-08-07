import { RadarSweep } from "@/components/home/RadarSweep";
import { Button } from "@/components/ui/Button";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-line">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 pb-16 pt-20 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-6 lg:pb-24 lg:pt-24">
        <div className="max-w-xl">
          <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.18em] text-accent">
            Curated GitHub discovery
          </p>
          <h1 className="text-4xl font-semibold leading-tight tracking-tight text-fg sm:text-5xl">
            Hidden gems, tracked like radar.
          </h1>
          <p className="mt-4 max-w-md text-base leading-relaxed text-muted">
            A hand-curated list of undervalued GitHub repositories with real
            potential. Sort, filter, and watch the ones worth following.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button href="/#gems">Browse gems</Button>
            <Button href="/about" variant="secondary">
              How we curate
            </Button>
          </div>
        </div>

        <div className="relative">
          <RadarSweep />
        </div>
      </div>
    </section>
  );
}
