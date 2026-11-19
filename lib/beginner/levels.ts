import { chatTools, type AiPolicy, type AiTool } from "../week";
import { KIND_PATTERN, PATTERN_WORKFLOWS, placeFor, type PatternId, type PatternWorkflow } from "./patterns";
import type { QA } from "./quiz";
import { CONNECT, CONNECT_ID, connectQuestion, deviceQuestion, DEVICES, type Connect, type Device } from "./quiz-copy";
import { PHONE_STAND_IN, recipeById, recipes, TASK_KINDS, type Level, type Recipe, type RecipeApp, type RecipeRoute, type TaskKind } from "./recipes";
import { levelCopy } from "./copy";
import { canUseOf, DEFAULT_TOOL, type CanUse, type Held, type MapLine, type Stays, type Track, type WorksFor } from "./types";

// The level of each responsibility on her map (docs/DIRECTION.md, section 2, Five levels). The code chooses the
// level, never the model: the model only names the patterns and the task's kind, from fixed lists the code
// checks. A task gets the highest level where every condition holds, for a checked recipe of its kind or the
// workflow of one of its patterns (lib/beginner/patterns.ts):
//
// 1. A workflow exists for its pattern and the apps she uses.
// 2. She controls the app, or she is allowed to connect it.
// 3. It does not put other people's private details into a tool that may not hold them.
// 4. It fits her track: a Starter path stops at level 3.
// 5. It has steps for the device she uses.
//
// On a tie, the one for her most fitting pattern comes first, then a checked recipe before a pattern workflow, and
// one that puts none of her work into an AI tool before one that does. On a phone, a task whose recipes all need a computer may take the recipe of a stand in
// kind (PHONE_STAND_IN in recipes.ts).
//
// From Phase 8 a responsibility stays hers (level 1) only when nothing repeats around it, that is no pattern fits,
// or when it holds other people's private details; the map says which. A task with no workflow that fits gets
// level 2. Someone whose company restricts AI still gets every workflow that puts none of her work into an AI
// tool, with no line to ask; a task that needs AI waits for her company's OK. "Ask first" is only on rows that put
// her work into an AI tool, for someone who is Not sure what she may do. Tasks read before Phase 8 have no
// patterns and keep the Phase 5 rules. Pure, so the server, the previews and the tests can all use it.

/** What the level rules need to know about her. */
export type Who = {
  track: Track;
  /** Her answer to Can you use AI for your work, or "self" when she works for herself. */
  canUse: CanUse;
  /** Could she connect her work email or calendar to an AI tool herself. Null when she wasn't asked. */
  connect: Connect | null;
  /** Everything she ticked or typed on Where does your work happen. */
  places: string[];
  /** What she uses for work. Null on answers saved before everyone was asked, and then any device counts. */
  device: Device | null;
  aiTools: AiTool[];
};

/**
 * A task as the level rules read it. `kind` is null when no kind fits. `patterns` is absent on tasks read before
 * Phase 8, which keep the Phase 5 rules, and empty when nothing repeats around it.
 */
export type LevelTask = { ai: boolean; private: boolean; kind: TaskKind | null; patterns?: PatternId[] };

export type TaskLevel = {
  /** Null when the task waits for her company's OK. */
  level: Level | null;
  /** It needs AI and her company restricts AI, and no workflow that needs no AI fits it. */
  waits: boolean;
  /** The recipe behind a level of 3 or higher. */
  recipe: Recipe | null;
  /** The pattern workflow behind a level of 3, when no recipe gave one. */
  workflow: PatternWorkflow | null;
  /** The rule that held the level down, when a higher workflow for her apps exists. */
  held: Held | null;
  askFirst: boolean;
  /** Why it stays hers, for a task read from Phase 8 on. */
  stays: Stays | null;
};

/** The kind the intake gave, when it is one of TASK_KINDS. Anything else, "none" included, is null. */
export const kindOf = (value: unknown): TaskKind | null =>
  typeof value === "string" && (TASK_KINDS as readonly string[]).includes(value) ? (value as TaskKind) : null;

const has = (places: readonly string[], pattern: RegExp) => places.some((p) => pattern.test(p));

/**
 * The apps a recipe can count on, from her answers. Whichever chat tool she uses always counts, and her path
 * names Claude when she uses none of the ones a recipe names. A phone's keyboard counts when she has a phone;
 * the task's kind, not the place, says the work goes by text. Gmail and Google Sheets count when she ticked them.
 */
export function appsOf(who: Pick<Who, "places" | "device" | "aiTools">): Set<RecipeApp> {
  const apps = new Set<RecipeApp>(["any_chat"]);
  const chats = chatTools(who.aiTools);
  for (const tool of chats.length ? chats : [DEFAULT_TOOL]) if (tool === "chatgpt" || tool === "claude") apps.add(tool);
  if (who.device !== "computer") {
    // Which phone she has is asked on her path, at the first step that needs it, so every phone route counts here.
    apps.add("iphone");
    apps.add("gboard");
    apps.add("samsung_keyboard");
  }
  if (has(who.places, /\bgmail\b/i)) apps.add("gmail");
  if (has(who.places, /\bgoogle sheets\b|^\s*sheets\s*$/i)) apps.add("google_sheets");
  return apps;
}

