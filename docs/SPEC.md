# Spec

The original build brief for this hub, kept verbatim below as the reference for future work.
Where the owner later changed a requirement, the amendment wins.

## Amendments from the owner (2026-11-09)

These override the original text where they conflict.

1. **Neutral design.** The site's design must be neutral, not styled after any one game.
   It is a portfolio and a collection, so it has to suit every game in it and appeal to
   anyone browsing to see what games exist. This replaces the original "tactical,
   weapon-system spec sheet" direction. Each game's `accentColor` still tints its own
   card and pages. The "avoid" list still applies.
2. **Play opens a new tab.** Every Play now action opens the game's live site in a new
   tab (`target="_blank"` with `rel="noopener noreferrer"`). It remains a real
   `<a href={playUrl}>` link. This replaces "opening in the same tab."
3. **Production URL.** The hub deploys to <https://gamedemoportfolio.vercel.app/>.
4. **Placeholders answered:**
   - Contact: show both GitHub and email. Email: `ceen2327@gmail.com`.
   - ACI: Series 1: release date is today (2026-11-09). The changelog has one entry,
     version 1.7.6 dated 2026-11-09, whose notes list all the game's features.
   - Future games: keep simple "Coming soon" cards for a Devil Game, a 2–6 player
     obby game, and a Moon Sweeper game. Later confirmed: these are three separate
     games, all shown as working titles. Moon Sweeper's description stays minimal
     ("In the works").
   - ACI gallery: keep the current screenshots (which show debug HUD values) until
     clean captures replace them.

---

# Build: game portfolio hub for my browser-first games

You're building the demo/hub website for my browser-first games. The hub's core job is to showcase each game and **redirect players to that game's own live website**. Each game is a separate project with its own Vercel deployment; the hub never hosts or embeds the games itself. Treat this as a real product people will judge me by: polished, fast, distinctive, and clearly made by a person with taste, not a template.

## Context

- Me: Casey Nguyen (GitHub: ceenguyen05), software engineer.
- First game: **ACI: Series 1**, a browser first-person shooter.
  - Live game (redirect target): https://aci-series1.vercel.app/
  - Repo: https://github.com/ceenguyen05/ACI-SND
- More games are coming, each on its own Vercel URL. Adding a game must take one data entry and some assets, never new page code.
- This hub repo will be connected to Vercel through its Git integration. Every push to `main` deploys to production, and every PR gets a preview URL.

## Stack (use exactly this unless something is blocking, then explain)

- Next.js (App Router, latest stable) + TypeScript (strict)
- Tailwind CSS
- Motion (framer-motion) for animation, used sparingly and with purpose
- No backend, database, or auth. Everything is static or SSG-friendly.
- npm, Node 22 LTS (pin with `.nvmrc` and `engines`)

## Project structure

Organize the repo cleanly and consistently. Use this layout, and add folders only when they hold real content (no empty placeholder folders):

