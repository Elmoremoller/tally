import { blockCardById, blockCards, CARD_IDS, CARD_TOOLS, cardById, type BlockCard, type BlockFeature, type CardId, type SetupCard } from "./cards";
import { followUpsFor, pickedOn, type FollowAnswer } from "./follow-ups";
import { offerTasks, piecesFor, workflowName } from "./free-result";
import { hasStepsFor, recipeOf } from "./levels";
import { savedAboutHerself, routesFor, type Material, type Phone, type Skip } from "./path";
import { emailAppOf, KIND_PATTERN, patternWorkflowById, placeFor, suiteOf, type PatternId, type Suite } from "./patterns";
import type { QA } from "./quiz";
import type { Device } from "./quiz-copy";
import { RECIPE_IDS, recipeById, type Recipe, type RecipeApp } from "./recipes";
import { hasEmployer, type MapLine, type Track, type WorksFor } from "./types";
import type { AiPolicy, ChatTool } from "../week";

// Her paid path from Phase 10 (docs/DIRECTION.md, section 4): she confirms or swaps her top two workflows, answers a
// few questions about how she does the first one today, and one call designs it from her answers. Then the second.
// Nothing is written by AI when she pays, so her path opens at once. Her picks, answers and both workflows are kept
// in the plan's content (version 4), saved with save_plan, so there is no database change.
//
// The code decides what a workflow may be made of (menuFor): the checked cards that fit her apps, her device and her
// account, her row's recipe, and plain goals. The model picks from that list and writes the words. checkDesign
// rejects any id that is not on the list, any click path the model wrote, any workflow without an approval point or
// without what she does each time, and, for lunch in Microsoft Forms, a sheet (Karl, 2026-11-16).
// Pure, so the server, the page, the previews, the script and the tests all use it.

export const PATH_V4 = 4;
/** Her workflows, in the order her offer named them. */
export const SLOT_IDS = ["task_1", "task_2"] as const;
export type SlotId = (typeof SLOT_IDS)[number];
/** She can have a workflow written this many times before the page asks her to write to support. */
export const DESIGNS_MAX = 3;

/** One step of a designed workflow: a checked card or recipe by id, or a plain goal in her words. */
export type DesignStep = {
  /** A card id, a recipe id, or "goal". */
  use: string;
  /** One short sentence on what this step does, never a click path. */
  say: string;
  /** The piece of what Tally wrote that this step uses, counted from 1, or null. */
  piece: number | null;
  /** Set up once, or done each time from then on. */
  when: "once" | "each_time";
};

export type Design = {
  read: string;
  material: Material[];
  steps: DesignStep[];
  tryOn: string;
  good: string;
  approval: string;
  /** It puts her work into an AI tool, so her tool's prep steps come right before it. */
  usesAi: boolean;
  /** The Microsoft or Google apps it was built for, or null when it uses neither. */
  suite: Suite | null;
  /** Her phone, when she works on a phone only and said which. */
  phone: Phone | null;
};

export type Slot = {
  id: SlotId;
  /** The row of her map, by its task name. */
  task: string;
  answers: FollowAnswer[] | null;
  design: Design | null;
  /** She said an app already does this: she picks another row. */
  solved: boolean;
  /** How many times a workflow was written for this slot. */
  tries: number;
};

/** What only an AI workflow needs: the note about her, safe use and, with an employer, the message to ask. */
export type Prep = { aboutNote: string | null; safeUse: string[]; askMessage: string | null };

export type PathV4 = {
  version: typeof PATH_V4;
  role: string;
  track: Track;
  tool: ChatTool;
  worksFor: WorksFor;
  policy: AiPolicy | null;
  device: Device | null;
  /** Where her work happens, from the quiz. */
  places: string[];
  apps: RecipeApp[];
  /** Her map with levels, as her free result showed it, for the names, the pieces and swapping. */
  map: MapLine[];
  confirmed: boolean;
  slots: Slot[];
  prep: Prep | null;
  skipped: Skip[];
};

