import type { Category, CategoryId } from "./types";

export const CATEGORIES: Category[] = [
  {
    id: "developer-tools",
    label: "Developer Tools",
    description: "CLI utilities, code quality, and workflow boosters.",
    accent: "#4CC3FF",
  },
  {
    id: "cli-terminal",
    label: "CLI / Terminal",
    description: "Command-line tools, TUIs, and terminal-first utilities.",
    accent: "#5FD4A0",
  },
  {
    id: "self-hosting",
    label: "Self-Hosting",
    description: "Software you can run on your own hardware.",
    accent: "#7DD3A8",
  },
  {
    id: "data-ai",
    label: "Data & AI",
    description: "Databases, analytics, and machine learning tooling.",
    accent: "#C4A7E7",
  },
  {
    id: "productivity",
    label: "Productivity",
    description: "Notes, task management, and personal organization.",
    accent: "#F2C063",
  },
  {
    id: "communication",
    label: "Communication",
    description: "Newsletters, chat, and team messaging.",
    accent: "#F2A2A2",
  },
  {
    id: "design",
    label: "Design",
    description: "UI kits, prototyping, and creative tooling.",
    accent: "#E7B4F0",
  },
  {
    id: "backend",
    label: "Backend",
    description: "APIs, servers, and service infrastructure.",
    accent: "#7FB5E0",
  },
  {
    id: "frontend",
    label: "Frontend",
    description: "Frameworks, components, and browser tooling.",
    accent: "#A8D8A8",
  },
  {
    id: "game",
    label: "Game",
    description: "Games, engines, and interactive simulations.",
    accent: "#9AD8F0",
  },
  {
    id: "mobile",
    label: "Mobile",
    description: "iOS, Android, and cross-platform mobile apps.",
    accent: "#C9A8E0",
  },
  {
    id: "other-fun",
    label: "Other / Fun",
    description: "Curiosities, experiments, and delightful side projects.",
    accent: "#F0B4E0",
  },
];

export const CATEGORY_MAP: Record<CategoryId, Category> = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c])
) as Record<CategoryId, Category>;

export const SITE_NAME = "Starboard Reporadar";
export const WATCHLIST_STORAGE_KEY = "sb-radar-watchlist";
export const THEME_STORAGE_KEY = "sb-radar-theme";

/** Systemic z-index scale. Do not invent ad-hoc values. */
export const Z = {
  nav: 40,
  overlay: 50,
  modal: 60,
} as const;
