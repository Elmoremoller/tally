// Phase 10 of docs/DIRECTION.md: three people through the full paid path, with the real AI call that designs each
// workflow. Each starts from the free result she got in the Phase 8 runs (docs/audit/2026-11-16-phase-8-runs), as if
// she had just paid: she keeps her two workflows, answers the follow up questions for each, and both are written by
// the same code the site uses (startPath, followUpsFor, designWorkflow, workflowView). Nothing touches the database.
//
// Who answers what (Karl, 2026-11-16): the office coordinator answers lunch exactly as in the target of section 4
// (orders by email, paper and in person, counted by hand, ordered by email once a week), with a short menu as her
// example. Every other answer is played by a second model from the woman's bio, choosing only from what each screen
// offers, as in the Phase 8 runs.
//
// Run it with (costs API money)
//   node --env-file=<path to .env.local> --import ./scripts/register-ts.mjs scripts/phase-10-runs.ts [names]
// Each person's path, word for word as she reads it, goes to docs/audit/2026-11-19-phase-10-runs/<name>.md, with
// the checks, the seconds and the AI cost at the bottom; summary.json holds them all.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import Anthropic from "@anthropic-ai/sdk";
import { cardById } from "../lib/beginner/cards";
import { workflowCopy as copy, pathCopy } from "../lib/beginner/copy";
import { cleanFollowUps, type FollowAnswer, type FollowSet } from "../lib/beginner/follow-ups";
import { prepTitles } from "../lib/beginner/free-result";
import { deviceOf, whoFrom } from "../lib/beginner/levels";
import { pathApps } from "../lib/beginner/path";
import type { PathInput } from "../lib/beginner/path-writer";
import type { QA } from "../lib/beginner/quiz";
import type { FreeResult } from "../lib/beginner/types";
import {
  AI_WORDS,
  CLICK_WORDS,
  menuFor,
  nameOf,
  piecesOf,
  questionsFor,
  rowOf,
  screensFor,
  startPath,
  validPathV4,
  withPicks,
  type PathV4,
  type SlotId,
} from "../lib/beginner/workflow";
import { workflowView } from "../lib/beginner/workflow-view";
import { designWorkflow, type Usage } from "../lib/beginner/workflow-writer";
import { intakeModel } from "../lib/intake";
import { offer as product } from "../lib/offer";

const OUT = "docs/audit/2026-11-19-phase-10-runs";
const FROM = "docs/audit/2026-11-16-phase-8-runs";
const ONLY = process.argv[2]?.split(",").filter(Boolean) ?? null;

/** Dollars per million tokens, from the Claude API reference (cached 2026-11-03). */
const PRICES: Record<string, { input: number; output: number }> = {
  "claude-sonnet-5-5": { input: 2, output: 10 },
  "claude-sonnet-5": { input: 2, output: 10 },
  "claude-haiku-5-5": { input: 0.1, output: 0.5 },
  "claude-opus-5-5": { input: 4, output: 20 },
};
const dollarsFor = (usage: Usage[]) =>
  usage.reduce((sum, u) => {
    const p = PRICES[u.model] ?? PRICES["claude-sonnet-5-5"];
    return sum + ((u.input + u.cacheWrite * 1.25 + u.cacheRead * 0.1) * p.input + u.output * p.output) / 1_000_000;
  }, 0);

type Saved = {
  name: string;
  persona: { who: string; bio: string };
  answers: { job: string; experience: PathInput["experience"]; qas: QA[]; mostWanted: string[]; worksFor: PathInput["worksFor"]; aiTools: PathInput["aiTools"]; aiPolicy: PathInput["aiPolicy"] };
  intake: { role_summary: string };
  free: FreeResult;
};

/** Fixed answers for the office coordinator's lunch, as in the target of section 4. */
const SCRIPTED: Record<string, Record<string, Record<string, { picked: string[]; text?: string }>>> = {
  office: {
    "Ordering lunch": {
      reach: { picked: ["email", "paper", "person"] },
      combined: { picked: ["yes"] },
      place: { picked: ["email"] },
      often: { picked: ["weekly"] },
      example: { picked: [], text: "This week: lasagna, chicken salad, tomato soup. Vegetarian or gluten free on request." },
    },
  },
};

const anthropic = new Anthropic();

