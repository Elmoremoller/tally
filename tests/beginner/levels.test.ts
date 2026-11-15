import test from "node:test";
import assert from "node:assert/strict";
import { freePlanFor, offerFor, orderMap } from "../../lib/beginner/free-result";
import { levelCopy } from "../../lib/beginner/copy";
import {
  appsOf,
  connectOf,
  hasStepsFor,
  kindOf,
  levelFor,
  pathLineFor,
  placesOf,
  sampleWho,
  whoFrom,
  withLevels,
  type LevelTask,
  type Who,
} from "../../lib/beginner/levels";
import { recipeById, recipes, TASK_KINDS } from "../../lib/beginner/recipes";
import { beginnerSamples } from "../../lib/beginner/samples";
import type { MapLine } from "../../lib/beginner/types";

const who = (over: Partial<Who> = {}): Who => ({
  track: "builder",
  canUse: "self",
  connect: null,
  places: ["Gmail", "Text messages", "Google Sheets"],
  device: "both",
  aiTools: ["claude"],
  ...over,
});

const task = (kind: LevelTask["kind"], over: Partial<LevelTask> = {}): LevelTask => ({ ai: true, private: false, kind, ...over });

/** Lines that would make a level 3 or higher read like writing help (DIRECTION.md, section 3). */
const WRITING_HELP =
  /\b(help(s)? you (write|draft)|write (it|them|each one) with|written with AI|ask(s)? (AI|your AI|your chat tool|Claude|ChatGPT)|AI (writes|drafts)|each time you ask)\b/i;

test("kindOf keeps only kinds on the list", () => {
  for (const kind of TASK_KINDS) assert.equal(kindOf(kind), kind);
  for (const other of ["none", "gmail_auto_send", "", 3, null, undefined]) assert.equal(kindOf(other), null);
});

test("a task AI can't help with stays hers at level 1", () => {
  assert.deepEqual(levelFor(task(null, { ai: false }), who()), { level: 1, waits: false, recipe: null, held: null, askFirst: false });
  assert.equal(levelFor(task(null, { ai: false }), who({ canUse: "restricted" })).level, 1, "even when AI is restricted");
});

test("a task no kind fits gets level 2, never a forced recipe", () => {
  const result = levelFor(task(null), who());
  assert.equal(result.level, 2);
  assert.equal(result.recipe, null);
  assert.equal(result.held, null);
});

test("a task gets the highest level whose recipe fits her", () => {
  assert.equal(levelFor(task("email_replies"), who()).recipe?.id, "gmail_help_me_write");
  assert.equal(levelFor(task("email_replies"), who()).level, 4);
  assert.equal(levelFor(task("awaiting_replies"), who()).level, 5);
  assert.equal(levelFor(task("repeat_texts"), who()).recipe?.id, "phone_quick_replies");
});

test("condition 1: without the app a recipe needs, the task gets level 2 and no reason", () => {
  const result = levelFor(task("email_replies"), who({ places: ["Text messages"] }));
  assert.deepEqual([result.level, result.recipe, result.held], [2, null, null]);
});

test("condition 2: an employee connects an app only with a clear Yes", () => {
  for (const connect of ["no", "not_sure", null] as const) {
    const result = levelFor(task("email_replies"), who({ canUse: "yes", connect }));
    assert.deepEqual([result.level, result.held], [2, "connect"], String(connect));
  }
  assert.equal(levelFor(task("email_replies"), who({ canUse: "yes", connect: "yes" })).level, 4);
  assert.equal(levelFor(task("email_replies"), who({ canUse: "not_sure", connect: "yes" })).level, 4);
});

test("condition 3: an employee's task with private details never goes into her chat tool", () => {
  const employee = levelFor(task("repeat_writing", { private: true }), who({ canUse: "yes" }));
  assert.deepEqual([employee.level, employee.held], [2, "private"]);
  assert.equal(levelFor(task("repeat_writing", { private: true }), who()).level, 3, "she controls her own tool");
  // Saved replies hold no private details, so a private task can still have them.
  assert.equal(levelFor(task("repeat_texts", { private: true }), who({ canUse: "yes" })).level, 3);
});

