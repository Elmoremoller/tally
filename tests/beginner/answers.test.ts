import test from "node:test";
import assert from "node:assert/strict";
import { cleanAnswers, type BeginnerAnswers } from "../../lib/beginner/answers";
import { PICK_MAX } from "../../lib/beginner/quiz";

const answers = (over: Partial<BeginnerAnswers> = {}): BeginnerAnswers => ({
  job: "Electrician, my own business",
  experience: "uses",
  qas: [
    { id: "repeats", title: "What do you do over and over?", picked: ["Writing quotes", "Attic work"], text: null },
    { id: "most", title: "Which would save you the most time?", picked: ["Writing quotes"], text: null },
    { id: "picture", title: "How do you picture AI helping?", picked: [], text: null },
  ],
  mostWanted: ["Writing quotes"],
  worksFor: "self",
  aiTools: ["chatgpt"],
  aiToolsOther: null,
  aiPolicy: null,
  often: null,
  ...over,
});

test("cleanAnswers keeps a full set of answers", () => {
  assert.deepEqual(cleanAnswers(answers()), answers());
});

test("cleanAnswers needs a repeats screen with a pick or typed text", () => {
  const withoutRepeats = answers().qas.filter((qa) => qa.id !== "repeats");
  assert.equal(cleanAnswers(answers({ qas: withoutRepeats })), null);
  const emptyRepeats = answers().qas.map((qa) => (qa.id === "repeats" ? { ...qa, picked: [], text: null } : qa));
  assert.equal(cleanAnswers(answers({ qas: emptyRepeats })), null);
});

test("cleanAnswers takes a repeats screen with only typed text", () => {
  const typedOnly = answers().qas.map((qa) =>
    qa.id === "repeats" ? { ...qa, picked: [], text: "Writing up job notes" } : qa,
  );
  assert.equal(cleanAnswers(answers({ qas: typedOnly }))?.qas[0].text, "Writing up job notes");
});

test("cleanAnswers needs one or two things she most wants to make easier", () => {
  assert.equal(cleanAnswers(answers({ mostWanted: [] })), null);
  assert.equal(cleanAnswers(answers({ mostWanted: ["One", "Two", "Three"] })), null);
  assert.deepEqual(cleanAnswers(answers({ mostWanted: ["One", "Two"] }))?.mostWanted, ["One", "Two"]);
});

test("cleanAnswers refuses a most wanted entry over PICK_MAX characters", () => {
  assert.equal(cleanAnswers(answers({ mostWanted: ["x".repeat(PICK_MAX + 1)] })), null);
  assert.ok(cleanAnswers(answers({ mostWanted: ["x".repeat(PICK_MAX)] })));
});

test("cleanAnswers refuses a broken qas list", () => {
  assert.equal(cleanAnswers(answers({ qas: "nope" as unknown as BeginnerAnswers["qas"] })), null);
});

test("cleanAnswers saves None yet for a woman who hasn't tried AI, whatever the page sent", () => {
  const clean = cleanAnswers(answers({ experience: "not_yet", aiTools: ["chatgpt"], aiToolsOther: "Perplexity" }));
  assert.deepEqual(clean?.aiTools, ["none_yet"]);
  assert.equal(clean?.aiToolsOther, null);
});

test("cleanAnswers drops the company view when she works for herself", () => {
  assert.equal(cleanAnswers(answers({ worksFor: "self", aiPolicy: "encouraged" }))?.aiPolicy, null);
});

test("cleanAnswers needs the company view when she has an employer", () => {
  assert.equal(cleanAnswers(answers({ worksFor: "employer", aiPolicy: null })), null);
  assert.equal(cleanAnswers(answers({ worksFor: "employer", aiPolicy: "encouraged" }))?.aiPolicy, "encouraged");
});

test("cleanAnswers refuses a missing job or unknown level", () => {
  assert.equal(cleanAnswers(answers({ job: "  " })), null);
  assert.equal(cleanAnswers(answers({ experience: "expert" as BeginnerAnswers["experience"] })), null);
});

test("cleanAnswers counts a Starter who tried AI as Not sure, since she never sees the AI tools screen", () => {
  const out = cleanAnswers(answers({ experience: "tried", aiTools: ["chatgpt"] }));
  assert.deepEqual(out?.aiTools, ["not_sure"]);
  assert.equal(out?.aiToolsOther, null);
});

test("cleanAnswers keeps how often she does her top task, and drops an unknown one", () => {
  assert.equal(cleanAnswers(answers({ often: "few_a_week" }))?.often, "few_a_week");
  assert.equal(cleanAnswers(answers({ often: "hourly" as never }))?.often, null);
  assert.equal(cleanAnswers(answers({ often: undefined }))?.often, null);
});

test("cleanAnswers takes the new screens: example, how often, what she has done and Can you use AI", () => {
  const qas = [
    ...answers().qas,
    { id: "example", title: "Paste the last one you wrote", picked: [], text: "Hi, here is the quote for the panel swap." },
    { id: "often", title: "How often do you do this?", picked: ["A few times a week"], text: null },
    { id: "done", title: "What have you already done with AI?", picked: ["Made a project"], text: null },
    { id: "can_use", title: "Can you use AI for your work?", picked: ["Yes"], text: null },
  ];
  const out = cleanAnswers(answers({ qas, worksFor: "employer", aiPolicy: "encouraged" }));
  assert.deepEqual(out?.qas.map((qa) => qa.id), ["repeats", "most", "picture", "example", "often", "done", "can_use"]);
  assert.equal(out?.qas.find((qa) => qa.id === "example")?.text, "Hi, here is the quote for the panel swap.");
});

test("old saved answers, with the screens that are gone, still pass", () => {
  const old = answers({
    experience: "uses",
    qas: [
      { id: "level", title: "Where are you with AI?", picked: [], text: "I use it to plan meals" },
      { id: "held_back", title: "What has held you back so far?", picked: ["No time to learn"], text: null },
      ...answers().qas,
      { id: "ai_uses", title: "What do you use it for today?", picked: ["Planning"], text: null },
      { id: "works_for", title: "Do you work for yourself or for someone else?", picked: ["Both"], text: null },
      { id: "policy", title: "What's your company's view on AI?", picked: ["Unclear"], text: null },
    ],
    worksFor: "both",
    aiPolicy: "unclear",
  });
  assert.deepEqual(cleanAnswers(old), old);
});
