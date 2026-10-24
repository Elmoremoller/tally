"use client";

import Link from "next/link";
import { useState } from "react";
import { Heart, PauseCircle, Shield } from "@/components/icons";
import type { Part } from "@/lib/plan";
import type { PreviewPlan } from "@/lib/preview";
import type { StepId, Version } from "@/lib/progress";
import { planCopy, reviewCopy, type StepWords } from "@/lib/steps";
import { ReviewFlow } from "./ReviewFlow";
import { TryBox } from "./TryBox";

const partIcons: Record<Part, typeof Shield> = { prevent: Shield, pause: PauseCircle, repair: Heart };

type TodayCardProps = {
  stepId: StepId;
  version: Version;
  words: StepWords;
  /** Prevent, Pause or Repair. */
  partName: string;
  /** The "For you two." line for their couple type and this part. */
  tip: string;
  /** The line for the answer they just gave, shown above this step until they answer again. */
  ack: string | null;
  /** Ask Did you try it? before showing the step. */
  reviewDue: boolean;
  agree: boolean;
  /** On four steps: the guided 10 minute repair, or the 20 minutes. */
  help: { href: string; label: string } | null;
  preview: PreviewPlan | null;
};

/**
 * Today's step: the situation, one useful idea, and one thing to try. Once it has been up long enough, it
 * opens on Did you try it? instead; they can also answer straight away.
 */
export function TodayCard({ stepId, version, words, partName, tip, ack, reviewDue, agree, help, preview }: TodayCardProps) {
  const [reviewing, setReviewing] = useState(reviewDue);
  const [tapped, setTapped] = useState(false);
  const Icon = partIcons[words.part];
  const alone = version === "alone" && words.alone;

  return (
    <div className="plan-now">
      {ack && !reviewing ? (
        <p className="plan-ack" role="status">
          {ack}
        </p>
      ) : null}
      {reviewing ? (
        <ReviewFlow stepId={stepId} version={version} title={words.title} agree={agree} preview={preview} openedByTap={tapped} />
      ) : (
        <section className="plan-today" aria-labelledby="today-title">
          <div className="plan-today-head">
            <p className="plan-today-label">Today’s step</p>
            <p className="plan-part">
              <Icon />
              {partName}
              {alone ? ` · ${planCopy.alone}` : null}
            </p>
          </div>
          <h2 id="today-title" className="plan-today-title">
            {words.title}
          </h2>
          <p className="plan-notice">{words.notice}</p>
          <TryBox tryWords={alone ? { kind: "do", text: words.alone ?? "" } : words.try} />
          {help ? (
            <Link href={help.href} className="btn btn-lg btn-quiet plan-help-link">
              {help.label}
            </Link>
          ) : null}
          <p className="plan-tip">
            <strong>For you two.</strong> {tip}
          </p>
          <button
            type="button"
            className="link-button plan-review-now"
            onClick={() => {
              setTapped(true);
              setReviewing(true);
            }}
          >
            {reviewCopy.now}
          </button>
        </section>
      )}
    </div>
  );
}
