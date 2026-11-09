import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Casey Nguyen / Games",
    short_name: "Casey Games",
    description: "Browser-first games by Casey Nguyen",
    start_url: "/",
    display: "browser",
    background_color: "#f4f3ee",
    theme_color: "#f4f3ee",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
