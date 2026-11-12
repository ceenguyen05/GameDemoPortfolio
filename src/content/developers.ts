import type { Developer } from "../types/developer";

/**
 * Shared identities for game credits and /makers. Extended backgrounds live
 * in makerProfiles.ts; games reference these objects rather than copying them.
 */
export const developers = {
  casey: {
    slug: "casey-nguyen",
    name: "Casey Nguyen",
    bio: "Software engineer at Applied Concepts pursuing an M.S. in AI at UT Austin. Creator of Playroom and ACI: Series 1, building full-stack web applications and real-time multiplayer games.",
    githubUrl: "https://github.com/ceenguyen05",
    linkedinUrl: "https://www.linkedin.com/in/caseynguyen2327",
    email: "ceen2327@gmail.com",
  },
  trea: {
    slug: "trea-edwards",
    name: "Trea Edwards",
    bio: "Electrical engineer inspired by game development and AI. Creator of the browser-first Devil 2 project.",
    // TODO(casey): add Trea's public links if he supplies them.
  },
} satisfies Record<string, Developer>;
