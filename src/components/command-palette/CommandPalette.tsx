"use client";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Dialog } from "@/components/ui/Dialog";
import { Keycap } from "@/components/ui/Keycap";
import { useIsMac } from "@/hooks/useIsMac";
import { CommandLink } from "@/components/command-palette/CommandLink";
import type { Command } from "@/types/command";

// Motion loads only when the palette first opens.
const CommandPanel = dynamic(
  () =>
    import("@/components/command-palette/CommandPanel").then(
      (module) => module.CommandPanel,
    ),
  { ssr: false },
);

const groups: { kind: Command["kind"]; title: string }[] = [
  { kind: "launch", title: "Play" },
  { kind: "game", title: "Games" },
  { kind: "page", title: "Pages" },
];

/**
 * ⌘K / Ctrl+K palette. Results are ordinary links: launch results are real
 * anchors to the live game (new tab), the rest are Next links. Arrow keys move
 * the highlight, Enter follows it, Tab walks the links, Esc closes.
 */
export function CommandPalette({ commands }: { commands: Command[] }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const list = useRef<HTMLDivElement>(null);
  const isMac = useIsMac();

  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  const matches = commands.filter((command) => {
    const text = `${command.label} ${command.detail}`.toLowerCase();
    return terms.every((term) => text.includes(term));
  });
  // Grouped render order is also the order the arrow keys walk.
  const ordered = groups.flatMap(({ kind }) =>
    matches.filter((command) => command.kind === kind),
  );
  const current = ordered[active];

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== "k")
        return;
      event.preventDefault();
      // The updater form reads the latest state. Reading `open` from this
      // closure went stale for a moment after Esc, so a quick Ctrl+K was lost.
      setQuery("");
      setActive(0);
      setOpen((wasOpen) => !wasOpen);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const links = () =>
    list.current?.querySelectorAll<HTMLAnchorElement>("a[data-command]") ?? [];

  const move = (delta: number, focusLink: boolean) => {
    if (!ordered.length) return;
    const next = (active + delta + ordered.length) % ordered.length;
    setActive(next);
    const link = links()[next];
    link?.scrollIntoView({ block: "nearest" });
    if (focusLink) link?.focus();
  };

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setQuery("");
          setActive(0);
          setOpen(true);
        }}
        aria-keyshortcuts="Control+K Meta+K"
        className="inline-flex min-h-11 items-center gap-2 px-2 text-sm font-semibold text-muted transition-colors duration-100 hover:text-ink sm:px-0"
      >
        Search
        {/* The shortcut hint is for keyboards; phones just get the word. */}
        <span className="hidden sm:inline-flex">
          <Keycap>{isMac ? "⌘ K" : "Ctrl K"}</Keycap>
        </span>
      </button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        labelId="command-title"
      >
        {open && (
          <CommandPanel>
            <div className="flex items-center justify-between gap-4 border-b border-line px-4 py-1 sm:px-6">
              <h2 id="command-title" className="label text-muted">
                Jump to a game or page
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold"
              >
                Close <Keycap>Esc</Keycap>
              </button>
            </div>
            <label htmlFor="command-search" className="sr-only">
              Search games and pages
            </label>
            <input
              id="command-search"
              data-initial-focus
              autoFocus
              autoComplete="off"
              spellCheck={false}
              value={query}
              placeholder="Type a game or page…"
              aria-describedby="command-help"
              onChange={(event) => {
                setQuery(event.target.value);
                setActive(0);
              }}
              onKeyDown={(event) => {
                if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                  event.preventDefault();
                  move(event.key === "ArrowDown" ? 1 : -1, false);
                }
                if (event.key === "Enter" && current) {
                  event.preventDefault();
                  links()[active]?.click();
                }
              }}
              className="block w-full border-b border-line bg-paper px-4 py-5 text-lg placeholder:text-muted focus-visible:outline-offset-[-2px] sm:px-6"
            />
            <div
              ref={list}
              className="max-h-[50dvh] overflow-auto p-2"
              onKeyDown={(event) => {
                if (event.key !== "ArrowDown" && event.key !== "ArrowUp")
                  return;
                event.preventDefault();
                move(event.key === "ArrowDown" ? 1 : -1, true);
              }}
            >
              {groups.map(({ kind, title }) => {
                const items = ordered.filter((c) => c.kind === kind);
                if (!items.length) return null;
                return (
                  <section key={kind} aria-label={title}>
                    <p
                      aria-hidden="true"
                      className="label px-3 pt-3 pb-1 text-muted"
                    >
                      {title}
                    </p>
                    <ul>
                      {items.map((command) => (
                        <li key={command.id}>
                          <CommandLink
                            command={command}
                            selected={command === current}
                            onFocus={() => setActive(ordered.indexOf(command))}
                            onPick={() => setOpen(false)}
                          />
                        </li>
                      ))}
                    </ul>
                  </section>
                );
              })}
              {ordered.length === 0 && (
                <p className="px-3 py-6 text-sm text-muted">
                  No matches. Try a game title, “play”, or “about”.
                </p>
              )}
            </div>
            <p
              id="command-help"
              className="flex flex-wrap gap-x-5 gap-y-1 border-t border-line px-4 py-3 font-mono text-xs text-muted sm:px-6"
            >
              <span>↑ ↓ to move</span>
              <span>Enter to open</span>
              <span>Esc to close</span>
            </p>
            <p className="sr-only" aria-live="polite">
              {ordered.length
                ? `${ordered.length} results. Highlighted: ${current?.label}.`
                : "No results."}
            </p>
          </CommandPanel>
        )}
      </Dialog>
    </>
  );
}
