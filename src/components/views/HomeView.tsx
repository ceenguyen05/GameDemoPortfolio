import Link from "next/link";
import { featuredGame, games } from "@/content/games";
import { GameHero } from "@/components/games/GameHero";
import { GameGrid } from "@/components/games/GameGrid";
import { statusLabels, statusOrder } from "@/lib/gameStatus";
import { catalogNumber } from "@/lib/format";

export function HomeView() {
  const counts = [
    { label: "Games", value: games.length },
    ...statusOrder
      .map((status) => ({
        label: statusLabels[status],
        value: games.filter((game) => game.status === status).length,
      }))
      .filter((count) => count.value > 0),
  ];

  return (
    <>
      <section className="grid gap-8 pt-12 pb-10 lg:grid-cols-12 lg:gap-6 lg:pt-20 lg:pb-14">
        <div className="lg:col-span-7">
          <p className="label text-muted">Browser games by Casey Nguyen</p>
          <h1 className="mt-5 text-display">
            Small worlds.
            <br />
            Open to everyone.
          </h1>
        </div>
        <div className="lg:col-span-4 lg:col-start-9 lg:self-end">
          <p className="text-lead text-muted">
            Games I build to run in a browser tab. Pick one, learn the controls,
            and play. Nothing to install.
          </p>
          <dl className="mt-6 grid auto-cols-fr grid-flow-col border-y border-line">
            {counts.map((count) => (
              <div
                key={count.label}
                className="border-line py-3 not-first:border-l not-first:pl-4"
              >
                <dt className="label text-muted">{count.label}</dt>
                <dd className="mt-1 font-mono text-2xl">
                  {catalogNumber(count.value)}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {featuredGame && <GameHero game={featuredGame} featured />}

      <GameGrid />

      <section
        aria-labelledby="maker-title"
        className="mt-section grid gap-6 border-t border-line pt-10 lg:grid-cols-12"
      >
        <p className="label text-muted lg:col-span-3">Who makes these</p>
        <div className="lg:col-span-7">
          <h2 id="maker-title" className="text-h2">
            Made by one person.
            <br />
            Built to be played.
          </h2>
          <p className="mt-5 max-w-xl text-lead text-muted">
            I’m Casey, a software engineer. Every game here ships to its own
            URL, so playing one is as simple as opening a link.
          </p>
          <Link
            href="/about"
            className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-semibold underline decoration-line-strong underline-offset-4 hover:decoration-ink"
          >
            About and contact <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </>
  );
}
