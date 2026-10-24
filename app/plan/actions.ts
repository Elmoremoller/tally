"use server";

import { refresh } from "next/cache";
import { redirect } from "next/navigation";
import { allowAiCall } from "@/lib/ai-allowance";
import {
  CHECK_INS,
  endingChoices,
  heardChoices,
  keptChoices,
  lastChoices,
  moreHeardChoices,
  NOTE_MAX,
  payChoices,
  QUOTE_MAX,
  USED_IDS,
} from "@/lib/check-ins";
import { cleanBullets, cleanText, oneOf } from "@/lib/clean";
import type { AgreeResult } from "@/lib/fight-help";
import { reviewMessage, type Review } from "@/lib/message-check";
import { describeForAssistant } from "@/lib/plan";
import { loadPlanState } from "@/lib/plan-state";
import { isCoupleType, previewAllowed, previewHref, previewPlan, previewProgress, sampleViewer } from "@/lib/preview";
import {
  advance,
  AGREE_STEPS,
  AGREEMENT_MAX,
  LINE_MAX,
  OUTCOMES,
  STEP_IDS,
  VERSIONS,
  type Progress,
} from "@/lib/progress";
import { looksLikeEmail } from "@/lib/quiz";
import { reflect, soundsUnsafe, type Reflection } from "@/lib/reflection";
import { mentionsHarm } from "@/lib/safety";
import { SLOT_IDS } from "@/lib/standard";
import { sendLoginLink } from "@/lib/supabase";
import { loadViewer } from "@/lib/viewer";

const local = previewAllowed;
const ids = (choices: readonly { id: string }[]) => choices.map((c) => c.id);
const SOMETHING_WRONG = "Something went wrong. Please try again in a minute.";
const SIGN_IN_AGAIN = "Please open your plan again from the link in your email.";

export type CheckState = (Review & { error?: undefined }) | { error: string } | null;

/** Check a message before you send it. */
export async function checkMessage(_: CheckState, form: FormData): Promise<CheckState> {
  const message = String(form.get("message") ?? "").trim();
  if (!message) return { error: "Paste or type the message first." };
  if (message.length > 2000) return { error: "That’s a long one. Try the part that matters most, up to 2,000 characters." };
  if (!process.env.ANTHROPIC_API_KEY) {
    return { error: local ? "The message check is not set up yet. Add ANTHROPIC_API_KEY from SETUP.md." : SOMETHING_WRONG };
  }

  let aboutThem: string;
  const previewType = form.get("preview");
  if (local && isCoupleType(previewType)) {
    aboutThem = describeForAssistant(sampleViewer(previewType).ctx);
  } else {
    const { supabase, viewer } = await loadViewer();
    if (!viewer?.row.paid_at) return { error: SIGN_IN_AGAIN };
    // Counts this check against today’s allowance. The database also makes sure their plan is paid for.
    const { data: left, error } = await supabase.rpc("use_message_check");
    if (error) return { error: SIGN_IN_AGAIN };
    if (left === -1) return { error: "You’ve used today’s message checks. They come back tomorrow." };
    aboutThem = describeForAssistant(viewer.ctx);
  }

  try {
    const review = await reviewMessage(message, aboutThem);
    return review ?? { error: "We couldn’t check that one. Try wording it a little differently." };
  } catch (error) {
    console.error("Message check failed", error);
    return { error: "The message check isn’t working right now. Try again in a minute." };
  }
}

export type InviteState = { sent: string } | { error: string } | null;

/** Add my partner: gives them the plan and emails them a link. It’s free. */
export async function invitePartner(_: InviteState, form: FormData): Promise<InviteState> {
  if (local && form.get("preview")) return { error: "This is a preview, so nothing was sent." };
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  if (!looksLikeEmail(email)) return { error: "That email doesn’t look right." };

  const { supabase, viewer } = await loadViewer();
  if (!viewer || viewer.role !== "owner") return { error: SIGN_IN_AGAIN };
  if (email === viewer.email) return { error: "That’s your own email. Add your partner’s instead." };

  const { error } = await supabase.rpc("invite_partner", { p_partner_email: email });
  if (error) return { error: SOMETHING_WRONG };
  const { error: linkError } = await sendLoginLink(email, { create: true });
  if (linkError) return { error: "Saved, but the email didn’t go out. Please wait a minute and send it again." };
  refresh();
  return { sent: email };
}

export async function signOut() {
  const { supabase } = await loadViewer();
  await supabase.auth.signOut();
  redirect("/");
}

