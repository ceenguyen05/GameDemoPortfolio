# Casey Nguyen / Games

A hub for my browser-first games that links players straight to each game's live site.

![The hub's home page: featured game and the game library](docs/screenshot.png)

**Live:** <https://gamedemoportfolio.vercel.app>
[![CI](https://github.com/ceenguyen05/GameDemoPortfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/ceenguyen05/GameDemoPortfolio/actions/workflows/ci.yml)

## Games

| Game            | Status      | Play                                                      |
| --------------- | ----------- | --------------------------------------------------------- |
| ACI: Series 1   | Live        | [aci-series1.vercel.app](https://aci-series1.vercel.app/) |
| Devil Game\*    | Coming soon | —                                                         |
| Untitled obby\* | Coming soon | —                                                         |
| Moon Sweeper\*  | Coming soon | —                                                         |

\*Working title.

## Tech stack

Next.js 16 (App Router, fully static) · TypeScript · Tailwind CSS 4 · Motion · Node 22 · npm

## Run locally

Requires Node 22 (see `.nvmrc`).

```sh
npm install
npm run dev     # http://localhost:3000
npm run build
```

## Add a game

Add one entry to `src/content/games.ts` and its images to `public/games/<slug>/`.
The game page, `/play/<slug>` share link, command palette entry, sitemap, and social
image all come from that entry. See [docs/ADDING_A_GAME.md](docs/ADDING_A_GAME.md).

## Project structure

```text
.github/        CI, Lighthouse, Dependabot, PR template
docs/           Design, deploying, decisions, spec, handoff audit
public/         Game art (games/<slug>/) and icons
scripts/        Asset validation and live-link check
tests/          Catalog unit tests and browser checks
src/
  app/          Routes, metadata, OG images, sitemap, robots
  components/   ui, layout, games, command-palette, views
  content/      games.ts: the catalog
  hooks/        Dialog, sound, platform detection
  lib/          Validation, redirects, formatting, site config
  styles/       Design tokens and global CSS
  types/        Game and command types
```

[Deploying](docs/DEPLOYING.md) · [Design](docs/DESIGN.md) · [Decisions and TODOs](docs/DECISIONS.md)

Casey Nguyen · [github.com/ceenguyen05](https://github.com/ceenguyen05)
