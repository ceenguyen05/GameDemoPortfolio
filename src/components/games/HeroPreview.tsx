"use client";
import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { GameImage } from "@/types/game";
import { catalogNumber } from "@/lib/format";

const SIZES = "(min-width: 1440px) 800px, (min-width: 1024px) 55vw, 100vw";
const PREVIEW_INTERVAL = 5_000;
const motionQuery = "(prefers-reduced-motion: reduce)";
const subscribeMotion = (notify: () => void) => {
  const media = window.matchMedia(motionQuery);
  media.addEventListener("change", notify);
  return () => media.removeEventListener("change", notify);
};
const subscribeVisibility = (notify: () => void) => {
  document.addEventListener("visibilitychange", notify);
  return () => document.removeEventListener("visibilitychange", notify);
};
const getReducedMotion = () => window.matchMedia(motionQuery).matches;
const getVisible = () => document.visibilityState === "visible";
// Start static on the server and before hydration (also the no-JS experience).
const serverReducedMotion = () => true;
const serverVisible = () => false;

/**
 * The large image in a game's feature panel, with numbered buttons to switch
 * between the cover and screenshots. Auto-advances every five seconds after an
 * image loads. Hover, keyboard focus, explicit pause, reduced motion, and hidden
 * tabs stop the timer. Offscreen previews keep cycling while the visitor scrolls.
 */
