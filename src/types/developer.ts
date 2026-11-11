/** A game's maker. Every field except the name is optional and shown only if set. */
export type Developer = {
  name: string;
  bio?: string;
  githubUrl?: string;
  email?: string;
  websiteUrl?: string;
};
