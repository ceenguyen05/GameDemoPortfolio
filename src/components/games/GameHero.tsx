import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import type { Game } from "@/types/game";
import { games } from "@/content/games";
import { Tag } from "@/components/ui/Tag";
import { PlayButton } from "@/components/games/PlayButton";
import { catalogNumber, formatDate } from "@/lib/format";

/**
 * Framed 5/7 split: copy and Play on the left, cover art on the right, a fact
 * strip below. Used for the featured game on the home page (h2) and as the
 * hero of each game page (h1).
 */
export function GameHero({
  game,
  featured = false,
}: {
  game: Game;
  featured?: boolean;
}) {
  const number = catalogNumber(games.indexOf(game) + 1);
  const [name, subtitle] = game.title.split(": ");
  const Heading = featured ? "h2" : "h1";
  const titleId = `${game.slug}-hero-title`;

  const facts = [
    { term: "Genre", value: game.genre.slice(0, 2).join(" · ") },
    { term: "Platform", value: game.platforms.join(" · ") },
    {
      term: "Released",
      value: game.releaseDate ? formatDate(game.releaseDate) : "",
    },
    {
      term: "Version",
      value: game.changelog?.[0] ? `v${game.changelog[0].version}` : "",
    },
  ].filter((fact) => fact.value);

  return (
    <section
      aria-labelledby={titleId}
      style={{ "--game": game.accentColor } as CSSProperties}
      className="grid border border-t-4 border-line border-t-game bg-surface lg:grid-cols-12"
    >
      <div className="flex flex-col p-6 sm:p-8 lg:col-span-5 lg:p-10">
        <div className="flex items-center justify-between gap-4">
          <p className="label text-muted">
            {featured ? "Featured" : "Game"} · No. {number}
          </p>
          <Tag status={game.status} />
        </div>
        <Heading
          id={titleId}
          // Short names ("ACI") get the oversized hero cut; longer ones step down
          // so words never break mid-word in the 5-column copy panel.
          className={`mt-8 break-words lg:mt-12 ${name.length > 8 ? "text-display" : "text-hero"}`}
        >
          {name}
          {subtitle && (
            <span className="mt-3 block text-[0.42em] leading-none tracking-[-0.035em]">
              {subtitle}
            </span>
          )}
        </Heading>
        {game.workingTitle && (
          <p className="label mt-3 text-muted">Working title</p>
        )}
        <p className="mt-6 text-lead font-semibold">{game.tagline}</p>
        <p className="mt-3 max-w-md text-muted">{game.description.short}</p>
        <div className="mt-8 flex flex-wrap items-start gap-x-8 gap-y-4 lg:mt-auto lg:pt-10">
          <PlayButton game={game} />
          {featured && (
            <Link
              href={`/games/${game.slug}`}
              className="inline-flex min-h-14 items-center gap-2 text-sm font-semibold underline decoration-line-strong underline-offset-4 hover:decoration-ink"
            >
              Controls, gallery and notes
              <span aria-hidden="true">→</span>
            </Link>
          )}
        </div>
      </div>

      <figure className="flex flex-col border-t border-line lg:col-span-7 lg:border-t-0 lg:border-l">
        <div className="relative aspect-[16/10] bg-sunken lg:aspect-auto lg:min-h-[30rem] lg:flex-1">
          <Image
            src={game.coverImage.src}
            alt={game.coverImage.alt}
            fill
            preload
            fetchPriority="high"
            quality={60}
            sizes="(min-width: 1440px) 800px, (min-width: 1024px) 56vw, 100vw"
            className="object-cover"
          />
        </div>
        <figcaption className="label border-t border-line px-4 py-3 text-muted sm:px-6">
          {game.coverImage.caption}
        </figcaption>
      </figure>

      {facts.length > 0 && (
        <dl className="grid grid-cols-2 border-t border-line bg-paper sm:auto-cols-fr sm:grid-flow-col sm:grid-cols-none lg:col-span-12">
          {facts.map((fact) => (
            <div
              key={fact.term}
              className="border-line px-6 py-4 not-last:border-r max-sm:nth-2:border-r-0 max-sm:nth-[n+3]:border-t"
            >
              <dt className="label text-muted">{fact.term}</dt>
              <dd className="mt-1 text-sm font-semibold">{fact.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  );
}
