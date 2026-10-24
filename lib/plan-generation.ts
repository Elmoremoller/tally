import { after } from "next/server";
import { claimPlanGeneration, failPlan, loadPlanInput, planById, savePlan } from "./funnel-db";
import { writePlan } from "./plan-writer";

// Writing a paid plan: started by the Stripe webhook and the page after paying, whichever comes first, and
// picked up again by the plan page while it waits. The database lets only one attempt run at a time and
// stops after four (the first and three retries). Each failure is saved on the plan (status and last_error
// in the plans table) and logged, so it can be seen and fixed by hand.

/** Writes the plan, retrying straight away after a failure. Safe to call any number of times. */
export async function writeAndSavePlan(planId: string) {
  for (let attempt = 1; attempt <= 4; attempt++) {
    if (!(await claimPlanGeneration(planId))) return;
    try {
      const plan = await planById(planId);
      if (!plan) throw new Error("The plan is gone");
      const { content, model, promptVersion } = await writePlan(await loadPlanInput(plan));
      await savePlan(planId, content, promptVersion, model);
      return;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`Writing plan ${planId} failed on attempt ${attempt}: ${message}`);
      await failPlan(planId, message).catch((e) => console.error("Saving the failure failed", e));
    }
  }
}

/** Starts writing once the response has gone out, so the page or the webhook answers straight away. */
export const writePlanAfterResponse = (planId: string) => after(() => writeAndSavePlan(planId));
