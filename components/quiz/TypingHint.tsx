"use client";

import { useEffect, useRef } from "react";

/** In milliseconds: a letter typed, a letter erased, the pause on a whole example, the pause on an empty box. */
const TYPE = 45;
const ERASE = 18;
const HOLD = 2200;
const GAP = 450;

/**
 * The examples in an empty box, typed out, erased and replaced by the next one, as if different women were
 * answering. It starts on the first example already written, so nothing jumps when the page loads, and holds
 * still on it when the visitor prefers less motion. Screen readers get the first example from the box's
 * description instead, so they aren't read a stream of letters.
 */
export function TypingHint({ examples }: { examples: readonly string[] }) {
  const hint = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = hint.current;
    if (!el || examples.length < 2 || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let which = 0;
    let shown = examples[0].length;
    let erasing = true;
    let timer = 0;
    const step = () => {
      const text = examples[which];
      if (erasing) {
        shown -= 1;
        el.textContent = text.slice(0, shown);
        if (shown > 0) {
          timer = window.setTimeout(step, ERASE);
          return;
        }
        erasing = false;
        which = (which + 1) % examples.length;
        timer = window.setTimeout(step, GAP);
        return;
      }
      shown += 1;
      el.textContent = text.slice(0, shown);
      if (shown >= text.length) {
        erasing = true;
        timer = window.setTimeout(step, HOLD);
        return;
      }
      // A little uneven, like a person typing, with a beat after a comma or full stop.
      timer = window.setTimeout(step, TYPE + Math.random() * 50 + (/[,.]/.test(text[shown - 1]) ? 180 : 0));
    };
    timer = window.setTimeout(step, HOLD);
    return () => window.clearTimeout(timer);
  }, [examples]);

  return (
    <span ref={hint} className="quiz-typing" aria-hidden="true">
      {examples[0]}
    </span>
  );
}
