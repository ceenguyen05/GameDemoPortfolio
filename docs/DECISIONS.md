# Decisions and remaining content

## Implementation choices

- The repository is the deliverable. Hosting stays with Vercel's Git integration; no
  Sites registration, cloud publication, push, or competing deploy workflow was performed.
- Next.js 16.4.5 was the npm stable release at implementation. Node is constrained to 22.x.
  TypeScript 6 is used because the current typescript-eslint parser rejects TypeScript 7.
  ESLint 9 is retained because Next's React/import/accessibility plugins declare support
  through that major. Dependabot can propose upgrades once compatible versions are released.
- Tailwind 4 uses its PostCSS plugin and explicitly loads `tailwind.config.ts` with
  `@config`. Shared CSS variables map into Tailwind. Component classes carry the editorial
  compositions; there is no component library or unused placeholder directory.
- `Game` is a discriminated union: a live game requires `playUrl`; an unreleased game
  cannot provide one. Runtime validation also protects content authored through JavaScript.
  Node config/scripts use shallow relative imports so the catalog works without Next's
  alias resolver; application components use `@/` exclusively.
- The first live entry is featured. Two ordinary classified entries reserve future slots;
  they are labels, not announced game names. Empty filters show a useful reset action.
- Full game descriptions and inputs were checked against the local ACI-SND checkout,
  commit `3ec4a9e` (2026-11-05): README, package.json, `src/config/controls.ts`,
  and `src/ui/screens/ModeSelect.ts`. The GitHub URL supplied in the brief is retained.
  No release date or changelog was inferred from the package version.
- Source game images come from that checkout's `screenshots/`: `07-ingame-spawn-high.png`,
  `09b-player-combat.png`, `look/aci_b2-medium-atrium.png`, and
  `zombies/06-wave1-live.png`, in that order. They were converted to 1280 × 720 WebP.
  The atrium image includes debug HUD values and is explicitly labeled a development capture.
  Classified SVG art and the CN-inspired favicon geometry were created for this hub.
- All raster images use Next Image with dimensions/reserved aspect ratios. Only the hero
  is preloaded. Cards switch to one screenshot on hover/focus; reduced motion disables it.
- Barlow Condensed and IBM Plex Mono use Google Fonts through `next/font`; the build
  fetches fonts and the deployed site serves them locally. No runtime Google Fonts request.
- Native dialogs provide focus containment, Escape, and focus return. The command palette
  uses native links and ordinary Tab navigation alongside arrow keys. Only its brief
  entrance uses Motion, loaded on demand when the palette opens. No keyboard interception changes real launch-anchor semantics.
- Sound is off by default, synthesized with Web Audio after interaction, stored with
  try/catch, and silent when storage or audio is unavailable. No analytics or tracking.
- Canonical metadata resolves from the optional custom origin, then Vercel's automatic
  production hostname, then localhost for local work. OG images are generated statically
  from the catalog with `next/og`. Unknown play paths use the shared 404.
- CI uses the current action majors verified from their official repositories:
  [checkout v7](https://github.com/actions/checkout),
  [setup-node v7](https://github.com/actions/setup-node),
  [cache v6](https://github.com/actions/cache).
- Link checking uses bounded HEAD requests with GET fallback for servers rejecting HEAD.
  Network failures warn and do not block deployment. Runtime configuration/content errors
  still fail normal validation. Lighthouse runs three mobile audits per URL and reports
  warning-only category thresholds.
- No email was inferred from GitHub or the local machine. The requested email placeholder
  is visibly identified in the contact page so visitors do not mistake it for a real address.

## Complete TODO(casey) list

1. **Public email** — replace `hello@example.com` in `src/lib/siteConfig.ts`.
2. **ACI release date** — confirm the original public launch date in `src/content/games.ts`;
   until then it is null and omitted from the page.
3. **ACI changelog** — add verified version/date/notes entries in `src/content/games.ts`.
   The current UI honestly says notes have not been published here.
4. **Hub URL** — replace the README placeholder after importing the repository into Vercel.
   The app itself derives the production origin without a source edit.
5. **Future slots** — replace `classified-02` and `classified-03` only when games are
   announced. Their SVG covers are deliberate placeholder art; there are no fake details.
6. **Optional art polish** — replace `screenshot-02.webp` with a public-build atrium capture
   without debug values, update its alt/caption, and optionally replace the remaining real
   development-session images with final press captures. No placeholder ACI art is used.

The copy-paste example in ADDING_A_GAME contains a release-date TODO for future entries.
These are content follow-ups, not prerequisites for building or connecting to Vercel.

## Verification

See [VALIDATION.md](VALIDATION.md) for the final checks, browser evidence, and measured
mobile Lighthouse scores. `docs/screenshot.png` is captured from the production build.

Development-tool overrides pin patched basic-ftp and minimatch versions. The final clean
install and tool checks verify these overrides; npm audit reports zero vulnerabilities.
