import { cardById } from "../lib/beginner/cards";
import type { Who } from "../lib/beginner/levels";
import type { PathPlan, PathStep } from "../lib/beginner/path";
import { recipeById } from "../lib/beginner/recipes";
import type { FreeResult, MapLine, Track } from "../lib/beginner/types";

// The checks behind the Phase 7 readout (docs/DIRECTION.md, Phase 7): each test person's run in
// scripts/persona-runs.ts is held to the "Done when" lines of Phases 5 and 6, and her free workflow design (the
// experiment) is counted. Pure, so tests/persona-checks.test.ts can try every check on made up runs.

export type Check = { id: string; pass: boolean; detail: string };

/** What a run's checks need to know. `expect` names the DIRECTION.md examples a person stands for. */
export type RunForChecks = {
  track: Track;
  who: Who;
  /** How many screens she saw, from stepsFor with her real answers. */
  screens: number;
  free: FreeResult;
  path: PathPlan | null;
  expect?: Expect;
  /** Everything she typed or picked, so a price she gave herself is not flagged. */
  hers?: string;
};

/**
 * The DIRECTION.md examples a person stands for: the dental receptionist and the Gmail Builder from Phase 5's Done
 * when, and a task that must reach a level, like the electrician's quotes (section 2, example 2).
 */
export type Expect = { dentalTop?: boolean; gmailBuilderTop?: boolean; taskLevel?: { task: string; level: number } };

/** Starter and Builder screen limits (DIRECTION.md, Phase 8; they were 9 and 11 in Phase 5). */
export const SCREENS_MAX: Record<Track, number> = { starter: 7, builder: 9 };

/** A With your path line that reads like writing help: asking AI each time, or pasting a prompt. */
export const WRITING_HELP = /\b(ask (ai|claude|chatgpt|it)|paste|prompt|each time|every time|help(s)? you write|writes? it for you)\b/i;
/**
 * Words that point at a menu path or a button, which only checked recipes and cards may give. "Tap the reply" or
 * "menu items" on a restaurant are not click paths, so a tap counts only on a button, icon, key or tab.
 */
export const MENU = /\b([Cc]lick|[Ss]ettings|[Bb]utton|[Tt]oggle)\b|\b[Gg]o to (the )?[A-Z][a-z]+\b|\b([Oo]pen|[Tt]ap|[Ss]elect) the [\w ]{0,15}menu\b|\b[Tt]ap (the|on) [\w ]{0,20}\b(button|icon|key|tab)\b|>|→/;
/**
 * A promise of time: saving it, or a task taking it. Time as content, like opening hours or labor hours, is fine.
 * TIME_PROMISE in lib/beginner/free-result.ts is wider and also catches "HR" (see the Phase 7 readout).
 */
export const PROMISED_TIME = /\b(save[sd]?|saving|takes?|only|under|in|within|back)\s+(you\s+)?(about\s+)?(a|an|one|\d+|few|a few|hours of)?\s*(minutes?|mins?|hours?|hrs|seconds?|secs?)\b/i;
export const DASH = /[–—]| - |\w-\w/;
export const MONEY = /(\d+|\b(five|ten|fifteen|twenty|twenty five|thirty|forty|fifty)) ?(%|per ?cent\b)|\$ ?\d[\d,.]*/i;

/** Prices and percents in a line that she did not give herself, like a 50% deposit from her own example. */
export function moneyNotHers(line: string, hers: string): string[] {
  const own = hers.toLowerCase().replace(/\s+/g, "");
  return [...line.matchAll(new RegExp(MONEY.source, "gi"))].map((m) => m[0]).filter((m) => !own.includes(m.toLowerCase().replace(/\s+/g, "")));
}
const SIGN_UP = /\bsign(ing)? up\b|\bcreate an account\b|\bdownload the app\b/i;

/** Every line the path writer wrote for her, so the copy rules can be checked on it. */
export function pathText(path: PathPlan): string[] {
  return path.steps.flatMap((step: PathStep) => {
    switch (step.kind) {
      case "ready":
        return step.firstStep ? [step.firstStep] : [];
      case "about":
        return [step.note];
      case "workflow":
      case "extra":
        return [step.read, ...step.material.flatMap((m) => [m.label, ...m.items])];
      case "end":
        return [...step.safeUse, ...(step.askMessage ? [step.askMessage] : [])];
    }
  });
}

