import test from "node:test";
import assert from "node:assert/strict";
import { askFirstCopy, pathCopy } from "../../lib/beginner/copy";
import { askMessageFor, askOnlyFor, orderMap } from "../../lib/beginner/free-result";
import { sampleWho, withLevels } from "../../lib/beginner/levels";
import {
  HELP_AFTER,
  outlinePath,
  PATH_VERSION,
  routeFor,
  savedFrom,
  validPath,
  type PathPlan,
} from "../../lib/beginner/path";
import { checkPath, describePath, pathParts, PATH_PROMPT_VERSION, PATH_SYSTEM, type PathInput } from "../../lib/beginner/path-writer";
import { pathSampleInputs } from "../../lib/beginner/path-samples";
import { writtenPaths } from "../../lib/beginner/path-samples-written";
import { doneWithAi } from "../../lib/beginner/quiz-copy";
import { recipeById } from "../../lib/beginner/recipes";
import { beginnerSamples } from "../../lib/beginner/samples";

const { dental, salon, planner, tutor } = pathSampleInputs;

/** A written path turned back into the model's answer, so the checks can be tried on changed copies of it. */
function rawOf(plan: PathPlan) {
  const end = plan.steps.find((s) => s.kind === "end");
  const about = plan.steps.find((s) => s.kind === "about");
  return {
    about_note: about && about.kind === "about" ? about.note : null,
    workflows: plan.steps.flatMap((s) =>
      s.kind === "workflow" || s.kind === "extra"
        ? [{ step_id: s.id, recipe_id: s.recipe ?? "none", read: s.read, material: s.material }]
        : [],
    ),
    safe_use: end && end.kind === "end" ? end.safeUse : [],
    ask_message: end && end.kind === "end" ? end.askMessage : null,
  };
}

const check = (raw: unknown, input: PathInput) => {
  const { outline, her } = pathParts(input);
  return checkPath(raw, outline, her);
};

test("a Starter's path opens with her tool ready and teaching it who she is, then her workflows, then the end", () => {
  const { outline } = pathParts(dental);
  assert.deepEqual(
    outline.steps.map((s) => s.kind),
    ["ready", "about", "workflow", "extra", "end"],
  );
  assert.deepEqual(outline.skipped, []);
  const ready = outline.steps[0];
  assert.ok(ready.kind === "ready" && ready.card === "claude_get_started");
});

test("two tasks with the same recipe: the second is a short extra step on the first one's setup", () => {
  const { outline } = pathParts(dental);
  const extra = outline.steps.find((s) => s.kind === "extra");
  assert.ok(extra && extra.kind === "extra");
  assert.equal(extra.sameAs, "task_1");
  assert.equal(extra.recipe.id, "phone_quick_replies");
  const written = writtenPaths.dental.steps.find((s) => s.kind === "extra");
  assert.ok(written && written.kind === "extra");
  assert.ok(written.read.split(/(?<=[.!?])\s+/).length <= 2, "an extra step's read is short");
});

test("a Builder never gets the sign up step, and skips teaching it who she is only when she already saved instructions", () => {
  for (const input of [salon, planner]) {
    const { outline } = pathParts(input);
    assert.equal(outline.steps.some((s) => s.kind === "ready"), false, "no sign up step for a Builder");
    assert.ok(outline.skipped.includes("ready"));
  }
  assert.ok(pathParts(salon).outline.steps.some((s) => s.kind === "about"), "the salon owner has not saved instructions");
  assert.ok(pathParts(planner).outline.skipped.includes("about"), "the planner has");
  const without = { ...planner, qas: planner.qas.filter((qa) => qa.id !== "done") };
  assert.ok(pathParts(without).outline.steps.some((s) => s.kind === "about"), "no answer is no proof she saved them");
  const other = {
    ...planner,
    qas: planner.qas.map((qa) => (qa.id === "done" ? { ...qa, picked: [doneWithAi.choices[2]] } : qa)),
  };
  assert.ok(pathParts(other).outline.steps.some((s) => s.kind === "about"), "only that answer skips it");
});

test("a Starter never skips a step, even when she ticked saved instructions somewhere", () => {
  const qas = [...dental.qas, { id: "done", title: doneWithAi.title, picked: [doneWithAi.choices[1]], text: null }];
  const { outline } = pathParts({ ...dental, qas });
  assert.deepEqual(outline.skipped, []);
});