```
.
├── .github/
│   ├── workflows/
│   │   ├── ci.yml
│   │   └── lighthouse.yml
│   ├── dependabot.yml
│   └── pull_request_template.md
├── docs/
│   ├── DESIGN.md
│   ├── ADDING_A_GAME.md
│   ├── DEPLOYING.md
│   └── DECISIONS.md
├── public/
│   ├── games/<slug>/        # cover, screenshots, preview loop per game
│   ├── fonts/               # only if self-hosting
│   └── icons/               # favicon set, manifest icons
├── src/
│   ├── app/                 # routes only: layout, pages, not-found, OG image routes, sitemap, robots
│   ├── components/
│   │   ├── ui/              # primitives: Button, Keycap, Tag, Dialog
│   │   ├── layout/          # Header, Footer, PageShell
│   │   ├── games/           # GameCard, GameGrid, GameHero, ControlsList, Gallery, PlayButton
│   │   └── command-palette/
│   ├── content/
│   │   └── games.ts         # single source of truth for all games
│   ├── hooks/
│   ├── lib/                 # utilities, constants, site config, redirect generation
│   ├── styles/              # globals.css, design tokens
│   └── types/               # shared TypeScript types (Game, ChangelogEntry, etc.)
├── .editorconfig
├── .env.example             # only if any env vars are used; otherwise omit
├── .gitignore
├── .nvmrc
├── .prettierrc
├── eslint.config.mjs
├── lighthouserc.json
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

Rules:

- Use `@/` path aliases; no deep relative imports like `../../../`.
- One component per file, named in PascalCase to match its export. Utilities in camelCase files.
- Keep route files in `src/app` thin. Logic and UI live in `components/` and `lib/`.
- Co-locate a component's subparts in its folder only if nothing else uses them.

## Architecture

- One source of truth: `src/content/games.ts` exports a typed `Game[]` (type defined in `src/types/`). Each game includes:
  - `slug`, `title`, `tagline`, `description` (short and long), `status` (`"live" | "in-development" | "coming-soon"`), `genre`, `platforms`, `controls` (key → action list), `techStack`, `playUrl` (the game's live site; required when status is `"live"`), `repoUrl`, `releaseDate`, `accentColor`, `coverImage`, `screenshots[]`, optional `trailerUrl`, optional `changelog[]` (version, date, notes).
- Validate the data at build time: a `"live"` game without a valid `https://` `playUrl`, or two games with the same slug, must fail the build with a clear error.
- Fill in ACI: Series 1 with real info and `playUrl: "https://aci-series1.vercel.app/"`. Read the ACI-SND repo's README and source to get accurate controls, features, and tech stack. Do not invent features. Where you can't confirm something, leave a clearly marked `// TODO(casey):` instead of guessing.
- Add 2 "coming soon" slots as data entries (classified-style placeholders, no fake game names or fake details, no `playUrl`).
- Put assets in `public/games/<slug>/`. Generate tasteful placeholder art (SVG or CSS) where real screenshots don't exist yet.
- `docs/ADDING_A_GAME.md`: step-by-step guide with a copy-paste template entry and the exact asset filenames and sizes expected.

## Pages and features

1. **Home**: a strong opening moment that shows off the featured game (ACI: Series 1) with a prominent Play action that takes the player straight to its live site. Then the full game library, with status filters and keyboard-navigable game cards. Hover or focus reveals more (a muted preview loop, screenshot cycling, or a parallax tilt — pick one, do it well). Every live game's card has a direct Play action as well as a link to its detail page.
2. **Game detail page** (`/games/[slug]`, statically generated): hero with the Play action front and center, controls reference (rendered as keyboard keycaps) so players know the controls before they launch, screenshot gallery with a keyboard-accessible lightbox, tech stack, changelog, repo link.
3. **Play / redirect flow** — the most important interaction on the site:
   - Every Play action is a real `<a href={playUrl}>` link to the game's live site, opening in the same tab so the browser's back button returns to the hub. Because it's a real link, middle-click and "open in new tab" work naturally. No JavaScript-only navigation.
   - Show the destination domain on or near the Play button (e.g. a small mono label `aci-series1.vercel.app ↗`) so players know where they're going.
   - Generate short shareable redirects in `next.config.ts` from `games.ts` (never by hand): `/play/<slug>` → that game's `playUrl`, as a temporary redirect (not permanent, so URLs can change later). These are the links I'll share publicly.
   - Games that aren't live render a locked/disabled Play state with clear status text ("In development", "Coming soon") instead of a link.
   - `/play/<unknown-slug>` falls through to the themed 404 page with links back to the library.
4. **About / Contact**: brief, personal, with links to GitHub and email (placeholder email marked TODO).
5. **Custom 404**, themed to the site.
6. **Quality-of-life touches**: a `⌘K` / `Ctrl+K` command palette to jump to any game's page or launch any live game directly; a sound toggle for subtle UI sounds (off by default, persisted to localStorage inside try/catch); full respect for `prefers-reduced-motion`.

