import { SiteLink as Link } from "@/components/ui/SiteLink";
import { siteConfig } from "@/lib/siteConfig";
import { games } from "@/content/games";
import { Arrow } from "@/components/ui/Arrow";
import { statusLabels } from "@/lib/gameStatus";

export function AboutView() {
  return (
    <>
      <nav aria-label="Breadcrumb" className="py-6">
        <Link
          prefetch={false}
          href="/"
          className="inline-flex min-h-11 items-center text-sm text-muted hover:text-ink"
        >
          <span aria-hidden="true">←</span>&nbsp;Back to the collection
        </Link>
      </nav>
      <section className="collection-about">
        <p className="label text-signal">This is {siteConfig.name}</p>
        <h1 className="text-display">
          A place for games.
          <br />
          <span className="text-signal">And the people who play them.</span>
        </h1>
        <p>
          Some projects start with an idea. Others start with “wouldn’t it be
          fun if…”. This is a home for those games: the ones you can open in a
          tab and send to a friend.
        </p>
        <p>
          Explore the screenshots, read up on the controls, and hit Play now.
          The game opens on its own website in a new tab, so the collection
          stays right here.
        </p>
      </section>
      <section className="about-notes" data-reveal="">
        <div>
          <span className="about-number">01</span>
          <h2>
            Different games.
            <br />
            Different makers.
          </h2>
          <p>
            Every game has its own page with credits and development notes. Get
            to know the people behind them on{" "}
            <Link
              href="/makers"
              className="underline underline-offset-4 hover:text-signal"
            >
              The makers
            </Link>
            , with their backgrounds, projects, and public links.
          </p>
        </div>
        <div>
          <span className="about-number">02</span>
          <h2>
            A work
            <br />
            in progress.
          </h2>
          <p>
            Play what’s ready. Take a look at what’s next. Upcoming games stay
            clearly marked until there’s a real build to try.
          </p>
        </div>
      </section>
      <section className="about-directory" data-reveal="">
        <h2 className="text-h2">Find your way in.</h2>
        {games.map((game) => (
          <Link prefetch={false} key={game.slug} href={`/games/${game.slug}`}>
            <span>{game.title}</span>
            <span>
              {game.status === "live"
                ? "Ready to play"
                : statusLabels[game.status]}{" "}
              <Arrow />
            </span>
          </Link>
        ))}
      </section>
    </>
  );
}
