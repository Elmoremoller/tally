import type { JSX } from "react";
import type { PlanPartId } from "@/lib/landing";
import { Copy, Sparkle } from "./icons";

// Small copies of the plan's screens for "What's in your plan", cut off at the bottom like a screen that keeps
// going. Decorative: the card's title and line carry the meaning. The sample is a DRAFT, for a marketing
// coordinator whose company encourages ChatGPT, until the real plan page exists.

function CopyChip() {
  return (
    <span className="shot-chips">
      <span>
        <Copy />
        Copy
      </span>
    </span>
  );
}

export function AuditPreview() {
  return (
    <span className="shot">
      <span className="shot-tabs">
        <span>Hand to AI</span>
        <span className="is-on">Hand back</span>
        <span>Keep visible</span>
      </span>
      <span className="shot-title">Fixing slides for your boss</span>
      <span className="shot-box">
        <span className="shot-label">A polite way to hand it back</span>
        <span className="shot-say">I’m at capacity this week. Could the deck’s owner make the final edits?</span>
      </span>
    </span>
  );
}

const hours = [
  ["Meeting notes", "3"],
  ["Status updates", "2"],
  ["Fixing slides", "2.5"],
  ["Newsletter drafts", "1.5"],
] as const;

export function HoursPreview() {
  return (
    <span className="shot">
      <span className="shot-kicker">Hours back</span>
      <span className="shot-big">9 hours a week</span>
      <span className="shot-rows">
        {hours.map(([task, n]) => (
          <span key={task}>
            {task}
            <b>{n}</b>
          </span>
        ))}
      </span>
    </span>
  );
}

export function SetupPreview() {
  return (
    <span className="shot">
      <span className="shot-head">
        <span className="shot-kicker">AI setup</span>
        <span className="shot-tag">ChatGPT</span>
      </span>
      <span className="shot-box">
        <span className="shot-label">Your work profile</span>
        <span className="shot-say">I’m a marketing coordinator at a software company. I plan events and write our newsletter.</span>
      </span>
      <CopyChip />
    </span>
  );
}

export function HandoffPreview() {
  return (
    <span className="shot">
      <span className="shot-head">
        <span className="shot-kicker">Meeting notes</span>
        <span className="shot-tag">
          <Sparkle className="is-filled" />
          Ready prompt
        </span>
      </span>
      <span className="shot-box">
        <span className="shot-say">Turn these notes into a short recap with owners and dates. [paste your notes]</span>
      </span>
      <CopyChip />
    </span>
  );
}

export function VisibilityPreview() {
  return (
    <span className="shot">
      <span className="shot-kicker">Visibility plan</span>
      <span className="shot-title">Lead next quarter’s events strategy</span>
      <span className="shot-box">
        <span className="shot-label">To your manager</span>
        <span className="shot-say">I’ve been using ChatGPT for first drafts, and it’s freed up time. Can I take the lead on our events strategy?</span>
      </span>
    </span>
  );
}

export const previews: Record<PlanPartId, () => JSX.Element> = {
  audit: AuditPreview,
  hours: HoursPreview,
  setup: SetupPreview,
  handoff: HandoffPreview,
  visibility: VisibilityPreview,
};
