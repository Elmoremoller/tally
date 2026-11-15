import test from "node:test";
import assert from "node:assert/strict";
import type { Who } from "../lib/beginner/levels";
import type { EndStep, PathPlan, WorkflowStep } from "../lib/beginner/path";
import type { FreeResult, MapLine } from "../lib/beginner/types";
import { contentWords, countDesign, jaccard, MENU, PROMISED_TIME, recipeCount, refKind, runChecks, WRITING_HELP } from "../scripts/persona-checks";

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
  assert.ok(MENU.test("Tap the share icon, then open the menu."));
});

test("a task named in Expect must reach its level", () => {
  const map = [row("Writing quotes", { level: 2, recipe: null, held: "needs_computer", withPath: "Quotes, written with AI." })];
  const checks = runChecks({ track: "starter", who: who(), screens: 9, free: free(map), path: null, expect: { taskLevel: { task: "quote", level: 3 } } });
  const c = checks.find((x) => x.id === "quote_level_3");
  assert.equal(c?.pass, false);
  assert.match(c?.detail ?? "", /needs_computer/);
});