/** Everything startPath needs, a part of PathInput. */
export type StartInput = {
  role: string;
  track: Track;
  tool: ChatTool;
  worksFor: WorksFor;
  aiPolicy: AiPolicy | null;
  device: Device | null;
  apps: RecipeApp[];
  map: MapLine[];
  top: string;
  qas: readonly QA[];
};

/** Her path as it opens right after paying: her offer's two workflows, nothing written yet. */
export function startPath(input: StartInput): PathV4 {
  const places = input.qas.find((qa) => qa.id === "where");
  return {
    version: PATH_V4,
    role: input.role,
    track: input.track,
    tool: input.tool,
    worksFor: input.worksFor,
    policy: input.aiPolicy,
    device: input.device,
    places: places ? [...places.picked, ...(places.text ? [places.text] : [])] : [],
    apps: input.apps,
    map: input.map,
    confirmed: false,
    slots: offerTasks(input.map, input.top).map((row, i) => ({
      id: SLOT_IDS[i],
      task: row.task,
      answers: null,
      design: null,
      solved: false,
      tries: 0,
    })),
    prep: null,
    skipped: [
      ...(input.track === "builder" ? (["ready"] as const) : []),
      ...(input.track === "builder" && savedAboutHerself(input.qas) ? (["about"] as const) : []),
    ],
  };
}

export const rowOf = (path: Pick<PathV4, "map">, task: string): MapLine | undefined =>
  path.map.find((m) => m.task.toLowerCase() === task.toLowerCase());

/** The pattern a row's workflow follows: its pattern workflow, its recipe's kind, or its first pattern. */
export function patternOfRow(row: MapLine): PatternId | null {
  const workflow = row.workflow ? patternWorkflowById(row.workflow) : undefined;
  if (workflow) return workflow.pattern;
  const recipe = recipeOf(row);
  if (recipe) return KIND_PATTERN[recipe.kind];
  return row.patterns?.[0] ?? null;
}

/** The workflow as her offer named it, and the pieces it listed. */
export const nameOf = (row: MapLine) => workflowName(row);
export const piecesOf = (path: Pick<PathV4, "tool" | "device" | "places">, row: MapLine) =>
  piecesFor(row, { tool: path.tool, device: path.device, places: path.places });

/**
 * The rows she can swap in: another part of her map that gets a workflow (a recipe or a pattern workflow), that
 * doesn't wait for her company, and that can be set up on her device.
 */
export function swapCandidates(path: Pick<PathV4, "map" | "slots" | "device" | "places">): MapLine[] {
  const taken = new Set(path.slots.map((s) => s.task.toLowerCase()));
  return path.map.filter((m) => {
    if (taken.has(m.task.toLowerCase()) || !m.ai || m.waits || !(m.recipe || m.workflow)) return false;
    const workflow = m.workflow ? patternWorkflowById(m.workflow) : undefined;
    const place = workflow ? placeFor(workflow, { device: path.device, places: path.places }) : "computer";
    return place === "phone" || place === "computer";
  });
}

/**
 * Her two picks applied: each slot keeps its answers and workflow when its task stays, and starts over when it
 * changes. Null when a pick is not hers to make: unknown, repeated, or the wrong number.
 */
export function withPicks(path: PathV4, picks: readonly string[]): PathV4 | null {
  if (picks.length !== path.slots.length || new Set(picks.map((p) => p.toLowerCase())).size !== picks.length) return null;
  const allowed = new Set([...path.slots.map((s) => s.task), ...swapCandidates(path).map((m) => m.task)].map((t) => t.toLowerCase()));
  if (!picks.every((p) => allowed.has(p.toLowerCase()))) return null;
  const slots = path.slots.map((slot, i) => {
    const task = rowOf(path, picks[i])?.task ?? picks[i];
    return task.toLowerCase() === slot.task.toLowerCase() ? slot : { id: slot.id, task, answers: null, design: null, solved: false, tries: 0 };
  });
  return { ...path, confirmed: true, slots };
}

