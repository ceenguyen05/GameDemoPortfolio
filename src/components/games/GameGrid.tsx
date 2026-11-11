import { CardLighting } from "./CardLighting";
import { games } from "@/content/games";
import { GameCard } from "@/components/games/GameCard";
import { LibraryFilter } from "@/components/games/LibraryFilter";
import { statusLabels, statusOrder } from "@/lib/gameStatus";

/**
 * The full library as numbered tiles. Tiles render on the server; the
 * client-side filter only flips a data attribute, so no tile hydrates.
 */
export function GameGrid() {
  const filters = statusOrder
    .map((status) => ({
      value: status,
      label: statusLabels[status],
      count: games.filter((game) => game.status === status).length,
    }))
    .filter((filter) => filter.count > 0);

  return (
    <section
      id="library"
      tabIndex={-1}
      aria-labelledby="library-title"
      className="library-section scroll-mt-6 pt-section"
    >
      <div className="grid gap-4 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-8">
          <p className="library-eyebrow label text-muted">
            <span
              className="library-marker"
              data-section-cue=""
              aria-hidden="true"
            />
            The library
          </p>
          <h2 id="library-title" className="mt-3 text-h2">
            Find your next rabbit hole.
          </h2>
        </div>
        <p className="text-muted lg:col-span-4 lg:text-right">
          Live games launch straight from here. The rest are on the way.
        </p>
      </div>
      <CardLighting />
      <LibraryFilter
        total={games.length}
        filters={filters}
        slugs={games.map((game) => game.slug)}
      >
        <ol className="game-tiles" data-reveal="">
          {games.map((game, index) => (
            <GameCard key={game.slug} game={game} position={index + 1} />
          ))}
        </ol>
      </LibraryFilter>
    </section>
  );
}
