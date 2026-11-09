import type { Metadata } from "next";
import type { Game } from "@/types/game";
export function gameMetadata(game: Game): Metadata {
  const path = `/games/${game.slug}`;
  const images = [
    {
      url: `${path}/opengraph-image`,
      width: 1200,
      height: 630,
      alt: `${game.title} by Casey Nguyen`,
    },
  ];
  return {
    title: game.title,
    description: game.description.short,
    alternates: { canonical: path },
    openGraph: {
      title: game.title,
      description: game.description.short,
      url: path,
      type: "website",
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: game.title,
      description: game.description.short,
      images,
    },
  };
}
