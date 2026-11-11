import { SiteLink as Link } from "@/components/ui/SiteLink";
import { featuredGame, games, liveGames } from "@/content/games";
import { GameHero } from "@/components/games/GameHero";
import { GameGrid } from "@/components/games/GameGrid";
import { CoverDeck } from "@/components/games/CoverDeck";
import { Arrow } from "@/components/ui/Arrow";
import { Spark } from "@/components/ui/Spark";

export function HomeView() {
  return (
    <>
      <section className="home-intro" aria-labelledby="home-title">
        <div className="intro-copy">
          <p className="intro-label">
            <span className="tiny-star" aria-hidden="true">
              <Spark />
            </span>{" "}
            A little corner of the internet. For playing.
          </p>
          <h1 id="home-title">
            One more
            <br />
            <span>quick game.</span>
          </h1>
          <p className="intro-description">
            A few games. A few good friends. Something different in every tab.
            Find your next favorite.
          </p>
          <div className="intro-actions">
            <Link href="#library" className="browse-button">
              Explore the games{" "}
              <span aria-hidden="true">
                <Arrow direction="down-right" />
              </span>
            </Link>
            <span className="availability">
              <i aria-hidden="true" />
              {liveGames.length} ready to play
              <span className="availability-divider">/</span>
              {games.length - liveGames.length} on the way
            </span>
          </div>
        </div>
        <CoverDeck games={games} />
      </section>
      {featuredGame && (
        <div className="featured-wrap" data-reveal="">
          <div className="section-kicker">
            <span className="label">In the spotlight</span>
            <span>
              Something to play right now{" "}
              <span aria-hidden="true">
                <Arrow direction="down-right" />
              </span>
            </span>
          </div>
          <GameHero game={featuredGame} featured />
        </div>
      )}
      <GameGrid />
      <section
        className="share-banner"
        aria-labelledby="share-title"
        data-reveal=""
      >
        <span className="share-art" aria-hidden="true">
          <Arrow />
        </span>
        <div>
          <p className="label">Good games travel</p>
          <h2 id="share-title">
            Send a link.
            <br />
            Start something.
          </h2>
          <p>
            No launcher, no installation. Just pick a game, open a tab, and pass
            it on to a friend.
          </p>
        </div>
        <Link href="/about" className="banner-link">
          Meet the collection <span aria-hidden="true">→</span>
        </Link>
      </section>
    </>
  );
}
