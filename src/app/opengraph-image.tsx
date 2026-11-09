import { createOgImage } from "@/lib/ogImage";
export const alt = "Casey Nguyen games ? Small worlds. Open to everyone.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return createOgImage(
    "Small worlds. Open to everyone.",
    "Browser-first games by Casey Nguyen.",
  );
}
