import test from "node:test";
import assert from "node:assert/strict";
import { FALLBACK_JOB_READ } from "../../lib/beginner/copy";
import { jobReadOrFallback, type JobRead } from "../../lib/beginner/quiz";
import { readJob, writeQuestions } from "../../lib/beginner/questions-ai";

const goodRead: JobRead = {
  repeats: [
    { label: "Writing quotes", ai: true },
    { label: "Texting homeowners", ai: true },
    { label: "Attic work", ai: false },
  ],
  aiFallback: ["Quote templates", "Payment reminder texts", "Review requests"],
  apps: ["Texts", "QuickBooks"],
  aiUses: ["Quotes", "Customer texts", "Job notes"],
  worksFor: "self",
};

test("jobReadOrFallback uses the fallback read when there is none", () => {
  assert.deepEqual(jobReadOrFallback(null), { read: FALLBACK_JOB_READ, fallback: true });
});

test("jobReadOrFallback keeps a real read and says it is not a fallback", () => {
  assert.deepEqual(jobReadOrFallback(goodRead), { read: goodRead, fallback: false });
});

test("readJob makes no call when the allowance says no", async () => {
  assert.equal(await readJob("Electrician", { allowCall: async () => false }), null);
});

test("writeQuestions makes no call when the allowance says no", async () => {
  const questions = await writeQuestions(
    { job: "Electrician", experience: "tried", qas: [], mostWanted: ["Writing quotes"] },
    { allowCall: async () => false },
  );
  assert.deepEqual(questions, []);
});
