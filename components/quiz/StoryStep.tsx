import type { FormEvent, RefObject } from "react";
import { ArrowRight } from "@/components/icons";
import { CORRECTION_MAX, fixQuestion, readingLine, reflectionCopy, STORY_MAX, storyQuestion } from "@/lib/quiz";

/**
 * Where the open question is at: writing it, being read, the reflection with Did we get that right?,
 * fixing it once after Not quite, and the fixed reflection.
 */
export type StoryStage = "write" | "reading" | "reflection" | "fix" | "fixed";

type StoryStepProps = {
  stage: StoryStage;
  story: string;
  onStory: (text: string) => void;
  onSubmitStory: () => void;
  onSkip: () => void;
  bullets: string[];
  onKeep: () => void;
  onNotQuite: () => void;
  correction: string;
  onCorrection: (text: string) => void;
  onSubmitFix: () => void;
  onDone: () => void;
  headingRef: RefObject<HTMLHeadingElement | null>;
};

const submit = (then: () => void) => (event: FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  then();
};

/** The open question near the end of the quiz, and the reflection that comes back. */
export function StoryStep({
  stage,
  story,
  onStory,
  onSubmitStory,
  onSkip,
  bullets,
  onKeep,
  onNotQuite,
  correction,
  onCorrection,
  onSubmitFix,
  onDone,
  headingRef,
}: StoryStepProps) {
  if (stage === "reading") {
    return (
      <div className="quiz-making" role="status">
        <span className="quiz-spinner" aria-hidden="true" />
        <h1 ref={headingRef} tabIndex={-1} className="quiz-title">
          {readingLine}
        </h1>
      </div>
    );
  }

  if (stage === "reflection" || stage === "fixed") {
    return (
      <>
        <h1 ref={headingRef} tabIndex={-1} className="quiz-title">
          {reflectionCopy.title}
        </h1>
        <ul className="quiz-heard">
          {bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
        {stage === "reflection" ? (
          <>
            <p className="quiz-check" id="q-check">
              {reflectionCopy.question}
            </p>
            <div className="quiz-confirm" role="group" aria-labelledby="q-check">
              <button type="button" className="btn btn-lg" onClick={onKeep}>
                {reflectionCopy.yes}
              </button>
              <button type="button" className="btn btn-lg btn-quiet" onClick={onNotQuite}>
                {reflectionCopy.notQuite}
              </button>
            </div>
          </>
        ) : (
          <button type="button" className="btn btn-lg quiz-next" onClick={onDone}>
            Continue
            <ArrowRight />
          </button>
        )}
      </>
    );
  }

  if (stage === "fix") {
    return (
      <form onSubmit={submit(onSubmitFix)}>
        <h1 ref={headingRef} tabIndex={-1} className="quiz-title" id="q-title">
          {fixQuestion.title}
        </h1>
        <p className="quiz-hint" id="q-hint">
          {fixQuestion.hint}
        </p>
        <div className="quiz-fields">
          <div className="quiz-field">
            <input
              type="text"
              aria-labelledby="q-title"
              aria-describedby="q-hint"
              maxLength={CORRECTION_MAX}
              value={correction}
              onChange={(e) => onCorrection(e.target.value)}
            />
          </div>
        </div>
        <button type="submit" className="btn btn-lg quiz-next" disabled={!correction.trim()}>
          Continue
          <ArrowRight />
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={submit(onSubmitStory)}>
      <h1 ref={headingRef} tabIndex={-1} className="quiz-title" id="q-title">
        {storyQuestion.title}
      </h1>
      <p className="quiz-hint" id="q-hint">
        {storyQuestion.hint}
      </p>
      <div className="quiz-fields">
        <textarea
          className="quiz-story"
          aria-labelledby="q-title"
          aria-describedby="q-hint q-private"
          rows={5}
          maxLength={STORY_MAX}
          value={story}
          onChange={(e) => onStory(e.target.value)}
        />
        <p className="quiz-private" id="q-private">
          {storyQuestion.privacy}
        </p>
      </div>
      <button type="submit" className="btn btn-lg quiz-next" disabled={!story.trim()}>
        Continue
        <ArrowRight />
      </button>
      <button type="button" className="link-button quiz-skip" onClick={onSkip}>
        {storyQuestion.skip}
      </button>
    </form>
  );
}
