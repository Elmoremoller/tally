"use client";

import type { RefObject } from "react";
import { ArrowRight, Check } from "@/components/icons";
import { Dock } from "@/components/quiz/Dock";
import { ANSWER_MAX } from "@/lib/week";
import { OtherBox } from "./PickStep";

/** A last row that opens a box for her own words, in place of the answers above it. */
type Other = {
  label: string;
  placeholder: string;
  /** Her words: null while the row is off. */
  value: string | null;
  onChange: (value: string | null) => void;
  onSubmit: () => void;
};

/**
 * One question answered with one tap. Tapping an answer moves on by itself, after a beat so the tick is seen;
 * coming back to the screen shows what she picked, and tapping it again moves on. With `other`, a last row
 * opens a box where she can type or say her own answer, and Continue moves on once there are words in it.
 * On the quiz's last screen, `error` says why reading her answers didn't work, and tapping again tries once more.
 */
export function ChoiceStep<T extends string>({
  title,
  options,
  labels,
  value,
  onPick,
  other,
  error,
  headingRef,
}: {
  title: string;
  options: readonly T[];
  labels: Record<T, string>;
  value: T | null;
  onPick: (value: T) => void;
  other?: Other;
  error?: string;
  headingRef: RefObject<HTMLHeadingElement | null>;
}) {
  const otherOn = other ? other.value !== null : false;
  return (
    <>
      <h1 ref={headingRef} tabIndex={-1} className="quiz-title" id="q-choice">
        {title}
      </h1>
      <div className="quiz-choices" role="group" aria-labelledby="q-choice">
        {options.map((id) => (
          <button
            key={id}
            type="button"
            className="quiz-choice"
            aria-pressed={!otherOn && value === id}
            onClick={() => {
              other?.onChange(null);
              onPick(id);
            }}
          >
            <span>{labels[id]}</span>
            <span className="quiz-tick" aria-hidden="true">
              <Check />
            </span>
          </button>
        ))}
        {other ? (
          <button
            type="button"
            className="quiz-choice"
            aria-pressed={otherOn}
            onClick={() => other.onChange(otherOn ? null : "")}
          >
            <span>{other.label}</span>
            <span className="quiz-tick" aria-hidden="true">
              <Check />
            </span>
          </button>
        ) : null}
      </div>
      {other && otherOn ? (
        <OtherBox value={other.value ?? ""} setValue={other.onChange} max={ANSWER_MAX} placeholder={other.placeholder} />
      ) : null}
      {error ? (
        <p className="quiz-error" role="alert">
          {error}
        </p>
      ) : null}
      {other && otherOn ? (
        <Dock>
          <button type="button" className="btn btn-lg quiz-next" disabled={!other.value?.trim()} onClick={other.onSubmit}>
            Continue
            <ArrowRight />
          </button>
        </Dock>
      ) : null}
    </>
  );
}
