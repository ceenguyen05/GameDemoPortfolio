# Decisions and TODOs

Judgment calls made where the spec was silent or later amended, followed by everything
Casey still needs to confirm or replace. The full requirement-by-requirement review is
in [HANDOFF_AUDIT.md](HANDOFF_AUDIT.md).

## Changes from the original spec (per Casey)

- **Neutral design instead of "tactical spec sheet."** The hub has to suit an FPS, an
  obby, and a moon game at once, so the chrome is a warm, light catalog. Each game's
  accent and art supply the color. The original "near-black base" became a paper base for
  the same reason. See [DESIGN.md](DESIGN.md).
- **Play opens a new tab.** Every Play now is still a real `<a href>`, now with
  `target="_blank" rel="noopener noreferrer"`. The new-tab behavior appears in the
  destination label and in the accessible name ("Play now: ACI: Series 1 (opens in a
  new tab)").
- **Three named upcoming games** replace the spec's two anonymous "classified" slots.
  Casey confirmed they're three separate games: Devil Game, a 2–6 player obby, and Moon
  Sweeper. All three show a "Working title" label (the `workingTitle` flag), and Moon
  Sweeper's copy stays a minimal "In the works" by choice. "Roblox dupe" stays out of
  public copy.
- **ACI release and changelog.** Per Casey, the release date is the hub's launch date
  (2026-11-09), with one 1.7.6 entry listing the game's features. The ACI-SND repo
  tagged 1.7.6 on 2026-11-05; the hub uses Casey's date.
- **No commits after `Version 1.0.5`.** Per Casey, earlier commits were renamed
  `Version 1.0.0`–`1.0.5` without co-author lines, and later work is left uncommitted for
  review.

## Design and UX

- **Library as a numbered catalog, not a card grid.** Rows (number · art · copy ·
  status/Play) fit any number of games with no orphaned grid cells, and status is
  scannable at a glance.
- **Hover/focus reveal: screenshot crossfade.** Chosen over a video loop (no trailers
  exist) or tilt (gimmicky for a catalog). Games without screenshots simply don't fade.
  Disabled under reduced motion.
- **Filters only for statuses that exist.** With no "in development" games, there's no
  empty "In development 0" button. Filtering flips a data attribute and CSS hides rows,
  so rows stay server-rendered.
- **Featured game:** the first live entry in `games.ts`.
- **Upcoming game pages exist.** They show the hero, locked Play, and overview, and they
  omit empty sections (no gallery, controls, or notes) instead of padding them with
  "TBA." The locked Play is a disabled `<button>`, never a link.
- **Hero title size steps down for names over 8 characters**, so longer titles never
  break mid-word.
- **Fact sheet shows the `/play/<slug>` share link** for live games, since those are the
  URLs Casey shares.
- **Type:** Manrope (variable) for display and text, IBM Plex Mono 400 for metadata.
  Nothing renders under 12px. Arial body text from the draft was dropped.
- **Square panels, 3px controls, one shadow (Play).** This avoids the uniform
  rounded-card look.
- **Sound:** synthesized Web Audio blips, off by default, with a distinct two-note sound
  on Play. If storage is blocked, the toggle still works for the current page view.
- **404:** one page for unknown paths and unknown `/play/` slugs. Static text covers
  both cases (no client JS to detect the path), plus a list of every game.

## Engineering

- **Tailwind 4 with `tailwind.config.ts` via `@config`.** This keeps the spec's config
  file. Tokens are CSS variables in `src/styles/tokens.css`, mapped to utilities.
  Components use utilities, and the few compositions that need pseudo-elements live in
  `globals.css` (Play button, keycap, stretched link, filters).
- **TypeScript 6 and ESLint 9, not 7 and 10.** `typescript-eslint` (through
  `eslint-config-next`) supports TypeScript below 6.1, and Next's React, a11y, and import
  plugins stop at ESLint 9. Dependabot ignores those majors (and `@types/node` majors,
  to match Node 22) so it doesn't open PRs that fail CI.
- **`vercel.json` pins `"framework": "nextjs"`.** The Vercel project had been saved
  with preset "Other," which served `public/` statically and returned NOT_FOUND for
  every page.
- **`npm install` locally, `npm ci` in CI.** CI runners start empty, and `npm ci` fails if
  the lockfile drifts. On Windows, `npm ci` fails when a running dev server locks files
  in `node_modules`. See [DEPLOYING.md](DEPLOYING.md#local-troubleshooting-windows).
- **Validation beyond the spec:** non-https repo/trailer URLs, `playUrl` on a non-live
  game, empty copy, malformed changelog entries, accents under 3:1 against ink, and
  missing image files all fail the build.
- **Performance:** library rows and the command list render on the server; only the
  filter, palette, sound toggle, and gallery hydrate. Motion loads with the palette
  only. The LCP hero is served at quality 60, below-the-fold game-page sections use
  `content-visibility: auto`, and mono is one weight.
- **Content imports in `games.ts` and `lib/` use one-level `../` paths**, because
  `next.config.ts` and the Node scripts import the catalog outside Next's alias resolver.
  Everything else uses `@/`.
- **`robots.txt` disallows `/play/`** so crawlers index game pages rather than redirect
  hops. The sitemap includes upcoming game pages at lower priority.
- **Social images are typographic** (catalog style, game accent). Satori can't decode
  WebP, and the cover art reads poorly at thumbnail size anyway.
- **Tests beyond the spec:** `npm test` (catalog and redirect unit tests, run in CI)
  and `npm run test:browser` (Playwright, local only since it needs Chrome). The
  browser suite runs against its own production server on port 3100, so it never picks
  up a dev server on 3000.
- **Removed:** the unused `sharp` dev dependency, the draft's 1,546-line stylesheet,
  and stale local artifacts (`.cache/`, a 1 GB npm cache; `.lighthouseci/`;
  `test-results/`).
- **No analytics, cookies, or tracking.**

## TODO(casey)

Each item is also marked `TODO(casey)` in code, except item 5.

1. **Final names for the upcoming games.** Devil Game, Untitled obby, and Moon Sweeper
   show as working titles. When a name is settled, update `title` and remove
   `workingTitle: true` in `src/content/games.ts`. If you change the obby's `slug`,
   rename `public/games/untitled-obby/` to match.
2. **Devil Game genre:** add it once settled (`genre: []` for now).
3. **ACI screenshots:** `screenshot-01/02/03.webp` come from test sessions and show
   debug health values (+999,999,967 and similar). Replace them with clean captures
   (1280×720 WebP, same filenames). The cover is clean. Casey chose to keep them up
   until then.
4. **Placeholder art** to replace with real covers when available (1280×720 WebP as
   `cover.webp`, then update `coverImage` in `games.ts`):
   - `public/games/devil-game/cover.svg`
   - `public/games/untitled-obby/cover.svg`
   - `public/games/moon-sweeper/cover.svg`
5. **Push and Vercel (not a code TODO):** push the rewritten history, redeploy, and
   confirm the Framework Preset reads Next.js (see [DEPLOYING.md](DEPLOYING.md)).

Not placeholders: the contact email (`ceen2327@gmail.com`), the production URL, and
`docs/screenshot.png` (captured from the production build).
