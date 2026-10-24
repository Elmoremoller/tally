"use client";

import { useEffect } from "react";

/** Two small behaviours that need the browser. Renders nothing. */
export function PageBehavior() {
  useEffect(() => {
    const root = document.documentElement;

    // iOS Safari only applies :active press states when a touch listener exists.
    const noop = () => {};
    document.addEventListener("touchstart", noop, { passive: true });

    // The nav shows its soft edge only once content is actually running underneath it.
    let frame = 0;
    const update = () => {
      frame = 0;
      root.toggleAttribute("data-scrolled", window.scrollY > 4);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      document.removeEventListener("touchstart", noop);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
