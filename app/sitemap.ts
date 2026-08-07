import type { MetadataRoute } from "next";
import { getRepos, getSiteConfig } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const site = getSiteConfig();
  const baseUrl = site?.url ?? "https://starboard-reporadar.vercel.app";

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/watchlist`, lastModified: new Date() },
    { url: `${baseUrl}/about`, lastModified: new Date() },
  ];

  const repoPages: MetadataRoute.Sitemap = getRepos().map((repo) => ({
    url: `${baseUrl}/repos/${repo.slug}`,
    lastModified: repo.stats?.updatedAt
      ? new Date(repo.stats.updatedAt)
      : new Date(),
  }));

  return [...staticPages, ...repoPages];
}
