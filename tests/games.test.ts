import { test } from "node:test";
import assert from "node:assert/strict";
import { games } from "../src/content/games";
import { validateGames } from "../src/lib/validateGames";
import { createGameRedirects } from "../src/lib/gameRedirects";
import type { Game } from "../src/types/game";
const live = games.find((game) => game.status === "live")!;
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
  } as Game;
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
    /assets must live/,
  );
});
