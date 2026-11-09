import type { Game } from "../types/game";
import { validateGames } from "./validateGames";
export function createGameRedirects(entries: Game[]) {
  return validateGames(entries).flatMap((game) =>
    game.status === "live"
      ? [
          {
            source: `/play/${game.slug}`,
            destination: game.playUrl,
            permanent: false as const,
          },
        ]
      : [],
  );
}
