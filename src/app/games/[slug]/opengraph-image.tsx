import { notFound } from "next/navigation";
import { games, getGame } from "@/content/games";
import { createOgImage } from "@/lib/ogImage";
export const alt = "A browser-first game by Casey Nguyen";
export const size = { width: 1200, height: 630 };
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
  return createOgImage(game.title, game.tagline, game.accentColor);
}
