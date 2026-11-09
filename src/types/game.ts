export type GameStatus = "live" | "in-development" | "coming-soon";

export type GameImage = {
  /** Path under /public, always inside /games/<slug>/. */
  src: string;
  alt: string;
  /** Short mono caption, e.g. "ACI HQ / Loading yard". */
  caption: string;
  width: number;
  height: number;
};

export type GameControl = {
  /** Keys shown as keycaps, in order. */
  keys: string[];
  action: string;
};

export type ChangelogEntry = {
  version: string;
  /** YYYY-MM-DD */
  date: string;
  notes: string[];
};

type GameBase = {
  slug: string;
  title: string;
  tagline: string;
  description: { short: string; long: string };
  genre: string[];
  platforms: string[];
  controls: GameControl[];
  /** One or two sentences shown above the controls, e.g. how input capture works. */
  controlsNote?: string;
  techStack: string[];
  repoUrl?: string;
  /** YYYY-MM-DD, or null until confirmed. */
  releaseDate: string | null;
  /** Six-digit hex. Tints the game's card and pages; needs 3:1 against ink. */
  accentColor: string;
  coverImage: GameImage;
  screenshots: GameImage[];
  trailerUrl?: string;
  changelog?: ChangelogEntry[];
};

export type LiveGame = GameBase & { status: "live"; playUrl: string };

export type UpcomingGame = GameBase & {
  status: "in-development" | "coming-soon";
  playUrl?: never;
};

export type Game = LiveGame | UpcomingGame;
