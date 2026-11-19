// Phase 8 of docs/DIRECTION.md: four made up women through the quiz at /begin, screen by screen, with the real AI
// calls (the read of her job and the final read), then her free result built by the same code the site uses
// (freeResultFor). A second model call plays each woman from her bio and picks from the choices each screen offered.
// Her level, device, Can you use AI for your work and the connect question are fixed per person. Nothing is
// written to the database, and the paid path is not run: it stays as Phase 6 built it until Phase 10.
//
// Who runs (Karl, 2026-11-16): the office coordinator from experiment three, a job never tested before (a property
// manager), someone who only uses a phone (Kayla, the electrician) and someone in Outlook and Excel (Priya, HR).
//
// Run it with (costs API money)
//   node --env-file=<path to .env.local> --import ./scripts/register-ts.mjs scripts/phase-8-runs.ts [names]
// Each person's map and full offer, as she reads it, go in docs/audit/2026-11-16-phase-8-runs/<name>.md, with the
// checks at the bottom; summary.json holds every check and time.
import { mkdirSync, writeFileSync } from "node:fs";
import Anthropic from "@anthropic-ai/sdk";
import { cleanAnswers } from "../lib/beginner/answers";
import { beginnerPaywall, beginnerQuestions as screens, firstWinCopy, levelCopy, offerCopy, repeatGroups } from "../lib/beginner/copy";
import { offerTasks, orderMap, readAsResponsibilities, smootherCount, thingOf, TIME_PROMISE } from "../lib/beginner/free-result";
import { readBeginnerIntake, BEGINNER_INTAKE_VERSION, SOUNDS_AUTOMATIC, SPEED_PROMISE } from "../lib/beginner/intake";
import { PATTERNS } from "../lib/beginner/patterns";
import { readJob, JOB_PROMPT_VERSION } from "../lib/beginner/questions-ai";
import { jobReadOrFallback, mostOptions, PICK_MAX, repeatChoices, stepsFor, whereOptions, type QA } from "../lib/beginner/quiz";
import {
  canUseQuestion,
  CONNECT,
  connectQuestion,
  DEVICES,
  deviceQuestion,
  doneWithAi,
  OFTEN,
  oftenQuestion,
  whereScreen,
  type Connect,
  type Device,
  type Often,
} from "../lib/beginner/quiz-copy";
import { LEVELS } from "../lib/beginner/recipes";
import { freeResultFor } from "../lib/beginner/free-result";
import {
  CAN_USE,
  canUseLabels,
  canUseToWork,
  EXPERIENCE,
  experienceLabels,
  hasEmployer,
  trackFor,
  usesAi,
  type CanUse,
  type Experience,
  type FreeResult,
  type MapLine,
} from "../lib/beginner/types";
import { intakeModel } from "../lib/intake";
import { dollars, offer as product } from "../lib/offer";
import { AI_TOOLS, toolLabels, type AiTool } from "../lib/week";
import { DASH, MENU, type Check } from "./persona-checks";

/** A map line that reads like writing help. Narrower than WRITING_HELP in persona-checks, which also flags "every time" in "run the same way every time". */
const WRITING_HELP = /\b(ask (ai|claude|chatgpt|it)|paste|prompt|help(s)? you write|writes? it for you|written with ai)\b/i;

const OUT = "docs/audit/2026-11-16-phase-8-runs";
const ONLY = process.argv[2]?.split(",").filter(Boolean) ?? null;

type Persona = {
  who: string;
  bio: string;
  job: string;
  level: Experience;
  device: Device;
  canUse: CanUse;
  connect: Connect | null;
};

