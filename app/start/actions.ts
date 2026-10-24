"use server";

import { allowAiCall } from "@/lib/ai-allowance";
import { cleanBullets, cleanText, oneOf } from "@/lib/clean";
import { previewAllowed } from "@/lib/preview";
import {
  allowedIds,
  CORRECTION_MAX,
  coupleTypeFor,
  fightTopics,
  looksLikeEmail,
  NAME_MAX,
  STORY_MAX,
  type CoupleTypeId,
  type QuizAnswers,
} from "@/lib/quiz";
import {
  HEATS,
  reflect,
  ROLES,
  soundsUnsafe,
  WANTS,
  type KeptReflection,
  type Reflection,
} from "@/lib/reflection";
import { saveResult } from "@/lib/result-cookie";
import { sendLoginLink, supabaseAdmin, supabaseConfigured, supabaseServer } from "@/lib/supabase";

export type SaveResult =
  | { ok: true; coupleType: CoupleTypeId; saved: boolean; hasPlan?: false }
  | { ok: true; hasPlan: true; email: string }
  | { ok: false; error: string };

const cleanName = (value: unknown) =>
  typeof value === "string" ? value.trim().slice(0, NAME_MAX) || null : null;

/** The reflection they kept, as the browser sends it back, checked like everything else from outside. */
function cleanReflection(story: unknown, value: unknown, topics: string[]): (KeptReflection & { story: string }) | null {
  const text = cleanText(story, STORY_MAX);
  const kept = (value ?? {}) as Partial<KeptReflection>;
  const bullets = cleanBullets(kept.bullets);
  if (!text || !bullets || typeof kept.fixed !== "boolean") return null;
  const labels = (kept.labels ?? {}) as Partial<KeptReflection["labels"]>;
  return {
    story: text,
    bullets,
    fixed: kept.fixed,
    correction: kept.fixed ? cleanText(kept.correction, CORRECTION_MAX) : null,
    labels: {
      mainTopic: oneOf(topics, labels.mainTopic) ? labels.mainTopic : null,
      role: oneOf(ROLES, labels.role) ? labels.role : null,
      heat: oneOf(HEATS, labels.heat) ? labels.heat : null,
      wantsMoreOf: oneOf(WANTS, labels.wantsMoreOf) ? labels.wantsMoreOf : null,
    },
  };
}

/**
 * Saves what they wrote and the reflection they kept, out of reach of an invited partner, or clears an
 * earlier one when they wrote nothing this time. It never stops the quiz.
 */
async function saveReflection(email: string, kept: ReturnType<typeof cleanReflection>) {
  if (!process.env.SUPABASE_SECRET_KEY) return;
  const { error } = await supabaseAdmin().rpc(
    "save_reflection",
    kept
      ? {
          p_email: email,
          p_story: kept.story,
          p_correction: kept.correction,
          p_bullets: kept.bullets,
          p_fixed: kept.fixed,
          p_main_topic: kept.labels.mainTopic,
          p_role: kept.labels.role,
          p_heat: kept.labels.heat,
          p_wants_more_of: kept.labels.wantsMoreOf,
        }
      : { p_email: email },
  );
  if (error) console.warn("save_reflection failed", error.message);
}

/**
 * Saves one person’s quiz answers, couple type and email. Anyone can reach this from the internet, so it
 * trusts nothing it is sent: every answer is checked against the allowed ids, and the couple type is
 * worked out here rather than taken from the browser.
 */
