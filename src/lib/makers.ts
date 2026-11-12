import type { Game } from "../types/game";
import type { Developer } from "../types/developer";

/** Derive credits from the catalog so new games cannot drift from maker pages. */
export function getMakers(games: Game[]) {
  const makers = new Map<string, { developer: Developer; games: Game[] }>();
  for (const game of games) {
    const slug = game.developer.slug;
    const maker = makers.get(slug);
    if (maker) maker.games.push(game);
    else makers.set(slug, { developer: game.developer, games: [game] });
  }
  return [...makers.values()];
}
