import type { JSX } from "react";
import { Check, Copy, Sparkle } from "@/components/icons";
import { beginnerFeelings as feelings, beginnerPage, beginnerSample as sample } from "@/lib/beginner/copy";

// The beginner landing page's pictures for How it works: the quiz, her first win and her plan, drawn as small
// copies of the real screens. With no What's in your plan section on this page, these three carry the
// product, so they show more than the first version's (components/landing/StepVisuals.tsx): the panel is
// taller, and each holds what she will really see. Decorative: the line under each one carries the meaning.
// The sample is a dental office receptionist's.

/** Step 1: her profile filling in as she answers: role, apps, level, where her time goes. */
function Answer() {
  return (
    <span className="shot">
      <span className="shot-head">
        <span className="shot-kicker">{sample.profileTitle}</span>
        <span className="shot-tag">{sample.profileProgress}</span>
      </span>
      <span className="shot-bar" data-far>
        <span />
      </span>
      <span className="shot-profile">
        {sample.profile.map((row) => (
          <span key={row.label}>
            <small>{row.label}</small>
            {"chips" in row ? (
              <span className="shot-tabs">
                {row.chips.map((chip) => (
                  <span key={chip} className="is-on">
                    {chip}
                  </span>
                ))}
              </span>
            ) : (
              <b>{row.value}</b>
            )}
          </span>
        ))}
      </span>
      <span className="shot-field shot-typing">{sample.profileNext}</span>
    </span>
  );
}

/** Step 2: her week mapped: each task, what AI does with it, and what kind of thing that is. */
function Win() {
  return (
    <span className="shot">
      <span className="shot-stack">
        <span className="shot-kicker">{sample.mapTitle}</span>
        <span className="shot-small">{sample.mapRole}</span>
      </span>
      <span className="shot-map">
        {sample.map.map((row) => (
          <span key={row.task}>
            <b>{row.task}</b>
            <span>{row.fix}</span>
            <em>{row.kind}</em>
          </span>
        ))}
      </span>
      <span className="shot-chips">
        <span>
          <Sparkle className="is-filled" />
          {sample.mapFree}
        </span>
      </span>
    </span>
  );
}

/** Step 3: one workflow from her plan, open on the step she is doing, with what to click and what to paste. */
function Plan() {
  const now = sample.pathNow;
  return (
    <span className="shot">
      <span className="shot-head">
        <span className="shot-kicker">{sample.pathTitle}</span>
        <span className="shot-tag">Step 2 of {sample.pathSteps}</span>
      </span>
      <span className="shot-title">{sample.pathName}</span>
      <span className="shot-path">
        <span data-done>
          <i>
            <Check />
          </i>
          {sample.pathDoneStep}
        </span>
      </span>
      <span className="shot-step">
        <span className="shot-step-head">
          <i>2</i>
          <b>{now.title}</b>
        </span>
        <span className="shot-step-lines">
          {now.lines.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </span>
        <span className="shot-step-actions">
          <span className="shot-chips">
            <span>
              <Copy />
              {now.copy}
            </span>
          </span>
          <span className="shot-btn">{now.next}</span>
        </span>
      </span>
      <span className="shot-path">
        {sample.pathLater.map((step, i) => (
          <span key={step}>
            <i>{i + 3}</i>
            {step}
          </span>
        ))}
      </span>
    </span>
  );
}

export const beginnerStepVisuals: (() => JSX.Element)[] = [Answer, Win, Plan];

// The pictures on the It's not you cards: each feeling as the screen that causes it. A new chat with nothing in
// it, a message she isn't sure she may paste, and a course that takes weeks.

/** Not sure where to start: an empty chat, waiting. */
function Blank() {
  return (
    <span className="shot">
      <span className="shot-kicker">{feelings.blank.title}</span>
      <span className="shot-field shot-typing">{feelings.blank.field}</span>
    </span>
  );
}

/** Worried you'll get it wrong: a message with someone's details in it, and the doubt under it. */
function Unsure() {
  return (
    <span className="shot">
      <span className="shot-field">
        {feelings.unsure.before}
        <span className="shot-redact" />
        {feelings.unsure.after}
      </span>
      <span className="shot-small">{feelings.unsure.doubt}</span>
    </span>
  );
}

/** No time to learn it: a course, barely begun. */
function Course() {
  return (
    <span className="shot">
      <span className="shot-head">
        <span className="shot-kicker">{feelings.course.title}</span>
        <span className="shot-tag">{feelings.course.length}</span>
      </span>
      <span className="shot-bar" data-start>
        <span />
      </span>
      <span className="shot-rows">
        {feelings.course.modules.map((module) => (
          <span key={module}>{module}</span>
        ))}
      </span>
    </span>
  );
}

export const beginnerFeelingVisuals: (() => JSX.Element)[] = [Blank, Unsure, Course];

// The pictures on the Which one sounds like you? cards: a chat she never started, and the small things she
// uses it for.

const which = beginnerPage.which.shots;

function NeverOpened() {
  return (
    <span className="shot">
      <span className="shot-kicker">{which.blank.title}</span>
      <span className="shot-field shot-typing">{which.blank.field}</span>
    </span>
  );
}

function SmallStuff() {
  return (
    <span className="shot">
      <span className="shot-kicker">{which.small.title}</span>
      <span className="shot-rows">
        {which.small.rows.map((row) => (
          <span key={row}>{row}</span>
        ))}
      </span>
    </span>
  );
}

export const beginnerWhichVisuals: (() => JSX.Element)[] = [NeverOpened, SmallStuff];
