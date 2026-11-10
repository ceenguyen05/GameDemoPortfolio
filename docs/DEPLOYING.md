# Deploying

The hub deploys through Vercel's Git integration: every push to `main` goes to
production at <https://gamedemoportfolio.vercel.app>, and every pull request gets a
preview URL. No GitHub workflow deploys anything; CI only checks.

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

If you protect `main` before pushing the rewritten history, the force-push will be
blocked. Push first, then add the ruleset.

## What the workflows do

- **`ci.yml`** (push to `main`, PRs): `npm ci`, lint, typecheck, format check, unit
  tests, build, then a live-link check that warns without failing.
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
