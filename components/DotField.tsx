"use client";

import { useEffect, useRef } from "react";
import { paintDots, readPalette, type DotLook } from "@/lib/dots";

/** The moment a still field is drawn at: the pose of the drift and pulse it is held in. */
const STILL_AT = 2.4;

/** The hero's copy, as a centre and half size in the canvas's own pixels. */
type Copy = { x: number; y: number; halfW: number; halfH: number };

function look(still: boolean, width: number, height: number, t: number, copy: Copy | null): DotLook {
  if (still) {
    // The quiz: quiet, and only in the margins either side of the column (on a phone, in the empty bands top and bottom)
    return {
      t,
      drift: 1,
      pulse: 1,
      size: 0.6,
      alpha: 0.5,
      clear:
        width < 700
          ? { x: width / 2 - 14, y: height * 0.32, feather: 90 }
          : { x: Math.min(width / 2 - 24, 320), y: height, feather: 200 },
    };
  }
  // The hero: the copy and a margin around it stay clear, and the dots fill whatever room is left
  const middle = copy ?? { x: width / 2, y: height / 2, halfW: Math.min(width / 2 - 80, 290), halfH: height / 2 - 70 };
  const x = Math.min(middle.halfW + 56, width / 2 - 12);
  return {
    t,
    drift: 1,
    pulse: 1,
    size: 1,
    alpha: 1,
    clear: { x, y: middle.halfH + 8, cx: middle.x, cy: middle.y, feather: Math.max(60, Math.min(220, width / 2 - x)) },
  };
}

/**
 * The dotted field, drawn on a canvas that fills its parent. In the hero it drifts and pulses, keeps clear
 * of the hero's copy (`.hero-copy`), and holds still when the hero's pause button says so, when the hero is
 * off screen, and for visitors who prefer reduced motion. With `still` (the quiz) it is drawn once and never
 * moves. It is decoration only.
 */
export function DotField({ still = false }: { still?: boolean }) {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = canvas.current;
    const ctx = el?.getContext("2d");
    if (!el || !ctx) return;

    // The hero's pause button and off-screen watcher (MotionToggle) mark this element
    const host = el.closest<HTMLElement>("[data-motion]");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const palette = readPalette();
    let width = 0;
    let height = 0;
    let copy: Copy | null = null;
    let clock = still ? STILL_AT : 0;
    let frame = 0;

    const draw = () => paintDots(ctx, width, height, palette, look(still, width, height, clock, copy));

    const fit = () => {
      const box = el.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = box.width;
      height = box.height;
      el.width = Math.round(width * dpr);
      el.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const text = still ? null : host?.querySelector<HTMLElement>(".hero-copy")?.getBoundingClientRect();
      copy = text
        ? { x: text.left + text.width / 2 - box.left, y: text.top + text.height / 2 - box.top, halfW: text.width / 2, halfH: text.height / 2 }
        : null;
      draw();
    };

    // About 30 frames a second is plenty for a slow field, and kinder to a phone's battery
    let last = 0;
    const tick = (now: number) => {
      frame = requestAnimationFrame(tick);
      const elapsed = now - last;
      if (elapsed < 32) return;
      last = now;
      if (host && (host.dataset.motion === "paused" || host.hasAttribute("data-offscreen"))) return;
      clock += Math.min(elapsed, 100) / 1000;
      draw();
    };

    const sync = () => {
      cancelAnimationFrame(frame);
      if (!still && !reduced.matches) {
        last = performance.now();
        frame = requestAnimationFrame(tick);
      }
    };

    const observer = new ResizeObserver(fit);
    observer.observe(el);
    reduced.addEventListener("change", sync);
    sync();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      reduced.removeEventListener("change", sync);
    };
  }, [still]);

  return <canvas ref={canvas} className="dots" aria-hidden="true" />;
}
