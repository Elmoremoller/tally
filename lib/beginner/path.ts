import { CARD_IDS, CARD_TOOLS, cardById, type CardId, type CardSetup, type SetupCard } from "./cards";
import { offerTasks } from "./free-result";
import { appsOf, hasStepsFor, recipeOf } from "./levels";
import type { QA } from "./quiz";
import { doneWithAi, type Device } from "./quiz-copy";
import { RECIPE_APPS, RECIPE_IDS, recipeById, type Recipe, type RecipeApp, type RecipeRoute, type RecipeStep } from "./recipes";
import type { MapLine, Track, WorksFor } from "./types";
import { hasEmployer } from "./types";
import { toolLabels, type AiPolicy, type AiTool, type ChatTool } from "../week";

// Her paid path (docs/DIRECTION.md, section 4 and Phase 6): her first workflow set up and working, then her
// second, one step at a time. The code decides every step: which ones she gets, in what order, which recipe or
// card each one uses and which route of it fits her apps. The model only writes the words in between: the short
// read of each workflow, the material Tally wrote for her, the note about her, safe use and the message to ask
// what's allowed. A step stores ids, never click paths: the steps she follows are read from cards.ts and
// recipes.ts when the page is shown, so they are always the checked ones.
//
// Rules from Karl, 2026-11-15:
// 1. The quiz never asks iPhone or Android. The first step whose setup differs by phone asks iPhone, Samsung or
//    another Android phone, and shows only that phone's steps.
// 2. Two tasks with the same recipe: the first is set up in full, the second is a short extra step on top.
// 3. A task that waits for her company's OK gets no workflow; the path ends with the message to ask.
// 4. A Builder skips getting her tool ready, and skips teaching it who she is only when her quiz says she has
//    already saved instructions about herself. A Starter skips neither.
// Pure, so the server, the previews and the tests can all use it.

export const PATH_VERSION = 3;

/** The phones her path asks about, at the first step that needs it. Karl's choices, 2026-11-15. */
export const PHONES = ["iphone", "samsung", "android"] as const;
export type Phone = (typeof PHONES)[number];
/** The keyboard app each phone's route uses. Another Android phone gets Google's keyboard, and its route says so. */
export const phoneApp: Record<Phone, RecipeApp> = { iphone: "iphone", samsung: "samsung_keyboard", android: "gboard" };
const PHONE_APPS: ReadonlySet<RecipeApp> = new Set(Object.values(phoneApp));

/** Her answer to "Did it work?" on a step. */
export type PathAnswer = "yes" | "not_quite";
/** Her few words after a second Not quite on a step, at most this long, so the event stays small. */
export const NOTE_MAX = 300;
/** After this many Not quite answers on one step, she is offered help or her money back. */
export const HELP_AFTER = 2;

/** For these recipes the second piece is a shortcut or a name for each item of the first, in the same order. */
export const PAIRED: ReadonlySet<string> = new Set(["phone_quick_replies", "gmail_templates"]);

/** One piece of what Tally wrote for her, like her replies or the instructions for her assistant. */
export type Material = { label: string; items: string[] };

export type ReadyStep = { id: "ready"; kind: "ready"; card: CardId | null; firstStep: string | null };
export type AboutStep = { id: "about"; kind: "about"; card: CardId | null; note: string };
/** One task set up as a workflow. `recipe` is null for a task with no recipe, which she writes with AI. */
export type WorkflowStep = {
  id: string;
  kind: "workflow";
  task: string;
  /** The workflow as her offer named it, like "Your rescheduling texts, saved once on your phone". */
  title: string;
  recipe: string | null;
  read: string;
  material: Material[];
};
/** A second task with the same recipe as an earlier step: added to the setup she just made. */
export type ExtraStep = {
  id: string;
  kind: "extra";
  task: string;
  title: string;
  recipe: string;
  sameAs: string;
  read: string;
  material: Material[];
};
export type EndStep = { id: "end"; kind: "end"; safeUse: string[]; askMessage: string | null };
export type PathStep = ReadyStep | AboutStep | WorkflowStep | ExtraStep | EndStep;

/** What her path left out because she has already done it. */
export type Skip = "ready" | "about";

