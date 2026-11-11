import { SaveGame } from "./SaveGame";
import { QuickLook } from "./QuickLook";
import Image from "next/image";
import { SiteLink as Link } from "@/components/ui/SiteLink";
import type { CSSProperties } from "react";
import type { Game } from "@/types/game";
import { Tag } from "@/components/ui/Tag";
import { Arrow } from "@/components/ui/Arrow";
import { PlayButton } from "@/components/games/PlayButton";
import { catalogNumber } from "@/lib/format";

/**
 * One library tile. The title link covers the whole tile; the Play control sits
 * above it so both stay reachable. Hover or focus swaps in the first screenshot.
 */
export function GameCard({ game, position }: { game: Game; position: number }) {
  const alternate = game.screenshots[0];
  return (
    <li
      data-status={game.status}
      data-slug={game.slug}
      data-saved="false"
      style={{ "--game": game.accentColor } as CSSProperties}
      className="game-tile group"
    >
      <div className="game-tile-media">
        <span className="tile-light" aria-hidden="true" />
        <div className="tile-save">
          <SaveGame slug={game.slug} title={game.title} compact />
        </div>
        <Image
          quality={60}
          src={game.coverImage.src}
          alt={game.coverImage.alt}
          fill
          sizes="(min-width: 1200px) 320px, (min-width: 640px) 45vw, 100vw"
          className="tile-cover"
        />
        {alternate && (
          <Image
            quality={60}
            src={alternate.src}
            alt=""
            fill
            sizes="(min-width: 1200px) 320px, (min-width: 640px) 45vw, 100vw"
            className="tile-alternate"
          />
        )}
        <span className="tile-number" aria-hidden="true">
          {catalogNumber(position)}
        </span>
        <span className="tile-open" aria-hidden="true">
          <Arrow />
        </span>
      </div>
      <div className="tile-body">
        <div className="tile-status">
          <Tag status={game.status} />
        </div>
        <h3>
          <Link
            prefetch={false}
            href={`/games/${game.slug}`}
            className="stretched"
          >
            {game.title}
          </Link>
        </h3>
        <p>{game.description.short}</p>
        <div className="tile-bottom">
          <PlayButton game={game} size="md" />
          <span className="tile-details" aria-hidden="true">
            Details <Arrow />
          </span>
        </div>
      </div>
      <div className="tile-quick-row">
        <QuickLook
          game={{
            slug: game.slug,
            title: game.title,
            tagline: game.tagline,
            description: game.description.short,
            genre: game.genre,
            platforms: game.platforms,
            coverImage: game.coverImage,
            accentColor: game.accentColor,
            ...(game.status === "live"
              ? { status: game.status, playUrl: game.playUrl }
              : { status: game.status }),
          }}
        />
      </div>
    </li>
  );
}
