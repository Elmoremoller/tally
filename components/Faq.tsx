"use client";

import { useId, useState, type ReactNode } from "react";

type QA = { readonly q: string; readonly a: ReactNode };

/**
 * Collapsible questions. Each answer opens on a spring (grid rows from 0fr to 1fr) and stays out of the
 * tab order and the accessibility tree while closed. Without JavaScript every answer is shown.
 */
export function Faq({ items }: { items: readonly QA[] }) {
  const [open, setOpen] = useState<ReadonlySet<number>>(() => new Set());
  const base = useId();

  const toggle = (index: number) =>
    setOpen((current) => {
      const next = new Set(current);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });

  return (
    <div className="faq-list">
      {items.map((item, index) => {
        const isOpen = open.has(index);
        const questionId = `${base}q${index}`;
        const answerId = `${base}a${index}`;
        return (
          <div key={item.q} className={isOpen ? "qa is-open" : "qa"}>
            <h3>
              <button
                type="button"
                className="qa-q"
                id={questionId}
                aria-expanded={isOpen}
                aria-controls={answerId}
                onClick={() => toggle(index)}
              >
                {item.q}
                <span className="qa-icon" aria-hidden="true" />
              </button>
            </h3>
            <div className="qa-a" id={answerId} role="region" aria-labelledby={questionId}>
              <div>
                <p>{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
