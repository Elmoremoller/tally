import test from "node:test";
import assert from "node:assert/strict";
import { blockCardById } from "../../lib/beginner/cards";
import { workflowCopy } from "../../lib/beginner/copy";
import { cleanFollowUps, FOLLOW_UPS, followUpsFor, isSolved, PHONE_QUESTION, SUITE_QUESTION } from "../../lib/beginner/follow-ups";
import { PATTERN_IDS } from "../../lib/beginner/patterns";
import { pathV4Samples } from "../../lib/beginner/path-v4-samples";
import {
  answerableSteps,
  checkDesign,
  CLICK_WORDS,
  menuFor,
  needsFor,
  noteShown,
  PATTERN_FEATURES,
  rowOf,
  screensFor,
  startPath,
  swapCandidates,
  validPathV4,
  withPicks,
  type Design,
  type PathV4,
} from "../../lib/beginner/workflow";
import { workflowView } from "../../lib/beginner/workflow-view";

const office = pathV4Samples.v4_office;
const property = pathV4Samples.v4_property;
const hr = pathV4Samples.v4_hr;
const lunchRow = () => rowOf(office.path, "Ordering lunch")!;
const lunchAnswers = cleanFollowUps(followUpsFor(4, office.path).questions.length ? followUpsFor(4, office.path) : FOLLOW_UPS[4], [
  { id: "reach", picked: ["email", "paper", "person"] },
  { id: "combined", picked: ["yes"] },
  { id: "place", picked: ["email"] },
  { id: "often", picked: ["weekly"] },
])!;

/** A lunch workflow as the target in section 4 has it, to break one rule at a time. */
const goodLunch = () => ({
  read: "From now on everyone picks lunch in one form. The form counts each choice for you.",
  material: [
    { label: "Your form questions", items: ["What would you like?\nLasagna, vegetarian\nLasagna"] },
    { label: "Your message with the link", items: ["Hi all, please pick your lunch here: [link]"] },
    { label: "Your order email", items: ["Hello, here is our order for [day]: [counts]"] },
  ],
  steps: [
    { use: "ms_forms_create", say: "Create the form. Tally has written the questions for you.", piece: 1, when: "once" },
    { use: "ms_forms_share", say: "Send the link to the office. Tally has written the message.", piece: 2, when: "once" },
    { use: "ms_forms_results", say: "On order day, open the answers in Forms. The count for each choice is already there.", piece: null, when: "each_time" },
    { use: "goal", say: "Paste the counts into your order email and send it.", piece: 3, when: "each_time" },
    { use: "ms_forms_clear", say: "After you order, clear the answers, so next week starts from nothing.", piece: null, when: "each_time" },
  ],
  try_on: "This Thursday's lunch.",
  good: "Every order is counted in the form.",
  approval: "You check the counts before you send.",
  about_note: null,
  safe_use: [],
  ask_message: null,
});

const lunchMenu = () => menuFor(office.path, lunchRow(), lunchAnswers)!;
const check = (raw: unknown, menu = lunchMenu()) => checkDesign(raw, menu, needsFor(office.path, menu), "70 people");
const errorsOf = (raw: unknown) => {
  const r = check(raw);
  return "errors" in r ? r.errors : [];
};

test("her path opens on her offer's two workflows, with nothing written yet", () => {
  const path = startPath(office.input);
  assert.equal(path.version, 4);
  assert.equal(path.confirmed, false);
  assert.deepEqual(path.slots.map((s) => [s.id, s.task, s.design]), [
    ["task_1", "Ordering lunch", null],
    ["task_2", "Restocking the fridges", null],
  ]);
  assert.deepEqual(screensFor(path), [{ kind: "start" }]);
  assert.ok(validPathV4(path));
});