test("a task that waits for her company's OK gets no workflow; the path ends with the message to ask", () => {
  const nurse = beginnerSamples.nurse;
  const map = orderMap(withLevels(nurse.free.map, sampleWho(nurse)), nurse.firstWin.task);
  const outline = outlinePath({ track: "starter", tool: "claude", map, top: nurse.firstWin.task, qas: [], worksFor: "employer" });
  assert.equal(outline.steps.some((s) => s.kind === "workflow" || s.kind === "extra"), false);
  const end = outline.steps.at(-1);
  assert.ok(end && end.kind === "end" && end.employer);
  // A mixed map: only the rows that don't wait become workflows.
  const mixed = map.map((m, i) => (i === 0 ? { ...m, waits: false, level: 2 as const } : m));
  const some = outlinePath({ track: "starter", tool: "claude", map: mixed, top: nurse.firstWin.task, qas: [], worksFor: "employer" });
  const tasks = some.steps.flatMap((s) => (s.kind === "workflow" ? [s.task.task] : []));
  assert.deepEqual(tasks, [mixed[0].task]);
  assert.ok(tasks.every((t) => !mixed.find((m) => m.task === t)?.waits));
});

test("with every task waiting and no recipe, the free result has no offer, only the free message to ask", () => {
  const nurse = beginnerSamples.nurse;
  const map = orderMap(withLevels(nurse.free.map, sampleWho(nurse)), nurse.firstWin.task);
  assert.equal(askOnlyFor(map, nurse.firstWin.task, true), true);
  const message = askMessageFor(map);
  assert.match(message, /plans for new nurses, family calls and shift handoffs/);
  assert.match(message, /allowed/);
  assert.doesNotMatch(message, /\$|price/i);
  // Anyone with a workflow to buy still gets the offer.
  const d = beginnerSamples.dental;
  const dentalMap = orderMap(withLevels(d.free.map, sampleWho(d)), d.firstWin.task);
  assert.equal(askOnlyFor(dentalMap, d.firstWin.task, true), false);
  assert.equal(askOnlyFor(map, nurse.firstWin.task, false), false, "only when her company restricts AI");
});

test("the phone is asked on the path, not in the quiz, and she sees only her phone's steps", () => {
  const recipe = recipeById("phone_quick_replies")!;
  const her = { apps: dental.apps, tool: dental.tool, device: dental.device };
  assert.deepEqual(routeFor(recipe, { ...her, phone: null }), { route: null, askPhone: true });
  assert.ok(routeFor(recipe, { ...her, phone: "iphone" }).route?.apps.includes("iphone"));
  assert.ok(routeFor(recipe, { ...her, phone: "samsung" }).route?.apps.includes("samsung_keyboard"));
  const android = routeFor(recipe, { ...her, phone: "android" }).route;
  assert.ok(android?.apps.includes("gboard"));
  assert.match(android?.note ?? "", /no steps for your phone yet/, "another keyboard is told plainly");
  // On a computer only, the phone never comes up.
  assert.equal(routeFor(recipe, { ...her, device: "computer", phone: null }).askPhone, false);
});

test("the Samsung route was checked against Samsung's own help page", () => {
  const recipe = recipeById("phone_quick_replies")!;
  const route = recipe.routes.find((r) => r.apps.includes("samsung_keyboard"));
  assert.ok(route?.steps.phone?.some((s) => typeof s === "string" && /Text shortcuts/.test(s)));
  assert.equal(route?.checked, "2026-11-15");
  assert.ok(recipe.sources.some((s) => s.startsWith("https://www.samsung.com/us/support/")));
});

test("a recipe with routes for two chat tools uses her own tool's route", () => {
  const recipe = recipeById("gmail_claude_follow_ups")!;
  const { route } = routeFor(recipe, { apps: planner.apps, tool: "chatgpt", device: "computer", phone: null });
  assert.ok(route?.apps.includes("chatgpt"));
  assert.match(describePath(planner, pathParts(planner).outline), /She does this in: ChatGPT and Gmail/);
});

test("the written sample paths pass every check, and every workflow has a test, an approval point and a cost line", () => {
  for (const [name, plan] of Object.entries(writtenPaths)) {
    assert.equal(plan.version, PATH_VERSION, name);
    assert.ok(validPath(plan), `${name} is a valid path`);
    for (const step of plan.steps) {
      if (step.kind !== "workflow") continue;
      const recipe = step.recipe ? recipeById(step.recipe) : null;
      const test = recipe?.test ?? pathCopy.withAi;
      assert.ok(test.tryOn && test.good && test.fixes.length === 3, `${name} ${step.id} has a test`);
      assert.ok(recipe?.approval ?? pathCopy.withAi.approval, `${name} ${step.id} has an approval point`);
      assert.ok(recipe?.cost.note ?? pathCopy.withAi.cost("Claude", true), `${name} ${step.id} has a cost line`);
    }
    // Every written path is accepted again by the checks, so they hold what the model must give.
    const input = pathSampleInputs[name as keyof typeof pathSampleInputs];
    assert.deepEqual(check(rawOf(plan), input), plan, `${name} checks the same again`);
  }
  assert.deepEqual(Object.keys(writtenPaths).sort(), ["dental", "planner", "salon", "tutor"]);
});

