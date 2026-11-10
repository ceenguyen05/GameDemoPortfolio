import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import type { Game } from "@/types/game";
import { Tag } from "@/components/ui/Tag";
import { PlayButton } from "@/components/games/PlayButton";
import { catalogNumber } from "@/lib/format";

/**
 * One catalog row. The title link stretches over the whole row (details page);
 * the Play control sits above it so both stay separately reachable.
 * Hover or keyboard focus crossfades the cover to the first screenshot.
 */
export function GameCard({ game, position }: { game: Game; position: number }) {
  const number = catalogNumber(position);
  const alternate = game.screenshots[0];
  return (
    <li
      data-status={game.status}
      style={{ "--game": game.accentColor } as CSSProperties}
      className="group relative grid gap-4 border-t border-line py-6 lg:grid-cols-12 lg:gap-6 lg:py-8"
    >
      <div className="flex items-center gap-3 lg:col-span-1 lg:flex-col lg:items-start">
        <span aria-hidden="true" className="size-3 bg-game" />
        <span className="label text-muted">No. {number}</span>
      </div>

      <div className="relative aspect-video overflow-hidden bg-sunken lg:col-span-4">
        <Image
          src={game.coverImage.src}
          alt={game.coverImage.alt}
          fill
          sizes="(min-width: 1440px) 440px, (min-width: 1024px) 31vw, 100vw"
          className="object-cover"
        />
        {alternate && (
          <Image
            src={alternate.src}
            alt=""
            fill
            sizes="(min-width: 1440px) 440px, (min-width: 1024px) 31vw, 100vw"
            className="object-cover opacity-0 transition-opacity duration-200 ease-out group-focus-within:opacity-100 group-hover:opacity-100 motion-reduce:hidden"
          />
        )}
      </div>

      <div className="lg:col-span-4">
        <h3 className="text-h3">
          <Link
            href={`/games/${game.slug}`}
            className="stretched decoration-2 underline-offset-4 group-hover:underline"
          >
            {game.title}
          </Link>
        </h3>
        {game.workingTitle && (
          <p className="label mt-1 text-muted">Working title</p>
        )}
        <p className="mt-2 font-semibold">{game.tagline}</p>
        <p className="mt-2 text-sm text-muted">{game.description.short}</p>
        {game.genre.length > 0 && (
          <p className="label mt-4 text-muted">{game.genre.join(" · ")}</p>
        )}
      </div>

      <div className="relative z-10 flex flex-col items-start gap-4 lg:col-span-3">
        <Tag status={game.status} />
        <PlayButton game={game} size="md" />
      </div>
    </li>
  );
}
