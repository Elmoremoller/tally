"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { reflectOnStory, saveQuiz } from "@/app/start/actions";
import { Backdrop } from "@/components/Backdrop";
import { ArrowLeft, ArrowRight, Check } from "@/components/icons";
import { SafetyHelp } from "@/components/SafetyHelp";
import { ChoiceStep } from "./ChoiceStep";
import { QuizHeader } from "./QuizHeader";
import { Reveal } from "./Reveal";
import { StoryStep, type StoryStage } from "./StoryStep";
import {
  choiceQuestions,
  emailQuestion,
  fightTopics,
  looksLikeEmail,
  NAME_MAX,
  namesQuestion,
  topicsQuestion,
  type CoupleTypeId,
  type QuizAnswers,
} from "@/lib/quiz";
import type { KeptReflection, Labels } from "@/lib/reflection";
import { safetyQuestion, type SafetyAnswer } from "@/lib/safety";

// One question per screen: the topics, the five choice questions, the safety question, the open question,
// the names, then the email. Picking a single answer moves on by itself; the others have a Continue button.
// The safety answer stays in this browser tab and is never saved: Yes or Not sure shows the hotline instead
// of the rest of the quiz, with the back arrow there for a mis-tap. What they write in the open question is
// read back to them before they go on, and the hotline shows instead when it mentions fear or harm.
const SAFETY_STEP = 1 + choiceQuestions.length;
const STORY_STEP = SAFETY_STEP + 1;
const NAMES_STEP = STORY_STEP + 1;
const EMAIL_STEP = NAMES_STEP + 1;
const QUESTION_COUNT = EMAIL_STEP + 1;
/** Long enough to see the answer you tapped light up before the next question slides in. */
const ADVANCE_DELAY = 260;
/** The "Making your plan" moment lasts at least this long, even when saving is quicker. */
const MAKING_MIN = 1600;
/** "Looking at the pattern, not the person." stays up at least this long, so it can be read. */
const READING_MIN = 1200;

type Draft = Partial<QuizAnswers>;
type Phase = "questions" | "making" | "reveal" | "has-plan";
type ChoiceKey = (typeof choiceQuestions)[number]["key"];

const wait = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));

