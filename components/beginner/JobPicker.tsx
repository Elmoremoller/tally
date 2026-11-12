"use client";

import { useState } from "react";
import { Check } from "@/components/icons";
import { beginnerPage } from "@/lib/beginner/copy";

const { list, label } = beginnerPage.jobs;
type WorkId = (typeof list)[number]["id"];

/**
 * The kinds of work she can tap, and under them what Tally could take off her plate in the one she picked, each
 * line tagged with the kind of help it is. The first is open when the page loads, so there is something to
 * read before she taps and without JavaScript. The list is announced when it changes.
 */
export function JobPicker() {
  const [picked, setPicked] = useState<WorkId>(list[0].id);
  const work = list.find((w) => w.id === picked) ?? list[0];
  return (
    <div className="jobs">
      <div className="jobs-tabs" role="group" aria-label={label}>
        {list.map((w) => (
          <button key={w.id} type="button" className="jobs-tab" aria-pressed={w.id === picked} onClick={() => setPicked(w.id)}>
            {w.name}
          </button>
        ))}
      </div>
      <div className="jobs-panel" aria-live="polite">
        <ul className="jobs-list" key={work.id}>
          {work.items.map((item) => (
            <li key={item.text}>
              <Check aria-hidden="true" />
              <span className="jobs-item">{item.text}</span>
              <span className="jobs-chip">{item.kind}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