/** Her tasks with a recipe, the ones without, and the flags the readout must raise. */
export function recipeCount(map: readonly MapLine[]) {
  const aiTasks = map.filter((m) => m.ai);
  const withRecipe = map.filter((m) => m.recipe).map((m) => ({ task: m.task, recipe: m.recipe as string, level: m.level ?? null }));
  const assistant = withRecipe.filter((r) => r.recipe === "saved_assistant").length;
  return {
    total: map.length,
    aiTasks: aiTasks.length,
    withRecipe,
    without: map.filter((m) => !m.recipe).map((m) => ({ task: m.task, level: m.level ?? null, waits: Boolean(m.waits) })),
    noRecipe: withRecipe.length === 0,
    /** More than half of the tasks AI can help with land on the saved assistant. */
    mostlyAssistant: aiTasks.length > 0 && assistant * 2 > aiTasks.length,
  };
}

const check = (id: string, pass: boolean, detail: string): Check => ({ id, pass, detail });

/** Every check for one run. A check that does not apply to her is left out. */
export function runChecks(run: RunForChecks): Check[] {
  const { free, path, who, track } = run;
  const map = free.map;
  const top = map[0];
  const out: Check[] = [];

  out.push(check("screens", run.screens <= SCREENS_MAX[track], `${run.screens} screens, at most ${SCREENS_MAX[track]} for a ${track}`));

  const unlevelled = map.filter((m) => m.level === undefined && !m.waits).map((m) => m.task);
  out.push(check("levels_in_code", unlevelled.length === 0, unlevelled.length ? `No level on ${unlevelled.join(", ")}` : "Every row has a level or waits"));

  const helpLines = map.filter((m) => (m.level ?? 0) >= 3 && WRITING_HELP.test(m.withPath)).map((m) => m.withPath);
  out.push(check("level3_not_writing_help", helpLines.length === 0, helpLines.length ? helpLines.join(" | ") : "No line at level 3 or higher reads like writing help"));

  const recipeLines = map.filter((m) => m.recipe && !m.withPath.toLowerCase().includes(recipeById(m.recipe)?.withPath.slice(1, 30).toLowerCase() ?? "")).map((m) => m.task);
  out.push(check("path_line_from_recipe", recipeLines.length === 0, recipeLines.length ? `Not the recipe's line on ${recipeLines.join(", ")}` : "Every line at level 3 or higher is its recipe's"));

  if (who.canUse !== "self" && who.connect !== "yes") {
    const connected = map.filter((m) => m.recipe && recipeById(m.recipe)?.conditions.connectsApp).map((m) => m.task);
    out.push(check("no_connect_without_ok", connected.length === 0, connected.length ? `Connects an app for ${connected.join(", ")}` : "No row connects a work app"));
  }

  if (who.canUse === "restricted") {
    const bad = map.filter((m) => m.ai && !m.waits && !(m.recipe && !recipeById(m.recipe)?.conditions.needsAiAllowed)).map((m) => m.task);
    out.push(check("restricted_waits", bad.length === 0, bad.length ? `Needs AI but does not wait: ${bad.join(", ")}` : "Every AI task waits or needs no AI at work"));
  }

  if (who.canUse === "not_sure") {
    const missing = map.filter((m) => (m.level ?? 0) >= 2 && !m.askFirst).map((m) => m.task);
    out.push(check("not_sure_ask_first", missing.length === 0, missing.length ? `No ask first line on ${missing.join(", ")}` : "Every task AI touches says to ask first"));
  }

  if (run.expect?.dentalTop)
    out.push(check("dental_top_level_3", top?.level === 3 && !recipeById(top.recipe ?? "")?.conditions.connectsApp, `Top task ${top?.task} at level ${top?.level ?? "none"} with ${top?.recipe ?? "no recipe"}`));
  if (run.expect?.gmailBuilderTop)
    out.push(check("gmail_builder_top_level_4", (top?.level ?? 0) >= 4, `Top task ${top?.task} at level ${top?.level ?? "none"} with ${top?.recipe ?? "no recipe"}`));

  if (run.expect?.taskLevel) {
    const { task, level } = run.expect.taskLevel;
    const m = map.find((x) => x.task.toLowerCase().includes(task));
    out.push(check(`${task.replace(/\W+/g, "_")}_level_${level}`, (m?.level ?? 0) >= level, m ? `${m.task} at level ${m.level ?? "none"}${m.held ? `, held: ${m.held}` : ""}` : `No task named ${task} on her map`));
  }

  if (free.askOnly) {
    out.push(check("ask_only_no_path", path === null, "Every task waits: no offer, no path, only the message to ask"));
    return out;
  }
  out.push(check("path_written", path !== null, path ? `${path.steps.length} steps` : "The path writer failed three times"));
  if (!path) return out;

  if (track === "builder") {
    const ready = path.steps.some((s) => s.kind === "ready");
    const signUp = pathText(path).filter((l) => SIGN_UP.test(l));
    out.push(check("builder_no_sign_up", !ready && signUp.length === 0, ready ? "Has a get ready step" : signUp.length ? signUp.join(" | ") : "No sign up step or line"));
  }

  const workflows = path.steps.filter((s) => s.kind === "workflow" || s.kind === "extra");
  const partsMissing = workflows.filter((s) => {
    const recipe = s.recipe ? recipeById(s.recipe) : null;
    if (s.recipe && !recipe) return true;
    return recipe ? !recipe.test.tryOn || !recipe.approval || !recipe.cost.note : false; // no recipe: pathCopy.withAi gives all three
  });
  out.push(check("workflow_parts", partsMissing.length === 0, partsMissing.length ? `Missing a test, approval point or cost on ${partsMissing.map((s) => s.id).join(", ")}` : `${workflows.length} workflows, each with a test, an approval point and a cost line`));

  const sources = path.steps.flatMap((s) => {
    if (s.kind === "ready" || s.kind === "about") return [s.card ? `card ${s.card}` : "no card for her tool"];
    if (s.kind === "workflow" || s.kind === "extra") return [s.recipe ? `recipe ${s.recipe}` : "Tally's own steps for writing with AI"];
    return [];
  });
  const unknown = path.steps.filter((s) => (s.kind === "ready" || s.kind === "about") && s.card && !cardById(s.card));
  out.push(check("setup_from_recipe_or_card", unknown.length === 0, sources.join(", ")));

  const text = pathText(path);
  const menu = text.filter((l) => MENU.test(l));
  out.push(check("no_click_paths_from_model", menu.length === 0, menu.length ? menu.map((l) => l.slice(0, 120)).join(" | ") : "The model wrote no menu paths or button names"));
  const rules = text.filter((l) => DASH.test(l) || PROMISED_TIME.test(l) || moneyNotHers(l, run.hers ?? "").length > 0);
  out.push(check("copy_rules", rules.length === 0, rules.length ? rules.map((l) => l.slice(0, 120)).join(" | ") : "No dashes, promised times, prices or percents"));

  const named = free.setups.filter((s) => workflows.some((w) => w.title === s));
  const offered = free.setups.length - (who.canUse === "restricted" ? 1 : 0);
  out.push(check("offer_matches_path", named.length === offered && workflows.length === offered, `Offer names ${offered}, path has ${workflows.length} workflows, ${named.length} match by name`));
  return out;
}

