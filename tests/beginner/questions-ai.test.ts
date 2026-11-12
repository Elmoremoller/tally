import test from "node:test";
import assert from "node:assert/strict";
import { checkJobRead, checkQuestions, readJob, writeQuestions } from "../../lib/beginner/questions-ai";

const repeat = (label: string, ai = true) => ({ label, ai });

const goodRead = () => ({
  repeats: [
    repeat("Writing quotes"),
    repeat("Texting homeowners"),
    repeat("Chasing payments"),
    repeat("Attic work", false),
  ],
  aiFallback: ["Quote templates", "Payment reminder texts", "Review requests"],
  apps: ["Texts", "QuickBooks", "Google Business", "Gmail"],
  worksFor: "self",
});

test("checkJobRead accepts a read inside the limits", () => {
  assert.deepEqual(checkJobRead(goodRead()), goodRead());
});

test("checkJobRead accepts 6 repeats, 4 fallbacks and 8 apps, and cuts what goes past", () => {
  const raw = {
    ...goodRead(),
    repeats: ["One", "Two", "Three", "Four", "Five", "Six", "Seven"].map((l) => repeat(l)),
    aiFallback: ["A", "B", "C", "D", "E"],
    apps: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
  };
  const read = checkJobRead(raw);
  assert.equal(read?.repeats.length, 6);
  assert.deepEqual(read?.aiFallback, ["A", "B", "C", "D"]);
  assert.equal(read?.apps.length, 8);
});

test("checkJobRead takes every known worksFor", () => {
  for (const worksFor of ["self", "employer", "both", "unclear"]) {
    assert.equal(checkJobRead({ ...goodRead(), worksFor })?.worksFor, worksFor);
  }
});

test("checkJobRead returns null for 3 repeats", () => {
  assert.equal(checkJobRead({ ...goodRead(), repeats: goodRead().repeats.slice(0, 3) }), null);
});

test("checkJobRead returns null for a repeat without a boolean ai", () => {
  const repeats = [...goodRead().repeats, { label: "Ordering parts", ai: "yes" }];
  assert.equal(checkJobRead({ ...goodRead(), repeats }), null);
  const missing = [...goodRead().repeats, { label: "Ordering parts" }];
  assert.equal(checkJobRead({ ...goodRead(), repeats: missing }), null);
});

test("checkJobRead returns null for an unknown worksFor", () => {
  assert.equal(checkJobRead({ ...goodRead(), worksFor: "freelance" }), null);
});

test("checkJobRead returns null for junk", () => {
  assert.equal(checkJobRead(null), null);
  assert.equal(checkJobRead("Writing quotes"), null);
  assert.equal(checkJobRead({}), null);
});

test("checkJobRead takes dashes and hyphens out of labels", () => {
  const repeats = [repeat("Follow-ups — homeowners"), ...goodRead().repeats];
  assert.equal(checkJobRead({ ...goodRead(), repeats })?.repeats[0].label, "Follow ups, homeowners");
});

test("checkJobRead drops a label over 4 words, and returns null when that leaves too few", () => {
  const long = repeat("Writing quotes for new homeowners");
  const read = checkJobRead({ ...goodRead(), repeats: [long, ...goodRead().repeats] });
  assert.deepEqual(
    read?.repeats.map((r) => r.label),
    ["Writing quotes", "Texting homeowners", "Chasing payments", "Attic work"],
  );
  assert.equal(checkJobRead({ ...goodRead(), repeats: [long, ...goodRead().repeats.slice(0, 3)] }), null);
});

test("checkJobRead keeps a duplicate label once, whatever its case", () => {
  const repeats = [...goodRead().repeats, repeat("writing QUOTES", false), repeat("Ordering parts")];
  assert.deepEqual(
    checkJobRead({ ...goodRead(), repeats })?.repeats,
    [...goodRead().repeats, repeat("Ordering parts")],
  );
});

test("checkJobRead drops Something else and Other, since the quiz adds its own", () => {
  const apps = [...goodRead().apps, "Something else", "Other"];
  assert.deepEqual(checkJobRead({ ...goodRead(), apps })?.apps, goodRead().apps);
});

test("checkJobRead returns null when fallbacks or apps fall short", () => {
  assert.equal(checkJobRead({ ...goodRead(), aiFallback: ["Quote templates", "Review requests"] }), null);
  assert.equal(checkJobRead({ ...goodRead(), apps: ["Texts", "QuickBooks", "Gmail"] }), null);
  assert.equal(
    checkJobRead({ ...goodRead(), aiFallback: ["A", "B", "Texts to every new homeowner"] }),
    null,
  );
});

const tap = (title: string, choices = ["Text", "Email", "Paper", "An app"]) => ({
  title,
  kind: "one",
  choices,
  hint: null,
});
const talk = (title: string) => ({ title, kind: "text", choices: [], hint: null });

test("checkQuestions numbers the questions it keeps in order", () => {
  const questions = checkQuestions({
    questions: [tap("How do you send a quote today?"), { ...tap("What held you back?"), kind: "many" }],
  });
  assert.deepEqual(questions, [
    { id: "asked_1", title: "How do you send a quote today?", kind: "one", choices: ["Text", "Email", "Paper", "An app"], hint: null },
    { id: "asked_2", title: "What held you back?", kind: "many", choices: ["Text", "Email", "Paper", "An app"], hint: null },
  ]);
});

