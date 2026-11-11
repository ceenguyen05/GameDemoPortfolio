import { SiteLink as Link } from "@/components/ui/SiteLink";
import { CommandPalette } from "@/components/command-palette/CommandPalette";
import { games } from "@/content/games";
import { buildCommands } from "@/lib/commands";
import { siteConfig } from "@/lib/siteConfig";

export function Header() {
  return (
    <header className="shell site-header">
      <div className="header-inner">
        <Link
          prefetch={false}
          href="/"
          className="wordmark"
          aria-label={`${siteConfig.name} home`}
        >
          <span className="brand-symbol" aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
          </span>
          {siteConfig.name}
          <span className="brand-period">.</span>
        </Link>
        <nav aria-label="Main" className="main-nav">
          <Link prefetch={false} href="/#library">
            The games
          </Link>
          <Link prefetch={false} href="/about">
            The idea
          </Link>
        </nav>
        <CommandPalette commands={buildCommands(games)} />
      </div>
    </header>
  );
}