const personas: Record<string, Persona> = {
  office: {
    who: "The office coordinator from experiment three, Karl's job text word for word. Starter, computer and phone, Outlook, Teams and Excel, not sure what her company allows.",
    bio: "Office coordinator for an office of about 70 people. In her own words: I am an office coordinator for an office of about 70 people. I prepare and organize lunch for everyone. I order drinks, restock the fridges and keep the office clean and organized. I take care of the plants and general maintenance. I handle special orders and preparations for company events. I coordinate suppliers and make sure we have what we need. I am the person everyone comes to when something is missing or needs fixing. If the printer runs out of ink I find a replacement, and if we have none I order more. She works in Outlook, Teams and Excel, on a computer and on her phone. Lunch for the whole office and keeping the fridges stocked take the most time. She is new to AI and has never really used it. She is an employee and is not sure what her company allows.",
    job: "I am an office coordinator for an office of about 70 people. I prepare and organize lunch for everyone. I order drinks, restock the fridges and keep the office clean and organized. I take care of the plants and general maintenance. I handle special orders and preparations for company events. I coordinate suppliers and make sure we have what we need. I am the person everyone comes to when something is missing or needs fixing. If the printer runs out of ink I find a replacement, and if we have none I order more.",
    level: "not_yet",
    device: "both",
    canUse: "not_sure",
    connect: "not_sure",
  },
  property: {
    who: "A job never tested before: a property manager for 40 rental apartments. Builder who uses ChatGPT some weeks, Gmail and Google Sheets, computer and phone, her company is fine with AI.",
    bio: "Dana, 41, property manager for a small company that owns 40 rental apartments in three buildings. Tenants text and email her about repairs all day, and she books the plumber or the handyman and tells the tenant when they are coming. She does a walk through of each building every month with a checklist, sends rent reminders on the 1st, handles move ins and move outs with a key handover and an inspection, and answers the same questions about parking, trash days and laundry. She keeps a repair log and the rent roll in Google Sheets and works from Gmail. Repair requests and the monthly walk throughs take the most time. She uses ChatGPT some weeks for tricky emails. Her company is fine with AI, but no one has said anything about connecting her Gmail.",
    job: "Property manager for 40 rental apartments in three buildings. Repairs, tenants, move ins and outs, inspections.",
    level: "uses",
    device: "both",
    canUse: "yes",
    connect: "not_sure",
  },
  kayla: {
    who: "Someone who only uses a phone: Kayla, the electrician from the earlier runs. Self employed Starter on a Samsung phone.",
    bio: "Kayla, 27, electrician who owns a one truck business in Phoenix. She is in attics by 7am and on job sites all day; she has no office and works from her Samsung phone in the truck. The paperwork around the job is what drags: writing quotes, sending invoices, texting homeowners about times, chasing payment, asking for reviews, and keeping the truck stocked with breakers, wire and fittings so she doesn't run to the supply house mid job. She does quotes on her phone at night, often by talking them through. She tried ChatGPT once to write a review request and forgot about it.",
    job: "Electrician. I own my own business, one truck, mostly homes in Phoenix.",
    level: "tried",
    device: "phone",
    canUse: "self",
    connect: null,
  },
  hr: {
    who: "Someone in Outlook and Excel: Priya, the HR coordinator from the earlier runs. Starter on a computer, not sure what her company allows.",
    bio: "Priya, 33, HR coordinator at a logistics company with about 300 people. She works in Outlook and Excel all day, beside the company's HR system: scheduling interviews, sending offer letters and onboarding emails, answering the same policy questions about leave and benefits, keeping the onboarding checklist in Excel, keeping employee records up to date, and writing the monthly HR newsletter. Onboarding and the same benefits questions take the most time. She tried Copilot a few times. She is not sure what the company allows with employee data.",
    job: "HR coordinator at a logistics company, about 300 employees.",
    level: "tried",
    device: "computer",
    canUse: "not_sure",
    connect: "not_sure",
  },
};

// Playing her, as scripts/persona-runs.ts does

const anthropic = new Anthropic();

