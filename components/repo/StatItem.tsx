import type { ReactNode } from "react";

export function StatItem({
  label,
  value,
  mono = true,
}: {
  label: string;
  value: ReactNode;
  mono?: boolean;
}) {
  return (
    <div className="rounded-lg border border-line bg-surface px-4 py-3">
      <dt className="text-xs uppercase tracking-wide text-muted">{label}</dt>
      <dd className={`mt-1 text-xl font-semibold text-fg ${mono ? "font-mono" : ""}`}>
        {value}
      </dd>
    </div>
  );
}
