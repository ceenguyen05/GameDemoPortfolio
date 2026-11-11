// Renders each art/covers/<slug>.svg to public/games/<slug>/cover.webp (1280×720).
//
// Concept covers are drawn as SVG but served as WebP: an SVG used as an <img> is
// rasterized on the main thread, and each one cost about 0.7 s of blocked time
// on a throttled phone (measured with Lighthouse). Run after editing a source:
//   npm run render:covers
import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import { basename, join } from "node:path";
import { chromium } from "@playwright/test";

const SOURCE_DIR = "art/covers";
const WIDTH = 1280;
const HEIGHT = 720;

const sources = (await readdir(SOURCE_DIR)).filter((file) =>
  file.endsWith(".svg"),
);
const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage();

for (const file of sources) {
  const slug = basename(file, ".svg");
  const svg = await readFile(join(SOURCE_DIR, file), "utf8");
  // Chrome draws the SVG to a canvas and encodes it; no image library needed.
  const base64 = await page.evaluate(
    async ({ svg, width, height }) => {
      const image = new Image();
      image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
      await image.decode();
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      canvas.getContext("2d").drawImage(image, 0, 0, width, height);
      return canvas.toDataURL("image/webp", 0.9).split(",")[1];
    },
    { svg, width: WIDTH, height: HEIGHT },
  );
  const outDir = join("public/games", slug);
  await mkdir(outDir, { recursive: true });
  await writeFile(join(outDir, "cover.webp"), Buffer.from(base64, "base64"));
  console.log(`${file} → ${join(outDir, "cover.webp")}`);
}

await browser.close();
