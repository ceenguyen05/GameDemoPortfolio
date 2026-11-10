import type { Metadata } from "next";
import type { Game } from "@/types/game";

/** Per-game metadata. The OG/Twitter image comes from games/[slug]/opengraph-image. */
export function gameMetadata(game: Game): Metadata {
  const path = `/games/${game.slug}`;
  const description = game.description.short;
  const image = {
    url: `${path}/opengraph-image`,
    width: 1200,
    height: 630,
    alt: `${game.title}, a browser game by Casey Nguyen`,
  };
  return {
    title: game.title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      url: path,
      title: game.title,
      description,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: game.title,
      description,
      images: [image],
    },
  };
}
