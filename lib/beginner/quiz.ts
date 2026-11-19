import { cleanText } from "../clean";
import { ANSWER_MAX } from "../week";
import { FALLBACK_JOB_READ } from "./copy";
import { whereScreen } from "./quiz-copy";
import { usesAi, type CanUse, type Experience, type WorksFor } from "./types";

// The context quiz's shapes and the pure helpers behind its screens. Imports nothing from the server, so the
// browser, the server actions and the tests can all use it.

/** One choice on What do you do over and over: one of her own responsibilities, or one usual for her role. */
export type JobChoice = { label: string; group: "hers" | "usual" };

/**
 * What the AI read from her job (DIRECTION.md, Phase 8): her own responsibilities in her words, the ones people in
 * her role usually handle that she didn't mention, the software she likely uses, and who she works for.
 */
export type JobRead = {
  hers: string[];
  usual: string[];
  apps: string[];
  worksFor: WorksFor | "unclear";
};

/**
 * One answered screen. `id` matches ^[a-z0-9_]{1,20}$. `shown` is the choices that screen offered her, so we
 * can read what she saw as well as what she picked; absent on a type or talk screen.
 */
export type QA = { id: string; title: string; picked: string[]; text: string | null; shown?: string[] };

/**
 * Every screen the quiz can show. Answers saved before 2026-11-14 may also hold held_back, picture, ai_uses,
 * works_for and policy, answers saved before Phase 5 may hold apps and device as screens of their own, and answers
 * saved before Phase 8 may hold the real example and the question the AI wrote (example, asked_1); they still load,
 * since a saved answer is only read by its id. What she uses for work is kept as the device answer, from the where
 * screen, and how often she does her top task as the often answer, from the most wanted screen.
 */
export type QuizStep = "job" | "level" | "done" | "tools" | "repeats" | "most" | "where" | "can_use" | "connect";

export const QAS_MAX = 16;
export const PICKS_MAX = 16;
export const PICK_MAX = 60;
/** Her own responsibilities come first on the repeats screen, at most this many (Karl, 2026-11-16). */
export const HERS_SHOWN = 5;
/** The repeats screen shows this many choices in all, filled with ones usual for her role (Karl, 2026-11-16). */
export const REPEATS_SHOWN = 8;
const TITLE_MAX = 200;
const ID_PATTERN = /^[a-z0-9_]{1,20}$/;

/**
 * The choices for "which would save you the most time": every pick she made, in the order of the repeats screen,
 * then what she typed under Something else, so nothing she said goes missing.
 */
export function mostOptions(read: JobRead, picked: string[], typed: string | null): string[] {
  const options = repeatChoices(read)
    .filter((r) => picked.includes(r.label))
    .map((r) => r.label);
  const extra = cleanText(typed, PICK_MAX);
  if (extra && !options.some((o) => o.toLowerCase() === extra.toLowerCase())) options.push(extra);
  return options;
}

/**
 * The repeats screen's choices (Karl, 2026-11-16): her own responsibilities first, at most HERS_SHOWN, then the
 * ones usual for her role, REPEATS_SHOWN in all, each once whatever its case.
 */
export function repeatChoices(read: JobRead): JobChoice[] {
  const seen = new Set<string>();
  const once = (label: string) => {
    const key = label.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  };
  const hers = read.hers.filter(once).slice(0, HERS_SHOWN).map((label) => ({ label, group: "hers" as const }));
  const usual = read.usual
    .filter(once)
    .slice(0, Math.max(REPEATS_SHOWN - hers.length, 0))
    .map((label) => ({ label, group: "usual" as const }));
  return [...hers, ...usual];
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

/** Names for texting that mean the same place as Text messages, so the where screen shows it once. */
const TEXTING = /^(texts?|text messages?|sms|texting)$/i;

/**
 * The where screen's choices: the apps the read of her job names first, then the fixed places, each once. Texts,
 * SMS and the like are left for the fixed Text messages.
 */
export function whereOptions(read: JobRead): string[] {
  const seen = new Set<string>();
  return [...read.apps.filter((name) => !TEXTING.test(name.trim())), ...whereScreen.places].filter((name) => {
    const key = name.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/** Her own words on Where are you with AI, on answers saved before that row was taken out on 2026-11-14. */
export const levelWords = (qas: QA[]): string | null => qas.find((qa) => qa.id === "level")?.text ?? null;

/**
 * Every screen she will see, in order, so the progress bar knows the length. A Starter (Never used it, Tried it
 * a few times) sees at most 7 screens and a Builder at most 9 (DIRECTION.md, Phase 8):
 *
 * Starter: job, level, repeats, most, where, can_use, connect.
 * Builder: job, level, done, tools, repeats, most, where, can_use, connect.
 *
 * Where an answer isn't known yet, the step is assumed: the Builder screens before she picks a level, and connect
 * before she answers can_use. Can you use AI for your work is left out when her job already said she works for
 * herself, and connect is only for Yes or Not sure there. The most wanted screen is always shown, even with one
 * pick, since how often she does it is asked there.
 */
export function stepsFor(s: { level: Experience | null; worksForFromJob: WorksFor | "unclear" | null; canUse?: CanUse | null }): QuizStep[] {
  const steps: QuizStep[] = ["job", "level"];
  if (usesAi(s.level)) steps.push("done", "tools");
  steps.push("repeats", "most", "where");
  if (s.worksForFromJob !== "self") {
    steps.push("can_use");
    if (!s.canUse || s.canUse === "yes" || s.canUse === "not_sure") steps.push("connect");
  }
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
