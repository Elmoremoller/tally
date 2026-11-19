import type { ReactNode, RefObject } from "react";
import { Paywall } from "@/components/quiz/Paywall";
import { askFirstCopy, beginnerParts, beginnerPaywall, firstWinCopy, levelCopy, offerCopy } from "@/lib/beginner/copy";
import { fewHelp, offerTasks, orderMap, readAsResponsibilities, smootherCount } from "@/lib/beginner/free-result";
import { LEVELS } from "@/lib/beginner/recipes";
import { IDEAS_MIN, IDEAS_SHOWN, type FirstWin, type MapLine, type OfferItem } from "@/lib/beginner/types";
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
 * paywall. `restricted` adds a line for a company that restricts AI. From Phase 5 each row has its level tag, or
 * Waits for your company's OK in its place, and a short line when a rule held its level down; rows saved before
 * have neither. From Phase 8 a map read as responsibilities opens with how many parts of her week can run
 * smoother, puts what stays hers last with the reason, and her preview is one piece Tally will build for her. Only the
 * rows her offer names are tagged In your path with a With your path line; every other row says What could change,
 * so the map never suggests it is included (Karl, 2026-11-16).
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
  const responsibilities = readAsResponsibilities(rows);
  const heading = responsibilities
    ? firstWinCopy.smoother(smootherCount(rows))
    : rows.length < 2 || fewHelp(rows)
      ? firstWinCopy.fewHeading
      : firstWinCopy.heading(helps, rows.length);
  const inPath = new Set(responsibilities ? offerTasks(rows, firstWin.task).map((m) => m.task) : rows.map((m) => m.task));
  return (
    <div className="quiz-step quiz-reveal" data-dir="forward">
      <p className="quiz-eyebrow">{responsibilities ? firstWinCopy.weekEyebrow : firstWinCopy.eyebrow}</p>
      <h1 ref={headingRef} tabIndex={-1} className="quiz-moment win-intro">
        {heading}
      </h1>
      <ul className="win-map">
        {rows.map((m) => (
          <li key={m.task} data-ai={m.ai || undefined}>
            <div className="win-map-tags">
              {m.waits ? (
                <p className="win-map-level" data-level="waits">
                  {levelCopy.waits}
                </p>
              ) : m.level ? (
                <p className="win-map-level" data-level={m.level}>
                  <span className="sr-only">{levelCopy.levelLabel} </span>
                  {LEVELS[m.level]}
                </p>
              ) : null}
              {responsibilities && inPath.has(m.task) ? <p className="win-map-level win-map-in">{firstWinCopy.inPath}</p> : null}
            </div>
            <h2 className="win-map-task">{m.task}</h2>
            <dl className="win-map-lines">
              <div>
                <dt>{firstWinCopy.today}</dt>
                <dd>{m.today}</dd>
              </div>
              {m.stays ? null : (
                <div>
                  <dt>{inPath.has(m.task) ? firstWinCopy.withPath : firstWinCopy.couldChange}</dt>
                  <dd>{m.withPath}</dd>
                </div>
              )}
            </dl>
            {m.stays ? <p className="win-map-why">{levelCopy.stays[m.stays]}</p> : null}
            {m.held ? <p className="win-map-why">{levelCopy.held[m.held]}</p> : null}
            {m.askFirst ? <p className="win-map-why">{restricted ? levelCopy.askFirst : levelCopy.askFirstNotSure}</p> : null}
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
 * The beginner paywall: her own workflows by name, then a Starter's two prep steps under a short line, then the
 * line on the free plan when every recipe in her offer says it is enough. Without setups, for answers saved
 * before Phase 2, it shows the plan's five parts as it did. From Phase 8 (`offer`), each workflow lists the pieces
 * Tally builds for it, under one plain line on what she gets, and her path starts with a few questions.
 */
export function BeginnerPaywall({
  setups,
  offer,
  prep = [],
  freePlan = false,
}: {
  setups?: string[];
  offer?: OfferItem[];
  prep?: string[];
  freePlan?: boolean;
}) {
  if (offer?.length) {
    return (
      <Paywall title={beginnerPaywall.title} lead={offerCopy.whatYouGet(offer.length)}>
        <ol className="peek win-setups">
          {offer.map((item) => (
            <li key={item.name} className="peek-card">
              <h3 className="peek-title">{item.name}</h3>
              {item.pieces.length ? (
                <ul className="win-pieces">
                  {item.pieces.map((piece) => (
                    <li key={piece}>{piece}</li>
                  ))}
                </ul>
              ) : null}
            </li>
          ))}
        </ol>
        <p className="win-offer-line">{offerCopy.startsWithQuestions}</p>
        {prep.length ? (
          <div className="win-prep">
            <p className="win-prep-lead">{offerCopy.prepLead}</p>
            <ol className="win-prep-steps">
              {prep.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>
        ) : null}
        {freePlan ? <p className="quiz-type-text win-made">{beginnerPaywall.freePlan}</p> : null}
      </Paywall>
    );
  }
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
      {prep.length ? (
        <div className="win-prep">
          <p className="win-prep-lead">{offerCopy.prepLead}</p>
          <ol className="win-prep-steps">
            {prep.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>
      ) : null}
      {freePlan ? <p className="quiz-type-text win-made">{beginnerPaywall.freePlan}</p> : null}
    </Paywall>
  );
}

/**
 * In place of the paywall when her company restricts AI and every task on her map waits for its OK (Karl,
 * 2026-11-15): no price and no pay button. The message to ask what's allowed, free, and a line inviting her back.
 */
export function AskFirst({ message }: { message: string }) {
  return (
    <section className="ask-first" aria-labelledby="ask-first-title">
      <h2 id="ask-first-title" className="quiz-title ask-first-title">
        {askFirstCopy.title}
      </h2>
      <p className="quiz-type-text">{askFirstCopy.lead}</p>
      <figure className="plan-script">
        <p className="plan-script-label">{askFirstCopy.label}</p>
        <p className="plan-script-lead">{askFirstCopy.sendTo}</p>
        <blockquote className="win-draft">{message}</blockquote>
      </figure>
      <CopyButton words={message} />
      <p className="quiz-type-text win-made">{askFirstCopy.back}</p>
    </section>
  );
}
