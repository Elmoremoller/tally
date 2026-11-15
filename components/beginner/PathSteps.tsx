"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { answerPathStep, savePathPhone } from "@/app/plan/actions";
import { Check, Copy } from "@/components/icons";
import { Dock } from "@/components/quiz/Dock";
import { firstWinCopy, pathCopy as copy } from "@/lib/beginner/copy";
import { prepTitles } from "@/lib/beginner/free-result";
import {
  devicesFor,
  HELP_AFTER,
  NOTE_MAX,
  PAIRED,
  PHONES,
  phoneApp,
  routeFor,
  stepCard,
  stepLines,
  toolName,
  type AboutStep,
  type EndStep,
  type ExtraStep,
  type Material,
  type PathAnswer,
  type PathPlan,
  type PathStep,
  type Phone,
  type ReadyStep,
  type WorkflowStep,
} from "@/lib/beginner/path";
import type { Device } from "@/lib/beginner/quiz-copy";
import { cardById } from "@/lib/beginner/cards";
import { recipeById, type RecipeStep } from "@/lib/beginner/recipes";
import { offer } from "@/lib/offer";

// Her paid path, one step at a time, like the quiz (docs/DIRECTION.md, section 4 and Phase 6): a progress line,
// the step, a big copy button on everything Tally wrote for her, and "Did it work?", saved on the server. Her
// earlier answers and her phone come from the server, so her progress shows on any device. The setup steps are
// read from the checked cards and recipes, never from what the model wrote.

export type SavedPath = { answers: Record<string, PathAnswer[]>; phone: Phone | null };

const PHONE_KEY = "tally-path-phone";

/** The phone kept in this browser, for a path the server has no phone for yet, as on a preview. */
function keptPhone(): Phone | null {
  try {
    const kept = window.localStorage.getItem(PHONE_KEY);
    return kept && (PHONES as readonly string[]).includes(kept) ? (kept as Phone) : null;
  } catch {
    return null;
  }
}
const noSubscribe = () => () => {};

/** The step she should see first: the first one she hasn't said worked, or the end. */
const firstOpen = (steps: readonly PathStep[], answers: SavedPath["answers"]) => {
  const at = steps.findIndex((s) => s.kind !== "end" && !(answers[s.id] ?? []).includes("yes"));
  return at < 0 ? steps.length - 1 : at;
};

