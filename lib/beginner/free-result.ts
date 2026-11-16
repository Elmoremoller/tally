import { toolLabels, type ChatTool } from "../week";
import { askFirstCopy, offerCopy } from "./copy";
import type { AiPolicy, AiTool } from "../week";
import { recipeOf, whoFrom, withLevels, type Who } from "./levels";
import { emailAppOf, patternWorkflowById, placeFor, type PatternWorkflow } from "./patterns";
import type { QA } from "./quiz";
import type { Device } from "./quiz-copy";
import { beginnerTool, trackFor, type Experience, type FirstWin, type FreeResult, type MapLine, type OfferItem, type Track, type WorksFor } from "./types";

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
 * like "many times a day", is fine; minutes, hours and seconds are not. Case matters only for "hrs": "HR" is a
 * department, so "You answer HR questions" stays (the Phase 7 readout found it dropped rows before).
 */
export const TIME_PROMISE = /\b(?:[Mm]inutes?|[Mm]ins?|[Hh]ours?|[Hh]rs?|[Ss]econds?|[Ss]ecs?|MINUTES?|HOURS?|SECONDS?)\b/;

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

/** The last words of the pieces, which her name for the thing must not end with, or "Your lunch order form form". */
const PIECE_WORDS = /\b(forms?|sheets?|lists?|emails?|checklists?|templates?|replies|routines?|reminders?|messages?|orders? email)$/i;

/**
 * Her name for the thing a responsibility handles, as it fits "Your ___ form" in the pieces her offer lists: "lunch
 * order", "fridge restock", "supplier". Held to the rules of phraseFor, at most four words, without "the" or "your"
 * in front and without a piece's own word at the end. Null when the model's words can't be trusted.
 */
export function thingFor(name: string, thing: unknown, hers: string): string | null {
  const text = phraseFor(name, thing, hers)?.replace(/^(the|your|my)\s+/i, "");
  if (!text || wordsOf(text).length > 4 || PIECE_WORDS.test(text)) return null;
  return text;
}

/** A task as a setup name starts: "Your rescheduling texts", or the task's own name when no phrase is trusted. */
export const taskForSetup = (m: Pick<MapLine, "task" | "phrase">) => (m.phrase ? `Your ${m.phrase}` : m.task);

/** AI fits fewer than half of her tasks: the map opens with a softer heading and those tasks first. Before Phase 8. */
export const fewHelp = (map: readonly MapLine[]) => map.filter((m) => m.ai).length * 2 < map.length;

/** Her map was read as responsibilities with patterns (Phase 8), not as tasks. */
export const readAsResponsibilities = (map: readonly MapLine[]) => map.some((m) => m.patterns !== undefined);

/** How many parts of her week can run smoother: every row that doesn't stay hers. */
export const smootherCount = (map: readonly MapLine[]) => map.filter((m) => m.ai).length;

/**
 * The map in the order she sees it: her first win task first, since her finished result sits inside its row.
 * When AI fits fewer than half of her tasks, the ones it can help with come next, then the rest; otherwise the
 * order of her tasks.
 */
export function orderMap(map: readonly MapLine[], top: string): MapLine[] {
  const first = map.filter((m) => m.task.toLowerCase() === top.toLowerCase());
  const rest = map.filter((m) => m.task.toLowerCase() !== top.toLowerCase());
  // From Phase 8 what stays hers always goes last, under the parts that can run smoother.
  return fewHelp(map) || readAsResponsibilities(map)
    ? [...first, ...rest.filter((m) => m.ai), ...rest.filter((m) => !m.ai)]
    : [...first, ...rest];
}

/**
 * The task her offer names after her top task: the one with a recipe at the highest level (Karl, 2026-11-15,
 * after the Phase 7 runs gave a Gmail Builder a level 3 second task over her level 4 one). When two tie on level,
 * one with another recipe than her top task's wins, so she learns two ways of working, not one twice (Karl,
 * 2026-11-15, after a dog groomer got quick replies twice over say it out loud); then the first on her map. With
 * no recipe, the next one AI can help with that needs no private details, then any other AI can help with. A task
 * that waits for her company's OK is never one. Null when there is none.
 */