export async function saveQuiz(answers: QuizAnswers): Promise<SaveResult> {
  const email = typeof answers?.email === "string" ? answers.email.trim().toLowerCase() : "";
  let topics = Array.isArray(answers?.topics) ? [...new Set(answers.topics)] : [];

  if (!looksLikeEmail(email) || email.length > 254) return { ok: false, error: "That email doesn’t look right." };
  if (
    topics.length === 0 ||
    !topics.every((t) => oneOf(allowedIds.topics, t)) ||
    !oneOf(allowedIds.you, answers.you) ||
    !oneOf(allowedIds.partner, answers.partner) ||
    !oneOf(allowedIds.start, answers.start) ||
    !oneOf(allowedIds.okayAgain, answers.okayAgain) ||
    !oneOf(allowedIds.makeUp, answers.makeUp)
  ) {
    return { ok: false, error: "Some answers are missing. Please go back and check them." };
  }

  const kept = cleanReflection(answers.story, answers.reflection, topics);
  // The topic their story was about leads, so the reveal and the plan start from it.
  const main = kept?.labels.mainTopic;
  if (main) topics = [main, ...topics.filter((t) => t !== main)];

  const coupleType = coupleTypeFor(answers.you, answers.partner);
  // Remembered in this browser, so the paywall can come back after a trip to Stripe.
  const remember = () =>
    saveResult({
      email,
      coupleType,
      topics,
      you: answers.you,
      partner: answers.partner,
      partnerName: cleanName(answers.partnerName),
    });

  // Only on a local setup with no Supabase settings yet (a dev server, or a local production build with
  // PLAN_PREVIEW=1): skip saving, so the quiz can still be clicked through.
  if (!supabaseConfigured && previewAllowed) {
    console.warn("Supabase is not set up, so these quiz answers were not saved.");
    await remember();
    return { ok: true, coupleType, saved: false };
  }

  const { data: hasPlan, error } = await supabaseServer().rpc("save_quiz", {
    p_email: email,
    p_couple_type: coupleType,
    p_fight_topics: topics,
    p_you_in_a_fight: answers.you,
    p_partner_in_a_fight: answers.partner,
    p_how_fights_start: answers.start,
    p_okay_again_after: answers.okayAgain,
    p_how_you_make_up: answers.makeUp,
    p_your_name: cleanName(answers.yourName),
    p_partner_name: cleanName(answers.partnerName),
  });

  if (error) {
    console.error("save_quiz failed", error.message);
    return { ok: false, error: "We couldn’t save your answers. Please try again." };
  }
  // They already paid for a plan with this email: send them back to it, rather than to the paywall.
  if (hasPlan === true) {
    const { error: linkError } = await sendLoginLink(email, { create: true });
    if (linkError) console.error("Login link failed", linkError.message);
    return { ok: true, hasPlan: true, email };
  }
  await saveReflection(email, kept).catch((error) => console.warn("save_reflection failed", error));
  await remember();
  return { ok: true, coupleType, saved: true };
}

export type ReflectInput = {
  story: string;
  topics: string[];
  partnerName?: string | null;
  /** The second pass, after Not quite. */
  fix?: { bullets: string[]; correction: string };
};

/**
 * Reads what they wrote about their last fight and reflects it back. Null means carry on without a
 * reflection: nothing was written, or the AI is slow, down or busy. Anyone can reach this, so it trusts
 * nothing it is sent, and each caller can only use it so often.
 */
export async function reflectOnStory(input: ReflectInput): Promise<Reflection | null> {
  const story = cleanText(input?.story, STORY_MAX);
  if (!story) return null;
  const topics = fightTopics.filter((t) => Array.isArray(input.topics) && input.topics.includes(t.id));
  const bullets = cleanBullets(input.fix?.bullets);
  const correction = cleanText(input.fix?.correction, CORRECTION_MAX);
  const fix = bullets && correction ? { bullets, correction } : undefined;

  // When the AI can't answer, clear words about violence, threats or self-harm still lead to the hotline.
  const fallback = (): Reflection | null => (soundsUnsafe(`${story} ${correction ?? ""}`) ? { safety: true } : null);
  if (!process.env.ANTHROPIC_API_KEY || !(await allowAiCall())) return fallback();
  try {
    return (await reflect({ story, topics, partnerName: cleanName(input.partnerName), fix })) ?? fallback();
  } catch (error) {
    console.error("Reflection failed", error);
    return fallback();
  }
}