test("condition 4: a Starter path stops at level 3, and says why", () => {
  const result = levelFor(task("email_replies"), who({ track: "starter" }));
  assert.deepEqual([result.level, result.held], [2, "track"]);
  assert.equal(levelFor(task("repeat_emails"), who({ track: "starter" })).level, 3);
});

test("condition 5, phone only: a recipe set up only on a computer is not offered", () => {
  const phone = who({ device: "phone" });
  for (const kind of ["repeat_emails", "notes_to_table", "email_follow_ups", "awaiting_replies"] as const) {
    const result = levelFor(task(kind), phone);
    assert.deepEqual([result.level, result.recipe, result.held], [2, null, "needs_computer"], kind);
  }
  assert.equal(levelFor(task("repeat_texts"), phone).recipe?.id, "phone_quick_replies");
  assert.equal(levelFor(task("email_replies"), phone).recipe?.id, "gmail_help_me_write", "Help me write has phone steps");
  assert.equal(levelFor(task("spoken_writing"), phone).recipe?.id, "say_it_out_loud");
});

test("on a phone only, repeat writing is said out loud, since a saved assistant has no phone steps", () => {
  for (const tool of ["claude", "chatgpt"] as const) {
    const result = levelFor(task("repeat_writing"), who({ device: "phone", aiTools: [tool] }));
    assert.deepEqual([result.level, result.recipe?.id, result.held], [3, "say_it_out_loud", null], tool);
  }
  assert.equal(levelFor(task("repeat_writing"), who({ device: "both" })).recipe?.id, "saved_assistant", "with a computer, the saved assistant");
  const notSure = levelFor(task("repeat_writing"), who({ device: "phone", canUse: "not_sure", connect: null }));
  assert.deepEqual([notSure.recipe?.id, notSure.askFirst], ["say_it_out_loud", true]);
});

test("the stand in never gets round another rule", () => {
  const restricted = levelFor(task("repeat_writing"), who({ device: "phone", canUse: "restricted" }));
  assert.deepEqual([restricted.level, restricted.waits, restricted.held], [null, true, "restricted"]);
  const privateTask = levelFor(task("repeat_writing", { private: true }), who({ device: "phone", canUse: "yes" }));
  assert.deepEqual([privateTask.level, privateTask.recipe, privateTask.held], [2, null, "private"]);
  const noAi = levelFor(task("repeat_writing", { ai: false }), who({ device: "phone" }));
  assert.deepEqual([noAi.level, noAi.recipe], [1, null]);
});

test("condition 5, computer only: a recipe set up only on a phone is not offered", () => {
  const result = levelFor(task("repeat_texts"), who({ device: "computer" }));
  assert.deepEqual([result.level, result.recipe], [2, null], "no phone, so no phone keyboard either");
  assert.equal(levelFor(task("repeat_emails"), who({ device: "computer" })).recipe?.id, "gmail_templates");
});

test("condition 5, both: a recipe set up on a computer still counts, and so does one set up on a phone", () => {
  const both = who({ device: "both" });
  assert.equal(levelFor(task("repeat_emails"), both).recipe?.id, "gmail_templates");
  assert.equal(levelFor(task("notes_to_table"), both).recipe?.id, "notes_to_sheet");
  assert.equal(levelFor(task("repeat_writing"), both).recipe?.id, "saved_assistant");
  assert.equal(levelFor(task("repeat_texts"), both).recipe?.id, "phone_quick_replies");
  for (const recipe of recipes) {
    assert.ok(recipe.routes.some((route) => hasStepsFor(route, "both")), `${recipe.id} is set up somewhere`);
  }
});

