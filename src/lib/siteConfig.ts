/** Shared collection identity; personal contact details belong to game developers. */
export const siteConfig = {
  name: "Playroom",
  description:
    "Small games. Good company. A shared collection of browser games to explore, pass around, and play.",
  url: (
    process.env.NEXT_PUBLIC_SITE_URL || "https://gamedemoportfolio.vercel.app"
  ).replace(/\/+$/, ""),
};