export function secondTask(map: readonly MapLine[], top: string): MapLine | null {
  const others = map.filter((m) => m.ai && !m.waits && m.task.toLowerCase() !== top.toLowerCase());
  // A row's way of working: its recipe, or from Phase 8 its pattern workflow.
  const way = (m: MapLine | undefined) => m?.recipe ?? m?.workflow ?? null;
  const topWay = way(map.find((m) => m.task.toLowerCase() === top.toLowerCase()));
  const rank = (m: MapLine) => (m.level ?? 0) * 2 + (way(m) !== topWay ? 1 : 0);
  const withRecipe = others.filter((m) => way(m));
  const best = withRecipe.reduce<MapLine | null>((a, m) => (!a || rank(m) > rank(a) ? m : a), null);
  return best ?? others.find((m) => !m.private) ?? others[0] ?? null;
}

/**
 * A task as her offer names it (DIRECTION.md, section 3): what its recipe makes of it, like "Your rescheduling
 * texts, saved once on your phone", or, with no recipe, what it is at level 2, like "Your booking replies,
 * written with AI". Never a saved setup the task doesn't get.
 */
export function workflowName(m: Pick<MapLine, "task" | "phrase" | "recipe" | "workflow">): string {
  const recipe = recipeOf(m);
  const workflow = m.workflow ? patternWorkflowById(m.workflow) : undefined;
  return `${taskForSetup(m)}, ${recipe ? recipe.offer : workflow ? workflow.offer : offerCopy.withAi}`;
}

/**
 * The pieces Tally builds for a checked recipe, with her name for the thing (Karl, 2026-11-16). They follow each
 * recipe's own material. DRAFT
 */
const RECIPE_PIECES: Record<string, (thing: string) => string[]> = {
  phone_quick_replies: (t) => [`Your ${t} replies, written for you and saved on your phone`],
  saved_assistant: (t) => [`Your ${t} assistant’s instructions, written for you`, `Your ${t} examples, with names taken out`],
  say_it_out_loud: (t) => [`Your ${t} opening line, so what you say comes back finished`, `Your ${t} list of what to say each time`],
  notes_to_sheet: (t) => [`Your ${t} sheet columns, set up for you`, `Your ${t} instructions that turn notes into rows`],
  gmail_templates: (t) => [`Your ${t} emails, written for you and saved as Gmail templates`],
  gmail_help_me_write: (t) => [`Your ${t} starting lines for Help me write`, `Your ${t} tone notes`],
  gmail_claude_follow_ups: (t) => [`Your ${t} follow up instructions, written for you`, `Your ${t} first and second nudge`],
  weekly_no_reply_list: (t) => [`Your ${t} waiting list instructions, written for you`, `Your ${t} list layout`],
};

/** Words that end in s and stay as they are in front of another word, like "news sheet" or "sales list". */
const KEEPS_S = new Set(["news", "series", "sales", "this", "his", "bus", "gas", "plus"]);

/**
 * Her name for the task as it reads in front of a piece's word: the last word singular, so "fridge restocks" makes
 * "Your fridge restock list", never "Your fridge restocks list".
 */
export function singularLast(phrase: string): string {
  return phrase.replace(/(\p{L}+)$/u, (word) => {
    const w = word.toLowerCase();
    if (KEEPS_S.has(w) || /(ss|us|is)$/.test(w)) return word;
    if (/ies$/.test(w)) return `${word.slice(0, -3)}y`;
    if (/(ch|sh|x)es$/.test(w)) return word.slice(0, -2);
    if (/s$/.test(w)) return word.slice(0, -1);
    return word;
  });
}

/** The thing a row handles, in her words: the trusted thing, else her name for the task made singular, else the task. */
const thingOf = (m: Pick<MapLine, "task" | "phrase" | "thing">) =>
  m.thing ?? (m.phrase ? singularLast(m.phrase) : m.task.charAt(0).toLowerCase() + m.task.slice(1));

/**
 * The pieces Tally builds for one workflow in her offer (DIRECTION.md, section 3), each with her name for the thing:
 * from its recipe, its pattern workflow, or at level 2 the message for her chat tool. At most three.
 */
export function piecesFor(m: MapLine, her: { tool: ChatTool } & Pick<Who, "device" | "places">): string[] {
  const thing = thingOf(m);
  const recipe = recipeOf(m);
  if (recipe) return (RECIPE_PIECES[recipe.id]?.(thing) ?? []).slice(0, 3);
  const workflow: PatternWorkflow | undefined = m.workflow ? patternWorkflowById(m.workflow) : undefined;
  if (workflow) {
    const onPhone = placeFor(workflow, her) === "phone";
    return workflow.pieces({ thing, tool: her.tool, emailApp: emailAppOf(her.places), onPhone }).slice(0, 3);
  }
  return [offerCopy.toolMessage(thing, toolLabels[her.tool])];
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
  const tasks = offerTasks(map, top);
  // From Phase 8 getting her AI tool ready and teaching it who she is come only with a workflow that uses an AI
  // tool, and nothing that puts work into AI is offered under a company that restricts it, so there is no message
  // to ask (DIRECTION.md, section 4).
  if (readAsResponsibilities(map)) {
    const setups = tasks.map(workflowName);
    if (track === "builder" || !tasks.some(usesAiTool)) return { setups, prep: [] };
    const { ready, about } = prepTitles(tool, device);
    return { setups, prep: [ready, about] };
  }
  const setups = [...tasks.map(workflowName), ...(restricted ? [offerCopy.askAllowed] : [])];
  if (track === "builder") return { setups, prep: [] };
  const { ready, about } = prepTitles(tool, device);
  return { setups, prep: [ready, about] };
}

