import type { Game } from "../types/game";
export function validateGames(entries: Game[]): Game[] {
  const slugs = new Set<string>();
  for (const game of entries) {
    const fail = (reason: string): never => {
      throw new Error(`[games] ${game.slug || "<missing slug>"}: ${reason}`);
    };
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(game.slug))
      fail("slug must be lowercase words separated by hyphens");
    if (slugs.has(game.slug))
      fail("duplicate slug; each game needs a unique slug");
    slugs.add(game.slug);
    if (game.status === "live") {
      try {
        const url = new URL(game.playUrl);
        if (
          url.protocol !== "https:" ||
          !url.hostname ||
          url.username ||
          url.password
        )
          fail(
            "live games require a valid https:// playUrl without credentials",
          );
      } catch {
        fail("live games require a valid https:// playUrl without credentials");
      }
    }
    if (!/^#[0-9a-f]{6}$/i.test(game.accentColor))
      fail("accentColor must be a six-digit hex color");
    for (const asset of [game.coverImage, ...game.screenshots]) {
      if (
        !asset.src.startsWith(`/games/${game.slug}/`) ||
        asset.src.includes("..")
      )
        fail("assets must live in public/games/<slug>/");
      if (!asset.alt || asset.width <= 0 || asset.height <= 0)
        fail("each image needs alt text and positive dimensions");
    }
    if (
      game.releaseDate !== null &&
      !/^\d{4}-\d{2}-\d{2}$/.test(game.releaseDate)
    )
      fail("releaseDate must be YYYY-MM-DD or null");
  }
  return entries;
}
