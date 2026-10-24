"use server";

import { redirect } from "next/navigation";
import { createCheckout } from "@/lib/checkout";
import { readResult } from "@/lib/result-cookie";
import { stripeConfigured } from "@/lib/stripe";
import { supabaseAdmin, supabaseConfigured } from "@/lib/supabase";

export type CheckoutState = { error: string } | null;

/** Get my plan: sends them to Stripe Checkout for the plan. */
export async function startCheckout(): Promise<CheckoutState> {
  const result = await readResult();
  if (!result) return { error: "Please take the quiz first, so we can make your plan." };
  if (!stripeConfigured) {
    return {
      error:
        process.env.NODE_ENV === "production"
          ? "Something went wrong. Please try again in a minute."
          : "Payments are not set up yet. Add the Stripe test keys from SETUP.md.",
    };
  }

  // So a quiz about to turn 30 days old isn't deleted while they pay (see the privacy SQL file).
  if (supabaseConfigured) {
    try {
      const { error } = await supabaseAdmin().rpc("note_checkout", { p_email: result.email });
      if (error) console.error("note_checkout failed", error.message);
    } catch (error) {
      console.error("note_checkout failed", error);
    }
  }

  let url: string;
  try {
    url = await createCheckout({ email: result.email, coupleType: result.coupleType });
  } catch (error) {
    console.error("Checkout failed", error);
    return { error: "Something went wrong. Please try again in a minute." };
  }
  redirect(url);
}
