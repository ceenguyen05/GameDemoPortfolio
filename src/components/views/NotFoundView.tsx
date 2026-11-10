import Link from "next/link";
import type { CSSProperties } from "react";
import { games } from "@/content/games";
import { Button } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";

/** Shared 404, including /play/<slug> links that don't match a live game. */
export function NotFoundView() {
  return (
    <section className="grid gap-12 py-12 lg:grid-cols-12 lg:gap-6 lg:py-20">
      <div className="lg:col-span-7">
        <p className="label text-muted">Error 404</p>
        <p
          aria-hidden="true"
          className="mt-2 font-mono text-[clamp(6rem,22vw,15rem)] leading-none tracking-[-0.06em]"
        >
          404
        </p>
        <h1 className="mt-6 text-h2">Nothing at this address.</h1>
        <p className="mt-4 max-w-xl text-lead text-muted">
          The page moved or never existed. If you followed a /play link, that
          game isn’t live yet, or the link has a typo.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button href="/#library">
            Back to the library <span aria-hidden="true">→</span>
          </Button>
          <Button href="/about" variant="text">
            Contact Casey
          </Button>
        </div>
      </div>
      <nav
        aria-labelledby="notfound-games"
        className="lg:col-span-4 lg:col-start-9 lg:self-end"
      >
        <h2 id="notfound-games" className="label border-b border-ink pb-3">
          In the library
        </h2>
        <ul>
          {games.map((game) => (
            <li
              key={game.slug}
              style={{ "--game": game.accentColor } as CSSProperties}
              className="border-b border-line"
            >
              <Link
                href={`/games/${game.slug}`}
                className="flex min-h-14 items-center gap-3 py-2 hover:underline hover:underline-offset-4"
              >
                <span
                  aria-hidden="true"
                  className="size-2.5 shrink-0 bg-game"
                />
                <span className="flex-1 font-semibold">{game.title}</span>
                <Tag status={game.status} />
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
}
