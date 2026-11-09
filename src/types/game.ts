export type GameStatus = "live" | "in-development" | "coming-soon";
export type GameImage = {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
};
export type ChangelogEntry = { version: string; date: string; notes: string[] };
type GameBase = {
  slug: string;
  title: string;
  tagline: string;
  description: { short: string; long: string };
  genre: string[];
  platforms: string[];
  controls: { keys: string[]; action: string }[];
  techStack: string[];
  repoUrl?: string;
  releaseDate: string | null;
  accentColor: string;
  coverImage: GameImage;
  screenshots: GameImage[];
  trailerUrl?: string;
  changelog?: ChangelogEntry[];
};
export type Game = GameBase &
  (
    | { status: "live"; playUrl: string }
    | { status: "in-development" | "coming-soon"; playUrl?: never }
  );
