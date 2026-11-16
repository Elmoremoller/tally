import test from "node:test";
import assert from "node:assert/strict";
import { checkJobRead, JOB_PROMPT_VERSION, readJob } from "../../lib/beginner/questions-ai";

const goodRead = () => ({
  hers: ["Ordering lunch", "Restocking the fridges", "Office plants"],
  usual: ["Office supplies", "Event preparations", "Visitor welcome", "Supplier emails", "Repairs and fixes"],
  apps: ["Outlook", "Excel", "Teams", "SharePoint"],
  worksFor: "employer",
});

test("the job read is v6, read as responsibilities", () => {
  assert.equal(JOB_PROMPT_VERSION, "beginner-job-v6");
});

test("checkJobRead accepts a read inside the limits", () => {
  assert.deepEqual(checkJobRead(goodRead()), goodRead());
});

test("checkJobRead keeps at most 5 of hers, 8 usual ones and 8 apps", () => {
  const read = checkJobRead({
    ...goodRead(),
    hers: ["A one", "B one", "C one", "D one", "E one", "F one"],
    usual: ["G", "H", "I", "J", "K", "L", "M", "N", "O"],
    apps: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
  });
  assert.equal(read?.hers.length, 5);
  assert.equal(read?.usual.length, 8);
  assert.equal(read?.apps.length, 8);
});

test("checkJobRead accepts none of hers when the usual ones fill the screen", () => {
  const read = checkJobRead({ ...goodRead(), hers: [], usual: ["A", "B", "C", "D", "E", "F", "G", "H"] });
  assert.deepEqual(read?.hers, []);
  assert.equal(read?.usual.length, 8);
});

test("checkJobRead drops a usual one that repeats one of hers, whatever its case", () => {
  const read = checkJobRead({ ...goodRead(), usual: ["ordering LUNCH", ...goodRead().usual] });
  assert.deepEqual(read?.usual, goodRead().usual);
});

test("checkJobRead returns null when the screen would be thin, or apps fall short", () => {
  assert.equal(checkJobRead({ ...goodRead(), hers: ["A"], usual: ["B", "C", "D", "E"] }), null);
  assert.equal(checkJobRead({ ...goodRead(), usual: ["B", "C"] }), null);
  assert.equal(checkJobRead({ ...goodRead(), apps: ["Texts", "QuickBooks", "Gmail"] }), null);
});

test("checkJobRead takes every known worksFor and turns down an unknown one", () => {
  for (const worksFor of ["self", "employer", "both", "unclear"]) {
    assert.equal(checkJobRead({ ...goodRead(), worksFor })?.worksFor, worksFor);
  }
  assert.equal(checkJobRead({ ...goodRead(), worksFor: "freelance" }), null);
});

test("checkJobRead returns null for junk", () => {
  assert.equal(checkJobRead(null), null);
  assert.equal(checkJobRead("Ordering lunch"), null);
  assert.equal(checkJobRead({}), null);
  assert.equal(checkJobRead({ ...goodRead(), hers: "Ordering lunch" }), null);
});

test("checkJobRead takes dashes and hyphens out of labels, and drops a label over 4 words", () => {
  const read = checkJobRead({ ...goodRead(), hers: ["Follow-ups — suppliers", "Ordering office supplies when they run low", "Ordering lunch"] });
  assert.deepEqual(read?.hers, ["Follow ups, suppliers", "Ordering lunch"]);
});

test("checkJobRead drops Something else and Other, since the quiz adds its own", () => {
  const read = checkJobRead({ ...goodRead(), usual: [...goodRead().usual, "Something else", "Other"], apps: [...goodRead().apps, "Other"] });
  assert.deepEqual(read?.usual, goodRead().usual);
  assert.deepEqual(read?.apps, goodRead().apps);
});

test("readJob gives up quietly when the call isn't allowed, and never throws", async () => {
  assert.equal(await readJob("Office coordinator", { allowCall: async () => false }), null);
  const allowCall = async (): Promise<boolean> => {
    throw new Error("database down");
  };
  assert.equal(await readJob("Office coordinator", { allowCall }), null);
});
