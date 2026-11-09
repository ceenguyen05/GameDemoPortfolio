import type { Game } from "@/types/game";
import { Keycap } from "@/components/ui/Keycap";
export function ControlsList({ game }: { game: Game }) {
  return (
    <section
      id="controls"
      className="controls-section"
      aria-labelledby="controls-title"
    >
      <div className="section-heading">
        <div>
          <p className="eyebrow accent-text">Before you play</p>
          <h2 id="controls-title">Get to know the controls.</h2>
        </div>
        <span className="eyebrow">Default bindings</span>
      </div>
      {game.controls.length ? (
        <>
          <p className="section-intro">
            Keyboard and mouse required. Click inside the game to capture your
            mouse; Escape releases it. Rebind keys in Settings → Controls.
          </p>
          <dl className="controls-grid">
            {game.controls.map((control) => (
              <div key={control.action}>
                <dt>{control.action}</dt>
                <dd>
                  {control.keys.map((key) => (
                    <Keycap key={key}>{key}</Keycap>
                  ))}
                </dd>
              </div>
            ))}
          </dl>
        </>
      ) : (
        <p className="section-intro">
          Controls will be published when this project is revealed.
        </p>
      )}
    </section>
  );
}
