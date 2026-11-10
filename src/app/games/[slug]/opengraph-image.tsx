import { notFound } from "next/navigation";
import { games, getGame } from "@/content/games";
import { createOgImage, ogSize } from "@/lib/ogImage";
import { statusLabels } from "@/lib/gameStatus";
import { catalogNumber } from "@/lib/format";
import { siteConfig } from "@/lib/siteConfig";

export const alt = "A browser game by Casey Nguyen";
export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return games.map(({ slug }) => ({ slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const game = getGame((await params).slug);
  if (!game) notFound();
  const host = new URL(siteConfig.url).host;
  return createOgImage({
    eyebrow: [
      `No. ${catalogNumber(games.indexOf(game) + 1)}`,
      statusLabels[game.status],
      game.workingTitle && "Working title",
    ]
      .filter(Boolean)
      .join(" · "),
    title: game.title,
    subtitle: game.tagline,
    footer:
      game.status === "live"
        ? `${host}/play/${game.slug}`
        : `${host}/games/${game.slug}`,
    accent: game.accentColor,
  });
}
