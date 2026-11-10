# Design

## Direction: a catalog, not a theme

The hub is a neutral, well-kept catalog of games. The site's chrome stays quiet, and each
game's artwork and accent color supply the personality. A tactical shooter, an obby, and
a moon game should all look at home on the same page. No part of the chrome borrows any
single game's genre language: no crosshairs, dossiers, or neon.

What makes it feel made rather than templated:

- **Numbered entries.** Every game has a catalog number (`01`, `02`, …) and a color
  swatch, like spines on a shelf.
- **Hairline structure.** 1px rules and frames do the work that cards and shadows do in
  templates. Panels are square-cornered.
- **Mono metadata.** Destinations, versions, dates, and counts are set in mono, the way a
  museum wall label is set apart from its title.
- **Deliberate asymmetry.** Content sits on a 12-column grid with uneven splits (5/7, 4/8,
  1/4/4/3), never centered stacks.

References:

1. **The Criterion Collection catalog:** numbered spines, one consistent frame, and every
   title brings its own art.
2. **Playdate's game catalog (play.date):** neutral and friendly. Each game's art and
   color carries the page.
3. **Museum collection pages (MoMA, the Design Museum):** wall-label metadata, generous
   whitespace, and titles that do the talking.

## Typography

| Role    | Face                    | Use                                                        |
| ------- | ----------------------- | ---------------------------------------------------------- |
| Display | Manrope 800, -0.045em   | Page titles, game titles, section headings                 |
| Text    | Manrope 400–600         | Body, descriptions, buttons. Same variable file as display |
| Mono    | IBM Plex Mono 400 / 500 | Labels, catalog numbers, domains, dates, versions, keycaps |

Both load through `next/font/google`, so they're self-hosted at build with no runtime
Google request and metric-matched fallbacks (no layout shift). Labels use mono at
12px, uppercase, +0.08em tracking. **Nothing on the site is smaller than 12px.**

Scale (`tailwind.config.ts` → `fontSize`):

| Token     | Size            | Line height |
| --------- | --------------- | ----------- |
| `label`   | 12px            | 1.4         |
| `sm`      | 14px            | 1.55        |
| `base`    | 16px            | 1.6         |
| `lead`    | 18–20px (fluid) | 1.5         |
| `h3`      | 24–28px         | 1.15        |
| `h2`      | 32–48px         | 1.08        |
| `display` | 44–88px         | 1.0         |
| `hero`    | 64–136px        | 0.9         |

## Palette

Light, warm, and neutral. Contrast ratios are measured against `paper`.

| Token         | Value     | Use                                             | Contrast |
| ------------- | --------- | ----------------------------------------------- | -------- |
| `paper`       | `#f4f3ee` | Page background                                 | —        |
| `surface`     | `#ffffff` | Raised panels: game hero, launch band, dialogs  | —        |
| `sunken`      | `#e9e8e1` | Keycaps, locked controls, image wells           | —        |
| `ink`         | `#1b2220` | Text, Play button, primary rules                | 14.6:1   |
| `muted`       | `#5c635e` | Secondary text (5.0:1 even on `sunken`)         | 5.6:1    |
| `line`        | `#d6d9d2` | Hairlines                                       | —        |
| `line-strong` | `#aab1a8` | Keycap edges, input borders                     | —        |
| `signal`      | `#24574b` | The hub's one accent: live status, focus, links | 7.4:1    |

**Game accent (`--game`).** Each card and game page sets `--game` from its
`accentColor`. It appears only as fills and rules: the catalog swatch, a 4px top rule on
the game's hero, the Play button's launch block, gallery hover frames, and the version
chip. It is never used as text on paper, since bright accents fail text contrast there.
The build rejects any accent under 3:1 against `ink`, because ink glyphs sit on it.

No gradients, glass, glows, or soft drop shadows. There is one hard offset shadow on the
site, and it belongs to the Play button.

## Grid and spacing

- Max content width 1440px. Gutters `clamp(16px, 4vw, 56px)`.
- 12 columns, 24px gaps (16px below 768px).
- Spacing uses Tailwind's 4px scale, restricted to 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 /
  96 / 128. Sections sit 96px apart (64px on mobile), set by `--space-section`.
- Radius: 0 on panels and images; 3px on keycaps, chips, and buttons.
- Breakpoints: Tailwind defaults (`sm` 640, `md` 768, `lg` 1024, `xl` 1280). Everything
  is checked at 360px with no horizontal scroll.

## Page compositions

- **Home:** the intro has the headline on the left over 7 columns and the blurb plus
  catalog counts on the right over 4. Next comes the featured game as a framed 5/7 split
  (copy on the left, art on the right) over a fact strip. Then the library: filters, then
  one row per game (number · art · copy · status and actions), and finally a short note
  about the maker.
- **Game page:** breadcrumb, then the hero (same composition as the featured panel),
  then a 4/8 split. A sticky fact sheet on the left holds status, genre, platforms,
  release, version, stack, and source. The right column holds the story, gallery,
  controls, and release notes. A closing launch band finishes the page. Empty sections
  are omitted rather than padded with "TBA".
- **About:** one large statement, two paragraphs, and contact rows.
- **404:** an oversized mono `404`, one line about what happened, and a way back.

## The Play button

The most distinct control on any page, and the only element with a shadow.

- Ink slab with white Manrope 700 text "Play now". On the left, a square **launch
  block** in the game's accent holds an ink ▶. A ↗ on the right signals a new tab.
- **Press:** a 4px hard offset shadow in the game's accent sits under the slab, like
  the base of a key. On `:active` the
  slab drops 4px and the shadow collapses to 0 in 60ms, like a physical key bottoming
  out. Hover nudges the ↗ 2px up and to the right.
- Always paired with a mono destination label (`aci-series1.vercel.app ↗ · new tab`).
- Real `<a href>` with `target="_blank" rel="noopener noreferrer"`. The accessible name
  includes the game and the new-tab behavior.
- Locked state: flat `sunken` slab, no shadow, no block, with the status text ("Coming
  soon") and a mono note. It renders as a disabled button, never a link.

Secondary actions (`ui/Button`) are outlined or text-only so they never compete with it.

## Motion

Motion acts like a game menu: instant feedback, short travel, no floating.

| Interaction           | What moves                           | Duration / easing |
| --------------------- | ------------------------------------ | ----------------- |
| Play press            | translateY 4px, shadow 4px → 0       | 60ms linear       |
| Card hover / focus    | cover crossfades to first screenshot | 200ms ease-out    |
| Card hover            | title underlines                     | instant           |
| Command palette open  | fade + 4px drop (Motion, lazy)       | 120ms ease-out    |
| Lightbox image change | none; cuts instantly                 | —                 |
| Filters               | none; rows show or hide instantly    | —                 |

Under `prefers-reduced-motion: reduce`, every transition is removed, the cover
crossfade is disabled, and the palette appears without movement. Motion (framer-motion)
loads only with the command palette, so no page pays for it up front.

## Accessibility rules

- Focus: 2px `signal` outline with a 3px offset on every interactive element.
- Accessible names come from visible text plus `sr-only` additions, never an
  `aria-label` that contradicts what's on screen.
- Icons and glyph arrows are `aria-hidden`. Decorative numbers are fine; meaningful ones
  are real text.
- Sound is optional, off by default, and never the only signal for anything.
