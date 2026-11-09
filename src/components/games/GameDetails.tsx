import type { CSSProperties } from "react";
import Link from "next/link";
import type { Game } from "@/types/game";
import { GameHero } from "@/components/games/GameHero";
import { Gallery } from "@/components/games/Gallery";
import { ControlsList } from "@/components/games/ControlsList";
import { PlayButton } from "@/components/games/PlayButton";
export function GameDetails({ game }: { game: Game }) {
  return (
    <div style={{ "--game-accent": game.accentColor } as CSSProperties}>
      <div className="breadcrumb eyebrow">
        <Link href="/#library">← Game library</Link>
        <span>{game.slug}</span>
      </div>
      <GameHero game={game} />
      <section className="briefing">
        <p className="eyebrow accent-text">About this game</p>
        <h2>{game.tagline}</h2>
        <p>{game.description.long}</p>
        <div className="genre-tags">
          {game.genre.map((genre) => (
            <span key={genre}>{genre}</span>
          ))}
        </div>
      </section>
      <Gallery images={game.screenshots} />
      <ControlsList game={game} />
      <section className="technical-record" aria-labelledby="record-title">
        <div>
          <p className="eyebrow accent-text">Made with</p>
          <h2 id="record-title">Behind the game.</h2>
          <div className="tech-tags">
            {game.techStack.length ? (
              game.techStack.map((tech) => <span key={tech}>{tech}</span>)
            ) : (
              <p>Stack not announced.</p>
            )}
          </div>
          {game.repoUrl && (
            <a className="text-link" href={game.repoUrl}>
              Read the source on GitHub ↗
            </a>
          )}
          {game.releaseDate && (
            <p className="eyebrow">
              Released{" "}
              <time dateTime={game.releaseDate}>{game.releaseDate}</time>
            </p>
          )}
        </div>
        <div className="changelog">
          <h3>Release notes</h3>
          {game.changelog?.length ? (
            game.changelog.map((entry) => (
              <article key={entry.version}>
                <h4>
                  {entry.version}{" "}
                  <time dateTime={entry.date}>{entry.date}</time>
                </h4>
                <ul>
                  {entry.notes.map((note) => (
                    <li key={note}>{note}</li>
                  ))}
                </ul>
              </article>
            ))
          ) : (
            <p>
              {game.status === "live"
                ? "Public release notes have not been published here yet. Follow the repository for development history."
                : "No releases yet."}
            </p>
          )}
          {game.trailerUrl && (
            <a href={game.trailerUrl} className="text-link">
              Watch trailer ↗
            </a>
          )}
        </div>
      </section>
      <section className="closing-launch">
        <div>
          <p className="eyebrow">Ready when you are</p>
          <h2>
            {game.status === "live" ? "Give it a play." : "More to come."}
          </h2>
        </div>
        <PlayButton game={game} />
      </section>
    </div>
  );
}
