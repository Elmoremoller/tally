import test from "node:test";
import assert from "node:assert/strict";
import { levelCopy, offerCopy, firstWinCopy } from "../../lib/beginner/copy";
import { freeResultFor, offerTasks, orderMap, piecesFor, singularLast, smootherCount, thingFor, usesAiTool, workflowName } from "../../lib/beginner/free-result";
import { levelFor, withLevels, type LevelTask, type Who } from "../../lib/beginner/levels";
import { PATTERN_IDS, PATTERN_WORKFLOWS, patternOf, placeFor, emailAppOf, type PatternId } from "../../lib/beginner/patterns";
import type { QA } from "../../lib/beginner/quiz";
import type { MapLine } from "../../lib/beginner/types";
import { DASH } from "../../scripts/persona-checks";

// Phase 8 of docs/DIRECTION.md: a job read as responsibilities, matched to ten patterns, with the level chosen in
// code from the patterns, and an offer that lists the pieces Tally builds in her own words.

const who = (over: Partial<Who> = {}): Who => ({
  track: "starter",
  canUse: "not_sure",
  connect: "not_sure",
  places: ["Outlook", "Excel", "Teams"],
  device: "both",
  aiTools: ["none_yet"],
  ...over,
});

const task = (patterns: PatternId[], over: Partial<LevelTask> = {}): LevelTask => ({ ai: true, private: false, kind: null, patterns, ...over });

/** A map row as the v9 read gives it, before levels. */
const row = (name: string, patterns: PatternId[], over: Partial<MapLine> = {}): MapLine => ({
  task: name,
  phrase: name.toLowerCase(),
  thing: null,
  today: "You handle this for about 70 people.",
  withPath: "One place for it.",
  ai: patterns.length > 0,
  private: false,
  kind: null,
  patterns,
  ...over,
});

/** The office coordinator from experiment three, as the v9 read would give her map. */
const officeMap = (): MapLine[] => [
  row("Ordering lunch", [4, 6], { phrase: "lunch orders", thing: "Friday lunch order" }),
  row("Restocking the fridges", [3, 4], { phrase: "fridge restocks", thing: "fridge restock" }),
  row("Supplier emails", [1, 8], { phrase: "supplier emails", thing: "supplier", kind: "repeat_emails" }),
  row("Company events", [5], { phrase: "company events", thing: "company event" }),
  row("Office supplies", [3, 6], { phrase: "office supplies", thing: "office supply" }),
  row("Plants and upkeep", [7], { phrase: "plant care", thing: "plant care" }),
];

const officeAnswers = {
  experience: "not_yet" as const,
  aiTools: ["none_yet" as const],
  worksFor: "employer" as const,
  aiPolicy: "no_idea" as const,
  qas: [
    { id: "where", title: "Where does your work happen?", picked: ["Outlook", "Excel", "Teams"], text: null },
    { id: "device", title: "Do you work on a phone, a computer or both?", picked: ["Both"], text: null },
    { id: "can_use", title: "Can you use AI for your work?", picked: ["Not sure"], text: null },
    { id: "connect", title: "Would your company let you link your work email to an AI tool?", picked: ["Not sure"], text: null },
  ] satisfies QA[],
};

const firstWin = { task: "Ordering lunch", intro: "Here are the questions for your lunch order form.", draft: "1. What would you like?" };

test("there are ten patterns, each with a level 3 workflow, and only answers from documents uses AI", () => {
  assert.equal(PATTERN_IDS.length, 10);
  for (const p of PATTERN_IDS) {
    assert.equal(PATTERN_WORKFLOWS[p].level, 3);
    assert.equal(PATTERN_WORKFLOWS[p].id, `pattern_${p}`);
    assert.equal(PATTERN_WORKFLOWS[p].usesAi, p === 10, `pattern ${p}`);
  }
  assert.equal(patternOf(4), 4);
  for (const bad of [0, 11, "4", null, 4.5]) assert.equal(patternOf(bad), null);
});

