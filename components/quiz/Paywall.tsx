"use client";

import Link from "next/link";
import { useActionState } from "react";
import { startCheckout } from "@/app/start/checkout";
import { ArrowRight, Check } from "@/components/icons";
import { paywallConsent as consent } from "@/lib/legal";
import { paywallCopy } from "@/lib/plan-copy";
import type { WeekTask } from "@/lib/week";

/** Her biggest task in a pile, by her own hours. */
const top = (tasks: Pick<WeekTask, "name" | "pile" | "hours">[], pile: WeekTask["pile"]) =>
  tasks.filter((t) => t.pile === pile).sort((a, b) => b.hours - a.hours)[0];

/**
 * Get my plan, under her free result: the headline, two lines built from her own tasks, the five parts of
 * the plan, the price and the refund line, and the button to Stripe's page.
 */
export function Paywall({ tasks }: { tasks: Pick<WeekTask, "name" | "pile" | "hours">[] }) {
  const [state, action, pending] = useActionState(startCheckout, null);
  const toAi = top(tasks, "hand_to_ai");
  const back = top(tasks, "hand_back");

  return (
    <section className="paywall" aria-labelledby="paywall-title">
      <h2 id="paywall-title" className="paywall-title">
        {paywallCopy.title}
      </h2>
      <ul className="paywall-list">
        {toAi ? (
          <li>
            <Check />
            {paywallCopy.prompts(toAi.name)}
          </li>
        ) : null}
        {back ? (
          <li>
            <Check />
            {paywallCopy.handBack(back.name)}
          </li>
        ) : null}
        {paywallCopy.parts.map((part) => (
          <li key={part.title}>
            <Check />
            <span>
              <strong>{part.title}.</strong> {part.text}
            </span>
          </li>
        ))}
      </ul>

      <form action={action} className="paywall-form">
        <p className="paywall-price">{paywallCopy.price}</p>
        <button type="submit" className="btn btn-lg paywall-cta" disabled={pending}>
          {pending ? paywallCopy.pending : paywallCopy.cta}
          {pending ? null : <ArrowRight />}
        </button>
        {state?.error ? (
          <p className="quiz-error" role="alert">
            {state.error}
          </p>
        ) : null}
        <p className="paywall-fine">
          {paywallCopy.refund} {paywallCopy.secure}
        </p>
        {/* In a new tab, so reading them doesn't lose the result she just got. */}
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