// The experiment: a workflow designed freely for her top two tasks, with no fixed list of task kinds.

export type DesignStep = { app: string | null; ref: string | null; goal: string };
export type DesignTask = {
  task: string;
  today: string;
  newWay: string;
  steps: DesignStep[];
  material: { label: string; what: string }[];
  checkPoint: string;
};

/** A step is checked only when it points at a real card or recipe. One in an app without a real id is not checked by us. */
export const refKind = (ref: string | null): "card" | "recipe" | null =>
  !ref ? null : cardById(ref) ? "card" : recipeById(ref) ? "recipe" : null;

export function countDesign(tasks: readonly DesignTask[]) {
  const steps = tasks.flatMap((t) => t.steps);
  const unchecked = steps.filter((s) => s.app && !refKind(s.ref));
  const badRefs = steps.filter((s) => s.ref && !refKind(s.ref)).map((s) => s.ref as string);
  const clickPaths = unchecked.filter((s) => MENU.test(s.goal)).map((s) => s.goal);
  const apps = new Map<string, number>();
  for (const s of unchecked) {
    const app = appName(s.app as string);
    apps.set(app, (apps.get(app) ?? 0) + 1);
  }
  return {
    steps: steps.length,
    checked: steps.filter((s) => refKind(s.ref)).length,
    unchecked: unchecked.length,
    noApp: steps.filter((s) => !s.app && !refKind(s.ref)).length,
    badRefs,
    clickPaths,
    apps: [...apps.entries()].sort((a, b) => b[1] - a[1]),
    refs: [...new Set(steps.map((s) => s.ref).filter((r): r is string => Boolean(refKind(r))))],
  };
}

