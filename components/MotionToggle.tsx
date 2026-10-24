"use client";

import { useEffect, useRef, useState } from "react";
import { PauseBars, Play } from "./icons";

/**
 * Pause and play for the hero's motion, the moving background and the phone playing through the product,
 * like the control on Apple's moving heroes. It also stops the motion while the hero is off screen. Hidden
 * when the visitor prefers reduced motion, because then nothing moves.
 */
export function MotionToggle() {
  const button = useRef<HTMLButtonElement>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const hero = button.current?.closest<HTMLElement>("[data-motion]");
    if (!hero) return;
    const observer = new IntersectionObserver(([entry]) => hero.toggleAttribute("data-offscreen", !entry.isIntersecting));
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const hero = button.current?.closest<HTMLElement>("[data-motion]");
    if (hero) hero.dataset.motion = paused ? "paused" : "running";
  }, [paused]);

  const label = paused ? "Play motion" : "Pause motion";
  return (
    <button
      ref={button}
      type="button"
      className="motion-toggle"
      aria-label={label}
      title={label}
      onClick={() => setPaused((current) => !current)}
    >
      {paused ? <Play /> : <PauseBars />}
    </button>
  );
}
