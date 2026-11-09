import { access } from "node:fs/promises";
import { join } from "node:path";
import { games } from "../src/content/games";
async function main() {
  for (const game of games) {
    for (const asset of [game.coverImage, ...game.screenshots]) {
      try {
        await access(join(process.cwd(), "public", asset.src));
      } catch {
        throw new Error(
          `[games] ${game.slug}: missing asset public${asset.src}`,
        );
      }
    }
  }
  console.log(`Validated ${games.length} games and their assets.`);
}
main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
