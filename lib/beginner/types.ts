import type { QA } from "./quiz";
import type { Often } from "./quiz-copy";
import { chatTools, policyLabels, type AiPolicy, type AiTool, type ChatTool } from "../week";

// The beginner version: for women who want to start using AI and don't know where to begin, in any job. It
// runs beside the first version, behind the ad angles in BEGINNER_ANGLES (lib/offer.ts), as a test. These are
// its rules, shared by the quiz screens, the server and the AI. Imports nothing from the server, so the
// browser and a Node script can use it. The decisions behind it are in docs/audit/2026-11-10-beginner-draft.md.

export const WORKS_FOR = ["self", "employer", "both"] as const;
export type WorksFor = (typeof WORKS_FOR)[number];
export const worksForLabels: Record<WorksFor, string> = {
  self: "For myself",
  employer: "For an employer",
  both: "Both",
};

export const EXPERIENCE = ["not_yet", "tried", "uses", "heavy"] as const;
export type Experience = (typeof EXPERIENCE)[number];
/**
 * The four choices on Where are you with AI, from docs/DIRECTION.md (Phase 1). The ids stay as they were, so
 * answers saved before keep loading. Approved by Karl 2026-11-14.
 */
export const experienceLabels: Record<Experience, string> = {
  not_yet: "Never used it",
  tried: "Tried it a few times",
  uses: "Use it some weeks",
  heavy: "Use it most days",
};

/** She uses AI today, some weeks or most days: she is a Builder, and her plan goes past the basics. */
export const usesAi = (level: Experience | null) => level === "uses" || level === "heavy";

/** The two paths in docs/DIRECTION.md. Never used it and Tried it a few times are Starter, the rest Builder. */
export type Track = "starter" | "builder";
export const trackFor = (level: Experience): Track => (usesAi(level) ? "builder" : "starter");

/** Can you use AI for your work? One question in place of who she works for and her company's view. */
export const CAN_USE = ["yes", "not_sure", "restricted", "self"] as const;
export type CanUse = (typeof CAN_USE)[number];
/** Approved by Karl 2026-11-14. */
export const canUseLabels: Record<CanUse, string> = {
  yes: "Yes",
  not_sure: "Not sure",
  restricted: "No, it’s restricted",
  self: "I work for myself",
};

/**
 * Her answer as the rules and the database read it. The database keeps the first version's four policies, so
 * Yes is kept as encouraged; the prompts are given her own answer instead (workLine), so no plan says her
 * company encourages AI.
 */
export function canUseToWork(answer: CanUse): { worksFor: WorksFor; aiPolicy: AiPolicy | null } {
  if (answer === "self") return { worksFor: "self", aiPolicy: null };
  const aiPolicy: AiPolicy = answer === "yes" ? "encouraged" : answer === "restricted" ? "restricted" : "no_idea";
  return { worksFor: "employer", aiPolicy };
}

/** The screen id of Can you use AI for your work, as kept in her answered screens. */
export const CAN_USE_ID = "can_use";

/** Only someone with an employer is asked about her company's view on AI, and gets the At work part. */
export const hasEmployer = (worksFor: WorksFor) => worksFor !== "self";

/** The tool her plan names when she hasn't picked a chat tool: the user's call on 2026-11-10. */
export const DEFAULT_TOOL: ChatTool = "claude";

/** One tool, always named: the first chat tool she picked, or the default. */
export const beginnerTool = (tools: readonly AiTool[]): ChatTool => chatTools(tools)[0] ?? DEFAULT_TOOL;

export type Mark = "safe_today" | "check_first";

/**
 * The mark on a task or an idea. Something from daily life is safe today. At work, anything that needs
 * private details waits for her company's answer, and so does everything when her company restricts AI.
 * Without an employer nobody needs asking, so a task that needs private details carries no mark: her safe
 * use rules say what to leave out.
 */
export function markFor(
  item: { private: boolean; life?: boolean },
  who: { worksFor: WorksFor; aiPolicy: AiPolicy | null },
): Mark | null {
  if (item.life) return "safe_today";
  if (hasEmployer(who.worksFor)) return who.aiPolicy === "restricted" || item.private ? "check_first" : "safe_today";
  return item.private ? null : "safe_today";
}

/**
 * Who she works for and what she may do with AI, as one line for the prompts. When she answered Can you use AI
 * for your work, the line is her own answer; answers saved before it keep the old two lines.
 */
export function workLine(input: { worksFor: WorksFor; aiPolicy: AiPolicy | null; qas: QA[] }): string {
  const canUse = input.qas.find((qa) => qa.id === CAN_USE_ID)?.picked[0];
  if (canUse) return `Can she use AI for her work? Her answer: ${canUse}`;
  return [
    `She works: ${worksForLabels[input.worksFor]}`,
    `Her company's view on AI: ${input.aiPolicy ? policyLabels[input.aiPolicy] : "she works for herself"}`,
  ].join("\n");
}

/** Her first win on the free result: one task from her week, already drafted. */
export type FirstWin = { task: string; intro: string; draft: string };

/**
 * One task she named on the map of her week, with one line on what it becomes. `ai` and `private` are the
 * task's own flags, so the setups can pick her second task.
 */
export type MapLine = { task: string; line: string; ai: boolean; private: boolean };

/**
 * Everything the free result shows, in its order (docs/DIRECTION.md, section 3): her finished result, the
 * message that makes the next one, the map of her week, and the offer with her setups, her tool and the
 * track that decided them.
 */
export type FreeResult = {
  firstWin: FirstWin;
  firstStep: string;
  map: MapLine[];
  setups: string[];
  tool: ChatTool;
  track: Track;
};

/** What the beginner quiz keeps beside her answers, in intake.beginner. */
export type BeginnerIntake = {
  v: 2;
  worksFor: WorksFor;
  experience: Experience;
  /** Every screen she answered, in order. */
  qas: QA[];
  /** What she said would save her the most time. */
  mostWanted: string[];
  firstWin: FirstWin;
  /** How often she does her top task, when she tapped it. Absent on answers saved before 2026-11-14. */
  often?: Often | null;
  /** Titles of other things AI can do in her job, shown under her first win. Empty from beginner-intake-v5 on. */
  ideas: string[];
  /** Her tasks that need private details about other people or the company. */
  privateTasks: string[];
  /**
   * What her free result showed beyond her first win, saved so her paid path can be held to it. Absent on
   * answers saved before beginner-intake-v5 (Phase 2 of docs/DIRECTION.md).
   */
  shown?: { firstStep: string; map: MapLine[]; setups: string[]; tool: ChatTool; track: Track };
};

/** Her plan holds at least this many ideas, and her free result shows the first few titles of them. */
export const IDEAS_MIN = 8;
export const IDEAS_SHOWN = 3;
