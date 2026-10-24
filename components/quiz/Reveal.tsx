import type { RefObject } from "react";
import { listOf, situation } from "@/lib/plan";
import { coupleTypes, fightTopics, topicMoments, type CoupleTypeId, type FightMove } from "@/lib/quiz";
import { Paywall } from "./Paywall";

type RevealProps = {
  coupleType: CoupleTypeId;
  /** Their topics, the one their story was about first. */
  topics: string[];
  you: FightMove;
  partner: FightMove;
  partnerName: string | null;
  headingRef?: RefObject<HTMLHeadingElement | null>;
};

/**
 * The pattern their answers suggest, big, with the smile under it, then their own fight in one line, and
 * their plan and the way to get it.
 */
export function Reveal({ coupleType, topics, you, partner, partnerName, headingRef }: RevealProps) {
  const type = coupleTypes[coupleType];
  const picked = fightTopics.filter((t) => topics.includes(t.id));
  const labels = picked.map((t) => t.label);
  const when = topicMoments[topics[0]];
  const theirSituation = situation({ coupleType, topics, you, partner, partnerName, start: "", makeUp: "" });
  return (
    <div className="quiz-step quiz-reveal" data-dir="forward">
      <p className="quiz-eyebrow">Your answers suggest</p>
      <h1 ref={headingRef} tabIndex={-1} className="quiz-type">
        <strong className="smile">{type.name}</strong>
      </h1>
      {when ? (
        <p className="quiz-moment">
          {when}, {theirSituation}.
        </p>
      ) : null}
      <p className="quiz-type-text">{type.description}</p>
      <p className="quiz-focus">
        Your plan pays extra attention to <strong>{type.focus}</strong>: {type.focusDetail}
      </p>
      {picked.length ? (
        <div className="quiz-built">
          <p>Built around your fights about</p>
          <ul>
            {picked.map((t) => (
              <li key={t.id}>{t.label}</li>
            ))}
          </ul>
        </div>
      ) : null}
      <Paywall topics={listOf(labels)} situation={theirSituation} />
    </div>
  );
}
