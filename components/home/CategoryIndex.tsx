import Link from "next/link";
import { ArrowRight } from "@/components/ui/icons";
import { CATEGORIES } from "@/lib/constants";

export function CategoryIndex({
  counts,
}: {
  counts: Record<string, number>;
}) {
  return (
    <section id="categories" className="border-t border-line">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
        <div className="mb-8 max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
            Browse by category
          </h2>
          <p className="mt-3 text-base leading-relaxed text-muted">
            Every gem is filed under one discipline, so you can scan the area
            that matters to you.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((cat) => {
            const count = counts[cat.id] ?? 0;
            return (
              <Link
                key={cat.id}
                href="/#gems"
                className="group flex flex-col justify-between gap-6 rounded-lg border border-line bg-surface p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/30"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: cat.accent }}
                      aria-hidden="true"
                    />
                    <ArrowRight
                      size={14}
                      weight="bold"
                      className="text-fg/30 transition-all group-hover:translate-x-0.5 group-hover:text-fg"
                      aria-hidden="true"
                    />
                  </div>
                  <h3 className="mt-4 font-semibold text-fg">{cat.label}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted">
                    {cat.description}
                  </p>
                </div>
                <p className="font-mono text-xs text-muted">
                  {count} {count === 1 ? "gem" : "gems"}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