const PLAYER_SYSTEM = `You play a woman answering a few quick questions on her phone about how she does one part of her work today. Answer as she would, from her bio and nothing else. Stay in character.

- For each question, picked holds the ids of the choices she taps. "one" means exactly one id; "many" means all that fit her.
- Never pick a choice that says an app already does it, unless her bio says so.
- example: a short real example she would paste, in her words, at most 400 characters, with no names of people or companies. Null if she would skip it.`;

const playerSchema = {
  type: "object",
  properties: {
    answers: {
      type: "array",
      items: {
        type: "object",
        properties: { id: { type: "string" }, picked: { type: "array", items: { type: "string" } } },
        required: ["id", "picked"],
        additionalProperties: false,
      },
    },
    example: { anyOf: [{ type: "string" }, { type: "null" }] },
  },
  required: ["answers", "example"],
  additionalProperties: false,
} as const;

/** Her answers, played again when the player leaves a question she must answer empty. */
async function playAnswers(bio: string, task: string, set: FollowSet): Promise<{ answers: FollowAnswer[]; usage: Usage }> {
  for (let attempt = 1; ; attempt++) {
    try {
      return await playOnce(bio, task, set);
    } catch (error) {
      if (attempt >= 3) throw error;
    }
  }
}

async function playOnce(bio: string, task: string, set: FollowSet): Promise<{ answers: FollowAnswer[]; usage: Usage }> {
  const content = [
    `<bio>\n${bio}\n</bio>`,
    `The part of her work: ${task}`,
    "",
    ...set.questions.map((q) => [`Question ${q.id} (${q.kind}): ${q.title}`, ...q.choices.map((c) => `- ${c.id}: ${c.label}`)].join("\n")),
    `Example box: ${set.example.label}`,
  ].join("\n\n");
  const model = intakeModel();
  const response = await anthropic.messages.create({
    model,
    max_tokens: 2000,
    output_config: { effort: "low", format: { type: "json_schema", schema: playerSchema } },
    system: PLAYER_SYSTEM,
    messages: [{ role: "user", content }],
  });
  const block = response.content.find((b) => b.type === "text");
  const raw = JSON.parse(block && block.type === "text" ? block.text : "{}") as { answers: FollowAnswer[]; example: string | null };
  // The player sometimes gives a label for an id, or two picks on a one question: keep what matches, first pick wins.
  const fixed = set.questions.map((q) => {
    const given = raw.answers.find((a) => a.id === q.id)?.picked ?? [];
    const ids = given.map((g) => q.choices.find((c) => c.id === g || c.label.toLowerCase() === g.toLowerCase())?.id).filter((id): id is string => Boolean(id) && id !== "solved");
    return { id: q.id, picked: q.kind === "one" ? ids.slice(0, 1) : ids };
  });
  const answers = cleanFollowUps(set, [...fixed, { id: "example", picked: [], text: raw.example }]);
  if (!answers) throw new Error(`The player's answers didn't fit the questions for ${task}`);
  return { answers, usage: { model: response.model, input: response.usage.input_tokens, output: response.usage.output_tokens, cacheRead: 0, cacheWrite: 0 } };
}

type Check = { id: string; pass: boolean; detail: string };

function inputFor(saved: Saved): PathInput {
  const { answers, free } = saved;
  const who = whoFrom({ track: free.track, worksFor: answers.worksFor, aiPolicy: answers.aiPolicy, qas: answers.qas, aiTools: answers.aiTools });
  return {
    job: answers.job,
    qas: answers.qas,
    mostWanted: answers.mostWanted,
    role: saved.intake.role_summary,
    worksFor: answers.worksFor,
    experience: answers.experience,
    aiTools: answers.aiTools,
    aiPolicy: answers.aiPolicy,
    map: free.map,
    top: free.firstWin.task,
    track: free.track,
    tool: free.tool,
    device: deviceOf(answers.qas) ?? who.device,
    apps: pathApps(who),
    firstStep: null,
  };
}