/** Everything her path page shows. `version: 3` tells it apart from the plans written before Phase 6. */
export type PathPlan = {
  version: typeof PATH_VERSION;
  role: string;
  track: Track;
  tool: ChatTool;
  worksFor: WorksFor;
  policy: AiPolicy | null;
  /** What she uses for work, from the quiz. Null on answers saved before it was asked. */
  device: Device | null;
  /** The apps her recipes can count on, from her answers when the path was written. */
  apps: RecipeApp[];
  skipped: Skip[];
  steps: PathStep[];
};

// The outline: the steps the code decided, before the model writes the words.

export type OutlineStep =
  | { id: "ready"; kind: "ready"; card: CardId | null }
  | { id: "about"; kind: "about"; card: CardId | null }
  | { id: string; kind: "workflow"; task: MapLine; recipe: Recipe | null }
  | { id: string; kind: "extra"; task: MapLine; recipe: Recipe; sameAs: string }
  | { id: "end"; kind: "end"; employer: boolean };

export type Outline = { skipped: Skip[]; steps: OutlineStep[] };

/** The card for one of her tool's setups, or null when Tally has no checked card for her tool. */
export function cardFor(tool: ChatTool, setup: CardSetup): CardId | null {
  return (CARD_TOOLS as readonly string[]).includes(tool) ? (`${tool}_${setup}` as CardId) : null;
}

/** Her quiz says she has already saved instructions about herself (the Builder screen What have you already done with AI). */
export const savedAboutHerself = (qas: readonly QA[]) =>
  qas.some((qa) => qa.id === "done" && qa.picked.includes(doneWithAi.choices[1]));

/**
 * The steps of her path, decided in code from what her free result showed: a Starter's two opening steps, then
 * one workflow per task her offer named, a second task with the same recipe as a short extra step, and the end.
 * Tasks that wait for her company's OK are never in her offer, so they get no workflow.
 */
export function outlinePath(input: {
  track: Track;
  tool: ChatTool;
  /** Her map with levels, as her free result showed it. */
  map: readonly MapLine[];
  /** Her first win task, the top row of her map. */
  top: string;
  qas: readonly QA[];
  worksFor: WorksFor;
}): Outline {
  const skipped: Skip[] = [];
  const steps: OutlineStep[] = [];
  if (input.track === "starter") steps.push({ id: "ready", kind: "ready", card: cardFor(input.tool, "get_started") });
  else skipped.push("ready");
  if (input.track === "starter" || !savedAboutHerself(input.qas))
    steps.push({ id: "about", kind: "about", card: cardFor(input.tool, "about_you") });
  else skipped.push("about");

  const firstFor = new Map<string, string>();
  offerTasks(input.map, input.top).forEach((task, i) => {
    const id = `task_${i + 1}`;
    const recipe = recipeOf(task) ?? null;
    const sameAs = recipe ? firstFor.get(recipe.id) : undefined;
    if (recipe && sameAs) steps.push({ id, kind: "extra", task, recipe, sameAs });
    else {
      if (recipe) firstFor.set(recipe.id, id);
      steps.push({ id, kind: "workflow", task, recipe });
    }
  });
  steps.push({ id: "end", kind: "end", employer: hasEmployer(input.worksFor) });
  return { skipped, steps };
}

/** The recipe ids her outline uses, the only ones the model may name. */
export const outlineRecipes = (outline: Outline): string[] => [
  ...new Set(outline.steps.flatMap((s) => (s.kind === "workflow" || s.kind === "extra") && s.recipe ? [s.recipe.id] : [])),
];

// Routes and devices: which of a recipe's checked routes she follows.

/** The recipe's routes for the apps she uses, her main tool's first. */
export function routesFor(recipe: Recipe, apps: readonly RecipeApp[], tool: ChatTool): RecipeRoute[] {
  const has = new Set(apps);
  const fits = recipe.routes.filter((route) => route.apps.every((app) => has.has(app)));
  const main = (route: RecipeRoute) => (route.apps.includes(tool as RecipeApp) ? 0 : 1);
  return [...fits].sort((a, b) => main(a) - main(b));
}

/** The phone keyboard a route needs, or null when it needs none. */
const phoneOf = (route: RecipeRoute) => route.apps.find((app) => PHONE_APPS.has(app)) ?? null;

/**
 * The route she follows. When the routes that fit differ by phone and she hasn't said which phone she has,
 * `askPhone` is true and there is no route yet. When she has said, only that phone's route counts; with none for
 * her phone, `route` is null and the page says plainly that this workflow has no steps for her phone yet.
 */
