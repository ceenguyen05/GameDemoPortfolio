import Link from "next/link";
import { SoundToggle } from "@/components/layout/SoundToggle";
import { siteConfig } from "@/lib/siteConfig";
export function Footer() {
  return (
    <footer className="site-footer shell">
      <div className="footer-top">
        <Link href="/" className="footer-name">
          CASEY NGUYEN<span>Games made for the browser.</span>
        </Link>
        <div className="footer-links">
          <a href={siteConfig.github}>GitHub ↗</a>
          <Link href="/about">About / Contact ↗</Link>
        </div>
      </div>
      <div className="footer-bottom">
        <span>Independent work. Open to play.</span>
        <SoundToggle />
        <span>© {new Date().getFullYear()} Casey Nguyen</span>
      </div>
    </footer>
  );
}