export type ReviewInput = {
  stepId: string;
  version: string;
  outcome: string;
  /** The line they added about what happened, and what was read back to them. */
  line?: string | null;
  bullets?: string[] | null;
  /** On an agree step, after It helped: what they agreed on. */
  agreement?: string | null;
  /** Only on /plan/preview: where the sample plan is. Nothing is saved there. */
  preview?: Record<string, unknown> | null;
};
export type ReviewState = { error: string } | null;

const isOn = (progress: Progress, stepId: string, version: string) =>
  progress.current?.stepId === stepId && progress.current.version === version;

/**
 * Saves one answer to Did you try it?, then opens the plan on the step it leads to, with the line for
 * that answer above it. An answer about a step that's no longer on screen (an old tab) is not saved.
 */
export async function submitReview(input: ReviewInput): Promise<ReviewState> {
  const { stepId, version, outcome } = input ?? {};
  if (!oneOf(STEP_IDS, stepId) || !oneOf(VERSIONS, version) || !oneOf(OUTCOMES, outcome)) return { error: SOMETHING_WRONG };
  const line = cleanText(input.line, LINE_MAX);
  const bullets = line ? cleanBullets(input.bullets) : null;
  const agreement = outcome === "helped" && AGREE_STEPS.includes(stepId) ? cleanText(input.agreement, AGREEMENT_MAX) : null;
  const now = new Date();

  if (local && input.preview) {
    const plan = previewPlan(input.preview);
    const progress = previewProgress(plan, now);
    if (!isOn(progress, stepId, version)) redirect(previewHref(plan, progress, null));
    const next = advance(progress, outcome, now);
    redirect(previewHref(plan, next.progress, next.progress.current ? next.ack : null));
  }

  const { supabase, viewer } = await loadViewer();
  if (!viewer?.row.paid_at) return { error: SIGN_IN_AGAIN };
  const { progress } = await loadPlanState(supabase, viewer, now);
  if (!isOn(progress, stepId, version)) redirect("/plan");
  const next = advance(progress, outcome, now);

  const { error } = await supabase.rpc("record_review", {
    p_step_id: stepId,
    p_version: version,
    p_outcome: outcome,
    p_line: line,
    p_bullets: bullets,
  });
  if (error) {
    console.error("record_review failed", error.message);
    return { error: SOMETHING_WRONG };
  }
  if (agreement) {
    const { error: agreeError } = await supabase.rpc("save_agreement", { p_step_id: stepId, p_text: agreement });
    if (agreeError) console.error("save_agreement failed", agreeError.message);
  }
  // The line for their answer shows above the next step. After the last step, the end of the plan says it all.
  redirect(next.progress.current ? `/plan?after=${next.ack}` : "/plan");
}

/**
 * Saves what they agreed at the end of the 10 minute repair, with their other agreements, for their Couple
 * Standard. Saving again changes it. Words about fear or harm lead to the hotline instead.
 */
export async function saveRepairAgreement(text: string): Promise<AgreeResult> {
  const agreement = cleanText(text, AGREEMENT_MAX);
  if (!agreement) return { error: SOMETHING_WRONG };
  if (mentionsHarm(agreement)) return { safety: true };
  const { supabase, viewer } = await loadViewer();
  if (!viewer?.row.paid_at) return { error: SIGN_IN_AGAIN };
  const { error } = await supabase.rpc("save_agreement", { p_step_id: "ten_minute", p_text: agreement });
  if (error) {
    console.error("save_agreement failed", error.message);
    return { error: SOMETHING_WRONG };
  }
  return null;
}

/** What saving or agreeing to a line of their Couple Standard says back: nothing when it worked. */
export type LineState = { error: string } | { safety: true } | null;

/**
 * Saves one shared line of their Couple Standard. New words make it a proposal from them, until the other
 * person agrees. Words about fear or harm lead to the hotline instead.
 */
export async function saveStandardLine(input: { slot: string; text: string }): Promise<LineState> {
  const text = cleanText(input?.text, AGREEMENT_MAX);
  if (!oneOf(SLOT_IDS, input?.slot) || !text) return { error: SOMETHING_WRONG };
  if (mentionsHarm(text)) return { safety: true };
  const { supabase, viewer } = await loadViewer();
  if (!viewer?.row.paid_at) return { error: SIGN_IN_AGAIN };
  const { error } = await supabase.rpc("save_agreement", { p_step_id: input.slot, p_text: text });
  if (error) {
    console.error("save_agreement failed", error.message);
    return { error: SOMETHING_WRONG };
  }
  return null;
}

