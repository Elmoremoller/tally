"use client";

import Link from "next/link";
import { useActionState } from "react";
import { startCheckout } from "@/app/start/checkout";
import { ArrowRight, Check } from "@/components/icons";
import { paywallConsent as consent } from "@/lib/legal";
import { dollars, PLAN_PRICE } from "@/lib/prices";

/**
 * Get my plan. Every line is about their own fights, not about what they are buying. The price is on the
 * button, so there are no surprises on Stripe’s page. Adding their partner is free, so it is a line in the
 * list rather than something to choose.
 */
export function Paywall({ topics, situation }: { topics: string; situation: string }) {
  const [state, action, pending] = useActionState(startCheckout, null);

  return (
    <section className="paywall" aria-labelledby="paywall-title">
      <h2 id="paywall-title" className="paywall-title">
        Your plan
      </h2>
      <ul className="paywall-list">
        <li>
          <Check />
          One small step a day, through Prevent, Pause and Repair.
        </li>
        {topics ? (
          <li>
            <Check />
            The exact words for your fights about {topics}.
          </li>
        ) : null}
        <li>
          <Check />
          What to say when {situation}.
        </li>
        <li>
          <Check />A check for any message, before you send it.
        </li>
        <li>
          <Check />
          Use it on your own, or invite your partner for free.
        </li>
      </ul>

      <form action={action} className="paywall-form">
        <button type="submit" className="btn btn-lg paywall-cta" disabled={pending}>
          {pending ? "One moment" : `Get my plan · ${dollars(PLAN_PRICE)}`}
          {pending ? null : <ArrowRight />}
        </button>
        {state?.error ? (
          <p className="quiz-error" role="alert">
            {state.error}
          </p>
        ) : null}
        <p className="paywall-fine">One payment, no subscription. Secure payment with Stripe.</p>
        {/* In a new tab, so reading them doesn't lose the quiz they just finished. */}
        <p className="paywall-fine paywall-consent">
          {consent.before}
          <Link href="/terms" target="_blank" rel="noopener noreferrer">
            {consent.terms}
          </Link>
          {consent.and}
          <Link href="/privacy" target="_blank" rel="noopener noreferrer">
            {consent.privacy}
          </Link>
          {consent.after}
        </p>
      </form>
    </section>
  );
}
