import { SaveGame } from "./SaveGame";
import { SiteLink as Link } from "@/components/ui/SiteLink";
import type { CSSProperties } from "react";
import type { Game } from "@/types/game";
import { Tag } from "@/components/ui/Tag";
import { Arrow } from "@/components/ui/Arrow";
import { PlayButton } from "@/components/games/PlayButton";
import { HeroPreview } from "@/components/games/HeroPreview";
import { formatDate } from "@/lib/format";

/**
 * The feature panel: title, tagline and Play on the left, a selectable preview
 * on the right, facts below. The home page uses it for the spotlight (h2);
 * each game page uses it as its hero (h1).
 */
export function GameHero({
  game,
  featured = false,
}: {
  game: Game;
  featured?: boolean;
}) {
  const Heading = featured ? "h2" : "h1";
  const [name, subtitle] = game.title.split(": ");
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
  ].filter((f) => f.value);
  return (
    <section
      aria-labelledby={`${game.slug}-hero-title`}
      className="game-feature"
      style={{ "--game": game.accentColor } as CSSProperties}
    >
      <div className="feature-copy">
        <div className="feature-eyebrow">
          <span className="label text-muted">
            {featured ? "Featured game" : "Inside the game"}
          </span>
          <Tag status={game.status} />
        </div>
        <Heading
          id={`${game.slug}-hero-title`}
          className={
            name.length > 8
              ? "feature-title feature-title-long"
              : "feature-title"
          }
        >
          {name}
          {subtitle && <span>{subtitle}</span>}
        </Heading>
        <p className="feature-tagline">{game.tagline}</p>
        <p className="feature-description">{game.description.short}</p>
        <div className="feature-actions">
          <PlayButton game={game} />
          {!featured && <SaveGame slug={game.slug} title={game.title} />}
          {featured && (
            <Link
              prefetch={false}
              href={`/games/${game.slug}`}
              className="feature-details"
            >
              Take a closer look <Arrow />
            </Link>
          )}
        </div>
      </div>
      <HeroPreview
        priority={!featured}
        images={[game.coverImage, ...game.screenshots].filter(
          (image, index, images) =>
            images.findIndex((item) => item.src === image.src) === index,
        )}
      />
      {facts.length > 0 && (
        <dl className="feature-facts">
          {facts.map((fact) => (
            <div key={fact.term}>
              <dt className="label text-muted">{fact.term}</dt>
              <dd>{fact.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  );
}
