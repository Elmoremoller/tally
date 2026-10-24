"use client";

import { useState } from "react";
import { SayBox } from "./SayBox";

export type ScriptTab = { id: string; label: string; cards: { label: string; lead: string; words: string }[] };

/**
 * One tab at a time, each with its words to change and copy: her busywork tasks, each with its ready
 * prompt. The tabs scroll sideways on a phone when there are many.
 */
export function ScriptTabs({ tabs, groupLabel }: { tabs: ScriptTab[]; groupLabel: string }) {
  const [current, setCurrent] = useState(tabs[0]?.id);
  const tab = tabs.find((t) => t.id === current) ?? tabs[0];
  if (!tab) return null;
  return (
    <div className="plan-scripts">
      {tabs.length > 1 ? (
        <div className="plan-tabs" role="group" aria-label={groupLabel}>
          {tabs.map((t) => (
            <button key={t.id} type="button" aria-pressed={t.id === tab.id} className="plan-tab" onClick={() => setCurrent(t.id)}>
              {t.label}
            </button>
          ))}
        </div>
      ) : null}
      <div className="plan-script-list" aria-live="polite">
        {tab.cards.map((card) => (
          // Keyed by tab too, so another tab's words never stay in the box.
          <figure key={`${tab.id}-${card.label}`} className="plan-script">
            <p className="plan-script-label">{card.label}</p>
            <p className="plan-script-lead">{card.lead}</p>
            <SayBox words={card.words} />
          </figure>
        ))}
      </div>
    </div>
  );
}
