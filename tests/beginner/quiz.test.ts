import test from "node:test";
import assert from "node:assert/strict";
import { ANSWER_MAX } from "../../lib/week";
import { experienceLabels } from "../../lib/beginner/types";
import { FALLBACK_JOB_READ } from "../../lib/beginner/copy";
import { repeatsLine } from "../../lib/beginner/quiz-copy";
import {
  aiHelpCount,
  ASKED_ASSUMED,
  cleanQAs,
  digest,
  hasKind,
  levelWords,
  repeatChoices,
  REPEATS_SHOWN,
  toggleKind,
  mostOptions,
  skipsMost,
  softwareOptions,
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
  apps: ["Outlook", "QuickBooks", "excel"],
  aiUses: ["Quotes", "Customer texts", "Job notes"],
  worksFor: "unclear",
};

test("mostOptions offers every pick she made, hands on work included", () => {
  assert.deepEqual(mostOptions(read, ["Writing quotes", "Attic work"], null), {
    options: ["Writing quotes", "Attic work"],
    fallback: false,
  });
});

test("repeatChoices fills the screen with everyday work after her job's, each once", () => {
  const choices = repeatChoices(read);
  assert.equal(choices.length, REPEATS_SHOWN);
  assert.deepEqual(choices.slice(0, 2), read.repeats);
  assert.ok(choices.slice(2).every((c) => c.ai));
  const thin: JobRead = { ...read, repeats: [{ label: "writing emails", ai: true }] };
  assert.equal(repeatChoices(thin).filter((c) => c.label.toLowerCase() === "writing emails").length, 1);
});

test("toggleKind adds a kind of work to her answer and takes it out again", () => {
  assert.equal(toggleKind("", "Teaching"), "Teaching");
  assert.equal(toggleKind("Fourth grade.", "Teaching"), "Fourth grade, Teaching");
  assert.equal(toggleKind("Teaching, Office and admin", "Teaching"), "Office and admin");
  assert.equal(toggleKind("Fourth grade, teaching", "Teaching"), "Fourth grade");
  assert.ok(hasKind("Fourth grade, Teaching", "Teaching"));
  assert.ok(!hasKind("Teaching assistant", "Teaching"));
});

test("skipsMost skips a list of one, never the fallback list", () => {
  assert.equal(skipsMost(mostOptions(read, ["Writing quotes"], null)), true);
  assert.equal(skipsMost(mostOptions(read, ["Attic work"], "Chasing payments")), false);
  assert.equal(skipsMost(mostOptions(read, ["Attic work"], null)), false);
  assert.equal(skipsMost({ options: ["One"], fallback: true }), false);
});

test("softwareOptions puts the job's software first, then the everyday set, each once whatever its case", () => {
  const names = softwareOptions(read);
  assert.deepEqual(names.slice(0, 3), ["Outlook", "QuickBooks", "excel"]);
  assert.equal(names.filter((n) => n.toLowerCase() === "excel").length, 1);
  assert.equal(names.filter((n) => n === "Outlook").length, 1);
  assert.ok(names.includes("Google Drive") && names.includes("Teams"));
});

test("levelWords still reads her own words on answers saved before that row went", () => {
  assert.equal(levelWords([{ id: "level", title: "T", picked: [], text: "I use it to plan meals" }]), "I use it to plan meals");
  assert.equal(levelWords([{ id: "level", title: "T", picked: ["I use it"], text: null }]), null);
});

test("mostOptions falls back when she picked only hands on work", () => {
  assert.deepEqual(mostOptions(read, ["Attic work"], null), { options: read.aiFallback, fallback: true });
});

