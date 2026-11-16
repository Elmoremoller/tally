"use server";

import { allowAiCall } from "@/lib/ai-allowance";
import { readJob } from "@/lib/beginner/questions-ai";
import { FALLBACK_JOB_READ } from "@/lib/beginner/copy";
import { jobReadOrFallback, type JobRead } from "@/lib/beginner/quiz";
import { cleanText } from "@/lib/clean";
import { spendQuestionCall } from "@/lib/funnel-db";
import { readSessionId } from "@/lib/session-cookie";
import { ANSWER_MAX } from "@/lib/week";

// How the context quiz reaches its AI call in the middle: reading her job. Nothing sent from the page is trusted,
// the session comes from her cookie, and the call is counted against the session and the site. It never throws
// or holds the quiz up: when anything goes wrong she gets the fixed list, and the quiz carries on.
// BEGINNER_QUESTIONS_OFF=1 forces that, so the fallback can be tried. The question the AI wrote for her later in
// the quiz went in Phase 8 of docs/DIRECTION.md.

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
