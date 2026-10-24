"use client";

import type { MouseEvent, RefObject } from "react";
import { hotline, lifeline, QUICK_EXIT_URL, safetyHelp } from "@/lib/safety";

type SafetyHelpProps = {
  /** 1 when it is the whole screen, 3 inside the message check. */
  level?: 1 | 3;
  headingRef?: RefObject<HTMLHeadingElement | null>;
  /** Shows Go back, for a mis-tap on the question before it. */
  onBack?: () => void;
};

/**
 * The calm page: the National Domestic Violence Hotline, nothing to buy, and a quick way out. Shown after
 * Yes or Not sure to the safety question, and instead of a verdict when a message mentions fear or harm.
 */
export function SafetyHelp({ level = 1, headingRef, onBack }: SafetyHelpProps) {
  const Heading = level === 1 ? "h1" : "h3";
  const [beforeNumber, afterNumber] = safetyHelp.selfHarm.split("988");

  // Like the hotline's own quick exit: this page is replaced, so Back doesn't return to it.
  const leave = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    window.location.replace(QUICK_EXIT_URL);
  };

  return (
    <div className="safety" data-level={level}>
      <a className="safety-exit" href={QUICK_EXIT_URL} onClick={leave}>
        {safetyHelp.leave}
      </a>
      <Heading ref={headingRef} tabIndex={-1} className="safety-title">
        {safetyHelp.title}
      </Heading>
      <p className="safety-text">{safetyHelp.text}</p>
      <div className="safety-actions">
        <a className="btn btn-lg" href={hotline.call}>
          {safetyHelp.call}
        </a>
        <a className="btn btn-lg btn-quiet" href={hotline.text}>
          {safetyHelp.textMessage}
        </a>
        <a className="btn btn-lg btn-quiet" href={hotline.chat} target="_blank" rel="noopener noreferrer">
          {safetyHelp.chat}
        </a>
      </div>
      <p className="safety-note">{safetyHelp.notForThis}</p>
      <p className="safety-note">
        {beforeNumber}
        <a href={lifeline}>988</a>
        {afterNumber}
      </p>
      {onBack ? (
        <button type="button" className="link-button safety-back" onClick={onBack}>
          {safetyHelp.back}
        </button>
      ) : null}
    </div>
  );
}
