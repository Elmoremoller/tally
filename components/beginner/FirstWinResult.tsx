import type { ReactNode, RefObject } from "react";
import { Paywall } from "@/components/quiz/Paywall";
import { beginnerParts, beginnerPaywall, firstWinCopy } from "@/lib/beginner/copy";
import { fewHelp, orderMap } from "@/lib/beginner/free-result";
import { IDEAS_MIN, IDEAS_SHOWN, type FirstWin, type MapLine } from "@/lib/beginner/types";
import { CopyButton } from "./CopyButton";
import { SeeIt } from "./SeeIt";

/**
 * What the free result shows. Answers saved before Phase 2 of docs/DIRECTION.md have no map, only idea
 * titles; they still load, and show as they first did.
 */
export type ShownResult = {
  firstWin: FirstWin;
  map?: MapLine[];
  ideas?: string[];
};

/**
 * The beginner version's free result (docs/DIRECTION.md, section 3): it opens with the map of her week under a
 * line on how many of her tasks AI can help with, each task with where she is today and what changes with her
 * path. Her finished result sits behind See it in the top row. Then the offer, which is `children`: the
 * paywall. `restricted` adds a line for a company that restricts AI.
 */
export function FirstWinResult({
  result,
  restricted,
  headingRef,
  children,
}: {
  result: ShownResult;
  restricted: boolean;
  headingRef?: RefObject<HTMLHeadingElement | null>;
  children?: ReactNode;
}) {
  const { firstWin, map = [] } = result;
  if (!map.length) return <LegacyResult {...{ result, restricted, headingRef, children }} />;

  const rows = orderMap(map, firstWin.task);
  const helps = rows.filter((m) => m.ai).length;
  const heading = rows.length < 2 || fewHelp(rows) ? firstWinCopy.fewHeading : firstWinCopy.heading(helps, rows.length);
  return (
    <div className="quiz-step quiz-reveal" data-dir="forward">
      <p className="quiz-eyebrow">{firstWinCopy.eyebrow}</p>
      <h1 ref={headingRef} tabIndex={-1} className="quiz-moment win-intro">
        {heading}
      </h1>
      <ul className="win-map">
        {rows.map((m) => (
          <li key={m.task} data-ai={m.ai || undefined}>
            <h2 className="win-map-task">{m.task}</h2>
            <dl className="win-map-lines">
              <div>
                <dt>{firstWinCopy.today}</dt>
                <dd>{m.today}</dd>
              </div>
              <div>
                <dt>{firstWinCopy.withPath}</dt>
                <dd>{m.withPath}</dd>
              </div>
            </dl>
            {m.task === firstWin.task ? <SeeIt firstWin={firstWin} /> : null}
          </li>
        ))}
      </ul>
      {restricted ? <p className="plan-ack win-note">{firstWinCopy.restricted}</p> : null}
      {children}
    </div>
  );
}

/** Her free result as answers saved before Phase 2 show it: her first win on top, then idea titles. */
function LegacyResult({
  result,
  restricted,
  headingRef,
  children,
}: {
  result: ShownResult;
  restricted: boolean;
  headingRef?: RefObject<HTMLHeadingElement | null>;
  children?: ReactNode;
}) {
  const { firstWin, ideas = [] } = result;
  const shown = ideas.slice(0, IDEAS_SHOWN);
  return (
    <div className="quiz-step quiz-reveal" data-dir="forward">
      <p className="quiz-eyebrow">{firstWinCopy.legacyEyebrow}</p>
      <h1 ref={headingRef} tabIndex={-1} className="quiz-moment win-intro">
        {firstWin.intro}
      </h1>
      <blockquote className="win-draft">{firstWin.draft}</blockquote>
      <CopyButton words={firstWin.draft} />
      <p className="quiz-type-text win-made">{firstWinCopy.made}</p>
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

/**
 * The beginner paywall: her own setups by name. The line on her tool's free plan waits for Phase 4, which
 * reads it from the setup cards. Without setups, for answers saved before Phase 2, it shows the plan's five
 * parts as it did.
 */
export function BeginnerPaywall({ setups }: { setups?: string[] }) {
  if (!setups?.length) {
    return (
      <Paywall title={beginnerPaywall.title} lead={beginnerPaywall.legacyLead}>
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
  return (
    <Paywall title={beginnerPaywall.title} lead={beginnerPaywall.lead}>
      <ol className="peek win-setups">
        {setups.map((setup) => (
          <li key={setup} className="peek-card">
            <h3 className="peek-title">{setup}</h3>
          </li>
        ))}
      </ol>
    </Paywall>
  );
}
