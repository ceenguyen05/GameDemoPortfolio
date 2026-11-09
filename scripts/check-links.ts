import { games } from "../src/content/games";
async function main() {
  for (const game of games) {
    if (game.status !== "live") continue;
    try {
      let response = await fetch(game.playUrl, {
        method: "HEAD",
        redirect: "manual",
        signal: AbortSignal.timeout(15_000),
      });
      if (response.status === 405 || response.status === 501)
        response = await fetch(game.playUrl, {
          redirect: "manual",
          signal: AbortSignal.timeout(15_000),
        });
      if (response.status >= 200 && response.status < 400)
        console.log(`OK ${response.status} ${game.title}: ${game.playUrl}`);
      else
        console.warn(
          `::warning::${game.title}: ${game.playUrl} returned ${response.status}`,
        );
      await response.body?.cancel();
    } catch (error) {
      console.warn(
        `::warning::${game.title}: ${game.playUrl} could not be reached (${error instanceof Error ? error.message : "unknown error"})`,
      );
    }
  }
}
void main();
