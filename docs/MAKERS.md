# Maker profiles

`/makers` showcases every creator with a game in the catalog. It is a statically
rendered Next.js page, linked from the header, footer, About, game credits, search,
and sitemap. No environment variables, accounts, or additional packages are needed.

## Content and ownership

- `src/content/developers.ts`: shared identity, stable `slug`, short bio, and
  optional public links. Games refer to these objects, so credits stay consistent.
  Links are ordered GitHub, LinkedIn, then email (and a website when supplied).
- `src/content/makerProfiles.ts`: optional extended introduction, interests, and
  expandable background sections. Keep long profiles separate from game data.
- `src/lib/makers.ts`: groups the catalog by developer slug. Game credits and
  counts are derived, never maintained as a second list.
- `src/components/views/MakersView.tsx`: server-rendered directory and profiles.
- `src/components/makers/DeveloperLinks.tsx`: shared links used by maker profiles
  and the compact game-page credit cards.
- `src/styles/components/makers.css`: responsive page styles using existing tokens.

To add a maker, add an identity with a unique lowercase hyphenated slug and point
their games at it. A basic profile appears automatically. Add a matching entry in
`makerProfiles.ts` for an extended background. Preserve slugs after publishing:
game cards and shared `/makers#slug` links use them as stable anchors.

Only publish information supplied or confirmed by the maker. Casey's background
comes from his supplied resume and this repository. Trea's electrical engineering,
game development, and AI interests were supplied by Casey on November 11, 2026.
No employer, degree, contact details, or unconfirmed game features are inferred for
Trea. Existing ACI performance and EEG metrics are resume claims, not benchmarks
rerun by this website. The profile does not publish the resume's phone number.

## Interaction and checks

Jump links use the shared `SiteLink` for scrolling and keyboard focus. Native
`details`/`summary` sections remain usable without JavaScript. Hover/focus effects
and scroll reveals honor reduced motion. The mobile header keeps all three page
links visible on a second row. Public external links open in a new tab.

Run the release checks in [DEPLOYING.md](DEPLOYING.md). Maker coverage lives in
`tests/makers.test.ts` and `tests/browser/makers.spec.ts`, including attribution,
keyboard disclosures, navigation, 320–1440px layouts, reduced motion, no-JavaScript
content, and search/social metadata. `npm run screenshots` refreshes the desktop
and mobile maker screenshots alongside the existing homepage captures:
[desktop](screenshot-makers-desktop.png) and [mobile](screenshot-makers-mobile.png).
