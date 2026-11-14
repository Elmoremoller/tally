import { cleanText } from "../clean";
import { ANSWER_MAX } from "../week";
import { FALLBACK_JOB_READ } from "./copy";
import { EVERYDAY_SOFTWARE, EVERYDAY_TASKS } from "./quiz-copy";
import { usesAi, type Experience, type WorksFor } from "./types";

// The context quiz's shapes and the pure helpers behind its screens. Imports nothing from the server, so the
// browser, the server actions and the tests can all use it.

/** One thing she does over and over. `ai` says whether AI could help with it. */
export type JobChoice = { label: string; ai: boolean };

/**
 * What the AI read from her job: what she repeats, a fallback list, the software she likely uses, what someone
 * in her job might use AI for, and who she works for.
 */
export type JobRead = {
  repeats: JobChoice[];
  aiFallback: string[];
  apps: string[];
  aiUses: string[];
  worksFor: WorksFor | "unclear";
};

export type AskedKind = "one" | "many" | "text";

/** A question the AI wrote for her. */
export type AskedQuestion = { id: string; title: string; kind: AskedKind; choices: string[]; hint: string | null };

/**
 * One answered screen. `id` matches ^[a-z0-9_]{1,20}$. `shown` is the choices that screen offered her, so we
 * can read what she saw as well as what she picked; absent on a type or talk screen.
 */
export type QA = { id: string; title: string; picked: string[]; text: string | null; shown?: string[] };

/**
 * Every screen the quiz can show. Answers saved before 2026-11-14 may also hold held_back, picture, ai_uses,
 * works_for and policy, screens that are gone; they still load, since a saved answer is only read by its id.
 */
export type QuizStep =
  | "job"
  | "level"
  | "done"
  | "tools"
  | "repeats"
  | "most"
  | "example"
  | "apps"
  | "device"
  | `asked_${number}`
  | "can_use";

export const QAS_MAX = 16;
export const PICKS_MAX = 16;
export const PICK_MAX = 60;
/** The AI writes at most one question, and the progress bar assumes it while the AI is still writing it. */
export const ASKED_ASSUMED = 1;
const MOST_MAX = 6;
/** The repeats screen shows this many choices: her job's first, then everyday work. */
export const REPEATS_SHOWN = 10;
const TITLE_MAX = 200;
const ID_PATTERN = /^[a-z0-9_]{1,20}$/;

/**
 * The choices for "which would save you the most time": every pick she made, in the order of the repeats
 * screen, then what she typed under Something else, so nothing she said goes missing. Only when she picked
 * nothing AI can help with and typed nothing does she get the read's fallback list instead.
 */
export function mostOptions(
  read: JobRead,
  picked: string[],
  typed: string | null,
): { options: string[]; fallback: boolean } {
  const hers = repeatChoices(read).filter((r) => picked.includes(r.label));
  const extra = cleanText(typed, PICK_MAX);
  if (!extra && !hers.some((r) => r.ai)) return { options: read.aiFallback, fallback: true };
  const options = hers.map((r) => r.label);
  if (extra && !options.includes(extra)) options.push(extra);
  return { options: options.slice(0, MOST_MAX), fallback: false };
}

/**
 * The repeats screen's choices: what the read of her job names first, then everyday work almost every job has,
 * each once whatever its case, REPEATS_SHOWN in all. However little her job answer said, the screen is full.
 */
