import test from "node:test";
import assert from "node:assert/strict";
import { cleanAnswers, type BeginnerAnswers } from "../../lib/beginner/answers";
import { PICK_MAX } from "../../lib/beginner/quiz";

const answers = (over: Partial<BeginnerAnswers> = {}): BeginnerAnswers => ({
  job: "Electrician, my own business",
  experience: "tried",
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
