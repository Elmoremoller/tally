import { cleanText, oneOf } from "../clean";
import { AI_POLICIES, AI_TOOLS, ANSWER_MAX, OTHER_TOOLS_MAX, SOLO_TOOLS, type AiPolicy, type AiTool } from "../week";
import { cleanQAs, PICK_MAX, type QA } from "./quiz";
import { EXPERIENCE, hasEmployer, WORKS_FOR, type Experience, type WorksFor } from "./types";

// What the context quiz sends at its final read, and the check it passes before anything is saved. Anyone can
// call a server action, so nothing is trusted as sent. Kept apart from app/begin/actions.ts so the tests can
// load it without the server.

export type BeginnerAnswers = {
  job: string;
  experience: Experience;
  /** Every screen she answered, in order. */
  qas: QA[];
  /** One or two things she said would save her the most time. */
  mostWanted: string[];
  worksFor: WorksFor;
  aiTools: AiTool[];
  aiToolsOther: string | null;
  /** Null when she works for herself. */
  aiPolicy: AiPolicy | null;
};

const MOST_WANTED_MAX = 2;

/** Her AI tools as she picked them, or null when they break the tools screen's rules. */
function cleanTools(tools: unknown, other: unknown): { aiTools: AiTool[]; aiToolsOther: string | null } | null {
  const picked = Array.isArray(tools) ? [...new Set(tools)] : [];
  if (!picked.length || !picked.every((t) => oneOf(AI_TOOLS, t))) return null;
  if (picked.length > 1 && picked.some((t) => oneOf(SOLO_TOOLS, t))) return null;
  const aiToolsOther = picked.includes("other") ? cleanText(other, OTHER_TOOLS_MAX) : null;
  if (picked.includes("other") && !aiToolsOther) return null;
  return { aiTools: picked, aiToolsOther };
}

/**
 * Her answers held to the quiz's rules, or null when something is missing or out of bounds: her job, her
 * level, a repeats screen with at least one pick or typed answer, one or two things she most wants to make
 * easier, and her company's view when she has an employer. The server can't see the fallback list her
 * screen 4 may have offered, so it checks only how many she picked and how long each is.
 */
export function cleanAnswers(answers: BeginnerAnswers): BeginnerAnswers | null {
  const job = cleanText(answers?.job, ANSWER_MAX);
  if (!job || !oneOf(WORKS_FOR, answers.worksFor) || !oneOf(EXPERIENCE, answers.experience)) return null;

  const qas = cleanQAs(answers.qas);
  const repeats = qas?.find((qa) => qa.id === "repeats");
  if (!qas || !repeats || (!repeats.picked.length && !repeats.text)) return null;

  const wanted = Array.isArray(answers.mostWanted) ? answers.mostWanted : [];
  if (!wanted.length || wanted.length > MOST_WANTED_MAX) return null;
  const mostWanted = wanted.map((w) => cleanText(w, PICK_MAX));
  if (mostWanted.some((w) => w === null)) return null;

  // Someone who hasn't tried AI never sees the tools screen, so she counts as None yet whatever was sent.
  const tools =
    answers.experience === "not_yet"
      ? { aiTools: ["none_yet" as const], aiToolsOther: null }
      : cleanTools(answers.aiTools, answers.aiToolsOther);
  if (!tools) return null;

  // Her company's view only counts, and is only needed, when she has an employer.
  const employed = hasEmployer(answers.worksFor);
  if (employed && !oneOf(AI_POLICIES, answers.aiPolicy)) return null;

  return {
    job,
    experience: answers.experience,
    qas,
    mostWanted: mostWanted as string[],
    worksFor: answers.worksFor,
    ...tools,
    aiPolicy: employed ? answers.aiPolicy : null,
  };
}
