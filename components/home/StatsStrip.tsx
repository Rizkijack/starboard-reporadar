import { formatNumber } from "@/lib/format";

export function StatsStrip({
  repoCount,
  totalStars,
  categoryCount,
}: {
  repoCount: number;
  totalStars: number;
  categoryCount: number;
}) {
  const stats = [
    { label: "Gems tracked", value: String(repoCount) },
    { label: "Stars combined", value: formatNumber(totalStars) },
    { label: "Categories", value: String(categoryCount) },
  ];

  return (
    <section className="border-b border-line">
      <dl className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-line px-4 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-6">
        {stats.map((s) => (
          <div key={s.label} className="py-6 sm:px-8 sm:first:pl-0 sm:last:pr-0">
            <dt className="text-xs uppercase tracking-wide text-muted">{s.label}</dt>
            <dd className="mt-1 font-mono text-2xl font-semibold text-fg">{s.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
