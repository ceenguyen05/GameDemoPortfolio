import type { Game } from "@/types/game";
import { Keycap } from "@/components/ui/Keycap";

/** Default bindings as keycaps, so players know the controls before launching. */
export function ControlsList({ game }: { game: Game }) {
  if (!game.controls.length) return null;
  return (
    <section
      id="controls"
      aria-labelledby="controls-title"
      className="defer-render scroll-mt-6"
    >
      <div className="flex items-baseline justify-between gap-4 border-t border-ink pt-3">
        <h2 id="controls-title" className="label">
          Controls
        </h2>
        <p className="label text-muted">Default bindings</p>
      </div>
      <p className="mt-6 max-w-2xl text-lead">
        Learn these before you launch.
        {game.controlsNote && (
          <span className="mt-2 block text-base text-muted">
            {game.controlsNote}
          </span>
        )}
      </p>
      <dl className="mt-8 grid gap-x-10 sm:grid-cols-2">
        {game.controls.map((control) => (
          <div
            key={control.action}
            className="flex min-h-14 items-center justify-between gap-4 border-t border-line py-2"
          >
            <dt className="text-sm">{control.action}</dt>
            <dd className="flex shrink-0 gap-1">
              {control.keys.map((key) => (
                <Keycap key={key}>{key}</Keycap>
              ))}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
