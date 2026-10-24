import type { RefObject } from "react";
import { Check } from "@/components/icons";

type ChoiceStepProps<Id extends string> = {
  title: string;
  hint?: string;
  choices: readonly { id: Id; label: string }[];
  picked?: string;
  onChoose: (id: Id) => void;
  headingRef: RefObject<HTMLHeadingElement | null>;
  /** The question's id. The quiz's own, unless a page with other questions on it needs its own. */
  titleId?: string;
};

/** One question with big single answers. Used in the quiz, and for an invited partner's safety question. */
export function ChoiceStep<Id extends string>({ title, hint, choices, picked, onChoose, headingRef, titleId = "q-title" }: ChoiceStepProps<Id>) {
  return (
    <>
      <h1 ref={headingRef} tabIndex={-1} className="quiz-title" id={titleId}>
        {title}
      </h1>
      {hint ? <p className="quiz-hint">{hint}</p> : null}
      <div className="quiz-choices" role="group" aria-labelledby={titleId}>
        {choices.map((choice) => (
          <button
            key={choice.id}
            type="button"
            className="quiz-choice"
            aria-pressed={picked === choice.id}
            onClick={() => onChoose(choice.id)}
          >
            <span>{choice.label}</span>
            <span className="quiz-tick" aria-hidden="true">
              <Check />
            </span>
          </button>
        ))}
      </div>
    </>
  );
}
