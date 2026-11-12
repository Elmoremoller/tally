// Runs eight made up women through the context quiz at /begin, screen by screen, with the real AI calls: the
// read of her job, the questions written for her, the final read and her plan. A second model call plays each
// woman from her bio and answers every screen in her voice, picking from the choices the screen offered.
// Built from docs/audit/2026-11-11-retail-runs.ts. Run it with
//   node_modules/.bin/jiti scripts/persona-runs.ts <repo root> <output json> [names, comma separated]
// With names, only those women run, and their results replace theirs in the output file; the rest are kept.
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import Anthropic from "@anthropic-ai/sdk";

const ROOT = process.argv[2];
const OUT = process.argv[3];
const ONLY = process.argv[4]?.split(",").filter(Boolean) ?? null;
if (!ROOT || !OUT) throw new Error("Usage: jiti scripts/persona-runs.ts <repo root> <output json> [names]");

for (const l of readFileSync(`${ROOT}/.env.local`, "utf8").split("\n")) {
  const m = l.match(/^([A-Z_]+)=(.*)$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
}

const { readJob, writeQuestions, JOB_PROMPT_VERSION, QUESTIONS_PROMPT_VERSION } = await import(
  `${ROOT}/lib/beginner/questions-ai.ts`
);
const { readBeginnerIntake, BEGINNER_INTAKE_VERSION } = await import(`${ROOT}/lib/beginner/intake.ts`);
const { writeBeginnerPlan, nearSame, BEGINNER_PLAN_VERSION } = await import(`${ROOT}/lib/beginner/plan-writer.ts`);
const { mostOptions, digest, jobReadOrFallback, PICK_MAX } = await import(`${ROOT}/lib/beginner/quiz.ts`);
const { cleanAnswers } = await import(`${ROOT}/lib/beginner/answers.ts`);
const { beginnerQuestions: screens } = await import(`${ROOT}/lib/beginner/copy.ts`);
const { IDEAS_SHOWN, experienceLabels } = await import(`${ROOT}/lib/beginner/types.ts`);
const { intakeModel } = await import(`${ROOT}/lib/intake.ts`);
const { AI_TOOLS, toolLabels } = await import(`${ROOT}/lib/week.ts`);

type Experience = "not_yet" | "tried" | "uses";
type WorksFor = "self" | "employer" | "both";
type AiPolicy = "encouraged" | "unclear" | "restricted" | "no_idea";
type QA = { id: string; title: string; picked: string[]; text: string | null; shown?: string[] };

type Persona = {
  /** Who she is, for the model that plays her. Everything she might say comes from here. */
  bio: string;
  /** Screen 1, in her own words. */
  job: string;
  level: Experience;
  worksFor: WorksFor;
  /** Her company's view on AI, when she has an employer. */
  aiPolicy: AiPolicy | null;
  /** True when she works without a desk or computer, so nothing should assume one. */
  noDesk: boolean;
};

const personas: Record<string, Persona> = {
  jess: {
    bio: "Jess, 24, event coordinator at a restaurant group in Chicago. Her inbox is full of clients, caterers, florists and AV people. She keeps the run of show, floor plans and vendor timelines in Google Sheets, collects headcounts and dietary lists the week before each event, sends banquet orders to the kitchen, and is on site with a headset on event nights. Vendor follow ups eat her afternoons. She has used ChatGPT for a few emails and a toast once, but mostly writes everything herself.",
    job: "Event coordinator for a restaurant group in Chicago. I plan private events and run them on the night.",
    level: "uses",
    worksFor: "employer",
    aiPolicy: "unclear",
    noDesk: false,
  },
  maya: {
    bio: "Maya, 26, social media manager at a skincare brand in Austin. She runs TikTok, Instagram and Pinterest. Her content calendar lives in Notion, she films on her iPhone, edits in CapCut and schedules in Later. Every morning she answers comments and DMs, she pulls numbers for the Monday sync, chases creators for their posts, and tries to keep up with trends. She uses ChatGPT for caption ideas and sometimes Claude, but the captions come out sounding generic and she rewrites them.",
    job: "Social media manager at a skincare brand. TikTok, Instagram and Pinterest.",
    level: "uses",
    worksFor: "employer",
    aiPolicy: "encouraged",
    noDesk: false,
  },
  kayla: {
    bio: "Kayla, 27, electrician who owns a one truck business in Phoenix. She is in attics by 7am and on job sites all day; she has no office and works from her phone in the truck. The paperwork around the job is what drags: writing quotes, sending invoices, texting homeowners about times, chasing payment, asking for reviews. She does quotes on her phone at night. She tried ChatGPT once to write a review request and forgot about it.",
    job: "Electrician. I own my own business, one truck, mostly homes in Phoenix.",
    level: "tried",
    worksFor: "self",
    aiPolicy: null,
    noDesk: true,
  },
  associate: {
    bio: "Sales associate at a clothing store in the mall, part time, about 28 hours. On the floor helping customers, folding and refolding tables, fitting rooms, the register, unloading the truck on Tuesdays, putting out new stock. The store wants her to offer the store card at every sale. She has no computer at work, just her phone. She ends up training new hires and sorting out shift swaps in the group chat. Customers ask the same questions about returns and sizes all day. She has never used AI.",
    job: "Sales associate at a clothing store in the mall. Part time, about 28 hours.",
    level: "not_yet",
    worksFor: "employer",
    aiPolicy: "no_idea",
    noDesk: true,
  },
  grocery: {
    bio: "Assistant store manager at a grocery store with about 40 people on staff. On her feet 10 hours a day. Covering call outs, building the schedule every week on the store tablet, inventory counts, receiving deliveries, handling customer complaints, training cashiers, walking the store before the district manager visits. Everything except the schedule is in her head or on paper. Everyone texts her when they need a shift covered, and she plans the staff birthdays. She tried ChatGPT once and it didn't stick.",
    job: "Assistant store manager at a grocery store, about 40 people on staff.",
    level: "tried",
    worksFor: "employer",
    aiPolicy: "unclear",
    noDesk: true,
  },
  cashier: {
    bio: "Cashier at a big box store. Register and stocking shelves, sometimes self checkout. Mostly ringing people up and dealing with returns and coupons that don't scan. When it's slow she faces shelves and does go backs. Few words, not much of a writer. She has never used AI and isn't sure what it is for.",
    job: "Cashier at a big box store.",
    level: "not_yet",
    worksFor: "employer",
    aiPolicy: "no_idea",
    noDesk: true,
  },
  boutique: {
    bio: "Owns a small women's clothing boutique, just her and two part timers. Working the floor, buying at markets twice a year, posting new arrivals on Instagram, steaming and tagging stock, window displays every month, payroll and paying vendors, answering DMs about sizes and holds. She does most of it on her phone between customers. Instagram and the DMs take the most time, then tagging stock. She uses ChatGPT sometimes for captions and Canva's AI for posts.",
    job: "I own a small women's clothing boutique, just me and two part timers.",
    level: "uses",
    worksFor: "self",
    aiPolicy: null,
    noDesk: true,
  },
  beauty: {
    bio: "Beauty advisor at a department store makeup counter, paid partly on commission. Makeovers and color matching, restocking testers, cleaning the counter, keeping her client book, texting her clients when new launches come in or there's a gift with purchase, hitting her sales goals, events on weekends. She trains the new girls on the brand and does the counter's displays. Texting clients and keeping the client book take the most time outside makeovers. She tried an AI app once and didn't trust it. Her store restricts AI.",
    job: "Beauty advisor at a department store makeup counter, paid partly on commission.",
    level: "tried",
    worksFor: "employer",
    aiPolicy: "restricted",
    noDesk: true,
  },
};

// Playing her

const anthropic = new Anthropic();

const PLAYER_SYSTEM = `You play a woman taking a short quiz on her phone about using AI in her work. Answer each screen as she would, from her bio and nothing else. Stay in character: her words, her level of detail, her mood. Never mention that you are playing a part.

- picked: the choices she taps, copied exactly as offered. Only choices from the list. "one" means exactly one; "many" means all that fit her; "upto2" means one or two.
- text: what she types or says under "Something else" (only when the screen offers it and something important to her is missing from the choices; that field holds at most 60 characters, so a few words), or her answer on a type or talk screen. One or two short sentences at most, the way she'd type on a phone. Null when she has nothing to add or skips.
- A woman who writes little writes little. Never add details her bio doesn't support.`;

const playerSchema = {
  type: "object",
  properties: {
    picked: { type: "array", items: { type: "string" } },
    text: { anyOf: [{ type: "string" }, { type: "null" }] },
  },
  required: ["picked", "text"],
  additionalProperties: false,
} as const;

type Kind = "one" | "many" | "upto2" | "text";

/** One screen answered as her. Picks outside the choices are dropped, and the count is held to the screen's kind. */
async function answerAs(
  bio: string,
  q: { title: string; hint?: string | null; kind: Kind; choices: string[]; somethingElse: boolean },
): Promise<{ picked: string[]; text: string | null }> {
  const content = [
    `<bio>\n${bio}\n</bio>`,
    "",
    `Screen: ${q.title}`,
    q.hint ? `Hint under it: ${q.hint}` : "",
    `Kind: ${q.kind}`,
    q.choices.length ? `Choices:\n${q.choices.map((c) => `- ${c}`).join("\n")}` : "No choices: she types or talks, or skips.",
    q.kind !== "text" ? (q.somethingElse ? "The screen also offers Something else, where she can type." : "No Something else on this screen.") : "",
  ]
    .filter(Boolean)
    .join("\n");
  for (let attempt = 0; attempt < 3; attempt++) {
    const response = await anthropic.messages.create(
      {
        model: intakeModel(),
        max_tokens: 400,
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
    // The Something else field stops at PICK_MAX characters, as the quiz's does.
    const typed = raw.text?.trim() || null;
    const text = q.kind === "text" ? typed : q.somethingElse ? typed?.slice(0, PICK_MAX).trim() || null : null;
    if (q.kind === "text" || q.kind === "many" || picked.length || text) return { picked, text };
  }
  throw new Error(`She couldn't answer ${q.title}`);
}

// One woman through the quiz

const versions = {
  job: JOB_PROMPT_VERSION, questions: QUESTIONS_PROMPT_VERSION, intake: BEGINNER_INTAKE_VERSION, plan: BEGINNER_PLAN_VERSION,
};

const secondsSince = (t: number) => Math.round((Date.now() - t) / 100) / 10;

async function run(name: string, p: Persona) {
  const out: Record<string, unknown> = { persona: p, versions };
  const seconds: Record<string, number> = {};
  out.seconds = seconds;
  const allowCall = async () => true;

  // Screen 1 is her job, screen 2 her level. Call A reads her job while she answers screen 2.
  let t = Date.now();
  const aiRead = await readJob(p.job, { allowCall, timeoutMs: 30_000 });
  seconds.jobRead = secondsSince(t);
  const { read, fallback } = jobReadOrFallback(aiRead);
  out.jobRead = read;
  out.jobReadFallback = fallback;

  // Screen 3, what she does over and over.
  const repeatChoices = read.repeats.map((r: { label: string }) => r.label);
  const repeats = await answerAs(p.bio, {
    title: screens.repeats.title, hint: screens.repeats.hint, kind: "many", choices: repeatChoices, somethingElse: true,
  });
  // Screen 4, which would save her the most time.
  const most = mostOptions(read, repeats.picked, repeats.text);
  const mostTitle = most.fallback ? screens.most.fallbackTitle : screens.most.title;
  const mostAnswer = await answerAs(p.bio, {
    title: mostTitle, hint: most.fallback ? screens.most.fallbackHint : screens.most.hint, kind: "upto2",
    choices: most.options, somethingElse: false,
  });
  const mostWanted = mostAnswer.picked;
  // Screen 5, how she pictures AI helping, which she may skip.
  const picture = await answerAs(p.bio, {
    title: `${screens.picture.title} (She picked: ${mostWanted.join(", ")})`, hint: screens.picture.hint, kind: "text",
    choices: [], somethingElse: false,
  });
  // Screen 6, her apps.
  const apps = await answerAs(p.bio, {
    title: screens.apps.title, hint: screens.apps.hint, kind: "many", choices: read.apps, somethingElse: true,
  });
  // Screen 7, the AI she has used, for levels 2 and 3 only.
  let aiTools: string[] = ["none_yet"];
  let aiToolsOther: string | null = null;
  if (p.level !== "not_yet") {
    const tools = await answerAs(p.bio, {
      title: screens.tools.title, kind: "many", choices: AI_TOOLS.map((t: string) => toolLabels[t]), somethingElse: false,
    });
    aiTools = AI_TOOLS.filter((t: string) => tools.picked.includes(toolLabels[t]));
    if (!aiTools.length) aiTools = ["not_sure"];
    if (aiTools.length > 1) aiTools = aiTools.filter((t) => t !== "none_yet" && t !== "not_sure");
    if (aiTools.includes("other")) {
      const other = await answerAs(p.bio, { title: "Which other AI have you used?", kind: "text", choices: [], somethingElse: false });
      aiToolsOther = other.text ?? "An app on my phone";
    }
  }

  const baseQas: QA[] = [
    { id: "repeats", title: screens.repeats.title, picked: repeats.picked, text: repeats.text, shown: repeatChoices },
    { id: "most", title: mostTitle, picked: mostWanted, text: null, shown: most.options },
    { id: "picture", title: screens.picture.title, picked: [], text: picture.text },
    { id: "apps", title: screens.apps.title, picked: apps.picked, text: apps.text, shown: read.apps },
  ];

  // Screen 8, the questions written for her (Call B), then her answers to each.
  t = Date.now();
  const asked = await writeQuestions(
    { job: p.job, experience: p.level, qas: baseQas, mostWanted },
    { allowCall, timeoutMs: 30_000 },
  );
  seconds.questions = secondsSince(t);
  out.asked = asked;
  const askedQas: QA[] = [];
  for (const q of asked) {
    const a = await answerAs(p.bio, {
      title: q.title, hint: q.hint, kind: q.kind, choices: q.choices, somethingElse: q.kind !== "text",
    });
    askedQas.push(
      q.kind === "text"
        ? { id: q.id, title: q.title, picked: [], text: a.text }
        : { id: q.id, title: q.title, picked: a.picked, text: a.text, shown: q.choices },
    );
  }

  // Screens 9 and 10: who she works for, unless her job already said, and her company's view on AI.
  const fromJob = read.worksFor !== "unclear" ? read.worksFor : null;
  const worksFor: WorksFor = fromJob ?? p.worksFor;
  out.worksForFromJob = read.worksFor;
  const answers = cleanAnswers({
    job: p.job, experience: p.level, qas: [...baseQas, ...askedQas], mostWanted, worksFor,
    aiTools, aiToolsOther, aiPolicy: worksFor === "self" ? null : (p.aiPolicy ?? "no_idea"),
  });
  if (!answers) throw new Error("Her answers broke the server's rules");
  out.answers = answers;
  out.digest = digest(answers.qas);

  // The final read, with the one follow up when it asks.
  t = Date.now();
  let intake = await readBeginnerIntake(answers);
  let followUp: { question: string; answer: string } | undefined;
  if (intake?.result.needs_follow_up) {
    const question = intake.result.follow_up_question as string;
    const a = await answerAs(p.bio, { title: question, kind: "text", choices: [], somethingElse: false });
    followUp = { question, answer: a.text ?? "Not much else." };
    out.followUp = followUp;
    intake = await readBeginnerIntake({ ...answers, followUp });
  }
  seconds.intake = secondsSince(t);
  out.intake = intake?.result ?? null;
  const r = intake?.result;
  if (!r?.first_win) throw new Error("No first win");

  // Her plan, as app/begin/actions.ts and lib/funnel-db.ts build its input.
  t = Date.now();
  const plan = await writeBeginnerPlan({
    job: answers.job, qas: answers.qas, mostWanted: answers.mostWanted, followUp: followUp ?? null,
    role: r.role_summary, worksFor: answers.worksFor, experience: answers.experience, aiTools: answers.aiTools,
    aiToolsOther: answers.aiToolsOther, aiPolicy: answers.aiPolicy, tasks: r.tasks, firstWin: r.first_win,
    shownIdeas: r.ideas.slice(0, IDEAS_SHOWN),
  });
  seconds.plan = secondsSince(t);
  out.plan = plan.content;
  out.checks = checks(p, out, asked, mostWanted, r, plan.content);
  console.error(`done ${name}`);
  return out;
}

// Mechanical checks, to read beside the plans. Judging the bar itself is done by reading.

const DASH = /[–—]| - |\w-\w/;
const DESK = /\b(e ?mails?|inbox|computer|laptop|desk|spreadsheets?|google sheets|excel|word doc|docs?)\b/i;
const MADE_UP = /\d+ ?(%|percent)|\$ ?\d|\bper ?cent\b/i;
const words = (s: string) => s.split(/\s+/).filter(Boolean).length;

function checks(
  p: Persona,
  out: Record<string, unknown>,
  asked: { title: string; choices: string[] }[],
  mostWanted: string[],
  r: { first_win: { task: string; draft: string }; ideas: string[]; tasks: { name: string }[] },
  plan: { toolWhy: string; firstWin: { prompt: string; example: string }; ideas: { title: string; prompt: string; why: string }[]; workProfile: string },
) {
  const read = out.jobRead as { repeats: { label: string }[]; apps: string[]; aiFallback: string[] };
  const shownCopy = [
    ...read.repeats.map((x) => x.label), ...read.aiFallback, ...asked.flatMap((q) => [q.title, ...q.choices]),
  ];
  const planText = [
    plan.toolWhy, plan.firstWin.prompt, plan.firstWin.example, plan.workProfile,
    ...plan.ideas.flatMap((i) => [i.title, i.why, i.prompt]),
  ].join("\n");
  const titles = plan.ideas.map((i) => i.title);
  const nearPairs: string[][] = [];
  for (let i = 0; i < titles.length; i++)
    for (let j = i + 1; j < titles.length; j++) if (nearSame(titles[i], titles[j])) nearPairs.push([titles[i], titles[j]]);
  const deskWordsAsked = shownCopy.filter((s) => DESK.test(s));
  return {
    firstWinIsMostWanted: mostWanted.some((m) => m.toLowerCase() === r.first_win.task.toLowerCase()),
    firstWinTask: r.first_win.task,
    mostWanted,
    toolWhyNamesMostWanted: mostWanted.some((m) => plan.toolWhy.toLowerCase().includes(m.toLowerCase())),
    questionsOver10Words: asked.filter((q) => words(q.title) > 10).map((q) => q.title),
    choicesOver4Words: shownCopy.filter((s) => !s.endsWith("?") && words(s) > 4),
    dashes: [...shownCopy, r.first_win.draft, planText].filter((s) => DASH.test(s)).map((s) => s.slice(0, 120)),
    deskWordsInChoicesOrQuestions: p.noDesk ? deskWordsAsked : [],
    deskWordsInPlan: p.noDesk ? [...new Set(planText.match(new RegExp(DESK, "gi")) ?? [])] : [],
    moneyOrPercentInPlan: [...new Set([r.first_win.draft, planText].join("\n").match(new RegExp(MADE_UP, "g")) ?? [])],
    nearDuplicateIdeas: nearPairs,
    ideaCount: titles.length,
  };
}

const previous = ONLY && existsSync(OUT) ? JSON.parse(readFileSync(OUT, "utf8")) : { runs: {} };
const names = Object.keys(personas).filter((n) => !ONLY || ONLY.includes(n));
const results = await Promise.all(
  names.map(async (n) => [n, await run(n, personas[n]).catch((e) => ({ persona: personas[n], error: String(e) }))] as const),
);
const output = {
  ranAt: new Date().toISOString(),
  levels: experienceLabels,
  runs: { ...previous.runs, ...Object.fromEntries(results) },
};
writeFileSync(OUT, JSON.stringify(output, null, 1));
console.error("written");
