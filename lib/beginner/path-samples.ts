import { canUseLabels, type MapLine } from "./types";
import { doneWithAi } from "./quiz-copy";
import { experienceLabels, type Experience } from "./types";
import { orderMap } from "./free-result";
import { sampleWho, whoFrom, withLevels } from "./levels";
import { pathApps } from "./path";
import type { PathInput } from "./path-writer";
import type { QA } from "./quiz";
import { beginnerSamples } from "./samples";
import { trackFor } from "./types";

// Made up women for the path previews (/plan/preview?sample=path_dental and the others) and for
// scripts/path-runs.ts, which writes their paths with the live prompt (Phase 6 of docs/DIRECTION.md). The dental
// receptionist and the salon owner are the samples in samples.ts; the event planner and the tutor are new, so
// every kind of path is covered:
// 1. dental: a Starter with an employer, two tasks with the same recipe, so her second task is an extra step,
//    and a step that asks which phone she has.
// 2. salon: a Builder who works for herself and has not saved instructions about herself, on phone and computer.
// 3. planner: a Builder who works for herself in Gmail and ChatGPT, with two level 4 workflows, who has already
//    saved instructions about herself, so her path skips both opening steps.
// 4. tutor: a Starter who works for herself, with no recipe for either task, so both are written with AI.
// Nothing here is shown on the live site.

const qa = (id: string, title: string, picked: string[], text: string | null = null): QA => ({ id, title, picked, text });

function answers(job: string, level: Experience, more: QA[]): QA[] {
  return [qa("job", "What do you do for work?", [], job), qa("level", "Where are you with AI?", [experienceLabels[level]]), ...more];
}

const row = (task: string, kind: MapLine["kind"], today: string, opts: Partial<MapLine> = {}): MapLine => ({
  task,
  phrase: task.toLowerCase(),
  today,
  withPath: "",
  ai: true,
  private: false,
  kind,
  ...opts,
});

const dental = beginnerSamples.dental;
const salon = beginnerSamples.salon;

/** A sample's path input, with levels chosen in code as on the live result. */
function input(base: Omit<PathInput, "map" | "apps" | "device" | "track"> & { map: MapLine[]; places: string[]; device: PathInput["device"] }): PathInput {
  const track = trackFor(base.experience);
  const who = whoFrom({ track, worksFor: base.worksFor, aiPolicy: base.aiPolicy, qas: base.qas, aiTools: base.aiTools });
  const full = { ...who, places: base.places, device: base.device };
  return {
    job: base.job,
    qas: base.qas,
    mostWanted: base.mostWanted,
    role: base.role,
    worksFor: base.worksFor,
    experience: base.experience,
    aiTools: base.aiTools,
    aiPolicy: base.aiPolicy,
    top: base.top,
    tool: base.tool,
    device: base.device,
    firstStep: base.firstStep,
    track,
    map: orderMap(withLevels(base.map, full), base.top),
    apps: pathApps(full),
  };
}

export const pathSampleInputs: Record<"dental" | "salon" | "planner" | "tutor", PathInput> = {
  dental: (() => {
    const who = sampleWho(dental);
    return {
      job: "Receptionist at a dental office",
      qas: answers("Receptionist at a dental office", "tried", [
        qa("can_use", "Can you use AI for your work?", [canUseLabels.not_sure]),
        qa("where", "Where does your work happen?", dental.free.places),
      ]),
      mostWanted: [dental.firstWin.task],
      role: dental.plan.role,
      worksFor: "employer",
      experience: "tried",
      aiTools: [],
      aiPolicy: "no_idea",
      map: orderMap(withLevels(dental.free.map, who), dental.firstWin.task),
      top: dental.firstWin.task,
      track: "starter",
      tool: "claude",
      device: dental.free.device,
      apps: pathApps(who),
      firstStep: dental.free.firstStep,
    };
  })(),
  salon: (() => {
    const who = sampleWho(salon);
    return {
      job: "I own a small hair salon",
      qas: answers("I own a small hair salon", "uses", [
        qa("done", doneWithAi.title, [doneWithAi.choices[0], doneWithAi.choices[2]]),
        qa("example", "Paste one you wrote recently", [], "Balayage season is here! DM us a photo of the look you love and we will tell you how we would do it. Book through the link in bio."),
        qa("where", "Where does your work happen?", salon.free.places),
      ]),
      mostWanted: [salon.firstWin.task],
      role: salon.plan.role,
      worksFor: "self",
      experience: "uses",
      aiTools: ["claude"],
      aiPolicy: null,
      map: orderMap(withLevels(salon.free.map, who), salon.firstWin.task),
      top: salon.firstWin.task,
      track: "builder",
      tool: "claude",
      device: salon.free.device,
      apps: pathApps(who),
      firstStep: salon.free.firstStep,
    };
  })(),
  planner: input({
    job: "I run my own event planning business",
    qas: answers("I run my own event planning business", "heavy", [
      qa("done", doneWithAi.title, [doneWithAi.choices[0], doneWithAi.choices[1], doneWithAi.choices[4]]),
      qa("where", "Where does your work happen?", ["Gmail", "Google Sheets"]),
    ]),
    mostWanted: ["Vendor follow ups"],
    role: "You run your own event planning business, booking vendors, answering client inquiries and keeping guest lists for weddings and company events.",
    worksFor: "self",
    experience: "heavy",
    aiTools: ["chatgpt"],
    aiPolicy: null,
    map: [
      row("Vendor follow ups", "email_follow_ups", "You chase each vendor by hand when they go quiet, several times a week."),
      row("Client inquiries", "email_replies", "You answer each new inquiry from scratch in Gmail, most days."),
      row("Guest lists", "notes_to_table", "You copy RSVPs from emails into your sheet one by one.", { private: true }),
      row("Site visits", null, "You walk each venue in person.", { ai: false }),
    ],
    top: "Vendor follow ups",
    tool: "chatgpt",
    device: "computer",
    places: ["Gmail", "Google Sheets"],
    firstStep: null,
  }),
  tutor: input({
    job: "I tutor high school students in math, on my own",
    qas: answers("I tutor high school students in math, on my own", "not_yet", [
      qa("where", "Where does your work happen?", ["Text messages", "In person"]),
    ]),
    mostWanted: ["Practice problems"],
    role: "You tutor high school math students on your own, planning sessions, writing practice problems and keeping parents up to date.",
    worksFor: "self",
    experience: "not_yet",
    aiTools: [],
    aiPolicy: null,
    map: [
      row("Practice problems", null, "You write new practice problems by hand before each session."),
      row("Session plans", null, "You plan each session the night before."),
      row("Teaching sessions", null, "You teach each student in person.", { ai: false }),
    ],
    top: "Practice problems",
    tool: "claude",
    device: "phone",
    places: ["Text messages", "In person"],
    firstStep:
      "I tutor high school math. Write 5 practice problems on [topic] for a student who is [where they are], from easier to harder, with the answers listed at the end. Keep the wording plain and short.",
  }),
};
