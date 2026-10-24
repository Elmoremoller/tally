"use server";

import { cookies } from "next/headers";
import { allowAiCall } from "@/lib/ai-allowance";
import { cleanText, oneOf } from "@/lib/clean";
import {
  confirmTasks,
  loadWeek,
  noteStep,
  saveAnswers,
  saveFollowUpAnswer,
  saveIntakeResult,
  startSession,
  spendIntakeCall,
} from "@/lib/funnel-db";
import { IntakeLimitError, readIntake } from "@/lib/intake";
import { quizErrors } from "@/lib/questions";
import { readSessionId, rememberSession } from "@/lib/session-cookie";
import { readSource, SOURCE_COOKIE } from "@/lib/source";
import {
  AI_POLICIES,
  AI_TOOLS,
  ANSWER_MAX,
  halfHours,
  OTHER_TOOLS_MAX,
  PILES,
  SLIDER_MAX,
  SOLO_TOOLS,
  TASKS_MAX,
  type AiPolicy,
  type AiTool,
  type WeekTask,
} from "@/lib/week";

// The quiz's server side. Anyone on the internet can call these, so nothing sent from the page is trusted:
// answers are checked against the limits and allowed values, and the session always comes from this
// browser's cookie, never from the page.

export type QuizStep = "job" | "week" | "extra_work" | "tools" | "follow_up";
export type Answers = {
  job: string;
  week: string;
  /** What she ends up doing that isn't really her job. */
  extraWork: string;
  aiTools: AiTool[];
  /** What she typed under Other; only kept when she picked Other. */
  aiToolsOther: string | null;
  aiPolicy: AiPolicy;
};
export type Heard = { role: string; tasks: WeekTask[] };
export type ReadResult =
  | { ok: true; heard: Heard | null; followUp: string | null }
  | { ok: false; error: string; thin?: boolean };

/** A new session, with the angle and UTM values she came in with. */
async function newSession() {
  const source = readSource((await cookies()).get(SOURCE_COOKIE)?.value);
  const id = await startSession(source.angle, {
    source: source.utm_source,
    medium: source.utm_medium,
    campaign: source.utm_campaign,
    content: source.utm_content,
  });
  await rememberSession(id);
  return id;
}

/**
 * Notes each finished step on her session. Answering the first question starts a new session, so every run
 * through the quiz is one session. It never stops the quiz.
 */
export async function noteQuizStep(step: QuizStep): Promise<void> {
  try {
    const existing = step === "job" ? null : await readSessionId();
    const id = existing ?? (await newSession());
    await noteStep(id, step);
  } catch (error) {
    console.error("Noting a quiz step failed", error);
  }
}

/** Her answers as the quiz allows them: None yet and Not sure only on their own, and Other only with its text. */
function cleanAnswers(answers: Answers): Answers | null {
  const job = cleanText(answers?.job, ANSWER_MAX);
  const week = cleanText(answers?.week, ANSWER_MAX);
  const extraWork = cleanText(answers?.extraWork, ANSWER_MAX);
  const tools = Array.isArray(answers?.aiTools) ? [...new Set(answers.aiTools)] : [];
  if (!job || !week || !extraWork || !oneOf(AI_POLICIES, answers.aiPolicy)) return null;
  if (!tools.length || !tools.every((t) => oneOf(AI_TOOLS, t))) return null;
  if (tools.length > 1 && tools.some((t) => oneOf(SOLO_TOOLS, t))) return null;
  const other = tools.includes("other") ? cleanText(answers.aiToolsOther, OTHER_TOOLS_MAX) : null;
  if (tools.includes("other") && !other) return null;
  return { job, week, extraWork, aiTools: tools, aiToolsOther: other, aiPolicy: answers.aiPolicy };
}

/**
 * Saves her answers and has the AI read them, after the two taps, and again after the one follow up. Each
 * request to the model counts against the session's three readings and this caller's allowance. Returns
 * what we heard, the follow up question when her week was too thin, or an error to show.
 */
export async function readWeek(input: { answers: Answers; followUp?: { question: string; answer: string } }): Promise<ReadResult> {
  const answers = cleanAnswers(input?.answers);
  if (!answers) return { ok: false, error: quizErrors.missing };
  const question = cleanText(input.followUp?.question, 300);
  const answer = cleanText(input.followUp?.answer, ANSWER_MAX);
  const followUp = question && answer ? { question, answer } : undefined;

  try {
    const sessionId = (await readSessionId()) ?? (await newSession());
    await saveAnswers(sessionId, answers);
    const read = await readIntake(
      { ...answers, followUp },
      { allowCall: async () => (await spendIntakeCall(sessionId)) && (await allowAiCall()) },
    );
    if (!read) return { ok: false, error: quizErrors.generic };
    const { result } = read;

    // Nothing to work with yet: ask the one follow up, or, once it's been asked, for more about her week.
    if (!result.tasks.length) {
      return result.needs_follow_up
        ? { ok: true, heard: null, followUp: result.follow_up_question }
        : { ok: false, error: quizErrors.thin, thin: true };
    }

    await saveIntakeResult(sessionId, {
      roleSummary: result.role_summary,
      followUpQuestion: followUp?.question ?? result.follow_up_question,
      promptVersion: read.promptVersion,
      model: read.model,
      tasks: result.tasks.map(({ name, pile, estimated_hours, extra }) => ({ name, pile, estimated_hours, extra })),
    });
    if (followUp) await saveFollowUpAnswer(sessionId, followUp.answer);
    await noteStep(sessionId, followUp ? "follow_up" : "tools");

    const { tasks } = await loadWeek(sessionId);
    return {
      ok: true,
      heard: {
        role: result.role_summary,
        tasks: tasks.map((t) => ({ id: t.id, name: t.name, pile: t.pile, hours: t.estimated_hours, extra: t.extra })),
      },
      followUp: result.needs_follow_up ? result.follow_up_question : null,
    };
  } catch (error) {
    if (error instanceof IntakeLimitError) return { ok: false, error: quizErrors.limit };
    console.error("Reading the quiz failed", error);
    return { ok: false, error: quizErrors.generic };
  }
}

/** "Looks right": saves her tasks as she left them, with her own hours. The quiz is then complete. */
export async function confirmWeek(input: WeekTask[]): Promise<{ ok: true } | { ok: false; error: string }> {
  const tasks = Array.isArray(input)
    ? input.slice(0, TASKS_MAX).flatMap((t) => {
        const name = cleanText(t?.name, 120);
        const hours = typeof t?.hours === "number" && Number.isFinite(t.hours) ? halfHours(t.hours, SLIDER_MAX) : null;
        return name && hours !== null && typeof t.id === "string" && oneOf(PILES, t.pile)
          ? [{ id: t.id, name, pile: t.pile, confirmed_hours: hours }]
          : [];
      })
    : [];
  if (!tasks.length || tasks.length !== input.length) return { ok: false, error: quizErrors.missing };
  try {
    const sessionId = await readSessionId();
    if (!sessionId) return { ok: false, error: quizErrors.missing };
    await confirmTasks(sessionId, tasks);
    return { ok: true };
  } catch (error) {
    console.error("Confirming the quiz failed", error);
    return { ok: false, error: quizErrors.generic };
  }
}
