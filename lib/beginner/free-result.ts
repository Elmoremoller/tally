import { toolLabels, type ChatTool } from "../week";
import { offerCopy } from "./copy";
import { recipeOf } from "./levels";
import type { QA } from "./quiz";
import type { Device } from "./quiz-copy";
import type { MapLine, Track } from "./types";

export { deviceOf } from "./levels";

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

/**
 * The task her offer names after her top task: the next one on her map with a recipe, then the next one AI can
 * help with that needs no private details, then any other AI can help with. A task that waits for her company's
 * OK is never one. Null when there is none.
 */
export function secondTask(map: readonly MapLine[], top: string): MapLine | null {
  const others = map.filter((m) => m.ai && !m.waits && m.task.toLowerCase() !== top.toLowerCase());
  return others.find((m) => recipeOf(m)) ?? others.find((m) => !m.private) ?? others[0] ?? null;
}

/**
 * A task as her offer names it (DIRECTION.md, section 3): what its recipe makes of it, like "Your rescheduling
 * texts, saved once on your phone", or, with no recipe, what it is at level 2, like "Your booking replies,
 * written with AI". Never a saved setup the task doesn't get.
 */
export function workflowName(m: Pick<MapLine, "task" | "phrase" | "recipe">): string {
  const recipe = recipeOf(m);
  return `${taskForSetup(m)}, ${recipe ? recipe.offer : offerCopy.withAi}`;
}

/**
 * The tasks her offer names, in order: her first win task, then her second. Only tasks AI can help with, and
 * never one that waits for her company's OK.
 */
export function offerTasks(map: readonly MapLine[], top: string): MapLine[] {
  const first = map.find((m) => m.ai && !m.waits && m.task.toLowerCase() === top.toLowerCase());
  const second = secondTask(map, top);
  return [...(first ? [first] : []), ...(second ? [second] : [])];
}

/**
 * Her offer by name (DIRECTION.md, section 3). `setups` is her workflows, each named by workflowName, and, when
 * her company restricts AI, the message to ask what's allowed, which ends her path (section 4). `prep` is a
 * Starter's two short steps, her tool ready where she works and taught who she is: her path opens with them,
 * but the offer lists them under her workflows, under offerCopy.prepLead. A Builder has none.
 */
export function offerFor({
  track,
  tool,
  map,
  top,
  device,
  restricted = false,
}: {
  track: Track;
  tool: ChatTool;
  /** Her map with levels, as withLevels gives it. */
  map: readonly MapLine[];
  top: string;
  device: Device | null;
  restricted?: boolean;
}): { setups: string[]; prep: string[] } {
  const setups = [...offerTasks(map, top).map(workflowName), ...(restricted ? [offerCopy.askAllowed] : [])];
  if (track === "builder") return { setups, prep: [] };
  const name = toolLabels[tool];
  const where =
    device === "phone" ? "on your phone" : device === "computer" ? "on your computer" : "on your phone and computer";
  return { setups, prep: [`Get ${name} ready ${where}`, `Teach ${name} who you are`] };
}

/**
 * Whether her offer says the free plan is enough (DIRECTION.md, section 3): only when every task it names has a
 * recipe, and every one of those recipes says so.
 */
export function freePlanFor(map: readonly MapLine[], top: string): boolean {
  const tasks = offerTasks(map, top);
  return tasks.length > 0 && tasks.every((m) => recipeOf(m)?.cost.freePlanEnough === true);
}
