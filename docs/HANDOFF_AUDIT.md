# Handoff audit

Takeover review of the hub that Astra 6 started. I verified everything below by reading the code
and running it. I trusted no comment, doc, or TODO list.

- **Spec:** [SPEC.md](SPEC.md), including the owner's amendments (neutral design, Play opens a
  new tab, production URL, placeholder answers).
- **Starting point:** Astra 6's work, committed exactly as found in `Version 1.0.0`. Before
  that, only the initial README was tracked; all 81 of Astra 6's files were uncommitted.
  At Casey's request, the takeover commits are named `Version 1.0.0`–`1.0.5`, and all later
  work is left uncommitted for review.
- **ACI reference:** `ceenguyen05/ACI-SND` at `3ec4a9e` ("Version 1.7.6", 2026-11-05). Checked
  against its README, `package.json`, `src/config/controls.ts`, `src/config/gadgets.ts`, and
  `docs/ZOMBIES.md`.

## Build health

### At handoff

From a clean `npm ci` on Node 22.20.0 / npm 10.9.3:

| Command                | Result                                                                                         |
| ---------------------- | ---------------------------------------------------------------------------------------------- |
| `npm ci`               | Pass. 666 packages, 0 vulnerabilities. Deprecation warnings only.                              |
| `npm run lint`         | Pass                                                                                           |
| `npm run typecheck`    | Pass                                                                                           |
| `npm run format:check` | **Fail.** 6 files: PlayButton, AboutContent, HomeContent, games.ts, siteConfig.ts, globals.css |
| `npm run build`        | Pass. 14 static routes. Asset validation passes.                                               |
| `npm run check:links`  | Pass. `OK 200 ACI: Series 1`.                                                                  |
| `npm test` (extra)     | Pass. 5 of 5 content and redirect unit tests.                                                  |
| `npm run test:browser` | Stale. Asserts old copy ("LESS SETUP."), same-tab links, and `classified-*` slugs.             |

Running build: `/play/aci-series-1` → 307 to the live game; unknown and non-live slugs → 404;
Play anchors correct with `target="_blank"`; no overflow at 360px; console clean.
**Production (`gamedemoportfolio.vercel.app`) returned Vercel `NOT_FOUND` for every page,
while `public/` files loaded. The project's Framework Preset was "Other."**

Lighthouse (mobile, local, one run): `/` 84 / 96 / 100 / 100;
`/games/aci-series-1` 76 / 100 / 100 / 100 (Performance / Accessibility / Best practices / SEO).

Repo hygiene: no ignored file was tracked. `.gitignore` covered every entry in the spec.
Stale ignored artifacts sat in the tree: a 1 GB `.cache/` npm cache, `.lighthouseci/`, and
`test-results/`.

### Final

All commands below run in a fresh copy of the git-visible files, the same thing a CI
runner sees. I used a copy because a dev server was running from the working
folder's `node_modules`.

| Command                | Result                                                              |
| ---------------------- | ------------------------------------------------------------------- |
| `npm ci`               | Pass, 0 vulnerabilities                                             |
| `npm install` (fresh)  | Pass; `package-lock.json` unchanged                                 |
| `npm run lint`         | Pass                                                                |
| `npm run typecheck`    | Pass                                                                |
| `npm run format:check` | Pass                                                                |
| `npm test`             | Pass, 10 of 10                                                      |
| `npm run build`        | Pass. 16 static routes. "Validated 4 games and their assets."       |
| `npm run check:links`  | Pass. `OK 200 ACI: Series 1: https://aci-series1.vercel.app/`       |
| `npm run test:browser` | Pass, 9 of 9 (Playwright against the production build, real Chrome) |

The browser suite covers:

- Every Play anchor's `href`, `target`, `rel`, and accessible name.
- A real click opening `aci-series1.vercel.app` in a new tab while the hub stays put.
- `/play/aci-series-1` landing on the live game.
- 404s for unknown and non-live `/play/` slugs, with the themed page and its library link.
- Keyboard-only use: skip link, ⌘K/Ctrl+K palette search, Enter to navigate, and Esc.
- The gallery lightbox: Enter to open, ← → to step, Esc to close, focus returns.
- Filters, and the sound toggle, including with storage blocked.
- Every page at 360px with reduced motion: no horizontal scroll, and no console errors
  or warnings.
