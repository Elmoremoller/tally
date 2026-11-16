import test from "node:test";
import assert from "node:assert/strict";
import { ANSWER_MAX } from "../../lib/week";
import { experienceLabels } from "../../lib/beginner/types";
import { FALLBACK_JOB_READ } from "../../lib/beginner/copy";
import {
  cleanQAs,
  digest,
  hasKind,
  HERS_SHOWN,
  levelWords,
  repeatChoices,
  REPEATS_SHOWN,
  toggleKind,
  mostOptions,
  PICK_MAX,
  PICKS_MAX,
  QAS_MAX,
  stepsFor,
  whereOptions,
  type JobRead,
} from "../../lib/beginner/quiz";

const read: JobRead = {
  hers: ["Ordering lunch", "Restocking the fridges"],
  usual: ["Office supplies", "Event preparations", "Visitor welcome", "Supplier emails", "Repairs and fixes", "Meeting rooms", "Mail and parcels", "Desk moves"],
  apps: ["Outlook", "QuickBooks", "excel"],
  worksFor: "unclear",
};

test("repeatChoices shows her own responsibilities first, then fills to 8 with usual ones (Karl, 2026-11-16)", () => {
  const choices = repeatChoices(read);
  assert.equal(REPEATS_SHOWN, 8);
  assert.equal(choices.length, 8);
  assert.deepEqual(choices.slice(0, 2), [
    { label: "Ordering lunch", group: "hers" },
    { label: "Restocking the fridges", group: "hers" },
  ]);
  assert.ok(choices.slice(2).every((c) => c.group === "usual"));
});

test("repeatChoices takes at most 5 of hers, and every choice once whatever its case", () => {
  assert.equal(HERS_SHOWN, 5);
  const many: JobRead = { ...read, hers: ["A one", "B one", "C one", "D one", "E one", "F one"], usual: ["a one", "G one", "H one", "I one"] };
  const choices = repeatChoices(many);
  assert.deepEqual(choices.filter((c) => c.group === "hers").map((c) => c.label), ["A one", "B one", "C one", "D one", "E one"]);
  assert.deepEqual(choices.filter((c) => c.group === "usual").map((c) => c.label), ["G one", "H one", "I one"]);
});

test("repeatChoices with none of hers shows 8 usual ones, and the fixed list shows its four", () => {
  assert.equal(repeatChoices({ ...read, hers: [] }).length, 8);
  assert.equal(repeatChoices(FALLBACK_JOB_READ).length, 4);
});

test("mostOptions offers every pick she made in the order of the screen, then what she typed", () => {
  assert.deepEqual(mostOptions(read, ["Restocking the fridges", "Ordering lunch"], null), ["Ordering lunch", "Restocking the fridges"]);
  assert.deepEqual(mostOptions(read, ["Ordering lunch"], "Plants"), ["Ordering lunch", "Plants"]);
  assert.deepEqual(mostOptions(read, ["Ordering lunch"], "ordering LUNCH"), ["Ordering lunch"]);
  assert.deepEqual(mostOptions(read, ["Old pick"], null), []);
});

test("toggleKind adds a kind of work to her answer and takes it out again", () => {
  assert.equal(toggleKind("", "Teaching"), "Teaching");
  assert.equal(toggleKind("Fourth grade.", "Teaching"), "Fourth grade, Teaching");
  assert.equal(toggleKind("Teaching, Office and admin", "Teaching"), "Office and admin");
  assert.equal(toggleKind("Fourth grade, teaching", "Teaching"), "Fourth grade");
  assert.ok(hasKind("Fourth grade, Teaching", "Teaching"));
  assert.ok(!hasKind("Teaching assistant", "Teaching"));
});

test("whereOptions puts the job's apps first, then the fixed places, each once whatever its case", () => {
  const names = whereOptions(read);
  assert.deepEqual(names.slice(0, 3), ["Outlook", "QuickBooks", "excel"]);
  assert.equal(names.filter((n) => n === "Outlook").length, 1);
  for (const place of ["Text messages", "Gmail", "Google Sheets", "Instagram", "A work system", "Paper", "In person"]) {
    assert.ok(names.includes(place), place);
  }
});

