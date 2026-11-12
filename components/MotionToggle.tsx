"use client";

import { useEffect, useRef, useState } from "react";
import { PauseBars, Play } from "./icons";

/**
 * Pause and play for a section's motion: the hero's moving background and the phone playing through the
 * product, or the drifting reviews. Like the control on Apple's moving heroes. It also stops the motion while
 * the section is off screen. Hidden when the visitor prefers reduced motion, because then nothing moves.
 * `name` says what it stops, for screen readers, when a page has more than one. With `control` false there is
 * no button: the motion always plays, and still stops while the section is off screen.
 */
export function MotionToggle({ name = "motion", control = true }: { name?: string; control?: boolean }) {
  const button = useRef<HTMLButtonElement & HTMLSpanElement>(null);
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

  const label = paused ? `Play ${name}` : `Pause ${name}`;
  if (!control) return <span ref={button} hidden />;
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
