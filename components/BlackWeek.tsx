"use client";

import { useEffect, useState, type ReactNode } from "react";
import { blackWeek } from "@/lib/offer";

/**
 * True while the Black Week offer runs. The landing page is built ahead of time, so the server's answer can be
 * days old: it starts true wherever the page was built during Black Week, and the browser turns it off at
 * `blackWeek.endsAt`, also while the page stays open.
 */
export function useBlackWeek() {
  const [on, setOn] = useState(true);
  useEffect(() => {
    // Right away once it has ended. setTimeout can't wait longer than about 24 days; a page open that long reloads anyway.
    const left = Math.max(0, Date.parse(blackWeek.endsAt) - Date.now());
    if (left > 2 ** 31 - 1) return;
    const timer = setTimeout(() => setOn(false), left);
    return () => clearTimeout(timer);
  }, []);
  return on;
}

/** Shows its children only while the Black Week offer runs. */
export function BlackWeekOnly({ children }: { children: ReactNode }) {
  return useBlackWeek() ? <>{children}</> : null;
}

/** The Black Week pill: a dark tag with the offer's name, and `line` beside it when given. */
export function BlackWeekPill({ line, className }: { line?: string; className?: string }) {
  return (
    <BlackWeekOnly>
      <p className={className ? `bw-pill ${className}` : "bw-pill"}>
        <span className="bw-tag">{blackWeek.pill}</span>
        {line ? <span className="bw-line">{line}</span> : null}
      </p>
    </BlackWeekOnly>
  );
}