/** The route has steps for what she uses. With Both, or nothing known, steps for either device count. */
export function hasStepsFor(route: RecipeRoute, device: Device | null): boolean {
  const phone = Boolean(route.steps.phone?.length);
  const computer = Boolean(route.steps.computer?.length);
  if (device === "phone") return phone;
  if (device === "computer") return computer;
  return phone || computer;
}

/** The first rule that stops this recipe for this task and her, or null when none does. */
function heldBy(recipe: Recipe, task: LevelTask, who: Who, routes: RecipeRoute[]): Held | null {
  const { needsAiAllowed, connectsApp, taskContent } = recipe.conditions;
  const self = who.canUse === "self";
  if (needsAiAllowed && who.canUse === "restricted") return "restricted";
  if (connectsApp && !self && who.connect !== "yes") return "connect";
  if (task.private && taskContent === "chat_tool" && !self) return "private";
  if (who.track === "starter" && recipe.level > 3) return "track";
  if (!routes.some((route) => hasStepsFor(route, who.device))) return who.device === "phone" ? "needs_computer" : "needs_phone";
  return null;
}

/** One way to run a task that the rules weigh: a checked recipe, or a pattern workflow. */
type Option = { level: Level; recipe: Recipe | null; workflow: PatternWorkflow | null; usesAi: boolean; held: Held | null };

/** What stops a pattern workflow for this task and her, or undefined when it has nothing to be set up in. */
function workflowHeld(w: PatternWorkflow, task: LevelTask, who: Who): Held | null | undefined {
  if (w.usesAi && who.canUse === "restricted") return "restricted";
  if (w.usesAi && task.private && who.canUse !== "self") return "private";
  const place = placeFor(w, who);
  if (place === null) return undefined;
  return place === "needs_computer" ? "needs_computer" : null;
}

/** Every recipe and pattern workflow that could run this task for her, best first. */
function optionsFor(task: LevelTask, who: Who): Option[] {
  const apps = appsOf(who);
  const options: Option[] = [];
  for (const recipe of recipes) {
    if (task.kind === null || recipe.kind !== task.kind) continue;
    const routes = recipe.routes.filter((route) => route.apps.every((app) => apps.has(app)));
    // Condition 1: without a route for the apps she uses, the recipe isn't hers, and it holds nothing back.
    if (!routes.length) continue;
    const held = heldBy(recipe, task, who, routes);
    options.push({ level: recipe.level, recipe, workflow: null, usesAi: recipe.conditions.needsAiAllowed, held });
  }
  for (const pattern of task.patterns ?? []) {
    const workflow = PATTERN_WORKFLOWS[pattern];
    const held = workflowHeld(workflow, task, who);
    if (held === undefined || options.some((o) => o.workflow?.id === workflow.id)) continue;
    options.push({ level: workflow.level, recipe: null, workflow, usesAi: workflow.usesAi, held });
  }
  // Highest level first. On a tie, the one for her most fitting pattern (a recipe counts for its kind's pattern);
  // then a checked recipe, then one that puts none of her work into an AI tool. Tasks read before Phase 8 have no
  // patterns, so only the last two decide.
  const patterns = task.patterns ?? [];
  const fit = (o: Option) => {
    const pattern = o.workflow?.pattern ?? (o.recipe ? KIND_PATTERN[o.recipe.kind] : null);
    const at = pattern === null ? -1 : patterns.indexOf(pattern);
    return at < 0 ? patterns.length : at;
  };
  const order = (a: Option, b: Option) =>
    b.level - a.level || fit(a) - fit(b) || Number(Boolean(b.recipe)) - Number(Boolean(a.recipe)) || Number(a.usesAi) - Number(b.usesAi);
  return options.sort(order);
}

