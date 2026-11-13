import test from "node:test";
import assert from "node:assert/strict";
import { hoursText } from "../lib/week";
import { resultCopy } from "../lib/questions";
import { hasEmployer } from "@/lib/beginner/types";

test("hoursText formats a half hour", () => {
  assert.equal(hoursText(6.5), "6.5 hours");
});

test("lib/questions resolves its extensionless import", () => {
  assert.equal(resultCopy.line, "a week on work nobody notices.");
});

test("hasEmployer is false for self", () => {
  assert.equal(hasEmployer("self"), false);
});
