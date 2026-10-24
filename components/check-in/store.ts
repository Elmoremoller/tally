import { useSyncExternalStore } from "react";
import type { CheckInId } from "@/lib/check-ins";

// Not now, kept on this phone and nowhere else: which check in was put off, and on which day. It shows again
// the next day. When storage is blocked, the way private windows do, it's kept until the page closes.

const LATER_KEY = "tcs_check_in_later";
const CHANGED = "tcs-check-in-changed";
let kept: string | null = null;

/** "2026-10-22", in the phone's own time zone, so "the next day" is theirs. */
const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

function read() {
  try {
    return window.localStorage.getItem(LATER_KEY) ?? kept;
  } catch {
    return kept;
  }
}
function subscribe(onChange: () => void) {
  window.addEventListener(CHANGED, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CHANGED, onChange);
    window.removeEventListener("storage", onChange);
  };
}

/** Whether this check in was put off today. False on the server and in the first render. */
export function usePutOff(id: CheckInId) {
  return useSyncExternalStore(subscribe, () => read() === `${id}:${today()}`, () => false);
}
export function putOff(id: CheckInId) {
  kept = `${id}:${today()}`;
  try {
    window.localStorage.setItem(LATER_KEY, kept);
  } catch {}
  window.dispatchEvent(new Event(CHANGED));
}
