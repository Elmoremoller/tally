import test from "node:test";
import assert from "node:assert/strict";
import { ANSWER_MAX } from "../../lib/week";
import { experienceLabels } from "../../lib/beginner/types";
import { FALLBACK_JOB_READ } from "../../lib/beginner/copy";
import {
  ASKED_ASSUMED,
  cleanQAs,
  digest,
  mostOptions,
  PICK_MAX,
  PICKS_MAX,
  QAS_MAX,
  stepsFor,
  type JobRead,
} from "../../lib/beginner/quiz";

const read: JobRead = {
  repeats: [
    { label: "Writing quotes", ai: true },
    { label: "Attic work", ai: false },
  ],
  aiFallback: ["Answering messages", "Writing emails", "Planning my week"],
  apps: ["Email"],
  worksFor: "unclear",
};

test("mostOptions offers only her picks that AI can help with", () => {
  assert.deepEqual(mostOptions(read, ["Writing quotes", "Attic work"], null), {
    options: ["Writing quotes"],
    fallback: false,
  });
});

test("mostOptions falls back when she picked only hands on work", () => {
  assert.deepEqual(mostOptions(read, ["Attic work"], null), { options: read.aiFallback, fallback: true });
});

test("mostOptions offers what she typed under Something else", () => {
  assert.deepEqual(mostOptions(read, ["Attic work"], "Chasing payments"), {
    options: ["Chasing payments"],
    fallback: false,
  });
  assert.deepEqual(mostOptions(read, ["Writing quotes"], "Chasing payments").options, [
    "Writing quotes",
    "Chasing payments",
  ]);
});

test("mostOptions drops a pick that is no longer in the read", () => {
  assert.deepEqual(mostOptions(read, ["Old pick"], null), { options: read.aiFallback, fallback: true });
});

test("mostOptions offers at most six", () => {
  const many: JobRead = { ...read, repeats: Array.from({ length: 8 }, (_, i) => ({ label: `Task ${i}`, ai: true })) };
  assert.equal(mostOptions(many, many.repeats.map((r) => r.label), "Extra").options.length, 6);
});

test("stepsFor for someone who works for herself and hasn't tried AI", () => {
  assert.deepEqual(stepsFor({ level: "not_yet", askedCount: 2, worksForFromJob: "self", worksFor: "self" }), [
    "job", "level", "repeats", "most", "picture", "apps", "asked_1", "asked_2",
  ]);
});

test("stepsFor assumes asked screens while the AI is still writing them", () => {
  assert.equal(ASKED_ASSUMED, 3);
  assert.deepEqual(stepsFor({ level: "uses", askedCount: null, worksForFromJob: "unclear", worksFor: "employer" }), [
    "job", "level", "repeats", "most", "picture", "apps", "tools",
    "asked_1", "asked_2", "asked_3", "works_for", "policy",
  ]);
});

test("stepsFor handles no asked screens and a job that names the employer", () => {
  const none = stepsFor({ level: "tried", askedCount: 0, worksForFromJob: "self", worksFor: null });
  assert.ok(!none.some((s) => s.startsWith("asked_")));
  const employer = stepsFor({ level: "tried", askedCount: 1, worksForFromJob: "employer", worksFor: null });
  assert.ok(!employer.includes("works_for"));
  assert.ok(employer.includes("policy"));
});

test("digest joins each screen's title and answer", () => {
  const out = digest([
    { id: "repeats", title: "What do you do over and over?", picked: ["Writing quotes", "Texting homeowners"], text: null },
    { id: "picture", title: "How do you picture AI helping with it?", picked: [], text: "Quotes from my notes" },
  ]);
  assert.equal(
    out,
    "What do you do over and over? Writing quotes, Texting homeowners\nHow do you picture AI helping with it? Quotes from my notes",
  );
});

test("digest is at most ANSWER_MAX characters", () => {
  const qas = Array.from({ length: 12 }, (_, i) => ({ id: `q${i}`, title: "Title", picked: [], text: "x".repeat(1400) }));
  assert.ok(digest(qas).length <= ANSWER_MAX);
});

test("cleanQAs keeps good screens and enforces the limits", () => {
  const picked = Array.from({ length: 12 }, (_, i) => `pick ${i}`).concat(["y".repeat(PICK_MAX + 1)]);
  const out = cleanQAs([{ id: "repeats", title: "Title", picked, text: "z".repeat(ANSWER_MAX + 50) }]);
  assert.ok(out);
  assert.equal(out[0].picked.length, PICKS_MAX);
  assert.ok(out[0].picked.every((p) => p.length <= PICK_MAX));
  assert.equal(out[0].text?.length, ANSWER_MAX);
  const long = Array.from({ length: 20 }, () => ({ id: "a", title: "T", picked: [], text: null }));
  assert.equal(cleanQAs(long)?.length, QAS_MAX);
});

test("cleanQAs keeps the choices she was shown, with the same limits as picks", () => {
  const shown = Array.from({ length: 10 }, (_, i) => `choice ${i}`).concat(["y".repeat(PICK_MAX + 1)]);
  const out = cleanQAs([{ id: "repeats", title: "Title", picked: ["choice 1"], text: null, shown }]);
  assert.deepEqual(out?.[0].shown, shown.slice(0, PICKS_MAX));
  const long = cleanQAs([{ id: "most", title: "T", picked: [], text: null, shown: ["y".repeat(PICK_MAX + 1), "Ok"] }]);
  assert.deepEqual(long?.[0].shown, ["Ok"]);
});

test("cleanQAs leaves shown out when a screen had no choices", () => {
  const out = cleanQAs([{ id: "picture", title: "Title", picked: [], text: "Drafts" }]);
  assert.ok(out && !("shown" in out[0]));
});

test("cleanQAs rejects a bad id or a non array", () => {
  assert.equal(cleanQAs([{ id: "Bad Id", title: "T", picked: [], text: null }]), null);
  assert.equal(cleanQAs([{ id: "x".repeat(21), title: "T", picked: [], text: null }]), null);
  assert.equal(cleanQAs("nope"), null);
  assert.equal(cleanQAs(null), null);
});

test("the level labels and the fallback read follow the brief", () => {
  assert.equal(experienceLabels.not_yet, "I haven’t tried it yet");
  assert.equal(FALLBACK_JOB_READ.repeats.length, 5);
  assert.equal(FALLBACK_JOB_READ.aiFallback.length, 4);
  assert.equal(FALLBACK_JOB_READ.apps.length, 8);
});
