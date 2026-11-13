"use client";

import { useSyncExternalStore } from "react";
import { Check } from "@/components/icons";
import { beginnerPlanCopy as copy } from "@/lib/beginner/copy";

// Her ticks: the Done mark on her first win and the seven days share them, so ticking one ticks the other.
// They are kept in this browser, under her plan's address, and nowhere else. If the browser won't keep them
// (a private window), they still work until the page is closed.

const listeners = new Set<() => void>();
/** The ticks as saved text, also kept here for a browser that won't store them. */
let kept: string | null = null;
const key = () => `tally-ticks:${window.location.pathname}`;

function read() {
  try {
    return window.localStorage.getItem(key()) ?? kept ?? "[]";
  } catch {
    return kept ?? "[]";
  }
}

function write(value: string) {
  kept = value;
  try {
    window.localStorage.setItem(key(), value);
  } catch {}
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** The days she has ticked, 0 to 6, and a way to tick or untick one. Nothing is ticked until the page is in the browser. */
function useTicks() {
  const saved = useSyncExternalStore(subscribe, read, () => "[]");
  let days: number[] = [];
  try {
    const parsed: unknown = JSON.parse(saved);
    if (Array.isArray(parsed)) days = parsed.filter((n): n is number => Number.isInteger(n) && n >= 0 && n < 7);
  } catch {}
  const done: ReadonlySet<number> = new Set(days);
  const toggle = (day: number) => write(JSON.stringify(done.has(day) ? days.filter((d) => d !== day) : [...days, day]));
  return { done, toggle };
}

/** "I did it", under her first win: day one's tick. */
export function DoneButton() {
  const { done, toggle } = useTicks();
  const on = done.has(0);
  return (
    <button type="button" className="btn day-done" aria-pressed={on} onClick={() => toggle(0)}>
      {on ? <Check /> : null}
      {on ? copy.undone : copy.done}
    </button>
  );
}

/** Her seven days, each with a tick, and how many are done. */
export function SevenDays({ days }: { days: { title: string; text: string }[] }) {
  const { done, toggle } = useTicks();
  return (
    <>
      <p className="days-progress" role="status">
        {copy.daysProgress(done.size)}
      </p>
      <ol className="days">
        {days.map((day, i) => (
          <li key={day.title} className="day-row" data-done={done.has(i) || undefined}>
            <label>
              <input type="checkbox" className="sr-only" checked={done.has(i)} onChange={() => toggle(i)} />
              <span className="day-tick" aria-hidden="true">
                <Check />
              </span>
              <span className="day-words">
                <span className="day-num">Day {i + 1}</span>
                <span className="day-title">{day.title}</span>
                <span className="day-text">{day.text}</span>
              </span>
            </label>
          </li>
        ))}
      </ol>
      <p className="plan-tools-line">{copy.daysNote}</p>
    </>
  );
}
