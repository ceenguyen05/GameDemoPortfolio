import type { MetadataRoute } from "next";
import { games } from "@/content/games";
import { siteConfig } from "@/lib/siteConfig";
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteConfig.url, priority: 1 },
    { url: `${siteConfig.url}/about`, priority: 0.5 },
    ...games.map((game) => ({
      url: `${siteConfig.url}/games/${game.slug}`,
      priority: game.status === "live" ? 0.9 : 0.4,
    })),
  ];
}
