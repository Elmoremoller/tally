"use client";

import { useLayoutEffect, useRef, type ComponentPropsWithoutRef } from "react";

type FitTextareaProps = ComponentPropsWithoutRef<"textarea"> & { value: string };

/**
 * A text box that grows to fit its words, so a longer sentence is never cut off on a phone. It never gets
 * smaller than its rows.
 */
export function FitTextarea({ value, ...props }: FitTextareaProps) {
  const box = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    const fit = () => {
      el.style.height = "auto";
      // A hidden box measures 0, so it keeps its rows instead.
      if (el.scrollHeight) el.style.height = `${el.scrollHeight}px`;
    };
    fit();
    // The words wrap differently when the screen turns or the font arrives.
    window.addEventListener("resize", fit);
    document.fonts.ready.then(fit);
    return () => window.removeEventListener("resize", fit);
  }, [value]);

  return <textarea ref={box} value={value} {...props} />;
}
