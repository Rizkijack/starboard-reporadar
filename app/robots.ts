import type { MetadataRoute } from "next";
import { getSiteConfig } from "@/lib/data";

export default function robots(): MetadataRoute.Robots {
  const site = getSiteConfig();
  const baseUrl = site?.url ?? "https://starboard-reporadar.vercel.app";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
