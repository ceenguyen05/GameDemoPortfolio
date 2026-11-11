import type { Developer } from "../types/developer";

/**
 * The people who make the games. A developer's details are shown only on the
 * pages of their own games, never on the shared hub pages.
 */
export const developers = {
  casey: {
    name: "Casey Nguyen",
    bio: "Software engineer building browser-first games. Creator of ACI: Series 1, Multi Player Obby, and Moon Sweeper.",
    githubUrl: "https://github.com/ceenguyen05",
    email: "ceen2327@gmail.com",
  },
  trea: {
    name: "Trea Edwards",
    bio: "Creator of the browser-first Devil 2 project.",
    // TODO(casey): add Trea's public links (githubUrl, email, websiteUrl) and a
    // fuller bio if he wants them shown.
  },
} satisfies Record<string, Developer>;
