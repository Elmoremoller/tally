"use client";

import { useState } from "react";
import type { ScriptCard } from "@/lib/plan";
import { SayBox } from "./SayBox";

type Topic = { id: string; label: string; cards: ScriptCard[] };

/**
 * The words to use, one topic at a time: Tone and Not feeling heard first, then their own topics. Each has
 * a way to bring it up, a line for when it heats up, and a way to make up after, all theirs to change.
 */
export function TopicScripts({ topics }: { topics: Topic[] }) {
  const [current, setCurrent] = useState(topics[0]?.id);
  const topic = topics.find((t) => t.id === current) ?? topics[0];
  if (!topic) return null;
  return (
    <div className="plan-scripts">
      {topics.length > 1 ? (
        <div className="plan-tabs" role="group" aria-label="Your fight topics">
          {topics.map((t) => (
            <button
              key={t.id}
              type="button"
              aria-pressed={t.id === topic.id}
              className="plan-tab"
              onClick={() => setCurrent(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
      ) : null}
      <div className="plan-script-list" aria-live="polite">
        {topic.cards.map((card) => (
          // Keyed by topic too, so another topic's words never stay in the box.
          <figure key={`${topic.id}-${card.label}`} className="plan-script">
            <p className="plan-script-label">{card.label}</p>
            <p className="plan-script-lead">{card.lead}</p>
            <SayBox words={card.words} />
          </figure>
        ))}
      </div>
    </div>
  );
}
