import Link from "next/link";
import { games } from "@/content/games";
import { GameHero } from "@/components/games/GameHero";
import { GameGrid } from "@/components/games/GameGrid";
export function HomeContent() {
  const featured = games.find((game) => game.status === "live") ?? games[0];
  return (
    <>
      <section className="opening">
        <div>
          <p className="eyebrow">
            <span className="accent-text">GAMES BY CASEY NGUYEN</span>
            <span className="opening-divider">/</span>BUILT FOR THE BROWSER
          </p>
          <h1>
            Small worlds.
            <br className="mobile-break" /> <span>Open to everyone.</span>
          </h1>
        </div>
        <p>
          A collection of games by Casey Nguyen.
          <br />
          Find something to play. No installation needed.
        </p>
      </section>
      {featured && <GameHero game={featured} featured />}
      <GameGrid />
      <section className="maker-note">
        <p className="eyebrow accent-text">A little about me</p>
        <div>
          <h2>
            Made by one person.
            <br />
            Built to be played.
          </h2>
          <p>
            I’m Casey, a software engineer building games for the browser. This
            is where the playable ones live. No launcher. Just the work.
          </p>
          <Link className="text-link" href="/about">
            More about Casey ↗
          </Link>
        </div>
        <span className="maker-monogram" aria-hidden="true">
          CN<span>↗</span>
        </span>
      </section>
    </>
  );
}
