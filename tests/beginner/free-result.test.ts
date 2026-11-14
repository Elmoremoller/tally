import test from "node:test";
import assert from "node:assert/strict";
import {
  blanksIn,
  countsNotHers,
  deviceOf,
  exampleOf,
  fewHelp,
  orderMap,
  phraseFor,
  secondTask,
  setupsFor,
  setupTasks,
  taskForSetup,
  TIME_PROMISE,
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

test("deviceOf reads where she would use AI most, by its label", () => {
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

test("taskForSetup and setupTasks start a setup name with Your, or with the task's own name", () => {
  assert.equal(taskForSetup({ task: "Rescheduling texts", phrase: "rescheduling texts" }), "Your rescheduling texts");
  assert.equal(taskForSetup({ task: "Writing the prep list", phrase: null }), "Writing the prep list");
  const withPhrases = map.map((m) => ({ ...m, phrase: m.task === "Window displays" ? null : m.phrase }));
  assert.deepEqual(setupTasks(withPhrases, "Vendor emails"), { top: "Your vendor emails", second: "Window displays" });
  assert.deepEqual(setupTasks(withPhrases.slice(0, 1), "Vendor emails"), { top: "Your vendor emails", second: null });
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

test("a Starter's setups follow Karl's pattern, with her tasks mid sentence", () => {
  const setups = setupsFor({ track: "starter", tool: "claude", top: "Your rescheduling texts", second: "Your appointment reminders", device: "phone" });
  assert.deepEqual(setups, [
    "Get Claude ready on your phone",
    "Your rescheduling texts, set up",
    "Teach Claude who you are",
    "Your appointment reminders, set up",
  ]);
  assert.equal(
    setupsFor({ track: "starter", tool: "chatgpt", top: "Your vendor emails", second: null, device: null })[0],
    "Get ChatGPT ready on your phone and computer",
  );
  assert.equal(setupsFor({ track: "starter", tool: "chatgpt", top: "Your vendor emails", second: null, device: null }).length, 3);
});

test("a Builder's setups name the kind of setup and never a sign up step", () => {
  const setups = setupsFor({ track: "builder", tool: "chatgpt", top: "Your Instagram posts", second: "Your booking DMs", device: null });
  assert.deepEqual(setups, [
    "Your Instagram posts, as a saved project",
    "Test it on three real ones",
    "Your booking DMs, with the right tool",
    "Turn it into a routine you reuse",
  ]);
  assert.ok(!setups.some((s) => /ready on|sign up|who you are/i.test(s)));
});

test("every setups list names her top task, so the paywall names her tasks", () => {
  for (const track of ["starter", "builder"] as const) {
    const setups = setupsFor({ track, tool: "claude", top: "Your vendor emails", second: null, device: "computer" });
    assert.ok(setups.some((s) => s.includes("Your vendor emails")), track);
    const named = setupsFor({ track, tool: "claude", top: "Writing the prep list", second: null, device: null });
    assert.ok(named.some((s) => s.startsWith("Writing the prep list, ")), track);
  }
});