// What a workflow may be made of.

/** The building blocks each pattern's workflow may use, Microsoft or Google picked later. Pattern 2 has none. */
export const PATTERN_FEATURES: Record<PatternId, BlockFeature[]> = {
  1: ["saved_email"],
  2: [],
  3: ["below_usual", "dropdown", "saved_email", "repeat_reminder"],
  4: ["form_create", "form_share", "form_results", "form_to_sheet", "count_each", "form_clear", "saved_email", "repeat_reminder"],
  5: ["days_after", "next_due", "due_highlight", "dropdown", "repeat_reminder", "saved_email"],
  6: ["form_create", "form_share", "form_results", "form_to_sheet", "dropdown", "highlight_row", "saved_email"],
  7: ["repeat_reminder"],
  8: ["saved_email", "repeat_reminder"],
  9: ["form_create", "form_share", "form_to_sheet", "dropdown"],
  10: [],
};

const SUITE_APPS: Record<Suite, ReadonlySet<BlockCard["app"]>> = {
  microsoft: new Set(["microsoft_forms", "excel"]),
  google: new Set(["google_forms", "google_sheets"]),
};

/** One thing a workflow may use, as the model and the page read it. */
export type MenuItem =
  | { kind: "block"; id: string; card: BlockCard; when: "once" | "each_time" | "either" }
  | { kind: "setup"; id: CardId; card: SetupCard }
  | { kind: "recipe"; id: string; recipe: Recipe; when: "each_time" };

export type Menu = {
  pattern: PatternId;
  suite: Suite | null;
  phone: Phone | null;
  items: MenuItem[];
  /** Features the workflow must use, like the results page for lunch in Microsoft Forms. */
  required: BlockFeature[];
  /** Features it must not use, like a sheet for lunch in Microsoft Forms. */
  forbidden: BlockFeature[];
  usesAi: boolean;
};

/** What she does each time, as opposed to setting up once. */
const EACH_TIME: ReadonlySet<BlockFeature> = new Set(["form_results", "form_clear"]);

/** The device whose steps she sees on a building block card. */
export function cardDevice(device: Device | null, phone: Phone | null): "computer" | "android" | "iphone" {
  if (device !== "phone") return "computer";
  return phone === "iphone" ? "iphone" : "android";
}

/** Her answer to Microsoft or Google, when she was asked, or her quiz's apps. Null with Neither. */
export function suiteFrom(places: readonly string[], answers: readonly FollowAnswer[] | null): Suite | null {
  const said = pickedOn(answers ?? [], "suite")[0];
  if (said === "neither") return null;
  if (said === "microsoft" || said === "google") return said;
  return suiteOf(places);
}

export const phoneFrom = (answers: readonly FollowAnswer[] | null): Phone | null => {
  const said = pickedOn(answers ?? [], "phone")[0];
  return said === "iphone" || said === "samsung" || said === "android" ? said : null;
};

/**
 * The steps one workflow may use, decided in code (Karl's rules, 2026-11-16): only cards for her Microsoft or
 * Google apps and her email app, with steps for her device, and a card that needs a paid or work account only when
 * she has an employer. Her row's recipe when it has one. For lunch in Microsoft Forms the results page counts each
 * choice, so the workflow must read it there, clear the answers each time, and use no sheet.
 */
