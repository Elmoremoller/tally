import type { CSSProperties } from "react";
import { phoneSample as sample } from "@/lib/landing";
import { Mark } from "./brand/Logo";
import { ArrowRight, Battery, Copy, Signal, Sparkle, Wifi } from "./icons";

/**
 * The hero's product shot, drawn in HTML and CSS: a phone that plays through the product on a loop. A quiz
 * answer gets picked, her hours come up, then her plan. The motion toggle pauses it; with reduced motion it
 * shows the plan and holds still. It reads as one image to assistive tech. The words are in lib/landing.ts.
 */
export function PhoneMockup() {
  return (
    <div
      className="phone"
      role="img"
      aria-label={`A phone playing through the quiz: a question gets answered, the hours a week on work nobody notices come up, then a plan with three cards, ${sample.cards.map((c) => c.title).join(", ")}.`}
    >
      <div className="screen">
        <div className="status">
          <span>9:41</span>
          <span className="status-icons">
            <Signal />
            <Wifi />
            <Battery />
          </span>
        </div>
        <span className="island" />
        <div className="scenes">
          {/* 1. A quiz question, answered */}
          <div className="scene scene-quiz">
            <span className="demo-progress">
              <span />
            </span>
            <p className="demo-question">{sample.question}</p>
            <ul className="demo-choices">
              {sample.choices.map((choice) => (
                <li key={choice} className={choice === sample.picked ? "is-picked" : undefined}>
                  {choice}
                </li>
              ))}
            </ul>
            <span className="demo-next">
              Continue
              <ArrowRight />
            </span>
          </div>

          {/* 2. Her hours */}
          <div className="scene scene-type">
            <p className="demo-eyebrow">{sample.resultLead}</p>
            <p className="demo-type">
              <strong className="smile">{sample.hours}</strong>
            </p>
            <p className="demo-moment">{sample.resultLine}</p>
            <div className="demo-built">
              <p>Sorted into three piles</p>
              <ul>
                {sample.piles.map((pile) => (
                  <li key={pile}>{pile}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* 3. Her plan */}
          <div className="scene scene-plan app">
            <div className="app-head">
              <Mark className="app-mark" />
              <p className="app-title">Your plan</p>
            </div>
            <ul className="app-topics">
              {sample.chips.map((chip) => (
                <li key={chip}>{chip}</li>
              ))}
            </ul>
            <ol className="app-cards">
              {sample.cards.map(({ title, text, Icon }, i) => (
                <li key={title} className="app-card" style={{ "--i": i } as CSSProperties}>
                  <span className="app-icon">
                    <Icon />
                  </span>
                  <p className="app-card-title">{title}</p>
                  <p className="app-card-text">{text}</p>
                </li>
              ))}
            </ol>
            <ul className="app-quick">
              {sample.quick.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <div className="app-ask">
              <Sparkle className="sparkle" />
              <span>{sample.ask}</span>
              <span className="send">
                <Copy />
              </span>
            </div>
          </div>
        </div>
        <span className="home-bar" />
      </div>
    </div>
  );
}
