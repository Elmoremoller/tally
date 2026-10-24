import { useSyncExternalStore } from "react";
import { PARTS, PAUSE_MS, type Who } from "@/lib/fight-help";

// What the help after a fight keeps on this phone, and nowhere else: when the 20 minutes end, and where a
// 10 minute repair was stopped. Nothing anyone writes is kept. Every read and write survives storage being
// blocked, the way private windows do.

const PAUSE_KEY = "tcs_pause_until";
const REPAIR_KEY = "tcs_repair";
const CHANGED = "tcs-help-changed";
/** How long after the 20 minutes end the timer still asks how they feel. */
export const PAUSE_ASKS_FOR = 2 * 60 * 60_000;
/** How long a stopped repair waits on the plan. */
const REPAIR_WAITS_FOR = 7 * 24 * 60 * 60_000;

/** Where a repair was stopped. `heated` when it stopped for 20 minutes, so it carries on afterwards. */
export type SavedRepair = { part: number; first: Who; at: number; heated: boolean };

function read(key: string) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}
function write(key: string, value: string | null) {
  try {
    if (value === null) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, value);
  } catch {}
  window.dispatchEvent(new Event(CHANGED));
}
function subscribe(onChange: () => void) {
  // Also hears another tab starting or ending the 20 minutes.
  window.addEventListener(CHANGED, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CHANGED, onChange);
    window.removeEventListener("storage", onChange);
  };
}

/** When the 20 minutes end, or null. Null on the server and in the first render. */
export function usePauseUntil() {
  const raw = useSyncExternalStore(subscribe, () => read(PAUSE_KEY), () => null);
  const until = Number(raw);
  return raw && Number.isFinite(until) && until > 0 ? until : null;
}
export function startPause() {
  write(PAUSE_KEY, String(Date.now() + PAUSE_MS));
}
/** Whether the 20 minutes are running right now, for use outside rendering. */
export function pauseRunning() {
  return Number(read(PAUSE_KEY)) > Date.now();
}
export function clearPause() {
  write(PAUSE_KEY, null);
}

/** The stopped repair, or null. */
export function useSavedRepair(): SavedRepair | null {
  const raw = useSyncExternalStore(subscribe, () => read(REPAIR_KEY), () => null);
  if (!raw) return null;
  try {
    const saved = JSON.parse(raw) as Partial<SavedRepair>;
    const ok =
      Number.isInteger(saved.part) &&
      saved.part! >= 0 &&
      saved.part! < PARTS &&
      (saved.first === "me" || saved.first === "partner") &&
      typeof saved.at === "number";
    return ok ? { part: saved.part!, first: saved.first!, at: saved.at!, heated: saved.heated === true } : null;
  } catch {
    return null;
  }
}
export function saveRepair(part: number, first: Who, heated = false) {
  write(REPAIR_KEY, JSON.stringify({ part, first, at: Date.now(), heated } satisfies SavedRepair));
}
export function clearRepair() {
  write(REPAIR_KEY, null);
}
/** Lets go of a repair stopped over a week ago, and a 20 minutes that ended hours ago. */
export function forgetOld() {
  const repair = read(REPAIR_KEY);
  try {
    if (repair && Date.now() - Number(JSON.parse(repair).at) > REPAIR_WAITS_FOR) write(REPAIR_KEY, null);
  } catch {
    write(REPAIR_KEY, null);
  }
  const until = Number(read(PAUSE_KEY));
  if (until && Date.now() - until > PAUSE_ASKS_FOR) write(PAUSE_KEY, null);
}

// One clock for every timer on the page, ticking once a second while something shows a time. It reads 0
// until it starts, so a time is never worked out on the server.
let now = 0;
let ticking: ReturnType<typeof setInterval> | undefined;
const listeners = new Set<() => void>();
function tick() {
  now = Date.now();
  listeners.forEach((listener) => listener());
}
function subscribeClock(onTick: () => void) {
  listeners.add(onTick);
  if (!ticking) {
    now = Date.now();
    ticking = setInterval(tick, 1000);
    // A phone slows timers down in the background, so catch up the moment the page shows again.
    document.addEventListener("visibilitychange", tick);
  }
  return () => {
    listeners.delete(onTick);
    if (!listeners.size) {
      clearInterval(ticking);
      ticking = undefined;
      document.removeEventListener("visibilitychange", tick);
      now = 0;
    }
  };
}
/** The time now, to the second, or 0 before the clock starts. */
export function useNow() {
  return useSyncExternalStore(subscribeClock, () => now, () => 0);
}