export function menuFor(
  path: Pick<PathV4, "places" | "device" | "worksFor" | "tool" | "apps">,
  row: MapLine,
  answers: readonly FollowAnswer[] | null,
): Menu | null {
  const pattern = patternOfRow(row);
  if (!pattern) return null;
  const suite = suiteFrom(path.places, answers);
  const phone = phoneFrom(answers);
  const device = cardDevice(path.device, phone);
  const emailApp = emailAppOf(path.places);
  const calendar = pickedOn(answers ?? [], "calendar")[0];
  const employer = hasEmployer(path.worksFor);
  const features = new Set(PATTERN_FEATURES[pattern]);

  const fits = (card: BlockCard) => {
    if (!features.has(card.feature)) return false;
    if (!card.steps[device]?.length) return false;
    if (!card.freePlan.enough && !employer) return false;
    if (card.feature === "saved_email") return (card.app === "outlook" && emailApp === "Outlook") || (card.app === "gmail" && emailApp === "Gmail");
    if (card.feature === "repeat_reminder")
      return card.app === "outlook"
        ? emailApp === "Outlook" || calendar === "outlook"
        : suite === "google" || emailApp === "Gmail" || calendar === "google";
    return suite !== null && SUITE_APPS[suite].has(card.app);
  };
  const items: MenuItem[] = blockCards
    .filter(fits)
    .map((card) => ({ kind: "block", id: card.id, card, when: EACH_TIME.has(card.feature) ? "each_time" : "either" }));

  const recipe = recipeOf(row);
  if (recipe) {
    const routes = routesFor(recipe, path.apps, path.tool).filter((r) => hasStepsFor(r, path.device));
    // A recipe's route is what she does each time, like pasting her notes and importing the rows.
    if (routes.length) items.unshift({ kind: "recipe", id: recipe.id, recipe, when: "each_time" });
  }
  const workflow = row.workflow ? patternWorkflowById(row.workflow) : undefined;
  if (pattern === 10 && (CARD_TOOLS as readonly string[]).includes(path.tool)) {
    const card = cardById(`${path.tool}_project`);
    if (card && (device === "computer" ? card.steps.computer?.length : card.steps.phone?.length)) items.push({ kind: "setup", id: card.id, card });
  }

  const has = (f: BlockFeature) => items.some((i) => i.kind === "block" && i.card.feature === f);
  const required: BlockFeature[] = [];
  const forbidden: BlockFeature[] = [];
  if (pattern === 4 && suite === "microsoft") {
    required.push(...(["form_create", "form_share", "form_results", "form_clear"] as const).filter(has));
    forbidden.push("form_to_sheet", "count_each");
  }
  if (pattern === 4 && suite === "google") required.push(...(["form_create", "form_share", "form_to_sheet", "count_each", "form_clear"] as const).filter(has));
  if (pattern === 6) required.push(...(["form_create", "form_share"] as const).filter(has));
  if (pattern === 5) required.push(...(["days_after", "next_due"] as const).filter(has));

  const usesAi = recipe ? recipe.conditions.needsAiAllowed : workflow ? workflow.usesAi : row.level === 2;
  return { pattern, suite: items.some((i) => i.kind === "block" && SUITE_APPS[suite ?? "microsoft"].has(i.card.app)) ? suite : null, phone, items, required, forbidden, usesAi };
}

// Checking what the model wrote.

/** Words that belong to a click path. The model never writes one; clicks come only from cards and recipes. */
export const CLICK_WORDS = /\b(click|clicks|clicked|tap|taps|tapped|select|selects|menu|menus|ribbon|toolbar|button|buttons|settings|drag)\b|[>→]/i;
/** A dash used as punctuation, or a hyphenated word, which the copy rules ban. */
export const DASHES = /[‒-―]|\s-\s|\p{L}-\p{L}/u;
/** An AI tool named in a workflow that puts nothing into one. */
export const AI_WORDS = /\b(ai|chatgpt|claude|copilot|gemini|chatbot|prompt)\b/i;
/** A promised time, which the copy rules ban. */
/** Everything she told us as one text, for checking that numbers in her workflow are hers. */
export function hersText(input: { job: string; qas: readonly QA[] }, row: MapLine | undefined, answers: readonly FollowAnswer[] | null): string {
  return [input.job, ...input.qas.flatMap((qa) => [...qa.picked, qa.text ?? ""]), row?.today ?? "", ...(answers ?? []).map((a) => a.text ?? "")].join("\n");
}
export const TIME_WORDS = /\b(minutes?|hours?|seconds?|faster|quicker|instantly|in no time|save[sd]? (you )?time)\b/i;
const NOT_CHECKED = /not checked|unchecked|unverified/i;

