import test from "node:test";
import assert from "node:assert/strict";
import type { Who } from "../lib/beginner/levels";
import type { EndStep, PathPlan, WorkflowStep } from "../lib/beginner/path";
import type { FreeResult, MapLine } from "../lib/beginner/types";
import { moneyNotHers, MONEY, checkLookup, contentWords, countDesign, countDesign2, featureKey, jaccard, MENU, PROMISED_TIME, recipeCount, refKind, runChecks, vendorOk, WRITING_HELP } from "../scripts/persona-checks";

const row = (task: string, opts: Partial<MapLine> = {}): MapLine => ({
  task,
  phrase: task.toLowerCase(),
  today: "Today.",
  withPath: "For your texts, your common replies are saved on your phone, each a few letters away.",
  ai: true,
  private: false,
  level: 3,
  recipe: "phone_quick_replies",
  ...opts,
});

const who = (opts: Partial<Who> = {}): Who => ({ track: "starter", canUse: "self", connect: null, places: [], device: "phone", aiTools: ["none_yet"], ...opts });

const free = (map: MapLine[], opts: Partial<FreeResult> = {}): FreeResult => ({
  firstWin: { task: map[0].task, intro: "", draft: "" },
  firstStep: "",
  map,
  setups: ["Your texts, saved once on your phone"],
  prep: [],
  freePlan: true,
  tool: "claude",
  track: "starter",
  ...opts,
});

const path = (steps: PathPlan["steps"], track: PathPlan["track"] = "starter"): PathPlan => ({
  version: 3, role: "", track, tool: "claude", worksFor: "self", policy: null, device: "phone", apps: [], skipped: [], steps,
});

const workflow: WorkflowStep = { id: "task_1", kind: "workflow", task: "Texts", title: "Your texts, saved once on your phone", recipe: "phone_quick_replies", read: "Your replies sit on your keyboard.", material: [{ label: "Replies", items: ["Hi [name]."] }] };
const end: EndStep = { id: "end", kind: "end", safeUse: ["Read every reply before you send it."], askMessage: null };

const failed = (checks: ReturnType<typeof runChecks>) => checks.filter((c) => !c.pass).map((c) => c.id);

test("a clean run passes every check", () => {
  const checks = runChecks({ track: "starter", who: who(), screens: 9, free: free([row("Texts")]), path: path([workflow, end]) });
  assert.deepEqual(failed(checks), []);
});

test("too many screens, writing help at level 3 and a missing path all fail", () => {
  const map = [row("Texts", { withPath: "Paste a prompt into Claude each time." })];
  const checks = runChecks({ track: "starter", who: who(), screens: 10, free: free(map), path: null });
  assert.deepEqual(failed(checks).sort(), ["level3_not_writing_help", "path_line_from_recipe", "path_written", "screens"]);
});

test("an employee who may not connect never gets a recipe that connects an app", () => {
  const map = [row("Follow ups", { recipe: "gmail_claude_follow_ups", level: 4, withPath: "x" })];
  const checks = runChecks({ track: "builder", who: who({ canUse: "yes", connect: "no", track: "builder" }), screens: 11, free: free(map), path: null });
  assert.ok(failed(checks).includes("no_connect_without_ok"));
});

test("a Builder path with a get ready step or a sign up line fails", () => {
  const ready = { id: "ready", kind: "ready", card: "claude_get_started", firstStep: null } as const;
  const checks = runChecks({ track: "builder", who: who({ track: "builder" }), screens: 11, free: free([row("Texts")]), path: path([ready, workflow, end], "builder") });
  assert.ok(failed(checks).includes("builder_no_sign_up"));
});

test("menu words, dashes and promised minutes in the model's text are caught", () => {
  const bad = { ...workflow, read: "Go to Settings and click Save. It takes 5 minutes — easy." };
  const checks = runChecks({ track: "starter", who: who(), screens: 9, free: free([row("Texts")]), path: path([bad, end]) });
  assert.deepEqual(failed(checks).sort(), ["copy_rules", "no_click_paths_from_model"]);
});

test("every task waiting means no path, and that passes", () => {
  const map = [row("Notes", { level: null, waits: true, recipe: null, withPath: "Waits." })];
  const checks = runChecks({ track: "starter", who: who({ canUse: "restricted" }), screens: 8, free: free(map, { askOnly: true, setups: [] }), path: null });
  assert.deepEqual(failed(checks), []);
  assert.ok(checks.some((c) => c.id === "ask_only_no_path"));
});