export function HeroPreview({
  images,
  priority = true,
}: {
  images: GameImage[];
  priority?: boolean;
}) {
  const [selected, setSelected] = useState(0);
  const [ready, setReady] = useState<string | null>(null);
  const lastLoaded = useRef(0);
  const swipe = useRef<{ x: number; y: number; id: number } | null>(null);
  const [previous, setPrevious] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [keyboardFocused, setKeyboardFocused] = useState(false);
  const [touching, setTouching] = useState(false);
  const reducedMotion = useSyncExternalStore(
    subscribeMotion,
    getReducedMotion,
    serverReducedMotion,
  );
  const visible = useSyncExternalStore(
    subscribeVisibility,
    getVisible,
    serverVisible,
  );
  const active = images[selected];
  const below = previous === null ? null : images[previous];
  const isFirstPaint = priority && selected === 0 && previous === null;

  useEffect(() => {
    if (
      images.length < 2 ||
      reducedMotion ||
      !visible ||
      paused ||
      hovered ||
      keyboardFocused ||
      touching ||
      ready !== active.src
    )
      return;
    const timer = window.setTimeout(() => {
      setPrevious(lastLoaded.current);
      setSelected((index) => (index + 1) % images.length);
    }, PREVIEW_INTERVAL);
    return () => window.clearTimeout(timer);
  }, [
    images.length,
    reducedMotion,
    visible,
    paused,
    hovered,
    keyboardFocused,
    touching,
    ready,
    active.src,
    selected,
  ]);

  const choose = (next: number) => {
    if (next === selected) return;
    setPrevious(lastLoaded.current);
    setSelected(next);
  };

  return (
    <figure
      className="hero-preview"
      aria-label="Game previews"
      onPointerEnter={(event) => {
        if (event.pointerType !== "touch") setHovered(true);
      }}
      onPointerLeave={(event) => {
        if (event.pointerType !== "touch") setHovered(false);
      }}
      onPointerDownCapture={() => setKeyboardFocused(false)}
      onFocusCapture={(event) => {
        if (event.target.matches(":focus-visible")) setKeyboardFocused(true);
      }}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setKeyboardFocused(false);
      }}
    >
      <div
        className="preview-image"
        aria-busy={below !== null && ready !== active.src}
        onPointerDown={(event) => {
          if (
            event.pointerType !== "touch" ||
            !event.isPrimary ||
            images.length < 2 ||
            (event.target as Element).closest("button")
          )
            return;
          swipe.current = {
            x: event.clientX,
            y: event.clientY,
            id: event.pointerId,
          };
          setTouching(true);
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerUp={(event) => {
          const start = swipe.current;
          swipe.current = null;
          setTouching(false);
          if (!start || start.id !== event.pointerId) return;
          const dx = event.clientX - start.x,
            dy = event.clientY - start.y;
          if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.4)
            choose(
              (selected + (dx < 0 ? 1 : -1) + images.length) % images.length,
            );
        }}
        onPointerCancel={() => {
          swipe.current = null;
          setTouching(false);
        }}
      >
        {below && (
          <Image
            key={`below-${below.src}`}
            src={below.src}
            alt=""
            fill
            quality={60}
            sizes={SIZES}
            className="object-cover"
          />
        )}
        <Image
          key={active.src}
          src={active.src}
          alt={active.alt}
          fill
          preload={isFirstPaint}
          loading={previous !== null ? "eager" : undefined}
          fetchPriority={isFirstPaint ? "high" : "auto"}
          quality={60}
          sizes={SIZES}
          onLoad={() => {
            lastLoaded.current = selected;
            setReady(active.src);
          }}
          className={`preview-current object-cover ${below ? (ready === active.src ? "preview-enter" : "preview-loading") : ""}`}
        />
        {images.length > 1 && (
          <button
            type="button"
            className="preview-playback"
            aria-label={
              reducedMotion
                ? "Slideshow is manual with reduced motion enabled"
                : paused
                  ? "Play slideshow"
                  : "Pause slideshow"
            }
            aria-disabled={reducedMotion || undefined}
            onClick={() => {
              if (reducedMotion) return;
              setPaused(!paused);
              if (paused) setKeyboardFocused(false);
            }}
          >
            <svg viewBox="0 0 16 16" aria-hidden="true">
              {paused && !reducedMotion ? (
                <path d="m5 3 7 5-7 5Z" />
              ) : (
                <path d="M4 3h3v10H4zm5 0h3v10H9z" />
              )}
            </svg>
            {reducedMotion ? "Manual" : paused ? "Play" : "Pause"}
          </button>
        )}
        {images.length > 1 && (
          <div className="preview-navigation">
            <button
              type="button"
              aria-label="Previous preview"
              onClick={() =>
                choose((selected - 1 + images.length) % images.length)
              }
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="m14 6-6 6 6 6" />
              </svg>
            </button>
            <button
              type="button"
              aria-label="Next preview"
              onClick={() => choose((selected + 1) % images.length)}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="m10 6 6 6-6 6" />
              </svg>
            </button>
          </div>
        )}
        <span className="preview-counter" aria-hidden="true">
          {catalogNumber(selected + 1)} / {catalogNumber(images.length)}
        </span>
      </div>
      {images.length > 1 && (
        <div className="preview-progress" aria-hidden="true">
          {images.map((img, index) => (
            <span key={img.src} data-active={selected === index} />
          ))}
        </div>
      )}
      <div className="preview-bar">
        <figcaption
          aria-live={
            paused || reducedMotion || keyboardFocused ? "polite" : "off"
          }
        >
          {active.caption}
        </figcaption>
        {images.length > 1 && (
          <div
            className="preview-options"
            role="group"
            aria-label="Choose a preview"
            onKeyDown={(event) => {
              if (event.key !== "ArrowLeft" && event.key !== "ArrowRight")
                return;
              event.preventDefault();
              const step = event.key === "ArrowRight" ? 1 : -1;
              const buttons = [
                ...event.currentTarget.querySelectorAll<HTMLButtonElement>(
                  "button",
                ),
              ];
              // Step from the focused button; it may not be the selected one.
              const focused = buttons.indexOf(
                event.target as HTMLButtonElement,
              );
              const from = focused === -1 ? selected : focused;
              const next = (from + step + images.length) % images.length;
              choose(next);
              buttons[next]?.focus();
            }}
          >
            {images.map((item, index) => {
              const number = catalogNumber(index + 1);
              return (
                <button
                  key={item.src}
                  type="button"
                  // Starts with the visible number so voice control can target it.
                  aria-label={`${number}: preview ${item.caption}`}
                  aria-pressed={selected === index}
                  onClick={() => choose(index)}
                >
                  {number}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </figure>
  );
}
