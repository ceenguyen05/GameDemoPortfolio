import { SiteLink as Link } from "@/components/ui/SiteLink";
import type { CSSProperties } from "react";
import type { Game } from "@/types/game";
import { GameHero } from "@/components/games/GameHero";
import { GameFacts } from "@/components/games/GameFacts";
import { Gallery } from "@/components/games/Gallery";
import { ControlsList } from "@/components/games/ControlsList";
import { Changelog } from "@/components/games/Changelog";
import { DeveloperCard } from "@/components/games/DeveloperCard";
import { ShareGame } from "@/components/games/ShareGame";
import { PlayButton } from "@/components/games/PlayButton";
import { Button } from "@/components/ui/Button";
import { statusLabels } from "@/lib/gameStatus";

export function GameDetails({ game }: { game: Game }) {
  const live = game.status === "live";
  return (
    <div style={{ "--game": game.accentColor } as CSSProperties}>
      <nav
        aria-label="Breadcrumb"
        className="flex items-center justify-between gap-4 py-4"
      >
        <Link
          href="/#library"
          className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-muted hover:text-ink"
        >
          <span aria-hidden="true">←</span> Library
        </Link>
        <span className="font-mono text-xs break-all text-muted">
          games/{game.slug}
        </span>
      </nav>

      <GameHero game={game} />

      <div className="grid gap-16 pt-section lg:grid-cols-12 lg:gap-6">
        <aside aria-label="Fact sheet" className="lg:col-span-4 xl:col-span-3">
          <div className="lg:sticky lg:top-6">
            <GameFacts game={game} />
          </div>
        </aside>
        <div className="space-y-section lg:col-span-8 lg:col-start-5">
          <section aria-labelledby="overview-title">
            <h2
              id="overview-title"
              className="label border-t border-line-strong pt-3"
            >
              Overview
            </h2>
            <p className="mt-6 max-w-3xl text-lead">{game.description.long}</p>
          </section>
          <Gallery images={game.screenshots} />
          <DeveloperCard developer={game.developer} />
          <ShareGame title={game.title} path={`/games/${game.slug}`} />
          <ControlsList game={game} />
          <Changelog entries={game.changelog ?? []} />
        </div>
      </div>

      <section
        aria-labelledby="launch-title"
        data-reveal=""
        className="launch-band defer-render mt-section grid gap-8 p-6 sm:p-10 lg:grid-cols-12 lg:items-center"
      >
        <div className="lg:col-span-7">
          <p className="label text-muted">
            {live ? "Ready when you are" : statusLabels[game.status]}
          </p>
          <h2 id="launch-title" className="mt-3 text-h2">
            {live ? `Play ${game.title}.` : "Not playable yet."}
          </h2>
          <p className="mt-3 text-muted">
            {live
              ? "It opens in a new tab, so this page stays right here."
              : "It gets a Play button here the day it goes live."}
          </p>
        </div>
        <div className="lg:col-span-5 lg:justify-self-end">
          {live ? (
            <PlayButton game={game} />
          ) : (
            <Button href="/#library">
              Back to the library <span aria-hidden="true">→</span>
            </Button>
          )}
        </div>
      </section>
    </div>
  );
}