- Metadata, sitemap, robots, manifest, icons, and both OG image routes.

Lighthouse, mobile, 3 runs each against the production build (median, with range):

| Page                  | Performance | Accessibility | Best practices | SEO |
| --------------------- | ----------- | ------------- | -------------- | --- |
| `/`                   | 90 (87–94)  | 100           | 100            | 100 |
| `/games/aci-series-1` | 81 (81–94)  | 100           | 100            | 100 |

Accessibility, Best practices, and SEO are 100 on every run, and CLS is 0. Performance
misses 95 on both pages, and the numbers here are noisy: across this session, home scored
between 87 and 99 on identical builds, and total blocking time ranged from 139 to 878 ms.
The machine was also running a Next dev server, the ACI Vite dev server, and other agents.

- **What remains on `/games/aci-series-1` is the simulated LCP (about 2.6–3.2 s).** The LCP
  element is the 28 KB hero image. In the real trace it finished loading at 159 ms and
  painted with the first frame (observed FCP = LCP). Lighthouse's simulation models it
  waiting behind about 190 KB of framework JavaScript on the local HTTP/1.1 server. A page
  with a 1 KB SVG cover and no gallery (`/games/devil-game`) shows the same 2.7 s, so it
  isn't image weight.
- **What was done:**
  - Server-rendered library rows and command list; only the filter, palette, sound
    toggle, and gallery hydrate.
  - Motion loads only with the palette.
  - One mono weight.
  - Hero at quality 60.
  - `content-visibility: auto` below the fold.
  - The unused `sharp` dependency removed.
- **Next check:** the Lighthouse workflow on the first PR (GitHub runner), and PageSpeed
  Insights against production once it deploys over HTTP/2.

Git: no ignored or generated file is tracked. Per Casey, the remaining changes are left
uncommitted, so `git status` lists them.

## Requirements

**Found** is the state at handoff. **Final** is the state after this takeover.

