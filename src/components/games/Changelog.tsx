import type { ChangelogEntry } from "@/types/game";
import { catalogNumber, formatDate } from "@/lib/format";

/** Release notes, newest first, each version's notes as a numbered list. */
export function Changelog({ entries }: { entries: ChangelogEntry[] }) {
  if (!entries.length) return null;
  return (
    <section aria-labelledby="changelog-title" className="defer-render">
      <div className="flex items-baseline justify-between gap-4 border-t border-ink pt-3">
        <h2 id="changelog-title" className="label">
          Release notes
        </h2>
        <p className="label text-muted">
          {entries.length} {entries.length === 1 ? "release" : "releases"}
        </p>
      </div>
      {entries.map((entry) => (
        <article key={entry.version} className="mt-6">
          <h3 className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="inline-flex items-center gap-2 rounded-control bg-ink px-2.5 py-1 font-mono text-sm text-paper">
              <span aria-hidden="true" className="size-2 bg-game" />v
              {entry.version}
            </span>
            <time
              dateTime={entry.date}
              className="font-mono text-xs font-normal text-muted"
            >
              {formatDate(entry.date)}
            </time>
          </h3>
          <ol className="mt-6 grid gap-x-10 md:grid-cols-2">
            {entry.notes.map((note, index) => (
              <li
                key={note}
                className="grid grid-cols-[2rem_1fr] gap-2 border-t border-line py-3 text-sm"
              >
                <span
                  aria-hidden="true"
                  className="font-mono text-xs text-muted"
                >
                  {catalogNumber(index + 1)}
                </span>
                <span>{note}</span>
              </li>
            ))}
          </ol>
        </article>
      ))}
    </section>
  );
}
