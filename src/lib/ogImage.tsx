import { ImageResponse } from "next/og";
export function createOgImage(
  title: string,
  subtitle: string,
  accent = "#24574b",
) {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: "100%",
        height: "100%",
        background: "#f4f3ee",
        color: "#1b2220",
        padding: "56px",
        fontFamily: "sans-serif",
        borderTop: `12px solid ${accent}`,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 22,
          letterSpacing: 3,
        }}
      >
        <span>CASEY NGUYEN / GAMES</span>
        <span style={{ color: "#24574b" }}>BROWSER FIRST</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            fontSize: title.length > 22 ? 80 : 106,
            lineHeight: 1,
            fontWeight: 700,
            letterSpacing: -4,
          }}
        >
          {title}
        </div>
        <div style={{ fontSize: 28, color: "#606761", marginTop: 28 }}>
          {subtitle}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          borderTop: "1px solid #d8dcd5",
          paddingTop: 22,
          fontSize: 20,
        }}
      >
        <span>INDEPENDENT WORK. OPEN TO PLAY.</span>
        <span style={{ color: "#24574b" }}>EXPLORE THE LIBRARY →</span>
      </div>
    </div>,
    { width: 1200, height: 630 },
  );
}