/** The level of one task, with its recipe or workflow and what held it down. See the top of this file. */
export function levelFor(task: LevelTask, who: Who): TaskLevel {
  const read = task.patterns !== undefined;
  if (!task.ai) {
    const stays = read ? (task.private ? "private" : "nothing_repeats") : null;
    return { level: 1, waits: false, recipe: null, workflow: null, held: null, askFirst: false, stays };
  }
  const options = optionsFor(task, who);
  const chosen = options.find((o) => !o.held);
  const blocked = options.find((o) => o.held);
  if (chosen) {
    return {
      level: chosen.level,
      waits: false,
      recipe: chosen.recipe,
      workflow: chosen.workflow,
      held: blocked && blocked.level > chosen.level ? blocked.held : null,
      // Before Phase 8 a recipe that needs no AI at work still asked first under a restricted company.
      askFirst: read
        ? chosen.usesAi && who.canUse === "not_sure"
        : (who.canUse === "restricted" && !chosen.usesAi) || who.canUse === "not_sure",
      stays: null,
    };
  }
  // On a phone, when only a computer held her task's recipes back, a recipe of the stand in kind may fit instead.
  const standIn = task.kind && who.device === "phone" && blocked?.held === "needs_computer" ? PHONE_STAND_IN[task.kind] : undefined;
  if (standIn) {
    const instead = levelFor({ ...task, kind: standIn, ...(read ? { patterns: [] } : {}) }, who);
    if (instead.recipe) return instead;
  }
  const held = blocked?.held ?? null;
  // With AI restricted at her work, writing it with AI isn't hers to choose: it waits for her company's OK.
  if (who.canUse === "restricted") return { level: null, waits: true, recipe: null, workflow: null, held, askFirst: false, stays: null };
  return { level: 2, waits: false, recipe: null, workflow: null, held, askFirst: who.canUse === "not_sure", stays: null };
}

/**
 * A recipe's With your path line for one task: with her own name for the task in front when it can be trusted
 * (phraseFor gives null when it can't), so two tasks with the same recipe never read the same.
 */
export const pathLineFor = (recipe: Recipe, phrase: string | null): string =>
  phrase ? levelCopy.forTask(phrase, recipe.withPath) : recipe.withPath;

/**
 * Her map with a level on every row, or the waits tag. A row with a recipe takes its With your path line from the
 * recipe, with her name for the task in it, so a level of 3 or higher never reads like writing help; any other
 * row keeps the model's line.
 */
export function withLevels(map: readonly MapLine[], who: Who): MapLine[] {
  return map.map((row) => {
    const { level, waits, recipe, workflow, held, askFirst, stays } = levelFor(
      { ai: row.ai, private: row.private, kind: row.kind ?? null, ...(row.patterns ? { patterns: row.patterns } : {}) },
      who,
    );
    return {
      ...row,
      level,
      waits,
      recipe: recipe?.id ?? null,
      withPath: recipe ? pathLineFor(recipe, row.phrase) : row.withPath,
      held,
      askFirst,
      // Rows read before Phase 8 keep their shape.
      ...(row.patterns ? { workflow: workflow?.id ?? null, stays } : {}),
    };
  });
}

/** The recipe of a map row, when it has one. */
export const recipeOf = (row: Pick<MapLine, "recipe">): Recipe | undefined => (row.recipe ? recipeById(row.recipe) : undefined);

/** What she uses for work, by its label now or on answers saved before Phase 5. */
export function deviceOf(qas: readonly QA[]): Device | null {
  const picked = qas.find((qa) => qa.id === "device")?.picked[0];
  return DEVICES.find((d) => deviceQuestion.labels[d] === picked || deviceQuestion.legacyLabels[d] === picked) ?? null;
}

/** Everything she ticked on Where does your work happen, then what she typed there, split at commas. */
export function placesOf(qas: readonly QA[]): string[] {
  const where = qas.find((qa) => qa.id === "where");
  if (!where) return [];
  const typed = (where.text ?? "").split(/[,;/\n]/).map((t) => t.trim()).filter(Boolean);
  return [...where.picked, ...typed];
}

/** Her answer to the connect question, when she was asked. */
export function connectOf(qas: readonly QA[]): Connect | null {
  const picked = qas.find((qa) => qa.id === CONNECT_ID)?.picked[0];
  return CONNECT.find((c) => connectQuestion.labels[c] === picked) ?? null;
}

/** Everything the level rules need, from her checked answers. */
export function whoFrom(answers: {
  track: Track;
  worksFor: WorksFor;
  aiPolicy: AiPolicy | null;
  qas: readonly QA[];
  aiTools: AiTool[];
}): Who {
  const canUse = canUseOf(answers.worksFor, answers.aiPolicy);
  return {
    track: answers.track,
    canUse,
    // Only an employee who may use AI is asked, so an answer anyone else's browser sends doesn't count.
    connect: canUse === "yes" || canUse === "not_sure" ? connectOf(answers.qas) : null,
    places: placesOf(answers.qas),
    device: deviceOf(answers.qas),
    aiTools: answers.aiTools,
  };
}

/** What the level rules need, for one of the samples in samples.ts: no connect answer, and her one chat tool. */
export function sampleWho(sample: {
  free: { track: Track; device: Device | null; places: string[] };
  plan: { worksFor: WorksFor; policy: AiPolicy | null; tool: AiTool };
}): Who {
  return {
    track: sample.free.track,
    canUse: canUseOf(sample.plan.worksFor, sample.plan.policy),
    connect: null,
    places: sample.free.places,
    device: sample.free.device,
    aiTools: [sample.plan.tool],
  };
}
