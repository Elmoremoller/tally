import type { Dispatch, FormEvent, RefObject, SetStateAction } from "react";
import { ArrowRight } from "@/components/icons";
import { privacyNote } from "@/lib/questions";
import { ANSWER_MAX } from "@/lib/week";
import { MicButton } from "./MicButton";

type TextStepProps = {
  title: string;
  hint?: string;
  placeholder?: string;
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  onSubmit: () => void;
  error?: string;
  headingRef: RefObject<HTMLHeadingElement | null>;
};

/** Adds what she said to what's already in the box, up to the limit. */
const append = (text: string, said: string) => (text.trim() ? `${text.trimEnd()} ${said}` : said).slice(0, ANSWER_MAX);

/**
 * One open question: a box with room for a few lines, a way to talk instead of typing where the browser can,
 * and the note that she needn't name her company or colleagues.
 */
export function TextStep({ title, hint, placeholder, value, setValue, onSubmit, error, headingRef }: TextStepProps) {
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (value.trim()) onSubmit();
  };
  return (
    <form onSubmit={submit}>
      <h1 ref={headingRef} tabIndex={-1} className="quiz-title" id="q-title">
        {title}
      </h1>
      {hint ? (
        <p className="quiz-hint" id="q-hint">
          {hint}
        </p>
      ) : null}
      <div className="quiz-fields">
        <textarea
          className="quiz-story"
          aria-labelledby="q-title"
          aria-describedby={hint ? "q-hint q-private" : "q-private"}
          aria-invalid={error ? true : undefined}
          rows={5}
          maxLength={ANSWER_MAX}
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <div className="quiz-under">
          <MicButton onText={(said) => setValue((text) => append(text, said))} />
          <p className="quiz-private" id="q-private">
            {privacyNote}
          </p>
        </div>
        {error ? (
          <p className="quiz-error" role="alert">
            {error}
          </p>
        ) : null}
      </div>
      <button type="submit" className="btn btn-lg quiz-next" disabled={!value.trim()}>
        Continue
        <ArrowRight />
      </button>
    </form>
  );
}
