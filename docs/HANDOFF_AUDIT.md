# Handoff audit

Takeover review of the hub that Astra 6 started. I verified everything below by reading the code
and running it. I trusted no comment, doc, or TODO list.

- **Spec:** [SPEC.md](SPEC.md), including the owner's amendments (neutral design, Play opens a
  new tab, production URL, placeholder answers).
- **Starting point:** commit `c88bfbb`, Astra 6's work committed exactly as found. Before
  that, only the initial README was tracked. All 81 of Astra 6's files were uncommitted.
- **ACI reference:** `ceenguyen05/ACI-SND` at `3ec4a9e` ("Version 1.7.6", 2026-11-05). Checked
  against its README, `package.json`, `src/config/controls.ts`, `src/config/gadgets.ts`, and
  `docs/ZOMBIES.md`.

## Build health

Recon run, from a clean `npm ci` on Node 22.20.0 / npm 10.9.3:

| Command                | Result at handoff                                                               |
| ---------------------- | ------------------------------------------------------------------------------- |
| `npm ci`               | Pass. 666 packages, 0 vulnerabilities. Deprecation warnings only.               |
| `npm run lint`         | Pass                                                                            |
| `npm run typecheck`    | Pass                                                                            |
| `npm run format:check` | **Fail.** 6 files: PlayButton, AboutContent, HomeContent, games.ts, siteConfig.ts, globals.css |
| `npm run build`        | Pass. 14 static routes. Asset validation passes.                                |
| `npm run check:links`  | Pass. `OK 200 ACI: Series 1`.                                                   |
| `npm test` (extra)     | Pass. 5 of 5 content and redirect unit tests.                                   |
| `npm run test:browser` | Stale. Asserts old copy ("LESS SETUP."), same-tab links, and `classified-*` slugs. |

Running production build (`next start`):

| Check                            | Result                                    |
| -------------------------------- | ----------------------------------------- |
| `/play/aci-series-1`             | 307 → `https://aci-series1.vercel.app/` ✔ |
| `/play/unknown-slug`             | 404, themed page ✔                        |
| `/play/coming-soon-02` (not live)| 404 ✔                                     |
| Play anchors (hero, card)        | `href` correct, `target="_blank"` ✔       |
| 360px, all pages                 | No horizontal overflow ✔                  |
| Console                          | Clean, apart from the expected 404 document status |
| `https://gamedemoportfolio.vercel.app/` | Vercel `NOT_FOUND`: `main` has nothing deployable yet |

Lighthouse at handoff (mobile, local, single run):

| Page                 | Performance | Accessibility | Best practices | SEO |
| -------------------- | ----------- | ------------- | -------------- | --- |
| `/`                  | 84          | 96            | 100            | 100 |
| `/games/aci-series-1`| 76          | 100           | 100            | 100 |

The main costs are total blocking time (640 ms), the hero's LCP render delay on the detail page,
contrast on the decorative "CN" monogram, and two `aria-label`s that don't match their visible
text (brand link, ⌘K trigger).

Repo hygiene: no ignored file is tracked. `.gitignore` covers every entry in the spec. The
working tree held stale local artifacts, all ignored and untracked: a 1 GB `.cache/` npm cache,
`.lighthouseci/`, and `test-results/`.

## Requirements

**Found** is the state at handoff. **Final** is the state after this takeover.