test("a restricted employee still gets the two recipes that need no AI at work, with the line to ask first", () => {
  const restricted = who({ canUse: "restricted", track: "starter", places: ["Gmail", "Text messages"] });
  const texts = levelFor(task("repeat_texts"), restricted);
  assert.deepEqual([texts.level, texts.recipe?.id, texts.askFirst], [3, "phone_quick_replies", true]);
  const emails = levelFor(task("repeat_emails"), restricted);
  assert.deepEqual([emails.level, emails.recipe?.id, emails.askFirst], [3, "gmail_templates", true]);
  for (const kind of ["repeat_writing", "spoken_writing", "email_replies"] as const) {
    const result = levelFor(task(kind), restricted);
    assert.deepEqual([result.level, result.waits, result.held, result.askFirst], [null, true, "restricted", false], kind);
  }
  const none = levelFor(task(null), restricted);
  assert.deepEqual([none.level, none.waits, none.held], [null, true, null], "no kind fits, and it still waits");
  const offered = recipes.filter((r) =>
    TASK_KINDS.some((kind) => levelFor(task(kind), { ...restricted, track: "builder" }).recipe?.id === r.id),
  );
  assert.deepEqual(offered.map((r) => r.id).sort(), ["gmail_templates", "phone_quick_replies"]);
  assert.ok(offered.every((r) => !r.conditions.needsAiAllowed));
});

test("someone who works for herself or may use AI never sees the line to ask first", () => {
  for (const canUse of ["self", "yes"] as const) {
    assert.equal(levelFor(task("repeat_texts"), who({ canUse })).askFirst, false, canUse);
  }
});

test("someone who is Not sure sees the line to ask first on every task AI touches, and keeps her levels", () => {
  const texts = levelFor(task("repeat_texts"), who({ canUse: "not_sure" }));
  assert.deepEqual([texts.level, texts.askFirst], [3, true]);
  const none = levelFor(task(null), who({ canUse: "not_sure" }));
  assert.deepEqual([none.level, none.askFirst], [2, true]);
  assert.equal(levelFor(task(null, { ai: false }), who({ canUse: "not_sure" })).askFirst, false);
});

test("her chat tool decides which chat routes count, and Claude when she uses none of them", () => {
  assert.ok(appsOf(who({ aiTools: ["chatgpt"] })).has("chatgpt"));
  assert.ok(!appsOf(who({ aiTools: ["chatgpt"] })).has("claude"));
  assert.ok(appsOf(who({ aiTools: ["none_yet"] })).has("claude"));
  // A Builder who only uses Gemini has no checked recipe for a saved assistant yet.
  assert.equal(levelFor(task("repeat_writing"), who({ aiTools: ["gemini"] })).level, 2);
});

test("the apps she ticked count for every task, and the kind decides the channel", () => {
  const apps = appsOf(who({ places: ["Gmail", "Square"], device: "phone" }));
  assert.ok(apps.has("gmail") && apps.has("iphone") && apps.has("gboard"));
  assert.ok(!apps.has("google_sheets"));
  assert.ok(!appsOf(who({ device: "computer" })).has("iphone"));
});

test("placesOf and connectOf read her answers", () => {
  const qas = [
    { id: "where", title: "t", picked: ["Gmail", "In person"], text: "Square, WhatsApp" },
    { id: "connect", title: "t", picked: ["Not sure"], text: null },
  ];
  assert.deepEqual(placesOf(qas), ["Gmail", "In person", "Square", "WhatsApp"]);
  assert.equal(connectOf(qas), "not_sure");
  assert.deepEqual(placesOf([]), []);
  assert.equal(connectOf([]), null);
});

test("whoFrom ignores a connect answer from anyone who was never asked", () => {
  const qas = [{ id: "connect", title: "t", picked: ["Yes"], text: null }];
  const base = { track: "builder" as const, qas, aiTools: ["claude" as const] };
  assert.equal(whoFrom({ ...base, worksFor: "employer", aiPolicy: "restricted" }).connect, null);
  assert.equal(whoFrom({ ...base, worksFor: "self", aiPolicy: null }).connect, null);
  assert.equal(whoFrom({ ...base, worksFor: "employer", aiPolicy: "encouraged" }).connect, "yes");
});

