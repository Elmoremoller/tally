"use server";

import { allowAiCall } from "@/lib/ai-allowance";
import { readJob, writeQuestions } from "@/lib/beginner/questions-ai";
import { FALLBACK_JOB_READ } from "@/lib/beginner/copy";
import { cleanQAs, jobReadOrFallback, PICK_MAX, type AskedQuestion, type JobRead, type QA } from "@/lib/beginner/quiz";
import { EXPERIENCE, type Experience } from "@/lib/beginner/types";
import { cleanText, oneOf } from "@/lib/clean";
import { spendQuestionCall } from "@/lib/funnel-db";
import { readSessionId } from "@/lib/session-cookie";
import { ANSWER_MAX } from "@/lib/week";

// How the context quiz reaches its two AI calls: reading her job, and writing her questions. Nothing sent from
// the page is trusted, the session comes from her cookie, and each call is counted against the session and the
// site. Neither action ever throws or holds the quiz up: when anything goes wrong she gets the fixed list or no
// asked screens, and the quiz carries on. BEGINNER_QUESTIONS_OFF=1 forces that, so both paths can be tried.

const MOST_WANTED_MAX = 6;

const off = () => process.env.BEGINNER_QUESTIONS_OFF === "1";

const allowCallFor = (sessionId: string) => async () =>
  (await spendQuestionCall(sessionId)) && (await allowAiCall());

export async function readJobAction(job: string): Promise<{ read: JobRead; fallback: boolean }> {
  const fallback = { read: FALLBACK_JOB_READ, fallback: true };
  try {
    if (off()) return fallback;
    const sessionId = await readSessionId();
    const cleanJob = cleanText(job, ANSWER_MAX);
    if (!sessionId || !cleanJob) return fallback;
    return jobReadOrFallback(await readJob(cleanJob, { allowCall: allowCallFor(sessionId) }));
  } catch (error) {
    console.error("readJobAction failed", error);
    return fallback;
  }
}

export async function writeQuestionsAction(input: {
  job: string;
  experience: Experience;
  qas: QA[];
  mostWanted: string[];
}): Promise<AskedQuestion[]> {
  try {
    if (off()) return [];
    const sessionId = await readSessionId();
    const job = cleanText(input?.job, ANSWER_MAX);
    const qas = cleanQAs(input?.qas);
    const mostWanted = (Array.isArray(input?.mostWanted) ? input.mostWanted : [])
      .map((m) => cleanText(m, PICK_MAX))
      .filter((m): m is string => m !== null)
      .slice(0, MOST_WANTED_MAX);
    if (!sessionId || !job || !qas || !oneOf(EXPERIENCE, input?.experience)) return [];
    return await writeQuestions(
      { job, experience: input.experience, qas, mostWanted },
      { allowCall: allowCallFor(sessionId) },
    );
  } catch (error) {
    console.error("writeQuestionsAction failed", error);
    return [];
  }
}
