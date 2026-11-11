import { createOgImage, ogSize } from "@/lib/ogImage";
import { siteConfig } from "@/lib/siteConfig";

export const alt = `${siteConfig.name}: small games, good company`;
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return createOgImage({
    eyebrow: "Browser games",
    title: "One more quick game.",
    subtitle: "Small games. Good company. Something different in every tab.",
    footer: new URL(siteConfig.url).host,
  });
}
