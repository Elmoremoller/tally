"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, Check, PauseBars, Play } from "@/components/icons";
import { FitTextarea } from "@/components/plan/FitTextarea";
import { TryBox } from "@/components/plan/TryBox";
import { SafetyHelp } from "@/components/SafetyHelp";
import {
  backAt,
  clockTime,
  helpCopy as copy,
  PART_MS,
  PARTS,
  PAUSE_MS,
  type AgreeResult,
  type HelpNames,
  type HelpStart,
  type Who,
} from "@/lib/fight-help";
import { AGREEMENT_MAX } from "@/lib/progress";
import { storyQuestion } from "@/lib/quiz";
import { hotline, mentionsHarm } from "@/lib/safety";
import { planCopy, reviewCopy } from "@/lib/steps";
import {
  clearPause,
  clearRepair,
  forgetOld,
  PAUSE_ASKS_FOR,
  pauseRunning,
  saveRepair,
  startPause,
  useNow,
  usePauseUntil,
  useSavedRepair,
} from "./store";

/** Saves what they agreed at the end of the repair. Null on the previews, where nothing is saved. */
export type SaveAgreement = ((text: string) => Promise<AgreeResult>) | null;

type PartScreen = { name: "part"; part: number; first: Who };
export type HelpScreen =
  | { name: "how" }
  | { name: "calm"; time: string; kept: boolean }
  | { name: "pause" }
  | { name: "later" }
  | { name: "laterDone" }
  | { name: "makeUp" }
  | { name: "notReady" }
  | { name: "repair" }
  | PartScreen
  | { name: "stopped" }
  | { name: "repaired" }
  | { name: "review" }
  | { name: "question"; index: number }
  | { name: "noticed" }
  | { name: "safety"; back: HelpScreen };

type FightHelpProps = {
  names: HelpNames;
  /** The first screen when nothing is under way. */
  entry: HelpScreen;
  /** Opened from a step's button, or to pick up a stopped repair. */
  go?: HelpStart | null;
  /** On the plan, where Back to my plan goes. Right after paying there's no plan to go to, so Back and Done call these. */
  planHref?: string;
  onBack?: () => void;
  onDone?: () => void;
  save: SaveAgreement;
  /** Focus the first screen's title, when the help opened because they tapped something. */
  focusFirst?: boolean;
};

const other = (who: Who): Who => (who === "me" ? "partner" : "me");
const SOMETHING_WRONG = "Something went wrong. Please try again in a minute.";
const ANSWER_MAX = 1000;

/**
 * Help for right after a fight: calming down first while it's still heated, then starting to make up, the
 * guided 10 minute repair, and looking back on it on your own. Only the timers and where a repair stopped
 * are kept, on this phone. What they write in the self review is never saved or sent anywhere.
 */
export function FightHelp(props: FightHelpProps) {
  // Next keeps a page they've left, for the back button. Opening the help from a link starts it fresh;
  // coming back with the back button still finds it where they were.
  const { bfcacheId } = useRouter();
  return <Flow key={bfcacheId} {...props} />;
}