export function Quiz() {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [answers, setAnswers] = useState<Draft>({});
  const [safety, setSafety] = useState<SafetyAnswer | null>(null);
  /** True while the hotline shows, after Yes or Not sure, or an answer that mentions fear or harm. */
  const [stopped, setStopped] = useState(false);
  const [story, setStory] = useState("");
  const [stage, setStage] = useState<StoryStage>("write");
  /** The reflection on screen, and the story it was read from, so going back and on doesn't ask again. */
  const [heard, setHeard] = useState<{ story: string; bullets: string[]; labels: Labels } | null>(null);
  const [correction, setCorrection] = useState("");
  /** The reflection they kept, with Yes, that's us or after Not quite. Only this one is saved. */
  const [kept, setKept] = useState<KeptReflection | null>(null);
  const [phase, setPhase] = useState<Phase>("questions");
  const [coupleType, setCoupleType] = useState<CoupleTypeId | null>(null);
  const [error, setError] = useState("");
  /** True while a tapped answer is lighting up, so a second tap cannot skip a question. */
  const [advancing, setAdvancing] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const moved = useRef(false);
  /** Counts readings, so one that comes back after Back was pressed is ignored. */
  const reading = useRef(0);

  // After moving to a new screen, put focus on its question so screen readers announce it.
  useEffect(() => {
    if (moved.current) headingRef.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0 });
  }, [step, phase, stopped, stage]);

  const update = (patch: Draft) => setAnswers((current) => ({ ...current, ...patch }));

  const go = (to: number) => {
    moved.current = true;
    setDirection(to > step ? "forward" : "back");
    setStep(to);
    setError("");
  };

  /** Shows the hotline in place of the rest of the quiz, or takes it away again. */
  const showHelp = (show: boolean) => {
    moved.current = true;
    setDirection(show ? "forward" : "back");
    setStopped(show);
  };

  /** Moves between the open question's screens: writing, reading, the reflection and fixing it. */
  const toStage = (next: StoryStage, way: "forward" | "back" = "forward") => {
    moved.current = true;
    setDirection(way);
    setStage(next);
  };

  /** Lets the tapped answer light up for a moment, then does what it leads to. */
  const afterTap = (then: () => void) => {
    setAdvancing(true);
    window.setTimeout(() => {
      setAdvancing(false);
      then();
    }, ADVANCE_DELAY);
  };

  const choose = (key: ChoiceKey, id: string) => {
    if (advancing) return;
    update({ [key]: id } as Draft);
    afterTap(() => go(step + 1));
  };

  const chooseSafety = (id: SafetyAnswer) => {
    if (advancing) return;
    setSafety(id);
    afterTap(() => (id === "no" ? go(step + 1) : showHelp(true)));
  };

  const toggleTopic = (id: string) => {
    const current = answers.topics ?? [];
    update({ topics: current.includes(id) ? current.filter((t) => t !== id) : [...current, id] });
  };

  /**
   * Asks for the reflection, with the reading line up for at least READING_MIN. The result is null when it
   * didn't come back in time; the whole answer is null when Back was pressed while it was on its way.
   */
  const read = async (text: string, fix?: { bullets: string[]; correction: string }) => {
    const ticket = ++reading.current;
    const [result] = await Promise.all([
      reflectOnStory({
        story: text,
        topics: answers.topics ?? [],
        partnerName: answers.partnerName?.trim() || null,
        fix,
      }).catch(() => null),
      wait(READING_MIN),
    ]);
    return ticket === reading.current ? { result } : null;
  };

  const submitStory = async () => {
    const text = story.trim();
    if (!text) return;
    // Back and on again with the same words: show what was already read.
    if (heard?.story === text) return toStage(kept?.fixed ? "fixed" : "reflection");
    setKept(null);
    toStage("reading");
    const answer = await read(text);
    if (!answer) return;
    const { result } = answer;
    if (result?.safety) {
      setStage("write");
      return showHelp(true);
    }
    if (!result) {
      // The reflection didn't come back in time: the quiz carries on without it.
      setHeard(null);
      setStage("write");
      return go(NAMES_STEP);
    }
    setHeard({ story: text, bullets: result.bullets, labels: result.labels });
    toStage("reflection");
  };

  const keep = () => {
    if (!heard) return;
    setKept({ bullets: heard.bullets, labels: heard.labels, fixed: false, correction: null });
    go(NAMES_STEP);
  };

  const submitFix = async () => {
    const line = correction.trim();
    if (!line || !heard) return;
    toStage("reading");
    const answer = await read(heard.story, { bullets: heard.bullets, correction: line });
    if (!answer) return;
    const { result } = answer;
    if (result?.safety) {
      setKept(null);
      setStage("fix");
      return showHelp(true);
    }
    if (!result) {
      // Fixing didn't work out this time. Nothing is kept, and the quiz carries on.
      setKept(null);
      setStage("write");
      return go(NAMES_STEP);
    }
    setHeard({ story: heard.story, bullets: result.bullets, labels: result.labels });
    setKept({ bullets: result.bullets, labels: result.labels, fixed: true, correction: line });
    toStage("fixed");
  };

  const skipStory = () => {
    setKept(null);
    go(NAMES_STEP);
  };

  const back = () => {
    if (stopped) return showHelp(false);
    if (step === STORY_STEP && stage !== "write") {
      // A reading still on its way is no longer wanted.
      reading.current++;
      return toStage(stage === "fix" ? "reflection" : "write", "back");
    }
    go(step - 1);
  };

  const submitEmail = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const email = (answers.email ?? "").trim();
    if (!email) return setError("Please enter your email.");
    if (!looksLikeEmail(email)) return setError("That email doesn’t look right.");

    moved.current = true;
    setPhase("making");
    const withStory = kept && heard ? { story: heard.story, reflection: kept } : {};
    const [result] = await Promise.all([
      saveQuiz({ ...(answers as QuizAnswers), email, ...withStory }).catch(() => null),
      new Promise((resolve) => window.setTimeout(resolve, MAKING_MIN)),
    ]);
    if (!result || !result.ok) {
      setPhase("questions");
      setError(result?.error ?? "We couldn’t save your answers. Please try again.");
      return;
    }
    if (result.hasPlan) {
      setPhase("has-plan");
      return;
    }
    setCoupleType(result.coupleType);
    setPhase("reveal");
  };

  const progress = phase === "questions" ? step / QUESTION_COUNT : 1;
  const question = choiceQuestions[step - 1];
  // The topic their story was about leads the reveal, as it does in their saved plan.
  const topics = answers.topics ?? [];
  const main = kept?.labels.mainTopic;
  const revealTopics = main && topics.includes(main) ? [main, ...topics.filter((t) => t !== main)] : topics;

  return (
    <div className="quiz">
      <Backdrop progress={progress} />
      <QuizHeader
        progress={progress}
        back={
          phase !== "questions" ? undefined : step === 0 && !stopped ? (
            <Link href="/" className="quiz-back" aria-label="Back to home">
              <ArrowLeft />
            </Link>
          ) : (
            <button type="button" className="quiz-back" aria-label="Back" onClick={back}>
              <ArrowLeft />
            </button>
          )
        }
      />

      <main id="main" className="quiz-main">
        {phase === "questions" && stopped ? (
          <div key="safety-help" className="quiz-step" data-dir={direction}>
            <SafetyHelp headingRef={headingRef} />
          </div>
        ) : phase === "questions" ? (
          <div key={step === STORY_STEP ? `story-${stage}` : step} className="quiz-step" data-dir={direction}>
            {step !== STORY_STEP || stage === "write" ? (
              <p className="sr-only">
                Question {step + 1} of {QUESTION_COUNT}
              </p>
            ) : null}

            {step === 0 ? (
              <>
                <h1 ref={headingRef} tabIndex={-1} className="quiz-title" id="q-title">
                  {topicsQuestion.title}
                </h1>
                <p className="quiz-hint">{topicsQuestion.hint}</p>
                <fieldset className="quiz-topics" aria-labelledby="q-title">
                  {fightTopics.map((topic) => {
                    const on = answers.topics?.includes(topic.id) ?? false;
                    return (
                      <label key={topic.id} className="quiz-topic" data-on={on || undefined}>
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={on}
                          onChange={() => toggleTopic(topic.id)}
                        />
                        {on ? <Check /> : null}
                        {topic.label}
                      </label>
                    );
                  })}
                </fieldset>
                <button
                  type="button"
                  className="btn btn-lg quiz-next"
                  disabled={!answers.topics?.length}
                  onClick={() => go(1)}
                >
                  Continue
                  <ArrowRight />
                </button>
              </>
            ) : question ? (
              <ChoiceStep
                title={question.title}
                choices={question.choices}
                picked={answers[question.key]}
                onChoose={(id) => choose(question.key, id)}
                headingRef={headingRef}
              />
            ) : step === SAFETY_STEP ? (
              <ChoiceStep
                title={safetyQuestion.title}
                hint={safetyQuestion.hint}
                choices={safetyQuestion.choices}
                picked={safety ?? undefined}
                onChoose={chooseSafety}
                headingRef={headingRef}
              />
            ) : step === STORY_STEP ? (
              <StoryStep
                stage={stage}
                story={story}
                onStory={setStory}
                onSubmitStory={submitStory}
                onSkip={skipStory}
                bullets={heard?.bullets ?? []}
                onKeep={keep}
                onNotQuite={() => {
                  setCorrection("");
                  toStage("fix");
                }}
                correction={correction}
                onCorrection={setCorrection}
                onSubmitFix={submitFix}
                onDone={() => go(NAMES_STEP)}
                headingRef={headingRef}
              />
            ) : step === NAMES_STEP ? (
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  go(EMAIL_STEP);
                }}
              >
                <h1 ref={headingRef} tabIndex={-1} className="quiz-title">
                  {namesQuestion.title}
                </h1>
                <p className="quiz-hint">{namesQuestion.hint}</p>
                <div className="quiz-fields">
                  <label className="quiz-field">
                    <span>Your first name</span>
                    <input
                      type="text"
                      autoComplete="given-name"
                      maxLength={NAME_MAX}
                      value={answers.yourName ?? ""}
                      onChange={(e) => update({ yourName: e.target.value })}
                    />
                  </label>
                  <label className="quiz-field">
                    <span>Their first name</span>
                    <input
                      type="text"
                      autoComplete="off"
                      maxLength={NAME_MAX}
                      value={answers.partnerName ?? ""}
                      onChange={(e) => update({ partnerName: e.target.value })}
                    />
                  </label>
                </div>
                <button type="submit" className="btn btn-lg quiz-next">
                  Continue
                  <ArrowRight />
                </button>
              </form>
            ) : (
              <form onSubmit={submitEmail} noValidate>
                <h1 ref={headingRef} tabIndex={-1} className="quiz-title" id="q-title">
                  {emailQuestion.title}
                </h1>
                <div className="quiz-fields">
                  <label className="quiz-field">
                    <span>Email</span>
                    <input
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      autoCapitalize="off"
                      spellCheck={false}
                      value={answers.email ?? ""}
                      aria-invalid={error ? true : undefined}
                      aria-describedby={error ? "q-error" : undefined}
                      onChange={(e) => update({ email: e.target.value })}
                    />
                  </label>
                  {error ? (
                    <p id="q-error" className="quiz-error" role="alert">
                      {error}
                    </p>
                  ) : null}
                </div>
                <button type="submit" className="btn btn-lg quiz-next">
                  Continue
                  <ArrowRight />
                </button>
              </form>
            )}
          </div>
        ) : phase === "making" ? (
          <div className="quiz-making" role="status">
            <span className="quiz-spinner" aria-hidden="true" />
            <h1 ref={headingRef} tabIndex={-1} className="quiz-title">
              Making your plan
            </h1>
          </div>
        ) : phase === "has-plan" ? (
          <div className="quiz-step quiz-making" data-dir="forward">
            <h1 ref={headingRef} tabIndex={-1} className="quiz-title">
              You already have a plan
            </h1>
            <p className="quiz-hint">
              We sent a link to <strong>{answers.email?.trim()}</strong>. Open it to go back to your plan.
            </p>
          </div>
        ) : coupleType && answers.you && answers.partner ? (
          <Reveal
            coupleType={coupleType}
            topics={revealTopics}
            you={answers.you}
            partner={answers.partner}
            partnerName={answers.partnerName?.trim() || null}
            headingRef={headingRef}
          />
        ) : null}
      </main>
    </div>
  );
}