/** Saves how they bring up something hard, in their own words. Only they can change it. */
export async function saveWayIn(input: { text: string }): Promise<LineState> {
  const text = cleanText(input?.text, AGREEMENT_MAX);
  if (!text) return { error: SOMETHING_WRONG };
  if (mentionsHarm(text)) return { safety: true };
  const { supabase, viewer } = await loadViewer();
  if (!viewer?.row.paid_at) return { error: SIGN_IN_AGAIN };
  const { error } = await supabase.rpc("save_intention", { p_text: text });
  if (error) {
    console.error("save_intention failed", error.message);
    return { error: SOMETHING_WRONG };
  }
  return null;
}

/** Agrees to a shared line as it stands. The database decides who may: see agree_to. */
export async function agreeToLine(input: { slot: string }): Promise<LineState> {
  if (!oneOf(SLOT_IDS, input?.slot)) return { error: SOMETHING_WRONG };
  const { supabase, viewer } = await loadViewer();
  if (!viewer?.row.paid_at) return { error: SIGN_IN_AGAIN };
  const { error } = await supabase.rpc("agree_to", { p_step_id: input.slot });
  if (error) {
    console.error("agree_to failed", error.message);
    return { error: SOMETHING_WRONG };
  }
  return null;
}

/**
 * Saves a check in's answers, for us only, never the partner. The first answers count; the database also
 * decides whether it's due. Words about fear or harm in either box lead to the hotline instead. The quote
 * is sent only when there is one, so a database without its SQL still saves the rest.
 */
export async function saveCheckIn(input: { checkIn: string; answers: Record<string, unknown> }): Promise<LineState> {
  const a = input?.answers ?? {};
  let params: Record<string, unknown>;
  if (input?.checkIn === "start") {
    if (!oneOf(ids(heardChoices), a.heard) || !oneOf(ids(endingChoices), a.ending)) return { error: SOMETHING_WRONG };
    params = { p_check_in: "start", p_heard: a.heard, p_usual_ending: a.ending };
  } else if (oneOf(CHECK_INS, input?.checkIn)) {
    const used = Array.isArray(a.used) && a.used.every((u) => oneOf(USED_IDS, u)) ? [...new Set(a.used as string[])] : null;
    const note = a.note === undefined || a.note === "" ? "" : cleanText(a.note, NOTE_MAX);
    const quote = a.quote === undefined || a.quote === "" ? "" : cleanText(a.quote, QUOTE_MAX);
    if (
      !used ||
      note === null ||
      quote === null ||
      !oneOf(ids(moreHeardChoices), a.moreHeard) ||
      !oneOf(ids(keptChoices), a.kept) ||
      !oneOf(ids(lastChoices), a.last) ||
      !oneOf(ids(payChoices), a.pay)
    ) {
      return { error: SOMETHING_WRONG };
    }
    if ((note && mentionsHarm(note)) || (quote && mentionsHarm(quote))) return { safety: true };
    params = {
      p_check_in: input.checkIn,
      p_used: used,
      p_more_heard: a.moreHeard,
      p_kept_agreement: a.kept,
      p_last_disagreement: a.last,
      p_would_pay_for_practice: a.pay,
      p_note: note || null,
      ...(quote ? { p_quote: quote, p_show_quote: a.showQuote === true } : {}),
    };
  } else {
    return { error: SOMETHING_WRONG };
  }
  const { supabase, viewer } = await loadViewer();
  if (!viewer?.row.paid_at) return { error: SIGN_IN_AGAIN };
  const { error } = await supabase.rpc("save_check_in", params);
  if (error) {
    console.error("save_check_in failed", error.message);
    return { error: SOMETHING_WRONG };
  }
  return null;
}

/**
 * Reads back the line they wrote about how a step went, the way the quiz does. Null means carry on without
 * it. Words about fear or harm lead to the hotline instead.
 */
export async function reflectOnReview(input: { line: string; stepTitle: string; preview?: boolean }): Promise<Reflection | null> {
  const line = cleanText(input?.line, LINE_MAX);
  if (!line) return null;
  const fallback = (): Reflection | null => (soundsUnsafe(line) ? { safety: true } : null);
  if (!(local && input.preview)) {
    const { viewer } = await loadViewer();
    if (!viewer?.row.paid_at) return fallback();
  }
  if (!process.env.ANTHROPIC_API_KEY || !(await allowAiCall())) return fallback();
  try {
    const stepTitle = cleanText(input.stepTitle, 200) ?? undefined;
    return (await reflect({ kind: "review", story: line, stepTitle, topics: [], partnerName: null })) ?? fallback();
  } catch (error) {
    console.error("Review reflection failed", error);
    return fallback();
  }
}
