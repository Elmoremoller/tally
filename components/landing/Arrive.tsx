"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * A list whose items arrive one after another the first time it comes into view (the CSS staggers them with
 * --i). Until then it is marked waiting; visitors who prefer less motion, or without scripts, see it whole.
 */
export function Arrive({ className, children }: { className?: string; children: ReactNode }) {
  const list = useRef<HTMLOListElement>(null);
  const [state, setState] = useState<"waiting" | "in">("waiting");

  useEffect(() => {
    const el = list.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setState("in");
        observer.disconnect();
      },
      { threshold: 0.35 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <ol ref={list} className={className} data-arrive={state}>
      {children}
    </ol>
  );
}
