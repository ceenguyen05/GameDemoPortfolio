# Playroom

**One home for browser games, one click from playing.** Playroom showcases each game
with its screenshots, controls, and release notes, then sends players straight to the
game's own live site.

**Live:** <https://gamedemoportfolio.vercel.app>
[![CI](https://github.com/ceenguyen05/GameDemoPortfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/ceenguyen05/GameDemoPortfolio/actions/workflows/ci.yml)

![Playroom's home page: a fan of game covers and the featured game](docs/screenshot.png)

More views: [full home page](docs/screenshot-full.png) ·
[quick look](docs/screenshot-quicklook.png) · [phone](docs/screenshot-mobile.png)

## Games

| Game              | Creator      | Status      | Play                                                      |
| ----------------- | ------------ | ----------- | --------------------------------------------------------- |
| ACI: Series 1     | Casey Nguyen | Live        | [aci-series1.vercel.app](https://aci-series1.vercel.app/) |
| Devil 2           | Trea Edwards | Coming soon | —                                                         |
| Multi Player Obby | Casey Nguyen | Coming soon | —                                                         |
| Moon Sweeper      | Casey Nguyen | Coming soon | —                                                         |

## Highlights

- **Add a game with data, not code.** One entry in `src/content/games.ts` generates its
  page, library tile, search entry, social image, sitemap entry, and a shareable
  `/play/<slug>` redirect.
- **Bad data can't ship.** The catalog is validated at build time: a live game without
  a valid HTTPS link, a duplicate slug, or a missing image fails the build with a clear
  message.
- **Built to browse.** A hoverable deck of covers, quick look, saved picks, status
  filters, a screenshot gallery, and a ⌘K / Ctrl+K search that can launch any live game.
- **Navigation that keeps up.** Section links scroll on every click, including return visits from game pages and search. The library shows a live result count; navigation and section arrivals have small motion cues.
- **Keyboard and screen-reader friendly.** Every control is reachable by keyboard,
  motion respects reduced-motion settings, and layouts hold down to 360px.
- **Fully static.** No backend, accounts, or tracking. Saved picks stay in the browser.
- **Checked on every push.** Lint, types, formatting, unit tests, and a production
  build and browser interaction tests run in CI. Lighthouse runs on pull requests.

## ACI screenshot update

Six fresh full-HD captures from the live v1.7.6 build replace the old debug-health images: two of ACI HQ, two of ACI Building 2, the first-load map fly-through with **Click or press any key**, and an active Zombies wave. Every gameplay capture shows normal 100 health.

The title-screen image is ACI's cover in the homepage four-card deck, spotlight, library, quick look, and game page. The gallery contains all six; the spotlight and game-page preview offer the same six without repeating the cover. Upcoming games retain their own concept artwork.

[View all six captures](docs/aci-captures.png) or read their [source and capture notes](docs/ACI_CAPTURES.md).

## Tech stack

Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · Motion · Playwright · Node 22

## Run locally

Requires Node 22 (see `.nvmrc`).

```sh
npm install
npm run dev     # http://localhost:3000
npm run build
```

## Validate and deploy

```sh
npm run lint
npm run typecheck
npm run format:check
npm test
npm run build
npm run test:browser
npm run check:links
```

Browser checks use installed Google Chrome locally; CI installs Chromium. Set `TEST_PORT` if 3100 is busy. Run `npm run screenshots` after visual changes to refresh the README images.

Vercel deploys automatically when you push to the connected production branch (`main`); no manual deploy command or environment secrets are required. CI checks the push independently, so run the checks before pushing. See [deployment settings and verification](docs/DEPLOYING.md).

## Add a game

Add one entry to `src/content/games.ts` and its images to `public/games/<slug>/`.
Everything else follows from that entry; see
[docs/ADDING_A_GAME.md](docs/ADDING_A_GAME.md) for the template and image sizes.

## Project structure

```text
art/            Vector sources for concept covers
docs/           Design, decisions, deploying, adding a game
public/         Game images and icons
scripts/        Catalog validation, link check, cover rendering
tests/          Unit tests and browser checks
src/
  app/          Routes, metadata, social images, sitemap
  components/   ui, layout, games, command-palette, views
  content/      games.ts (the catalog) and developers.ts
  hooks/        Dialog, sound, saved games
  lib/          Validation, redirects, formatting, theme
  styles/       Design tokens and one stylesheet per area
  types/        Shared TypeScript types
```

## Docs

[Design](docs/DESIGN.md) · [Decisions](docs/DECISIONS.md) ·
[Deploying](docs/DEPLOYING.md) · [Adding a game](docs/ADDING_A_GAME.md) ·
[Content sources](docs/CONTENT_SOURCES.md) · [ACI captures](docs/ACI_CAPTURES.md)

Built by Casey Nguyen · [github.com/ceenguyen05](https://github.com/ceenguyen05)