test("mostOptions offers what she typed under Something else", () => {
  assert.deepEqual(mostOptions(read, ["Attic work"], "Chasing payments"), {
    options: ["Attic work", "Chasing payments"],
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

const starter = (level: "not_yet" | "tried") => stepsFor({ level, askedCount: null, worksForFromJob: "unclear" });
const builder = (level: "uses" | "heavy") => stepsFor({ level, askedCount: null, worksForFromJob: "unclear" });

test("a Starter sees at most 8 screens, in order", () => {
  for (const level of ["not_yet", "tried"] as const) {
    assert.deepEqual(starter(level), ["job", "level", "repeats", "most", "example", "device", "asked_1", "can_use"]);
    assert.ok(starter(level).length <= 8);
  }
});

test("a Builder sees at most 10 screens, in order", () => {
  for (const level of ["uses", "heavy"] as const) {
    assert.deepEqual(builder(level), [
      "job", "level", "done", "tools", "repeats", "most", "example", "apps", "asked_1", "can_use",
    ]);
    assert.ok(builder(level).length <= 10);
  }
});

test("only the example screen is typed after her job", () => {
  const typed = new Set(["job", "example"]);
  for (const steps of [starter("tried"), builder("uses")]) {
    assert.deepEqual(steps.filter((s) => typed.has(s)), ["job", "example"]);
  }
});

test("Starters never see the Builder screens, and Builders never see phone or computer", () => {
  for (const s of ["done", "tools", "apps"] as const) assert.ok(!starter("not_yet").includes(s));
  assert.ok(!builder("heavy").includes("device"));
});

test("the screens that are gone stay gone", () => {
  for (const steps of [starter("not_yet"), starter("tried"), builder("uses"), builder("heavy")]) {
    for (const gone of ["held_back", "picture", "ai_uses", "works_for", "policy"]) {
      assert.ok(!(steps as string[]).includes(gone), gone);
    }
  }
});

test("stepsFor assumes one asked screen while the AI writes it, and never more than one", () => {
  assert.equal(ASKED_ASSUMED, 1);
  assert.equal(stepsFor({ level: "uses", askedCount: 3, worksForFromJob: null }).filter((s) => s.startsWith("asked_")).length, 1);
  assert.ok(!stepsFor({ level: "tried", askedCount: 0, worksForFromJob: null }).some((s) => s.startsWith("asked_")));
});

test("Can you use AI for your work is left out when her job said she works for herself", () => {
  assert.ok(!stepsFor({ level: "tried", askedCount: 1, worksForFromJob: "self" }).includes("can_use"));
  assert.ok(stepsFor({ level: "tried", askedCount: 1, worksForFromJob: "employer" }).includes("can_use"));
});

test("stepsFor leaves out most when told to", () => {
  assert.ok(!stepsFor({ level: "tried", askedCount: 1, worksForFromJob: null, skipMost: true }).includes("most"));
});

test("aiHelpCount counts her picks AI can help with, and leaves out what she typed", () => {
  assert.deepEqual(aiHelpCount(read, ["Writing quotes", "Attic work"]), { helps: 1, picked: 2 });
  assert.deepEqual(aiHelpCount(read, ["Writing quotes", "Writing emails", "Something she typed"]), { helps: 2, picked: 2 });
  assert.deepEqual(aiHelpCount(read, []), { helps: 0, picked: 0 });
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
  const picked = Array.from({ length: PICKS_MAX + 4 }, (_, i) => `pick ${i}`).concat(["y".repeat(PICK_MAX + 1)]);
  const out = cleanQAs([{ id: "repeats", title: "Title", picked, text: "z".repeat(ANSWER_MAX + 50) }]);
  assert.ok(out);
  assert.equal(out[0].picked.length, PICKS_MAX);
  assert.ok(out[0].picked.every((p) => p.length <= PICK_MAX));
  assert.equal(out[0].text?.length, ANSWER_MAX);
  const long = Array.from({ length: 20 }, () => ({ id: "a", title: "T", picked: [], text: null }));
  assert.equal(cleanQAs(long)?.length, QAS_MAX);
});

test("cleanQAs keeps the choices she was shown, with the same limits as picks", () => {
  const shown = Array.from({ length: PICKS_MAX + 2 }, (_, i) => `choice ${i}`).concat(["y".repeat(PICK_MAX + 1)]);
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

test("the level labels follow DIRECTION.md and the fallback read follows the brief", () => {
  assert.deepEqual(Object.values(experienceLabels), [
    "Never used it",
    "Tried it a few times",
    "Use it some weeks",
    "Use it most days",
  ]);
  assert.equal(FALLBACK_JOB_READ.repeats.length, 5);
  assert.equal(FALLBACK_JOB_READ.aiFallback.length, 4);
  assert.equal(FALLBACK_JOB_READ.apps.length, 6);
  assert.equal(softwareOptions(FALLBACK_JOB_READ).length, 14);
});

test("repeatsLine reads well for any count, and says nothing when AI can help with none", () => {
  assert.equal(repeatsLine(3, 5), "AI can help with 3 of these 5");
  assert.equal(repeatsLine(2, 2), "AI can help with both of these");
  assert.equal(repeatsLine(4, 4), "AI can help with all 4 of these");
  assert.equal(repeatsLine(1, 1), "AI can help with this one");
  assert.equal(repeatsLine(1, 3), "AI can help with 1 of these 3");
  assert.equal(repeatsLine(0, 2), null);
  assert.equal(repeatsLine(0, 0), null);
});