test("she can keep her two or swap one, never for a row that isn't hers to pick", () => {
  const path = startPath(office.input);
  const other = swapCandidates(path)[0];
  assert.ok(other, "her map has another row with a workflow");
  const swapped = withPicks(path, ["Ordering lunch", other.task])!;
  assert.equal(swapped.confirmed, true);
  assert.equal(swapped.slots[1].task, other.task);
  assert.equal(swapped.slots[1].answers, null);
  assert.equal(withPicks(path, ["Ordering lunch", "Something made up"]), null);
  assert.equal(withPicks(path, ["Ordering lunch", "Ordering lunch"]), null);
  assert.equal(withPicks(path, ["Ordering lunch"]), null);
  // A written workflow stays when its task stays.
  const written = withPicks(office.path, office.path.slots.map((s) => s.task))!;
  assert.ok(written.slots.every((s) => s.design));
});

test("every pattern has three or four questions with room for an example, and order forms ask about combined choices", () => {
  for (const p of PATTERN_IDS) {
    const set = FOLLOW_UPS[p];
    assert.ok(set.questions.length >= 3 && set.questions.length <= 4, `pattern ${p}`);
    assert.ok(set.example.label && set.example.hint.includes("Optional"));
    for (const q of set.questions) assert.equal(new Set(q.choices.map((c) => c.id)).size, q.choices.length, `${p} ${q.id}`);
  }
  const combined = FOLLOW_UPS[4].questions.find((q) => q.id === "combined");
  assert.match(combined?.title ?? "", /two things/);
  assert.match(combined?.hint ?? "", /Pasta, vegetarian/);
});

test("the questions add Microsoft or Google only when her quiz named neither, and her phone only on a phone", () => {
  assert.ok(!followUpsFor(4, { device: "both", places: ["Outlook", "Excel"] }).questions.includes(SUITE_QUESTION));
  assert.ok(followUpsFor(4, { device: "both", places: ["Paper"] }).questions.includes(SUITE_QUESTION));
  assert.ok(!followUpsFor(1, { device: "both", places: ["Paper"] }).questions.includes(SUITE_QUESTION));
  assert.ok(followUpsFor(7, { device: "phone", places: [] }).questions.includes(PHONE_QUESTION));
  assert.ok(!followUpsFor(7, { device: "computer", places: [] }).questions.includes(PHONE_QUESTION));
});

test("her answers are kept only as offered, and an app that already does it marks the row solved", () => {
  assert.equal(cleanFollowUps(FOLLOW_UPS[4], [{ id: "reach", picked: ["email"] }]), null, "a question left out");
  assert.equal(cleanFollowUps(FOLLOW_UPS[4], [...lunchAnswers.filter((a) => a.id !== "combined"), { id: "combined", picked: ["yes", "no"] }]), null);
  const withMadeUp = cleanFollowUps(FOLLOW_UPS[4], lunchAnswers.map((a) => (a.id === "reach" ? { ...a, picked: ["email", "pigeon"] } : a)))!;
  assert.deepEqual(withMadeUp.find((a) => a.id === "reach")?.picked, ["email"]);
  assert.equal(isSolved(4, lunchAnswers), false);
  assert.equal(isSolved(4, lunchAnswers.map((a) => (a.id === "reach" ? { ...a, picked: ["solved"] } : a))), true);
});

test("lunch in Microsoft Forms must read the counts in Forms and clear the answers, and may not use a sheet", () => {
  const menu = lunchMenu();
  assert.equal(menu.suite, "microsoft");
  assert.deepEqual(menu.required, ["form_create", "form_share", "form_results", "form_clear"]);
  assert.deepEqual(menu.forbidden, ["form_to_sheet", "count_each"]);
  assert.ok(menu.items.every((i) => i.kind !== "block" || !i.card.app.startsWith("google")), "no Google cards for her");
  assert.ok("design" in check(goodLunch()), "the target passes");
  const withSheet = goodLunch();
  withSheet.steps.splice(3, 0, { use: "ms_forms_to_excel", say: "Open the answers in Excel.", piece: null, when: "each_time" });
  assert.ok(errorsOf(withSheet).some((e) => e.includes("form_to_sheet")));
  const noClear = goodLunch();
  noClear.steps.pop();
  assert.ok(errorsOf(noClear).some((e) => e.includes("form_clear")));
});

