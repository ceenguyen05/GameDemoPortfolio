import { test } from "node:test";
import assert from "node:assert/strict";
import { games, liveGames } from "../src/content/games";
import { validateGames } from "../src/lib/validateGames";
import { createGameRedirects } from "../src/lib/gameRedirects";
import { contrastRatio } from "../src/lib/color";
import type { Game } from "../src/types/game";

const live = liveGames[0];
const upcoming = games.find((game) => game.status !== "live")!;

test("the catalog itself is valid and features ACI: Series 1", () => {
  assert.doesNotThrow(() => validateGames(games));
  assert.equal(live.slug, "aci-series-1");
  assert.equal(live.playUrl, "https://aci-series1.vercel.app/");
});

test("rejects duplicate slugs with a clear content error", () => {
  assert.throws(() => validateGames([live, live]), /duplicate slug/);
});

test("rejects missing, non-HTTPS, and credential-bearing launch targets", () => {
  for (const url of [
    undefined,
    "",
    "/local",
    "http://game.example",
    "javascript:alert(1)",
    "https://user:pass@game.example",
  ]) {
    assert.throws(
      () => validateGames([{ ...live, playUrl: url } as Game]),
      /https:\/\/ playUrl/,
    );
  }
});

test("rejects a playUrl on a game that is not live", () => {
  assert.throws(
    () =>
      validateGames([
        { ...upcoming, playUrl: "https://early.example/" } as unknown as Game,
      ]),
    /must not set playUrl/,
  );
});

test("rejects non-HTTPS repo and trailer links", () => {
  assert.throws(
    () => validateGames([{ ...live, repoUrl: "http://github.com/x" }]),
    /repoUrl/,
  );
  assert.throws(
    () => validateGames([{ ...live, trailerUrl: "ftp://video" }]),
    /trailerUrl/,
  );
});

test("rejects malformed changelog entries", () => {
  assert.throws(
    () =>
      validateGames([
        {
          ...live,
          changelog: [{ version: "1.0", date: "Nov 9", notes: ["x"] }],
        },
      ]),
    /date must be YYYY-MM-DD/,
  );
  assert.throws(
    () =>
      validateGames([
        {
          ...live,
          changelog: [{ version: "1.0", date: "2026-11-09", notes: [] }],
        },
      ]),
    /non-empty note/,
  );
});

test("rejects accents too dark to sit behind ink glyphs", () => {
  assert.throws(
    () => validateGames([{ ...live, accentColor: "#24302b" }]),
    /contrast against ink/,
  );
  for (const game of games)
    assert.ok(contrastRatio(game.accentColor, "#1b2220") >= 3, game.slug);
});

test("redirects only live games and never makes a permanent redirect", () => {
  assert.deepEqual(createGameRedirects(games), [
    {
      source: "/play/aci-series-1",
      destination: "https://aci-series1.vercel.app/",
      permanent: false,
    },
  ]);
});

test("a new game entry automatically creates a new redirect", () => {
  const game = {
    ...live,
    slug: "another-game",
    playUrl: "https://another.example/",
    coverImage: { ...live.coverImage, src: "/games/another-game/cover.webp" },
    screenshots: [],
  } satisfies Game;
  assert.equal(
    createGameRedirects([...games, game]).at(-1)?.destination,
    "https://another.example/",
  );
});

test("rejects cross-project asset paths", () => {
  assert.throws(
    () =>
      validateGames([
        { ...live, coverImage: { ...live.coverImage, src: "/other.webp" } },
      ]),
    /images must live/,
  );
});