| #   | Area      | Requirement                                                             | Found   | Final   | Note                                                                                                                    |
| --- | --------- | ----------------------------------------------------------------------- | ------- | ------- | ----------------------------------------------------------------------------------------------------------------------- |
| 1   | Stack     | Next.js App Router, latest stable                                       | done    | done    | 16.4.5, the npm `latest`                                                                                                |
| 2   | Stack     | TypeScript strict                                                       | done    | done    | TS 6, because `typescript-eslint` caps TS below 6.1 (verified)                                                          |
| 3   | Stack     | Tailwind CSS                                                            | partial | done    | Was: a 1,546-line global sheet with no utilities. Now: utilities in components, plus a ~180-line `globals.css`          |
| 4   | Stack     | Motion, used sparingly                                                  | done    | done    | Palette entrance only, lazy-loaded with the palette                                                                     |
| 5   | Stack     | No backend; static or SSG                                               | done    | done    | 16 prerendered routes                                                                                                   |
| 6   | Stack     | npm, Node 22 in `.nvmrc` and `engines`                                  | done    | done    |                                                                                                                         |
| 7   | Structure | `.github/` layout                                                       | done    | done    |                                                                                                                         |
| 8   | Structure | `public/games/<slug>/`, `public/icons/`                                 | done    | done    | Slot folders replaced by `devil-game/`, `untitled-obby/`, `moon-sweeper/`                                               |
| 9   | Structure | No empty placeholder folders                                            | done    | done    |                                                                                                                         |
| 10  | Structure | `src/app` is routes only, kept thin                                     | done    | done    |                                                                                                                         |
| 11  | Structure | `components/ui`: Button, Keycap, Tag, Dialog                            | partial | done    | Added `Button`; status labels moved to `lib/gameStatus.ts`                                                              |
| 12  | Structure | `components/layout`: Header, Footer, PageShell                          | partial | done    | Page bodies moved to `components/views/`                                                                                |
| 13  | Structure | `components/games` set                                                  | done    | done    | Plus `LibraryFilter`, `GameFacts`, `Changelog`, `GameDetails`                                                           |
| 14  | Structure | `command-palette/`, `content/`, `hooks/`, `lib/`, `styles/`, `types/`   | done    | done    | Tokens live in `styles/tokens.css`                                                                                      |
| 15  | Structure | Root config files                                                       | done    | done    | Plus `vercel.json` (framework pin), `.gitattributes`, `.prettierignore`, `postcss.config.mjs`, Playwright config        |
| 16  | Structure | `@/` aliases, no deep relative imports                                  | done    | done    | Single `../` only in the catalog and validation, which `next.config.ts` and scripts import                              |
| 17  | Structure | One component per file, PascalCase; camelCase utilities                 | done    | done    | `CommandLink` split out of the palette                                                                                  |
| 18  | Content   | Typed `Game` with every listed field                                    | done    | done    | Plus optional `controlsNote`; `LiveGame` / `UpcomingGame` union                                                         |
| 19  | Content   | Build fails on a live game without an https `playUrl`                   | done    | done    | Unit-tested                                                                                                             |
| 20  | Content   | Build fails on duplicate slugs                                          | done    | done    | Also checks changelog dates, https repo/trailer URLs, playUrl on non-live games, empty copy, and accent contrast        |
| 21  | Content   | ACI controls match the source                                           | done    | done    | All 24 match `DEFAULT_BINDINGS`                                                                                         |
| 22  | Content   | ACI features and tech match the source; nothing invented                | partial | done    | Tagline now quotes the README; captions describe each capture                                                           |
| 23  | Content   | ACI release date and 1.7.6 changelog (owner answer)                     | partial | done    | Formatted data; 14 notes, each traceable to the README                                                                  |
| 24  | Content   | Future-game slots (owner answer: Devil, obby, Moon Sweeper)             | wrong   | done    | Three named entries; unknowns are `TODO(casey)` (see DECISIONS)                                                         |
| 25  | Content   | Tasteful placeholder art                                                | partial | done    | Per-game flat SVGs in each accent, marked placeholder                                                                   |
| 26  | Content   | `ADDING_A_GAME.md`: template, filenames, sizes                          | partial | done    | Rewritten: asset table, template, accent rule, checks                                                                   |
| 27  | Home      | Opening moment with featured game and Play                              | done    | done    | Intro with catalog counts, then the featured panel                                                                      |
| 28  | Home      | Library with status filters                                             | done    | done    | Rows render on the server; filters only for statuses that exist                                                         |
| 29  | Home      | Keyboard-navigable cards                                                | done    | done    | Title link covers the row; Play is a separate tab stop; tested                                                          |
| 30  | Home      | One hover/focus reveal, done well                                       | done    | done    | Screenshot crossfade on hover and focus-within; off under reduced motion                                                |
| 31  | Home      | Live cards have Play and a details link                                 | done    | done    |                                                                                                                         |
| 32  | Detail    | `/games/[slug]` statically generated                                    | done    | done    |                                                                                                                         |
| 33  | Detail    | Hero with Play front and center                                         | done    | done    | Plus a closing launch band                                                                                              |
| 34  | Detail    | Controls as keycaps                                                     | done    | done    | Two-column keycap grid; per-game note from data                                                                         |
| 35  | Detail    | Gallery with keyboard lightbox                                          | done    | done    | Tested: Enter, ← →, Esc, focus return                                                                                   |
| 36  | Detail    | Tech stack, changelog, repo link                                        | done    | done    | Sticky fact sheet (stack, source, share link); two-column numbered notes                                                |
| 37  | Play      | Every Play is a real `<a href={playUrl}>`                               | done    | done    | Tested                                                                                                                  |
| 38  | Play      | Opens in a new tab (amendment)                                          | partial | done    | Code, palette, and docs agree; tested with a real click                                                                 |
| 39  | Play      | Destination domain shown next to Play                                   | done    | done    | 12px mono: `aci-series1.vercel.app ↗ · opens in a new tab`                                                              |
| 40  | Play      | `/play/<slug>` generated from `games.ts`, temporary                     | done    | done    | 307, tested                                                                                                             |
| 41  | Play      | Locked state with status text for non-live games                        | done    | done    | Disabled button with lock and status; never a link                                                                      |
| 42  | Play      | Unknown slug falls through to the themed 404                            | done    | done    | Tested                                                                                                                  |
| 43  | Play      | Accessible name includes the game name                                  | done    | done    | "Play now: ACI: Series 1 (opens in a new tab)"                                                                          |
| 44  | Pages     | About/Contact with GitHub and email                                     | done    | done    | `ceen2327@gmail.com`, per the owner                                                                                     |
| 45  | Pages     | Themed 404                                                              | done    | done    | Covers bad `/play` links; lists every game                                                                              |
| 46  | QoL       | ⌘K / Ctrl+K palette: pages and launch games                             | done    | done    | OS-aware hint; grouped results; commands built on the server                                                            |
| 47  | QoL       | Sound toggle: off by default, localStorage in try/catch                 | partial | done    | In-memory fallback when storage is blocked (tested)                                                                     |
| 48  | QoL       | Respects `prefers-reduced-motion`                                       | done    | done    |                                                                                                                         |
| 49  | Design    | Neutral design that suits every game (amendment)                        | partial | done    | One coherent catalog system; see DESIGN.md                                                                              |
| 50  | Design    | Display face plus mono via `next/font`                                  | done    | done    | Manrope (display and text), Plex Mono                                                                                   |
| 51  | Design    | Restrained palette; each game's accent tints its pages                  | partial | done    | Accent on swatches, hero rule, Play block and base, gallery frames, version chip                                        |
| 52  | Design    | Tokens in CSS variables and Tailwind config                             | partial | done    | `tokens.css` mapped by `tailwind.config.ts`                                                                             |
| 53  | Design    | Play is the most distinct control, with a snappy press                  | partial | done    | Only shadowed control; 4px key-press in 60ms                                                                            |
| 54  | Design    | Avoid list                                                              | partial | done    | No gradients, glass, filler, or uniform rounded cards                                                                   |
| 55  | Design    | Terse copy                                                              | done    | done    |                                                                                                                         |
| 56  | Quality   | Lighthouse 95+ ×4 on home and detail (mobile)                           | partial | partial | A11y, BP, and SEO 100 on both. Performance 90 (home) and 81 (detail), medians on a noisy local machine; see Final above |
| 57  | Quality   | WCAG AA contrast                                                        | partial | done    | All text ≥ 5:1; nothing under 12px; monogram removed                                                                    |
| 58  | Quality   | Focus states, keyboard, semantics, alt text, icon names                 | done    | done    | Names match visible text (no Lighthouse label mismatches)                                                               |
| 59  | Quality   | 360px with no horizontal scroll                                         | done    | done    | All six pages tested                                                                                                    |
| 60  | Quality   | `next/image`, `next/font`, no CLS                                       | done    | done    | CLS 0 on every run                                                                                                      |
| 61  | SEO       | Per-page metadata, OG/Twitter, per-game `next/og`                       | partial | done    | Alt text fixed; accent-tinted catalog cards                                                                             |
| 62  | SEO       | Sitemap, robots, favicons, manifest                                     | done    | done    | Tested                                                                                                                  |
| 63  | Quality   | No console errors in production                                         | done    | done    | Tested on every page                                                                                                    |
| 64  | CI        | `ci.yml` triggers, concurrency, permissions                             | done    | done    |                                                                                                                         |
| 65  | CI        | Steps in order; setup-node from `.nvmrc` with npm cache                 | done    | done    | Every step passes from a clean install                                                                                  |
| 66  | CI        | `check:links` warns, never fails                                        | done    | done    |                                                                                                                         |
| 67  | CI        | `.next/cache` cached; current action majors                             | done    | done    | checkout v7, setup-node v7, cache v6                                                                                    |
| 68  | CI        | `lighthouse.yml` plus `lighthouserc.json` (warn <0.95, temp storage)    | done    | done    |                                                                                                                         |
| 69  | CI        | Dependabot, PR template                                                 | done    | done    | Ignores ESLint/TS/`@types/node` majors that would fail CI                                                               |
| 70  | CI        | Required `package.json` scripts                                         | done    | done    |                                                                                                                         |
| 71  | CI        | ESLint flat config plus Prettier with the Tailwind plugin, no conflicts | done    | done    |                                                                                                                         |
| 72  | CI        | No Vercel deploy workflow                                               | done    | done    | `vercel.json` only pins the framework                                                                                   |
| 73  | README    | Sections 1–10 in order, accurate                                        | partial | done    | Real screenshot, live URL, four-game table, `npm install`                                                               |
| 74  | README    | No emoji, CI badge only                                                 | done    | done    |                                                                                                                         |
| 75  | Docs      | `DEPLOYING.md`                                                          | wrong   | done    | Starts with the NOT_FOUND fix; new-tab, redirects, rulesets, Windows npm tips                                           |
| 76  | Docs      | `DECISIONS.md`: judgment calls and full TODO list                       | wrong   | done    | Rewritten                                                                                                               |
| 77  | Docs      | `DESIGN.md`                                                             | partial | done    | Rewritten before the restyle                                                                                            |
| 78  | Docs      | `SPEC.md`                                                               | missing | done    | Spec plus owner amendments                                                                                              |
| 79  | Git       | `.gitignore` per spec; lockfile tracked                                 | done    | done    |                                                                                                                         |
| 80  | Git       | No ignored files tracked                                                | done    | done    |                                                                                                                         |
| 81  | Git       | Work committed in logical steps                                         | missing | owner   | Per Casey: commits renamed `Version 1.0.x`; later work uncommitted                                                      |
| 82  | Editor    | `.vscode/extensions.json`, `.editorconfig`                              | done    | done    |                                                                                                                         |
| 83  | Tests     | Browser tests reflect the product                                       | wrong   | done    | Rewritten; 9 of 9 pass                                                                                                  |
| 84  | Deploy    | Production serves the site                                              | wrong   | pending | `vercel.json` fixes the preset; takes effect on the next push                                                           |