const sentences = (s: string) => s.split(/(?<=[.!?])\s+/).filter((x) => x.trim()).length;
const clean = (value: unknown, max: number): string | null => {
  const t = typeof value === "string" ? value.replace(/\s+/g, " ").trim() : "";
  return t && t.length <= max ? t : null;
};
/** Material keeps its line breaks, since a form question or an email has them. */
const cleanItem = (value: unknown, max: number): string | null => {
  const t = typeof value === "string" ? value.replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim() : "";
  return t && t.length <= max ? t : null;
};

export type Prose = { aboutNote: string | null; safeUse: string[]; askMessage: string | null };

/** What the model must write besides the workflow: the note, safe use and the ask message, only for AI. */
export type Needs = { about: boolean; prep: boolean; ask: boolean };

export function needsFor(path: Pick<PathV4, "prep" | "skipped" | "worksFor" | "policy">, menu: Menu): Needs {
  const prep = menu.usesAi && !path.prep;
  // Only an employee whose company hasn't said yes to AI needs the message to ask.
  return { prep, about: prep && !path.skipped.includes("about"), ask: prep && hasEmployer(path.worksFor) && path.policy !== "encouraged" };
}

/**
 * The model's answer as her workflow, or the reasons it was rejected, so it is written again. Every check here is
 * one of DIRECTION.md's rules or Karl's Phase 10 rules.
 */
