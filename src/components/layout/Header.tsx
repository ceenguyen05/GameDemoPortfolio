import Link from "next/link";
import { CommandPalette } from "@/components/command-palette/CommandPalette";
import { games } from "@/content/games";
import { buildCommands } from "@/lib/commands";

const navLink =
  "inline-flex min-h-11 items-center px-2 text-sm font-semibold text-muted transition-colors duration-100 hover:text-ink";

export function Header() {
  return (
    <header className="shell">
      <div className="flex items-center gap-2 border-b border-line py-4 sm:gap-4 sm:py-5">
        <Link
          href="/"
          className="mr-auto flex min-h-11 items-baseline gap-3 whitespace-nowrap"
        >
          <span className="text-lg font-extrabold tracking-[-0.04em]">
            Casey Nguyen
          </span>
          <span className="label hidden text-muted sm:inline">Games</span>
        </Link>
        <nav aria-label="Main" className="flex items-center sm:gap-2">
          <Link href="/#library" className={navLink}>
            Library
          </Link>
          <Link href="/about" className={navLink}>
            About
          </Link>
        </nav>
        <CommandPalette commands={buildCommands(games)} />
      </div>
    </header>
  );
}
