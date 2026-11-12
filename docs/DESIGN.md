# Design

Updated November 12, 2026. This describes the site as built.

## Identity

**Playroom** is a dark, welcoming home for a growing set of browser games, made to be
shared with friends. The hub has its own identity and belongs to no single game or
developer. Each game brings its own artwork and accent color. Names, bios, and public
links appear on each maker's game pages and on the dedicated makers directory.

References: an independent arcade's colorful cabinets, a record shop's browsable
covers, and a contemporary editorial portfolio's typography.

Not used anywhere: military stamps, classified dossiers, neon glows, glass panels,
gradient lettering, or decorative animation loops.

## Palette

Defined once in `src/styles/tokens.css` and mapped to Tailwind in `tailwind.config.ts`.
`src/lib/theme.ts` mirrors the values for code that can't read CSS (social images, the
manifest, the contrast check); a unit test fails if the two drift apart.

| Token         | Value     | Use                                                  |
| ------------- | --------- | ---------------------------------------------------- |
| `paper`       | `#101210` | Page background                                      |
| `surface`     | `#191d19` | Panels and cards                                     |
| `sunken`      | `#222821` | Image wells, locked controls, selected rows          |
| `ink`         | `#f3f4ed` | Text, the Play button's slab                         |
| `muted`       | `#abb3a5` | Supporting text                                      |
| `line`        | `#343c31` | Hairlines and card borders                           |
| `line-strong` | `#697560` | Section rules, keycap edges                          |
| `signal`      | `#d9f978` | The hub's accent: primary buttons, focus, live state |
| `on-accent`   | `#101210` | Dark text and glyphs on `signal` or a game accent    |
| `game`        | per game  | Each game's `accentColor`, set on its card and pages |

A game's accent colors its tile rule, the Play button's launch block and base, its
preview and gallery frames, the maker avatar, and the glow on its closing banner. The
build rejects accents with less than 3:1 contrast against `on-accent`.

## Typography

**Manrope** (variable, via `next/font`) for headings and body. **IBM Plex Mono 400** for
labels, counters, and keycaps. Headings are large, tight, and left-aligned. Body text and
labels are 12px or larger. Only the small captions on the decorative cover deck go down
to 10px, and each of those covers also carries a full accessible name.

## Layout

- Content is capped at 1440px with 20–56px gutters. Sections sit 96px apart (64px on
  phones).
- **Home:** headline and call to action on the left, a fan of game covers on the
  right; then the featured game; then the library as cover tiles (four columns, two on
  tablets, one on phones); then a share banner.
- **Game page:** the same feature panel as its hero, then a sticky fact sheet beside
  the overview, gallery, maker card, share row, controls, and release notes, and a
  closing launch banner. Sections with no data are omitted.
- **About:** what the collection is, two notes, and a directory of every game.
- **Makers:** a large editorial introduction, monogram jump cards, maker identities,
  expandable engineering/experience/education sections, and automatically attributed
  game cards. The desktop identity column stays beside its story; phones use a single
  column. No stock portraits or invented background information.
- **Header:** The games, The idea, and The makers stay visible at every breakpoint.
  On phones, navigation occupies a second row below the wordmark and search.
- Corners: 13–16px on cards and banners, 8px on buttons and chips, 3px on the Play
  button and keycaps (they read as physical keys).

## Graphics

- **Icons are inline SVG** (`ui/Arrow`, `ui/Spark`). The Unicode arrows and asterisk they
  replaced are drawn as emoji on many phones.
- **Concept covers** for unreleased games are original vector art in `art/covers/`,
  rendered to WebP by `npm run render:covers`, and always captioned as concept
  artwork. SVG files are not used as images: each one cost about 0.7 s of blocked
  main-thread time on a throttled phone.
- ACI: Series 1 uses real captures from the game.

## The Play button