test("recipeCount flags no recipe at all, and most tasks on the saved assistant", () => {
  assert.equal(recipeCount([row("A", { recipe: null, level: 2 })]).noRecipe, true);
  const assistant = recipeCount([row("A", { recipe: "saved_assistant" }), row("B", { recipe: "saved_assistant" }), row("C", { recipe: null, level: 2 })]);
  assert.equal(assistant.mostlyAssistant, true);
  assert.equal(assistant.withRecipe.length, 2);
});

test("a design step is checked only with a real card or recipe id, and unchecked click paths are caught", () => {
  assert.equal(refKind("claude_project"), "card");
  assert.equal(refKind("gmail_templates"), "recipe");
  assert.equal(refKind("canva_magic"), null);
  const count = countDesign([
    {
      task: "Posts", today: "", newWay: "", material: [], checkPoint: "",
      steps: [
        { app: "Claude", ref: "claude_project", goal: "Make a project." },
        { app: "Canva", ref: null, goal: "Make a brand kit." },
        { app: "canva", ref: "canva_magic", goal: "Click Settings, then Brand." },
        { app: null, ref: null, goal: "Pick ten posts." },
      ],
    },
  ]);
  assert.equal(count.checked, 1);
  assert.equal(count.unchecked, 2);
  assert.equal(count.noApp, 1);
  assert.deepEqual(count.badRefs, ["canva_magic"]);
  assert.equal(count.clickPaths.length, 1);
  assert.deepEqual(count.apps, [["Canva", 2]]);
});

test("jaccard and contentWords measure how alike two paths are", () => {
  assert.equal(jaccard(["a", "b"], ["a", "b"]), 1);
  assert.equal(jaccard(["a"], ["b"]), 0);
  assert.ok(contentWords(["Your replies are saved on your phone"]).has("replies"));
  assert.ok(!contentWords(["the and your"]).size);
  assert.ok(WRITING_HELP.test("Ask Claude each time"));
});

test("time as content and food menus are not flagged, promises and click paths are", () => {
  assert.ok(!PROMISED_TIME.test("Never invent prices or opening hours. Reach out to HR. Check every labor hour."));
  assert.ok(PROMISED_TIME.test("This saves you hours every week."));
  assert.ok(PROMISED_TIME.test("It takes 5 minutes."));
  assert.ok(!MENU.test("Never add menu items. You type a shortcut and tap the reply."));
  assert.ok(!MENU.test("Tell the client the menu choices are due. Tell us your go to workout outfit."));
  assert.ok(MENU.test("Tap the share icon."));
  assert.ok(MENU.test("Open the side menu, then Projects."));
  assert.ok(MENU.test("Go to Settings."));
});

test("a task named in Expect must reach its level", () => {
  const map = [row("Writing quotes", { level: 2, recipe: null, held: "needs_computer", withPath: "Quotes, written with AI." })];
  const checks = runChecks({ track: "starter", who: who(), screens: 9, free: free(map), path: null, expect: { taskLevel: { task: "quote", level: 3 } } });
  const c = checks.find((x) => x.id === "quote_level_3");
  assert.equal(c?.pass, false);
  assert.match(c?.detail ?? "", /needs_computer/);
});

test("someone who is Not sure needs the ask first line on every task AI touches", () => {
  const map = [row("Texts", { askFirst: true }), row("Notes", { level: 2, recipe: null, withPath: "Notes, written with AI.", askFirst: false })];
  const checks = runChecks({ track: "starter", who: who({ canUse: "not_sure" }), screens: 9, free: free(map), path: null });
  assert.equal(checks.find((c) => c.id === "not_sure_ask_first")?.pass, false);
});

test("a vendor link counts only from the search results and on the vendor's own site", () => {
  const searched = ["https://www.canva.com/help/magic-write/", "https://someblog.com/canva-tips"];
  assert.equal(checkLookup("Canva", "Magic Write", { url: "https://www.canva.com/help/magic-write/", title: "Magic Write" }, searched).url, "https://www.canva.com/help/magic-write/");
  assert.equal(checkLookup("Canva", "Magic Write", { url: "https://someblog.com/canva-tips", title: "" }, searched).url, null);
  assert.equal(checkLookup("Canva", "Magic Write", { url: "https://www.canva.com/help/other/", title: "" }, searched).url, null);
  assert.ok(vendorOk("Outlook", "https://support.microsoft.com/en-us/office/quick-parts"));
  assert.ok(!vendorOk("Outlook", "https://microsoft.com.evil.net/x"));
  assert.ok(!vendorOk("Some HR system", "https://example.com/help"));
});

