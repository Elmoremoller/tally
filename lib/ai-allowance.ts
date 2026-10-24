import { createHmac } from "node:crypto";
import { headers } from "next/headers";
import { previewAllowed } from "./preview";
import { supabaseAdmin, supabaseConfigured } from "./supabase";

/**
 * Counts one AI call (the quiz reflection, or reading back a review line) against this caller's allowance
 * and the site's. Server only.
 */
export async function allowAiCall() {
  const secret = process.env.SUPABASE_SECRET_KEY;
  // Only on a local setup without Supabase: there is nothing to count against, so it can be tried.
  if (!supabaseConfigured || !secret) return previewAllowed;
  const address = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const caller = createHmac("sha256", secret).update(address).digest("hex");
  try {
    const { data, error } = await supabaseAdmin().rpc("use_ai_call", { p_caller: caller });
    if (error) throw new Error(error.message);
    return data === true;
  } catch (error) {
    console.error("use_ai_call failed", error);
    return false;
  }
}
