import type { Game } from "../types/game";
import { contrastRatio } from "./color";

/** Ink text color from the design tokens; accents sit behind ink glyphs. */
const INK = "#1b2220";
const DATE = /^\d{4}-\d{2}-\d{2}$/;

function isHttpsUrl(value: unknown): boolean {
  if (typeof value !== "string") return false;
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      Boolean(url.hostname) &&
      !url.username &&
      !url.password
    );
  } catch {
    return false;
  }
}

function isDate(value: string): boolean {
  return DATE.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`));
}

/**
 * Checks the catalog and throws on the first problem. games.ts calls this on
 * import, so a bad entry fails `next build`, `next.config.ts`, and every script.
 */
export function validateGames(entries: Game[]): Game[] {
  const slugs = new Set<string>();
  for (const game of entries) {
    const fail = (reason: string): never => {
      throw new Error(
        `[games] ${game.slug || "<missing slug>"}: ${reason} (src/content/games.ts)`,
      );
    };

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(game.slug))
      fail("slug must be lowercase words separated by hyphens");
    if (slugs.has(game.slug))
      fail("duplicate slug; each game needs a unique slug");
    slugs.add(game.slug);

    if (!game.title.trim() || !game.tagline.trim())
      fail("title and tagline are required");
    if (!game.description.short.trim() || !game.description.long.trim())
      fail("description.short and description.long are required");

    if (game.status === "live" && !isHttpsUrl(game.playUrl))
      fail(
        'status "live" requires a valid https:// playUrl without credentials',
      );
    // The type forbids this already; the runtime check covers data that slips
    // past the compiler (casts, JSON, plain JS).
    const { playUrl } = game as { playUrl?: unknown };
    if (game.status !== "live" && playUrl !== undefined)
      fail(`a "${game.status}" game must not set playUrl`);
    if (game.repoUrl !== undefined && !isHttpsUrl(game.repoUrl))
      fail("repoUrl must be an https:// URL");
    if (game.trailerUrl !== undefined && !isHttpsUrl(game.trailerUrl))
      fail("trailerUrl must be an https:// URL");

    if (!/^#[0-9a-f]{6}$/i.test(game.accentColor))
      fail("accentColor must be a six-digit hex color like #ff743d");
    const contrast = contrastRatio(game.accentColor, INK);
    if (contrast < 3)
      fail(
        `accentColor ${game.accentColor} has ${contrast.toFixed(2)}:1 contrast against ink ${INK}; pick a lighter color (needs 3:1)`,
      );

    for (const asset of [game.coverImage, ...game.screenshots]) {
      if (
        !asset.src.startsWith(`/games/${game.slug}/`) ||
        asset.src.includes("..")
      )
        fail(`${asset.src}: images must live in public/games/${game.slug}/`);
      if (!asset.alt.trim() || asset.width <= 0 || asset.height <= 0)
        fail(`${asset.src}: needs alt text and positive width/height`);
    }

    if (game.releaseDate !== null && !isDate(game.releaseDate))
      fail("releaseDate must be YYYY-MM-DD or null");

    for (const entry of game.changelog ?? []) {
      if (!entry.version.trim()) fail("changelog entries need a version");
      if (!isDate(entry.date))
        fail(`changelog ${entry.version}: date must be YYYY-MM-DD`);
      if (!entry.notes.length || entry.notes.some((note) => !note.trim()))
        fail(`changelog ${entry.version}: needs at least one non-empty note`);
    }
  }
  return entries;
}
