import type { ReactNode } from "react";

export function Tag({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full border border-line bg-surface-elevated px-2.5 py-0.5 font-mono text-[11px] uppercase tracking-[0.05em] text-muted ${className}`}
    >
      {children}
    </span>
  );
}

export function CategoryTag({
  label,
  accent,
  className = "",
}: {
  label: string;
  accent: string;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-line bg-surface-elevated px-2.5 py-0.5 text-[11px] font-medium text-fg ${className}`}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: accent }}
        aria-hidden="true"
      />
      {label}
    </span>
  );
}
