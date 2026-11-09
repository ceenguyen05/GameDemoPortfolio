import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import type { Game } from "@/types/game";
import { Tag } from "@/components/ui/Tag";
import { PlayButton } from "@/components/games/PlayButton";
export function GameCard({ game, index }: { game: Game; index: number }) {
  return (
    <article
      className={`game-card ${game.status === "live" ? "live-card" : "classified-card"}`}
      style={{ "--game-accent": game.accentColor } as CSSProperties}
    >
      <Link
        href={`/games/${game.slug}`}
        className="card-image-link"
        aria-label={`Game / ${String(index + 1).padStart(2, "0")}: View ${game.title} details`}
      >
        <div className="card-image">
          <Image
            src={game.coverImage.src}
            alt={game.coverImage.alt}
            fill
            sizes="(max-width: 760px) 100vw, 50vw"
          />
          {game.screenshots[0] && (
            <Image
              src={game.screenshots[0].src}
              alt=""
              fill
              sizes="(max-width: 760px) 100vw, 50vw"
              className="card-alternate"
            />
          )}
          <span className="card-index eyebrow">
            GAME / {String(index + 1).padStart(2, "0")}
          </span>
          <span className="card-open" aria-hidden="true">
            ↗
          </span>
        </div>
      </Link>
      <div className="card-body">
        <Tag status={game.status} />
        <h3>
          <Link href={`/games/${game.slug}`}>{game.title}</Link>
        </h3>
        <p>{game.description.short}</p>
        <div className="card-actions">
          {game.status === "live" ? (
            <PlayButton game={game} compact />
          ) : (
            <span className="locked-label">⊠ &nbsp; Not available yet</span>
          )}
          <Link
            href={`/games/${game.slug}`}
            className="text-link"
            aria-label={`Read ${game.title} details`}
          >
            Details ↗
          </Link>
        </div>
      </div>
    </article>
  );
}
