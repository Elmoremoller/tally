import type { ReactNode, RefObject } from "react";
import { Paywall } from "@/components/quiz/Paywall";
import { beginnerParts, beginnerPaywall, firstWinCopy } from "@/lib/beginner/copy";
import { IDEAS_MIN, IDEAS_SHOWN, type FirstWin, type MapLine } from "@/lib/beginner/types";
import { toolLabels, type ChatTool } from "@/lib/week";
import { CopyButton } from "./CopyButton";

/**
 * What the free result shows. Answers saved before Phase 2 of docs/DIRECTION.md have no first step or map,
 * only idea titles; they still load, and show those titles in place of both.
 */
export type ShownResult = {
  firstWin: FirstWin;
  firstStep?: string | null;
  map?: MapLine[];
  tool?: ChatTool;
  ideas?: string[];
};

/**
 * The beginner version's free result, in the four parts of docs/DIRECTION.md, section 3: her finished result
 * with a Copy button, her first step (the message that makes the next one), the map of her week, then the
 * offer, which is `children`: the paywall. `restricted` adds a line for a company that restricts AI.
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
  const { firstWin, firstStep, map = [], tool = "claude", ideas = [] } = result;
  const shownIdeas = firstStep ? [] : ideas.slice(0, IDEAS_SHOWN);
  return (
    <div className="quiz-step quiz-reveal" data-dir="forward">
      <p className="quiz-eyebrow">{firstWinCopy.eyebrow}</p>
      <h1 ref={headingRef} tabIndex={-1} className="quiz-moment win-intro">
        {firstWin.intro}
      </h1>
      <blockquote className="win-draft">{firstWin.draft}</blockquote>
      <CopyButton words={firstWin.draft} />
      <p className="quiz-type-text win-made">{firstWinCopy.made}</p>
      {restricted ? <p className="plan-ack win-note">{firstWinCopy.restricted}</p> : null}

      {firstStep ? (
        <section className="win-part" aria-labelledby="win-step-title">
          <h2 id="win-step-title" className="win-part-title">
            {firstWinCopy.stepTitle}
          </h2>
          <p className="win-part-lead">{firstWinCopy.stepLead(toolLabels[tool])}</p>
          <blockquote className="win-draft win-step">{firstStep}</blockquote>
          <CopyButton words={firstStep} quiet />
        </section>
      ) : null}

      {map.length ? (
        <section className="win-part" aria-labelledby="win-map-title">
          <h2 id="win-map-title" className="win-part-title">
            {firstWinCopy.mapTitle}
          </h2>
          <ul className="win-map">
            {map.map((m) => (
              <li key={m.task}>
                <strong>{m.task}</strong>
                <span>{m.line}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {shownIdeas.length ? (
        <div className="quiz-built">
          <p>{firstWinCopy.also}</p>
          <ul>
            {shownIdeas.map((idea) => (
              <li key={idea}>{idea}</li>
            ))}
            <li>{firstWinCopy.more(IDEAS_MIN - shownIdeas.length)}</li>
          </ul>
        </div>
      ) : null}
      {children}
    </div>
  );
}

/**
 * The beginner paywall: her own setups by name, her tool and whether its free plan is enough. Without setups,
 * for answers saved before Phase 2, it shows the plan's five parts as it did.
 */
export function BeginnerPaywall({ setups, tool }: { setups?: string[]; tool?: ChatTool }) {
  if (!setups?.length || !tool) {
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
      <p className="win-tool">{beginnerPaywall.toolLine(toolLabels[tool])}</p>
    </Paywall>
  );
}
