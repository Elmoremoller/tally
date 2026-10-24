"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * A screen's main button, kept in reach on a phone. Under 46rem it sticks to the bottom of the screen while
 * the step scrolls under it, and lands back in its own place at the end of the step. `data-stuck` is set
 * while it is pinned, so the header's frosted bar shows behind it then and not in its own place. It doesn't
 * ride on top of the keyboard: the answer boxes are a few lines tall, and it would cover what she is typing.
 * On wider screens it is an ordinary wrapper.
 */
export function Dock({ className, children }: { className?: string; children: ReactNode }) {
  const dock = useRef<HTMLDivElement>(null);
  const end = useRef<HTMLSpanElement>(null);
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    // Pinned when it sits above its own place, which the marker right after it keeps.
    const measure = () => {
      if (!dock.current || !end.current) return;
      setStuck(end.current.getBoundingClientRect().top - dock.current.getBoundingClientRect().bottom > 1);
    };
    measure();
    const resized = new ResizeObserver(measure);
    resized.observe(document.body);
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      resized.disconnect();
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <>
      <div ref={dock} className={className ? `quiz-dock ${className}` : "quiz-dock"} data-stuck={stuck || undefined}>
        {children}
      </div>
      <span ref={end} className="quiz-dock-end" aria-hidden="true" />
    </>
  );
}
