"use client";

import { useEffect, useRef, useState } from "react";
import { reflectOnReview, submitReview } from "@/app/plan/actions";
import { ArrowRight, Check } from "@/components/icons";
import { SafetyHelp } from "@/components/SafetyHelp";
import type { PreviewPlan } from "@/lib/preview";
import { AGREEMENT_MAX, LINE_MAX, OUTCOMES, type Outcome, type StepId, type Version } from "@/lib/progress";
import { readingLine, reflectionCopy, storyQuestion } from "@/lib/quiz";
import { reviewCopy } from "@/lib/steps";
import { FitTextarea } from "./FitTextarea";

type Stage = "ask" | "agree" | "line" | "reading" | "heard" | "safety";

type ReviewFlowProps = {
  stepId: StepId;
  version: Version;
  /** The step's title, under Your last step. */
  title: string;
  /** One of the five steps where they agree on something together. */
  agree: boolean;
  /** Set on /plan/preview, where nothing is saved. */
  preview: PreviewPlan | null;
  /** Opened with Tried it? from further down the card, so it scrolls up to the question. */
  openedByTap?: boolean;
};

/**
 * Did you try it?, the four answers, and what comes after: on an agree step, what they agreed on; then an
 * optional line about what happened, read back to them. Saving it opens the step their answer leads to.
 */
export function ReviewFlow({ stepId, version, title, agree, preview, openedByTap = false }: ReviewFlowProps) {
  const [stage, setStage] = useState<Stage>("ask");
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [agreement, setAgreement] = useState("");
  const [line, setLine] = useState("");
  const [bullets, setBullets] = useState<string[]>([]);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const headingRef = useRef<HTMLHeadingElement>(null);
  const moved = useRef(openedByTap);

  // After each screen, bring its question into view and put focus on it, so it is seen and announced.
  // Each screen is a different height, so without this the question could sit above the screen.
  useEffect(() => {
    if (!moved.current) return;
    headingRef.current?.scrollIntoView({ block: "nearest" });
    headingRef.current?.focus({ preventScroll: true });
  }, [stage]);

  const to = (next: Stage) => {
    moved.current = true;
    setStage(next);
  };

  const choose = (answer: Outcome) => {
    setOutcome(answer);
    to(answer === "helped" && agree ? "agree" : "line");
  };

  const send = async (withLine: string | null, withBullets: string[] | null) => {
    if (!outcome || pending) return;
    setPending(true);
    setError("");
    const result = await submitReview({
      stepId,
      version,
      outcome,
      line: withLine,
      bullets: withBullets,
      agreement: agreement.trim() || null,
      preview,
    }).catch(() => ({ error: "Something went wrong. Please try again in a minute." }));
    // On success the page moves on to the next step; only an error comes back here.
    if (result?.error) {
      setError(result.error);
      setPending(false);
    }
  };

  const read = async () => {
    const text = line.trim();
    if (!text) return;
    to("reading");
    const result = await reflectOnReview({ line: text, stepTitle: title, preview: Boolean(preview) }).catch(() => null);
    if (result?.safety) return to("safety");
    if (!result) return send(text, null);
    setBullets(result.bullets);
    to("heard");
  };

  const errorLine = error ? (
    <p className="quiz-error" role="alert">
      {error}
    </p>
  ) : null;

  if (stage === "safety") {
    return (
      <section className="plan-today" aria-label={reviewCopy.question}>
        <SafetyHelp level={3} headingRef={headingRef} onBack={() => to("line")} />
      </section>
    );
  }

  if (stage === "reading") {
    return (
      <section className="plan-today step-review-reading" role="status">
        <span className="quiz-spinner" aria-hidden="true" />
        <h2 ref={headingRef} tabIndex={-1} className="plan-today-title">
          {readingLine}
        </h2>
      </section>
    );
  }

  if (stage === "heard") {
    return (
      <section className="plan-today" aria-labelledby="review-title">
        <h2 ref={headingRef} tabIndex={-1} id="review-title" className="plan-today-title">
          {reflectionCopy.title}
        </h2>
        <ul className="quiz-heard step-review-heard">
          {bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
        <button type="button" className="btn btn-lg" disabled={pending} onClick={() => send(line.trim(), bullets)}>
          Continue
          <ArrowRight />
        </button>
        {errorLine}
      </section>
    );
  }

  if (stage === "agree" || stage === "line") {
    const isAgree = stage === "agree";
    return (
      <section className="plan-today" aria-labelledby="review-title">
        <h2 ref={headingRef} tabIndex={-1} id="review-title" className="plan-today-title">
          {isAgree ? reviewCopy.agree : reviewCopy.line}
        </h2>
        {isAgree ? (
          <>
            <p className="plan-section-text" id="agree-hint">
              {reviewCopy.agreeHint}
            </p>
            <FitTextarea
              className="quiz-story step-review-agree"
              aria-labelledby="review-title"
              aria-describedby="agree-hint"
              rows={1}
              maxLength={AGREEMENT_MAX}
              value={agreement}
              onChange={(e) => setAgreement(e.target.value)}
            />
            <button type="button" className="btn btn-lg" disabled={!agreement.trim()} onClick={() => to("line")}>
              {reviewCopy.save}
            </button>
          </>
        ) : (
          <>
            <textarea
              className="quiz-story step-review-line"
              aria-labelledby="review-title"
              rows={3}
              maxLength={LINE_MAX}
              value={line}
              onChange={(e) => setLine(e.target.value)}
            />
            <button type="button" className="btn btn-lg" disabled={!line.trim() || pending} onClick={read}>
              Continue
              <ArrowRight />
            </button>
          </>
        )}
        <button
          type="button"
          className="link-button quiz-skip"
          disabled={pending}
          onClick={() => {
            if (isAgree) {
              setAgreement("");
              to("line");
            } else {
              send(null, null);
            }
          }}
        >
          {storyQuestion.skip}
        </button>
        {errorLine}
      </section>
    );
  }

  return (
    <section className="plan-today" aria-labelledby="review-title">
      <div>
        <p className="plan-today-label">{reviewCopy.lastStep}</p>
        <p className="step-review-step">{title}</p>
      </div>
      <h2 ref={headingRef} tabIndex={-1} id="review-title" className="plan-today-title">
        {reviewCopy.question}
      </h2>
      <div className="quiz-choices step-review-answers" role="group" aria-labelledby="review-title">
        {OUTCOMES.map((answer) => (
          <button
            key={answer}
            type="button"
            className="quiz-choice"
            aria-pressed={outcome === answer}
            onClick={() => choose(answer)}
          >
            <span>{reviewCopy.outcomes[answer]}</span>
            <span className="quiz-tick" aria-hidden="true">
              <Check />
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
