"use client";
import { useState } from "react";
import { games } from "@/content/games";
import { GameCard } from "@/components/games/GameCard";
import type { GameStatus } from "@/types/game";
const filters: { value: "all" | GameStatus; label: string }[] = [
  { value: "all", label: "All games" },
  { value: "live", label: "Live" },
  { value: "in-development", label: "In development" },
  { value: "coming-soon", label: "Coming soon" },
];
export function GameGrid() {
  const [filter, setFilter] = useState<"all" | GameStatus>("all");
  const visible = games.filter(
    (game) => filter === "all" || game.status === filter,
  );
  return (
    <section id="library" className="library" aria-labelledby="library-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow accent-text">The collection</p>
          <h2 id="library-title">Find your next game.</h2>
        </div>
        <span className="eyebrow library-count">
          {String(
            games.filter((game) => game.status === "live").length,
          ).padStart(2, "0")}{" "}
          LIVE / {String(games.length).padStart(2, "0")} GAMES
        </span>
      </div>
      <div className="filters" role="group" aria-label="Filter games by status">
        {filters.map((item) => (
          <button
            type="button"
            key={item.value}
            aria-pressed={filter === item.value}
            onClick={() => setFilter(item.value)}
          >
            {item.label}
            <span>
              {item.value === "all"
                ? games.length
                : games.filter((game) => game.status === item.value).length}
            </span>
          </button>
        ))}
      </div>
      <p className="sr-only" role="status">
        {visible.length} {visible.length === 1 ? "game" : "games"} shown
      </p>
      <div className="game-grid">
        {visible.map((game) => (
          <GameCard key={game.slug} game={game} index={games.indexOf(game)} />
        ))}
      </div>
      {visible.length === 0 && (
        <div className="empty-state">
          <p className="eyebrow">Nothing here yet</p>
          <h3>Nothing in this category. Yet.</h3>
          <button className="text-button" onClick={() => setFilter("all")}>
            Show all games →
          </button>
        </div>
      )}
    </section>
  );
}