test("the office coordinator gets at least five rows, lunch and restocking at Build once, reuse, with no Ask first (Done when)", () => {
  const free = freeResultFor(officeAnswers, { first_win: firstWin, first_step: null, map: officeMap() });
  assert.ok(free.map.length >= 5);
  for (const name of ["Ordering lunch", "Restocking the fridges"]) {
    const m = free.map.find((r) => r.task === name);
    assert.equal(m?.level, 3, name);
    assert.equal(m?.askFirst, false, name);
    assert.equal(m?.waits, false, name);
  }
  assert.ok(free.map.every((m) => m.level === 3 && !m.askFirst), "nothing she would put into an AI tool, so no row asks first");
  assert.equal(smootherCount(free.map), 6);
  assert.equal(firstWinCopy.smoother(6), "6 parts of your week can run smoother");
});

test("her offer names lunch and restocking, with the pieces in her own words, and no AI prep steps", () => {
  const free = freeResultFor(officeAnswers, { first_win: firstWin, first_step: null, map: officeMap() });
  assert.deepEqual(free.setups, ["Your lunch orders, collected and counted", "Your fridge restocks, counted against your usual amounts"]);
  assert.deepEqual(free.offer?.[0].pieces, [
    "Your Friday lunch order form, written for you",
    "Your Friday lunch order sheet, counted for you",
    "Your Friday lunch order email, ready to send",
  ]);
  assert.deepEqual(free.offer?.[1].pieces, ["Your fridge restock list, with the usual amounts", "Your fridge restock order, ready to send"]);
  assert.deepEqual(free.prep, [], "no workflow puts her work into an AI tool, so no Get Claude ready");
  assert.equal(free.firstStep, null);
});

test("a responsibility that holds private details stays hers, and so does one where nothing repeats, each with its reason", () => {
  const records = levelFor(task([9], { ai: false, private: true }), who());
  assert.equal(records.level, 1);
  assert.equal(records.stays, "private");
  const oneOff = levelFor(task([], { ai: false }), who());
  assert.equal(oneOff.stays, "nothing_repeats");
  assert.ok(levelCopy.stays.private.includes("private details"));
  assert.ok(levelCopy.stays.nothing_repeats.includes("Nothing repeats"));
});

test("Ask first only on rows that put her work into an AI tool (DIRECTION.md, section 2)", () => {
  assert.equal(levelFor(task([4]), who()).askFirst, false, "a form and a sheet need no OK");
  const answers = levelFor(task([10]), who());
  assert.equal(answers.level, 3);
  assert.equal(answers.askFirst, true, "a saved assistant with her documents does");
  assert.equal(levelFor(task([], { kind: null }), who()).askFirst, true, "writing it with AI each time does too");
  assert.equal(levelFor(task([10]), who({ canUse: "yes" })).askFirst, false, "only when she is not sure");
});

test("a company that restricts AI no longer holds back a workflow with no AI, and gives it no ask line", () => {
  const restricted = who({ canUse: "restricted", connect: null });
  const lunch = levelFor(task([4]), restricted);
  assert.equal(lunch.level, 3);
  assert.equal(lunch.askFirst, false);
  const answers = levelFor(task([10]), restricted);
  assert.equal(answers.waits, true, "a workflow that needs AI waits");
  assert.equal(answers.held, "restricted");
});

test("a form or a sheet needs a computer: a phone only person gets the held line, a checklist still works", () => {
  const phone = who({ device: "phone", places: ["Text messages"] });
  const orders = levelFor(task([4]), phone);
  assert.equal(orders.level, 2);
  assert.equal(orders.held, "needs_computer");
  assert.equal(levelFor(task([5]), phone).level, 3, "a checklist works on a phone");
  assert.equal(levelFor(task([7]), phone).level, 3, "so do reminders");
  assert.equal(placeFor(PATTERN_WORKFLOWS[1], phone), "phone", "saved replies on her phone");
});

