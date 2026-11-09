import { existsSync, readFileSync, appendFileSync } from "node:fs";
const path = ".lighthouseci/links.json";
if (process.env.GITHUB_STEP_SUMMARY && existsSync(path)) {
  const links = JSON.parse(readFileSync(path, "utf8"));
  appendFileSync(
    process.env.GITHUB_STEP_SUMMARY,
    "## Lighthouse reports\n\n" +
      Object.entries(links)
        .map(([url, report]) => `- [${url}](${report})`)
        .join("\n") +
      "\n",
  );
}
