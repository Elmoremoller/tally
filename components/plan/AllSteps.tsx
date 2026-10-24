"use client";

import Link from "next/link";
import { useState } from "react";
import type { Part } from "@/lib/plan";
import type { StepId } from "@/lib/progress";
import { planCopy } from "@/lib/steps";

export type ToolStep = {
  id: StepId;
  title: string;
  tryLabel: string;
  tryText: string;
  alone: string | null;
  /** On four steps: the guided 10 minute repair, or the 20 minutes. */
  help: { href: string; label: string } | null;
};
export type ToolGroup = { part: Part; name: string; line: string; steps: ToolStep[] };

/**
 * All their steps, under Prevent, Pause and Repair, open whenever they need one. Today's step is only a
 * suggestion. Each step shows what to try, and how to do it on your own.
 */
export function AllSteps({ groups, start }: { groups: ToolGroup[]; start: Part }) {
  const [current, setCurrent] = useState<Part>(start);
  const group = groups.find((g) => g.part === current) ?? groups[0];
  if (!group) return null;
  return (
    <section className="plan-section" aria-labelledby="all-steps-title">
      <h2 id="all-steps-title" className="plan-section-title">
        {planCopy.allSteps}
      </h2>
      <p className="plan-section-text">{planCopy.allStepsText}</p>
      <div className="plan-tabs" role="group" aria-label={planCopy.allSteps}>
        {groups.map((g) => (
          <button
            key={g.part}
            type="button"
            className="plan-tab"
            aria-pressed={g.part === group.part}
            onClick={() => setCurrent(g.part)}
          >
            {g.name}
          </button>
        ))}
      </div>
      <div className="plan-tools" aria-live="polite">
        <p className="plan-tools-line">{group.line}</p>
        {group.steps.map((step) => (
          <article key={step.id} className="plan-tool">
            <h3 className="plan-tool-title">{step.title}</h3>
            <p className="plan-try-label">{step.tryLabel}</p>
            <p>{step.tryText}</p>
            {step.alone ? (
              <>
                <p className="plan-try-label">{planCopy.alone}</p>
                <p>{step.alone}</p>
              </>
            ) : null}
            {step.help ? (
              <Link href={step.help.href} className="btn btn-quiet plan-help-link">
                {step.help.label}
              </Link>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}
