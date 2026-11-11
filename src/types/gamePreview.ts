import type { Game, LiveGame, UpcomingGame } from "./game";
export type GameLaunch =
  | Pick<LiveGame, "title" | "status" | "playUrl">
  | Pick<UpcomingGame, "title" | "status">;
export type GamePreview = Pick<
  Game,
  "slug" | "tagline" | "genre" | "platforms" | "coverImage" | "accentColor"
> & { description: string } & GameLaunch;