function Flow({ names, entry, go = null, planHref, onBack, onDone, save, focusFirst = false }: FightHelpProps) {
  const now = useNow();
  const pause = usePauseUntil();
  const saved = useSavedRepair();
  const [screen, setScreen] = useState<HelpScreen | null>(null);
  const [clock, setClock] = useState<{ startedAt: number | null; spent: number }>({ startedAt: null, spent: 0 });
  const [agreement, setAgreement] = useState("");
  const [answers, setAnswers] = useState(["", "", "", "", ""]);
  const [feelings, setFeelings] = useState<string[]>([]);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  // Ids from React, so a copy of this page kept hidden after moving on never shares them.
  const id = useId();
  const ids = { title: `${id}title`, who: `${id}who`, agree: `${id}agree`, agreeHint: `${id}agree-hint`, hint: `${id}hint` };
  const moved = useRef(focusFirst);

  // Before they tap anything: the 20 minutes while they run, and for a while after, so closing the page
  // never loses them. Otherwise what they came for.
  let shown: HelpScreen = entry;
  if (screen) shown = screen;
  else if (now && pause && now - pause < PAUSE_ASKS_FOR) shown = { name: "pause" };
  else if (go === "pause") shown = { name: "pause" };
  else if (go === "repair") shown = { name: "repair" };
  else if (go === "resume" && saved) shown = { name: "part", part: saved.part, first: saved.first };

  const ended = shown.name === "pause" && pause !== null && now > 0 && now >= pause;
  const key =
    shown.name === "part"
      ? `part-${shown.part}`
      : shown.name === "question"
        ? `question-${shown.index}`
        : shown.name === "pause"
          ? `pause-${ended}`
          : shown.name;

  // Once: let go of old timers, start the 20 minutes when a step's button asked for them, and take go= out
  // of the address, so reloading doesn't start them again.
  useEffect(() => {
    forgetOld();
    if (go === "pause" && !pauseRunning()) startPause();
    const url = new URL(window.location.href);
    if (url.searchParams.has("go")) {
      url.searchParams.delete("go");
      window.history.replaceState(null, "", url);
    }
  }, [go]);

  // What they wrote looking back on their own goes as soon as they leave this page, even though the page
  // itself is kept for the back button.
  useLayoutEffect(
    () => () => {
      setAnswers(["", "", "", "", ""]);
      setFeelings([]);
      setScreen((s) => (s && (s.name === "review" || s.name === "question" || s.name === "noticed") ? null : s));
    },
    [],
  );

  // Each screen replaces the last, so it starts at the top with its title focused, and announced.
  useEffect(() => {
    if (!moved.current) return;
    window.scrollTo({ top: 0 });
    headingRef.current?.focus({ preventScroll: true });
  }, [key]);

  const to = (next: HelpScreen) => {
    moved.current = true;
    setError("");
    setScreen(next);
  };
  const calmDown = (kept = false) => to({ name: "calm", time: backAt(new Date()), kept });
  const startTwenty = () => {
    if (!pauseRunning()) startPause();
    to({ name: "pause" });
  };
  const twentyMore = () => {
    startPause();
    to({ name: "pause" });
  };
  const openPart = (part: number, first: Who, running = true) => {
    setClock({ startedAt: running ? Date.now() : null, spent: 0 });
    saveRepair(part, first);
    to({ name: "part", part, first });
  };
  const calmer = () => {
    clearPause();
    // Back to the repair they stopped for the 20 minutes, where they were.
    if (saved?.heated) openPart(saved.part, saved.first, false);
    else to({ name: "makeUp" });
  };
  const stillHeated = () => {
    clearPause();
    to({ name: "later" });
  };
  const pausePart = () =>
    setClock((c) => (c.startedAt === null ? c : { startedAt: null, spent: c.spent + Date.now() - c.startedAt }));
  const resumePart = () => setClock((c) => ({ ...c, startedAt: Date.now() }));
  const finishRepair = () => {
    clearRepair();
    setAgreement("");
    to({ name: "repaired" });
  };
  const saveAgreement = async (at: PartScreen) => {
    const text = agreement.trim();
    if (!text || pending) return;
    if (mentionsHarm(text)) return to({ name: "safety", back: at });
    if (!save) return finishRepair();
    setPending(true);
    setError("");
    const result = await save(text).catch((): AgreeResult => ({ error: SOMETHING_WRONG }));
    setPending(false);
    if (result && "safety" in result) return to({ name: "safety", back: at });
    if (result) return setError(result.error);
    finishRepair();
  };

  const write = (index: number, text: string) => setAnswers((all) => all.map((a, i) => (i === index ? text : a)));
  const afterQuestion = (index: number): HelpScreen =>
    index < copy.review.questions.length - 1 ? { name: "question", index: index + 1 } : { name: "noticed" };
  const nextQuestion = (index: number) => {
    // No AI reads these, so the words are the only check.
    if (mentionsHarm(answers[index])) return to({ name: "safety", back: { name: "question", index } });
    to(afterQuestion(index));
  };
  const skipQuestion = (index: number) => {
    write(index, "");
    if (index === 1) setFeelings([]);
    to(afterQuestion(index));
  };
  const toggleFeeling = (feeling: string) =>
    setFeelings((all) => (all.includes(feeling) ? all.filter((f) => f !== feeling) : [...all, feeling]));
  const felt = [feelings.join(", "), answers[1].trim()].filter(Boolean).join("\n");
  const notes = [answers[0], felt, answers[2], answers[3], answers[4]]
    .map((text, i) => ({ label: copy.review.labels[i], text: text.trim() }))
    .filter((note) => note.text);
  const copyNotes = async () => {
    try {
      await navigator.clipboard.writeText(notes.map((note) => `${note.label}\n${note.text}`).join("\n\n"));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const used = clock.spent + (clock.startedAt !== null && now ? Math.max(0, now - clock.startedAt) : 0);
  const partLeft = Math.max(0, PART_MS - used);

  const title = (text: string) => (
    <h1 ref={headingRef} tabIndex={-1} id={ids.title} className="help-title">
      {text}
    </h1>
  );
  const leave = planHref ? (
    <Link href={planHref} className="help-back">
      <ArrowLeft />
      {copy.backToPlan}
    </Link>
  ) : (
    <button type="button" className="help-back" onClick={onBack}>
      <ArrowLeft />
      {copy.back}
    </button>
  );
  const end = (className: string) =>
    planHref ? (
      <Link href={planHref} className={className}>
        {copy.backToPlan}
      </Link>
    ) : (
      <button type="button" className={className} onClick={onDone}>
        {copy.done}
      </button>
    );

  let body: ReactNode;
  switch (shown.name) {
    case "how":
      body = (
        <>
          {title(copy.how.title)}
          <Choices labelledBy={ids.title} items={[[copy.how.heated, () => calmDown()], [copy.how.calmer, () => to({ name: "makeUp" })]]} />
          <button type="button" className="link-button help-aside" onClick={() => to({ name: "review" })}>
            {copy.how.alone}
          </button>
        </>
      );
      break;

    case "calm": {
      const at = shown;
      body = (
        <>
          {title(copy.calm.title)}
          {at.kept ? <p className="plan-ack">{copy.calm.kept}</p> : null}
          <p className="plan-notice">{copy.calm.notice}</p>
          <TryBox tryWords={{ kind: "say", lead: "", words: copy.calm.say(at.time), after: copy.calm.after }} />
          <button type="button" className="btn btn-lg help-wide" onClick={startTwenty}>
            {copy.calm.start}
          </button>
          <UnsafeLine />
        </>
      );
      break;
    }

    case "pause": {
      // The shared clock can be up to a second behind, so the first moment never reads more than 20:00.
      const time = clockTime(pause && now ? Math.min(PAUSE_MS, pause - now) : PAUSE_MS);
      body = ended ? (
        <>
          {title(copy.pause.check)}
          <Choices labelledBy={ids.title} items={[[copy.pause.ready, calmer], [copy.pause.heated, stillHeated]]} />
        </>
      ) : (
        <>
          {title(copy.pause.title)}
          <div className="help-timer">
            <span className="help-breath" aria-hidden="true" />
            <p className="help-time" role="timer">
              <span className="help-time-num">{time}</span>
              {copy.pause.left(time).slice(time.length)}
            </p>
          </div>
          <ul className="help-list">
            {copy.pause.tips.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
          <p className="help-small">{copy.pause.close}</p>
        </>
      );
      break;
    }

    case "later":
      body = (
        <>
          {title(copy.later.title)}
          <p className="plan-notice">{copy.later.text}</p>
          <TryBox tryWords={{ kind: "say", lead: "", words: copy.later.say }} />
          <div className="help-actions">
            <button type="button" className="btn btn-lg" onClick={twentyMore}>
              {copy.later.more}
            </button>
            <button type="button" className="btn btn-lg btn-quiet" onClick={() => to({ name: "laterDone" })}>
              {copy.later.later}
            </button>
          </div>
        </>
      );
      break;

    case "laterDone":
      body = (
        <>
          {title(copy.later.doneTitle)}
          <p className="plan-notice">{copy.later.doneText}</p>
        </>
      );
      break;

    case "makeUp":
      body = (
        <>
          {title(copy.makeUp.title)}
          <p className="plan-notice">{copy.makeUp.notice}</p>
          <TryBox tryWords={{ kind: "say", lead: "", words: copy.makeUp.say }} />
          <div className="help-actions">
            <button type="button" className="btn btn-lg" onClick={() => to({ name: "repair" })}>
              {copy.makeUp.yes(names)}
            </button>
            <button type="button" className="btn btn-lg btn-quiet" onClick={() => to({ name: "notReady" })}>
              {copy.makeUp.notReady(names)}
            </button>
          </div>
          <button type="button" className="link-button help-aside" onClick={() => to({ name: "review" })}>
            {copy.makeUp.alone}
          </button>
        </>
      );
      break;

    case "notReady":
      body = (
        <>
          {title(copy.notReady.title)}
          <p className="plan-notice">{copy.notReady.text}</p>
          <TryBox tryWords={{ kind: "say", lead: "", words: copy.notReady.say }} />
          <p className="help-half">{copy.notReady.half(names)}</p>
          <button type="button" className="btn btn-lg btn-quiet help-wide" onClick={() => to({ name: "review" })}>
            {copy.notReady.alone}
          </button>
        </>
      );
      break;

    case "repair":
      body = (
        <>
          {title(copy.repair.title)}
          <p className="plan-notice">{copy.repair.text}</p>
          <ul className="help-list">
            {copy.repair.rules.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
          <h2 id={ids.who} className="help-subtitle">
            {copy.repair.who}
          </h2>
          <p className="help-small">{copy.repair.whoHint}</p>
          <Choices
            labelledBy={ids.who}
            items={[
              [copy.repair.first("me", names), () => openPart(0, "me")],
              [copy.repair.first("partner", names), () => openPart(0, "partner")],
            ]}
          />
        </>
      );
      break;

    case "part": {
      const at = shown;
      // The one who goes first talks in parts 1 and 3, the other in 2 and 4. The last part is together.
      const speaker = at.part % 2 === 0 ? at.first : other(at.first);
      const together = at.part === PARTS - 1;
      body = (
        <>
          <div className="help-step">
            <p className="help-step-label">{copy.repair.part(at.part)}</p>
            <Dots at={at.part} />
          </div>
          {title(at.part < 2 ? copy.repair.felt : together ? copy.repair.agree : copy.repair.need)}
          <p className="help-who">{together ? copy.repair.together : copy.repair.talks(speaker, names)}</p>
          <p className="plan-notice">
            {at.part < 2
              ? copy.repair.feltPrompt(other(speaker), names)
              : together
                ? copy.repair.agreeText
                : copy.repair.needPrompt(other(speaker), names)}
          </p>
          <div className="help-part-timer">
            <p className="help-time help-time-part" role="timer">
              {clockTime(partLeft)}
            </p>
            {partLeft > 0 ? (
              clock.startedAt === null ? (
                <button type="button" className="btn btn-quiet" onClick={resumePart}>
                  <Play />
                  {copy.repair.resume}
                </button>
              ) : (
                <button type="button" className="btn btn-quiet" onClick={pausePart}>
                  <PauseBars />
                  {copy.repair.pause}
                </button>
              )
            ) : null}
          </div>
          {partLeft === 0 && !together ? (
            <p className="plan-ack" role="status">
              {copy.repair.timesUp}
            </p>
          ) : null}
          {together ? (
            <div className="help-agree">
              <h2 id={ids.agree} className="help-subtitle">
                {reviewCopy.agree}
              </h2>
              <p id={ids.agreeHint} className="help-small">
                {reviewCopy.agreeHint}
              </p>
              <FitTextarea
                className="quiz-story step-review-agree"
                aria-labelledby={ids.agree}
                aria-describedby={ids.agreeHint}
                rows={1}
                maxLength={AGREEMENT_MAX}
                value={agreement}
                onChange={(e) => setAgreement(e.target.value)}
              />
              <button
                type="button"
                className="btn btn-lg help-wide"
                disabled={!agreement.trim() || pending}
                onClick={() => saveAgreement(at)}
              >
                {reviewCopy.save}
              </button>
              <button type="button" className="link-button quiz-skip" disabled={pending} onClick={finishRepair}>
                {storyQuestion.skip}
              </button>
              {error ? (
                <p className="quiz-error" role="alert">
                  {error}
                </p>
              ) : null}
            </div>
          ) : (
            <button type="button" className="btn btn-lg help-wide" onClick={() => openPart(at.part + 1, at.first)}>
              {copy.repair.next}
              <ArrowRight />
            </button>
          )}
          <div className="help-links">
            <button
              type="button"
              className="link-button"
              onClick={() => {
                saveRepair(at.part, at.first, true);
                calmDown(true);
              }}
            >
              {copy.repair.heating}
            </button>
            <button
              type="button"
              className="link-button"
              onClick={() => {
                saveRepair(at.part, at.first);
                to({ name: "stopped" });
              }}
            >
              {copy.repair.stop}
            </button>
          </div>
        </>
      );
      break;
    }

    case "stopped":
      body = (
        <>
          {title(copy.repair.stoppedTitle)}
          <p className="plan-notice">{copy.repair.stoppedText}</p>
        </>
      );
      break;

    case "repaired":
      body = (
        <>
          {title(copy.repair.doneTitle)}
          <p className="plan-notice">{copy.repair.doneText}</p>
          {end("btn btn-lg help-wide")}
        </>
      );
      break;

    case "review":
      body = (
        <>
          {title(copy.review.title)}
          <p className="plan-notice">{copy.review.text}</p>
          <p className="quiz-private">{copy.review.privacy}</p>
          <p className="help-small">{copy.review.notTherapy}</p>
          <button type="button" className="btn btn-lg help-wide" onClick={() => to({ name: "question", index: 0 })}>
            {copy.review.start}
            <ArrowRight />
          </button>
        </>
      );
      break;

    case "question": {
      const { index } = shown;
      const question = copy.review.questions[index];
      body = (
        <>
          <Dots at={index} />
          {title(question.title)}
          <p id={ids.hint} className="help-small">
            {question.hint(names)}
          </p>
          {index === 1 ? (
            <fieldset className="quiz-topics help-feelings" aria-labelledby={ids.title}>
              {copy.review.feelings.map((feeling) => {
                const on = feelings.includes(feeling);
                return (
                  <label key={feeling} className="quiz-topic" data-on={on || undefined}>
                    <input type="checkbox" className="sr-only" checked={on} onChange={() => toggleFeeling(feeling)} />
                    {on ? <Check /> : null}
                    {feeling}
                  </label>
                );
              })}
            </fieldset>
          ) : null}
          <FitTextarea
            className="quiz-story help-answer"
            aria-labelledby={ids.title}
            aria-describedby={ids.hint}
            rows={3}
            maxLength={ANSWER_MAX}
            value={answers[index]}
            onChange={(e) => write(index, e.target.value)}
          />
          <div className="help-nav">
            <button
              type="button"
              className="btn btn-lg btn-quiet"
              onClick={() => to(index > 0 ? { name: "question", index: index - 1 } : { name: "review" })}
            >
              {copy.review.back}
            </button>
            <button type="button" className="btn btn-lg" onClick={() => nextQuestion(index)}>
              {copy.review.next}
              <ArrowRight />
            </button>
          </div>
          <button type="button" className="link-button quiz-skip" onClick={() => skipQuestion(index)}>
            {storyQuestion.skip}
          </button>
        </>
      );
      break;
    }

    case "noticed":
      body = (
        <>
          {title(copy.review.doneTitle)}
          {notes.length ? (
            <>
              <dl className="help-notes">
                {notes.map((note) => (
                  <div key={note.label}>
                    <dt>{note.label}</dt>
                    <dd>{note.text}</dd>
                  </div>
                ))}
              </dl>
              <p className="help-small">{copy.review.keep}</p>
              <button type="button" className="btn btn-quiet help-copy" onClick={copyNotes}>
                {copied ? planCopy.copied : planCopy.copy}
              </button>
            </>
          ) : null}
          <div className="help-actions">
            <button type="button" className="btn btn-lg" onClick={() => to({ name: "makeUp" })}>
              {copy.review.makeUp}
            </button>
            {end("btn btn-lg btn-quiet")}
          </div>
        </>
      );
      break;

    case "safety": {
      const back = shown.back;
      body = <SafetyHelp headingRef={headingRef} onBack={() => to(back)} />;
      break;
    }
  }

  return (
    <div className="help">
      {leave}
      <section
        key={key}
        className="plan-today help-card"
        aria-labelledby={shown.name === "safety" ? undefined : ids.title}
      >
        {body}
      </section>
    </div>
  );
}

/** Big single answers, the same as the quiz's. Each one moves on straight away. */
function Choices({ labelledBy, items }: { labelledBy: string; items: [string, () => void][] }) {
  return (
    <div className="quiz-choices" role="group" aria-labelledby={labelledBy}>
      {items.map(([label, onChoose]) => (
        <button key={label} type="button" className="quiz-choice" onClick={onChoose}>
          <span>{label}</span>
          <span className="quiz-tick" aria-hidden="true">
            <Check />
          </span>
        </button>
      ))}
    </div>
  );
}

/** Where they are among five, for the eye only: the text says it too where it matters. */
function Dots({ at }: { at: number }) {
  return (
    <ol className="help-dots" aria-hidden="true">
      {Array.from({ length: PARTS }, (_, i) => (
        <li key={i} data-on={i <= at || undefined} />
      ))}
    </ol>
  );
}

/** The quiet safety line under calming down, with both numbers ready to call. */
function UnsafeLine() {
  const [before, rest] = copy.calm.unsafe.split("911");
  const [middle, after] = rest.split("1.800.799.7233");
  return (
    <p className="help-small help-unsafe">
      {before}
      <a href="tel:911">911</a>
      {middle}
      <a href={hotline.call}>1.800.799.7233</a>
      {after}
    </p>
  );
}