test("levelWords still reads her own words on answers saved before that row went", () => {
  assert.equal(levelWords([{ id: "level", title: "T", picked: [], text: "I use it to plan meals" }]), "I use it to plan meals");
  assert.equal(levelWords([{ id: "level", title: "T", picked: ["I use it"], text: null }]), null);
});

const starter = (level: "not_yet" | "tried") => stepsFor({ level, worksForFromJob: "unclear" });
const builder = (level: "uses" | "heavy") => stepsFor({ level, worksForFromJob: "unclear" });

test("a Starter sees at most 7 screens, in order, with the connect question last (Phase 8)", () => {
  for (const level of ["not_yet", "tried"] as const) {
    assert.deepEqual(starter(level), ["job", "level", "repeats", "most", "where", "can_use", "connect"]);
    assert.ok(starter(level).length <= 7);
  }
});

test("a Builder sees at most 9 screens, in order, with the connect question last (Phase 8)", () => {
  for (const level of ["uses", "heavy"] as const) {
    assert.deepEqual(builder(level), ["job", "level", "done", "tools", "repeats", "most", "where", "can_use", "connect"]);
    assert.ok(builder(level).length <= 9);
  }
});

test("the connect question is only for Yes or Not sure on Can you use AI for your work", () => {
  const withAnswer = (canUse: "yes" | "not_sure" | "restricted" | "self") => stepsFor({ level: "tried", worksForFromJob: "employer", canUse });
  assert.ok(withAnswer("yes").includes("connect"));
  assert.ok(withAnswer("not_sure").includes("connect"));
  assert.ok(!withAnswer("restricted").includes("connect"));
  assert.ok(!withAnswer("self").includes("connect"));
  assert.ok(!stepsFor({ level: "uses", worksForFromJob: "self" }).includes("connect"));
});

test("only her job is typed: the real example and the question the AI wrote are gone (Phase 8)", () => {
  for (const steps of [starter("tried"), builder("uses")]) {
    assert.ok(!(steps as string[]).includes("example"));
    assert.ok(!steps.some((s) => s.startsWith("asked_")));
  }
});

test("Starters never see the Builder screens, and everyone sees where her work happens", () => {
  for (const s of ["done", "tools"] as const) assert.ok(!starter("not_yet").includes(s));
  for (const steps of [starter("tried"), builder("heavy")]) assert.ok(steps.includes("where"));
});

test("the screens that are gone stay gone", () => {
  for (const steps of [starter("not_yet"), starter("tried"), builder("uses"), builder("heavy")]) {
    for (const gone of ["held_back", "picture", "ai_uses", "works_for", "policy", "apps", "device", "example", "asked_1"]) {
      assert.ok(!(steps as string[]).includes(gone), gone);
    }
  }
});

test("Can you use AI for your work is left out when her job said she works for herself", () => {
  assert.ok(!stepsFor({ level: "tried", worksForFromJob: "self" }).includes("can_use"));
  assert.ok(stepsFor({ level: "tried", worksForFromJob: "employer" }).includes("can_use"));
});

test("the most wanted screen is always shown, since how often is asked there", () => {
  for (const steps of [starter("tried"), builder("uses")]) assert.ok(steps.includes("most"));
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
  assert.equal(FALLBACK_JOB_READ.hers.length, 0);
  assert.equal(FALLBACK_JOB_READ.usual.length, 4, "the four fixed choices stay only as the fallback");
  assert.equal(FALLBACK_JOB_READ.apps.length, 6);
  assert.equal(whereOptions(FALLBACK_JOB_READ).length, 12, "Instagram shows once, and Texts is the same as Text messages");
  assert.ok(!whereOptions(FALLBACK_JOB_READ).includes("Texts"));
});
