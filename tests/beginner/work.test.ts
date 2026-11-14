import test from "node:test";
import assert from "node:assert/strict";
import { CAN_USE, canUseLabels, canUseToWork, trackFor, workLine } from "../../lib/beginner/types";

test("Never used it and Tried it a few times are Starter, the other two Builder", () => {
  assert.equal(trackFor("not_yet"), "starter");
  assert.equal(trackFor("tried"), "starter");
  assert.equal(trackFor("uses"), "builder");
  assert.equal(trackFor("heavy"), "builder");
});

test("Can you use AI for your work becomes who she works for and a policy the database takes", () => {
  assert.deepEqual(canUseToWork("yes"), { worksFor: "employer", aiPolicy: "encouraged" });
  assert.deepEqual(canUseToWork("not_sure"), { worksFor: "employer", aiPolicy: "no_idea" });
  assert.deepEqual(canUseToWork("restricted"), { worksFor: "employer", aiPolicy: "restricted" });
  assert.deepEqual(canUseToWork("self"), { worksFor: "self", aiPolicy: null });
  assert.equal(CAN_USE.length, 4);
});

test("the prompts get her own answer, so Yes is never told as encouraged", () => {
  const qas = [{ id: "can_use", title: "Can you use AI for your work?", picked: [canUseLabels.yes], text: null }];
  const line = workLine({ worksFor: "employer", aiPolicy: "encouraged", qas });
  assert.equal(line, "Can she use AI for her work? Her answer: Yes");
  assert.ok(!/encourag/i.test(line));
});

test("answers saved before the merged question keep the old two lines", () => {
  assert.equal(
    workLine({ worksFor: "both", aiPolicy: "unclear", qas: [] }),
    "She works: Both\nHer company's view on AI: Unclear",
  );
  assert.equal(workLine({ worksFor: "self", aiPolicy: null, qas: [] }), "She works: For myself\nHer company's view on AI: she works for herself");
});
