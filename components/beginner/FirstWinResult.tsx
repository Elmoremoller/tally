import type { ReactNode, RefObject } from "react";
import { Paywall } from "@/components/quiz/Paywall";
import { beginnerParts, beginnerPaywall, firstWinCopy } from "@/lib/beginner/copy";
import { IDEAS_MIN, IDEAS_SHOWN, type FirstWin } from "@/lib/beginner/types";

/**
 * The beginner version's free result: one task from her week, already drafted, then the titles of a few
 * more things her plan holds. `restricted` adds a line for a company that restricts AI. `children` is what
 * comes after it, the paywall.
 */
export function FirstWinResult({
  firstWin,
  ideas,
  restricted,
  headingRef,
  children,
}: {
  firstWin: FirstWin;
  ideas: string[];
  restricted: boolean;
  headingRef?: RefObject<HTMLHeadingElement | null>;
  children?: ReactNode;
}) {
  const shown = ideas.slice(0, IDEAS_SHOWN);
  return (
    <div className="quiz-step quiz-reveal" data-dir="forward">
      <p className="quiz-eyebrow">{firstWinCopy.eyebrow}</p>
      <h1 ref={headingRef} tabIndex={-1} className="quiz-moment win-intro">
        {firstWin.intro}
      </h1>
      <blockquote className="win-draft">{firstWin.draft}</blockquote>
      <p className="quiz-type-text">{firstWinCopy.made}</p>
      {restricted ? <p className="plan-ack win-note">{firstWinCopy.restricted}</p> : null}
      {shown.length ? (
        <div className="quiz-built">
          <p>{firstWinCopy.also}</p>
          <ul>
            {shown.map((idea) => (
              <li key={idea}>{idea}</li>
            ))}
            <li>{firstWinCopy.more(IDEAS_MIN - shown.length)}</li>
          </ul>
        </div>
      ) : null}
      {children}
    </div>
  );
}

/** The beginner paywall: its own headline, and the plan's five parts in place of the first version's preview. */
export function BeginnerPaywall() {
  return (
    <Paywall title={beginnerPaywall.title} lead={beginnerPaywall.lead}>
      <ol className="peek">
        {beginnerParts.parts.map((part) => (
          <li key={part.id} className="peek-card">
            <h3 className="peek-part">{part.title}</h3>
            <p className="peek-text">{part.text}</p>
          </li>
        ))}
      </ol>
    </Paywall>
  );
}
