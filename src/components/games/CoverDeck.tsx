import Image from "next/image";
import { SiteLink as Link } from "@/components/ui/SiteLink";
import type { CSSProperties } from "react";
import type { Game } from "@/types/game";
import { Arrow } from "@/components/ui/Arrow";
import { Spark } from "@/components/ui/Spark";

/** Real navigation dressed as a stack of game covers; works with focus as well as hover. */
export function CoverDeck({ games }: { games: Game[] }) {
  // The fan is drawn for up to four covers; --count keeps fewer centered.
  const covers = games.slice(0, 4);
  return (
    <div className="cover-deck-wrap">
      <div className="deck-orbit" aria-hidden="true" />
      <span className="deck-star" aria-hidden="true">
        <Spark />
      </span>
      <span className="deck-plus" aria-hidden="true">
        +
      </span>
      <div
        className="cover-deck"
        role="group"
        aria-label="Preview the collection"
        style={{ "--count": covers.length } as CSSProperties}
      >
        {covers.map((game, index) => (
          <Link
            prefetch={false}
            href={`/games/${game.slug}`}
            key={game.slug}
            className="deck-card"
            style={
              { "--slot": index, "--game": game.accentColor } as CSSProperties
            }
            aria-label={`Explore ${game.title}`}
          >
            <Image
              quality={60}
              src={game.coverImage.src}
              alt=""
              width={300}
              height={390}
              sizes="220px"
              // The deck is at the top of the home page on every screen size.
              loading="eager"
              className="deck-image"
            />
            <span className="deck-card-label">
              {game.title}
              <span aria-hidden="true">
                <Arrow />
              </span>
            </span>
          </Link>
        ))}
      </div>
      <p className="deck-caption">
        <span aria-hidden="true">
          <Arrow direction="up-left" />
        </span>{" "}
        Pick a cover. See where it goes.
      </p>
    </div>
  );
}