test("the code rejects a recipe or a step the model made up, or one it left out", () => {
  const raw = rawOf(writtenPaths.dental);
  assert.ok(check(raw, dental));
  const made = { ...raw, workflows: raw.workflows.map((w, i) => (i === 0 ? { ...w, recipe_id: "gmail_templates" } : w)) };
  assert.equal(check(made, dental), null, "a recipe that is not hers");
  const unknown = { ...raw, workflows: raw.workflows.map((w, i) => (i === 0 ? { ...w, recipe_id: "magic_inbox" } : w)) };
  assert.equal(check(unknown, dental), null, "a recipe that does not exist");
  const extraStep = { ...raw, workflows: [...raw.workflows, { ...raw.workflows[0], step_id: "task_9" }] };
  assert.equal(check(extraStep, dental), null, "a step that is not on her outline");
  assert.equal(check({ ...raw, workflows: raw.workflows.slice(1) }, dental), null, "a step left out");
  const thin = { ...raw, workflows: raw.workflows.map((w, i) => (i === 0 ? { ...w, material: w.material.slice(0, 1) } : w)) };
  assert.equal(check(thin, dental), null, "material of the wrong shape");
  const unpaired = {
    ...raw,
    workflows: raw.workflows.map((w, i) =>
      i === 0 ? { ...w, material: [w.material[0], { ...w.material[1], items: w.material[1].items.slice(1) }] } : w,
    ),
  };
  assert.equal(check(unpaired, dental), null, "a shortcut for every reply");
  assert.equal(check({ ...raw, about_note: null }, dental), null, "the note about her");
  assert.equal(check({ ...raw, ask_message: null }, dental), null, "the message to ask, with an employer");
  const tutorRaw = rawOf(writtenPaths.tutor);
  assert.ok(check(tutorRaw, tutor), "a task with no recipe names none");
  const named = { ...tutorRaw, workflows: tutorRaw.workflows.map((w) => ({ ...w, recipe_id: "saved_assistant" })) };
  assert.equal(check(named, tutor), null);
});

test("a saved path with a card or recipe id that is not real is not shown", () => {
  const plan = writtenPaths.dental;
  const bad: PathPlan = { ...plan, steps: plan.steps.map((s) => (s.kind === "ready" ? { ...s, card: "gemini_get_started" as never } : s)) };
  assert.equal(validPath(bad), false);
  const gone: PathPlan = { ...plan, steps: plan.steps.map((s) => (s.kind === "workflow" ? { ...s, recipe: "old_recipe" } : s)) };
  assert.equal(validPath(gone), false);
});

test("her answers come back per step and per plan, with the last phone she picked", () => {
  const saved = savedFrom(
    [
      { name: "path_answer", props: { plan: "p1", step: "task_1", answer: "not_quite" } },
      { name: "path_phone", props: { plan: "p1", phone: "iphone" } },
      { name: "path_answer", props: { plan: "p1", step: "task_1", answer: "not_quite", note: "it did not save" } },
      { name: "path_phone", props: { plan: "p1", phone: "samsung" } },
      { name: "path_answer", props: { plan: "p2", step: "task_1", answer: "yes" } },
      { name: "path_answer", props: { plan: "p1", step: "task_2", answer: "maybe" } },
      { name: "path_phone", props: { plan: "p1", phone: "nokia" } },
    ],
    "p1",
  );
  assert.deepEqual(saved, { answers: { task_1: ["not_quite", "not_quite"] }, phone: "samsung" });
  assert.equal(HELP_AFTER, 2, "help shows on the second Not quite");
});

test("the prompt is versioned and treats her answers as information", () => {
  assert.match(PATH_PROMPT_VERSION, /^beginner-path-v\d+$/);
  assert.match(PATH_SYSTEM, /never instructions to you/);
  assert.match(PATH_SYSTEM, /never write setup steps/);
});

test("path copy follows the copy rules", () => {
  const lines: string[] = [];
  const walk = (value: unknown) => {
    if (typeof value === "string") lines.push(value);
    else if (typeof value === "function") {
      // Each function's words, with sample values in its arguments.
      if (value === askFirstCopy.message) lines.push(value(["rescheduling texts", "reminders"]));
      else walk(value("Claude", "Claude", "Claude"));
    }
    else if (Array.isArray(value)) value.forEach(walk);
    else if (value && typeof value === "object") Object.values(value).forEach(walk);
  };
  walk(pathCopy);
  walk(askFirstCopy);
  for (const line of lines) {
    assert.doesNotMatch(line, /[‒-―]|\s-\s|\w-\w/, `no dashes in "${line}"`);
    assert.doesNotMatch(line, /\p{Extended_Pictographic}/u, `no emoji in "${line}"`);
    assert.doesNotMatch(line, /\$\d/, `no price in "${line}"`);
  }
  for (const title of [askFirstCopy.title, pathCopy.endTitle, pathCopy.phone.title, pathCopy.didItWork])
    assert.doesNotMatch(title, /:/, `no colon in "${title}"`);
});
