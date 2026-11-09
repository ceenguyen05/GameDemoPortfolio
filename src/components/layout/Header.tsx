import Link from "next/link";
import { CommandPalette } from "@/components/command-palette/CommandPalette";
export function Header() {
  return (
    <header className="site-header shell">
      <Link
        href="/"
        className="brand"
        aria-label="Casey Nguyen, Software engineer & game maker — home"
      >
        <span className="brand-mark" aria-hidden="true">
          C<span>↗</span>
        </span>
        <span>
          CASEY NGUYEN<small>Software engineer & game maker</small>
        </span>
      </Link>
      <nav aria-label="Main navigation">
        <Link href="/#library">Library</Link>
        <Link href="/about">About</Link>
      </nav>
      <CommandPalette />
    </header>
  );
}