| #   | Area      | Requirement                                                     | Found   | Final   | Note                                                                                                                      |
| --- | --------- | --------------------------------------------------------------- | ------- | ------- | ------------------------------------------------------------------------------------------------------------------------- |
| 1   | Stack     | Next.js App Router, latest stable                               | done    | pending | 16.4.5 is npm `latest`                                                                                                    |
| 2   | Stack     | TypeScript strict                                               | done    | pending | TS 6, because `typescript-eslint` caps TS below 6.1 (verified)                                                           |
| 3   | Stack     | Tailwind CSS                                                    | partial | pending | Tailwind 4 is wired up, but no component uses a single utility; all styling sits in a 1,546-line global sheet           |
| 4   | Stack     | Motion, used sparingly                                          | done    | pending | Only the command palette entrance uses it, lazy-loaded                                                                    |
| 5   | Stack     | No backend; static or SSG                                       | done    | pending | Every route prerenders                                                                                                    |
| 6   | Stack     | npm, Node 22 in `.nvmrc` and `engines`                          | done    | pending |                                                                                                                           |
| 7   | Structure | `.github/` layout                                               | done    | pending |                                                                                                                           |
| 8   | Structure | `public/games/<slug>/`, `public/icons/`                         | done    | pending | Folders still named for the old `coming-soon-0N` slots                                                                    |
| 9   | Structure | No empty placeholder folders                                    | done    | pending |                                                                                                                           |
| 10  | Structure | `src/app` is routes only, kept thin                             | done    | pending |                                                                                                                           |
| 11  | Structure | `components/ui`: Button, Keycap, Tag, Dialog                    | partial | pending | No Button. `Tag.tsx` also exports a constant                                                                              |
| 12  | Structure | `components/layout`: Header, Footer, PageShell                  | partial | pending | Also holds page bodies (Home, About, NotFound), which aren't layout                                                       |
| 13  | Structure | `components/games` set                                          | done    | pending |                                                                                                                           |
| 14  | Structure | `command-palette/`, `content/`, `hooks/`, `lib/`, `styles/`, `types/` | done    | pending | Tokens are buried in `globals.css`                                                                                        |
| 15  | Structure | Root config files                                               | done    | pending | Plus `.gitattributes`, `.prettierignore`, `postcss.config.mjs`, Playwright config                                        |
| 16  | Structure | `@/` aliases, no deep relative imports                          | done    | pending | Content and lib files use a single `../` so `next.config.ts` and Node scripts can import them                            |
| 17  | Structure | One component per file, PascalCase; camelCase utilities         | done    | pending |                                                                                                                           |
| 18  | Content   | Typed `Game` with every listed field                            | done    | pending | Discriminated union: `playUrl` is required when status is live                                                            |
| 19  | Content   | Build fails on a live game without an https `playUrl`           | done    | pending | Runs on import of `games.ts`, so it covers build, config, and scripts                                                     |
| 20  | Content   | Build fails on duplicate slugs                                  | done    | pending | Changelog dates and repo/trailer URLs are not validated                                                                   |
| 21  | Content   | ACI controls match the source                                   | done    | pending | All 24 match `DEFAULT_BINDINGS` and the README                                                                            |
| 22  | Content   | ACI features and tech match the source; nothing invented        | partial | pending | Tagline "survive the night" isn't in the source. One changelog note is labeled "Zombies progression" but lists content |
| 23  | Content   | ACI release date and 1.7.6 changelog (owner answer)             | partial | pending | Data is right, but stored as one unformatted JSON line                                                                    |
| 24  | Content   | Future-game slots (owner answer: Devil, obby, Moon Sweeper)     | wrong   | pending | Still two generic "Coming soon" entries                                                                                   |
| 25  | Content   | Tasteful placeholder art                                        | partial | pending | Pastel circle with a play icon. Reads as stock placeholder                                                                |
| 26  | Content   | `ADDING_A_GAME.md`: template, filenames, sizes                  | partial | pending | Good, but the contrast note refers to a button color that no longer exists                                               |
| 27  | Home      | Opening moment with featured game and Play                      | done    | pending |                                                                                                                           |
| 28  | Home      | Library with status filters                                     | done    | pending | Client component hydrates every card                                                                                      |
| 29  | Home      | Keyboard-navigable cards                                        | done    | pending |                                                                                                                           |
| 30  | Home      | One hover/focus reveal, done well                               | done    | pending | Crossfades to a screenshot. Off under reduced motion                                                                      |
| 31  | Home      | Live cards have Play and a details link                         | done    | pending |                                                                                                                           |
| 32  | Detail    | `/games/[slug]` statically generated                            | done    | pending |                                                                                                                           |
| 33  | Detail    | Hero with Play front and center                                 | done    | pending |                                                                                                                           |
| 34  | Detail    | Controls as keycaps                                             | done    | pending |                                                                                                                           |
| 35  | Detail    | Gallery with keyboard lightbox                                  | done    | pending | Native dialog: arrow keys, Esc, focus returns                                                                             |
| 36  | Detail    | Tech stack, changelog, repo link                                | done    | pending | 13 long notes in a narrow column                                                                                          |
| 37  | Play      | Every Play is a real `<a href={playUrl}>`                       | done    | pending |                                                                                                                           |
| 38  | Play      | Opens in a new tab (amendment)                                  | partial | pending | Code is right. `DEPLOYING.md` still says same tab                                                                         |
| 39  | Play      | Destination domain shown next to Play                           | done    | pending | Rendered at 9–10px                                                                                                        |
| 40  | Play      | `/play/<slug>` generated from `games.ts`, temporary             | done    | pending | Verified 307                                                                                                              |
| 41  | Play      | Locked state with status text for non-live games                | done    | pending |                                                                                                                           |
| 42  | Play      | Unknown slug falls through to the themed 404                    | done    | pending |                                                                                                                           |
| 43  | Play      | Accessible name includes the game name                          | done    | pending |                                                                                                                           |
| 44  | Pages     | About/Contact with GitHub and email                             | done    | pending | `ceen2327@gmail.com`, per the owner                                                                                       |
| 45  | Pages     | Themed 404                                                      | done    | pending |                                                                                                                           |
| 46  | QoL       | ⌘K / Ctrl+K palette: pages and launch games                     | done    | pending | Shows ⌘ on Windows. Trigger `aria-label` doesn't match visible text                                                       |
| 47  | QoL       | Sound toggle: off by default, localStorage in try/catch         | partial | pending | When storage throws, the toggle can't turn on at all                                                                      |
| 48  | QoL       | Respects `prefers-reduced-motion`                               | done    | pending |                                                                                                                           |
| 49  | Design    | Neutral design that suits every game (amendment)                | partial | pending | Neutral palette, but bolted on as an override layer above the old tactical sheet                                          |
| 50  | Design    | Display face plus mono via `next/font`                          | done    | pending | Manrope and IBM Plex Mono. Body text falls back to Arial                                                                  |
| 51  | Design    | Restrained palette; each game's accent tints its pages          | partial | pending | The accent appears only as a 3px top border                                                                               |
| 52  | Design    | Tokens in CSS variables and Tailwind config                     | partial | pending | Defined, but nothing consumes them                                                                                        |
| 53  | Design    | Play is the most distinct control, with a snappy press          | partial | pending | Same style as the 404 "Return" button. 1px press                                                                          |
| 54  | Design    | Avoid list                                                      | partial | pending | No gradients or glass, but has stock placeholder art, a ghost-monogram filler, and uniformly rounded panels              |
| 55  | Design    | Terse copy                                                      | done    | pending |                                                                                                                           |
| 56  | Quality   | Lighthouse 95+ ×4 on home and detail (mobile)                   | partial | pending | 84/96/100/100 and 76/100/100/100                                                                                          |
| 57  | Quality   | WCAG AA contrast                                                | partial | pending | Monogram fails. Much of the text is 8–10px                                                                                |
| 58  | Quality   | Focus states, keyboard, semantics, alt text, icon names         | done    | pending |                                                                                                                           |
| 59  | Quality   | 360px with no horizontal scroll                                 | done    | pending |                                                                                                                           |
| 60  | Quality   | `next/image`, `next/font`, no CLS                               | done    | pending | CLS 0                                                                                                                     |
| 61  | SEO       | Per-page metadata, OG/Twitter, per-game `next/og`               | partial | pending | Root OG `alt` contains mojibake (`?`)                                                                                     |
| 62  | SEO       | Sitemap, robots, favicons, manifest                             | done    | pending |                                                                                                                           |
| 63  | Quality   | No console errors in production                                 | done    | pending |                                                                                                                           |
| 64  | CI        | `ci.yml` triggers, concurrency, permissions                     | done    | pending |                                                                                                                           |
| 65  | CI        | Steps in order; setup-node from `.nvmrc` with npm cache         | done    | pending | Also runs `npm test`                                                                                                      |
| 66  | CI        | `check:links` warns, never fails                                | done    | pending |                                                                                                                           |
| 67  | CI        | `.next/cache` cached; current action majors                     | done    | pending | checkout v7, setup-node v7, cache v6 are the latest releases                                                              |
| 68  | CI        | `lighthouse.yml` plus `lighthouserc.json` (warn <0.95, temp storage) | done    | pending |                                                                                                                           |
| 69  | CI        | Dependabot, PR template                                         | done    | pending |                                                                                                                           |
| 70  | CI        | Required `package.json` scripts                                 | done    | pending |                                                                                                                           |
| 71  | CI        | ESLint flat config plus Prettier with the Tailwind plugin, no conflicts | done    | pending |                                                                                                                           |
| 72  | CI        | No Vercel deploy workflow                                       | done    | pending |                                                                                                                           |
| 73  | README    | Sections 1–10 in order, accurate                                | partial | pending | `docs/screenshot.png` missing. Live-link TODO, though the URL is now known. Lists "Classified" slots                     |
| 74  | README    | No emoji, CI badge only                                         | done    | pending |                                                                                                                           |
| 75  | Docs      | `DEPLOYING.md`                                                  | wrong   | pending | Says same tab. Claims env fallbacks the code doesn't have                                                                 |
| 76  | Docs      | `DECISIONS.md`: judgment calls and full TODO list               | wrong   | pending | TODO list is stale. Links a nonexistent `VALIDATION.md` and claims a screenshot exists                                    |
| 77  | Docs      | `DESIGN.md`                                                     | partial | pending | Neutral, but thin: no grid spec, motion table, or real references                                                         |
| 78  | Docs      | `SPEC.md`                                                       | missing | pending | Added during this audit                                                                                                   |
| 79  | Git       | `.gitignore` per spec; lockfile tracked                         | done    | pending |                                                                                                                           |
| 80  | Git       | No ignored files tracked                                        | done    | pending | Nothing but the README was tracked                                                                                        |
| 81  | Git       | Work committed in logical steps                                 | missing | pending | Everything was uncommitted. Snapshot is `c88bfbb`                                                                         |
| 82  | Editor    | `.vscode/extensions.json`, `.editorconfig`                      | done    | pending |                                                                                                                           |
| 83  | Tests     | Browser tests reflect the product                               | wrong   | pending | Assertions are stale                                                                                                      |

