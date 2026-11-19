import test from "node:test";
import assert from "node:assert/strict";
import { FALLBACK_JOB_READ } from "../../lib/beginner/copy";
import { jobReadOrFallback, type JobRead } from "../../lib/beginner/quiz";
import { readJob } from "../../lib/beginner/questions-ai";

const goodRead: JobRead = {
  hers: ["Writing quotes", "Texting homeowners"],
  usual: ["Ordering parts", "Booking jobs", "Chasing payments"],
  apps: ["Texts", "QuickBooks"],
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
