"use client";

import { useState } from "react";
import { method } from "@/lib/content";

export type TasterTopic = { id: string; label: string; lines: [string, string, string] };

// The plan's own labels for its three scripts, one for each part of the method.
const parts = ["To bring it up", "If it heats up", "To make up after"] as const;

/**
 * The landing page's topics, as buttons: tap one to see the words the plan gives for it. Every topic's
 * card is drawn in the same spot, with only the chosen one showing, so the card never changes height.
 */
export function TopicTaster({ topics }: { topics: TasterTopic[] }) {
  const [current, setCurrent] = useState(topics[0]?.id);
  return (
    <div className="taster">
      <div className="topics" role="group" aria-label="Fight topics">
        {topics.map((topic) => (
          <button
            key={topic.id}
            type="button"
            className="topic"
            aria-pressed={topic.id === current}
            onClick={() => setCurrent(topic.id)}
          >
            {topic.label}
          </button>
        ))}
      </div>
      <div className="taster-stack" aria-live="polite">
        {topics.map((topic) => (
          <ol key={topic.id} className="taster-card" data-on={topic.id === current ? "" : undefined}>
            {topic.lines.map((words, i) => {
              const { Icon } = method[i];
              return (
                <li key={parts[i]} className="taster-part">
                  <p className="taster-label">
                    <span className="taster-icon" aria-hidden="true">
                      <Icon />
                    </span>
                    {parts[i]}
                  </p>
                  <blockquote className="taster-words">{words}</blockquote>
                </li>
              );
            })}
          </ol>
        ))}
      </div>
    </div>
  );
}
