# Adding a game

1. Choose a unique lowercase, hyphenated slug, such as `my-game`.
2. Make `public/games/my-game/`. Export a **1280 × 720 WebP** cover as `cover.webp`.
   Export gallery images at **1280 × 720** as `screenshot-01.webp`,
   `screenshot-02.webp`, and so on. Aim for 80–85 WebP quality and under 250 KB each.
   SVG covers may use `cover.svg` with the same 1280 × 720 viewBox. No preview video is
   required: cards crossfade to the first screenshot on hover or keyboard focus.
3. Copy the entry below into the array in `src/content/games.ts`, before the classified
   slots. Replace every example with confirmed information. The first live entry is featured.
4. For a live game, use `status: "live"` and an absolute HTTPS `playUrl`.
   For an unreleased game, use `"in-development"` or `"coming-soon"` and **remove**
   `playUrl`. Keep unknown dates as `null`, arrays empty, and annotate uncertain
   content with `// TODO(casey):`. Never invent controls, release notes, or features.
5. Use short descriptive alt text; captions identify the map, moment, or artwork.
   Confirm the accent has at least 4.5:1 contrast against the button's `#111310` text.
6. Run `npm run lint`, `npm run typecheck`, `npm run format`, `npm test`,
   `npm run build`, and `npm run check:links`.
7. Run `npm run start`. Inspect the home card, `/games/my-game`, its social image,
   and the command palette. For live games, verify every Play anchor, Back navigation,
   and `/play/my-game` → the live deployment. Test at 360px and with keyboard only.

```ts
{
  slug: "my-game",
  title: "Your confirmed game title",
  tagline: "A short, factual hook.",
  description: {
    short: "One or two sentences describing the game.",
    long: "Confirmed modes, objectives, and what the player actually does.",
  },
  status: "live",
  genre: ["Confirmed genre"],
  platforms: ["Desktop browser", "Keyboard + mouse"],
  controls: [
    { keys: ["W", "A", "S", "D"], action: "Move" },
    // Replace these example controls with the real default bindings.
  ],
  techStack: ["TypeScript"],
  playUrl: "https://your-game.vercel.app/",
  repoUrl: "https://github.com/ceenguyen05/your-game",
  releaseDate: null, // TODO(casey): Set the confirmed YYYY-MM-DD release date.
  accentColor: "#ff743d",
  coverImage: {
    src: "/games/my-game/cover.webp",
    alt: "Describe what the cover actually shows.",
    caption: "Map / Location",
    width: 1280,
    height: 720,
  },
  screenshots: [
    {
      src: "/games/my-game/screenshot-01.webp",
      alt: "Describe the gameplay shown.",
      caption: "Map / Moment",
      width: 1280,
      height: 720,
    },
  ],
  // Optional: trailerUrl: "https://...",
  changelog: [],
  // Add only confirmed entries:
  // { version: "1.0.0", date: "YYYY-MM-DD", notes: ["What changed."] }
},
```

No route, redirect, sitemap, command, or card code needs changing. Duplicate slugs,
invalid live targets, invalid image metadata, and missing image files fail the build.
Remove a classified slot if the new game takes its place; those slots are ordinary data.
