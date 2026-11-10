import type { Game } from "@/types/game";
import type { Command } from "@/types/command";
import { statusLabels } from "@/lib/gameStatus";
import { hostname } from "@/lib/format";

/**
 * Command palette entries, built on the server so the client bundle carries
 * only this small list instead of the whole catalog.
 */
export function buildCommands(games: Game[]): Command[] {
  const launches: Command[] = games.flatMap((game) =>
    game.status === "live"
      ? [
          {
            id: `play-${game.slug}`,
            label: `Play ${game.title}`,
            detail: `${hostname(game.playUrl)} · new tab`,
            href: game.playUrl,
            kind: "launch" as const,
            accent: game.accentColor,
          },
        ]
      : [],
  );
  const pages: Command[] = games.map((game) => ({
    id: `game-${game.slug}`,
    label: game.title,
    detail: `Game page · ${statusLabels[game.status]}`,
    href: `/games/${game.slug}`,
    kind: "game",
    accent: game.accentColor,
  }));
  return [
    ...launches,
    ...pages,
    {
      id: "library",
      label: "Game library",
      detail: "Page",
      href: "/#library",
      kind: "page",
    },
    {
      id: "about",
      label: "About and contact",
      detail: "Page",
      href: "/about",
      kind: "page",
    },
  ];
}