/** Her whole path as she reads it, screen by screen. */
function printPath(path: PathV4, asked: Record<string, { set: FollowSet; answers: FollowAnswer[] }>): string[] {
  const out: string[] = [];
  let n = 0;
  for (const screen of screensFor(path)) {
    n += 1;
    if (screen.kind === "start") {
      out.push(`### Screen ${n}. ${copy.startTitle}`, "", copy.startLead, "");
      for (const slot of path.slots) {
        const row = rowOf(path, slot.task)!;
        out.push(`**${nameOf(row)}** [${copy.swap}]`, "", ...piecesOf(path, row).map((p) => `* ${p}`), "");
      }
      out.push(`[${copy.start}]`, "");
    }
    if (screen.kind === "questions") {
      const slot = path.slots.find((s) => s.id === screen.slot)!;
      const { set, answers } = asked[slot.id];
      out.push(`### Screen ${n}. ${nameOf(rowOf(path, slot.task)!)}`, "", copy.questionsLead, "");
      for (const q of set.questions) {
        const picked = answers.find((a) => a.id === q.id)?.picked ?? [];
        out.push(`**${q.title}**${q.hint ? ` *${q.hint}*` : q.kind === "many" ? ` *${copy.pickMany}*` : ""}`, "");
        out.push(q.choices.map((c) => (picked.includes(c.id) ? `**[x] ${c.label}**` : `[ ] ${c.label}`)).join(" · "), "");
      }
      const example = answers.find((a) => a.id === "example")?.text;
      out.push(`**${set.example.label}** *${set.example.hint}*`, "", example ? `> ${example.replace(/\n/g, "\n> ")}` : "(left empty)", "", `[${copy.write}]`, "");
    }
    if (screen.kind === "ready") {
      const card = cardById(`${path.tool}_get_started`);
      out.push(`### Screen ${n}. ${prepTitles(path.tool, path.device).ready}`, "", ...(card?.steps.computer ?? []).map((l, i) => `${i + 1}. ${l}`), "");
    }
    if (screen.kind === "about") {
      const card = cardById(`${path.tool}_about_you`);
      out.push(`### Screen ${n}. ${prepTitles(path.tool, path.device).about}`, "", ...(card?.steps.computer ?? []).map((l, i) => `${i + 1}. ${l}`), "");
      out.push(`**${pathCopy.aboutLabel}** [Copy]`, "", `> ${path.prep?.aboutNote ?? ""}`, "");
    }
    if (screen.kind === "workflow") {
      const slot = path.slots.find((s) => s.id === screen.slot)!;
      const v = workflowView(path, { ...slot, design: slot.design! });
      out.push(`### Screen ${n}. ${v.title}`, "", v.read, "");
      if (v.cost.length) out.push(`**${copy.costFirst}**`, "", ...v.cost.map((c) => `* ${c}`), "");
      out.push(`**${pathCopy.materialLabel}**`, "");
      for (const m of v.material) {
        out.push(`*${m.label}*`, "");
        m.items.forEach((item, i) => out.push(`${m.items.length > 1 ? `${i + 1}. ` : ""}${item.replace(/\n/g, "\n   ")} [Copy]`));
        out.push("");
      }
      const steps = (label: string, list: typeof v.once, from: number) => {
        if (!list.length) return;
        out.push(`**${label}**`, "");
        list.forEach((s, i) => {
          out.push(`${from + i}. **${s.say}**${s.piece ? ` ${copy.copyThis(s.piece)}` : ""}`);
          s.lines.forEach((l) => out.push(`    * ${l}`));
          if (s.note) out.push(`    * *${copy.noteLabel}:* ${s.note}`);
          if (s.region) out.push(`    * *${copy.regionLabel}:* ${s.region}`);
        });
        out.push("");
      };
      steps(copy.onceLabel, v.once, 1);
      steps(copy.eachTimeLabel, v.eachTime, v.once.length + 1);
      out.push(`**${copy.tryLabel}** ${v.tryOn}`, "", `**${copy.goodLabel}** ${v.good}`, "", `**${copy.approvalLabel}** ${v.approval}`, "");
      out.push(`**${pathCopy.didItWork}** [${pathCopy.yes}] [${pathCopy.notQuite}]`, "", `*${pathCopy.stopsLabel}* ${pathCopy.stops(product.supportEmail)}`, "");
    }
    if (screen.kind === "end") {
      out.push(`### Screen ${n}. ${copy.endTitle}`, "", copy.endLead, "");
      if (path.prep?.safeUse.length) out.push(`**${copy.safeTitle}**`, "", ...path.prep.safeUse.map((l) => `* ${l}`), "");
      if (path.prep?.askMessage) out.push(`**${pathCopy.askLabel}** ${pathCopy.askLead}`, "", `> ${path.prep.askMessage}`, "");
    }
  }
  return out;
}

