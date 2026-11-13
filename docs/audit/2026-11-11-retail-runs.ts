// Runs made up retail floor workers through the real beginner intake + plan writer, and the original intake.
import { readFileSync, writeFileSync } from "node:fs";

const ROOT = process.argv[2];
for (const l of readFileSync(`${ROOT}/.env.local`, "utf8").split("\n")) {
  const m = l.match(/^([A-Z_]+)=(.*)$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
}

const { readBeginnerIntake } = await import(`${ROOT}/lib/beginner/intake.ts`);
const { writeBeginnerPlan } = await import(`${ROOT}/lib/beginner/plan-writer.ts`);
const { readIntake } = await import(`${ROOT}/lib/intake.ts`);
const { IDEAS_SHOWN } = await import(`${ROOT}/lib/beginner/types.ts`);

type P = {
  job: string; week: string; extraWork: string; worksFor: "self" | "employer" | "both";
  experience: "never" | "once" | "sometimes" | "often"; aiTools: string[]; aiPolicy: string | null;
  followUpAnswer: string;
};

const personas: Record<string, P> = {
  associate: {
    job: "Sales associate at a clothing store in the mall. Part time, about 28 hours.",
    week: "On the floor helping customers, folding and refolding tables, fitting rooms, the register, unloading the truck on Tuesdays, putting out new stock. We have to push the store card at every sale. I don't have a computer at work, just my phone.",
    extraWork: "I end up training every new hire and fixing the schedule when people swap shifts in the group chat.",
    worksFor: "employer", experience: "never", aiTools: ["none_yet"], aiPolicy: "no_idea",
    followUpAnswer: "The fitting rooms and folding take most of the day. Also answering the same questions about returns and sizes.",
  },
  grocery: {
    job: "Assistant store manager at a grocery store, about 40 people on staff.",
    week: "I'm on my feet 10 hours a day. Covering call outs, building the schedule every week, inventory counts, receiving deliveries, handling customer complaints, training cashiers, walking the store for the district manager visit. The schedule is done on the store tablet, everything else is in my head or on paper.",
    extraWork: "I plan the staff birthday stuff and I'm the one everyone texts when they need a shift covered.",
    worksFor: "employer", experience: "once", aiTools: ["chatgpt"], aiPolicy: "unclear",
    followUpAnswer: "Call outs and the schedule eat the most time. Then complaints.",
  },
  cashier: {
    job: "Cashier at a big box store.",
    week: "Register and stocking shelves.",
    extraWork: "Sometimes I cover self checkout.",
    worksFor: "employer", experience: "never", aiTools: ["not_sure"], aiPolicy: "no_idea",
    followUpAnswer: "Mostly ringing people up and dealing with returns and coupons that don't scan. When it's slow I face shelves and do go backs.",
  },
  boutique: {
    job: "I own a small women's clothing boutique, just me and two part timers.",
    week: "Working the floor, buying at markets twice a year, posting new arrivals on Instagram, steaming and tagging stock, window displays every month, payroll and paying vendors, answering DMs about sizes and holds. I do most of it on my phone between customers.",
    extraWork: "Everything is my job.",
    worksFor: "self", experience: "sometimes", aiTools: ["chatgpt", "other"], aiPolicy: null,
    followUpAnswer: "Instagram and the DMs take the most time, then tagging stock.",
  },
  beauty: {
    job: "Beauty advisor at a department store makeup counter, paid partly on commission.",
    week: "Doing makeovers and color matching, restocking testers, cleaning the counter, keeping my client book, texting my clients when new launches come in or there's a gift with purchase, hitting my sales goals, events on weekends.",
    extraWork: "Training the new girls on the brand and doing the counter's displays.",
    worksFor: "employer", experience: "once", aiTools: ["not_sure"], aiPolicy: "restricted",
    followUpAnswer: "Texting clients and keeping the client book take the most time outside makeovers.",
  },
};

async function run(name: string, p: P) {
  const out: Record<string, unknown> = { persona: p };
  const base = { job: p.job, week: p.week, worksFor: p.worksFor, experience: p.experience, aiTools: p.aiTools,
    aiToolsOther: p.aiTools.includes("other") ? "Canva's AI for posts" : null,
    aiPolicy: p.worksFor === "self" ? null : p.aiPolicy };

  // Beginner flow, with the one follow up when it asks.
  let t = Date.now();
  let read = await readBeginnerIntake(base);
  if (read?.result.needs_follow_up) {
    out.beginnerFollowUp = read.result.follow_up_question;
    read = await readBeginnerIntake({ ...base, followUp: { question: read.result.follow_up_question, answer: p.followUpAnswer } });
  }
  out.beginnerIntakeSeconds = (Date.now() - t) / 1000;
  out.beginnerIntake = read?.result ?? null;
  const r = read?.result;
  if (r?.first_win) {
    t = Date.now();
    try {
      out.beginnerPlan = await writeBeginnerPlan({
        job: p.job, week: p.week,
        followUp: out.beginnerFollowUp ? { question: out.beginnerFollowUp as string, answer: p.followUpAnswer } : null,
        role: r.role_summary, worksFor: p.worksFor, experience: p.experience, aiTools: base.aiTools,
        aiToolsOther: base.aiToolsOther, aiPolicy: base.aiPolicy, tasks: r.tasks, firstWin: r.first_win,
        shownIdeas: r.ideas.slice(0, IDEAS_SHOWN),
      });
    } catch (e) { out.beginnerPlanError = String(e); }
    out.beginnerPlanSeconds = (Date.now() - t) / 1000;
  }

  // Original intake, for comparison.
  const orig = { job: p.job, week: p.week, extraWork: p.extraWork, aiTools: p.aiTools,
    aiToolsOther: base.aiToolsOther, aiPolicy: p.aiPolicy ?? "no_idea" };
  let o = await readIntake(orig);
  if (o?.result.needs_follow_up) {
    out.originalFollowUp = o.result.follow_up_question;
    o = await readIntake({ ...orig, followUp: { question: o.result.follow_up_question, answer: p.followUpAnswer } });
  }
  out.originalIntake = o?.result ?? null;
  console.error(`done ${name}`);
  return [name, out] as const;
}

const results = Object.fromEntries(await Promise.all(Object.entries(personas).map(([n, p]) => run(n, p).catch((e) => [n, { error: String(e) }]))));
writeFileSync(process.argv[3], JSON.stringify(results, null, 1));
console.error("written");