const PLAYER_SYSTEM = `You play a woman taking a short quiz on her phone about her work. Answer each screen as she would, from her bio and nothing else. Stay in character: her words, her level of detail, her mood. Never mention that you are playing a part.

- picked: the choices she taps, copied exactly as offered. Only choices from the list. "one" means exactly one; "many" means all that fit her; "upto2" means one or two.
- text: what she types under "Something else" (only when the screen offers it and something important to her is missing from the choices; at most 60 characters, so a few words). Null when she has nothing to add.
- A woman who writes little writes little. Never add details her bio doesn't support.`;

const playerSchema = {
  type: "object",
  properties: { picked: { type: "array", items: { type: "string" } }, text: { anyOf: [{ type: "string" }, { type: "null" }] } },
  required: ["picked", "text"],
  additionalProperties: false,
} as const;

type Kind = "one" | "many" | "upto2";

async function answerAs(bio: string, q: { title: string; hint?: string | null; kind: Kind; choices: readonly string[]; somethingElse: boolean }) {
  const content = [
    `<bio>\n${bio}\n</bio>`,
    "",
    `Screen: ${q.title}`,
    q.hint ? `Hint under it: ${q.hint}` : "",
    `Kind: ${q.kind}`,
    `Choices:\n${q.choices.map((c) => `- ${c}`).join("\n")}`,
    q.somethingElse ? "The screen also offers Something else, where she can type." : "No Something else on this screen.",
  ]
    .filter(Boolean)
    .join("\n");
  for (let attempt = 0; attempt < 3; attempt++) {
    const response = await anthropic.messages.create(
      {
        model: intakeModel(),
        max_tokens: 500,
        thinking: { type: "disabled" },
        output_config: { effort: "low", format: { type: "json_schema", schema: playerSchema } },
        system: PLAYER_SYSTEM,
        messages: [{ role: "user", content }],
      },
      { timeout: 60_000, maxRetries: 2 },
    );
    const block = response.content.find((b) => b.type === "text");
    if (!block || block.type !== "text") continue;
    const raw = JSON.parse(block.text) as { picked: string[]; text: string | null };
    let picked = [...new Set(raw.picked.filter((p) => q.choices.includes(p)))];
    if (q.kind === "one") picked = picked.slice(0, 1);
    if (q.kind === "upto2") picked = picked.slice(0, 2);
    const text = q.somethingElse ? raw.text?.trim().slice(0, PICK_MAX).trim() || null : null;
    if (picked.length || text) return { picked, text };
  }
  throw new Error(`She couldn't answer ${q.title}`);
}

const choiceQA = <T extends string>(id: string, title: string, options: readonly T[], labels: Record<T, string>, value: T): QA => ({
  id,
  title,
  picked: [labels[value]],
  text: null,
  shown: options.map((o) => labels[o]),
});

const seconds = (ms: number) => Math.round(ms / 100) / 10;

// One woman through the quiz and her free result

