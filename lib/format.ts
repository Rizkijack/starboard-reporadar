const compact = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});

export function formatNumber(n: number | null | undefined): string {
  if (n === null || n === undefined) return "-";
  return compact.format(n);
}

export function formatFullNumber(n: number | null | undefined): string {
  if (n === null || n === undefined) return "-";
  return n.toLocaleString("en-US");
}

export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "-";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function timeAgo(iso: string | null | undefined): string {
  if (!iso) return "-";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  const seconds = Math.floor((Date.now() - d.getTime()) / 1000);
  const intervals: Array<[number, string]> = [
    [31536000, "y"],
    [2592000, "mo"],
    [604800, "w"],
    [86400, "d"],
    [3600, "h"],
    [60, "m"],
  ];
  for (const [secs, label] of intervals) {
    const value = Math.floor(seconds / secs);
    if (value >= 1) return `${value}${label} ago`;
  }
  return "just now";
}

/**
 * Stars per month of repo age. Rough signal of growth velocity.
 */
export function momentum(stars: number | null | undefined, createdAt: string | null | undefined): number {
  if (!stars || !createdAt) return 0;
  const created = new Date(createdAt);
  if (Number.isNaN(created.getTime())) return 0;
  const months = Math.max((Date.now() - created.getTime()) / (1000 * 60 * 60 * 24 * 30.44), 0.1);
  return Math.round((stars / months) * 10) / 10;
}

export function initials(name: string): string {
  return name
    .split(/[\s-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}
