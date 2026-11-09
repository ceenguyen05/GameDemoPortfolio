"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
const CommandPanel = dynamic(
  () =>
    import("@/components/command-palette/CommandPanel").then(
      (module) => module.CommandPanel,
    ),
  { ssr: false },
);
import { Dialog } from "@/components/ui/Dialog";
import { Keycap } from "@/components/ui/Keycap";
import { games } from "@/content/games";
export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const list = useRef<HTMLDivElement>(null);
  const focusSearch = useCallback((element: HTMLInputElement | null) => {
    element?.focus();
  }, []);
  const commands = useMemo(
    () => [
      {
        label: "Game library",
        detail: "Navigation",
        href: "/#library",
        launch: false,
      },
      {
        label: "About Casey",
        detail: "Navigation",
        href: "/about",
        launch: false,
      },
      ...games.flatMap((game) => [
        {
          label: game.title,
          detail: "Game details",
          href: `/games/${game.slug}`,
          launch: false,
        },
        ...(game.status === "live"
          ? [
              {
                label: `Play ${game.title}`,
                detail: new URL(game.playUrl).hostname,
                href: game.playUrl,
                launch: true,
              },
            ]
          : []),
      ]),
    ],
    [],
  );
  const filtered = commands.filter((command) =>
    `${command.label} ${command.detail}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((current) => !current);
        setQuery("");
        setActive(0);
      }
    };
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, []);
  return (
    <>
      <button
        className="command-trigger"
        type="button"
        onClick={() => {
          setOpen(true);
          setQuery("");
          setActive(0);
        }}
        aria-label="Quick search (⌘ K or Ctrl K): open command palette"
      >
        <span className="command-word">Quick search</span>
        <Keycap>⌘ K</Keycap>
      </button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        labelId="command-title"
      >
        {open && (
          <CommandPanel>
            <div className="dialog-top">
              <h2 id="command-title" className="eyebrow">
                Command / Quick search
              </h2>
              <button
                type="button"
                className="text-button"
                onClick={() => setOpen(false)}
                aria-label="Close command palette"
              >
                Esc ×
              </button>
            </div>
            <label htmlFor="command-search" className="sr-only">
              Search games and pages
            </label>
            <input
              ref={focusSearch}
              data-initial-focus
              autoFocus
              id="command-search"
              className="command-input"
              value={query}
              placeholder="Find a game or a page."
              onChange={(event) => {
                setQuery(event.target.value);
                setActive(0);
              }}
              onKeyDown={(event) => {
                if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                  event.preventDefault();
                  const next =
                    event.key === "ArrowDown" ? active + 1 : active - 1;
                  const index =
                    (next + filtered.length) % Math.max(filtered.length, 1);
                  setActive(index);
                  list.current
                    ?.querySelectorAll("a")
                    [index]?.scrollIntoView({ block: "nearest" });
                }
                if (event.key === "Enter") {
                  event.preventDefault();
                  list.current?.querySelectorAll("a")[active]?.click();
                }
              }}
              aria-describedby="command-help"
            />
            <div
              ref={list}
              className="command-results"
              onKeyDown={(event) => {
                if (event.key !== "ArrowDown" && event.key !== "ArrowUp")
                  return;
                event.preventDefault();
                const next =
                  (active +
                    (event.key === "ArrowDown" ? 1 : -1) +
                    filtered.length) %
                  Math.max(filtered.length, 1);
                setActive(next);
                list.current?.querySelectorAll("a")[next]?.focus();
              }}
            >
              {filtered.map((command, index) =>
                command.launch ? (
                  <a
                    key={command.href}
                    href={command.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`command-result ${index === active ? "selected" : ""}`}
                    onFocus={() => setActive(index)}
                    onClick={() => setOpen(false)}
                  >
                    <span>
                      {command.label}
                      <small>{command.detail}</small>
                    </span>
                    <span aria-hidden="true">↗</span>
                  </a>
                ) : (
                  <Link
                    key={command.href}
                    href={command.href}
                    className={`command-result ${index === active ? "selected" : ""}`}
                    onFocus={() => setActive(index)}
                    onClick={() => setOpen(false)}
                  >
                    <span>
                      {command.label}
                      <small>{command.detail}</small>
                    </span>
                    <span aria-hidden="true">↗</span>
                  </Link>
                ),
              )}
              {filtered.length === 0 && (
                <p className="empty-state" role="status">
                  No matches. Try “ACI” or “library”.
                </p>
              )}
            </div>
            <p id="command-help" className="command-help">
              ↑ ↓ Select <span>Enter Open</span>
              <span>Esc Close</span>
            </p>
            <span className="sr-only" aria-live="polite">
              {filtered.length} results. {filtered[active]?.label}
            </span>
          </CommandPanel>
        )}
      </Dialog>
    </>
  );
}
