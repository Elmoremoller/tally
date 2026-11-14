import test from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { offer } from "../lib/offer";
import { beginnerParts, beginnerPaywall } from "../lib/beginner/copy";

/** Every string inside a value, however deep. Functions are skipped: they only fill in her own answers. */
const strings = (value: unknown): string[] => {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(strings);
  if (value && typeof value === "object") return Object.values(value).flatMap(strings);
  return [];
};

const root = join(import.meta.dirname, "..");

/**
 * The words in one exported object, read from its source: lib/plan-copy.ts reaches the icons (a .tsx file)
 * through lib/landing.ts, so Node can't import it here. What sits inside ${} is code, not words.
 */
const literals = (file: string, name: string): string[] => {
  const source = readFileSync(join(root, file), "utf8");
  const start = source.indexOf(`export const ${name} = {`);
  assert.ok(start >= 0, `${name} is in ${file}`);
  const block = source.slice(start, source.indexOf("\n};", start));
  return (block.match(/"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*`/g) ?? []).map((text) => text.replace(/\$\{[^}]*\}/g, ""));
};

test("the paywall shows no text in square brackets", () => {
  const shown = [
    ...literals("lib/plan-copy.ts", "paywallCopy"),
    ...literals("lib/plan-copy.ts", "previewCopy"),
    ...strings([beginnerPaywall, beginnerParts, offer.refund]),
  ];
  assert.ok(shown.length > 10, "the paywall copy was found");
  assert.deepEqual(shown.filter((line) => /[[\]]/.test(line)), []);
});

test("the support email is a real address", () => {
  assert.match(offer.supportEmail, /^[^\s@[\]]+@[^\s@[\]]+\.[a-z]+$/);
});

// The repo describes Tally only. The two Stripe files say, correctly, that the shared Stripe account also
// sells The Couple Standard: that is why their check exists. DIRECTION.md names it as the cleanup it asked for.
const ALLOWED = new Set(["app/api/stripe/webhook/route.ts", "lib/fulfill.ts", "docs/DIRECTION.md"]);
const SKIP = new Set(["node_modules", ".next", ".git", ".vercel"]);
const TEXT = /\.(ts|tsx|mjs|js|css|md|sql|html|json|example)$|^\.env\.example$/;

const files = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    if (SKIP.has(entry.name)) return [];
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return files(path);
    return TEXT.test(entry.name) ? [path] : [];
  });

test("no file describes the old product", () => {
  const found = files(root)
    .map((path) => relative(root, path))
    .filter((path) => !ALLOWED.has(path) && path !== "tests/repo.test.ts")
    .filter((path) => /couple standard|couple_standard/i.test(readFileSync(join(root, path), "utf8")));
  assert.deepEqual(found, []);
});
