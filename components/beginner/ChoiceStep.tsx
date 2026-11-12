import type { RefObject } from "react";
import { Check } from "@/components/icons";

/**
 * One question answered with one tap. Tapping an answer moves on by itself, after a beat so the tick is seen;
 * coming back to the screen shows what she picked, and tapping it again moves on. On the quiz's last screen,
 * `error` says why reading her answers didn't work, and tapping again tries once more.
 */
export function ChoiceStep<T extends string>({
  title,
  options,
  labels,
  value,
  onPick,
  error,
  headingRef,
}: {
  title: string;
  options: readonly T[];
  labels: Record<T, string>;
  value: T | null;
  onPick: (value: T) => void;
  error?: string;
  headingRef: RefObject<HTMLHeadingElement | null>;
}) {
  return (
    <>
      <h1 ref={headingRef} tabIndex={-1} className="quiz-title" id="q-choice">
        {title}
      </h1>
      <div className="quiz-choices" role="group" aria-labelledby="q-choice">
        {options.map((id) => (
          <button key={id} type="button" className="quiz-choice" aria-pressed={value === id} onClick={() => onPick(id)}>
            <span>{labels[id]}</span>
            <span className="quiz-tick" aria-hidden="true">
              <Check />
            </span>
          </button>
        ))}
      </div>
      {error ? (
        <p className="quiz-error" role="alert">
          {error}
        </p>
      ) : null}
    </>
  );
}
