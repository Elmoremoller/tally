"use server";

import { NOTE_MAX, PATH_VERSION, PHONES, type PathAnswer, type PathPlan, type Phone } from "@/lib/beginner/path";
import { logEvent, orderEmail, planByToken, sessionAngle } from "@/lib/funnel-db";
import { previewAllowed } from "@/lib/preview";
import { requestOrigin } from "@/lib/site";
import { sendPlanEmail } from "@/lib/supabase";

export type ResendState = { sent: boolean; error?: string } | null;

/** Send it again: emails the link to her plan once more, to the address that paid for it. */
export async function resendPlanLink(_: ResendState, form: FormData): Promise<ResendState> {
  try {
    const plan = await planByToken(String(form.get("token") ?? ""));
    const email = plan ? await orderEmail(plan.order_id) : null;
    if (!plan || !email) return { sent: false, error: "We couldn’t find that plan." };
    const origin = await requestOrigin();
    const { error } = await sendPlanEmail(email, `${origin}/plan/${plan.access_token}`, origin);
    if (error) return { sent: false, error: "Please wait a minute, then try again." };
    return { sent: true };
  } catch (error) {
    console.error("Sending the plan link again failed", error);
    return { sent: false, error: "Something went wrong. Please try again in a minute." };
  }
}


/** The path behind a token, or null when the token or the plan is not a Phase 6 path. */
async function pathFor(token: string) {
  const plan = await planByToken(token);
  const content = plan?.content as PathPlan | null | undefined;
  return plan && plan.status === "ready" && content?.version === PATH_VERSION ? { plan, content } : null;
}

/**
 * "Did it work?" on one step of her path, saved in the events table (Phase 6). After a second Not quite on the
 * same step she may add a few words on what went wrong; they are saved with that answer. A preview has no token
 * and saves nothing.
 */
export async function answerPathStep(input: {
  token: string | null;
  step: string;
  answer: PathAnswer;
  note?: string | null;
}): Promise<{ ok: boolean }> {
  try {
    if (input.answer !== "yes" && input.answer !== "not_quite") return { ok: false };
    const note = input.answer === "not_quite" ? (input.note ?? "").replace(/\s+/g, " ").trim().slice(0, NOTE_MAX) : "";
    if (!input.token) return { ok: previewAllowed };
    const found = await pathFor(input.token);
    if (!found || !found.content.steps.some((s) => s.id === input.step && s.kind !== "end")) return { ok: false };
    const { plan } = found;
    await logEvent("path_answer", plan.session_id, await sessionAngle(plan.session_id), {
      plan: plan.id,
      step: input.step,
      answer: input.answer,
      ...(note ? { note } : {}),
    });
    return { ok: true };
  } catch (error) {
    console.error("Saving a path answer failed", error);
    return { ok: false };
  }
}

/** The phone she picked on the first step whose setup differs by phone, so her path remembers it on any device. */
export async function savePathPhone(input: { token: string | null; phone: Phone }): Promise<{ ok: boolean }> {
  try {
    if (!(PHONES as readonly string[]).includes(input.phone)) return { ok: false };
    if (!input.token) return { ok: previewAllowed };
    const found = await pathFor(input.token);
    if (!found) return { ok: false };
    const { plan } = found;
    await logEvent("path_phone", plan.session_id, await sessionAngle(plan.session_id), { plan: plan.id, phone: input.phone });
    return { ok: true };
  } catch (error) {
    console.error("Saving her phone failed", error);
    return { ok: false };
  }
}
