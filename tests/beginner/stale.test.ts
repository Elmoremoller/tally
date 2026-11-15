import test from "node:test";
import assert from "node:assert/strict";
import { setupCards } from "../../lib/beginner/cards";
import { recipes } from "../../lib/beginner/recipes";
import { STALE_AFTER_DAYS, daysSince, staleChecks } from "../../lib/beginner/stale";

const item = (id: string, checked: string) => ({ id, checked, sources: [`https://example.com/${id}`] });

test("daysSince counts whole UTC days", () => {
  assert.equal(daysSince("2026-11-14", new Date("2026-11-14T23:59:00Z")), 0);
  assert.equal(daysSince("2026-11-14", new Date("2026-11-15T00:00:00Z")), 1);
  assert.equal(daysSince("2026-10-31", new Date("2026-12-01T12:00:00Z")), 31);
});

test("staleChecks flags only items older than the limit", () => {
  const today = new Date("2026-12-15T08:00:00Z");
  const stale = staleChecks(today, {
    cards: [item("fresh_card", "2026-12-01"), item("edge_card", "2026-11-15"), item("old_card", "2026-11-14")],
    recipes: [item("old_recipe", "2026-10-01")],
  });
  assert.equal(daysSince("2026-11-15", today), STALE_AFTER_DAYS);
  assert.deepEqual(
    stale.map((s) => [s.kind, s.id, s.daysOld]),
    [
      ["recipe", "old_recipe", 75],
      ["card", "old_card", 31],
    ],
  );
  assert.deepEqual(stale[1].sources, ["https://example.com/old_card"]);
});

test("staleChecks covers every real card and recipe once they pass the limit", () => {
  const farFuture = new Date("2100-01-01T00:00:00Z");
  const stale = staleChecks(farFuture);
  assert.equal(stale.filter((s) => s.kind === "card").length, setupCards.length);
  assert.equal(stale.filter((s) => s.kind === "recipe").length, recipes.length);
  for (const s of stale) assert.ok(s.sources.length >= 1, `${s.id} comes with its source links`);
});

test("nothing is flagged on the day it was checked", () => {
  const newest = [...setupCards, ...recipes].map((x) => x.checked).sort().at(-1)!;
  const stale = staleChecks(new Date(`${newest}T12:00:00Z`));
  assert.ok(stale.every((s) => s.checked < newest));
});