## Design assessment

Astra 6 had already switched to a neutral direction: warm paper canvas, near-black ink,
deep-teal accent, Manrope with Plex Mono, and an asymmetric hero-plus-library layout. The
bones are good. The featured panel with its real gameplay capture and the four-cell spec
strip are the strongest parts of the site. The execution is unfinished:

- **The stylesheet fights itself.** About 1,460 lines of the old tactical styles are
  followed by a compressed "Neutral portfolio presentation" layer that overrides about
  60 rules. Dead rules remain (`.media-corner`, `.brand-mark span`, `.maker-monogram span`).
  Tailwind is installed but unused, so the tokens it maps go nowhere.
- **Coming-soon cards look generic.** `public/games/coming-soon-0*/cover.svg` is a pastel
  ring around a rounded play icon, the stock "media placeholder" shape. Both cards are
  titled "Coming soon" with the filler line "A space for what comes next."
- **Filler decoration.** The ghost "CN" monogram on the home maker note fails contrast and
  adds nothing.
- **The Play button isn't special.** It's a black slab with a 1px press. The 404 page's
  "Return to library" reuses the same class, so Play isn't the most distinct control on
  the page. The game's accent never reaches it.
- **Text is too small.** Destination labels, platform notes, captions, and the footer run
  at 8–10px mono. That's hard to read and works against "visually appealing for everyone".
