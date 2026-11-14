import { toolLabels, type ChatTool } from "../week";
import type { QA } from "./quiz";
import { deviceQuestion, DEVICES, type Device } from "./quiz-copy";
import type { MapLine, Track } from "./types";

// The free result's rules from docs/DIRECTION.md, section 3 and Phase 2: the map of her week, with her
// finished result inside its top row, and the offer that names her own setups. Her first step message is
// written and saved but not shown, since the paid path uses it as a step. Pure, so the server, the page and the
// tests can all use it. The heading, the order of the map and the setup names are decided here, in code, so the
// paywall always names what she told us and the paid path (Phase 4) has a fixed list to keep to.

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

/**
 * Counts on the map must be hers (DIRECTION.md, section 5, rule 3): a digit or a number word in a map line has
 * to appear somewhere in her answers. "One" is left out, since "each one" and "one place" are not counts.
 * Returns the counts that are not hers.
 */
export function countsNotHers(text: string, hers: string): string[] {
  // As plain() in lib/intake.ts, which this file can't import, since the page uses it in the browser.
  const words = new Set(hers.toLowerCase().split(/[^\p{L}\p{N}]+/u));
  const counts = text.toLowerCase().match(/\b(\d+|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|fifteen|twenty|thirty|forty|fifty|hundred|dozen|dozens|hundreds)\b/g);
  return (counts ?? []).filter((count) => !words.has(count));
}

const SMALL_WORDS = new Set(["a", "an", "the", "to", "for", "of", "and", "with", "your", "my", "her", "on", "in", "at", "from"]);
/** The first four letters of a word, so "replies" and "replying" count as the same word. */
const stem = (word: string) => word.slice(0, 4);
const wordsOf = (text: string) => text.toLowerCase().split(/[^\p{L}\p{N}]+/u).filter(Boolean);

/**
 * What she calls a task, as it fits "Your ___" in a setup name: "rescheduling texts", "prep lists", "replies
 * to buyers", "Instagram posts". Null when the model's phrase can't be trusted, and the setup name then uses
 * the task's own name without "Your". A phrase is trusted when it is at most five words, every word in it
 * comes from the task's name or her answers (by its first four letters, so "replies" matches "replying"), and
 * it doesn't start like a verb with an object, as "writing the prep list", "answering booking DMs" or
 * "replying to buyers" do.
 */
export function phraseFor(name: string, phrase: unknown, hers: string): string | null {
  if (typeof phrase !== "string") return null;
  const tidy = phrase.trim().replace(/[.!]+$/, "");
  const words = wordsOf(tidy);
  if (!words.length || words.length > 5) return null;
  // A verb with an object reads wrong after "Your": "writing the prep list", "answering booking DMs". Two
  // words, like "rescheduling texts", read fine.
  if (/ing$/.test(words[0]) && words.length > 2) return null;
  if (/ing$/.test(words[0]) && words.length > 1 && SMALL_WORDS.has(words[1])) return null;
  const known = new Set([...wordsOf(name), ...wordsOf(hers)].map(stem));
  return words.every((w) => SMALL_WORDS.has(w) || known.has(stem(w))) ? tidy : null;
}

/** A task as a setup name starts: "Your rescheduling texts", or the task's own name when no phrase is trusted. */
export const taskForSetup = (m: Pick<MapLine, "task" | "phrase">) => (m.phrase ? `Your ${m.phrase}` : m.task);

/** Her first win task and her second task, as her setup names start them. */
export function setupTasks(map: readonly MapLine[], top: string): { top: string; second: string | null } {
  const first = map.find((m) => m.task.toLowerCase() === top.toLowerCase());
  const second = secondTask(map, top);
  return { top: first ? taskForSetup(first) : top, second: second ? taskForSetup(second) : null };
}

/** AI fits fewer than half of her tasks: the map opens with a softer heading and those tasks first. */
export const fewHelp = (map: readonly MapLine[]) => map.filter((m) => m.ai).length * 2 < map.length;

/**
 * The map in the order she sees it: her first win task first, since her finished result sits inside its row.
 * When AI fits fewer than half of her tasks, the ones it can help with come next, then the rest; otherwise the
 * order of her tasks.
 */
export function orderMap(map: readonly MapLine[], top: string): MapLine[] {
  const first = map.filter((m) => m.task.toLowerCase() === top.toLowerCase());
  const rest = map.filter((m) => m.task.toLowerCase() !== top.toLowerCase());
  return fewHelp(map) ? [...first, ...rest.filter((m) => m.ai), ...rest.filter((m) => !m.ai)] : [...first, ...rest];
}

/** Where she said she would use AI most, a Starter's answer on the device screen. */
export function deviceOf(qas: readonly QA[]): Device | null {
  const picked = qas.find((qa) => qa.id === "device")?.picked[0];
  return DEVICES.find((d) => deviceQuestion.labels[d] === picked) ?? null;
}

/**
 * The second task her setups name: the next task on her map that AI can help with without private details,
 * then any other task AI can help with. Null when she named only one.
 */
export function secondTask(map: readonly MapLine[], top: string): MapLine | null {
  const others = map.filter((m) => m.ai && m.task.toLowerCase() !== top.toLowerCase());
  return others.find((m) => !m.private) ?? others[0] ?? null;
}

/**
 * Her first setups by name, in the order of her path (DIRECTION.md, section 4), each task as it reads mid
 * sentence. A Builder's names say the kind of setup, so her path looks different from a Starter's at a glance.
 * Starter: her tool ready where she uses it, her top task set up, her tool taught who she is, a second task.
 * Builder: her top task as a saved project, tested on real ones, a second task with the right tool, a routine.
 * The Starter pattern is Karl's; every line approved by Karl 2026-11-14.
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
  /** Her first win task and her second, as taskForSetup gives them: "Your rescheduling texts". */
  top: string;
  second: string | null;
  device: Device | null;
}): string[] {
  const name = toolLabels[tool];
  if (track === "starter") {
    const where =
      device === "phone" ? "on your phone" : device === "computer" ? "on your computer" : "on your phone and computer";
    return [
      `Get ${name} ready ${where}`,
      `${top}, set up`,
      `Teach ${name} who you are`,
      ...(second ? [`${second}, set up`] : []),
    ];
  }
  return [
    `${top}, as a saved project`,
    "Test it on three real ones",
    ...(second ? [`${second}, with the right tool`] : []),
    "Turn it into a routine you reuse",
  ];
}