/** Checks on one written workflow, from DIRECTION.md and Karl's Phase 10 rules. */
function checksFor(name: string, path: PathV4, slotId: SlotId, seconds: number): Check[] {
  const slot = path.slots.find((s) => s.id === slotId)!;
  const d = slot.design!;
  const v = workflowView(path, { ...slot, design: d });
  const row = rowOf(path, slot.task)!;
  const menu = menuFor(path, row, slot.answers)!;
  const everything = JSON.stringify(v);
  const checks: Check[] = [
    { id: `${slotId}_ids`, pass: d.steps.every((s) => s.use === "goal" || menu.items.some((i) => i.id === s.use)), detail: d.steps.map((s) => s.use).join(", ") },
    { id: `${slotId}_not_checked`, pass: !/not checked/i.test(everything), detail: "nothing says not checked" },
    { id: `${slotId}_no_clicks_from_model`, pass: d.steps.every((s) => !CLICK_WORDS.test(s.say)), detail: "every short line is free of clicks" },
    { id: `${slotId}_approval`, pass: Boolean(d.approval), detail: d.approval },
    { id: `${slotId}_each_time`, pass: v.eachTime.length > 0, detail: v.eachTime.map((s) => s.say).join(" | ") },
    { id: `${slotId}_no_ai_ask`, pass: menu.usesAi || !AI_WORDS.test(everything), detail: menu.usesAi ? "uses AI by design" : "no AI named" },
    { id: `${slotId}_goals_plain`, pass: d.steps.filter((s) => s.use === "goal").every((s) => !CLICK_WORDS.test(s.say)), detail: `${d.steps.filter((s) => s.use === "goal").length} goals` },
    { id: `${slotId}_fast`, pass: seconds <= 60, detail: `${seconds.toFixed(1)} s` },
  ];
  if (name === "office" && slotId === "task_1") {
    const used = d.steps.map((s) => s.use);
    const formItems = d.material.flatMap((m) => m.items).filter((i) => i.includes("\n"));
    checks.push(
      { id: "lunch_microsoft", pass: d.suite === "microsoft", detail: String(d.suite) },
      { id: "lunch_no_sheet", pass: !used.some((u) => /to_excel|count_each|sheets?_/.test(u)), detail: used.join(", ") },
      { id: "lunch_target_steps", pass: ["ms_forms_create", "ms_forms_share", "ms_forms_results", "ms_forms_clear"].every((id) => used.includes(id)), detail: "form, link, counts in Forms, clear" },
      {
        id: "lunch_combined_choices",
        pass: formItems.some((i) => i.split("\n").slice(1).some((line) => /\p{L}, \p{L}/u.test(line))),
        detail: formItems.map((i) => i.split("\n")[0]).join(" | "),
      },
      { id: "lunch_clear_after_order", pass: v.eachTime.at(-1)?.lines.join(" ").includes("Delete all responses") ?? false, detail: v.eachTime.at(-1)?.say ?? "" },
    );
  }
  return checks;
}

