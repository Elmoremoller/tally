"use server";

import { orderEmail, planByToken } from "@/lib/funnel-db";
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
