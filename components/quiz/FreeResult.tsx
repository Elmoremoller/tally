import type { ReactNode, RefObject } from "react";
import { resultCopy } from "@/lib/questions";
import { hoursNobodyNotices, hoursText, PILES, pileLabels, type WeekTask } from "@/lib/week";

/**
 * The free result: how many hours a week she spends on work nobody notices (her own hours for the tasks to
 * hand to AI and to hand back), big, with the underline drawn under it, then her tasks in their piles,
 * names only. The scripts, prompts and setup are what the plan adds. `children` is what comes after it.
 */
export function FreeResult({
  tasks,
  headingRef,
  children,
}: {
  tasks: Pick<WeekTask, "name" | "pile" | "hours">[];
  headingRef?: RefObject<HTMLHeadingElement | null>;
  children?: ReactNode;
}) {
  const piles = PILES.map((pile) => ({ pile, names: tasks.filter((t) => t.pile === pile).map((t) => t.name) })).filter(
    (p) => p.names.length,
  );
  return (
    <div className="quiz-step quiz-reveal" data-dir="forward">
      <p className="quiz-eyebrow">{resultCopy.lead}</p>
      <h1 ref={headingRef} tabIndex={-1} className="quiz-type">
        <strong className="smile">{hoursText(hoursNobodyNotices(tasks))}</strong>
      </h1>
      <p className="quiz-moment">{resultCopy.line}</p>
      <div className="quiz-result-piles">
        {piles.map(({ pile, names }) => (
          <div key={pile} className="quiz-built">
            <p>{pileLabels[pile]}</p>
            <ul>
              {names.map((name) => (
                <li key={name}>{name}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      {children}
    </div>
  );
}
