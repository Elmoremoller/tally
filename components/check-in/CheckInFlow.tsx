"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { saveCheckIn, type LineState } from "@/app/plan/actions";
import { FightHelpBox } from "@/components/fight-help/FightHelpBox";
import { ArrowLeft, ArrowRight, Check } from "@/components/icons";
import { ChoiceStep } from "@/components/quiz/ChoiceStep";
import { SafetyHelp } from "@/components/SafetyHelp";
import { checkInCopy as copy, NOTE_MAX, QUOTE_MAX, singleQuestions, usedChoices, type CheckInId } from "@/lib/check-ins";
import { helpCopy } from "@/lib/fight-help";
import { storyQuestion, topicsQuestion } from "@/lib/quiz";
import { mentionsHarm } from "@/lib/safety";

type CheckInFlowProps = {
  id: CheckInId;
  planHref: string;
  /** The help after a fight, offered at the end when it's been harder. */
  nowHref: string;
  /** On the preview, the answers go nowhere. */
  preview: boolean;
  /** Whether to ask what they'd tell another couple: only once the database can save it. */
  askQuote: boolean;
};

const SOMETHING_WRONG = "Something went wrong. Please try again in a minute.";
/** Lets a tapped answer light up for a moment before the next question, as in the quiz. */
const ADVANCE_DELAY = 260;

type Screen = "used" | "quote" | "note" | (typeof singleQuestions)["start" | "later"][number]["key"];
const screensFor = (id: CheckInId, askQuote: boolean): Screen[] =>
  id === "start"
    ? singleQuestions.start.map((q) => q.key)
    : ["used", ...singleQuestions.later.map((q) => q.key), ...(askQuote ? (["quote"] as const) : []), "note"];

/**
 * A check in, one question at a time like the quiz: a single answer moves on by itself, Back goes to the
 * one before. Two weeks in and a month in end with what they'd tell another couple (with a box to tick if
 * we may show it on the website) and a box for anything else. Either shows the hotline instead when it
 * mentions fear or harm.
 */
