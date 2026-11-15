import test from "node:test";
import assert from "node:assert/strict";
import {
  blanksIn,
  countsNotHers,
  deviceOf,
  exampleOf,
  fewHelp,
  freePlanFor,
  offerFor,
  orderMap,
  phraseFor,
  secondTask,
  taskForSetup,
  TIME_PROMISE,
  workflowName,
} from "../../lib/beginner/free-result";
import type { MapLine } from "../../lib/beginner/types";

const line = (task: string, phrase: string, ai: boolean, priv: boolean): MapLine => ({
  task,
  phrase,
  today: "Today line.",
  withPath: "With your path line.",
  ai,
  private: priv,
});

const map: MapLine[] = [
  line("Vendor emails", "vendor emails", true, false),
  line("Schedule changes", "schedule changes", true, true),
  line("Stocking shelves", "stocking shelves", false, false),
  line("Window displays", "window displays", true, false),
];

test("blanksIn counts each different blank once, whatever its case", () => {
  assert.deepEqual(blanksIn("Hi [first name], see you [Day]. Thanks, [First Name]. On [day]."), ["first name", "day"]);
  assert.deepEqual(blanksIn("No blanks here."), []);
});

test("exampleOf gives her real example, and null when she skipped it or left it empty", () => {
  assert.equal(exampleOf([{ id: "example", title: "t", picked: [], text: "  Can I return this?  " }]), "Can I return this?");
  assert.equal(exampleOf([{ id: "example", title: "t", picked: [], text: null }]), null);
  assert.equal(exampleOf([]), null);
});

test("TIME_PROMISE catches minutes and hours, and lets her own count through", () => {
  for (const line of ["Takes two minutes now", "Saves you an hour", "Done in 30 mins", "Back in hours"]) {
    assert.ok(TIME_PROMISE.test(line), line);
  }
  for (const line of ["You do this many times a day", "Becomes a saved project", "About once a day"]) {
    assert.ok(!TIME_PROMISE.test(line), line);
  }
});

test("deviceOf reads what she uses for work, by its label now or on answers saved before Phase 5", () => {
  assert.equal(deviceOf([{ id: "device", title: "t", picked: ["Phone only"], text: null }]), "phone");
  assert.equal(deviceOf([{ id: "device", title: "t", picked: ["Computer only"], text: null }]), "computer");
  assert.equal(deviceOf([{ id: "device", title: "t", picked: ["Phone"], text: null }]), "phone");
  assert.equal(deviceOf([{ id: "device", title: "t", picked: ["Both"], text: null }]), "both");
  assert.equal(deviceOf([]), null);
});

test("countsNotHers lets her own counts through and catches invented ones", () => {
  assert.deepEqual(countsNotHers("You send about 15 a week, two at a time.", "i send 15 a week"), ["two"]);
  assert.deepEqual(countsNotHers("Each one starts from your notes.", "nothing"), []);
});

test("phraseFor trusts a short phrase in her own words, and nothing else", () => {
  const hers = "rescheduling texts writing the prep list replying to buyer inquiries instagram posts";
  assert.equal(phraseFor("Rescheduling texts", "rescheduling texts", hers), "rescheduling texts");
  assert.equal(phraseFor("Writing the prep list", "prep lists", hers), "prep lists");
  assert.equal(phraseFor("Replying to buyer inquiries", "replies to buyers", hers), "replies to buyers");
  assert.equal(phraseFor("Instagram posts", "Instagram posts.", hers), "Instagram posts");
  // Starts like a verb with an object, or holds a word she never used, or is too long: not trusted.
  assert.equal(phraseFor("Writing the prep list", "writing the prep list", hers), null);
  assert.equal(phraseFor("Answering booking DMs", "answering booking DMs", "answering booking dms"), null);
  assert.equal(phraseFor("Instagram posts", "social media content", hers), null);
  assert.equal(phraseFor("Instagram posts", "posts for instagram posts and texts too", hers), null);
  assert.equal(phraseFor("Instagram posts", null, hers), null);
});

test("taskForSetup starts a name with Your, or with the task's own name", () => {
  assert.equal(taskForSetup({ task: "Rescheduling texts", phrase: "rescheduling texts" }), "Your rescheduling texts");
  assert.equal(taskForSetup({ task: "Writing the prep list", phrase: null }), "Writing the prep list");
});

test("orderMap puts her first win task first, and AI tasks next only when AI fits fewer than half", () => {
  assert.deepEqual(orderMap(map, "Window displays").map((m) => m.task), [
    "Window displays",
    "Vendor emails",
    "Schedule changes",
    "Stocking shelves",
  ]);
  const few = [
    line("Cutting hair", "cutting hair", false, false),
    line("Color", "color", false, false),
    line("Booking DMs", "booking DMs", true, false),
    line("Sweeping", "sweeping", false, false),
    line("Instagram posts", "Instagram posts", true, false),
  ];
  assert.ok(fewHelp(few));
  assert.deepEqual(orderMap(few, "Instagram posts").map((m) => m.task), [
    "Instagram posts",
    "Booking DMs",
    "Cutting hair",
    "Color",
    "Sweeping",
  ]);
  assert.ok(!fewHelp(map));
  assert.ok(!fewHelp([line("A", "a", true, false), line("B", "b", false, false)]), "exactly half is not fewer");
});