## Design assessment (at handoff)

Astra 6 had already switched to a neutral direction: warm paper canvas, near-black ink,
deep-teal accent, Manrope with Plex Mono, and an asymmetric hero-plus-library layout. The
bones were good; the featured panel with its real gameplay capture and the four-cell spec
strip were the strongest parts, and both survive in the final design. The execution was
unfinished:

- **The stylesheet fought itself.** About 1,460 lines of the old tactical styles were
  followed by a compressed "Neutral portfolio presentation" layer that overrode about 60
  rules, and dead rules remained. Tailwind was installed but unused.
- **Coming-soon cards looked generic.** A pastel ring around a rounded play icon, titled
  "Coming soon" twice, with the filler line "A space for what comes next."
- **Filler decoration.** A ghost "CN" monogram that failed contrast.
- **The Play button wasn't special.** A black slab with a 1px press, shared with the 404's
  "Return" button, with no trace of the game's accent.
- **Text was too small.** Labels and captions ran at 8–10px.
- **The game accent barely appeared,** as a 3px rule on the hero only.
- **Release notes** were a narrow 13-item wall of text.
- **Every panel had the same 8–10px radius.**

## Step 3 decision

No rewrite was needed. The framework, routing, content model, validation, redirect
generation, and component split matched the spec, so I kept the work and finished it.

## Plan (as executed)

1. Format so lint, typecheck, format check, and build pass.
2. Hygiene: delete stale artifacts; move page bodies to `views/`; add `ui/Button`; split
   tokens into `tokens.css`.
3. Content: fix ACI copy; add the three named upcoming games; extend validation.
4. Play flow: accessible names, accent-tied Play button, OS-aware palette hint, docs.
5. Features: sound fallback, a 404 that covers `/play` links, and no empty sections on
   upcoming pages.
6. Design: rewrite `DESIGN.md`, then restyle on the existing component tree.
7. SEO: OG alt text and accent-tinted cards; recheck metadata and icons.
8. CI: Dependabot ignore rules, the Vercel framework pin, and rewritten browser tests.
9. Docs: README, DEPLOYING, ADDING_A_GAME, DECISIONS, and `docs/screenshot.png`.
10. Verify from a clean install, run Lighthouse ×3, and fill in the Final column.