- **The game accent barely appears.** It shows only as a 3px top border on the hero. It
  should identify each game across its card and pages while the hub stays neutral.
- **Detail-page release notes** are a narrow 13-item wall of text.
- **Every panel uses the same 8–10px radius.** That's milder than rounded-2xl with
  shadows, but it softens a layout that should feel editorial.

None of this calls for a different architecture or stack. It needs a coherent restyle on
the existing component tree.

## Step 3 decision

No rewrite is needed. The framework, routing, content model, validation, redirect
generation, and component split all match the spec. I'm keeping the work and finishing it.

## Plan

1. Format the code so that lint, typecheck, format check, and build all pass.
2. Hygiene: delete stale local artifacts. Move page bodies from `layout/` to `views/`.
   Add a `ui/Button` primitive. Split design tokens into `styles/tokens.css`.
3. Content: fix ACI copy against the source and format the changelog. Replace the two
   generic slots with Devil Game, the 2–6 player obby, and Moon Sweeper, with `TODO(casey)`
   markers. Validate changelog dates, optional URLs, and accent contrast.
4. Play flow: match accessible names to visible text. Tie the Play button to the game
   accent. Make the palette trigger show the right shortcut per OS. Fix `DEPLOYING.md`.
5. Features: add a sound-toggle fallback when storage is blocked. Give the 404 a
   play-aware message. Hide empty sections on coming-soon pages.
6. Design: rewrite `DESIGN.md`, then restyle with Tailwind utilities on the existing
   components. Use the library index layout, accent-tinted cards and pages, the new Play
   button and press state, and per-game placeholder art. Server-render library cards so
   less JS hydrates.
7. SEO: fix the OG alt text and make OG cards accent-tinted. Recheck metadata, sitemap,
   robots, and icons.
8. CI: keep the workflows. Update the browser tests to match the product.
9. Rewrite the README and docs. Capture `docs/screenshot.png` from the production build.
10. Verify from a clean install. Run Lighthouse ×3 per page, a keyboard walkthrough, and
    the 360px check. Fill in the **Final** column above.