test("the code rejects made up ids, click paths, a missing approval and a workflow that never says what she does next time", () => {
  const made = goodLunch();
  made.steps[0].use = "ms_forms_magic";
  assert.ok(errorsOf(made).some((e) => e.includes("unknown step id")));
  const clicks = goodLunch();
  clicks.steps[3].say = "Click New, then Mail, and paste the counts.";
  assert.ok(errorsOf(clicks).some((e) => e.includes("click path")));
  assert.ok(CLICK_WORDS.test("Select View responses"));
  assert.ok(!CLICK_WORDS.test("Create the form. Tally has written the questions for you."));
  const noApproval = { ...goodLunch(), approval: "" };
  assert.ok(errorsOf(noApproval).includes("the approval point is missing"));
  const onceOnly = goodLunch();
  onceOnly.steps = onceOnly.steps.map((s) => ({ ...s, when: "once" }));
  assert.ok(errorsOf(onceOnly).some((e) => e.includes("each time")));
});

test("the code rejects invented numbers, dashes, AI in a workflow without it, and not checked", () => {
  const amounts = goodLunch();
  amounts.material[0].items = ["What would you like?\nLasagna, 12 portions"];
  assert.ok(errorsOf(amounts).some((e) => e.includes("numbers she never gave: 12")));
  const formula = goodLunch();
  formula.material[2].items = ["=COUNTIF(C2:C100,\"Lasagna\")", "Order for [70] people", "Order for 70 people"];
  assert.ok(!errorsOf(formula).some((e) => e.includes("numbers")), "formulas, blanks and her own 70 are fine");
  const dash = { ...goodLunch(), good: "Every order is counted — by the form." };
  assert.ok(errorsOf(dash).includes("a dash"));
  const ai = { ...goodLunch(), read: "From now on everyone picks lunch in one form. Ask ChatGPT for the email." };
  assert.ok(errorsOf(ai).includes("names AI in a workflow that uses none"));
  const unchecked = { ...goodLunch(), good: "These steps are not checked." };
  assert.ok(errorsOf(unchecked).includes("says not checked"));
});

test("a workflow never changes the workbook a Microsoft form fills, or new answers stop arriving", () => {
  const benefits = rowOf(hr.path, "Benefits enrollment")!;
  const answers = hr.path.slots.find((s) => s.task === "Benefits enrollment")!.answers;
  const menu = menuFor(hr.path, benefits, answers)!;
  const raw = {
    ...goodLunch(),
    material: [{ label: "Your form questions", items: ["What is it about?\nDental"] }, { label: "Your message", items: ["Please use [link]"] }],
    steps: [
      { use: "ms_forms_create", say: "Create the form.", piece: 1, when: "once" },
      { use: "ms_forms_share", say: "Send the link.", piece: 2, when: "once" },
      { use: "ms_forms_to_excel", say: "Open the answers in Excel.", piece: null, when: "each_time" },
      { use: "excel_dropdown", say: "Add a Status column with a drop down.", piece: null, when: "once" },
    ],
  };
  const r = checkDesign(raw, menu, needsFor(hr.path, menu), "");
  assert.ok("errors" in r && r.errors.some((e) => e.includes("stop arriving")));
});

test("cards that need a paid or work account are offered only to someone with an employer", () => {
  const self = { ...office.path, worksFor: "self" as const };
  const menu = menuFor(self, lunchRow(), lunchAnswers)!;
  assert.ok(!menu.items.some((i) => i.id === "outlook_saved_email"), "Outlook templates need a Microsoft 365 subscription");
  assert.ok(lunchMenu().items.some((i) => i.id === "outlook_saved_email"));
});

