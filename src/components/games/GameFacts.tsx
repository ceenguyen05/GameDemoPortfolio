import type { Game } from "@/types/game";
import { Arrow } from "@/components/ui/Arrow";
import { Tag } from "@/components/ui/Tag";
import { siteConfig } from "@/lib/siteConfig";
import { displayUrl, formatDate } from "@/lib/format";

/** Lets long URLs wrap after each slash instead of mid-word. */
function breakAtSlashes(text: string): React.ReactNode[] {
  return text
    .split("/")
    .flatMap((part, index) =>
      index === 0 ? [part] : ["/", <wbr key={index} />, part],
    );
}

type Row = { term: string; value: React.ReactNode };
type MaybeRow = Row | false | "" | null | undefined;

/** The game page's fact sheet. Rows without data are left out, not filled with "TBA". */
export function GameFacts({ game }: { game: Game }) {
  const shareUrl = `${siteConfig.url}/play/${game.slug}`;
  const candidates: MaybeRow[] = [
    { term: "Status", value: <Tag status={game.status} /> },
    game.genre.length > 0 && { term: "Genre", value: game.genre.join(", ") },
    game.platforms.length > 0 && {
      term: "Platform",
      value: game.platforms.join(", "),
    },
    game.releaseDate && {
      term: "Released",
      value: (
        <time dateTime={game.releaseDate}>{formatDate(game.releaseDate)}</time>
      ),
    },
    game.changelog?.[0] && {
      term: "Version",
      value: <span className="font-mono">v{game.changelog[0].version}</span>,
    },
    game.techStack.length > 0 && {
      term: "Built with",
      value: (
        <ul className="flex flex-wrap gap-1.5">
          {game.techStack.map((tech) => (
            <li
              key={tech}
              className="rounded-control border border-line px-2 py-0.5 font-mono text-xs"
            >
              {tech}
            </li>
          ))}
        </ul>
      ),
    },
    game.repoUrl && {
      term: "Source",
      value: (
        <a
          href={game.repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-xs underline decoration-line-strong underline-offset-4 hover:decoration-ink"
        >
          {breakAtSlashes(displayUrl(game.repoUrl))} <Arrow />
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      ),
    },
    game.status === "live" && {
      term: "Share link",
      value: (
        <a
          href={`/play/${game.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-xs underline decoration-line-strong underline-offset-4 hover:decoration-ink"
        >
          {breakAtSlashes(displayUrl(shareUrl))}
          <span className="sr-only"> (opens the game in a new tab)</span>
        </a>
      ),
    },
  ];
  const rows = candidates.filter((row): row is Row => Boolean(row));

  return (
    <dl className="border-t border-line-strong">
      {rows.map((row) => (
        <div
          key={row.term}
          className="grid grid-cols-[7rem_1fr] gap-4 border-b border-line py-3"
        >
          <dt className="label pt-0.5 text-muted">{row.term}</dt>
          <dd className="min-w-0 text-sm font-semibold">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}