export function CheckInFlow({ id, planHref, nowHref, preview, askQuote }: CheckInFlowProps) {
  const screens = screensFor(id, askQuote);
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [picked, setPicked] = useState<Partial<Record<Screen, string>>>({});
  const [used, setUsed] = useState<string[]>([]);
  const [notYet, setNotYet] = useState(false);
  const [quote, setQuote] = useState("");
  const [showQuote, setShowQuote] = useState(false);
  const [note, setNote] = useState("");
  const [advancing, setAdvancing] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [safety, setSafety] = useState(false);
  const [done, setDone] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const moved = useRef(false);
  const titleId = useId();
  const hintId = useId();

  // After moving to a new screen, put focus on its question so screen readers announce it.
  useEffect(() => {
    if (moved.current) headingRef.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0 });
  }, [step, safety, done]);

  const go = (to: number) => {
    moved.current = true;
    setDirection(to > step ? "forward" : "back");
    setStep(to);
    setError("");
  };

  const finish = async (answers: Record<string, unknown>) => {
    if (pending) return;
    if ([answers.note, answers.quote].some((text) => typeof text === "string" && mentionsHarm(text))) {
      moved.current = true;
      setSafety(true);
      return;
    }
    setPending(true);
    setError("");
    const result: LineState = preview
      ? null
      : await saveCheckIn({ checkIn: id, answers }).catch(() => ({ error: SOMETHING_WRONG }));
    setPending(false);
    moved.current = true;
    if (result && "safety" in result) setSafety(true);
    else if (result) setError(result.error);
    else setDone(true);
  };

  const later = (noteText: string) => ({
    ...picked,
    used: notYet ? [] : used,
    quote: quote.trim(),
    showQuote: showQuote && Boolean(quote.trim()),
    note: noteText,
  });

  const skipQuote = () => {
    setQuote("");
    setShowQuote(false);
    go(step + 1);
  };

  const choose = (key: Screen, value: string) => {
    if (advancing || pending) return;
    const next = { ...picked, [key]: value };
    setPicked(next);
    setAdvancing(true);
    window.setTimeout(() => {
      setAdvancing(false);
      if (step === screens.length - 1) finish(next);
      else go(step + 1);
    }, ADVANCE_DELAY);
  };

  const toggle = (tool: string) => {
    setNotYet(false);
    setUsed((current) => (current.includes(tool) ? current.filter((t) => t !== tool) : [...current, tool]));
  };
  const chooseNotYet = () => {
    setNotYet((on) => !on);
    setUsed([]);
  };

  const send = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (note.trim()) finish(later(note.trim()));
  };

  const errorLine = error ? (
    <p className="quiz-error" role="alert">
      {error}
    </p>
  ) : null;

  if (done) {
    const harder = picked.last === "worse" || picked.moreHeard === "less";
    return (
      <div className="checkin">
        <div className="quiz-step checkin-done">
          <h1 ref={headingRef} tabIndex={-1} className="quiz-title">
            {copy.thanks[id]}
          </h1>
          <p className="quiz-hint">{copy.helps}</p>
          <Link href={planHref} className="btn btn-lg checkin-back">
            {helpCopy.backToPlan}
          </Link>
          {harder ? <FightHelpBox href={nowHref} /> : null}
        </div>
      </div>
    );
  }

  const screen = screens[step];
  const single = [...singleQuestions.start, ...singleQuestions.later].find((q) => q.key === screen);

  return (
    <div className="checkin">
      <Link href={planHref} className="help-back">
        <ArrowLeft />
        {helpCopy.backToPlan}
      </Link>
      {safety ? (
        <div key="safety" className="quiz-step" data-dir="forward">
          <SafetyHelp
            headingRef={headingRef}
            onBack={() => {
              moved.current = true;
              setSafety(false);
            }}
          />
        </div>
      ) : (
        <>
          <div className="checkin-head">
            {step > 0 ? (
              <button type="button" className="quiz-back" aria-label="Back" onClick={() => go(step - 1)}>
                <ArrowLeft />
              </button>
            ) : null}
            <div className="checkin-progress" aria-hidden="true">
              <span style={{ transform: `scaleX(${Math.max(step / screens.length, 0.04)})` }} />
            </div>
          </div>
          <div key={step} className="quiz-step" data-dir={direction}>
            <p className="sr-only">
              Question {step + 1} of {screens.length}
            </p>
            {single ? (
              <ChoiceStep
                title={single.title}
                choices={single.choices}
                picked={picked[single.key]}
                onChoose={(value) => choose(single.key, value)}
                headingRef={headingRef}
                titleId={titleId}
              />
            ) : screen === "used" ? (
              <>
                <h1 ref={headingRef} tabIndex={-1} className="quiz-title" id={titleId}>
                  {copy.used.title}
                </h1>
                <p className="quiz-hint">{topicsQuestion.hint}</p>
                <fieldset className="quiz-topics" aria-labelledby={titleId}>
                  {usedChoices.map((tool) => {
                    const on = used.includes(tool.id);
                    return (
                      <label key={tool.id} className="quiz-topic" data-on={on || undefined}>
                        <input type="checkbox" className="sr-only" checked={on} onChange={() => toggle(tool.id)} />
                        {on ? <Check /> : null}
                        {tool.label}
                      </label>
                    );
                  })}
                  {/* Not yet is instead of the others, so it starts a line of its own. */}
                  <span className="checkin-break" aria-hidden="true" />
                  <label className="quiz-topic" data-on={notYet || undefined}>
                    <input type="checkbox" className="sr-only" checked={notYet} onChange={chooseNotYet} />
                    {notYet ? <Check /> : null}
                    {copy.used.notYet}
                  </label>
                </fieldset>
                <button type="button" className="btn btn-lg quiz-next" disabled={!notYet && !used.length} onClick={() => go(step + 1)}>
                  Continue
                  <ArrowRight />
                </button>
              </>
            ) : screen === "quote" ? (
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  if (quote.trim()) go(step + 1);
                }}
              >
                <h1 ref={headingRef} tabIndex={-1} className="quiz-title" id={titleId}>
                  {copy.quote.title}
                </h1>
                <p className="quiz-hint" id={hintId}>
                  {copy.note.hint}
                </p>
                <div className="quiz-fields">
                  <textarea
                    className="quiz-story"
                    aria-labelledby={titleId}
                    aria-describedby={hintId}
                    rows={4}
                    maxLength={QUOTE_MAX}
                    value={quote}
                    onChange={(e) => setQuote(e.target.value)}
                  />
                  <label className="checkin-consent">
                    <input type="checkbox" checked={showQuote} onChange={(e) => setShowQuote(e.target.checked)} />
                    {copy.quote.show}
                  </label>
                </div>
                <button type="submit" className="btn btn-lg quiz-next" disabled={!quote.trim()}>
                  Continue
                  <ArrowRight />
                </button>
                <button type="button" className="link-button quiz-skip" onClick={skipQuote}>
                  {storyQuestion.skip}
                </button>
              </form>
            ) : (
              <form onSubmit={send}>
                <h1 ref={headingRef} tabIndex={-1} className="quiz-title" id={titleId}>
                  {copy.note.title}
                </h1>
                <p className="quiz-hint" id={hintId}>
                  {copy.note.hint}
                </p>
                <div className="quiz-fields">
                  <textarea
                    className="quiz-story"
                    aria-labelledby={titleId}
                    aria-describedby={hintId}
                    rows={4}
                    maxLength={NOTE_MAX}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn btn-lg quiz-next" disabled={!note.trim() || pending}>
                  {copy.note.send}
                  <ArrowRight />
                </button>
                <button type="button" className="link-button quiz-skip" disabled={pending} onClick={() => finish(later(""))}>
                  {storyQuestion.skip}
                </button>
              </form>
            )}
            {errorLine}
          </div>
        </>
      )}
    </div>
  );
}
