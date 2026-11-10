import Link from "next/link";
import { SoundToggle } from "@/components/layout/SoundToggle";
import { siteConfig } from "@/lib/siteConfig";

const footerLink =
  "inline-flex min-h-11 items-center text-sm font-semibold hover:underline hover:underline-offset-4";

export function Footer() {
  return (
    <footer className="shell mt-section">
      <div className="grid gap-6 border-t border-line py-8 sm:grid-cols-2 sm:items-start">
        <div>
          <Link href="/" className="font-extrabold tracking-[-0.03em]">
            Casey Nguyen
          </Link>
          <p className="mt-1 text-sm text-muted">
            Games built for the browser. Independent work, open to play.
          </p>
        </div>
        <ul className="flex flex-wrap gap-x-6 sm:justify-end">
          <li>
            <a href={siteConfig.github} className={footerLink}>
              GitHub <span aria-hidden="true">↗</span>
            </a>
          </li>
          <li>
            <a href={`mailto:${siteConfig.email}`} className={footerLink}>
              Email
            </a>
          </li>
          <li>
            <Link href="/about" className={footerLink}>
              About
            </Link>
          </li>
        </ul>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-line py-4">
        <SoundToggle />
        <p className="label text-muted">
          © {new Date().getFullYear()} Casey Nguyen
        </p>
      </div>
    </footer>
  );
}
