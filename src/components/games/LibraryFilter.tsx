"use client";
import { useSavedGames } from "@/hooks/useSavedGames";
import { Bookmark } from "@/components/ui/Bookmark";

import { useEffect, useRef, useState } from "react";
import type { GameStatus } from "@/types/game";

type Filter = { value: GameStatus; label: string; count: number };

/**
 * Status filter for the server-rendered tiles passed as children. Selecting a
 * filter sets data-filter on the wrapper; CSS in library.css hides tiles whose
 * data-status doesn't match. Only statuses that have games get a button.
 */
export function LibraryFilter({
  total,
  slugs,
  filters,
  children,
}: {
  total: number;
  slugs: string[];
  filters: Filter[];
  children: React.ReactNode;
}) {
  const [filter, setFilter] = useState<"all" | "saved" | GameStatus>("all");
  const list = useRef<HTMLDivElement>(null);
  const savedFilter = useRef<HTMLButtonElement>(null);
  const { saved, sessionOnly } = useSavedGames();
  const savedCount = slugs.filter((slug) => saved.includes(slug)).length;
  useEffect(() => {
    const focused = document.activeElement?.closest<HTMLElement>("[data-slug]");
    for (const tile of list.current?.querySelectorAll<HTMLElement>(
      "[data-slug]",
    ) ?? [])
      tile.dataset.saved = String(saved.includes(tile.dataset.slug ?? ""));
    if (
      filter === "saved" &&
      focused &&
      !saved.includes(focused.dataset.slug ?? "")
    )
      savedFilter.current?.focus();
  }, [saved, filter]);
  const options = [
    { value: "all" as const, label: "All", count: total },
    ...filters,
    { value: "saved" as const, label: "Saved", count: savedCount },
  ];
  const shown = options.find((option) => option.value === filter)?.count ?? 0;

  // After the filter changes, the tiles that remain settle in one by one.
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const visible = [
      ...(list.current?.querySelectorAll<HTMLElement>("[data-status]") ?? []),
    ].filter((tile) => tile.offsetParent !== null);
    visible.forEach((tile, index) =>
      tile.animate(
        [
          { opacity: 0, transform: "translateY(10px)" },
          { opacity: 1, transform: "none" },
        ],
        {
          duration: 260,
          delay: index * 40,
          // Same curve as --ease-out in tokens.css; script animations can't read it.
          easing: "cubic-bezier(0.2, 0.8, 0.2, 1)",
          fill: "backwards",
        },
      ),
    );
  }, [filter]);

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
            ref={option.value === "saved" ? savedFilter : undefined}
            type="button"
            aria-pressed={filter === option.value}
            onClick={() => setFilter(option.value)}
            className="inline-flex min-h-11 items-center gap-3 rounded-control border border-line px-4 text-sm font-semibold text-muted transition-colors duration-100 hover:border-ink hover:text-ink aria-pressed:border-ink aria-pressed:bg-ink aria-pressed:text-paper"
          >
            {option.value === "saved" && <Bookmark />}
            {option.label}
            <span className="font-mono text-xs">{option.count}</span>
          </button>
        ))}
      </div>
      <p role="status" className="library-count">
        Showing {shown} {shown === 1 ? "game" : "games"}
      </p>
      <div ref={list} data-filter={filter} className="mt-8">
        {children}
        {filter === "saved" && shown === 0 && (
          <div className="saved-empty">
            <Bookmark />
            <h3>Your next favorites belong here.</h3>
            <p>Tap a bookmark on any game to keep it close.</p>
            <button
              type="button"
              className="browse-button"
              onClick={() => setFilter("all")}
            >
              Explore all games
            </button>
          </div>
        )}
        {filter === "saved" && shown > 0 && (
          <p className="saved-note">
            {sessionOnly
              ? "Saved for this visit."
              : "Your picks stay on this device."}
          </p>
        )}
      </div>
    </>
  );
}