test("on a phone only, a workflow gets only cards with steps for her phone", () => {
  const phone: PathV4 = { ...hr.path, device: "phone" };
  const row = rowOf(phone, "Onboarding new hires")!;
  const menu = menuFor(phone, row, [{ id: "phone", picked: ["iphone"], text: null }])!;
  for (const item of menu.items) if (item.kind === "block") assert.ok(item.card.steps.iphone?.length, item.id);
  assert.ok(!menu.items.some((i) => i.id.startsWith("excel_")), "Excel's cards have computer steps only");
});

test("documents and the inbox have no form or sheet cards, so their steps are plain goals or saved emails", () => {
  assert.deepEqual(PATTERN_FEATURES[2], []);
  assert.deepEqual(PATTERN_FEATURES[8], ["saved_email", "repeat_reminder"]);
});

test("a recipe is what she does each time, and an AI workflow gets her tool's prep right before it", () => {
  const screens = screensFor(property.path);
  const kinds = screens.map((s) => s.kind);
  assert.deepEqual(kinds, ["start", "questions", "workflow", "questions", "about", "workflow", "end"]);
  const inspections = property.path.slots.find((s) => s.task === "Inspections")!.design!;
  assert.equal(inspections.steps.find((s) => s.use === "notes_to_sheet")?.when, "each_time");
  assert.equal(property.path.prep?.askMessage, null, "her company already said yes to AI");
  assert.ok((property.path.prep?.safeUse.length ?? 0) >= 3);
  assert.equal(office.path.prep, null, "lunch and the fridges put nothing into AI");
});

test("the page shows a card's note only when it matters, and the Outside the US note on formula steps", () => {
  const lunch = office.path.slots[0] as typeof office.path.slots[0] & { design: Design };
  const clear = blockCardById("ms_forms_clear")!;
  assert.equal(noteShown(clear, lunch.design), null, "no workbook in her lunch, so no word about one");
  for (const sample of [hr, office]) {
    for (const slot of sample.path.slots) {
      const design = slot.design!;
      if (design.suite !== "microsoft") continue;
      const view = workflowView(sample.path, slot as typeof slot & { design: Design });
      const comma = (text: string) => /=[A-Z]+\([^)]*,/.test(text);
      const typed = [...view.once, ...view.eachTime].filter(
        (s) => s.lines.some(comma) || (s.piece && design.material.find((m) => m.label === s.piece)?.items.some(comma)),
      );
      for (const s of typed) assert.ok(s.region?.includes("semicolon"), `${slot.task}: ${s.say}`);
    }
  }
});

test("Did it work can be saved for each workflow and her tool's prep, and a saved path with a made up id doesn't load", () => {
  assert.deepEqual(answerableSteps(office.path), ["ready", "about", "task_1", "task_2"]);
  const broken = structuredClone(office.path);
  broken.slots[0].design!.steps[0].use = "made_up_card";
  assert.equal(validPathV4(broken), false);
});

test("the results card is checked against Microsoft's own page", () => {
  const card = blockCardById("ms_forms_results")!;
  assert.equal(card.feature, "form_results");
  assert.match(card.checked, /^\d{4}-\d{2}-\d{2}$/);
  assert.ok(card.sources.every((s) => s.startsWith("https://support.microsoft.com/")));
});

test("the new words have no dashes", () => {
  const words = [
    ...Object.values(workflowCopy).filter((v): v is string => typeof v === "string"),
    ...PATTERN_IDS.flatMap((p) => [...FOLLOW_UPS[p].questions.flatMap((q) => [q.title, q.hint ?? "", ...q.choices.map((c) => c.label)]), FOLLOW_UPS[p].example.label, FOLLOW_UPS[p].example.hint]),
  ];
  for (const w of words) assert.doesNotMatch(w, /[‒-―]|\s-\s/, w);
});
