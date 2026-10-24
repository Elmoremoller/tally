"use client";

import { useActionState } from "react";
import { checkMessage } from "@/app/plan/actions";
import { ArrowRight } from "@/components/icons";
import { SafetyHelp } from "@/components/SafetyHelp";
import { checkCopy } from "@/lib/message-check-copy";
import { SayBox } from "./SayBox";

/**
 * Check a message before you send it: how it might read, the words that could sound like blame, what
 * they're asking for underneath, and a version that keeps their point, which they can change and copy.
 */
export function MessageCheck({ preview, partner }: { preview?: string; partner: string }) {
  const [state, action, pending] = useActionState(checkMessage, null);
  const review = state && "verdict" in state ? state : null;

  return (
    <div className="plan-check">
      <form action={action} className="plan-check-form">
        {preview ? <input type="hidden" name="preview" value={preview} /> : null}
        <label className="sr-only" htmlFor="message">
          The message you want to send
        </label>
        <textarea id="message" name="message" rows={4} maxLength={2000} placeholder="Paste or type the message" required />
        <button type="submit" className="btn btn-lg" disabled={pending}>
          {pending ? "Reading it" : "Check my message"}
          {pending ? null : <ArrowRight />}
        </button>
      </form>
      <div aria-live="polite">
        {state?.error ? (
          <p className="quiz-error" role="alert">
            {state.error}
          </p>
        ) : null}
        {review?.safety ? (
          // A message about fear or harm gets the hotline instead of a verdict.
          <div className="plan-review" data-verdict="safety">
            <SafetyHelp level={3} />
          </div>
        ) : review ? (
          <div className="plan-review" data-verdict={review.verdict}>
            <p className="plan-review-verdict">{checkCopy.verdicts[review.verdict]}</p>
            <div className="plan-review-part">
              <p className="plan-review-label">{checkCopy.read}</p>
              <p>{review.read}</p>
            </div>
            {review.flags.length ? (
              <div className="plan-review-part">
                <p className="plan-review-label">{checkCopy.flags}</p>
                <ul className="plan-review-flags">
                  {review.flags.map((flag) => (
                    <li key={flag.words}>
                      <span className="plan-review-quote">“{flag.words}”</span>
                      <span className="plan-review-why">{flag.why}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            {review.request ? (
              <div className="plan-review-part">
                <p className="plan-review-label">{checkCopy.request}</p>
                <blockquote>{review.request}</blockquote>
              </div>
            ) : null}
            {review.verdict !== "send" && review.version ? (
              <div className="plan-review-suggestion">
                <p className="plan-review-label">{checkCopy.version[review.verdict]}</p>
                {/* A new answer brings its own words, even if the last one was edited. */}
                <SayBox key={review.version} words={review.version} copyLabel={checkCopy.copy} />
              </div>
            ) : null}
            <p className="plan-review-note">{checkCopy.note(partner)}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