async function run(name: string, p: Persona) {
  const builder = usesAi(p.level);

  // Screen 1, her job; the AI reads it while she answers her level.
  const jobStart = Date.now();
  const read0 = await readJob(p.job, { allowCall: async () => true });
  const jobSeconds = seconds(Date.now() - jobStart);
  const { read, fallback } = jobReadOrFallback(read0);
  const qas: QA[] = [choiceQA("level", screens.level.title, EXPERIENCE, experienceLabels, p.level)];

  let aiTools: AiTool[] = p.level === "not_yet" ? ["none_yet"] : ["not_sure"];
  if (builder) {
    const done = await answerAs(p.bio, { title: doneWithAi.title, hint: doneWithAi.hint, kind: "many", choices: [...doneWithAi.choices, doneWithAi.none], somethingElse: false });
    qas.push({ id: "done", title: doneWithAi.title, picked: done.picked, text: null, shown: [...doneWithAi.choices, doneWithAi.none] });
    const toolChoices = AI_TOOLS.map((t) => toolLabels[t]);
    const tools = await answerAs(p.bio, { title: screens.tools.title, kind: "many", choices: toolChoices, somethingElse: false });
    aiTools = AI_TOOLS.filter((t) => tools.picked.includes(toolLabels[t]) && t !== "other");
    if (aiTools.length > 1) aiTools = aiTools.filter((t) => t !== "none_yet" && t !== "not_sure");
    if (!aiTools.length) aiTools = ["not_sure"];
    qas.push({ id: "tools", title: screens.tools.title, picked: aiTools.map((t) => toolLabels[t]), text: null, shown: toolChoices });
  }

  // What she does over and over, in two small groups.
  const choices = repeatChoices(read);
  const repeatList = choices.map((c) => c.label);
  const repeats = await answerAs(p.bio, { title: screens.repeats.title, hint: screens.repeats.hint, kind: "many", choices: repeatList, somethingElse: true });
  qas.push({ id: "repeats", title: screens.repeats.title, picked: repeats.picked, text: repeats.text, shown: repeatList });

  // Which would save her the most time, and how often.
  const most = mostOptions(read, repeats.picked, repeats.text);
  const mostWanted =
    most.length === 1 ? most : (await answerAs(p.bio, { title: screens.most.title, hint: screens.most.hint, kind: "upto2", choices: most, somethingElse: false })).picked;
  if (!mostWanted.length) mostWanted.push(most[0]);
  qas.push({ id: "most", title: screens.most.title, picked: mostWanted, text: null, shown: most });
  const oftenLabels = OFTEN.map((o) => oftenQuestion.labels[o]);
  const oftenPick = (await answerAs(p.bio, { title: `${oftenQuestion.title} (${mostWanted[0]})`, kind: "one", choices: oftenLabels, somethingElse: false })).picked[0];
  const often = OFTEN.find((o) => oftenQuestion.labels[o] === oftenPick) as Often | undefined;
  if (often) qas.push(choiceQA("often", oftenQuestion.title, OFTEN, oftenQuestion.labels, often));

  // Where her work happens, and what she uses for work.
  const places = whereOptions(read);
  const where = await answerAs(p.bio, { title: whereScreen.title, hint: whereScreen.hint, kind: "many", choices: places, somethingElse: true });
  qas.push({ id: "where", title: whereScreen.title, picked: where.picked, text: where.text, shown: places });
  qas.push(choiceQA("device", deviceQuestion.title, DEVICES, deviceQuestion.labels, p.device));

  // Can you use AI for your work, unless her job said she works for herself, then the connect question.
  const selfFromJob = read.worksFor === "self";
  const canUse: CanUse = selfFromJob ? "self" : p.canUse;
  if (!selfFromJob) {
    qas.push(choiceQA("can_use", canUseQuestion.title, CAN_USE, canUseLabels, canUse));
    if ((canUse === "yes" || canUse === "not_sure") && p.connect) qas.push(choiceQA("connect", connectQuestion.title, CONNECT, connectQuestion.labels, p.connect));
  }
  const steps = stepsFor({ level: p.level, worksForFromJob: read.worksFor, canUse: selfFromJob ? null : canUse });

  const work = canUseToWork(canUse);
  const answers = cleanAnswers({
    job: p.job, experience: p.level, qas, mostWanted, worksFor: work.worksFor, aiTools, aiToolsOther: null,
    aiPolicy: hasEmployer(work.worksFor) ? work.aiPolicy : null, often: often ?? null,
  });
  if (!answers) throw new Error("Her answers broke the server's rules");

  // The final read, timed as the server makes it: two attempts at most, the same timeout as the live site.
  const readStart = Date.now();
  let attempts = 0;
  const intake = await readBeginnerIntake(answers, { onRaw: () => attempts++ });
  const readSeconds = seconds(Date.now() - readStart);
  const r = intake?.result;
  if (!r?.first_win || !r.tasks.length) throw new Error(`The final read gave no result${r?.needs_follow_up ? `; it asked: ${r.follow_up_question}` : ""}`);
  const free = freeResultFor(answers, { first_win: r.first_win, first_step: r.first_step, map: r.map });
  return { name, persona: p, jobRead: read, jobReadFallback: fallback, jobSeconds, readSeconds, attempts, steps, answers, intake: r, free };
}