The most distinct control on any page: a light slab with dark text, a launch block in
the game's accent holding a ▶, and a base in the same accent. Pressing it drops the
slab 3px onto the base in 60ms, like a key. It is always a real link to the game's own
site, opens in a new tab, and shows the destination domain beside it. Games that aren't
live get a dashed, disabled control with their status instead.

## Motion

Decorative animations are responses or one-time entrances. The homepage spotlight
and game-page hero share a six-image carousel that advances every five seconds
after the next image loads, wrapping to the first image. Hover, keyboard focus,
touch gestures, hidden tabs, and the explicit Pause control stop its timer. It
continues while scrolling elsewhere in a visible tab and restarts with a full
interval after a temporary pause. Reduced motion disables autoplay entirely.

| Moment               | What happens                                                            | Timing            |
| -------------------- | ----------------------------------------------------------------------- | ----------------- |
| Home loads           | Covers are dealt from a stack into the fan; the spark spins in          | 0.7–0.9s, once    |
| Cover hover or focus | The cover straightens and lifts; the cover to its right stays reachable | 0.35s             |
| Scrolling            | Sections below the fold fade up as they enter the view                  | 0.5s, once        |
| Tile hover or focus  | The tile lifts, its cover zooms, and the first screenshot fades in      | 0.25–0.45s        |
| Choosing a preview   | The new image fades in over the previous one                            | 0.28s             |
| Changing the filter  | Remaining tiles settle in one after another                             | 0.26s + 40ms each |
| Play press           | The slab drops onto its base                                            | 60ms              |
| Small hovers         | Arrows nudge; the logo, spark, share arrow, and avatar straighten       | 0.2–0.6s          |
| Opening search       | The panel fades and drops 4px (Motion, loaded on demand)                | 0.12s             |

With `prefers-reduced-motion: reduce`, entrances, reveals, crossfades, and lifts are
all removed, and previews use manual controls; nothing is hidden waiting for an animation. The scroll reveal only hides
sections after its script runs, so the page is complete without JavaScript.

## Interaction and accessibility

- Every control is reachable by keyboard with a visible lime focus ring.
- Search opens with ⌘K or Ctrl+K: arrow keys move, Enter opens, Esc closes.
- The gallery opens in a dialog: ← → step through images, Esc closes, and focus returns
  to the thumbnail.
- Accessible names start with the visible text. Links that open a new tab say so.
- UI sounds are optional and off by default.
- Every page is checked at 320px, 390px, and 768px with no horizontal scroll;
  maker profiles also have a 1440px desktop layout check.

## Where the styles live

`src/styles/globals.css` only imports: `tokens.css`, `base.css`, then one file per area
in `src/styles/components/` (primitives, play-button, site-chrome, home, game-feature,
library, game-page, about, makers, interactions). Each file keeps its own responsive and
reduced-motion rules next to the rules they adjust. Small one-off layout uses Tailwind
utilities in the component.

## Browsing interactions

- Bookmark buttons let visitors keep a personal set of games on this device. The Saved filter has a clear empty state; blocked browser storage falls back to the current visit. The same saved state is used on cards, quick looks, and game pages.
- Quick look opens a native modal with the cover, short pitch, confirmed details, save action, and either Play or Coming soon. It loads only after a visitor opens it. Full game pages remain the place for creator information and deeper details.
- Screenshot previews respond to swipe gestures, previous/next buttons, numbered selectors, and arrow keys. Vertical scrolling and pinch zoom remain available. The previous image remains visible until the next image loads.
- On fine pointers, a small light and tilt follow the pointer across a tile. Updates are limited to animation frames while the pointer moves; there is no idle animation loop. Keyboard focus keeps the existing static highlight. Reduced motion disables the effect.
- Switching reduced motion on while browsing reveals pending sections immediately.

## Section and navigation feedback

The library eyebrow has a small lime marker that settles once when a same-page section link is activated. Status filters expose a visible result count and divider. Main navigation links gain a short underline on hover or keyboard focus. Repeat section clicks always return to the destination, including from search. Reduced motion makes scrolling instant and removes the arrival animation.
