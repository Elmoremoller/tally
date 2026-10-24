import { ArrowRight, Heart, PauseCircle } from "./icons";

// Small copies of the real plan screens for "Everything you get", cut off at the bottom like a screen that
// keeps going. Decorative: the card's title and line carry the meaning. The words are the plan's own,
// except the sample message in the message check.

export function PlanPreview() {
  return (
    <span className="shot">
      <span className="shot-head">
        <span className="shot-kicker">Today’s step</span>
        <span className="shot-tag">
          <PauseCircle />
          Pause
        </span>
      </span>
      <span className="shot-title">When you need space and they want to talk now</span>
      <span className="shot-box">
        <span className="shot-label">Try saying</span>
        <span className="shot-say">I need 20 minutes. I’ll come find you at 8.</span>
      </span>
    </span>
  );
}

export function CheckPreview() {
  return (
    <span className="shot">
      <span className="shot-msg">You never help with anything.</span>
      <span className="shot-tag shot-verdict">Worth another look</span>
      <span className="shot-box">
        <span className="shot-label">A version that keeps your point</span>
        <span className="shot-say">I’m feeling stretched. Can we look at who does what this week?</span>
      </span>
    </span>
  );
}

export function ScriptsPreview() {
  return (
    <span className="shot">
      <span className="shot-tabs">
        <span className="is-on">Chores</span>
        <span>Money</span>
        <span>Family</span>
      </span>
      <span className="shot-box">
        <span className="shot-label">If it heats up</span>
        <span className="shot-say">I can see you need a minute. Can we talk about chores tonight at 8, after dinner?</span>
      </span>
      <span className="shot-chips">
        <span>
          <Heart />
          10 minute repair
        </span>
        <span>Weekly check in</span>
      </span>
    </span>
  );
}

export function InvitePreview() {
  return (
    <span className="shot">
      <span className="shot-title">Add my partner</span>
      <span className="shot-field">Their email</span>
      <span className="shot-btn">
        Add my partner
        <ArrowRight />
      </span>
    </span>
  );
}

export const previews = {
  plan: PlanPreview,
  check: CheckPreview,
  scripts: ScriptsPreview,
  invite: InvitePreview,
} as const;
