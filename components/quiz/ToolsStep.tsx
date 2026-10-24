import type { RefObject } from "react";
import { ArrowRight, Check } from "@/components/icons";
import { policyQuestion, toolsQuestion } from "@/lib/questions";
import {
  AI_POLICIES,
  AI_TOOLS,
  OTHER_TOOLS_MAX,
  policyLabels,
  SOLO_TOOLS,
  toolLabels,
  type AiPolicy,
  type AiTool,
} from "@/lib/week";
import { Dock } from "./Dock";

type ToolsStepProps = {
  tools: AiTool[];
  onTools: (tools: AiTool[]) => void;
  /** What she types in the field under Other. */
  other: string;
  onOther: (other: string) => void;
  policy: AiPolicy | null;
  onPolicy: (policy: AiPolicy) => void;
  onSubmit: () => void;
  error?: string;
  headingRef: RefObject<HTMLHeadingElement | null>;
};

const solo = (id: AiTool) => (SOLO_TOOLS as readonly AiTool[]).includes(id);

/**
 * The two taps on one screen: which AI tools she uses (any she likes, or None yet or Not sure on its own) and
 * her company's view on AI (one). Other opens a field under the chips for the tools she means, and Continue
 * waits for it to have words. Nothing moves on by itself here, since there are two questions; Continue does.
 */
export function ToolsStep({ tools, onTools, other, onOther, policy, onPolicy, onSubmit, error, headingRef }: ToolsStepProps) {
  const toggle = (id: AiTool) => {
    if (tools.includes(id)) return onTools(tools.filter((t) => t !== id));
    // None yet and Not sure go on their own: picking one clears the rest, picking anything else clears them.
    onTools(solo(id) ? [id] : [...tools.filter((t) => !solo(t)), id]);
  };
  const withOther = tools.includes("other");
  return (
    <>
      <h1 ref={headingRef} tabIndex={-1} className="quiz-title" id="q-tools">
        {toolsQuestion.title}
      </h1>
      <p className="quiz-hint">{toolsQuestion.hint}</p>
      <fieldset className="quiz-topics" aria-labelledby="q-tools">
        {AI_TOOLS.map((id) => {
          const on = tools.includes(id);
          return (
            <label key={id} className="quiz-topic" data-on={on || undefined}>
              <input type="checkbox" className="sr-only" checked={on} onChange={() => toggle(id)} />
              {on ? <Check /> : null}
              {toolLabels[id]}
            </label>
          );
        })}
      </fieldset>
      {withOther ? (
        <div className="quiz-field quiz-other">
          <input
            type="text"
            aria-label={toolsQuestion.other.label}
            placeholder={toolsQuestion.other.placeholder}
            maxLength={OTHER_TOOLS_MAX}
            autoComplete="off"
            enterKeyHint="done"
            value={other}
            onChange={(e) => onOther(e.target.value)}
          />
        </div>
      ) : null}

      <h2 className="quiz-check" id="q-policy">
        {policyQuestion.title}
      </h2>
      <div className="quiz-choices quiz-choices-near" role="group" aria-labelledby="q-policy">
        {AI_POLICIES.map((id) => (
          <button
            key={id}
            type="button"
            className="quiz-choice"
            aria-pressed={policy === id}
            onClick={() => onPolicy(id)}
          >
            <span>{policyLabels[id]}</span>
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
      <Dock>
        <button
          type="button"
          className="btn btn-lg quiz-next"
          disabled={!tools.length || !policy || (withOther && !other.trim())}
          onClick={onSubmit}
        >
          Continue
          <ArrowRight />
        </button>
      </Dock>
    </>
  );
}
