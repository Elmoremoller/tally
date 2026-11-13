import type { QA } from "./quiz";
import { chatTools, type AiPolicy, type AiTool, type ChatTool } from "../week";

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
/** Elmore's words, 2026-11-13. */
export const experienceLabels: Record<Experience, string> = {
  not_yet: "I haven’t started yet. I don’t know where to begin.",
  tried: "I’ve tried it, but I never figured out what to use it for.",
  uses: "I use it, but I’m not getting the most out of it.",
  heavy: "I use it a lot, but it hasn’t given me any time back.",
};

/** She uses AI today, a little or a lot: she is asked what for, and her plan goes past the basics. */
export const usesAi = (level: Experience | null) => level === "uses" || level === "heavy";

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

/** Her first win on the free result: one task from her week, already drafted. */
export type FirstWin = { task: string; intro: string; draft: string };

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
  /** Titles of other things AI can do in her job, shown under her first win. */
  ideas: string[];
  /** Her tasks that need private details about other people or the company. */
  privateTasks: string[];
};

/** Her plan holds at least this many ideas, and her free result shows the first few titles of them. */
export const IDEAS_MIN = 8;
export const IDEAS_SHOWN = 3;