type Run = Awaited<ReturnType<typeof run>>;

// Checks

const check = (id: string, pass: boolean, detail: string): Check => ({ id, pass, detail });
const lvl = (m: MapLine) => (m.waits ? levelCopy.waits : m.level ? LEVELS[m.level] : "none");

/** Every line of her offer as she reads it on the paywall. */
function offerLines(free: FreeResult): string[] {
  if (free.askOnly) return [free.askMessage ?? ""];
  return [
    beginnerPaywall.title,
    offerCopy.whatYouGet(free.offer?.length ?? 0),
    ...(free.offer ?? []).flatMap((o) => [o.name, ...o.pieces]),
    offerCopy.startsWithQuestions,
    ...(free.prep.length ? [offerCopy.prepLead, ...free.prep] : []),
    ...(free.freePlan ? [beginnerPaywall.freePlan] : []),
  ];
}

function checksFor(o: Run): Check[] {
  const { free, steps, persona } = o;
  const track = trackFor(persona.level);
  const max = track === "starter" ? 7 : 9;
  const out: Check[] = [
    check("screens", steps.length <= max, `${steps.length} screens (${steps.join(", ")}), at most ${max} for a ${track}`),
    check("job_read", !o.jobReadFallback, o.jobReadFallback ? "the job read failed, she saw the four fixed choices" : `${o.jobRead.hers.length} of hers and ${o.jobRead.usual.length} usual, ${o.jobSeconds} s`),
    check("fast", o.readSeconds <= 8, `free result in ${o.readSeconds} s, ${o.attempts} ${o.attempts === 1 ? "attempt" : "attempts"}`),
    check(
      "no_stays_on_better_rows",
      free.map.every((m) => !m.ai || !/stays? yours|staying yours/i.test(m.withPath)),
      free.map.filter((m) => m.ai && /stays? yours|staying yours/i.test(m.withPath)).map((m) => m.task).join(", ") || "no row that can run better says it stays hers",
    ),
    check(
      "two_workflows",
      Boolean(free.askOnly) || (free.offer?.length ?? 0) === Math.min(2, free.map.filter((m) => m.ai && !m.waits).length),
      `${free.offer?.length ?? 0} workflows offered, ${free.map.filter((m) => m.ai && !m.waits).length} rows can run smoother`,
    ),
    check("read_as_responsibilities", readAsResponsibilities(free.map), "every row has its patterns"),
    check("offer_pieces", Boolean(free.askOnly) || Boolean(free.offer?.length && free.offer.every((w) => w.pieces.length)), `${free.offer?.length ?? 0} workflows, each with pieces`),
    check(
      "pieces_her_words",
      (free.offer ?? []).every((w, i) => {
        const m = free.map.find((row) => free.setups[i]?.startsWith(row.phrase ? `Your ${row.phrase}` : row.task));
        return !m || w.pieces.every((p) => p.includes(thingOf(m)));
      }),
      `things: ${free.map.map((m) => (m.thing ? m.thing : `${thingOf(m)} (from her name for the task)`)).join("; ")}`,
    ),
    check("no_dash", ![...offerLines(free), ...free.map.flatMap((m) => [m.today, m.withPath])].some((l) => DASH.test(l)), "no dash in the map or offer"),
    check("no_time_promise", !free.map.some((m) => TIME_PROMISE.test(`${m.today} ${m.withPath}`) || SPEED_PROMISE.test(`${m.today} ${m.withPath}`)), "no minutes, hours or faster on the map"),
    check(
      "level3_not_writing_help",
      free.map.filter((m) => (m.level ?? 0) >= 3).every((m) => !WRITING_HELP.test(m.withPath)),
      free.map.filter((m) => (m.level ?? 0) >= 3 && WRITING_HELP.test(m.withPath)).map((m) => m.task).join(", ") || "none read like writing help",
    ),
    check("no_click_paths", !free.map.some((m) => MENU.test(m.withPath)), "no menu words on the map"),
    check(
      "nothing_sounds_automatic",
      ![...free.map.map((m) => m.withPath), ...(free.offer ?? []).flatMap((o) => [o.name, ...o.pieces])].some((l) => SOUNDS_AUTOMATIC.test(l)),
      free.map.filter((m) => SOUNDS_AUTOMATIC.test(m.withPath)).map((m) => `${m.task}: ${m.withPath}`).join("; ") || "no line says anything happens without her",
    ),
    check(
      "ask_first_only_with_ai",
      free.map.every((m) => !m.askFirst || !m.workflow || m.workflow === "pattern_10"),
      free.map.filter((m) => m.askFirst).map((m) => m.task).join(", ") || "no row asks first",
    ),
    check("starter_at_most_3", track !== "starter" || free.map.every((m) => (m.level ?? 0) <= 3), "a Starter stops at level 3"),
  ];
  if (o.name === "office") {
    const lunch = free.map.find((m) => /lunch/i.test(m.task));
    const restock = free.map.find((m) => /restock|fridge/i.test(m.task));
    out.push(
      check("office_five", free.map.length >= 5, `${free.map.length} responsibilities on her map`),
      check("office_lunch", lunch?.level === 3 && !lunch.askFirst, lunch ? `${lunch.task}: ${lvl(lunch)}${lunch.askFirst ? ", Ask first" : ""}` : "no lunch row"),
      check("office_restock", restock?.level === 3 && !restock.askFirst, restock ? `${restock.task}: ${lvl(restock)}${restock.askFirst ? ", Ask first" : ""}` : "no restock row"),
    );
  }
  return out;
}

