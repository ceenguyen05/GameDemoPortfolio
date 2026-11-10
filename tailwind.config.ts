import type { Config } from "tailwindcss";

// Tokens are CSS variables (src/styles/tokens.css); this maps them to utilities.
// Loaded by Tailwind 4 through `@config` in src/styles/globals.css.
export default {
  theme: {
    extend: {
      colors: {
        paper: "var(--paper)",
        surface: "var(--surface)",
        sunken: "var(--sunken)",
        ink: "var(--ink)",
        muted: "var(--muted)",
        line: "var(--line)",
        "line-strong": "var(--line-strong)",
        signal: "var(--signal)",
        game: "var(--game)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        label: ["0.75rem", { lineHeight: "1.4", letterSpacing: "0.08em" }],
        lead: ["clamp(1.125rem, 1rem + 0.4vw, 1.25rem)", { lineHeight: "1.5" }],
        h3: [
          "clamp(1.5rem, 1.3rem + 0.6vw, 1.75rem)",
          { lineHeight: "1.15", letterSpacing: "-0.03em" },
        ],
        h2: [
          "clamp(2rem, 1.4rem + 2vw, 3rem)",
          { lineHeight: "1.08", letterSpacing: "-0.04em" },
        ],
        display: [
          "clamp(2.75rem, 1.6rem + 4.4vw, 5.5rem)",
          { lineHeight: "1", letterSpacing: "-0.05em" },
        ],
        hero: [
          "clamp(4rem, 2rem + 7vw, 8.5rem)",
          { lineHeight: "0.9", letterSpacing: "-0.055em" },
        ],
      },
      maxWidth: { content: "var(--content)" },
      spacing: { gutter: "var(--gutter)", section: "var(--space-section)" },
      borderRadius: { control: "3px" },
    },
  },
} satisfies Config;
