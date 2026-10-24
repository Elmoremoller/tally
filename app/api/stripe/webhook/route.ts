import type Stripe from "stripe";
import { fulfillCheckout } from "@/lib/fulfill";
import { writePlanAfterResponse } from "@/lib/plan-generation";
import { stripe } from "@/lib/stripe";

// Writing a plan takes a little while; it runs after Stripe has had its answer, within this limit.
export const maxDuration = 300;

// Stripe calls this when a payment goes through, even if she closed the page. It checks the signature, so
// only Stripe can mark anyone as paid. Set it up in Stripe as described in SETUP.md.
export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = request.headers.get("stripe-signature");
  if (!secret || !signature) return new Response("Webhook is not set up", { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe().webhooks.constructEvent(await request.text(), signature, secret);
  } catch {
    return new Response("Bad signature", { status: 400 });
  }

  if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
    try {
      // Checkouts this site didn't start, like The Couple Standard's, come back as not ours and are acknowledged.
      const result = await fulfillCheckout(event.data.object.id);
      if (result.paid) await writePlanAfterResponse(result.planId);
    } catch (error) {
      // A 500 makes Stripe try again later.
      console.error("Fulfilment failed", error);
      return new Response("Could not record the payment", { status: 500 });
    }
  }
  return Response.json({ received: true });
}
