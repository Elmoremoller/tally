"use client";

import Link from "next/link";
import { useActionState } from "react";
import { startCheckout } from "@/app/start/checkout";
import { ArrowRight } from "@/components/icons";
import { paywallConsent as consent } from "@/lib/legal";
import { paywallCopy } from "@/lib/plan-copy";
import type { AiPolicy, AiTool, WeekTask } from "@/lib/week";
import { Dock } from "./Dock";
import { PlanPreview } from "./PlanPreview";

/**
 * Get my plan, under her free result: the headline, a look at her plan built from her answers, the price and
 * the refund line, and the button to Stripe's page.
 */
export function Paywall({
  tasks,
  aiTools,
  aiPolicy,
}: {
  tasks: Pick<WeekTask, "name" | "pile" | "hours">[];
  aiTools: AiTool[];
  aiPolicy: AiPolicy | null;
}) {
  const [state, action, pending] = useActionState(startCheckout, null);

  return (
    <section className="paywall" aria-labelledby="paywall-title">
      <h2 id="paywall-title" className="paywall-title">
        {paywallCopy.title}
      </h2>
      <p className="paywall-lead">{paywallCopy.lead}</p>
      <PlanPreview tasks={tasks} aiTools={aiTools} aiPolicy={aiPolicy} />

      {/* On a phone the price and the button stay pinned while she reads the cards, and the error shows with them. */}
      <form action={action} className="paywall-form">
        <Dock className="paywall-dock">
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
        </Dock>
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
