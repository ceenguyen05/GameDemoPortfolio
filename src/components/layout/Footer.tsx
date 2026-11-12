import { SiteLink as Link } from "@/components/ui/SiteLink";
import { SoundToggle } from "@/components/layout/SoundToggle";
import { Arrow } from "@/components/ui/Arrow";
import { Spark } from "@/components/ui/Spark";
import { siteConfig } from "@/lib/siteConfig";

export function Footer() {
  return (
    <footer className="shell site-footer">
      <div className="footer-main">
        <div>
          <Link prefetch={false} href="/" className="wordmark">
            {siteConfig.name}
            <span className="brand-period">.</span>
          </Link>
          <p>Small games. Good company.</p>
        </div>
        <div className="footer-nav">
          <Link prefetch={false} href="/#library">
            Find a game <Arrow />
          </Link>
          <Link prefetch={false} href="/about">
            About the collection <Arrow />
          </Link>
          <Link prefetch={false} href="/makers">
            Meet the makers <Arrow />
          </Link>
        </div>
        <span className="footer-flower" aria-hidden="true">
          <Spark />
        </span>
      </div>
      <div className="footer-baseline">
        <span>Made to be played. Better when shared.</span>
        <SoundToggle />
        <span>
          © {new Date().getFullYear()} {siteConfig.name}
        </span>
      </div>
    </footer>
  );
}