test("secondTask prefers the next task AI can help with that needs no private details", () => {
  assert.equal(secondTask(map, "Vendor emails")?.task, "Window displays");
  assert.equal(secondTask(map.slice(0, 3), "Vendor emails")?.task, "Schedule changes");
  assert.equal(secondTask(map.slice(0, 1), "Vendor emails"), null);
  assert.equal(secondTask(map, "vendor emails")?.task, "Window displays");
});

test("secondTask takes a task with a recipe before one without", () => {
  const leveled = map.map((m) => (m.task === "Schedule changes" ? { ...m, level: 3 as const, recipe: "phone_quick_replies" } : m));
  assert.equal(secondTask(leveled, "Vendor emails")?.task, "Schedule changes");
});

/** A map with levels, as withLevels gives it: rescheduling texts with a recipe, booking replies at level 2. */
const leveled: MapLine[] = [
  { ...line("Rescheduling texts", "rescheduling texts", true, false), level: 3, recipe: "phone_quick_replies" },
  { ...line("Booking replies", "booking replies", true, false), level: 2, recipe: null },
  { ...line("Answering phones", "answering phones", false, false), level: 1, recipe: null },
];

test("a task with a recipe is named by what its recipe makes of it", () => {
  assert.equal(workflowName(leveled[0]), "Your rescheduling texts, saved once on your phone");
});

test("a task with no recipe is named for what it is, written with AI, never a saved setup", () => {
  assert.equal(workflowName(leveled[1]), "Your booking replies, written with AI");
  assert.equal(workflowName({ task: "Writing the prep list", phrase: null, recipe: null }), "Writing the prep list, written with AI");
});

test("a Starter's offer lists her workflows first, and her two prep steps apart", () => {
  assert.deepEqual(offerFor({ track: "starter", tool: "claude", map: leveled, top: "Rescheduling texts", device: "phone" }), {
    setups: ["Your rescheduling texts, saved once on your phone", "Your booking replies, written with AI"],
    prep: ["Get Claude ready on your phone", "Teach Claude who you are"],
  });
  assert.equal(
    offerFor({ track: "starter", tool: "chatgpt", map: leveled, top: "Rescheduling texts", device: "both" }).prep[0],
    "Get ChatGPT ready on your phone and computer",
  );
  assert.equal(
    offerFor({ track: "starter", tool: "chatgpt", map: leveled, top: "Rescheduling texts", device: "computer" }).prep[0],
    "Get ChatGPT ready on your computer",
  );
});

test("a Builder's offer starts at the workflow, with no prep and no sign up step", () => {
  const offer = offerFor({ track: "builder", tool: "chatgpt", map: leveled, top: "Booking replies", device: null });
  assert.deepEqual(offer, {
    setups: ["Your booking replies, written with AI", "Your rescheduling texts, saved once on your phone"],
    prep: [],
  });
  assert.ok(!offer.setups.some((s) => /ready on|sign up|who you are/i.test(s)));
});

test("no offer promises a saved project, a setup or a routine a task doesn't get", () => {
  const noRecipes = leveled.map((m) => ({ ...m, level: m.ai ? (2 as const) : (1 as const), recipe: null }));
  for (const track of ["starter", "builder"] as const) {
    const { setups, prep } = offerFor({ track, tool: "claude", map: noRecipes, top: "Rescheduling texts", device: "phone" });
    const all = [...setups, ...prep];
    assert.ok(!all.some((s) => /saved project|set up|routine|right tool|saved once/i.test(s)), all.join(" | "));
    assert.ok(!all.some((s) => s.includes("Answering phones")), "a task AI can't help with is never offered");
  }
});

test("a task that waits for her company's OK is never in the offer, and the offer ends with the message to ask", () => {
  const waiting = leveled.map((m) => (m.task === "Booking replies" ? { ...m, level: null, waits: true } : m));
  const offer = offerFor({ track: "builder", tool: "claude", map: waiting, top: "Rescheduling texts", device: "phone", restricted: true });
  assert.deepEqual(offer.setups, ["Your rescheduling texts, saved once on your phone", "The message to ask what’s allowed"]);
  assert.ok(!offer.setups.some((s) => s.includes("written with AI")));
});

test("the free plan line shows only when every task in the offer has a recipe that says so", () => {
  assert.ok(!freePlanFor(leveled, "Rescheduling texts"), "booking replies has no recipe");
  assert.ok(freePlanFor(leveled.slice(0, 1), "Rescheduling texts"));
  const unknown = [{ ...leveled[0], recipe: "weekly_no_reply_list", level: 5 as const }];
  assert.ok(!freePlanFor(unknown, "Rescheduling texts"), "the recipe does not say");
});