test("countDesign2 counts unchecked steps, linked ones and what became of tasks left at level 1 or 2", () => {
  const map = [row("Policy questions", { level: 2, recipe: null, withPath: "x" }), row("Texts")];
  const tasks = [
    {
      task: "Policy questions", stays: false, today: "", newWay: "", material: [], checkPoint: "",
      steps: [
        { app: "Outlook", ref: null, feature: "Quick Parts", goal: "Save each answer once.", clickPath: "Insert, then Quick Parts" },
        { app: "Excel", ref: null, feature: "Copilot", goal: "Keep the list.", clickPath: "Home, then Copilot" },
        { app: null, ref: null, feature: null, goal: "Pick ten questions.", clickPath: null },
      ],
    },
  ];
  const links = { [featureKey("Outlook", "Quick Parts")]: { app: "Outlook", feature: "Quick Parts", url: "https://support.microsoft.com/x", title: "Quick Parts" } };
  const c = countDesign2(tasks, links, map);
  assert.deepEqual([c.unchecked, c.linked, c.noApp, c.clickPathsHidden], [2, 1, 1, 1]);
  assert.deepEqual(c.missingTasks, ["Texts"]);
  assert.equal(c.lowTasks[0].unchecked, 2);
});

test("a price she gave herself is not flagged, an invented one is", () => {
  assert.deepEqual(moneyNotHers("Good for 30 days, 50% deposit to book.", "Quote... Good for 30 days, 50% deposit to book."), []);
  assert.deepEqual(moneyNotHers("A 20% discount and $40 off.", "Quote... 50% deposit"), ["20%", "$40"]);
});

test("the word percent alone is not a price, a figure with it is", () => {
  assert.ok(!MONEY.test("Say the deposit amount or percent each time."));
  assert.ok(MONEY.test("Take twenty percent off."));
  assert.ok(MONEY.test("A 10% deposit."));
  assert.ok(MONEY.test("It costs $40."));
});

// Experiment three: her job as responsibilities, with the ten patterns.

import { checks3, countDesign3, LINE_DASH, type Design3, type Responsibility, type Screens3 } from "../scripts/persona-checks";

const resp = (name: string, opts: Partial<Responsibility> = {}): Responsibility => ({
  name,
  handsOn: "You restock the fridges.",
  around: "You count what is left and decide what to order.",
  patterns: [3, 4],
  stays: false,
  level: 3,
  held: null,
  today: "You count by eye and order when it looks low.",
  withPath: "Your restock runs from one tracker with the usual amounts.",
  offerName: "Your fridge restock, from one tracker",
  newWay: "You fill in a short count and the tracker shows what to order.",
  builtOnce: "a restock tracker",
  steps: [
    { app: null, ref: null, feature: null, goal: "Ask your manager what is allowed.", clickPath: null },
    { app: "Microsoft Excel", ref: null, feature: "Excel conditional formatting", goal: "Make low counts stand out.", clickPath: "Home, then Conditional Formatting" },
  ],
  material: [{ label: "Tracker columns", what: "Item, usual amount, count today." }],
  checkPoint: "You read the order before it goes to the supplier.",
  ...opts,
});

const design3 = (rs: Responsibility[], top = rs.slice(0, 2).map((r) => ({ name: r.name, why: "It repeats every week." }))): Design3 => ({ responsibilities: rs, top });

const screens3 = (opts: Partial<Screens3> = {}): Screens3 => ({
  seeIt: { task: "Restocking", intro: "Here is your order.", result: "Sparkling water [amount]" },
  askMessage: "Could I use an AI tool to build our restock tracker? Nothing about people goes in.",
  workflows: [0, 1].map((i) => ({ name: `W${i}`, read: "You count, the tracker says what to order.", material: [{ label: "Columns", items: ["Item"] }], test: { tryOn: "Three weeks.", good: "It matches.", fixes: ["a", "b", "c"] }, approval: "You read the order first.", ifStops: "Count by hand that week." })),
  safeUse: ["Keep names out of AI tools."],
  ...opts,
});

const excelLink = { "microsoft excel|excel conditional formatting": { app: "Microsoft Excel", feature: "Excel conditional formatting", url: "https://support.microsoft.com/en-us/office/use-conditional-formatting", title: "Use conditional formatting" } };
const failed3 = (c: ReturnType<typeof checks3>) => c.filter((x) => !x.pass).map((x) => x.id);
const notSure = { canUse: "not_sure" as const, connect: "not_sure" as const };

test("a clean experiment three design passes every check", () => {
  const c = checks3({ d: design3([resp("Restocking"), resp("Lunch")]), s: screens3(), links: excelLink, track: "starter", who: notSure });
  assert.deepEqual(failed3(c), []);
});

