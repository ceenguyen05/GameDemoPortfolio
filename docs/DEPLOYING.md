# Deploying with Vercel

## First production deployment

1. Push this repository to `ceenguyen05/GameDemoPortfolio` on GitHub, with `main`
   as the production branch.
2. In Vercel, choose **Add New → Project → Import Git Repository**. Authorize access
   to the repository and select it.
3. Keep the repository root as the root directory. Vercel auto-detects **Next.js**.
   Use `npm ci` for install and `npm run build` for build; leave the output directory
   at the framework default. Select **Node.js 22.x**, matching `engines` and `.nvmrc`.
4. Under **Settings → Git → Production Branch**, select **main**. Deploy.
5. Open the assigned domain. Verify `/`, `/games/aci-series-1`, and
   `/play/aci-series-1`. Replace the README's production URL placeholder.
6. For a custom domain, add it in **Settings → Domains**, follow the DNS instructions,
   and set `NEXT_PUBLIC_SITE_URL=https://your-domain.example` for the project. Redeploy
   after changing this build-time value. No trailing slash is necessary.

No required environment variables, secrets, services, or databases are needed.
The canonical origin automatically uses Vercel's
`VERCEL_PROJECT_PRODUCTION_URL`; the optional public variable overrides it.
Outside Vercel, set the variable for production; otherwise metadata uses localhost.
Do not copy the localhost value from `.env.example` into Vercel.

## Preview deployments

Vercel creates a unique preview for each pull request and updates it as commits land.
Open the preview from the Vercel GitHub check and test the same launch/Back behavior.
Merging into `main` triggers production. CI and Lighthouse do **not** deploy anything.
Preview metadata points to the production origin. Keep Vercel preview protection and
its automatic no-index handling in place.

## Share links

`next.config.ts` generates `/play/<slug>` redirects directly from the validated catalog.
Live games return HTTP **307 Temporary Redirect** to their HTTPS `playUrl`. Update the
entry and deploy when the game's host changes; no permanent redirect is cached.
The website's Play controls link directly to the live game in the same tab.
Middle-click and browser “Open in new tab” remain native browser actions.

Unreleased slots create no redirect. Unknown `/play/` slugs return the themed 404.
Share `https://YOUR-HUB-DOMAIN/play/aci-series-1` once the hub has a production domain.

## Protect main

After CI has run once, open **GitHub repository → Settings → Rules → Rulesets** and
create an active branch ruleset targeting `main`. Require pull requests and status
checks before merging, and select the **checks** job from the **CI** workflow.
Disable force pushes and branch deletion. Choose review requirements to suit your workflow.
Lighthouse thresholds and live-game availability are advisory, so an external outage does
not prevent a hub deployment.

## Checks and reports

`ci.yml`: clean install, lint, typecheck, format, content tests, build, advisory link check.
`lighthouse.yml`: build, local production server, three mobile Lighthouse runs per page.
Four category thresholds warn below 95. The run uploads reports to temporary public storage
and writes the resulting links into the GitHub Actions job summary. Report retention is
temporary; download anything you need to preserve.

For a local audit with Chrome installed: `npm run build && npm run lighthouse`.
If Chrome is not detected, set the `CHROME_PATH` environment variable to its executable.
Use `npm run test:browser` for interaction and responsive checks; it uses installed Chrome
and starts a local production server if one is not already running.
