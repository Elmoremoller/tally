import test from "node:test";
import assert from "node:assert/strict";
import {
  chatTools,
  checkFirst,
  halfHours,
  hoursNobodyNotices,
  hoursText,
  profileTool,
  promptTasks,
  PROMPTS_MAX,
  shouldAsk,
  SLIDER_MAX,
  type Pile,
} from "../lib/week";

test("halfHours rounds to the nearest half hour", () => {
  assert.equal(halfHours(2.2, SLIDER_MAX), 2);
  assert.equal(halfHours(2.3, SLIDER_MAX), 2.5);
  assert.equal(halfHours(2.75, SLIDER_MAX), 3);
});

test("halfHours keeps the value between 0 and the max", () => {
  assert.equal(halfHours(-3, SLIDER_MAX), 0);
  assert.equal(halfHours(40, SLIDER_MAX), SLIDER_MAX);
  assert.equal(halfHours(9, 8), 8);
});

test("hoursNobodyNotices adds hand to AI and hand back, not keep visible", () => {
  const tasks: { pile: Pile; hours: number }[] = [
    { pile: "hand_to_ai", hours: 3 },
    { pile: "hand_back", hours: 1.5 },
    { pile: "keep_visible", hours: 4 },
  ];
  assert.equal(hoursNobodyNotices(tasks), 4.5);
  assert.equal(hoursNobodyNotices([]), 0);
});

test("hoursText uses hour for exactly one and hours otherwise", () => {
  assert.equal(hoursText(1), "1 hour");
  assert.equal(hoursText(0), "0 hours");
  assert.equal(hoursText(9), "9 hours");
  assert.equal(hoursText(0.5), "0.5 hours");
});

test("chatTools keeps only chat tools, in the chips' order", () => {
  assert.deepEqual(chatTools(["claude", "other", "chatgpt"]), ["chatgpt", "claude"]);
  assert.deepEqual(chatTools(["none_yet"]), []);
});

test("profileTool is the only chat tool picked, or null", () => {
  assert.equal(profileTool(["copilot", "other"]), "copilot");
  assert.equal(profileTool(["copilot", "gemini"]), null);
  assert.equal(profileTool(["not_sure"]), null);
  assert.equal(profileTool([]), null);
});

test("checkFirst is true only for Restricted and No idea", () => {
  assert.equal(checkFirst("restricted"), true);
  assert.equal(checkFirst("no_idea"), true);
  assert.equal(checkFirst("encouraged"), false);
  assert.equal(checkFirst("unclear"), false);
});

test("shouldAsk when the policy is not Encouraged or no chat tool was picked", () => {
  assert.equal(shouldAsk({ aiTools: ["chatgpt"], aiPolicy: "encouraged" }), false);
  assert.equal(shouldAsk({ aiTools: ["chatgpt"], aiPolicy: "unclear" }), true);
  assert.equal(shouldAsk({ aiTools: ["other"], aiPolicy: "encouraged" }), true);
  assert.equal(shouldAsk({ aiTools: ["none_yet"], aiPolicy: "encouraged" }), true);
});

test("promptTasks takes the biggest hand to AI tasks first, at most five", () => {
  const tasks = [
    { id: "a", pile: "hand_to_ai" as Pile, hours: 1 },
    { id: "b", pile: "hand_back" as Pile, hours: 9 },
    { id: "c", pile: "hand_to_ai" as Pile, hours: 4 },
    { id: "d", pile: "hand_to_ai" as Pile, hours: 2 },
    { id: "e", pile: "hand_to_ai" as Pile, hours: 3 },
    { id: "f", pile: "hand_to_ai" as Pile, hours: 0.5 },
    { id: "g", pile: "hand_to_ai" as Pile, hours: 5 },
    { id: "h", pile: "keep_visible" as Pile, hours: 6 },
  ];
  const picked = promptTasks(tasks);
  assert.equal(picked.length, PROMPTS_MAX);
  assert.deepEqual(
    picked.map((t) => t.id),
    ["g", "c", "e", "d", "a"],
  );
  assert.equal(tasks[0].id, "a", "the original list is not reordered");
});
