import type { Config } from "tailwindcss";
export default {
  theme: {
    extend: {
      colors: {
        canvas: "var(--canvas)",
        panel: "var(--panel)",
        ink: "var(--ink)",
        muted: "var(--muted)",
        accent: "var(--accent)",
        line: "var(--line)",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      spacing: { gutter: "var(--gutter)", section: "var(--space-section)" },
    },
  },
} satisfies Config;