export function repeatChoices(read: JobRead): JobChoice[] {
  const seen = new Set<string>();
  return [...read.repeats, ...EVERYDAY_TASKS.map((label) => ({ label, ai: true }))]
    .filter((r) => {
      const key = r.label.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, Math.max(REPEATS_SHOWN, read.repeats.length));
}

/**
 * Her job answer with a kind of work added or taken out: a tap on the job screen's chips. Added at the end,
 * after a comma when there is text before it.
 */
export function toggleKind(job: string, kind: string): string {
  if (hasKind(job, kind)) {
    return job
      .split(/,\s*/)
      .filter((part) => part.trim().toLowerCase() !== kind.toLowerCase())
      .join(", ");
  }
  const text = job.trimEnd().replace(/[,.]$/, "");
  return text ? `${text}, ${kind}` : kind;
}

/** Whether her job answer holds that kind of work as one of its comma parts. */
export const hasKind = (job: string, kind: string) =>
  job.split(/,\s*/).some((part) => part.trim().toLowerCase() === kind.toLowerCase());

/** A list of one needs no question: that one is her answer, and the screen is skipped. */
export const skipsMost = (most: { options: string[]; fallback: boolean }) => !most.fallback && most.options.length === 1;

/** The software screen's choices: what the read of her job names first, then the everyday set, each once. */
export function softwareOptions(read: JobRead): string[] {
  const seen = new Set<string>();
  return [...read.apps, ...EVERYDAY_SOFTWARE].filter((name) => {
    const key = name.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/** Her own words on Where are you with AI, on answers saved before that row was taken out on 2026-11-14. */
export const levelWords = (qas: QA[]): string | null => qas.find((qa) => qa.id === "level")?.text ?? null;

/**
 * How many of her picks on the repeats screen AI can help with, out of how many she picked from the list.
 * What she typed under Something else has no flag, so it isn't counted.
 */
export function aiHelpCount(read: JobRead, picked: string[]): { helps: number; picked: number } {
  const hers = repeatChoices(read).filter((r) => picked.includes(r.label));
  return { helps: hers.filter((r) => r.ai).length, picked: hers.length };
}

/**
 * Every screen she will see, in order, so the progress bar knows the length. A Starter (Never used it, Tried it
 * a few times) sees at most 8 screens and a Builder at most 10:
 *
 * Starter: job, level, repeats, most, example, device, one asked question, can_use.
 * Builder: job, level, done, tools, repeats, most, example, apps, one asked question, can_use.
 *
 * Where an answer isn't known yet, the step is assumed: the asked screen while the AI writes it, and the
 * Builder screens before she picks a level. Can you use AI for your work is left out when her job already
 * said she works for herself. `skipMost` leaves out the most wanted screen when it would show one choice.
 */
export function stepsFor(s: {
  level: Experience | null;
  askedCount: number | null;
  worksForFromJob: WorksFor | "unclear" | null;
  skipMost?: boolean;
}): QuizStep[] {
  const builder = usesAi(s.level);
  const steps: QuizStep[] = ["job", "level"];
  if (builder) steps.push("done", "tools");
  steps.push("repeats");
  if (!s.skipMost) steps.push("most");
  steps.push("example");
  steps.push(builder ? "apps" : "device");
  const asked = Math.min(s.askedCount ?? ASKED_ASSUMED, ASKED_ASSUMED);
  for (let i = 1; i <= asked; i++) steps.push(`asked_${i}`);
  if (s.worksForFromJob !== "self") steps.push("can_use");
  return steps;
}

/** Her answers as plain text for the prompts: one line per screen with an answer, at most ANSWER_MAX characters. */
export function digest(qas: QA[]): string {
  return qas
    .map((qa) => {
      const answer = [...qa.picked, ...(qa.text ? [qa.text] : [])].join(", ");
      return answer ? `${qa.title} ${answer}` : "";
    })
    .filter(Boolean)
    .join("\n")
    .slice(0, ANSWER_MAX);
}

/** Short choices as the browser sends them: at most PICKS_MAX, each at most PICK_MAX characters, longer ones dropped. */
const cleanPicks = (raw: unknown) =>
  (Array.isArray(raw) ? raw : [])
    .map((p) => cleanText(p, PICK_MAX))
    .filter((p): p is string => p !== null)
    .slice(0, PICKS_MAX);

/** Checks the answered screens the browser sends. Null when the shape is wrong; long input is dropped or cut. */
export function cleanQAs(raw: unknown): QA[] | null {
  if (!Array.isArray(raw)) return null;
  const qas: QA[] = [];
  for (const item of raw.slice(0, QAS_MAX)) {
    if (!item || typeof item !== "object") return null;
    const { id, title, picked, text, shown } = item as Record<string, unknown>;
    const cleanTitle = cleanText(title, TITLE_MAX);
    if (typeof id !== "string" || !ID_PATTERN.test(id) || !cleanTitle) return null;
    const cleanAnswer = typeof text === "string" ? cleanText(text.trim().slice(0, ANSWER_MAX), ANSWER_MAX) : null;
    const qa: QA = { id, title: cleanTitle, picked: cleanPicks(picked), text: cleanAnswer };
    if (Array.isArray(shown)) qa.shown = cleanPicks(shown);
    qas.push(qa);
  }
  return qas;
}

/** The read to show: the AI's when it gave one, else the fixed list, with `fallback` saying which. */
export function jobReadOrFallback(read: JobRead | null): { read: JobRead; fallback: boolean } {
  return read ? { read, fallback: false } : { read: FALLBACK_JOB_READ, fallback: true };
}