test("a pattern outside the ten, an unknown id, a missing feature and an off site link all fail", () => {
  const bad = resp("Plants", { patterns: [11], steps: [{ app: "Microsoft Excel", ref: "made_up", feature: null, goal: "Track watering.", clickPath: null }] });
  const c = checks3({ d: design3([resp("Restocking"), bad]), s: screens3(), links: { x: { app: "Microsoft Excel", feature: "f", url: "https://someblog.com/excel", title: "t" } }, track: "starter", who: notSure });
  assert.deepEqual(failed3(c).sort(), ["three_feature_named", "three_links_vendor", "three_patterns", "three_refs_real"]);
});

test("a Starter above level 3, a level 1 that does not stay, and writing help on the map fail", () => {
  const c = checks3({
    d: design3([resp("Restocking", { level: 4 }), resp("Lunch", { withPath: "You ask AI each time for the menu." }), resp("Plants", { level: 1 })]),
    s: screens3(), links: excelLink, track: "starter", who: notSure,
  });
  assert.deepEqual(failed3(c).sort(), ["three_levels", "three_not_writing_help", "three_starter_level"]);
});

test("menu words outside a click path, a dash, a missing approval and a connected app fail", () => {
  const c = checks3({
    d: design3([
      resp("Restocking", { newWay: "Click Settings and pick a list.", checkPoint: "" }),
      resp("Lunch", { today: "Lunch for 70 people - every day.", steps: [{ app: "Microsoft Outlook", ref: null, feature: "Copilot in Outlook", goal: "Connect your inbox to Copilot.", clickPath: null }] }),
    ]),
    s: screens3(), links: excelLink, track: "starter", who: notSure,
  });
  assert.deepEqual(failed3(c).sort(), ["three_approval", "three_copy_rules", "three_no_click_without_link", "three_no_connect"]);
});

test("someone not sure needs the message to ask, and the top two must be real workflows", () => {
  const rs = [resp("Restocking"), resp("Lunch"), resp("Cleaning", { stays: true, level: 1, steps: [], material: [] })];
  const c = checks3({ d: design3(rs, [{ name: "Restocking", why: "" }, { name: "Cleaning", why: "" }]), s: screens3({ askMessage: null }), links: excelLink, track: "starter", who: notSure });
  assert.deepEqual(failed3(c).sort(), ["three_ask_first", "three_top_two"]);
});

test("countDesign3 counts patterns, levels, checked steps, links and hidden click paths", () => {
  const rs = [resp("Restocking"), resp("Texts", { patterns: [1], steps: [{ app: "iPhone", ref: "phone_quick_replies", feature: null, goal: "Save replies.", clickPath: null }, { app: "Microsoft Teams", ref: null, feature: "Teams channel", goal: "Collect requests.", clickPath: "Teams, then channels" }] })];
  const n = countDesign3(design3(rs), excelLink);
  assert.deepEqual(n.patterns, { 1: 1, 3: 1, 4: 1 });
  assert.deepEqual(n.levels, { 3: 2 });
  assert.equal(n.checked, 1);
  assert.equal(n.unchecked, 2);
  assert.equal(n.linked, 1);
  assert.equal(n.clickPathsShown, 1);
  assert.equal(n.clickPathsHidden, 1);
  assert.deepEqual(n.refs, ["phone_quick_replies"]);
});

test("a line that starts with a dash is caught in experiment three, a hyphen word in the middle by DASH", () => {
  assert.ok(LINE_DASH.test("Diet needs:\n- 2 vegetarian meals"));
  assert.ok(!LINE_DASH.test("Two vegetarian meals"));
  const c = checks3({ d: design3([resp("Restocking"), resp("Lunch")]), s: screens3({ seeIt: { task: "Lunch", intro: "Your order.", result: "Please add:\n- Oat milk" } }), links: excelLink, track: "starter", who: notSure });
  assert.deepEqual(failed3(c), ["three_copy_rules"]);
});

test("a [link] blank is not connecting an app, linking your inbox is", () => {
  const step = (goal: string) => resp("Lunch", { steps: [{ app: null, ref: null, feature: null, goal, clickPath: null }] });
  const blank = checks3({ d: design3([resp("Restocking"), step("Write a reminder with gaps for [policy], [date] and [link].")]), s: screens3(), links: excelLink, track: "starter", who: notSure });
  assert.deepEqual(failed3(blank), []);
  const linked = checks3({ d: design3([resp("Restocking"), step("Link your inbox to the chat tool.")]), s: screens3(), links: excelLink, track: "starter", who: notSure });
  assert.deepEqual(failed3(linked), ["three_no_connect"]);
});