export function PathSteps({ content, token, saved }: { content: PathPlan; token: string | null; saved: SavedPath }) {
  const { steps } = content;
  const [at, setAt] = useState(() => firstOpen(steps, saved.answers));
  const [answers, setAnswers] = useState(saved.answers);
  // Her pick here wins, then the server's, then this browser's. Undefined until she picks on this page.
  const [picked, setPicked] = useState<Phone | null | undefined>(undefined);
  const kept = useSyncExternalStore(noSubscribe, keptPhone, () => null);
  const phone = picked !== undefined ? picked : (saved.phone ?? kept);
  const heading = useRef<HTMLHeadingElement>(null);
  const moved = useRef(false);

  // Each new step starts at the top, with its heading read out.
  useEffect(() => {
    if (!moved.current) return;
    window.scrollTo({ top: 0 });
    heading.current?.focus();
  }, [at]);

  const go = (to: number) => {
    moved.current = true;
    setAt(Math.max(0, Math.min(steps.length - 1, to)));
  };

  const pickPhone = (picked: Phone | null) => {
    setPicked(picked);
    try {
      if (picked) window.localStorage.setItem(PHONE_KEY, picked);
      else window.localStorage.removeItem(PHONE_KEY);
    } catch {}
    if (picked) void savePathPhone({ token, phone: picked });
  };

  const step = steps[at];
  const prep = prepTitles(content.tool, content.device);
  const title =
    step.kind === "ready" ? prep.ready : step.kind === "about" ? prep.about : step.kind === "end" ? copy.endTitle : step.title;

  return (
    <div className="path-flow">
      <div className="path-progress">
        <p className="quiz-eyebrow">{copy.eyebrow}</p>
        <p className="path-count" role="status">
          {copy.progress(at + 1, steps.length)}
        </p>
        <div className="path-bar" aria-hidden="true">
          <span style={{ transform: `scaleX(${(at + 1) / steps.length})` }} />
        </div>
      </div>

      <div key={step.id} className="quiz-step path-step" data-dir="forward">
        {at === 0 && content.skipped.length ? (
          <ul className="path-skipped">
            {content.skipped.map((skip) => (
              <li key={skip}>{copy.skipped[skip]}</li>
            ))}
          </ul>
        ) : null}
        <h1 ref={heading} tabIndex={-1} className="quiz-title path-title">
          {title}
        </h1>

        {step.kind === "ready" ? <Ready step={step} plan={content} /> : null}
        {step.kind === "about" ? <About step={step} plan={content} /> : null}
        {step.kind === "workflow" ? <Workflow step={step} plan={content} phone={phone} onPhone={pickPhone} /> : null}
        {step.kind === "extra" ? <Extra step={step} plan={content} /> : null}
        {step.kind === "end" ? <End step={step} /> : null}

        {step.kind !== "end" ? (
          <DidItWork
            key={step.id}
            token={token}
            stepId={step.id}
            answers={answers[step.id] ?? []}
            onSaved={(answer) => setAnswers((all) => ({ ...all, [step.id]: [...(all[step.id] ?? []), answer] }))}
          />
        ) : null}
        {step.kind === "workflow" ? (
          <p className="path-stops">
            <span className="plan-try-label">{copy.stopsLabel}</span> {copy.stops(offer.supportEmail)}
          </p>
        ) : null}

        <Dock className="path-nav">
          {at > 0 ? (
            <button type="button" className="btn btn-lg btn-quiet" onClick={() => go(at - 1)}>
              {copy.back}
            </button>
          ) : null}
          {at < steps.length - 1 ? (
            <button type="button" className="btn btn-lg quiz-next" onClick={() => go(at + 1)}>
              {copy.next}
            </button>
          ) : null}
        </Dock>
      </div>
    </div>
  );
}

/** A Starter's first step: her tool ready, from its card, then her first message, so she sees one real result. */
function Ready({ step, plan }: { step: ReadyStep; plan: PathPlan }) {
  const card = stepCard(step);
  return (
    <>
      {card ? (
        <DeviceSteps steps={card.steps} device={plan.device} />
      ) : (
        <p className="quiz-type-text">{copy.readyNoCard(toolName(plan.tool))}</p>
      )}
      {step.firstStep ? (
        <Pieces
          pieces={[{ label: copy.firstMessage, items: [step.firstStep] }]}
          lead={copy.firstMessageLead}
        />
      ) : null}
    </>
  );
}

/** Teach it who she is: her tool's card for saved instructions, then the note Tally wrote about her. */
function About({ step, plan }: { step: AboutStep; plan: PathPlan }) {
  const card = stepCard(step);
  const name = toolName(plan.tool);
  const devices = card ? devicesFor(card.steps, plan.device) : [];
  return (
    <>
      {!card ? (
        <p className="quiz-type-text">{copy.noCard(name)}</p>
      ) : devices.length ? (
        <DeviceSteps steps={card.steps} device={plan.device} />
      ) : (
        <p className="quiz-type-text">{copy.computerOnly(name)}</p>
      )}
      <Pieces pieces={[{ label: copy.aboutLabel, items: [step.note] }]} lead={copy.aboutLead} />
    </>
  );
}

