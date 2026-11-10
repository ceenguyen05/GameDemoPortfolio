import { games } from "@/content/games";
import { GameCard } from "@/components/games/GameCard";
import { LibraryFilter } from "@/components/games/LibraryFilter";
import { statusLabels, statusOrder } from "@/lib/gameStatus";

/**
 * The full library as a numbered catalog. Rows render on the server; the
 * client-side filter only flips a data attribute, so no row hydrates.
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
      aria-labelledby="library-title"
      className="scroll-mt-6 pt-section"
    >
      <div className="grid gap-4 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-8">
          <p className="label text-muted">The library</p>
          <h2 id="library-title" className="mt-3 text-h2">
            Every game, one shelf.
          </h2>
        </div>
        <p className="text-muted lg:col-span-4 lg:text-right">
          Live games launch straight from here. The rest are on the way.
        </p>
      </div>
      <LibraryFilter total={games.length} filters={filters}>
        <ol className="border-b border-line">
          {games.map((game, index) => (
            <GameCard key={game.slug} game={game} position={index + 1} />
          ))}
        </ol>
      </LibraryFilter>
    </section>
  );
}
