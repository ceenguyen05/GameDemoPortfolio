/**
 * The palette for code that can't read CSS variables: social images, the web
 * manifest, the browser theme color, and build-time contrast checks.
 * Keep in sync with src/styles/tokens.css.
 */
export const theme = {
  paper: "#101210",
  ink: "#f3f4ed",
  muted: "#abb3a5",
  line: "#343c31",
  signal: "#d9f978",
  /** Dark text and glyphs that sit on bright fills (signal and game accents). */
  onAccent: "#101210",
} as const;