test("inbox sorting needs an email app; without one the pattern gives nothing", () => {
  assert.equal(placeFor(PATTERN_WORKFLOWS[8], { device: "both", places: ["Paper"] }), null);
  assert.equal(levelFor(task([8]), who({ places: ["Paper"] })).level, 2);
  assert.equal(emailAppOf(["Gmail", "Outlook"]), "Outlook", "Microsoft first (DIRECTION.md, section 8)");
});

test("on a tie a checked recipe comes first, and the higher level wins over a pattern", () => {
  const gmail = who({ places: ["Gmail", "Google Sheets"], canUse: "self", connect: null });
  const emails = levelFor(task([1], { kind: "repeat_emails" }), gmail);
  assert.equal(emails.recipe?.id, "gmail_templates");
  assert.equal(emails.workflow, null);
  const outlook = levelFor(task([1], { kind: "repeat_emails" }), who());
  assert.equal(outlook.recipe, null, "no Outlook recipe yet");
  assert.equal(outlook.workflow?.id, "pattern_1");
  const builder = who({ track: "builder", places: ["Gmail"], canUse: "self", connect: null });
  assert.equal(levelFor(task([8], { kind: "awaiting_replies" }), builder).level, 5, "a level 5 recipe beats a level 3 pattern");
});

test("a Starter still stops at level 3", () => {
  const starter = who({ places: ["Gmail"], canUse: "self", connect: null });
  const r = levelFor(task([8], { kind: "awaiting_replies" }), starter);
  assert.equal(r.level, 3);
  assert.equal(r.held, "track");
});

test("rows read before Phase 8, with no patterns, keep the Phase 5 rules and shape", () => {
  const old: MapLine = { task: "Rescheduling texts", phrase: "rescheduling texts", today: "t.", withPath: "w.", ai: true, private: false, kind: "repeat_texts" };
  const [leveled] = withLevels([old], who({ canUse: "restricted", device: "phone", places: ["Text messages"] }));
  assert.equal(leveled.recipe, "phone_quick_replies");
  assert.equal(leveled.askFirst, true, "the old restricted ask line still shows on old rows");
  assert.ok(!("workflow" in leveled) && !("stays" in leveled));
  const free = freeResultFor({ ...officeAnswers, qas: [] }, { first_win: { ...firstWin, task: "Rescheduling texts" }, first_step: "x", map: [old] });
  assert.equal(free.offer, undefined, "no pieces on an old map");
});

test("what stays hers goes last on the map", () => {
  const map = withLevels([row("Employee records", [], { ai: false, private: true }), ...officeMap().slice(0, 2)], who());
  assert.deepEqual(orderMap(map, "Ordering lunch").map((m) => m.task), ["Ordering lunch", "Restocking the fridges", "Employee records"]);
});

test("the second workflow is her second most wanted when it ties on level, not the same way twice", () => {
  const map = withLevels(officeMap(), who());
  assert.deepEqual(offerTasks(map, "Ordering lunch").map((m) => m.task), ["Ordering lunch", "Restocking the fridges"]);
});

test("pieces use her own name for the thing, and fall back to her name for the task", () => {
  const map = withLevels(officeMap(), who());
  const her = { tool: "claude" as const, device: "both" as const, places: ["Outlook", "Excel"] };
  assert.deepEqual(piecesFor(map[2], her), ["Your supplier emails, written for you and saved in Outlook"]);
  const noThing = { ...map[3], thing: null };
  assert.ok(piecesFor(noThing, her)[0].startsWith("Your company event checklist"), "her name for the task, made singular");
  const level2: MapLine = { ...row("Writing posts", []), ai: true, level: 2, thing: "Instagram post" };
  assert.deepEqual(piecesFor(level2, her), ["Your Instagram post message for Claude, written for you"]);
  assert.equal(usesAiTool(level2), true);
  assert.equal(usesAiTool(map[0]), false);
});

test("workflowName uses the pattern's ending when no recipe fits", () => {
  const [lunch] = withLevels(officeMap(), who());
  assert.equal(workflowName(lunch), "Your lunch orders, collected and counted");
});

