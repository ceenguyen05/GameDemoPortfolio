const turns = {
  "up-right": 0,
  "down-right": 90,
  "up-left": -90,
} as const;

/**
 * Diagonal arrow as inline SVG, sized by the surrounding font-size. The Unicode
 * arrows (↗ ↘ ↖) are drawn as emoji on many phones, so text glyphs would look
 * different there.
 */
export function Arrow({
  direction = "up-right",
}: {
  direction?: keyof typeof turns;
}) {
  const turn = turns[direction];
  return (
    <svg
      className="icon"
      viewBox="0 0 16 16"
      aria-hidden="true"
      // The `rotate` property leaves `transform` free for hover nudges in CSS.
      style={turn ? { rotate: `${turn}deg` } : undefined}
    >
      <path
        d="M4.5 11.5 11.5 4.5M6 4.5h5.5V10"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
