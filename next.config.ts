import type { NextConfig } from "next";
import { games } from "./src/content/games";
import { createGameRedirects } from "./src/lib/gameRedirects";

const config: NextConfig = {
  poweredByHeader: false,
  images: {
    // 60 for the above-the-fold hero (it's the LCP image), 75 everywhere else.
    qualities: [60, 75],
  },
  // /play/<slug> → each live game's playUrl, generated from the catalog (307).
  async redirects() {
    return createGameRedirects(games);
  },
};

export default config;