test("thingFor keeps her words and turns down anything else", () => {
  const hers = "office coordinator, i prepare lunch orders every friday, restock the fridges, plants";
  assert.equal(thingFor("Ordering lunch", "Friday lunch order", hers), "Friday lunch order");
  assert.equal(thingFor("Restocking", "the fridge restock", hers), "fridge restock");
  assert.equal(thingFor("Ordering lunch", "catering", hers), null, "a word she never used");
  assert.equal(thingFor("Ordering lunch", "lunch order form", hers), null, "a piece's own word at the end");
  assert.equal(thingFor("Ordering lunch", "ordering the lunch for everyone", hers), null, "a verb with an object");
});

test("every offer ending, piece and new line follows the copy rules", () => {
  const ctx = { thing: "lunch order", tool: "claude" as const, emailApp: "Outlook" as const, onPhone: false };
  const lines = [
    ...PATTERN_IDS.flatMap((p) => [PATTERN_WORKFLOWS[p].offer, ...PATTERN_WORKFLOWS[p].pieces(ctx), ...PATTERN_WORKFLOWS[p].pieces({ ...ctx, onPhone: true })]),
    offerCopy.whatYouGet(1),
    offerCopy.whatYouGet(2),
    offerCopy.startsWithQuestions,
    offerCopy.toolMessage("lunch order", "Claude"),
    ...Object.values(levelCopy.stays),
    firstWinCopy.smoother(1),
    firstWinCopy.smoother(0),
  ];
  for (const line of lines) {
    assert.ok(!DASH.test(line), `dash in ${line}`);
    assert.ok(!/\b(minutes?|hours?|faster|supercharge|game changer)\b/i.test(line), `promise or hype in ${line}`);
    assert.ok(!/\$\d/.test(line), `price in ${line}`);
  }
  for (const p of PATTERN_IDS) for (const piece of PATTERN_WORKFLOWS[p].pieces(ctx)) assert.ok(piece.includes("lunch order"), piece);
});

test("on a tie, the workflow for her best fitting pattern wins over a recipe for a later one", () => {
  const phone = who({ device: "both", places: ["Text messages", "Gmail"], canUse: "self", connect: null });
  const requests = levelFor(task([6, 1], { kind: "repeat_texts" }), phone);
  assert.equal(requests.workflow?.id, "pattern_6", "a form for requests before saved replies");
  const replies = levelFor(task([1, 6], { kind: "repeat_texts" }), phone);
  assert.equal(replies.recipe?.id, "phone_quick_replies", "the checked recipe when its pattern fits best");
  const inspections = levelFor(task([5, 9], { kind: "notes_to_table" }), phone);
  assert.equal(inspections.workflow?.id, "pattern_5", "a checklist before turning notes into rows with AI");
  assert.equal(inspections.askFirst, false);
});

test("a stock list works on a phone too", () => {
  const phone = who({ device: "phone", places: ["Text messages"], canUse: "self", connect: null });
  assert.equal(levelFor(task([3]), phone).level, 3);
  assert.equal(levelFor(task([4]), phone).held, "needs_computer", "a form and a counting sheet still need a computer");
});

test("a template works on a phone too, so a phone only person's quotes get one", () => {
  const phone = who({ device: "phone", places: ["Text messages"], canUse: "self", connect: null });
  const quotes = levelFor(task([2], { kind: "repeat_texts" }), phone);
  assert.equal(quotes.workflow?.id, "pattern_2", "a quote template before saved replies");
});

test("singularLast makes the last word singular in front of a piece's word", () => {
  assert.equal(singularLast("fridge restocks"), "fridge restock");
  assert.equal(singularLast("office supplies"), "office supply");
  assert.equal(singularLast("office lunches"), "office lunch");
  assert.equal(singularLast("tenant repair requests"), "tenant repair request");
  for (const same of ["sales", "news", "office cleaning", "payroll", "business"]) assert.equal(singularLast(same), same);
});