/** One workflow, in the parts of section 4. A task with no recipe gets Tally's own three steps in her chat tool. */
function Workflow({
  step,
  plan,
  phone,
  onPhone,
}: {
  step: WorkflowStep;
  plan: PathPlan;
  phone: Phone | null;
  onPhone: (phone: Phone | null) => void;
}) {
  const recipe = step.recipe ? recipeById(step.recipe) : undefined;
  const name = toolName(plan.tool);
  const { route, askPhone } = recipe ? routeFor(recipe, { ...plan, phone }) : { route: null, askPhone: false };
  const toolCard = cardById(`${plan.tool}_get_started`);
  const test = recipe?.test ?? copy.withAi;
  // Rule 10 of section 5: what it costs comes before she starts, unless the free plan is enough.
  const costLine = recipe ? recipe.cost.note : copy.withAi.cost(name, toolCard?.freePlan.enough ?? false);
  const costFirst = recipe ? recipe.cost.freePlanEnough !== true : !toolCard?.freePlan.enough;
  const usesPhoneApp = Boolean(route?.apps.some((app) => (Object.values(phoneApp) as string[]).includes(app)));
  // Google's keyboard pins replies; it has no shortcuts, so the shortcuts are left out there.
  const hideSecond = route?.apps.includes("gboard") ?? false;

  return (
    <>
      <p className="path-read">{step.read}</p>
      {costFirst ? <Note label={copy.costFirst} text={costLine} /> : null}
      <Pieces pieces={step.material} paired={Boolean(recipe && PAIRED.has(recipe.id))} hideSecond={hideSecond} />

      <section className="path-part" aria-label={copy.setupLabel}>
        <p className="plan-try-label">{copy.setupLabel}</p>
        {!recipe ? (
          <ol className="plan-steps">
            {copy.withAi.steps(name).map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ol>
        ) : askPhone ? (
          <PhoneQuestion onPick={onPhone} />
        ) : route ? (
          <>
            <DeviceSteps steps={route.steps} device={plan.device} />
            {route.note ? <p className="path-note">{route.note}</p> : null}
          </>
        ) : (
          <p className="plan-ack">{copy.noSteps}</p>
        )}
        {recipe && phone && !askPhone && (usesPhoneApp || !route) ? (
          <button type="button" className="btn btn-quiet path-change" onClick={() => onPhone(null)}>
            {copy.phone.change}
          </button>
        ) : null}
      </section>

      <div className="plan-try">
        <p className="plan-try-label">{copy.testLabel}</p>
        <p>{test.tryOn}</p>
        <p className="plan-try-label">{copy.goodLabel}</p>
        <p>{test.good}</p>
        <p className="plan-try-label">{copy.fixesLabel}</p>
        <ul className="plan-rules">
          {test.fixes.map((fix) => (
            <li key={fix}>{fix}</li>
          ))}
        </ul>
      </div>
      <Note label={copy.approvalLabel} text={recipe?.approval ?? copy.withAi.approval} />
      {!costFirst ? <Note label={copy.costLabel} text={costLine} /> : null}
    </>
  );
}

/** A second task with the same recipe: what Tally wrote for it, added to the setup she just made. */
function Extra({ step, plan }: { step: ExtraStep; plan: PathPlan }) {
  const first = plan.steps.find((s) => s.id === step.sameAs);
  const recipe = recipeById(step.recipe);
  const firstTitle = first && first.kind === "workflow" ? first.title : "";
  return (
    <>
      <p className="path-read">{step.read}</p>
      <Pieces pieces={step.material} paired={Boolean(recipe && PAIRED.has(recipe.id))} />
      <p className="quiz-type-text">{copy.extraSetup(firstTitle)}</p>
    </>
  );
}

/** The end of her path: what is safe at her job, and with an employer, the message to ask what's allowed. */
function End({ step }: { step: EndStep }) {
  return (
    <>
      <ul className="plan-rules path-safe">
        {step.safeUse.map((rule) => (
          <li key={rule}>{rule}</li>
        ))}
      </ul>
      {step.askMessage ? <Pieces pieces={[{ label: copy.askLabel, items: [step.askMessage] }]} lead={copy.askLead} /> : null}
      <p className="quiz-type-text">{copy.end}</p>
    </>
  );
}

/** A labelled line, like her approval point or what it costs. */
function Note({ label, text }: { label: string; text: string }) {
  return (
    <div className="path-note-box">
      <p className="plan-try-label">{label}</p>
      <p>{text}</p>
    </div>
  );
}

/** Which phone she has, asked at the first step whose setup differs by phone. */
function PhoneQuestion({ onPick }: { onPick: (phone: Phone) => void }) {
  return (
    <div className="path-phone">
      <p className="path-phone-title" id="path-phone">
        {copy.phone.title}
      </p>
      <p className="quiz-hint">{copy.phone.hint}</p>
      <div className="quiz-choices" role="group" aria-labelledby="path-phone">
        {PHONES.map((p) => (
          <button key={p} type="button" className="quiz-choice" onClick={() => onPick(p)}>
            {copy.phone.labels[p]}
          </button>
        ))}
      </div>
    </div>
  );
}

/** Setup steps for her device. With both devices, or none known, she switches between them. */
function DeviceSteps({ steps, device }: { steps: { phone?: RecipeStep[]; computer?: RecipeStep[] }; device: Device | null }) {
  const devices = devicesFor(steps, device);
  const [on, setOn] = useState(devices[0]);
  const shown = devices.includes(on) ? on : devices[0];
  if (!shown) return <p className="plan-ack">{copy.noSteps}</p>;
  return (
    <>
      {devices.length > 1 ? (
        <div className="path-devices" role="group" aria-label={copy.setupLabel}>
          {devices.map((d) => (
            <button key={d} type="button" className="path-device" aria-pressed={d === shown} onClick={() => setOn(d)}>
              {copy.devices[d]}
            </button>
          ))}
        </div>
      ) : null}
      <ol className="plan-steps">
        {stepLines(steps[shown] ?? [], shown).map((line, i) => (
          <li key={`${i}-${line}`}>{line}</li>
        ))}
      </ol>
    </>
  );
}

/**
 * What Tally wrote for her. One item gets the big copy button. A list gets a copy button on every item, and a
 * paired piece, like a shortcut for each reply, sits under its item.
 */
function Pieces({
  pieces,
  lead,
  paired = false,
  hideSecond = false,
}: {
  pieces: Material[];
  lead?: string;
  paired?: boolean;
  hideSecond?: boolean;
}) {
  const pairs = paired && pieces.length >= 2 && pieces[1].items.length === pieces[0].items.length;
  const shown = pairs ? [pieces[0]] : pieces;
  return (
    <section className="path-part" aria-label={copy.materialLabel}>
      <p className="plan-try-label">{copy.materialLabel}</p>
      {shown.map((piece, n) => (
        <div key={piece.label} className="path-piece">
          <p className="path-piece-label">{piece.label}</p>
          {lead && n === 0 ? <p className="plan-script-lead">{lead}</p> : null}
          {piece.items.length === 1 ? (
            <>
              <blockquote className="win-draft">{piece.items[0]}</blockquote>
              <BigCopy words={piece.items[0]} />
            </>
          ) : (
            <ol className="path-items">
              {piece.items.map((item, i) => (
                <li key={`${i}-${item}`}>
                  <p className="path-item-text">{item}</p>
                  <SmallCopy words={item} />
                  {pairs && !hideSecond ? (
                    <p className="path-pair">
                      <span>{pieces[1].label}</span> <strong>{pieces[1].items[i]}</strong>
                      <SmallCopy words={pieces[1].items[i]} />
                    </p>
                  ) : null}
                </li>
              ))}
            </ol>
          )}
        </div>
      ))}
    </section>
  );
}

const useCopy = (words: string) => {
  const [copied, setCopied] = useState(false);
  const copyIt = async () => {
    try {
      await navigator.clipboard.writeText(words);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {}
  };
  return { copied, copyIt };
};

function BigCopy({ words }: { words: string }) {
  const { copied, copyIt } = useCopy(words);
  return (
    <button type="button" className="btn btn-lg win-copy" onClick={copyIt}>
      {copied ? <Check /> : <Copy />}
      <span aria-live="polite">{copied ? firstWinCopy.copied : firstWinCopy.copy}</span>
    </button>
  );
}

function SmallCopy({ words }: { words: string }) {
  const { copied, copyIt } = useCopy(words);
  return (
    <button type="button" className="path-copy" onClick={copyIt}>
      {copied ? <Check /> : <Copy />}
      <span aria-live="polite">{copied ? firstWinCopy.copied : firstWinCopy.copy}</span>
    </button>
  );
}

/**
 * "Did it work?" with Yes and Not quite, saved on the server. A second Not quite on the same step shows one line
 * with the support email, offering help or her money back, and a small box for a few words on what went wrong;
 * that answer is saved with her words when she sends it.
 */
function DidItWork({
  token,
  stepId,
  answers,
  onSaved,
}: {
  token: string | null;
  stepId: string;
  answers: PathAnswer[];
  onSaved: (answer: PathAnswer) => void;
}) {
  const [state, setState] = useState<"idle" | "saving" | "yes" | "not_quite" | "sent" | "error">("idle");
  const [helpOpen, setHelpOpen] = useState(false);
  const [note, setNote] = useState("");
  const notQuite = answers.filter((a) => a === "not_quite").length;

  const save = async (answer: PathAnswer, words?: string) => {
    setState("saving");
    const { ok } = await answerPathStep({ token, step: stepId, answer, note: words ?? null }).catch(() => ({ ok: false }));
    if (!ok) return setState("error");
    onSaved(answer);
    if (words !== undefined) setHelpOpen(false);
    setState(words !== undefined ? "sent" : answer);
  };

  const onNotQuite = () => {
    // The second Not quite on this step waits for her few words, and is saved with them.
    if (notQuite + 1 >= HELP_AFTER) {
      setHelpOpen(true);
      setState("idle");
    } else void save("not_quite");
  };

  return (
    <section className="path-worked" aria-labelledby={`worked-${stepId}`}>
      <p id={`worked-${stepId}`} className="path-worked-title">
        {copy.didItWork}
      </p>
      <div className="path-worked-buttons">
        <button
          type="button"
          className="quiz-choice"
          aria-pressed={state === "yes" || (state === "idle" && answers.at(-1) === "yes")}
          disabled={state === "saving"}
          onClick={() => {
            setHelpOpen(false);
            void save("yes");
          }}
        >
          {copy.yes}
        </button>
        <button
          type="button"
          className="quiz-choice"
          aria-pressed={state === "not_quite" || helpOpen || state === "sent"}
          disabled={state === "saving"}
          onClick={onNotQuite}
        >
          {copy.notQuite}
        </button>
      </div>
      <div role="status" className="path-worked-status">
        {state === "yes" ? <p>{copy.yesSaved}</p> : null}
        {state === "not_quite" ? <p>{copy.notQuiteSaved}</p> : null}
        {state === "sent" ? <p>{copy.help.sent}</p> : null}
        {state === "error" ? <p className="quiz-error">{copy.saveError}</p> : null}
      </div>
      {helpOpen ? (
        <form
          className="path-help"
          onSubmit={(e) => {
            e.preventDefault();
            void save("not_quite", note);
          }}
        >
          <p className="plan-ack">{copy.help.line(offer.supportEmail, offer.refund)}</p>
          <label className="path-help-label" htmlFor={`help-${stepId}`}>
            {copy.help.label}
          </label>
          <textarea
            id={`help-${stepId}`}
            className="path-help-box"
            rows={3}
            maxLength={NOTE_MAX}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <button type="submit" className="btn btn-lg" disabled={state === "saving"}>
            {copy.help.send}
          </button>
        </form>
      ) : null}
    </section>
  );
}
