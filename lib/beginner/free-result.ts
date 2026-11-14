import { toolLabels, type ChatTool } from "../week";
import type { QA } from "./quiz";
import { deviceQuestion, DEVICES, type Device } from "./quiz-copy";
import type { MapLine, Track } from "./types";

// The free result's rules from docs/DIRECTION.md, section 3 and Phase 2: her finished result, her first step,
// the map of her week and the offer that names her own setups. Pure, so the server, the page and the tests can
// all use it. The setup names are built here, in code, from her track and her own tasks, so the paywall always
// names what she told us and the paid path (Phase 4) has a fixed list to keep to.

/** With a real example given, her finished result holds at most this many blanks. */
export const BLANKS_MAX = 2;

/** The screen id of her real example, as kept in her answered screens. */
export const EXAMPLE_ID = "example";

/** Her real example of her top task, when she gave one. */
export const exampleOf = (qas: readonly QA[]): string | null =>
  qas.find((qa) => qa.id === EXAMPLE_ID)?.text?.trim() || null;

/** The blanks in a draft: every distinct thing in square brackets, so [first name] used twice counts once. */
export function blanksIn(text: string): string[] {
  const found = new Set<string>();
  for (const match of text.matchAll(/\[([^\]\n]{1,60})\]/g)) found.add(match[1].trim().toLowerCase());
  return [...found];
}

/**
 * A map line must never promise time saved (DIRECTION.md, section 5, rule 3). Her own count from the quiz,
 * like "many times a day", is fine; minutes, hours and seconds are not.
 */
export const TIME_PROMISE = /\b(minutes?|mins?|hours?|hrs?|seconds?|secs?)\b/i;

/** Where she said she would use AI most, a Starter's answer on the device screen. */
export function deviceOf(qas: readonly QA[]): Device | null {
  const picked = qas.find((qa) => qa.id === "device")?.picked[0];
  return DEVICES.find((d) => deviceQuestion.labels[d] === picked) ?? null;
}

/**
 * The second task her setups name: the next task on her map that AI can help with without private details,
 * then any other task AI can help with. Null when she named only one.
 */
export function secondTask(map: readonly MapLine[], top: string): string | null {
  const others = map.filter((m) => m.ai && m.task.toLowerCase() !== top.toLowerCase());
  return (others.find((m) => !m.private) ?? others[0])?.task ?? null;
}

/**
 * Her first setups by name, in the order of her path (DIRECTION.md, section 4). DRAFT, every line.
 * Starter: her tool ready where she uses it, her top task done by her, her tool taught who she is, a second task.
 * Builder: her top task as a saved project, tested on real ones, a second task done the right way, a routine.
 */
export function setupsFor({
  track,
  tool,
  top,
  second,
  device,
}: {
  track: Track;
  tool: ChatTool;
  top: string;
  second: string | null;
  device: Device | null;
}): string[] {
  const name = toolLabels[tool];
  if (track === "starter") {
    const where =
      device === "phone" ? "on your phone" : device === "computer" ? "on your computer" : "on your phone and computer";
    return [
      `${name} ready ${where}`, // DRAFT
      `${top}, done by you`, // DRAFT
      `${name} taught who you are`, // DRAFT
      ...(second ? [`${second}, from your week`] : []), // DRAFT
    ];
  }
  return [
    `${top}, as a saved project`, // DRAFT
    "Your project tested on three real ones", // DRAFT
    ...(second ? [`${second}, with the right approach`] : []), // DRAFT
    "A routine you can reuse", // DRAFT
  ];
}
