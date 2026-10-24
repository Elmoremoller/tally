import type { CSSProperties } from "react";
import { method } from "@/lib/content";
import { situation, type PlanContext } from "@/lib/plan";
import { choiceQuestions, coupleTypes, topicMoments } from "@/lib/quiz";
import { Mark } from "./brand/Logo";
import { ArrowRight, ArrowUp, Battery, Signal, Sparkle, Wifi } from "./icons";

// The sample couple the phone plays through: one goes quiet, the other wants to talk now, about chores.
const sample: PlanContext = {
  coupleType: "push_and_pull",
  topics: ["chores", "money"],
  you: "go_quiet",
  partner: "sort_it_out_now",
  partnerName: null,
  start: "",
  makeUp: "",
};
const question = choiceQuestions[0];
const type = coupleTypes[sample.coupleType];

/**
 * The hero's product shot, drawn in HTML and CSS: a phone that plays through the product on a loop. The
 * first quiz question gets answered, the couple type comes up, then the plan. The motion toggle pauses it;
 * with reduced motion it shows the plan and holds still. It reads as one image to assistive tech; the same
 * copy is set as real text further down the page.
 */
export function PhoneMockup() {
  return (
    <div
      className="phone"
      role="img"
      aria-label="A phone playing through the quiz: a question gets answered, the couple type comes up, then a plan with three cards, Prevent, Pause and Repair, above a message check."
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
          {/* 1. The first question, answered */}
          <div className="scene scene-quiz">
            <span className="demo-progress">
              <span />
            </span>
            <p className="demo-question">{question.title}</p>
            <ul className="demo-choices">
              {question.choices.map((choice) => (
                <li key={choice.id} className={choice.id === sample.you ? "is-picked" : undefined}>
                  {choice.label}
                </li>
              ))}
            </ul>
            <span className="demo-next">
              Continue
              <ArrowRight />
            </span>
          </div>

          {/* 2. The couple type their answers suggest */}
          <div className="scene scene-type">
            <p className="demo-eyebrow">Your answers suggest</p>
            <p className="demo-type">
              <strong className="smile">{type.name}</strong>
            </p>
            <p className="demo-moment">
              {topicMoments.chores}, {situation(sample)}.
            </p>
            <div className="demo-built">
              <p>Built around your fights about</p>
              <ul>
                <li>Chores</li>
                <li>Money</li>
              </ul>
            </div>
          </div>

          {/* 3. The plan */}
          <div className="scene scene-plan app">
            <div className="app-head">
              <Mark className="app-mark" />
              <p className="app-title">Your plan</p>
            </div>
            <ul className="app-topics">
              <li>Chores</li>
              <li>Money</li>
            </ul>
            <ol className="app-cards">
              {method.map(({ title, text, Icon }, i) => (
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
              <li>Weekly check in</li>
              <li>10 minute repair</li>
            </ul>
            <div className="app-ask">
              <Sparkle className="sparkle" />
              <span>Check my message</span>
              <span className="send">
                <ArrowUp />
              </span>
            </div>
          </div>
        </div>
        <span className="home-bar" />
      </div>
    </div>
  );
}