test("no With your path line at level 3 or higher reads like writing help", () => {
  for (const recipe of recipes) {
    assert.doesNotMatch(recipe.withPath, WRITING_HELP, recipe.id);
    assert.doesNotMatch(recipe.withPath, /[–—]|\s-\s/, `${recipe.id} has no dash`);
    assert.ok(recipe.offer && !/[.!?]$/.test(recipe.offer), `${recipe.id} has an offer ending`);
  }
});

test("no reason line says Held here, and the restricted one says the task waits", () => {
  for (const line of Object.values(levelCopy.held)) assert.doesNotMatch(line, /held here/i, line);
  assert.equal(levelCopy.held.restricted, "Your company restricts AI, so this one waits.");
  assert.equal(levelCopy.waits, "Waits for your company’s OK");
});

test("her trusted name for a task goes into the recipe's line, and the plain line is used without one", () => {
  const recipe = recipeById("phone_quick_replies");
  assert.ok(recipe);
  assert.equal(
    pathLineFor(recipe, "rescheduling texts"),
    "For your rescheduling texts, your common replies are saved on your phone, each a few letters away.",
  );
  assert.equal(pathLineFor(recipe, null), recipe.withPath);
  const saved = recipeById("saved_assistant");
  assert.equal(saved?.withPath, "You hand it the job, and it writes in your voice with your details already in.");
  for (const r of recipes) assert.doesNotMatch(pathLineFor(r, "booking texts"), WRITING_HELP, r.id);
});

test("withLevels takes the line from the recipe and keeps the model's line below level 3", () => {
  const rows: MapLine[] = [
    { task: "Booking texts", phrase: "booking texts", today: "T.", withPath: "Model line.", ai: true, private: false, kind: "repeat_texts" },
    { task: "Odd jobs", phrase: "odd jobs", today: "T.", withPath: "Model line two.", ai: true, private: false, kind: null },
  ];
  const [texts, odd] = withLevels(rows, who());
  assert.equal(texts.withPath, `For your booking texts, ${recipeById("phone_quick_replies")?.withPath.replace(/^Y/, "y")}`);
  assert.deepEqual([texts.level, texts.recipe], [3, "phone_quick_replies"]);
  assert.deepEqual([odd.level, odd.recipe, odd.withPath], [2, null, "Model line two."]);
});

// The Done when lines of Phase 5 in docs/DIRECTION.md.

test("the dental sample gets Build once, reuse for rescheduling texts, and never a connected app", () => {
  const sample = beginnerSamples.dental;
  const map = withLevels(sample.free.map, sampleWho(sample));
  const texts = map.find((m) => m.task === "Rescheduling texts");
  assert.equal(texts?.level, 3);
  assert.equal(texts?.recipe, "phone_quick_replies");
  for (const row of map) {
    const recipe = row.recipe ? recipeById(row.recipe) : undefined;
    assert.ok(!recipe?.conditions.connectsApp, `${row.task} connects no app`);
    assert.ok((row.level ?? 0) <= 3, `${row.task} stays at or below level 3`);
  }
  assert.equal(map.find((m) => m.task === "Insurance questions")?.held, "private");
  const reminders = map.find((m) => m.task === "Appointment reminders");
  assert.equal(reminders?.recipe, texts?.recipe, "the same recipe");
  assert.notEqual(reminders?.withPath, texts?.withPath, "but not the same sentence");
  assert.equal(map.find((m) => m.task === "Answering phones")?.level, 1);
});

test("a self employed Builder who works in Gmail gets Inside your apps for her top email task", () => {
  const map = withLevels(
    [
      { task: "Client emails", phrase: "client emails", today: "T.", withPath: "M.", ai: true, private: true, kind: "email_replies" },
      { task: "Invoices", phrase: "invoices", today: "T.", withPath: "M.", ai: true, private: false, kind: "repeat_emails" },
    ],
    who({ places: ["Gmail"], device: "computer", aiTools: ["chatgpt"] }),
  );
  assert.equal(map[0].level, 4);
  assert.equal(map[0].recipe, "gmail_help_me_write");
  const offer = offerFor({ track: "builder", tool: "chatgpt", map, top: "Client emails", device: "computer" });
  assert.deepEqual(offer.setups, ["Your client emails, drafted in your inbox", "Your invoices, saved once as Gmail templates"]);
});