// Her file, as she would read it

function markdown(o: Run, checks: Check[]): string {
  const { free, persona: p, intake } = o;
  const rows = orderMap(free.map, free.firstWin.task);
  const L: string[] = [
    `# ${o.name}: her map and offer (Phase 8)`,
    "",
    p.who,
    "",
    `${experienceLabels[p.level]}, ${trackFor(p.level)}. ${deviceQuestion.labels[p.device]}. ${o.steps.length} screens. Job read in ${o.jobSeconds} s, free result in ${o.readSeconds} s (${o.attempts} ${o.attempts === 1 ? "attempt" : "attempts"}).`,
    "",
    "Every line of copy below is DRAFT unless DIRECTION.md or Karl already approved it.",
    "",
    "## The quiz, as she answered it",
    "",
    `**${screens.repeats.title}**`,
    "",
    ...(o.jobReadFallback
      ? [`The job read failed, so she saw the four fixed choices: ${repeatChoices(o.jobRead).map((c) => c.label).join(", ")}.`]
      : [
          `*${repeatGroups.hers}:* ${repeatChoices(o.jobRead).filter((c) => c.group === "hers").map((c) => c.label).join(", ") || "none"}`,
          "",
          `*${repeatGroups.usual}:* ${repeatChoices(o.jobRead).filter((c) => c.group === "usual").map((c) => c.label).join(", ")}`,
        ]),
    "",
    ...o.answers.qas.map((qa) => `* ${qa.title} **${[...qa.picked, ...(qa.text ? [`“${qa.text}”`] : [])].join(", ") || "Skipped"}**`),
    "",
    "## Her free result",
    "",
    `*${firstWinCopy.weekEyebrow}*`,
    "",
    `### ${firstWinCopy.smoother(smootherCount(free.map))}`,
    "",
  ];
  const inPath = new Set(offerTasks(rows, free.firstWin.task).map((m) => m.task));
  for (const m of rows) {
    L.push(`**${m.task}** \`${lvl(m)}\`${inPath.has(m.task) ? ` \`${firstWinCopy.inPath}\`` : ""}`, "");
    L.push(`* ${firstWinCopy.today}: ${m.today}`);
    if (!m.stays) L.push(`* ${inPath.has(m.task) ? firstWinCopy.withPath : firstWinCopy.couldChange}: ${m.withPath}`);
    if (m.stays) L.push(`* ${levelCopy.stays[m.stays]}`);
    if (m.held) L.push(`* ${levelCopy.held[m.held]}`);
    if (m.askFirst) L.push(`* ${levelCopy.askFirstNotSure}`);
    L.push(
      `* Behind the row: patterns ${(m.patterns ?? []).map((n) => `${n} (${PATTERNS[n]})`).join(", ") || "none"}; ${m.recipe ? `recipe ${m.recipe}` : m.workflow ? `workflow ${m.workflow}` : "no workflow"}; thing ${m.thing ? `“${m.thing}”` : "not trusted"}.`,
    );
    if (m.task === free.firstWin.task) {
      L.push("", `[${firstWinCopy.seeIt}]`, "", `> ${free.firstWin.intro}`, ">", ...free.firstWin.draft.split("\n").map((l) => `> ${l}`));
    }
    L.push("");
  }
  L.push("## Her offer, word for word", "");
  if (free.askOnly) {
    L.push("Nothing to buy. Only the message to ask:", "", `> ${free.askMessage}`);
  } else {
    L.push(`### ${beginnerPaywall.title}`, "", offerCopy.whatYouGet(free.offer?.length ?? 0), "");
    (free.offer ?? []).forEach((w, i) => {
      L.push(`${i + 1}. **${w.name}**`, ...w.pieces.map((piece) => `    * ${piece}`));
    });
    L.push("", offerCopy.startsWithQuestions);
    if (free.prep.length) L.push("", `**${offerCopy.prepLead}**`, ...free.prep.map((s, i) => `${i + 1}. ${s}`));
    if (free.freePlan) L.push("", beginnerPaywall.freePlan);
    // The price line and button are the paywall's own (lib/plan-copy.ts), which this script cannot load.
    L.push("", `${dollars(product.price.cents)}, paid once. No subscription.`, "", "[Get my plan]");
  }
  L.push("", "## Checks", "", ...checks.map((c) => `* ${c.pass ? "PASS" : "FAIL"} ${c.id}: ${c.detail}`), "");
  L.push(`Role read: ${intake.role_summary}`, "");
  return L.join("\n");
}

