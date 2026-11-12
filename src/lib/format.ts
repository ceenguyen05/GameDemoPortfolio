const dateFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

/** "2026-11-09" → "9 Nov 2026" */
export function formatDate(isoDate: string): string {
  return dateFormat.format(new Date(`${isoDate}T00:00:00Z`));
}

/** 1 → "01" */
export function catalogNumber(position: number): string {
  return String(position).padStart(2, "0");
}

/** "https://aci-series1.vercel.app/" → "aci-series1.vercel.app" */
export function hostname(url: string): string {
  return new URL(url).hostname;
}

/** "https://github.com/ceenguyen05/ACI-Series1" → "github.com/ceenguyen05/ACI-Series1" */
export function displayUrl(url: string): string {
  const { hostname: host, pathname } = new URL(url);
  return `${host}${pathname === "/" ? "" : pathname}`;
}