## Design direction: this is the part that matters most

The aesthetic is **tactical, game-native, editorial**: think a weapon-system spec sheet crossed with a high-end game studio's press site. Confident typography, a structured grid, deliberate asymmetry, technical details (coordinates, version tags, mono labels, hairline rules, subtle scanline or grain texture used once, not everywhere).

The Play action should feel like the moment of launching a game: the most visually distinct control on the page, with a satisfying, snappy press state.

Make your own concrete choices for type pairing (a characterful display face plus a clean mono or grotesk, from Google Fonts via `next/font`), a restrained palette (near-black base, one sharp accent, with each game's `accentColor` tinting its own pages), and spacing scale. Write these as design tokens in CSS variables and Tailwind config.

**Avoid everything that reads as AI-generated or template-made:**

- Purple-to-blue gradients, gradient text, glowing blobs, mesh-gradient backgrounds
- Glassmorphism cards everywhere
- A centered hero followed by three identical feature cards with emoji or generic icons
- Copy like "Unleash," "Elevate," "Seamless," "Next-level," "Dive into"
- Uniform rounded-2xl cards with soft shadows on every element
- Animations on everything; motion should feel like a game menu (snappy, purposeful), not floaty

Write the copy yourself, in a terse, confident voice that sounds like a developer who ships games, not a marketing team.

## Quality bar

- Lighthouse 95+ on Performance, Accessibility, Best Practices, and SEO for home and detail pages on mobile.
- WCAG AA contrast, visible focus states, full keyboard operability, semantic HTML, alt text, accessible names on icon buttons. Play links include the game name in their accessible name (e.g. "Play ACI: Series 1").
- Fully responsive down to 360px wide; no horizontal scroll.
- `next/image` for all raster images; `next/font` for fonts; no layout shift.
- SEO: per-page metadata, Open Graph and Twitter cards (generated OG images per game via `next/og`), `sitemap.xml`, `robots.txt`, favicon set, web manifest.
- No console errors or warnings in a production build.

## GitHub workflows and CI

Deployment is handled by Vercel's Git integration once I connect it. **Do not** add any workflow that deploys to Vercel; that would double-deploy. The workflows exist to catch problems before they ship.

Create these files:

1. **`.github/workflows/ci.yml`**
   - Triggers: `push` to `main`, and `pull_request` targeting `main`.
   - `concurrency` group per branch with `cancel-in-progress: true`.
   - Minimal `permissions` (`contents: read`).
   - Steps: checkout → `actions/setup-node` using `node-version-file: .nvmrc` with npm cache → `npm ci` → `npm run lint` → `npm run typecheck` → `npm run format:check` → `npm run build`.
   - Add a step that runs `npm run check:links`: a small script in `scripts/` that reads every `playUrl` from `games.ts` and confirms it responds with a 2xx/3xx status. It should warn (not fail) so a temporarily down game doesn't block hub deploys.
   - Cache `.next/cache` between runs to speed up builds.
   - Use current major versions of all actions.

2. **`.github/workflows/lighthouse.yml`**
   - Triggers: `pull_request` targeting `main`.
   - Build the app, start it, and run `@lhci/cli` against `/` and ACI's detail page.
   - Config in `lighthouserc.json` at the repo root, with assertions set to warn (not fail) below 0.95 for all four categories, and results uploaded to temporary public storage so the PR shows a report link.

3. **`.github/dependabot.yml`**: weekly updates for `npm` and `github-actions`, grouping minor and patch npm updates into one PR.

4. **`.github/pull_request_template.md`**: short checklist (what changed, screenshots for UI changes, tested on mobile, Play links verified, Lighthouse checked).

`package.json` scripts: `dev`, `build`, `start`, `lint`, `typecheck` (`tsc --noEmit`), `format` (`prettier --write .`), `format:check` (`prettier --check .`), `check:links`. Set up ESLint (flat config) and Prettier (with `prettier-plugin-tailwindcss`), and make sure they don't conflict. Add `scripts/` to the project structure.

## README.md

Short but descriptive: one screen of reading, no walls of text. Include, in this order:

1. Title and a one-line description: a hub for my browser-first games that links players straight to each game's live site.
2. A screenshot of the home page (`docs/screenshot.png`; use a placeholder path with a TODO if you can't capture one).
3. Live link (placeholder until I deploy, marked TODO) and a CI status badge for `ci.yml`.
4. **Games**: a small table (title, status, play link), starting with ACI: Series 1 → https://aci-series1.vercel.app/
5. **Tech stack**: one line.
6. **Run locally**: prerequisites (Node 22) and the 3 commands to install, run, and build.
7. **Add a game**: two sentences plus a link to `docs/ADDING_A_GAME.md`.
8. **Project structure**: a trimmed tree (top-level and `src/` only).
9. Links to `docs/DEPLOYING.md`, `docs/DESIGN.md`, `docs/DECISIONS.md`.
10. Author line: Casey Nguyen, with GitHub link.

No emoji headers, no badges beyond CI, no filler sentences.

Longer material goes in `docs/`:

- `DEPLOYING.md`: exact steps to connect the repo to Vercel (import project, framework auto-detected, production branch `main`), how preview deploys work, how the `/play/<slug>` redirects behave once deployed, and how to turn on branch protection for `main` requiring the CI check to pass before merging.
- `DECISIONS.md`: every judgment call you made where these instructions were silent, plus the full list of `TODO(casey)` items and placeholder assets I need to replace.

## .gitignore

Create a `.gitignore` that excludes everything Git doesn't need, grouped with short comments:

- Dependencies: `node_modules/`
- Next.js build output: `.next/`, `out/`, `build/`
- Vercel: `.vercel/`
- Environment files: `.env`, `.env*.local` (but keep `.env.example` tracked with `!.env.example`)
- TypeScript: `*.tsbuildinfo`, `next-env.d.ts`
- Testing and tooling output: `coverage/`, `.lighthouseci/`, `.eslintcache`
- Logs: `npm-debug.log*`, `yarn-debug.log*`, `yarn-error.log*`, `*.log`
- OS files: `.DS_Store`, `Thumbs.db`, `desktop.ini`
- Editors: `.idea/`, `*.swp`, `.vscode/*` but keep `!.vscode/extensions.json` and `!.vscode/settings.json` tracked
- Misc: `*.pem`, `.cache/`

Do not ignore `package-lock.json`; it must be committed for `npm ci` to work.

Also add `.vscode/extensions.json` recommending ESLint, Prettier, and Tailwind CSS IntelliSense, and an `.editorconfig` (2-space indent, LF line endings, UTF-8, final newline).

## How to work

1. Read the ACI-SND repo first so the content is accurate.
2. Before writing UI code, write `docs/DESIGN.md` with your chosen typography, palette, grid, motion principles, and 2–3 reference points for the aesthetic. Then build to that spec.
3. Build in stages: scaffold, tooling, and `.gitignore` → folder structure and content model with validation → layout and design tokens → home → detail page → play/redirect flow → command palette and polish → SEO and OG → workflows and link check → README and docs.
4. At the end, run `npm ci`, `npm run lint`, `npm run typecheck`, `npm run format:check`, `npm run build`, and `npm run check:links` from a clean state and fix everything. Verify in the running build that every Play link and every `/play/<slug>` redirect lands on the correct live game URL. Run Lighthouse locally on home and the ACI detail page and report the scores.
5. Confirm `git status` shows no build output, dependencies, or local env files staged.

## Final output

A working repo I can push to GitHub and connect to Vercel with no edits, plus a short summary of: what you built, the Lighthouse scores, and where to find the TODO list (`docs/DECISIONS.md`).
