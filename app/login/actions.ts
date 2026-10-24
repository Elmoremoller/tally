"use server";

import { looksLikeEmail } from "@/lib/clean";
import { latestPlanForEmail } from "@/lib/funnel-db";
import { requestOrigin } from "@/lib/site";
import { sendPlanEmail, supabaseConfigured } from "@/lib/supabase";

export type LoginState = { sent: boolean; error?: string } | null;

/**
 * Emails the private link to her plan to someone who bought one. It says the same thing whether or not the
 * email has a plan, so nobody can use it to find out who is a customer.
 */
export async function requestLink(_: LoginState, form: FormData): Promise<LoginState> {
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  if (!looksLikeEmail(email)) return { sent: false, error: "That email doesn’t look right." };
  if (!supabaseConfigured) return { sent: false, error: "Login is not set up yet. See SETUP.md." };
  try {
    const plan = await latestPlanForEmail(email);
    if (!plan) return { sent: true };
    const origin = await requestOrigin();
    const { error } = await sendPlanEmail(email, `${origin}/plan/${plan.access_token}`, origin);
    if (error?.status === 429) return { sent: false, error: "Please wait a minute, then try again." };
    if (error) console.error("The plan link email failed", error.message);
  } catch (error) {
    console.error("The plan link email failed", error);
  }
  return { sent: true };
}
