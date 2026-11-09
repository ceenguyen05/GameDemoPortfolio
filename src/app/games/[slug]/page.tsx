import { notFound } from "next/navigation";
import { games, getGame } from "@/content/games";
import { GameDetails } from "@/components/games/GameDetails";
import { PageShell } from "@/components/layout/PageShell";
import { gameMetadata } from "@/lib/gameMetadata";
export const dynamicParams = false;
export function generateStaticParams() {
  return games.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const game = getGame((await params).slug);
  if (!game) notFound();
  return gameMetadata(game);
}
export default async function GamePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const game = getGame((await params).slug);
  if (!game) notFound();
  return (
    <PageShell>
      <GameDetails game={game} />
    </PageShell>
  );
}
