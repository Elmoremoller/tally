"use server";

import { looksLikeEmail } from "@/lib/clean";
import { sendLoginLink, supabaseConfigured } from "@/lib/supabase";

export type LoginState = { sent: boolean; error?: string } | null;

/**
 * Emails a login link to someone who already has a plan, or was invited to one. It says the same thing
 * whether or not the email has a plan, so nobody can use it to find out who is a customer.
 */
export async function requestLink(_: LoginState, form: FormData): Promise<LoginState> {
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  if (!looksLikeEmail(email)) return { sent: false, error: "That email doesn’t look right." };
  if (!supabaseConfigured) return { sent: false, error: "Login is not set up yet. See SETUP.md." };
  const { error } = await sendLoginLink(email, { create: false });
  if (error && error.status === 429) return { sent: false, error: "Please wait a minute, then try again." };
  // An email with no plan gets the same answer, but anything else going wrong is worth knowing about.
  if (error && !/signups not allowed/i.test(error.message)) console.error("Login link failed", error.message);
  return { sent: true };
}
