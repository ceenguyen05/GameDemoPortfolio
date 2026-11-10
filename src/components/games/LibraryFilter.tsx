"use client";
import { useState } from "react";
import type { GameStatus } from "@/types/game";

type Filter = { value: GameStatus; label: string; count: number };

/**
 * Status filter for the server-rendered rows passed as children. Selecting a
 * filter sets data-filter on the wrapper; CSS in globals.css hides rows whose
 * data-status doesn't match. Only statuses that have games get a button.
 */
export function LibraryFilter({
  total,
  filters,
  children,
}: {
  total: number;
  filters: Filter[];
  children: React.ReactNode;
}) {
  const [filter, setFilter] = useState<"all" | GameStatus>("all");
  const options = [
    { value: "all" as const, label: "All", count: total },
    ...filters,
  ];
  const shown = options.find((option) => option.value === filter)?.count ?? 0;

  return (
    <>
      <div
        role="group"
        aria-label="Filter games by status"
        className="mt-8 flex flex-wrap gap-2"
      >
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            aria-pressed={filter === option.value}
            onClick={() => setFilter(option.value)}
            className="inline-flex min-h-11 items-center gap-3 rounded-control border border-line px-4 text-sm font-semibold text-muted transition-colors duration-100 hover:border-ink hover:text-ink aria-pressed:border-ink aria-pressed:bg-ink aria-pressed:text-paper"
          >
            {option.label}
            <span className="font-mono text-xs">{option.count}</span>
          </button>
        ))}
      </div>
      <p role="status" className="sr-only">
        Showing {shown} {shown === 1 ? "game" : "games"}
      </p>
      <div data-filter={filter} className="mt-8">
        {children}
      </div>
    </>
  );
}
