"use client";

import { useEffect, useRef } from "react";
import { makeGrid, paintDots, readPalette, RIPPLE_LIFE, type Clear, type DotGrid } from "@/lib/dots";

/** The moment a still field is drawn at: where the arms are held. */
const STILL_AT = 2.4;
/** Seconds the entrance takes to sweep all the way round. */
const ENTRANCE = 1.7;
/** The ghost that stands in for a pointer: how fast it circles (radians a second), and how strongly it is felt. */
const GHOST_SPEED = 0.55;
const GHOST_STRENGTH = 0.75;

/** The hero's copy, as a centre and half size in the canvas's own pixels. */
type Copy = { x: number; y: number; halfW: number; halfH: number };

function clearZone(still: boolean, width: number, height: number, copy: Copy | null): Clear {
  // The quiz: only in the margins either side of the column (on a phone, in the empty bands top and bottom)
  if (still) {
    return width < 700
      ? { x: width / 2 - 14, y: height * 0.32, feather: 90 }
      : { x: Math.min(width / 2 - 24, 320), y: height, feather: 200 };
  }
  // The hero: the copy and a margin around it stay clear, and the dots fill whatever room is left
  const middle = copy ?? { x: width / 2, y: height / 2, halfW: Math.min(width / 2 - 80, 290), halfH: height / 2 - 70 };
  const x = Math.min(middle.halfW + 56, width / 2 - 12);
  return { x, y: middle.halfH + 8, cx: middle.x, cy: middle.y, feather: Math.max(60, Math.min(220, width / 2 - x)) };
}

/**
 * The dotted field, drawn on a canvas that fills its parent, and kept clear of the hero's copy
 * (`.hero-copy`). In the hero the arms turn, the dots swell and part around the mouse (with no mouse, a
 * ghost circles the copy in its place), a click or tap sends a ripple, and the dots sweep in on arrival.
 * All of it holds still when the hero's pause button says so and while the hero is off screen, and for
 * visitors who prefer reduced motion it is one still frame that does not react. With `still` (the quiz) it
 * is drawn once and never moves. It is decoration only.
 */
export function DotField({ still = false }: { still?: boolean }) {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = canvas.current;
    const ctx = el?.getContext("2d");
    if (!el || !ctx) return;

    // The hero's pause button and off-screen watcher (MotionToggle) mark this element; it also hears the pointer
    const host = still ? null : el.closest<HTMLElement>("[data-motion]");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const palette = readPalette();
    const look = still ? { size: 0.6, alpha: 0.5 } : { size: 1, alpha: 1 };
    let grid: DotGrid | null = null;
    let clock = still ? STILL_AT : 0;
    let frame = 0;
    let last = 0;
    // The mouse, while it is over the hero; where the dots feel it (it follows with a little lag); and the
    // ripples sent out by clicks and taps
    let pointer: { x: number; y: number } | null = null;
    const felt = { x: 0, y: 0, strength: 0 };
    let ripples: { x: number; y: number; born: number }[] = [];

    const moving = () => !still && !reduced.matches;
    const held = () => !!host && (host.dataset.motion === "paused" || host.hasAttribute("data-offscreen"));

    const draw = () => {
      if (!grid) return;
      const live = moving();
      const entrance = Math.min(1, clock / ENTRANCE);
      paintDots(ctx, grid, palette, {
        t: clock,
        ...look,
        reveal: live ? 1 - (1 - entrance) ** 3 : 1,
        pointer: live ? felt : null,
        ripples: live ? ripples : [],
      });
    };

    const fit = () => {
      const box = el.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      el.width = Math.round(box.width * dpr);
      el.height = Math.round(box.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const text = host?.querySelector<HTMLElement>(".hero-copy")?.getBoundingClientRect();
      const copy = text
        ? { x: text.left + text.width / 2 - box.left, y: text.top + text.height / 2 - box.top, halfW: text.width / 2, halfH: text.height / 2 }
        : null;
      grid = makeGrid(box.width, box.height, clearZone(still, box.width, box.height, copy));
      draw();
    };

    const tick = (now: number) => {
      frame = requestAnimationFrame(tick);
      const dt = Math.min(now - last, 100) / 1000;
      last = now;
      if (!grid || held()) return;
      clock += dt;
      // The dots follow the mouse, or with none, a ghost that circles the copy, starting at the right
      const target = pointer ?? {
        x: grid.cx + Math.cos(clock * GHOST_SPEED) * grid.width * 0.42,
        y: grid.cy + Math.sin(clock * GHOST_SPEED) * grid.height * 0.42,
      };
      if (felt.strength === 0) {
        felt.x = target.x;
        felt.y = target.y;
      }
      const follow = 1 - Math.exp(-dt * 6);
      felt.x += (target.x - felt.x) * follow;
      felt.y += (target.y - felt.y) * follow;
      felt.strength += ((pointer ? 1 : GHOST_STRENGTH) - felt.strength) * (1 - Math.exp(-dt * 3.6));
      ripples = ripples.filter((ripple) => clock - ripple.born < RIPPLE_LIFE);
      draw();
    };

    const sync = () => {
      cancelAnimationFrame(frame);
      draw();
      if (moving()) {
        last = performance.now();
        frame = requestAnimationFrame(tick);
      }
    };

    // A finger only sends ripples; following it would fight the page's scrolling
    const at = (event: PointerEvent) => {
      const box = el.getBoundingClientRect();
      return { x: event.clientX - box.left, y: event.clientY - box.top };
    };
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "touch") pointer = at(event);
    };
    const leave = () => {
      pointer = null;
    };
    // A press on a link or button (the quiz button, the pause button) is for that, not for the dots
    const press = (event: PointerEvent) => {
      if (event.target instanceof Element && event.target.closest("a, button")) return;
      if (moving() && !held()) ripples.push({ ...at(event), born: clock });
    };
    host?.addEventListener("pointermove", move, { passive: true });
    host?.addEventListener("pointerleave", leave);
    host?.addEventListener("pointercancel", leave);
    host?.addEventListener("pointerdown", press, { passive: true });

    const observer = new ResizeObserver(fit);
    observer.observe(el);
    reduced.addEventListener("change", sync);
    sync();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      reduced.removeEventListener("change", sync);
      host?.removeEventListener("pointermove", move);
      host?.removeEventListener("pointerleave", leave);
      host?.removeEventListener("pointercancel", leave);
      host?.removeEventListener("pointerdown", press);
    };
  }, [still]);

  return <canvas ref={canvas} className="dots" aria-hidden="true" />;
}
