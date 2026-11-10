export type Command = {
  id: string;
  label: string;
  /** Secondary text: section name or destination host. */
  detail: string;
  href: string;
  /** "launch" opens a live game in a new tab; the others navigate in the hub. */
  kind: "page" | "game" | "launch";
  /** Game accent for the swatch, when the command belongs to a game. */
  accent?: string;
};
