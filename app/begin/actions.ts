"use server";

import { cookies } from "next/headers";
import { allowAiCall } from "@/lib/ai-allowance";
import { cleanAnswers, type BeginnerAnswers } from "@/lib/beginner/answers";
import { deviceOf, secondTask, setupsFor } from "@/lib/beginner/free-result";
import { readBeginnerIntake } from "@/lib/beginner/intake";
import { digest, type QuizStep } from "@/lib/beginner/quiz";
import { beginnerTool, trackFor, type FreeResult } from "@/lib/beginner/types";
import { cleanText } from "@/lib/clean";
import {
  confirmTasks,
  loadWeek,
  noteStep,
  saveAnswers,
  saveBeginner,
  saveFollowUpAnswer,
  saveIntakeResult,
  spendIntakeCall,
  startSession,
} from "@/lib/funnel-db";
import { IntakeLimitError } from "@/lib/intake";
import { isBeginner } from "@/lib/offer";
import { quizErrors } from "@/lib/questions";
import { readSessionId, rememberSession } from "@/lib/session-cookie";
import { readSource, SOURCE_COOKIE } from "@/lib/source";
import { ANSWER_MAX } from "@/lib/week";

// The beginner quiz's server side, built like app/start/actions.ts: nothing sent from the page is trusted, and
// the session always comes from this browser's cookie. Nothing she answers is saved until the final read: then
// her answers go in with the first quiz's database functions (every screen as one plain text digest in place
// of her week), and what is its own (every screen she answered, what she most wants to make easier, and
// everything her free result showed: her first win, her first step, the map of her week and her setups) beside
// them, so her paid path can be held to what she was shown.

export type { BeginnerAnswers };
export type BeginnerStep = QuizStep | "follow_up";
export type BeginnerRead =
  | {
      ok: true;
      win: (FreeResult & { restricted: boolean }) | null;
      followUp: string | null;
    }
  | { ok: false; error: string; thin?: boolean };

/** A new session, with the angle and UTM values she came in with. Someone who came straight here counts as new_to_ai. */
async function newSession() {
  const source = readSource((await cookies()).get(SOURCE_COOKIE)?.value);
  const id = await startSession(isBeginner(source.angle) ? source.angle : "new_to_ai", {
    source: source.utm_source,
    medium: source.utm_medium,
    campaign: source.utm_campaign,
    content: source.utm_content,
  });
  await rememberSession(id);
  return id;
}

/** Notes each finished step on her session. Answering the first question starts a new session. Never stops the quiz. */
export async function noteBeginnerStep(step: BeginnerStep): Promise<void> {
  try {
    const existing = step === "job" ? null : await readSessionId();
    const id = existing ?? (await newSession());
    // A step name holds no digits in the database, so every question the AI wrote is noted as "asked".
    await noteStep(id, /^asked_\d+$/.test(step) ? "asked" : step);
  } catch (error) {
    console.error("Noting a quiz step failed", error);
  }
}

/**
 * Saves her answers, has the AI read them and draft her first win, and marks the quiz complete, since this
 * version has no screen for checking hours. Returns her first win, the follow up question when her answers
 * were too thin, or an error to show. `thin` sends her back to the screen of things she does over and over.
 */
export async function readBeginner(input: {
  answers: BeginnerAnswers;
  followUp?: { question: string; answer: string };
}): Promise<BeginnerRead> {
  const answers = cleanAnswers(input?.answers);
  if (!answers) return { ok: false, error: quizErrors.missing };
  const question = cleanText(input.followUp?.question, 300);
  const answer = cleanText(input.followUp?.answer, ANSWER_MAX);
  const followUp = question && answer ? { question, answer } : undefined;

  try {
    const sessionId = (await readSessionId()) ?? (await newSession());
    await saveAnswers(sessionId, {
      job: answers.job,
      week: digest(answers.qas),
      extraWork: null,
      aiTools: answers.aiTools,
      aiToolsOther: answers.aiToolsOther,
      aiPolicy: answers.aiPolicy,
    });
    const read = await readBeginnerIntake(
      { ...answers, followUp },
      {
        allowCall: async () => (await spendIntakeCall(sessionId)) && (await allowAiCall()),
      },
    );
    if (!read) return { ok: false, error: quizErrors.generic };
    const { result } = read;

    if (result.needs_follow_up) return { ok: true, win: null, followUp: result.follow_up_question };
    if (!result.tasks.length || !result.first_win || !result.first_step) {
      return { ok: false, error: quizErrors.thin, thin: true };
    }

    // Her setups are named in code, from her path, her tool and her own tasks, never by the model.
    const track = trackFor(answers.experience);
    const tool = beginnerTool(answers.aiTools);
    const free: FreeResult = {
      firstWin: result.first_win,
      firstStep: result.first_step,
      map: result.map,
      setups: setupsFor({
        track,
        tool,
        top: result.first_win.task,
        second: secondTask(result.map, result.first_win.task),
        device: deviceOf(answers.qas),
      }),
      tool,
      track,
    };

    // Her tasks go in the first version's table: what AI can help with as hand to AI, the rest as hers to keep.
    await saveIntakeResult(sessionId, {
      roleSummary: result.role_summary,
      followUpQuestion: followUp?.question ?? null,
      promptVersion: read.promptVersion,
      model: read.model,
      tasks: result.tasks.map((t) => ({
        name: t.name,
        pile: t.ai ? "hand_to_ai" : "keep_visible",
        estimated_hours: 0,
        extra: false,
      })),
    });
    await saveBeginner(sessionId, {
      v: 2,
      worksFor: answers.worksFor,
      experience: answers.experience,
      qas: answers.qas,
      mostWanted: answers.mostWanted,
      often: answers.often ?? null,
      firstWin: result.first_win,
      // Idea titles are gone from the free result since beginner-intake-v5; the plan writer still takes the list.
      ideas: [],
      privateTasks: result.tasks.filter((t) => t.private).map((t) => t.name),
      shown: { firstStep: free.firstStep, map: free.map, setups: free.setups, tool, track },
    });
    if (followUp) await saveFollowUpAnswer(sessionId, followUp.answer);
    const { tasks } = await loadWeek(sessionId);
    await confirmTasks(
      sessionId,
      tasks.map((t) => ({
        id: t.id,
        name: t.name,
        pile: t.pile,
        confirmed_hours: 0,
      })),
    );

    return {
      ok: true,
      win: { ...free, restricted: answers.aiPolicy === "restricted" },
      followUp: null,
    };
  } catch (error) {
    if (error instanceof IntakeLimitError) return { ok: false, error: quizErrors.limit };
    console.error("Reading the beginner quiz failed", error);
    return { ok: false, error: quizErrors.generic };
  }
}
