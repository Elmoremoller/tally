"use server";

import { NOTE_MAX, PATH_VERSION, PHONES, type PathAnswer, type PathPlan, type Phone } from "@/lib/beginner/path";
import { cleanFollowUps, isSolved } from "@/lib/beginner/follow-ups";
import type { PathInput } from "@/lib/beginner/path-writer";
import { pathV4Samples } from "@/lib/beginner/path-v4-samples";
import {
  answerableSteps,
  DESIGNS_MAX,
  PATH_V4,
  questionsFor,
  SLOT_IDS,
  validPathV4,
  withPicks,
  type PathV4,
  type SlotId,
} from "@/lib/beginner/workflow";
import { designWorkflow, WORKFLOW_PROMPT_VERSION } from "@/lib/beginner/workflow-writer";
import { loadPathInput, logEvent, orderEmail, planByToken, savePlan, sessionAngle, type PlanRow } from "@/lib/funnel-db";
import { previewAllowed } from "@/lib/preview";
import { readSessionId } from "@/lib/session-cookie";
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


/** The path behind a token, or null when the token or the plan is not a Phase 6 or Phase 10 path. */
async function pathFor(token: string) {
  const plan = await planByToken(token);
  const content = plan?.content as PathPlan | PathV4 | null | undefined;
  return plan && plan.status === "ready" && (content?.version === PATH_VERSION || content?.version === PATH_V4) ? { plan, content } : null;
}

/** The step ids "Did it work?" can be saved for on this path. */
const stepIds = (content: PathPlan | PathV4) =>
  content.version === PATH_V4 ? answerableSteps(content) : content.steps.filter((s) => s.kind !== "end").map((s) => s.id);

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
    if (!found || !stepIds(found.content).includes(input.step)) return { ok: false };
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

// Phase 10: her paid path starts with her two workflows, then the follow up questions for each, then the workflow
// written from her answers. Everything is kept in the plan's content and saved with save_plan, so there is no
// database change. On a local preview (no token), the page sends its path and nothing is saved.

/** A version 4 path behind a token. */
async function pathV4For(token: string) {
  const plan = await planByToken(token);
  const content = plan?.content as PathV4 | null | undefined;
  return plan && plan.status === "ready" && content?.version === PATH_V4 && validPathV4(content) ? { plan, content } : null;
}

/** Saves her path and keeps the plan's own prompt version, so the plan stays readable. */
const keep = (plan: PlanRow, content: PathV4, model?: string) =>
  savePlan(plan.id, content, plan.prompt_version ?? WORKFLOW_PROMPT_VERSION, model ?? plan.model ?? "none");

export type PathResult = { ok: boolean; content?: PathV4; error?: "limit" | "failed" | "invalid" };

/** She keeps her two workflows, or swaps one for another row on her map. */
export async function savePathPicks(input: { token: string | null; picks: string[]; preview?: PathV4 | null }): Promise<PathResult> {
  try {
    if (!input.token) {
      if (!previewAllowed || !input.preview) return { ok: false, error: "invalid" };
      const next = withPicks(input.preview, input.picks);
      return next ? { ok: true, content: next } : { ok: false, error: "invalid" };
    }
    const found = await pathV4For(input.token);
    if (!found) return { ok: false, error: "invalid" };
    const next = withPicks(found.content, input.picks);
    if (!next) return { ok: false, error: "invalid" };
    // A workflow already written stays: picks never touch a slot whose task is unchanged.
    await keep(found.plan, next);
    return { ok: true, content: next };
  } catch (error) {
    console.error("Saving her picks failed", error);
    return { ok: false, error: "failed" };
  }
}

/** Her answers and path on a local preview: from her own quiz in this browser, or a sample. */
async function previewInput(sample: string | null): Promise<PathInput | null> {
  if (!previewAllowed) return null;
  if (sample && pathV4Samples[sample]) return pathV4Samples[sample].input;
  const session = await readSessionId();
  return session ? loadPathInput({ session_id: session } as PlanRow) : null;
}

/**
 * Her answers for one workflow, then that workflow written from them (DIRECTION.md, Phase 10). When she says an
 * app already does it, nothing is written: the slot is marked solved and she picks another row. Workflows are
 * written in order, at most DESIGNS_MAX times each.
 */
export async function writePathWorkflow(input: {
  token: string | null;
  slot: SlotId;
  answers: unknown;
  preview?: PathV4 | null;
  sample?: string | null;
}): Promise<PathResult> {
  try {
    if (!(SLOT_IDS as readonly string[]).includes(input.slot)) return { ok: false, error: "invalid" };
    const found = input.token ? await pathV4For(input.token) : null;
    if (input.token && !found) return { ok: false, error: "invalid" };
    const path = found?.content ?? (previewAllowed ? input.preview : null);
    const her = found ? await loadPathInput(found.plan) : await previewInput(input.sample ?? null);
    if (!path || !her || path.version !== PATH_V4 || !path.confirmed) return { ok: false, error: "invalid" };
    const at = path.slots.findIndex((s) => s.id === input.slot);
    const slot = path.slots[at];
    if (!slot || path.slots.slice(0, at).some((s) => !s.design)) return { ok: false, error: "invalid" };
    if (slot.design) return { ok: true, content: path };
    const asked = questionsFor(path, slot);
    const answers = asked ? cleanFollowUps(asked.set, input.answers) : null;
    if (!asked || !answers) return { ok: false, error: "invalid" };

    const update = (next: PathV4["slots"][number], prose?: PathV4["prep"]) => (p: PathV4): PathV4 => ({
      ...p,
      prep: p.prep ?? prose ?? null,
      slots: p.slots.map((s) => (s.id === next.id && s.task === next.task ? next : s)),
    });
    const save = async (change: (p: PathV4) => PathV4, model?: string) => {
      if (!found) return change(path);
      // Read again before saving, so a pick or answer saved meanwhile on another device is kept.
      const fresh = (await pathV4For(input.token!))?.content ?? path;
      const next = change(fresh);
      await keep(found.plan, next, model);
      return next;
    };

    if (isSolved(asked.pattern, answers)) return { ok: true, content: await save(update({ ...slot, answers, solved: true })) };
    if (slot.tries >= DESIGNS_MAX) return { ok: false, error: "limit", content: path };
    try {
      const written = await designWorkflow(her, path, { ...slot, answers }, asked.set, answers);
      const next = { ...slot, answers, solved: false, design: written.design, tries: slot.tries + 1 };
      return { ok: true, content: await save(update(next, written.prose), written.model) };
    } catch (error) {
      console.error(`Writing workflow ${input.slot} failed`, error instanceof Error ? error.message : error);
      const content = await save(update({ ...slot, answers, tries: slot.tries + 1 }));
      return { ok: false, error: content.slots[at].tries >= DESIGNS_MAX ? "limit" : "failed", content };
    }
  } catch (error) {
    console.error("Writing a workflow failed", error);
    return { ok: false, error: "failed" };
  }
}
