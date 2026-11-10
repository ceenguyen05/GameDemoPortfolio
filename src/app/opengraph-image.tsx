import { createOgImage, ogSize } from "@/lib/ogImage";
import { siteConfig } from "@/lib/siteConfig";

export const alt = "Casey Nguyen / Games: small worlds, open to everyone";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return createOgImage({
    eyebrow: "Browser games",
    title: "Small worlds. Open to everyone.",
    subtitle: "Every game by Casey Nguyen, one click from playing.",
    footer: new URL(siteConfig.url).host,
  });
}
