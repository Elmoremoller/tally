import { cleanText } from "../clean";
import { ANSWER_MAX } from "../week";
import { FALLBACK_JOB_READ } from "./copy";
import { EVERYDAY_SOFTWARE } from "./quiz-copy";
import type { AiTool } from "../week";
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

export type QuizStep =
  | "job"
  | "level"
  | "held_back"
  | "repeats"
  | "most"
  | "picture"
  | "apps"
  | "tools"
  | "ai_uses"
  | "device"
  | `asked_${number}`
  | "works_for"
  | "policy";

export const QAS_MAX = 16;
export const PICKS_MAX = 16;
export const PICK_MAX = 60;
/** How many asked screens the progress bar assumes while the AI is still writing them. */
export const ASKED_ASSUMED = 3;
const MOST_MAX = 6;
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
  const hers = read.repeats.filter((r) => picked.includes(r.label));
  const extra = cleanText(typed, PICK_MAX);
  if (!extra && !hers.some((r) => r.ai)) return { options: read.aiFallback, fallback: true };
  const options = hers.map((r) => r.label);
  if (extra && !options.includes(extra)) options.push(extra);
  return { options: options.slice(0, MOST_MAX), fallback: false };
}

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

/**
 * Her level for the plan. Someone who answered in her own words counts as having tried AI, unless she then
 * picked None yet on the AI tools screen.
 */
export const experienceFor = (level: Experience, ownWords: boolean, tools: readonly AiTool[]): Experience =>
  ownWords && tools.includes("none_yet") ? "not_yet" : level;

/** Her own words on Where are you with AI, when she wrote some there. */
export const levelWords = (qas: QA[]): string | null => qas.find((qa) => qa.id === "level")?.text ?? null;

/**
 * Every screen she will see, in order, so the progress bar knows the length. Where an answer isn't known yet,
 * the step is assumed: asked screens while the AI writes them, the held back and tools screens before she
 * picks a level, and the work questions until we know who she works for. `skipMost` leaves out the most
 * wanted screen when it would show one choice.
 */
export function stepsFor(s: {
  level: Experience | null;
  askedCount: number | null;
  worksForFromJob: WorksFor | "unclear" | null;
  worksFor: WorksFor | null;
  skipMost?: boolean;
}): QuizStep[] {
  const steps: QuizStep[] = ["job", "level"];
  if (!usesAi(s.level)) steps.push("held_back");
  steps.push("repeats");
  if (!s.skipMost) steps.push("most");
  steps.push("picture", "apps");
  if (s.level !== "not_yet") steps.push("tools");
  if (usesAi(s.level)) steps.push("ai_uses");
  steps.push("device");
  const asked = s.askedCount ?? ASKED_ASSUMED;
  for (let i = 1; i <= asked; i++) steps.push(`asked_${i}`);
  const fromJob = s.worksForFromJob && s.worksForFromJob !== "unclear" ? s.worksForFromJob : null;
  if (!fromJob) steps.push("works_for");
  const worksFor = fromJob ?? s.worksFor;
  if (worksFor !== "self") steps.push("policy");
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
