import { test } from "node:test";
import assert from "node:assert/strict";
import { games } from "../src/content/games";
import { makerProfiles } from "../src/content/makerProfiles";
import { getMakers } from "../src/lib/makers";
import { validateGames } from "../src/lib/validateGames";

test("every game is credited once and a maker's games are grouped by stable slug", () => {
  const makers = getMakers(games);
  assert.deepEqual(
    makers.map(({ developer, games: credits }) => [
      developer.slug,
      credits.map((g) => g.slug),
    ]),
    [
      ["casey-nguyen", ["aci-series-1", "untitled-obby", "moon-sweeper"]],
      ["trea-edwards", ["devil-game"]],
    ],
  );
  for (const slug of Object.keys(makerProfiles))
    assert.ok(
      makers.some((maker) => maker.developer.slug === slug),
      `orphaned profile: ${slug}`,
    );
  // Cloned identities still group together; display-name changes don't split credits.
  assert.equal(
    getMakers([
      games[0],
      {
        ...games[0],
        slug: "new-game",
        developer: { ...games[0].developer, name: "Updated name" },
      },
    ]).length,
    1,
  );
});

test("new makers appear from catalog data without needing a detailed profile", () => {
  const developer = { slug: "new-maker", name: "New Maker" };
  const makers = getMakers([
    ...games,
    { ...games[0], slug: "new-game", developer },
  ]);
  assert.equal(makers.at(-1)?.developer, developer);
  assert.equal(makers.at(-1)?.games.length, 1);
  assert.deepEqual(getMakers([]), []);
});

test("maker anchors and LinkedIn URLs reject malformed input", () => {
  for (const slug of ["", "Name With Spaces", "../unsafe", "#duplicate"])
    assert.throws(
      () =>
        validateGames([
          { ...games[0], developer: { ...games[0].developer, slug } },
        ]),
      /developer.slug/,
    );
  for (const linkedinUrl of [
    "javascript:alert(1)",
    "http://linkedin.com",
    "https://user:pass@linkedin.com",
  ])
    assert.throws(
      () =>
        validateGames([
          { ...games[0], developer: { ...games[0].developer, linkedinUrl } },
        ]),
      /developer.linkedinUrl/,
    );
});
