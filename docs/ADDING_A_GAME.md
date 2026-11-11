# Adding a game

One entry in `src/content/games.ts` plus its images. No page, route, redirect,
sitemap, palette, or OG code changes. The build validates the entry and fails with
a message naming the slug and the problem.

## 1. Pick a slug

Lowercase words joined by hyphens, unique across the catalog: `my-game`. It becomes
`/games/my-game`, `/play/my-game`, and the asset folder `public/games/my-game/`.

## 2. Add the images

Put them in `public/games/<slug>/`, using these filename conventions:

| File                 | Size                            | Format                       | Notes                                                   |
| -------------------- | ------------------------------- | ---------------------------- | ------------------------------------------------------- |
| `cover.webp`         | 16:9; 1280 × 720 or 1920 × 1080 | WebP, quality 80–85, ≤250 KB | Hero and library art. Keep the subject near the center. |
| `screenshot-01.webp` | Same 16:9 dimensions            | WebP, ≤250 KB                | Also the hover/focus image on the library row.          |
| `screenshot-02.webp` | Same 16:9 dimensions            | WebP, ≤250 KB                | Add as many as you like, numbered in order.             |

Use the actual pixel dimensions in the catalog. ACI uses 1920 x 1080 captures, all below 250 KB. A cover can also appear in the gallery; the hero deduplicates its source URL.

No real art yet? Draw concept artwork as `art/covers/<slug>.svg`
(`viewBox="0 0 1280 720"`) and run `npm run render:covers` to write
`public/games/<slug>/cover.webp`. The catalog rejects SVG image paths.

Capture screenshots from a normal session: no debug values, cheats, or dev
overlays in the HUD.

## 3. Add the entry

Paste this into the `games` array in `src/content/games.ts`. Array order is display
order, and the first `"live"` game is featured on the home page. Replace every
value with confirmed information. If something isn't settled, leave it empty and
mark it with a TODO. Never guess controls, features, or dates.

```ts
{
  slug: "my-game",
  title: "My Game",
  developer: developers.casey, // add a new maker in src/content/developers.ts
  tagline: "One line that says what you do in it.",
  description: {
    short: "One or two sentences for cards and search results.",
    long: "A paragraph for the game page: modes, goal, what makes it worth a click.",
  },
  status: "live", // or "in-development" | "coming-soon" (then delete playUrl)
  genre: ["Puzzle"],
  platforms: ["Desktop browser", "Keyboard + mouse"],
  controlsNote: "Optional: how input capture works, where to rebind keys.",
  controls: [
    { keys: ["W", "A", "S", "D"], action: "Move" },
    { keys: ["Space"], action: "Jump" },
  ],
  techStack: ["TypeScript"],
  playUrl: "https://my-game.vercel.app/", // live games only; must be https://
  repoUrl: "https://github.com/ceenguyen05/my-game", // optional
  releaseDate: "2026-12-01", // YYYY-MM-DD, or null
  accentColor: "#5fb3a1", // see step 4
  coverImage: {
    src: "/games/my-game/cover.webp",
    alt: "Describe what the image shows, not what the game is.",
    caption: "Level 1 / Rooftops",
    width: 1280,
    height: 720,
  },
  screenshots: [
    {
      src: "/games/my-game/screenshot-01.webp",
      alt: "Describe the moment shown.",
      caption: "Level 2 / Boss",
      width: 1280,
      height: 720,
    },
  ],
  // trailerUrl: "https://...",                 // optional, https://
  changelog: [
    // newest first; omit the field until there's a release
    { version: "1.0.0", date: "2026-12-01", notes: ["First release."] },
  ],
},
```

## 4. Choose the accent

`accentColor` colors the game's swatch, its hero rule, its Play button's launch
block and base, and its gallery hover frames. It always sits behind ink (`#101210`)
glyphs, so it needs **at least 3:1 contrast against `#101210`**. The build checks
this and suggests a lighter color if it fails. Mid-to-light, saturated colors work
best. Avoid near-blacks and greys.

## 5. Check it

```sh
npm install
npm run lint && npm run typecheck && npm run format && npm test
npm run build        # validates the catalog and that every image file exists
npm run check:links  # confirms each live playUrl answers 2xx/3xx
npm start            # http://localhost:3000
```

In the running build, check:

- The library row (art, hover/focus crossfade, Play) and `/games/my-game`.
- **Play now** opens `playUrl` in a new tab, and `/play/my-game` redirects there.
- `/games/my-game/opengraph-image` renders, and the game appears in ⌘K / Ctrl+K.
- The page at 360px wide, and using only the keyboard.

## Retiring a placeholder

The upcoming entries (`devil-game`, `untitled-obby`, `moon-sweeper`) are ordinary
data. When one ships, update it in place: set `status: "live"`, add `playUrl` and
real art, and delete its `art/covers/<slug>.svg` source. If you rename its slug, rename the asset
folder to match.
