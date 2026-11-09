# Design system

## Direction

A welcoming, neutral portfolio for a growing collection of browser games. The identity
belongs to Casey Nguyen, not to ACI or any particular genre. Game artwork supplies the
personality; the surrounding site stays quiet, readable, and consistent.

Reference points: an independent creative portfolio's typography; a contemporary museum
catalog's image-led layouts; a well-organized game library's clear browsing and launch
actions. No military dossier language, crosshairs, classified stamps, or fictional studio.

## Typography and palette

**Manrope**, weights 600 and 800, through Google Fonts with `next/font`: expressive but
genre-neutral headings. **IBM Plex Mono**, weight 400, for occasional small metadata and
keycaps. System sans-serif for descriptions. No gradient text or text effects.

Warm off-white `#f4f3ee` canvas, white `#ffffff` panels, near-black `#1b2220` text,
gray-green `#606761` secondary text, `#d8dcd5` hairlines, and restrained dark teal
`#24574b` accents. Primary launch buttons use near-black with white text. A game's own
accent may appear as a small identifier on its page, without recoloring the hub.

CSS variables supply Tailwind's color, spacing, and type tokens. Spacing uses 4/8/12/16/
24/32/48/64/96px. Corners stay modest (6–10px), with no glass, glow, or soft card shadows.
Focus uses a visible dark-teal outline with spacing around the control.

## Layout

A simple personal wordmark and navigation, then an open editorial introduction. The
featured game pairs a clear title and Play now action with a large real gameplay image.
A library with status filters follows. Future games use the same data-driven card
structure, regardless of genre. Detail pages offer a gallery, controls, source links,
and release notes when verified. The About page is brief and personal.

Content width is capped, with 20–64px responsive gutters. At 760px the feature stacks;
at 360px nothing requires page-level horizontal scrolling. Images reserve their space.

## Interactions

Every Play now anchor opens the game's HTTPS deployment in a **new tab**, with
`target="_blank"` and `rel="noopener noreferrer"`, keeping the portfolio available.
The destination and new-tab behavior are visible nearby. Share redirects remain generated
temporary redirects from the catalog; the redirect itself does not control browser tabs.

Cards crossfade to one alternate screenshot on hover or keyboard focus. Motion is loaded
only when opening the command palette and uses a brief 120ms entrance. Reduced motion
disables transitions, screenshot switching, and dialog movement.

Native dialogs contain focus, close with Escape, and restore focus. Commands support
arrow keys, Enter, and normal Tab navigation. All sound is optional, initially off,
persisted inside try/catch, and irrelevant to understanding the interface.