export function checkDesign(
  raw: unknown,
  menu: Menu,
  needs: Needs,
  /** Everything she told us, so a number in what Tally wrote must be one she gave. */
  hers = "",
): { design: Design; prose: Prose | null } | { errors: string[] } {
  const r = (raw ?? {}) as Record<string, unknown>;
  const errors: string[] = [];
  const read = clean(r.read, 700);
  if (!read || sentences(read) < 2 || sentences(read) > 4) errors.push("read is not 2 to 4 sentences");

  const material: Material[] = [];
  for (const m of Array.isArray(r.material) ? (r.material as Record<string, unknown>[]) : []) {
    const label = clean(m?.label, 60)?.replace(/[.:]$/, "");
    const items = (Array.isArray(m?.items) ? m.items : []).map((i) => cleanItem(i, 1600)).filter((i): i is string => Boolean(i));
    if (!label || !items.length || items.length > 16) errors.push(`piece "${String(m?.label)}" is empty or too long`);
    else material.push({ label, items });
  }
  const recipeItem = menu.items.find((i): i is Extract<MenuItem, { kind: "recipe" }> => i.kind === "recipe");
  const piecesWanted = recipeItem ? recipeItem.recipe.material.length : null;
  if (!material.length || material.length > 4) errors.push("material must have 1 to 4 pieces");
  if (piecesWanted !== null && material.length !== piecesWanted) errors.push(`the recipe needs exactly ${piecesWanted} pieces`);

  const ids = new Map(menu.items.map((i) => [i.id, i]));
  const steps: DesignStep[] = [];
  for (const s of Array.isArray(r.steps) ? (r.steps as Record<string, unknown>[]) : []) {
    const use = typeof s?.use === "string" ? s.use.trim() : "";
    const say = clean(s?.say, 220);
    const when = s?.when === "each_time" ? "each_time" : s?.when === "once" ? "once" : null;
    const piece = typeof s?.piece === "number" && Number.isInteger(s.piece) && s.piece >= 1 ? s.piece : null;
    if (use !== "goal" && !ids.has(use)) {
      errors.push(`unknown step id "${use}"`);
      continue;
    }
    if (!say) errors.push(`step "${use}" has no short line`);
    else if (CLICK_WORDS.test(say)) errors.push(`step "${use}" reads like a click path: "${say}"`);
    if (!when) errors.push(`step "${use}" has no when`);
    if (piece !== null && piece > material.length) errors.push(`step "${use}" points at a piece that doesn't exist`);
    if (say && when) steps.push({ use, say, piece, when });
  }
  if (steps.length < 2 || steps.length > 9) errors.push("a workflow has 2 to 9 steps");
  if (!steps.some((s) => s.when === "once")) errors.push("nothing is set up once");
  if (!steps.some((s) => s.when === "each_time")) errors.push("it never says what she does each time");
  const used = new Set(steps.map((s) => s.use));
  const cards = steps.filter((s) => s.use !== "goal").map((s) => s.use);
  if (new Set(cards).size !== cards.length) errors.push("a listed step is used twice; a later use is a goal");
  const usedFeatures = new Set(
    steps.flatMap((s) => {
      const item = ids.get(s.use);
      return item?.kind === "block" ? [item.card.feature] : [];
    }),
  );
  for (const f of menu.required) if (!usedFeatures.has(f)) errors.push(`it must use ${f}`);
  for (const f of menu.forbidden) if (usedFeatures.has(f)) errors.push(`it must not use ${f}`);
  if (recipeItem && !used.has(recipeItem.id)) errors.push("it must use its recipe");
  for (const s of steps) {
    const item = ids.get(s.use);
    if ((item?.kind === "block" || item?.kind === "recipe") && item.when === "each_time" && s.when === "once") errors.push(`${s.use} is done each time`);
  }
  // Microsoft: a formula, table or other change to the workbook Forms fills stops new answers arriving (Microsoft's
  // sync page, checked 2026-11-16), so a workflow that opens its answers in Excel never edits that workbook.
  if (used.has("ms_forms_to_excel")) {
    if (steps.some((s) => blockCardById(s.use)?.app === "excel"))
      errors.push("no Excel step may change the workbook Forms fills, or new answers stop arriving; read it as it is, or use the results page");
    if (material.some((m) => m.items.some((i) => /(^|\s)=[A-Z]/.test(i))))
      errors.push("no formula may go into the workbook Forms fills, or new answers stop arriving");
  }

  const tryOn = clean(r.try_on, 240);
  const good = clean(r.good, 240);
  const approval = clean(r.approval, 240);
  if (!tryOn || !good) errors.push("the test is missing");
  if (!approval) errors.push("the approval point is missing");

  // Copy rules over everything she reads.
  const words = [read, tryOn, good, approval, ...steps.map((s) => s.say), ...material.map((m) => m.label)].filter((w): w is string => Boolean(w));
  const items = material.flatMap((m) => m.items);
  if (words.some((w) => DASHES.test(w)) || items.some((i) => /[‒-―]/.test(i))) errors.push("a dash");
  if ([...words, ...items].some((w) => NOT_CHECKED.test(w))) errors.push("says not checked");
  if (read && TIME_WORDS.test(read)) errors.push(`promises time with "${read.match(TIME_WORDS)?.[0]}" in the read`);
  if (!menu.usesAi && [...words, ...items].some((w) => AI_WORDS.test(w))) errors.push("names AI in a workflow that uses none");

  // No invented facts (DIRECTION.md, section 5, rule 2): a number in what Tally wrote, outside a formula and outside
  // square brackets, must be one she gave, so no usual amounts, prices or counts are made up for her.
  // "1" stays allowed, as in "step 1" or "1 of each".
  const given = new Set(["1", ...(hers.match(/\d+/g) ?? [])]);
  const invented = items.flatMap((item) =>
    item.split("\n").flatMap((line) => (line.replace(/\[[^\]]*\]/g, "").replace(/=.*$/, "").match(/\b\d+\b/g) ?? []).filter((n) => !given.has(n))),
  );
  if (invented.length) errors.push(`numbers she never gave: ${[...new Set(invented)].slice(0, 6).join(", ")}; use square brackets instead`);

  let prose: Prose | null = null;
  if (needs.prep) {
    const aboutNote = needs.about ? clean(r.about_note, 1500) : null;
    const safeUse = (Array.isArray(r.safe_use) ? r.safe_use : []).map((l) => clean(l, 220)).filter((l): l is string => Boolean(l)).slice(0, 6);
    const askMessage = needs.ask ? clean(r.ask_message, 1000) : null;
    if (needs.about && !aboutNote) errors.push("the note about her is missing");
    if (safeUse.length < 3) errors.push("safe use needs 3 lines");
    if (needs.ask && !askMessage) errors.push("the message to ask is missing");
    prose = { aboutNote, safeUse, askMessage };
  }

  if (errors.length || !read || !tryOn || !good || !approval) return { errors };
  return {
    design: { read, material, steps, tryOn, good, approval, usesAi: menu.usesAi, suite: menu.suite, phone: menu.phone },
    prose,
  };
}

