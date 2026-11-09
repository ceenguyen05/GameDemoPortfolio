import type { NextConfig } from "next";
import { games } from "./src/content/games";
import { createGameRedirects } from "./src/lib/gameRedirects";

const config: NextConfig = {
  poweredByHeader: false,
  async redirects() {
    return createGameRedirects(games);
  },
};
export default config;