export function routeFor(
  recipe: Recipe,
  her: { apps: readonly RecipeApp[]; tool: ChatTool; device: Device | null; phone: Phone | null },
): { route: RecipeRoute | null; askPhone: boolean } {
  const routes = routesFor(recipe, her.apps, her.tool).filter((route) => hasStepsFor(route, her.device));
  const phones = new Set(routes.map(phoneOf).filter(Boolean));
  if (phones.size < 2) return { route: routes[0] ?? null, askPhone: false };
  if (!her.phone) return { route: null, askPhone: true };
  const mine = phoneApp[her.phone];
  return { route: routes.find((route) => phoneOf(route) === mine) ?? null, askPhone: false };
}

/** A step that asks which phone she has before it can show its setup. */
export function asksPhone(step: PathStep, plan: Pick<PathPlan, "apps" | "tool" | "device">): boolean {
  if (step.kind !== "workflow" && step.kind !== "extra") return false;
  const recipe = step.recipe ? recipeById(step.recipe) : undefined;
  return recipe ? routeFor(recipe, { ...plan, phone: null }).askPhone : false;
}

/** The devices whose steps she sees: hers, or both when she uses both or the quiz didn't ask. */
export function devicesFor<T>(steps: { phone?: T[]; computer?: T[] }, device: Device | null): ("phone" | "computer")[] {
  const has = (d: "phone" | "computer") => Boolean(steps[d]?.length);
  if (device === "phone") return has("phone") ? ["phone"] : [];
  if (device === "computer") return has("computer") ? ["computer"] : [];
  return (["computer", "phone"] as const).filter(has);
}

/** A recipe step as lines to follow: a card's steps for that device go in its place, in full. */
export function stepLines(steps: readonly RecipeStep[], device: "phone" | "computer"): string[] {
  return steps.flatMap((step) => {
    if (typeof step === "string") return [step];
    const card = cardById(step.card);
    return card?.steps[device] ?? card?.steps.computer ?? card?.steps.phone ?? [];
  });
}

/** The card behind an opening step, when Tally has one for her tool. */
export const stepCard = (step: ReadyStep | AboutStep): SetupCard | null => (step.card ? cardById(step.card) ?? null : null);

/**
 * A path the page can show: every card and recipe id is a real one, every extra step points back to an earlier
 * workflow with the same recipe, step ids are unique, and it ends with the end step. Also run on saved paths.
 */
export function validPath(plan: PathPlan): boolean {
  const seen = new Map<string, PathStep>();
  for (const step of plan.steps) {
    if (seen.has(step.id)) return false;
    if ((step.kind === "ready" || step.kind === "about") && step.card && !CARD_IDS.includes(step.card)) return false;
    if ((step.kind === "workflow" || step.kind === "extra") && step.recipe && !RECIPE_IDS.includes(step.recipe)) return false;
    if (step.kind === "extra") {
      const first = seen.get(step.sameAs);
      if (!first || first.kind !== "workflow" || first.recipe !== step.recipe) return false;
    }
    seen.set(step.id, step);
  }
  if (!plan.apps.every((app) => (RECIPE_APPS as readonly string[]).includes(app))) return false;
  return plan.steps.at(-1)?.kind === "end";
}

/** The apps her path can count on, from her answers. */
export const pathApps = (who: { places: string[]; device: Device | null; aiTools: AiTool[] }): RecipeApp[] => [...appsOf(who)];

/** Her tool's name, for the step titles. */
export const toolName = (tool: ChatTool) => toolLabels[tool];

/**
 * Her answers and her phone from the events saved on her path, for one plan: every "Did it work?" answer per step
 * in order, and the phone she picked last. Anything that doesn't look like ours is left out.
 */
export function savedFrom(
  events: readonly { name: string; props: Record<string, unknown> }[],
  planId: string,
): { answers: Record<string, PathAnswer[]>; phone: Phone | null } {
  const answers: Record<string, PathAnswer[]> = {};
  let phone: Phone | null = null;
  for (const { name, props } of events) {
    if (props.plan !== planId) continue;
    if (name === "path_answer" && typeof props.step === "string" && (props.answer === "yes" || props.answer === "not_quite"))
      (answers[props.step] ??= []).push(props.answer);
    if (name === "path_phone" && (PHONES as readonly unknown[]).includes(props.phone)) phone = props.phone as Phone;
  }
  return { answers, phone };
}
