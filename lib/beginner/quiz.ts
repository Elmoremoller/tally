import { cleanText } from "../clean";
import { ANSWER_MAX } from "../week";
import type { Experience, WorksFor } from "./types";

// The context quiz's shapes and the pure helpers behind its screens. Imports nothing from the server, so the
// browser, the server actions and the tests can all use it.

/** One thing she does over and over. `ai` says whether AI could help with it. */
export type JobChoice = { label: string; ai: boolean };

/** What the AI read from her job: what she repeats, a fallback list, her likely apps and who she works for. */
export type JobRead = {
  repeats: JobChoice[];
  aiFallback: string[];
  apps: string[];
  worksFor: WorksFor | "unclear";
};

export type AskedKind = "one" | "many" | "text";

/** A question the AI wrote for her. */
export type AskedQuestion = { id: string; title: string; kind: AskedKind; choices: string[]; hint: string | null };

/** One answered screen. `id` matches ^[a-z0-9_]{1,20}$. */
export type QA = { id: string; title: string; picked: string[]; text: string | null };

export type QuizStep =
  | "job"
  | "level"
  | "repeats"
  | "most"
  | "picture"
  | "apps"
  | "tools"
  | `asked_${number}`
  | "works_for"
  | "policy";

export const QAS_MAX = 12;
export const PICKS_MAX = 8;
export const PICK_MAX = 60;
/** How many asked screens the progress bar assumes while the AI is still writing them. */
export const ASKED_ASSUMED = 3;
const MOST_MAX = 6;
const TITLE_MAX = 200;
const ID_PATTERN = /^[a-z0-9_]{1,20}$/;

/**
 * The choices for "which would save you the most time": her picks that AI can help with, in the order of the
 * repeats screen, then what she typed under Something else. When there are none, the read's fallback list.
 */
export function mostOptions(
  read: JobRead,
  picked: string[],
  typed: string | null,
): { options: string[]; fallback: boolean } {
  const options = read.repeats.filter((r) => r.ai && picked.includes(r.label)).map((r) => r.label);
  const extra = cleanText(typed, PICK_MAX);
  if (extra && !options.includes(extra)) options.push(extra);
  if (options.length === 0) return { options: read.aiFallback, fallback: true };
  return { options: options.slice(0, MOST_MAX), fallback: false };
}

/**
 * Every screen she will see, in order, so the progress bar knows the length. Where an answer isn't known yet,
 * the step is assumed: asked screens while the AI writes them, the tools screen before she picks a level, and
 * the work questions until we know who she works for.
 */
export function stepsFor(s: {
  level: Experience | null;
  askedCount: number | null;
  worksForFromJob: WorksFor | "unclear" | null;
  worksFor: WorksFor | null;
}): QuizStep[] {
  const steps: QuizStep[] = ["job", "level", "repeats", "most", "picture", "apps"];
  if (s.level !== "not_yet") steps.push("tools");
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

/** Checks the answered screens the browser sends. Null when the shape is wrong; long input is dropped or cut. */
export function cleanQAs(raw: unknown): QA[] | null {
  if (!Array.isArray(raw)) return null;
  const qas: QA[] = [];
  for (const item of raw.slice(0, QAS_MAX)) {
    if (!item || typeof item !== "object") return null;
    const { id, title, picked, text } = item as Record<string, unknown>;
    const cleanTitle = cleanText(title, TITLE_MAX);
    if (typeof id !== "string" || !ID_PATTERN.test(id) || !cleanTitle) return null;
    const picks = (Array.isArray(picked) ? picked : [])
      .map((p) => cleanText(p, PICK_MAX))
      .filter((p): p is string => p !== null)
      .slice(0, PICKS_MAX);
    const cleanAnswer = typeof text === "string" ? cleanText(text.trim().slice(0, ANSWER_MAX), ANSWER_MAX) : null;
    qas.push({ id, title: cleanTitle, picked: picks, text: cleanAnswer });
  }
  return qas;
}
