export type CategoryId =
  | "developer-tools"
  | "self-hosting"
  | "data-ai"
  | "productivity"
  | "communication"
  | "design"
  | "backend"
  | "frontend";

export interface Category {
  id: CategoryId;
  label: string;
  description: string;
  /** Accent color used for tags and icons (dark mode friendly). */
  accent: string;
}

export interface RepoLinks {
  website?: string;
  docs?: string;
  demo?: string;
}

export interface RepoImages {
  logo?: string;
  screenshot?: string;
}

/** Curated content, one file per repo under data/repos/{slug}.json */
export interface Repo {
  slug: string;
  name: string;
  fullName: string;
  tagline: string;
  description: string;
  category: CategoryId;
  featured: boolean;
  tags: string[];
  highlights: string[];
  techStack: string[];
  links: RepoLinks;
  images: RepoImages;
  related: string[];
  curatorNote: string;
  publishedAt: string; // ISO date
}

/** Live metrics from GitHub API, merged in at build time. */
export interface GhStats {
  stars: number;
  forks: number;
  openIssues: number;
  language: string | null;
  license: string | null;
  createdAt: string;
  updatedAt: string;
  topics: string[];
  ownerAvatar: string;
  archived: boolean;
}

/** Merged view used across the site. */
export interface RepoWithStats extends Repo {
  stats?: GhStats;
}

export interface SiteConfig {
  name: string;
  tagline: string;
  description: string;
  url: string;
  social: { github?: string; twitter?: string };
  featured: string[];
}
