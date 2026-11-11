# Decisions and open items

Why the site is built the way it is, and what still needs content. The look and
behavior are described in [DESIGN.md](DESIGN.md).

## Product decisions

- **Brand:** Playroom. Dark, neutral, modern, and interactive, with no identity tied to
  one game or developer.
- **The hub never hosts a game.** Every Play now is a real link to the game's own site
  and opens in a new tab. So do the Source, GitHub, and share links on a game page.
- **Creators are credited per game.** Names, bios, and contact links appear only on the
  pages of the games they made, never on the shared pages.
- **Games:** ACI: Series 1 and the Devil 2 demo are live. Multi Player Obby and
  Moon Sweeper are browser-first and coming soon.
- **ACI: Series 1** is listed at version 1.7.6 with the feature list from its
  repository. Its screenshots are real captures of the live build; see
  [ACI_CAPTURES.md](ACI_CAPTURES.md).
- **Slugs stay** as `devil-game` and `untitled-obby` even though the titles changed, so
  links already shared keep working.
- **No accounts, analytics, or tracking.** Saved picks live in the visitor's browser.

## Design and behavior

- **Cover deck:** a raised cover would hide the cover to its right, so that neighbor
  stacks just beneath it. Moving across the fan in either direction reaches every cover
  (covered by a browser test).
- **Motion is one-shot or a response.** Entrances run once, sections reveal once on
  scroll, and nothing loops. Reduced motion removes all of it, including when the
  setting changes while the page is open.
- **Scroll reveal is safe by default.** Sections are only hidden after the reveal script
  runs, and only if they start below the fold, so nothing is hidden without JavaScript.
- **Icons are SVG.** Unicode arrows and the asterisk are drawn as emoji on many phones.
- **Text floor:** body and labels are at least 12px; only the decorative cover-deck
  captions go to 10px.
- **Filters** only list statuses that have games. Upcoming games keep a disabled Play
  control and omit empty sections.
- **Sharing:** "Copy game link" copies the game page URL and falls back to a selectable
  field if the clipboard is blocked. Live games also have a `/play/<slug>` redirect.

## Browsing features

- **Saved picks:** bookmark a game and filter the library to saved ones. They are stored
  in the browser only. If storage is blocked they last for the visit, and stale or
  malformed saved data is ignored.
- **Quick look:** a dialog with a game's cover, pitch, key details, save action, and Play
  (or Coming soon), opened without leaving the library. It loads on demand and receives
  only a small public preview of each game, not the full catalog or developer profiles.
- **Previews:** the feature image supports touch swipes, arrow keys, and previous/next
  controls, with a crossfade once the next image has loaded.
- **Pointer lighting:** library tiles get a small light and tilt that follow a mouse.
  Touch devices and reduced-motion visitors skip it.

## Section navigation

All internal links share `components/ui/SiteLink.tsx`. Next.js handles new routes; links within the current route explicitly scroll and focus their destination, even when the URL already ends in the same hash. Repeated clicks do not add duplicate history entries. Modifier clicks and new-tab links retain browser behavior. Links to the current page without a hash return to the top. The native skip link remains a plain anchor.

The library is a programmatic focus target. A small lime marker settles once on arrival, and the visible result count updates with filters. Reduced motion skips the cue and uses instant scrolling. These interactions use no additional dependency or ongoing animation loop.

## Engineering

- **One source of truth.** Routes, metadata, social images, the sitemap, search entries,
  and `/play/<slug>` redirects all come from `src/content/games.ts`. The catalog is
  validated at build time, and a bad entry fails the build with a message naming it.
- **Covers are WebP, never SVG.** On the home page, three SVG covers cost about 2 s of
  blocked main-thread time under Lighthouse's phone throttling (performance 70–73; 97
  with them removed). The vector sources live in `art/covers/` and
  `npm run render:covers` renders them. The catalog rejects `.svg` image paths.
- **The hero image on a game page is preloaded with high fetch priority.** The home
  page's cover deck loads eagerly because it is in the first view on every screen.
- **Stylesheets are split by area** under `src/styles/components/`.
- **`src/lib/theme.ts`** holds the palette for code that can't read CSS variables. A unit
  test compares it with `tokens.css`.
- **Dialogs ignore a late `close` event.** Browsers fire `close` shortly after a dialog
  closes; if the dialog was reopened in between, that event used to close it again.
- **Browser tests run against their own production server** and never reuse one that is
  already running, so they can't validate an old build by mistake. Set `TEST_PORT` if
  port 3100 is taken.
- **Screenshots for the README** are generated by `npm run screenshots`, separate from
  the browser checks, so running tests never rewrites tracked files.
- **TypeScript 6 and ESLint 9**, not 7 and 10: the lint tooling doesn't support the newer
  majors yet. Dependabot ignores those majors.
- **`vercel.json` pins the framework to Next.js**, so the Vercel project can't fall back
  to serving `public/` as a plain static folder.
- **`npm install` locally, `npm ci` in CI.** See
  [DEPLOYING.md](DEPLOYING.md#local-troubleshooting-windows).

## Open items

Marked `TODO(casey)` in `src/content/` where they apply.

1. **Concept covers:** Devil 2, Multi Player Obby, and Moon Sweeper use concept art
   rendered from `art/covers/`. Replace each `cover.webp` with a real capture when the
   game has one, then delete its SVG source.
2. **Devil 2 genre:** empty until it's settled.
3. **Trea's links and bio** (`src/content/developers.ts`): add them if he wants more than
   a name and project credit.
4. **Which game Devil 2 remakes:** the copy stays general until that's confirmed. See
   [CONTENT_SOURCES.md](CONTENT_SOURCES.md).
5. **Upcoming games:** add controls, screenshots, play URLs, versions, and dates as
   builds become ready.
