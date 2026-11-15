import { mkdirSync, writeFileSync } from "node:fs";
import { pathParts, writePath, PATH_PROMPT_VERSION } from "../lib/beginner/path-writer";
import { pathSampleInputs } from "../lib/beginner/path-samples";

// Writes the sample paths in lib/beginner/path-samples.ts with the live prompt (costs API money), saves each
// answer in docs/audit/2026-11-15-path-runs, and writes lib/beginner/path-samples-written.ts for the previews.
// Run: node --env-file=.env.local --import ./scripts/register-ts.mjs scripts/path-runs.ts [name ...]

const out = "docs/audit/2026-11-15-path-runs";
mkdirSync(out, { recursive: true });
const names = (process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(pathSampleInputs)) as (keyof typeof pathSampleInputs)[];
const written: Record<string, unknown> = {};

for (const name of names) {
  const input = pathSampleInputs[name];
  const { outline } = pathParts(input);
  console.log(`\n${name}: ${outline.steps.map((s) => `${s.id}:${s.kind}${"recipe" in s && s.recipe ? `(${s.recipe.id})` : ""}`).join(" ")} skipped ${outline.skipped.join(",") || "none"}`);
  for (let attempt = 1; attempt <= 3; attempt++) {
    let raw: unknown = null;
    try {
      const { content, model } = await writePath(input, { onRaw: (r) => (raw = r) });
      written[name] = content;
      writeFileSync(`${out}/${name}.json`, JSON.stringify({ promptVersion: PATH_PROMPT_VERSION, model, content }, null, 2));
      console.log(`  ok on attempt ${attempt} with ${model}`);
      break;
    } catch (error) {
      console.log(`  attempt ${attempt} failed: ${error instanceof Error ? error.message : error}`);
      if (raw) writeFileSync(`${out}/${name}.failed-${attempt}.json`, JSON.stringify(raw, null, 2));
    }
  }
}

const existing = await import("../lib/beginner/path-samples-written").then((m) => m.writtenPaths as Record<string, unknown>).catch(() => ({}));
writeFileSync(
  "lib/beginner/path-samples-written.ts",
  `import type { PathPlan } from "./path";\n\n// Written by scripts/path-runs.ts with ${PATH_PROMPT_VERSION}. Do not edit by hand.\nexport const writtenPaths: Record<string, PathPlan> = ${JSON.stringify({ ...existing, ...written }, null, 2)};\n`,
);
