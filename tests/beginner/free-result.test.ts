import test from "node:test";
import assert from "node:assert/strict";
import { blanksIn, deviceOf, exampleOf, secondTask, setupsFor, TIME_PROMISE } from "../../lib/beginner/free-result";
import type { MapLine } from "../../lib/beginner/types";

const map: MapLine[] = [
  { task: "Vendor emails", line: "Becomes a saved project.", ai: true, private: false },
  { task: "Schedule changes", line: "Becomes a reply you reuse.", ai: true, private: true },
  { task: "Stocking shelves", line: "Stays yours.", ai: false, private: false },
  { task: "Window displays", line: "Becomes a plan for each season.", ai: true, private: false },
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

test("secondTask prefers the next task AI can help with that needs no private details", () => {
  assert.equal(secondTask(map, "Vendor emails"), "Window displays");
  assert.equal(secondTask(map.slice(0, 3), "Vendor emails"), "Schedule changes");
  assert.equal(secondTask(map.slice(0, 1), "Vendor emails"), null);
  assert.equal(secondTask(map, "vendor emails"), "Window displays");
});

test("a Starter's setups name her tool, where she uses it, and her own tasks", () => {
  const setups = setupsFor({ track: "starter", tool: "claude", top: "Vendor emails", second: "Window displays", device: "phone" });
  assert.deepEqual(setups, [
    "Claude ready on your phone",
    "Vendor emails, done by you",
    "Claude taught who you are",
    "Window displays, from your week",
  ]);
  assert.equal(
    setupsFor({ track: "starter", tool: "chatgpt", top: "Vendor emails", second: null, device: null })[0],
    "ChatGPT ready on your phone and computer",
  );
  assert.equal(setupsFor({ track: "starter", tool: "chatgpt", top: "Vendor emails", second: null, device: null }).length, 3);
});

test("a Builder's setups name her tasks and never a sign up step", () => {
  const setups = setupsFor({ track: "builder", tool: "chatgpt", top: "Vendor emails", second: "Window displays", device: null });
  assert.deepEqual(setups, [
    "Vendor emails, as a saved project",
    "Your project tested on three real ones",
    "Window displays, with the right approach",
    "A routine you can reuse",
  ]);
  assert.ok(!setups.some((s) => /ready on|sign up|taught who/i.test(s)));
});

test("every setups list names her top task, so the paywall names her tasks", () => {
  for (const track of ["starter", "builder"] as const) {
    const setups = setupsFor({ track, tool: "claude", top: "Vendor emails", second: null, device: "computer" });
    assert.ok(setups.some((s) => s.includes("Vendor emails")), track);
  }
});