mkdirSync(OUT, { recursive: true });
const names = Object.keys(personas).filter((n) => !ONLY || ONLY.includes(n));
const summary: Record<string, unknown> = {};
await Promise.all(
  names.map(async (name) => {
    try {
      const o = await run(name, personas[name]);
      const checks = checksFor(o);
      writeFileSync(`${OUT}/${name}.json`, JSON.stringify({ ...o, checks }, null, 1));
      writeFileSync(`${OUT}/${name}.md`, markdown(o, checks));
      summary[name] = {
        screens: o.steps.length,
        jobSeconds: o.jobSeconds,
        readSeconds: o.readSeconds,
        attempts: o.attempts,
        responsibilities: o.free.map.length,
        levels: o.free.map.map((m) => `${m.task}: ${lvl(m)}${m.askFirst ? " (Ask first)" : ""}`),
        offer: o.free.offer,
        failed: checks.filter((c) => !c.pass).map((c) => `${c.id}: ${c.detail}`),
      };
      console.error(`done ${name}: ${checks.filter((c) => !c.pass).length} failed checks, result in ${o.readSeconds} s`);
    } catch (error) {
      summary[name] = { error: String(error) };
      console.error(`failed ${name}: ${error}`);
    }
  }),
);
writeFileSync(`${OUT}/summary.json`, JSON.stringify({ ranAt: new Date().toISOString(), versions: { job: JOB_PROMPT_VERSION, intake: BEGINNER_INTAKE_VERSION, model: intakeModel() }, runs: summary }, null, 1));
console.error("written");