async function run(name: string) {
  const saved = JSON.parse(readFileSync(`${FROM}/${name}.json`, "utf8")) as Saved;
  const input = inputFor(saved);
  let path = startPath(input);
  path = withPicks(path, path.slots.map((s) => s.task))!;
  const asked: Record<string, { set: FollowSet; answers: FollowAnswer[] }> = {};
  const runs: { slot: SlotId; task: string; seconds: number; dollars: number; attempts: number; usage: Usage[] }[] = [];
  const raws: unknown[] = [];
  let playerDollars = 0;
  for (const slot of path.slots) {
    const q = questionsFor(path, slot)!;
    const fixed = SCRIPTED[name]?.[slot.task];
    let answers: FollowAnswer[];
    if (fixed) answers = cleanFollowUps(q.set, Object.entries(fixed).map(([id, a]) => ({ id, picked: a.picked, text: a.text ?? null })))!;
    else {
      const played = await playAnswers(saved.persona.bio, slot.task, q.set);
      answers = played.answers;
      playerDollars += dollarsFor([played.usage]);
    }
    asked[slot.id] = { set: q.set, answers };
    const current = path.slots.find((s) => s.id === slot.id)!;
    const started = performance.now();
    const written = await designWorkflow(input, path, { ...current, answers }, q.set, answers, {
      onRaw: (raw, errors) => {
        raws.push({ slot: slot.id, errors, raw });
        if (errors) console.log(`${name} ${slot.id} rejected: ${errors.join("; ")} READ: ${(raw as { read?: string }).read}`);
      },
    });
    const seconds = (performance.now() - started) / 1000;
    path = {
      ...path,
      prep: path.prep ?? written.prose,
      slots: path.slots.map((s) => (s.id === slot.id ? { ...s, answers, design: written.design, tries: s.tries + 1 } : s)),
    };
    runs.push({ slot: slot.id, task: slot.task, seconds, dollars: dollarsFor(written.usage), attempts: written.usage.length, usage: written.usage });
    console.log(`${name} ${slot.id} ${slot.task}: ${seconds.toFixed(1)} s, $${dollarsFor(written.usage).toFixed(4)}, ${written.usage.length} attempt(s)`);
  }
  const checks: Check[] = [
    { id: "valid_path", pass: validPathV4(path), detail: "the saved path loads" },
    { id: "did_it_work_steps", pass: path.slots.every((s) => s.id === "task_1" || s.id === "task_2"), detail: "Did it work is saved per workflow as task_1 and task_2" },
    ...runs.flatMap((r) => checksFor(name, path, r.slot, r.seconds)),
  ];
  const lines = [
    `# ${name}: the paid path, word for word (Phase 10)`,
    "",
    saved.persona.who,
    "",
    "Every line below is DRAFT unless DIRECTION.md or Karl already approved it. Buttons are in square brackets. Under each step, the exact clicks come from the checked card or recipe named in the code, never from the model.",
    "",
    ...printPath(path, asked),
    "## Seconds and AI cost",
    "",
    "| Workflow | Seconds after her answers | Attempts | Tokens in | Tokens out | AI cost |",
    "| --- | --- | --- | --- | --- | --- |",
    ...runs.map(
      (r) =>
        `| ${r.task} | ${r.seconds.toFixed(1)} | ${r.attempts} | ${r.usage.reduce((a, u) => a + u.input, 0)} | ${r.usage.reduce((a, u) => a + u.output, 0)} | $${r.dollars.toFixed(4)} |`,
    ),
    "",
    `Model ${runs[0]?.usage[0]?.model}. Her path opened with no AI call when she paid. Playing her answers cost $${playerDollars.toFixed(4)} more and is not part of the product.`,
    "",
    "## Checks",
    "",
    ...checks.map((c) => `* ${c.pass ? "PASS" : "FAIL"} ${c.id}: ${c.detail}`),
    "",
  ];
  writeFileSync(`${OUT}/${name}.md`, lines.join("\n"));
  writeFileSync(`${OUT}/${name}.json`, JSON.stringify({ name, input, path, asked, runs, raws, checks }, null, 2));
  return { name, runs: runs.map(({ usage, ...r }) => ({ ...r, model: usage[0]?.model })), checks };
}

async function main() {
  mkdirSync(OUT, { recursive: true });
  const names = (ONLY ?? ["office", "property", "hr"]).filter(Boolean);
  const results = [];
  for (const name of names) results.push(await run(name));
  const previous = (() => {
    try {
      return JSON.parse(readFileSync(`${OUT}/summary.json`, "utf8")) as { results: { name: string }[] };
    } catch {
      return { results: [] };
    }
  })();
  const merged = [...previous.results.filter((r) => !names.includes(r.name)), ...results];
  writeFileSync(`${OUT}/summary.json`, JSON.stringify({ written: new Date().toISOString(), results: merged }, null, 2));
  for (const r of results) for (const c of r.checks) if (!c.pass) console.log(`FAIL ${r.name} ${c.id}: ${c.detail}`);
  writeSamples();
}

/** The three paths as written, for /plan/preview?sample=v4_office (also property and hr). */
export function writeSamples() {
  const samples: Record<string, unknown> = {};
  for (const name of ["office", "property", "hr"]) {
    try {
      const run = JSON.parse(readFileSync(`${OUT}/${name}.json`, "utf8")) as { input: PathInput; path: PathV4 };
      samples[`v4_${name}`] = { input: run.input, path: run.path };
    } catch {}
  }
  writeFileSync(
    "lib/beginner/path-v4-samples.ts",
    [
      "// Written by scripts/phase-10-runs.ts from the Phase 10 proof runs: each person's answers and her path with both",
      "// workflows written live. Used by /plan/preview?sample=v4_office (also v4_property and v4_hr). Do not edit by hand.",
      'import type { PathInput } from "./path-writer";',
      'import type { PathV4 } from "./workflow";',
      "",
      `export const pathV4Samples: Record<string, { input: PathInput; path: PathV4 }> = ${JSON.stringify(samples, null, 2)};`,
      "",
    ].join("\n"),
  );
}

if (process.argv[2] === "--samples") writeSamples();
else main().catch((error) => {
  console.error(error);
  process.exit(1);
});
