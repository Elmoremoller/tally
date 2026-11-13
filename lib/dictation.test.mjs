// Run with: node --test lib/dictation.test.mjs
// Checks the rules for Talk instead of typing: what is kept when the browser stops listening on its own, when
// to start listening again, and when to give up and say why.

import assert from "node:assert/strict";
import { test } from "node:test";
import { afterSession, heardText, newTalk, speechLanguage, withSpoken } from "./dictation.ts";

const results = (...phrases) => phrases.map((transcript) => ({ isFinal: true, 0: { transcript } }));
/** One listening session ending the way the browser ends it: not stopped by her, no error, after a few seconds. */
const ended = (over = {}) => ({ heard: "", error: null, ms: 6000, stopped: false, ...over });

test("words from one session are joined in order", () => {
  assert.equal(heardText(results("I run the office", "and do the invoices")), "I run the office and do the invoices");
});

test("what she said goes after what she had typed", () => {
  assert.equal(withSpoken("Office manager.", "I do the invoices", 100), "Office manager. I do the invoices");
});

test("when the browser stops listening after a pause, listening starts again", () => {
  const step = afterSession(newTalk(), ended({ heard: "I run the office" }));
  assert.equal(step.restart, true);
  assert.equal(step.problem, null);
});

test("words from before the pause are kept, and the next session's words follow them", () => {
  const first = afterSession(newTalk(), ended({ heard: "I run the office" }));
  const second = afterSession(first.talk, ended({ heard: "and do the invoices" }));
  assert.equal(first.talk.kept, "I run the office");
  assert.equal(second.talk.kept, "I run the office and do the invoices");
});

test("one silent stretch in the middle of an answer starts listening again without a complaint", () => {
  const spoke = afterSession(newTalk(), ended({ heard: "I run the office" }));
  const quiet = afterSession(spoke.talk, ended({ error: "no-speech" }));
  assert.equal(quiet.restart, true);
  assert.equal(quiet.problem, null);
  assert.equal(quiet.talk.kept, "I run the office");
});

test("two silent stretches in a row after she has spoken stop listening quietly", () => {
  const spoke = afterSession(newTalk(), ended({ heard: "I run the office" }));
  const quiet = afterSession(spoke.talk, ended({ error: "no-speech" }));
  const stillQuiet = afterSession(quiet.talk, ended({ error: "no-speech" }));
  assert.equal(stillQuiet.restart, false);
  assert.equal(stillQuiet.problem, null);
});

test("speaking again after a silent stretch resets the count", () => {
  let step = afterSession(newTalk(), ended({ error: "no-speech" }));
  step = afterSession(step.talk, ended({ heard: "I run the office" }));
  step = afterSession(step.talk, ended({ error: "no-speech" }));
  assert.equal(step.restart, true);
});

test("a slow starter gets a second chance before being told nothing was heard", () => {
  const once = afterSession(newTalk(), ended({ error: "no-speech" }));
  assert.equal(once.restart, true);
  const twice = afterSession(once.talk, ended({ error: "no-speech" }));
  assert.equal(twice.restart, false);
  assert.equal(twice.problem, "silent");
});

test("a browser that keeps stopping at once without hearing anything is reported as not working", () => {
  const once = afterSession(newTalk(), ended({ ms: 40 }));
  const twice = afterSession(once.talk, ended({ ms: 40 }));
  assert.equal(twice.restart, false);
  assert.equal(twice.problem, "failed");
});

test("tapping Done stops listening and keeps the last words", () => {
  const spoke = afterSession(newTalk(), ended({ heard: "I run the office" }));
  const done = afterSession(spoke.talk, ended({ heard: "and do the invoices", stopped: true }));
  assert.equal(done.restart, false);
  assert.equal(done.problem, null);
  assert.equal(done.talk.kept, "I run the office and do the invoices");
});

test("a blocked microphone on the first try is reported", () => {
  const step = afterSession(newTalk(), ended({ error: "not-allowed", ms: 20 }));
  assert.equal(step.restart, false);
  assert.equal(step.problem, "blocked");
});

test("a browser that won't start again without a tap stops quietly and keeps her words", () => {
  const spoke = afterSession(newTalk(), ended({ heard: "I run the office" }));
  const refused = afterSession(spoke.talk, ended({ error: "not-allowed", ms: 20 }));
  assert.equal(refused.restart, false);
  assert.equal(refused.problem, null);
  assert.equal(refused.talk.kept, "I run the office");
});

test("a lost connection is reported instead of starting again", () => {
  const step = afterSession(newTalk(), ended({ heard: "I run the office", error: "network" }));
  assert.equal(step.restart, false);
  assert.equal(step.problem, "failed");
});

test("a browser set to another kind of English is listened to in that English", () => {
  assert.equal(speechLanguage("en-GB"), "en-GB");
  assert.equal(speechLanguage("en-AU"), "en-AU");
});

test("a browser set to another language, or to none, is listened to in US English", () => {
  assert.equal(speechLanguage("sv-SE"), "en-US");
  assert.equal(speechLanguage("en"), "en-US");
  assert.equal(speechLanguage(undefined), "en-US");
});