test("a phone only Starter gets only what she can set up on her phone, named for what it is", () => {
  const map = orderMap(
    withLevels(
      [
        { task: "Booking texts", phrase: "booking texts", today: "T.", withPath: "M.", ai: true, private: false, kind: "repeat_texts" },
        { task: "Price lists", phrase: "price lists", today: "T.", withPath: "M.", ai: true, private: false, kind: "notes_to_table" },
      ],
      who({ track: "starter", device: "phone", places: ["Text messages", "Google Sheets"] }),
    ),
    "Booking texts",
  );
  assert.deepEqual(
    map.map((m) => [m.task, m.level, m.held]),
    [
      ["Booking texts", 3, null],
      ["Price lists", 2, "needs_computer"],
    ],
  );
  assert.deepEqual(offerFor({ track: "starter", tool: "claude", map, top: "Booking texts", device: "phone" }), {
    setups: ["Your booking texts, saved once on your phone", "Your price lists, written with AI"],
    prep: ["Get Claude ready on your phone", "Teach Claude who you are"],
  });
  assert.equal(freePlanFor(map, "Booking texts"), false, "price lists has no recipe");
});

test("a Starter with both gets the computer recipes too", () => {
  const map = withLevels(
    [
      { task: "Booking texts", phrase: "booking texts", today: "T.", withPath: "M.", ai: true, private: false, kind: "repeat_texts" },
      { task: "Price lists", phrase: "price lists", today: "T.", withPath: "M.", ai: true, private: false, kind: "notes_to_table" },
    ],
    who({ track: "starter", device: "both", places: ["Text messages", "Google Sheets"] }),
  );
  assert.deepEqual(
    map.map((m) => [m.task, m.level, m.recipe]),
    [
      ["Booking texts", 3, "phone_quick_replies"],
      ["Price lists", 3, "notes_to_sheet"],
    ],
  );
  assert.deepEqual(offerFor({ track: "starter", tool: "claude", map, top: "Booking texts", device: "both" }), {
    setups: ["Your booking texts, saved once on your phone", "Your price lists, turned into rows for your sheet"],
    prep: ["Get Claude ready on your phone and computer", "Teach Claude who you are"],
  });
  assert.equal(freePlanFor(map, "Booking texts"), true);
});

test("the restricted nurse sample waits for her company's OK, with no level and no Write it with AI", () => {
  const sample = beginnerSamples.nurse;
  const map = orderMap(withLevels(sample.free.map, sampleWho(sample)), sample.firstWin.task);
  const precepting = map.find((m) => m.task === "Precepting new nurses");
  assert.deepEqual([precepting?.level, precepting?.waits, precepting?.held], [null, true, "restricted"]);
  for (const row of map) {
    if (row.ai) assert.deepEqual([row.level, row.waits], [null, true], row.task);
    else assert.equal(row.level, 1, row.task);
    assert.notEqual(row.level, 2, `${row.task} never carries Write it with AI`);
  }
  const offer = offerFor({
    track: "starter",
    tool: "claude",
    map,
    top: sample.firstWin.task,
    device: sample.free.device,
    restricted: true,
  });
  assert.deepEqual(offer.setups, ["The message to ask what’s allowed"]);
  assert.ok([...offer.setups, ...offer.prep].every((name) => !/saved|project|routine|written with AI/i.test(name)));
});

test("old saved map rows with no level still load in every function", () => {
  const old: MapLine[] = [{ task: "Vendor emails", phrase: "vendor emails", today: "T.", withPath: "M.", ai: true, private: false }];
  assert.equal(withLevels(old, who())[0].level, 2);
  assert.deepEqual(offerFor({ track: "builder", tool: "claude", map: old, top: "Vendor emails", device: null }), {
    setups: ["Your vendor emails, written with AI"],
    prep: [],
  });
});
