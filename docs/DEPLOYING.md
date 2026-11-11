# Deploying

The hub deploys through Vercel's Git integration: every push to `main` goes to
production at <https://gamedemoportfolio.vercel.app>, and every pull request gets a
preview URL. No GitHub workflow deploys anything; CI only checks.

## Before pushing

Run the checks before pushing:

```sh
npm run lint
npm run typecheck
npm run format:check
npm test
npm run build
npm run test:browser
npm run check:links
```

The browser suite starts an isolated production server; set TEST_PORT if 3100 is occupied. CI installs Chromium; local checks use Google Chrome.

GitHub CI and Vercel's Git deploy start independently on a push. A failing CI job does not automatically prevent Vercel from publishing the same commit. Use a preview branch and required checks before merging when you need that gate. No push or deployment is performed by the local checks.

After deployment, verify the ACI title-screen cover in the homepage deck, spotlight, library, and game page; six gallery captures; and Play now opening the live game in a new tab. Vercel/Next.js generates image variants from the committed WebP assets.

Reference: [Vercel Git deployments](https://vercel.com/docs/deployments/git).

## If the site shows Vercel's `NOT_FOUND` page

**Symptom:** `/` returns "404: NOT_FOUND", but files like `/icons/favicon.svg` load.

**Cause:** the Vercel project was imported while the repo held only a README, so
Vercel saved the Framework Preset as **Other**. With "Other", Vercel publishes
`public/` as a plain static folder and never runs Next.js, so no page exists.

**Fix (already in the repo):** `vercel.json` pins the framework, which overrides the
dashboard setting on the next deploy:

```json
{ "$schema": "https://openapi.vercel.sh/vercel.json", "framework": "nextjs" }
```

After pushing, open **Project → Settings → Build and Deployment** and confirm:

| Setting          | Value                                                         |
| ---------------- | ------------------------------------------------------------- |
| Framework Preset | Next.js                                                       |
| Root Directory   | empty (repo root)                                             |
| Build Command    | default (`npm run build`), override **off**                   |
| Output Directory | default, override **off**. A leftover `public` here breaks it |
| Install Command  | default (`npm install`), override **off**                     |
| Node.js Version  | 22.x                                                          |

Then **Deployments → ⋯ → Redeploy** the latest commit. The build log should show
`Validated 4 games and their assets.` followed by `▲ Next.js`.

## Connecting from scratch

1. In Vercel: **Add New → Project → Import Git Repository**, then pick
   `ceenguyen05/GameDemoPortfolio`.
2. Framework: **Next.js**. It's auto-detected, and `vercel.json` pins it either way.
   Leave root, build, output, and install at their defaults.
3. **Settings → Git → Production Branch:** `main`.
4. Deploy, then check `/`, `/games/aci-series-1`, and `/play/aci-series-1`.

No environment variables are required. For a custom domain, add it under
**Settings → Domains**, then set `NEXT_PUBLIC_SITE_URL=https://your-domain` so
canonical URLs, the sitemap, and social images use it. It's read at build time,
so redeploy after changing it.

## Preview deploys

Each pull request gets its own URL, posted on the PR by the Vercel bot, and it
updates with every push. Test Play links and `/play/<slug>` there before merging.
Previews keep Vercel's automatic `noindex`. Metadata still points at the
production origin, so previews never compete in search.

## Share links: `/play/<slug>`

`next.config.ts` generates one redirect per **live** game from `src/content/games.ts`
at build time:

- `/play/aci-series-1` → **307 Temporary Redirect** → `https://aci-series1.vercel.app/`
- Temporary on purpose: browsers don't cache it, so changing a game's `playUrl` and
  redeploying moves every shared link.
- Games that aren't live get no redirect. Any unknown `/play/...` path falls through
  to the site's 404 page, which links back to the library.
- `robots.txt` disallows `/play/` so crawlers index game pages, not redirects.

On the site itself, every **Play now** button is a real link to the game's own URL
and opens it in a new tab. Middle-click and "Open in new tab" work as usual.

## Protect `main`

After CI has run once on GitHub:

1. **Repo → Settings → Rules → Rulesets → New branch ruleset.**
2. Target branch: `main`. Enforcement: **Active**.
3. Turn on **Require a pull request before merging** and **Require status checks to
   pass**. Add the check **`checks`** (the CI job).
4. Turn on **Block force pushes**. Leave Lighthouse (`audit`) optional: it only warns.

## What the workflows do

- **`ci.yml`** (push to `main`, PRs): `npm ci`, lint, typecheck, format check, unit
  tests, build, Chromium installation, and browser interaction checks. The live external-game browser scenario is excluded from the required job; the separate live-link check warns without failing.
- **`lighthouse.yml`** (PRs): builds, starts the site, audits `/` and
  `/games/aci-series-1` three times on mobile, and warns below 95. It uploads reports
  to temporary public storage and links them in the job summary.

CI uses `npm ci` because a fresh runner has nothing to lock files, and `npm ci` fails
loudly if `package-lock.json` drifts from `package.json`. Locally, use `npm install`.

## Local troubleshooting (Windows)

- **`npm ci` fails with `EPERM`/`EBUSY`, or leaves `node_modules` half-deleted.**
  `npm ci` deletes `node_modules` first, and Windows won't delete files that a
  running `npm run dev`, `npm start`, or editor process holds open. Stop the dev
  server, then run `npm install`.
- **`npm run dev` can't find `next`.** `node_modules` is incomplete (often from the
  above). Run `npm install` again.
- **Port 3000 is busy.** `npm run dev -- -p 3001`.

## Local release verification: November 10, 2026

- Production build, lint, typecheck, formatting, unit tests (13), browser scenarios (34), and screenshot generation (4) passed. All six ACI captures decode; the title-screen cover is verified in the homepage deck, spotlight, library, quick look, and ACI page.
- Repeat section navigation is covered from the homepage, all four game pages, About, the 404 page, and search. Back/Forward, same-page top links, keyboard focus, modifier clicks, and reduced motion pass. Navigation helpers are shared, with dedicated regression tests in `tests/browser/navigation.spec.ts`.
- The live game link returned HTTP 200; new-tab launch and the share redirect passed.
- npm audit reported zero vulnerabilities, including development dependencies. Package and lockfile dependencies match. Local documentation links resolve, workflow YAML parses, and generated caches and original capture-session files remain ignored.
- Previous screenshot-release audit (not rerun for the navigation-only update): mobile Lighthouse, three local runs per page: home performance 63-73 (median 72), ACI 63-77 (median 69). Accessibility, best practices, and SEO were 100 on every run; layout shift was zero. The advisory 95 performance target is not met. Long main-thread tasks remain a performance follow-up; these measurements are local lab results, not Vercel field data. No scores or reports were uploaded.

The required checks pass locally. GitHub Actions and Vercel will run after the changes are committed and pushed; neither remote run has been verified for this uncommitted revision. The workflow now runs the 33 site-owned browser scenarios, with external game availability checked separately as advisory.