/** A saved path the page can show: version 4, known slots, and every designed step a real card, recipe or goal. */
export function validPathV4(path: PathV4): boolean {
  if (path.version !== PATH_V4 || !Array.isArray(path.slots) || !path.slots.length || path.slots.length > SLOT_IDS.length) return false;
  return path.slots.every(
    (slot, i) =>
      slot.id === SLOT_IDS[i] &&
      (!slot.design ||
        slot.design.steps.every(
          (s) => s.use === "goal" || Boolean(blockCardById(s.use)) || CARD_IDS.includes(s.use as CardId) || RECIPE_IDS.includes(s.use),
        )),
  );
}

// The screens of her path, in order.

export type Screen =
  | { kind: "start" }
  | { kind: "questions"; slot: SlotId }
  | { kind: "solved"; slot: SlotId }
  | { kind: "ready" }
  | { kind: "about" }
  | { kind: "workflow"; slot: SlotId }
  | { kind: "end" };

/**
 * Her screens so far: the start, then for each workflow its questions or what Tally wrote, with her AI tool's prep
 * steps right before the first workflow that uses AI. The list stops at the first workflow not yet written.
 */
export function screensFor(path: PathV4): Screen[] {
  const screens: Screen[] = [{ kind: "start" }];
  if (!path.confirmed) return screens;
  let prepped = false;
  for (const slot of path.slots) {
    if (slot.solved) return [...screens, { kind: "solved", slot: slot.id }];
    if (!slot.design) return [...screens, { kind: "questions", slot: slot.id }];
    screens.push({ kind: "questions", slot: slot.id });
    if (slot.design.usesAi && !prepped) {
      prepped = true;
      if (!path.skipped.includes("ready")) screens.push({ kind: "ready" });
      if (!path.skipped.includes("about") && path.prep?.aboutNote) screens.push({ kind: "about" });
    }
    screens.push({ kind: "workflow", slot: slot.id });
  }
  return [...screens, { kind: "end" }];
}

/** The step ids "Did it work?" can be saved for on a version 4 path. */
export const answerableSteps = (path: PathV4): string[] => ["ready", "about", ...path.slots.map((s) => s.id)];

/** A card's note, shown only when it matters for her workflow. */
export function noteShown(card: BlockCard, design: Design): string | null {
  if (!card.note) return null;
  if (!card.noteWhen) return card.note;
  const features = new Set(design.steps.map((s) => blockCardById(s.use)?.feature));
  return features.has(card.noteWhen) ? card.note : null;
}

/** What it costs, from the cards and the recipe the workflow uses: a line for each that needs more than a free account. */
export function costLines(design: Design): string[] {
  const lines = design.steps.flatMap((s) => {
    const card = blockCardById(s.use);
    if (card && !card.freePlan.enough && card.freePlan.note) return [card.freePlan.note];
    const recipe = recipeById(s.use);
    if (recipe && recipe.cost.freePlanEnough !== true) return [recipe.cost.note];
    return [];
  });
  return [...new Set(lines)];
}

/** The follow up questions for one slot, from its row and what her quiz said. */
export function questionsFor(path: Pick<PathV4, "map" | "device" | "places">, slot: Pick<Slot, "task">) {
  const row = rowOf(path, slot.task);
  const pattern = row ? patternOfRow(row) : null;
  return row && pattern ? { row, pattern, set: followUpsFor(pattern, path) } : null;
}