/** One spelling per app, so Google Calendar and google calendar count once. */
export const appName = (app: string) => {
  const t = app.trim().replace(/\s+/g, " ");
  return t.charAt(0).toUpperCase() + t.slice(1);
};

/** How alike two sets are, from 0 (nothing shared) to 1 (the same). */
export function jaccard<T>(a: Iterable<T>, b: Iterable<T>): number {
  const x = new Set(a);
  const y = new Set(b);
  const union = new Set([...x, ...y]);
  if (!union.size) return 1;
  let both = 0;
  for (const v of x) if (y.has(v)) both++;
  return both / union.size;
}

/** The words of a text, lower case, without the most common ones, for comparing two paths. */
export function contentWords(lines: readonly string[]): Set<string> {
  const stop = new Set("the a an and or to of in on for with your you it is this that be as at by from it’s its so when what each one".split(" "));
  return new Set(lines.join(" ").toLowerCase().match(/[a-z’']+/g)?.filter((w) => w.length > 2 && !stop.has(w)) ?? []);
}

// The experiment, second round: a workflow for every task on her map, with the vendor's help page for every
// feature a step relies on that no card or recipe covers.

export type Design2Step = { app: string | null; ref: string | null; feature: string | null; goal: string; clickPath: string | null };
export type Design2Task = {
  task: string;
  stays: boolean;
  today: string;
  newWay: string;
  steps: Design2Step[];
  material: { label: string; what: string }[];
  checkPoint: string;
};
/** The vendor's help page for one feature, or null with the reason. */
export type Lookup = { app: string; feature: string; url: string | null; title: string | null; why?: string };

export const featureKey = (app: string, feature: string) => `${appName(app).toLowerCase()}|${feature.trim().toLowerCase()}`;

/**
 * The vendors' own sites, by a word in the app's name. A help page counts only on one of these hosts or a
 * subdomain of one. An app not listed here can never get a link, so its steps say none found.
 */
export const VENDOR_SITES: [RegExp, string[]][] = [
  [/canva/i, ["canva.com"]],
  [/outlook|excel|word|teams|microsoft|copilot|onedrive|sharepoint|bookings|power automate|planner/i, ["microsoft.com"]],
  [/shopify/i, ["shopify.com"]],
  [/klaviyo/i, ["klaviyo.com"]],
  [/gorgias/i, ["gorgias.com"]],
  [/notion/i, ["notion.com", "notion.so"]],
  [/later\b/i, ["later.com"]],
  [/slack/i, ["slack.com"]],
  [/gmail|google|sheets|calendar|gemini|drive|docs|gboard/i, ["google.com"]],
  [/instagram|facebook|meta/i, ["facebook.com", "instagram.com", "meta.com"]],
  [/tiktok/i, ["tiktok.com"]],
  [/chatgpt|openai/i, ["openai.com", "chatgpt.com"]],
  [/claude|anthropic/i, ["claude.com", "anthropic.com"]],
  [/square/i, ["squareup.com", "square.site"]],
  [/iphone|ios|apple/i, ["apple.com"]],
  [/samsung/i, ["samsung.com"]],
  [/workday/i, ["workday.com"]],
  [/bamboo/i, ["bamboohr.com"]],
];

/** The URL sits on the app vendor's own site. */
export function vendorOk(app: string, url: string): boolean {
  let host: string;
  try {
    host = new URL(url).hostname.toLowerCase();
  } catch {
    return false;
  }
  const sites = VENDOR_SITES.filter(([word]) => word.test(app)).flatMap(([, s]) => s);
  return sites.some((site) => host === site || host.endsWith(`.${site}`));
}

/** The model's answer held to the rules: a link from the search results, on the vendor's own site, or none. */
export function checkLookup(app: string, feature: string, found: { url: string | null; title: string | null }, searched: readonly string[]): Lookup {
  if (!found.url) return { app, feature, url: null, title: null, why: searched.length ? "no vendor page in the results" : "no results" };
  const clean = (u: string) => u.replace(/[#?].*$/, "").replace(/\/$/, "");
  if (!searched.some((u) => clean(u) === clean(found.url as string))) return { app, feature, url: null, title: null, why: "the link was not in the search results" };
  if (!vendorOk(app, found.url)) return { app, feature, url: null, title: null, why: `the link was not on ${appName(app)}'s own site` };
  return { app, feature, url: found.url, title: found.title };
}

export function countDesign2(tasks: readonly Design2Task[], links: Record<string, Lookup>, map: readonly MapLine[]) {
  const steps = tasks.flatMap((t) => t.steps);
  const unchecked = steps.filter((s) => s.app && !refKind(s.ref));
  const linked = unchecked.filter((s) => s.feature && links[featureKey(s.app as string, s.feature)]?.url);
  const apps = new Map<string, { steps: number; linked: number }>();
  for (const s of unchecked) {
    const a = apps.get(appName(s.app as string)) ?? { steps: 0, linked: 0 };
    a.steps++;
    if (s.feature && links[featureKey(s.app as string, s.feature)]?.url) a.linked++;
    apps.set(appName(s.app as string), a);
  }
  const low = map.filter((m) => m.level === 1 || m.level === 2);
  const designed = (task: string) => tasks.find((t) => t.task.toLowerCase() === task.toLowerCase());
  return {
    tasks: tasks.length,
    stays: tasks.filter((t) => t.stays).length,
    steps: steps.length,
    checked: steps.filter((s) => refKind(s.ref)).length,
    unchecked: unchecked.length,
    linked: linked.length,
    noApp: steps.filter((s) => !s.app && !refKind(s.ref)).length,
    /** Unchecked steps with no feature named: the rules asked for one on every such step. */
    noFeature: unchecked.filter((s) => !s.feature).length,
    /** Click words in a goal, which must hold none. */
    clickInGoal: steps.filter((s) => MENU.test(s.goal)).map((s) => s.goal),
    /** Click paths the model gave with no vendor page found: shown nowhere. */
    clickPathsHidden: unchecked.filter((s) => s.clickPath && !(s.feature && links[featureKey(s.app as string, s.feature)]?.url)).length,
    apps: [...apps.entries()].sort((a, b) => b[1].steps - a[1].steps),
    /** Tasks the product left at level 1 or 2, and what the design made of each. */
    lowTasks: low.map((m) => {
      const t = designed(m.task);
      return { task: m.task, level: m.level, designed: Boolean(t), stays: t?.stays ?? null, steps: t?.steps.length ?? 0, unchecked: t ? t.steps.filter((s) => s.app && !refKind(s.ref)).length : 0 };
    }),
    missingTasks: map.filter((m) => !designed(m.task)).map((m) => m.task),
  };
}

// The experiment, third round (Karl, 2026-11-15): her job read as responsibilities, each matched to the ten
// patterns below and given the simplest workflow that removes the repeated work, then her free map and her paid
// path for the top two, as she would see them.

/** The ten patterns a responsibility can match, numbered as in Karl's brief. */
// The ten patterns now live in the product (lib/beginner/patterns.ts, Phase 8).
export { PATTERNS, type PatternId } from "../lib/beginner/patterns";
import { PATTERNS } from "../lib/beginner/patterns";

export type Responsibility = {
  name: string;
  /** The work done with her hands, or null when there is none. */
  handsOn: string | null;
  /** The tracking, deciding, ordering or repeating around it. */
  around: string;
  patterns: number[];
  stays: boolean;
  level: number;
  /** Why the level is not higher, in a few words, or null. */
  held: string | null;
  today: string;
  /** The "With your path" line on her map. */
  withPath: string;
  /** The workflow as her offer would name it. */
  offerName: string;
  newWay: string;
  /** What AI builds once for her, like a tracker or a checklist, or null. */
  builtOnce: string | null;
  steps: Design2Step[];
  material: { label: string; what: string }[];
  checkPoint: string;
};
export type Design3 = { responsibilities: Responsibility[]; top: { name: string; why: string }[] };

/** Her two top workflows as the paid path shows them, written by the model; steps and costs come from the design. */
export type Screens3 = {
  seeIt: { task: string; intro: string; result: string };
  askMessage: string | null;
  workflows: {
    name: string;
    read: string;
    material: { label: string; items: string[] }[];
    test: { tryOn: string; good: string; fixes: string[] };
    approval: string;
    ifStops: string;
  }[];
  safeUse: string[];
};

/** Every line the model wrote in experiment three, for the copy rules. */
export function design3Text(d: Design3, s: Screens3 | null): string[] {
  const fromDesign = d.responsibilities.flatMap((r) => [r.today, r.withPath, r.offerName, r.newWay, r.held ?? "", r.builtOnce ?? "", r.checkPoint, ...r.steps.map((x) => x.goal), ...r.material.flatMap((m) => [m.label, m.what])]);
  const fromScreens = s
    ? [s.seeIt.intro, s.seeIt.result, s.askMessage ?? "", ...s.safeUse, ...s.workflows.flatMap((w) => [w.read, w.approval, w.ifStops, w.test.tryOn, w.test.good, ...w.test.fixes, ...w.material.flatMap((m) => [m.label, ...m.items])])]
    : [];
  return [...fromDesign, ...fromScreens].filter(Boolean);
}

/** A line that starts with a dash, like a bullet in an order email: DASH misses it. */
export const LINE_DASH = /^\s*[-–—]\s/m;

/** Connecting an app. "Link" counts only as a verb, so a [link] blank in a message is not flagged. */
const CONNECT_WORDS = /\b(connect|link (your|her|it|the|to)|sign in with|give .{0,20}access to)\b/i;

/** Every check for experiment three. */
export function checks3(input: { d: Design3; s: Screens3 | null; links: Record<string, Lookup>; track: Track; who: Pick<Who, "canUse" | "connect">; hers?: string }): Check[] {
  const { d, s, links, track, who } = input;
  const rs = d.responsibilities;
  const out: Check[] = [];

  const badPatterns = rs.filter((r) => !r.patterns.length || r.patterns.some((p) => !(p in PATTERNS))).map((r) => r.name);
  out.push(check("three_patterns", badPatterns.length === 0, badPatterns.length ? `No pattern or one outside 1 to 10 on ${badPatterns.join(", ")}` : `${rs.length} responsibilities, each with patterns from the ten`));

  const steps = rs.flatMap((r) => r.steps);
  const badRefs = steps.filter((x) => x.ref && !refKind(x.ref)).map((x) => x.ref as string);
  out.push(check("three_refs_real", badRefs.length === 0, badRefs.length ? `Unknown ids ${badRefs.join(", ")}` : "Every card and recipe id exists"));

  const offSite = Object.values(links).filter((l) => l.url && !vendorOk(l.app, l.url)).map((l) => l.url as string);
  out.push(check("three_links_vendor", offSite.length === 0, offSite.length ? offSite.join(" | ") : "Every link is on the vendor's own site"));

  const noFeature = steps.filter((x) => x.app && !refKind(x.ref) && !x.feature).map((x) => x.goal);
  out.push(check("three_feature_named", noFeature.length === 0, noFeature.length ? noFeature.map((g) => g.slice(0, 100)).join(" | ") : "Every unchecked app step names its feature"));

  const proseLines = [...rs.flatMap((r) => [r.withPath, r.newWay, r.checkPoint, ...r.steps.map((x) => x.goal)]), ...(s ? s.workflows.flatMap((w) => [w.read, w.approval, w.ifStops]) : [])];
  const menu = proseLines.filter((l) => MENU.test(l));
  out.push(check("three_no_click_without_link", menu.length === 0, menu.length ? menu.map((l) => l.slice(0, 120)).join(" | ") : "No menu path or button name outside a linked click path"));

  const noApproval = rs.filter((r) => !r.stays && !r.checkPoint.trim()).map((r) => r.name);
  const topNoApproval = s ? s.workflows.filter((w) => !w.approval.trim()).map((w) => w.name) : [];
  out.push(check("three_approval", noApproval.length + topNoApproval.length === 0, noApproval.length + topNoApproval.length ? `No approval point on ${[...noApproval, ...topNoApproval].join(", ")}` : "Every workflow has a point where she checks"));

  const text = design3Text(d, s);
  const rules = text.filter((l) => DASH.test(l) || LINE_DASH.test(l) || PROMISED_TIME.test(l) || moneyNotHers(l, input.hers ?? "").length > 0);
  out.push(check("three_copy_rules", rules.length === 0, rules.length ? rules.map((l) => l.slice(0, 120)).join(" | ") : "No dashes, promised times, prices or percents"));

  const levelOff = rs.filter((r) => r.level < 1 || r.level > 5 || (r.stays !== (r.level === 1))).map((r) => `${r.name} (${r.level}${r.stays ? ", stays" : ""})`);
  out.push(check("three_levels", levelOff.length === 0, levelOff.length ? `Level and stays disagree on ${levelOff.join(", ")}` : "Every level is 1 to 5, and level 1 means it stays hers"));

  if (track === "starter") {
    const high = rs.filter((r) => r.level > 3).map((r) => `${r.name} (${r.level})`);
    out.push(check("three_starter_level", high.length === 0, high.length ? `Above level 3 for a Starter: ${high.join(", ")}` : "Every level is 3 or lower for a Starter"));
  }

  const helpLines = rs.filter((r) => r.level >= 3 && WRITING_HELP.test(r.withPath)).map((r) => r.withPath);
  out.push(check("three_not_writing_help", helpLines.length === 0, helpLines.length ? helpLines.join(" | ") : "No map line at level 3 or higher reads like writing help"));

  if (who.canUse !== "self" && who.connect !== "yes") {
    const connects = steps.filter((x) => (x.ref && recipeById(x.ref)?.conditions.connectsApp) || CONNECT_WORDS.test(`${x.feature ?? ""} ${x.goal}`)).map((x) => x.goal);
    out.push(check("three_no_connect", connects.length === 0, connects.length ? connects.map((g) => g.slice(0, 100)).join(" | ") : "No step connects a work app"));
  }

  if (who.canUse === "not_sure") out.push(check("three_ask_first", Boolean(s?.askMessage?.trim()), s?.askMessage ? "Her path opens with the message to ask what is allowed" : "No message to ask what is allowed"));

  const names = new Set(rs.filter((r) => !r.stays).map((r) => r.name));
  const topOk = d.top.length === 2 && d.top.every((t) => names.has(t.name)) && (!s || s.workflows.length === 2);
  out.push(check("three_top_two", topOk, `Top: ${d.top.map((t) => t.name).join(", ") || "none"}${s ? `; ${s.workflows.length} workflows on her path` : ""}`));
  return out;
}

/** Counts for experiment three. */
export function countDesign3(d: Design3, links: Record<string, Lookup>) {
  const rs = d.responsibilities;
  const steps = rs.flatMap((r) => r.steps);
  const unchecked = steps.filter((x) => x.app && !refKind(x.ref));
  const linked = unchecked.filter((x) => x.feature && links[featureKey(x.app as string, x.feature)]?.url);
  const patterns: Record<string, number> = {};
  for (const r of rs) for (const p of r.patterns) patterns[p] = (patterns[p] ?? 0) + 1;
  const levels: Record<string, number> = {};
  for (const r of rs) levels[r.level] = (levels[r.level] ?? 0) + 1;
  const apps = new Map<string, { steps: number; linked: number }>();
  for (const x of unchecked) {
    const a = apps.get(appName(x.app as string)) ?? { steps: 0, linked: 0 };
    a.steps++;
    if (x.feature && links[featureKey(x.app as string, x.feature)]?.url) a.linked++;
    apps.set(appName(x.app as string), a);
  }
  return {
    responsibilities: rs.length,
    stays: rs.filter((r) => r.stays).length,
    builtOnce: rs.filter((r) => r.builtOnce).length,
    patterns,
    levels,
    steps: steps.length,
    checked: steps.filter((x) => refKind(x.ref)).length,
    unchecked: unchecked.length,
    linked: linked.length,
    noApp: steps.filter((x) => !x.app && !refKind(x.ref)).length,
    clickPathsShown: unchecked.filter((x) => x.clickPath && x.feature && links[featureKey(x.app as string, x.feature)]?.url).length,
    clickPathsHidden: unchecked.filter((x) => x.clickPath && !(x.feature && links[featureKey(x.app as string, x.feature)]?.url)).length,
    apps: [...apps.entries()].sort((a, b) => b[1].steps - a[1].steps),
    refs: [...new Set(steps.map((x) => x.ref).filter((r): r is string => Boolean(refKind(r))))],
  };
}