/** Her work goes into an AI tool on this row: a recipe or workflow that needs AI, or writing it with AI each time. */
export function usesAiTool(m: Pick<MapLine, "recipe" | "workflow" | "level">): boolean {
  const recipe = recipeOf(m);
  if (recipe) return recipe.conditions.needsAiAllowed;
  const workflow = m.workflow ? patternWorkflowById(m.workflow) : undefined;
  if (workflow) return workflow.usesAi;
  return m.level === 2;
}

/** A Starter's two prep steps by name, as her offer lists them and her path titles them. Approved by Karl 2026-11-15. */
export function prepTitles(tool: ChatTool, device: Device | null) {
  const name = toolLabels[tool];
  const where =
    device === "phone" ? "on your phone" : device === "computer" ? "on your computer" : "on your phone and computer";
  return { ready: `Get ${name} ready ${where}`, about: `Teach ${name} who you are` };
}

/**
 * Her company restricts AI and her offer would name no workflow, because every task waits for its OK and no recipe
 * fits (Karl, 2026-11-15). Her free result then shows no price and no pay button, only the message to ask what's
 * allowed, free.
 */
export const askOnlyFor = (map: readonly MapLine[], top: string, restricted: boolean) =>
  restricted && offerTasks(map, top).length === 0;

/** The free message to ask what's allowed, naming the tasks that wait the way her map names them. */
export function askMessageFor(map: readonly MapLine[]): string {
  const tasks = map
    .filter((m) => m.waits)
    .map((m) => m.phrase ?? m.task.charAt(0).toLowerCase() + m.task.slice(1))
    .slice(0, 3);
  return askFirstCopy.message(tasks);
}

/**
 * Whether her offer says the free plan is enough (DIRECTION.md, section 3): only when every task it names has a
 * recipe, and every one of those recipes says so.
 */
export function freePlanFor(map: readonly MapLine[], top: string): boolean {
  const tasks = offerTasks(map, top);
  return tasks.length > 0 && tasks.every((m) => recipeOf(m)?.cost.freePlanEnough === true);
}

/**
 * Her whole free result from her checked answers and the intake's read of them: each task's level and recipe,
 * the map in the order she sees it, and her offer, all chosen in code, never by the model. The server
 * (app/begin/actions.ts) and scripts/persona-runs.ts both use it, so the test runs check what the live site shows.
 */
export function freeResultFor(
  answers: { experience: Experience; aiTools: AiTool[]; worksFor: WorksFor; aiPolicy: AiPolicy | null; qas: QA[] },
  result: { first_win: FirstWin; first_step: string | null; map: MapLine[] },
): FreeResult {
  const track = trackFor(answers.experience);
  const tool = beginnerTool(answers.aiTools);
  const top = result.first_win.task;
  const who = whoFrom({ track, ...answers });
  const map = orderMap(withLevels(result.map, who), top);
  const restricted = who.canUse === "restricted";
  // With every task waiting for her company's OK there is nothing to sell: no offer, only the free message.
  const askOnly = askOnlyFor(map, top, restricted);
  // From Phase 8 her offer lists the pieces Tally builds under each workflow.
  const offer: OfferItem[] | undefined = readAsResponsibilities(map)
    ? offerTasks(map, top).map((m) => ({ name: workflowName(m), pieces: piecesFor(m, { tool, device: who.device, places: who.places }) }))
    : undefined;
  return {
    firstWin: result.first_win,
    firstStep: result.first_step,
    map,
    ...(askOnly
      ? { setups: [], prep: [], freePlan: false, askOnly, askMessage: askMessageFor(map) }
      : {
          ...offerFor({ track, tool, map, top, device: who.device, restricted }),
          ...(offer ? { offer } : {}),
          freePlan: freePlanFor(map, top),
        }),
    tool,
    track,
  };
}