test("checkQuestions keeps at most 4", () => {
  const questions = checkQuestions({ questions: ["A?", "B?", "C?", "D?", "E?"].map((t) => tap(t)) });
  assert.deepEqual(
    questions.map((q) => [q.id, q.title]),
    [
      ["asked_1", "A?"],
      ["asked_2", "B?"],
      ["asked_3", "C?"],
      ["asked_4", "D?"],
    ],
  );
});

test("checkQuestions drops a title over 10 words or not ending in a question mark", () => {
  const questions = checkQuestions({
    questions: [
      tap("How do you usually send a quote to a new homeowner today?"),
      tap("Tell us how you send quotes"),
      tap("How do you send a quote?"),
      tap("What slows you down most?"),
    ],
  });
  assert.deepEqual(
    questions.map((q) => [q.id, q.title]),
    [
      ["asked_1", "How do you send a quote?"],
      ["asked_2", "What slows you down most?"],
    ],
  );
});

test("checkQuestions drops a title with a colon", () => {
  const questions = checkQuestions({
    questions: [tap("Quotes: how do you send them?"), tap("A?"), tap("B?")],
  });
  assert.deepEqual(questions.map((q) => q.title), ["A?", "B?"]);
});

test("checkQuestions drops tap questions with fewer than 3 or more than 6 choices", () => {
  const questions = checkQuestions({
    questions: [
      tap("Two?", ["Text", "Email"]),
      { ...tap("Seven?", ["1", "2", "3", "4", "5", "6", "7"]), kind: "many" },
      tap("Three?", ["Text", "Email", "Paper"]),
      { ...tap("Six?", ["1", "2", "3", "4", "5", "6"]), kind: "many" },
    ],
  });
  assert.deepEqual(questions.map((q) => q.title), ["Three?", "Six?"]);
});

test("checkQuestions cleans choices before counting them", () => {
  const questions = checkQuestions({
    questions: [
      tap("Dupes?", ["Text", "text", "Email", "Something else"]),
      tap("Long?", ["Text", "Email", "Paper", "A paper form I fill in"]),
      tap("Dashes?", ["Follow-ups", "Texts — mostly", "Calls"]),
      tap("A?"),
    ],
  });
  assert.deepEqual(
    questions.map((q) => [q.title, q.choices]),
    [
      ["Long?", ["Text", "Email", "Paper"]],
      ["Dashes?", ["Follow ups", "Texts, mostly", "Calls"]],
      ["A?", ["Text", "Email", "Paper", "An app"]],
    ],
  );
});

test("checkQuestions keeps only the first type or talk question and gives it no choices", () => {
  const questions = checkQuestions({
    questions: [
      { ...talk("What would you hand off first?"), choices: ["Quotes", "Invoices", "Texts"] },
      tap("How do you send a quote?"),
      talk("What feels slow?"),
    ],
  });
  assert.deepEqual(questions, [
    { id: "asked_1", title: "What would you hand off first?", kind: "text", choices: [], hint: null },
    { id: "asked_2", title: "How do you send a quote?", kind: "one", choices: ["Text", "Email", "Paper", "An app"], hint: null },
  ]);
});

test("checkQuestions drops an unknown kind", () => {
  const questions = checkQuestions({ questions: [{ ...tap("Scale?"), kind: "slider" }, tap("A?"), tap("B?")] });
  assert.deepEqual(questions.map((q) => q.title), ["A?", "B?"]);
});

test("checkQuestions returns nothing when fewer than 2 survive", () => {
  assert.deepEqual(checkQuestions({ questions: [tap("How do you send a quote?"), tap("No question mark")] }), []);
  assert.deepEqual(checkQuestions({ questions: [] }), []);
  assert.deepEqual(checkQuestions(null), []);
  assert.deepEqual(checkQuestions({ questions: "A?" }), []);
});

test("checkQuestions keeps a short hint and turns one over 120 characters into null", () => {
  const questions = checkQuestions({
    questions: [
      { ...tap("A?"), hint: "Any guess is fine." },
      { ...tap("B?"), hint: "x".repeat(121) },
      { ...tap("C?"), hint: 42 },
    ],
  });
  assert.deepEqual(questions.map((q) => q.hint), ["Any guess is fine.", null, null]);
});

test("readJob and writeQuestions give up quietly when the call isn't allowed", async () => {
  assert.equal(await readJob("Electrician", { allowCall: async () => false }), null);
  const input = { job: "Electrician", experience: "tried" as const, qas: [], mostWanted: [] };
  assert.deepEqual(await writeQuestions(input, { allowCall: async () => false }), []);
});

test("readJob and writeQuestions never throw, even when the allowance check does", async () => {
  const allowCall = async (): Promise<boolean> => {
    throw new Error("database down");
  };
  assert.equal(await readJob("Electrician", { allowCall }), null);
  const input = { job: "Electrician", experience: "uses" as const, qas: [], mostWanted: [] };
  assert.deepEqual(await writeQuestions(input, { allowCall }), []);
});
