import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/siteConfig";
import { theme } from "@/lib/theme";

export const ogSize = { width: 1200, height: 630 };

/**
 * Social card in the site's catalog style: paper ground, an accent swatch,
 * the title large, and the destination in the footer.
 */
export function createOgImage({
  eyebrow,
  title,
  subtitle,
  footer,
  accent = theme.signal,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  footer: string;
  accent?: string;
}) {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        background: theme.paper,
        color: theme.ink,
        fontFamily: "sans-serif",
        borderTop: `16px solid ${accent}`,
        padding: "48px 64px 44px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: 22,
          letterSpacing: 3,
          color: theme.muted,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 22, height: 22, background: accent }} />
          <span>{eyebrow.toUpperCase()}</span>
        </div>
        <span>{`${siteConfig.name.toUpperCase()} / GAMES`}</span>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginTop: "auto",
          marginBottom: "auto",
        }}
      >
        <div
          style={{
            fontSize: title.length > 20 ? 92 : 124,
            fontWeight: 800,
            lineHeight: 1,
            letterSpacing: -5,
          }}
        >
          {title}
        </div>
        <div style={{ marginTop: 28, fontSize: 34, color: theme.muted }}>
          {subtitle}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          borderTop: `2px solid ${theme.line}`,
          paddingTop: 22,
          fontSize: 24,
        }}
      >
        <span>{footer}</span>
        <span style={{ color: theme.signal }}>Browser games, no install</span>
      </div>
    </div>,
    ogSize,
  );
}
