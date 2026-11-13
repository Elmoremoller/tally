import { after } from "next/server";
import { writeBeginnerPlan } from "./beginner/plan-writer";
import {
  claimPlanGeneration,
  failPlan,
  loadBeginnerPlanInput,
  loadPlanInput,
  loadWeek,
  orderEmail,
  planById,
  savePlan,
} from "./funnel-db";
import { writePlan } from "./plan-writer";
import { requestOrigin } from "./site";
import { sendPlanEmail } from "./supabase";

// Writing a paid plan: started by the Stripe webhook and the page after paying, whichever comes first, and
// picked up again by the plan page while it waits. The database lets only one attempt run at a time and
// stops after four (the first and three retries). Each failure is saved on the plan (status and last_error
// in the plans table) and logged, so it can be seen and fixed by hand. Once it's written, she gets an email with
// the private link to it.

/** Writes the plan, retrying straight away after a failure, then emails her its link. Safe to call any number of times. */
export async function writeAndSavePlan(planId: string, origin: string) {
  for (let attempt = 1; attempt <= 4; attempt++) {
    if (!(await claimPlanGeneration(planId))) return;
    try {
      const plan = await planById(planId);
      if (!plan) throw new Error("The plan is gone");
      // Answers from the beginner quiz get the beginner plan.
      const { intake } = await loadWeek(plan.session_id);
      const { content, model, promptVersion } = intake?.beginner
        ? await writeBeginnerPlan(await loadBeginnerPlanInput(plan))
        : await writePlan(await loadPlanInput(plan));
      await savePlan(planId, content, promptVersion, model);
      await emailPlan(plan.order_id, `${origin}/plan/${plan.access_token}`, origin);
      return;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`Writing plan ${planId} failed on attempt ${attempt}: ${message}`);
      await failPlan(planId, message).catch((e) => console.error("Saving the failure failed", e));
    }
  }
}

/** Her plan's link, to the email she paid with. A failed email is logged; the plan itself is safe. */
async function emailPlan(orderId: string, planUrl: string, origin: string) {
  try {
    const email = await orderEmail(orderId);
    if (!email) throw new Error("No email on the order");
    const { error } = await sendPlanEmail(email, planUrl, origin);
    if (error) throw error;
  } catch (error) {
    console.error("The plan email failed", error instanceof Error ? error.message : error);
  }
}

/**
 * Starts writing once the response has gone out, so the page or the webhook answers straight away. The site's
 * address is read now, while there's a request, for the link in her email.
 */
export async function writePlanAfterResponse(planId: string) {
  const origin = await requestOrigin();
  after(() => writeAndSavePlan(planId, origin));
}
