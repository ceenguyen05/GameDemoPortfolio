import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import type { Game } from "@/types/game";
import { Tag } from "@/components/ui/Tag";
import { PlayButton } from "@/components/games/PlayButton";
export function GameHero({
  game,
  featured = false,
}: {
  game: Game;
  featured?: boolean;
}) {
  const [name, series] = game.title.split(": ");
  return (
    <section
      className="game-hero"
      style={{ "--game-accent": game.accentColor } as CSSProperties}
      aria-labelledby="game-title"
    >
      <div className="hero-copy">
        <div className="hero-eyebrow">
          <span className="eyebrow">
            {featured ? "Featured game" : "Game details"}
          </span>
          <Tag status={game.status} />
        </div>
        {featured ? (
          <h2 id="game-title" className="game-title">
            {name}
            {series && <span>{series}</span>}
          </h2>
        ) : (
          <h1 id="game-title" className="game-title">
            {name}
            {series && <span>{series}</span>}
          </h1>
        )}
        <p className="hero-tagline">{game.tagline}</p>
        <p className="hero-description">{game.description.short}</p>
        <div className="hero-actions">
          <PlayButton game={game} />
          {featured && (
            <Link href={`/games/${game.slug}`} className="dossier-link">
              About the game <span aria-hidden="true">↗</span>
            </Link>
          )}
        </div>
        <p className="platform-note">
          {game.platforms.length
            ? game.platforms.join(" / ")
            : "Details under wraps"}
        </p>
      </div>
      <figure className="hero-media">
        <Image
          src={game.coverImage.src}
          alt={game.coverImage.alt}
          fill
          sizes="(max-width: 760px) 100vw, 60vw"
          preload
          fetchPriority="high"
          className="hero-image"
        />
        <div className="media-corner top-left" aria-hidden="true" />
        <div className="media-corner bottom-right" aria-hidden="true" />
        <span className="media-index eyebrow" aria-hidden="true">
          In-game capture
        </span>
        <figcaption>
          <span>{game.coverImage.caption}</span>
          <span>
            01 — {String(game.screenshots.length + 1).padStart(2, "0")}
          </span>
        </figcaption>
      </figure>
      <div className="spec-strip">
        <div>
          <span className="eyebrow">Genre</span>
          <span>{game.genre[0] ?? "Classified"}</span>
        </div>
        <div>
          <span className="eyebrow">Play on</span>
          <span>
            {game.status === "live" ? "Browser / No install" : "Pending"}
          </span>
        </div>
        <div>
          <span className="eyebrow">Built by</span>
          <span>Casey Nguyen</span>
        </div>
        <Link href={`/games/${game.slug}#controls`} className="spec-link">
          {game.controls.length ? "See the controls" : "About this project"}{" "}
          <span aria-hidden="true">↓</span>
        </Link>
      </div>
    </section>
  );
}
