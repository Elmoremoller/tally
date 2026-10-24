import type { RefObject } from "react";
import { ArrowRight, Check } from "@/components/icons";
import { policyQuestion, toolsQuestion } from "@/lib/questions";
import { AI_POLICIES, AI_TOOLS, policyLabels, toolLabels, type AiPolicy, type AiTool } from "@/lib/week";

type ToolsStepProps = {
  tools: AiTool[];
  onTools: (tools: AiTool[]) => void;
  policy: AiPolicy | null;
  onPolicy: (policy: AiPolicy) => void;
  onSubmit: () => void;
  error?: string;
  headingRef: RefObject<HTMLHeadingElement | null>;
};

/**
 * The two taps on one screen: which AI tools she can use (any she likes, or Not sure on its own) and her
 * company's view on AI (one). Nothing moves on by itself here, since there are two questions; Continue does.
 */
export function ToolsStep({ tools, onTools, policy, onPolicy, onSubmit, error, headingRef }: ToolsStepProps) {
  const toggle = (id: AiTool) => {
    if (tools.includes(id)) return onTools(tools.filter((t) => t !== id));
    // Not sure goes on its own; picking a tool takes it away.
    onTools(id === "not_sure" ? ["not_sure"] : [...tools.filter((t) => t !== "not_sure"), id]);
  };
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
      <button type="button" className="btn btn-lg quiz-next" disabled={!tools.length || !policy} onClick={onSubmit}>
        Continue
        <ArrowRight />
      </button>
    </>
  );
}
