import type { ReactNode } from "react";
import { Lock } from "@/components/icons";
import { planParts, type PlanPartId } from "@/lib/landing";
import { paywallCopy, planCopy, previewCopy } from "@/lib/plan-copy";
import {
  hoursNobodyNotices,
  hoursText,
  PILES,
  pileLabels,
  profileTool,
  promptTasks,
  shouldAsk,
  type AiPolicy,
  type AiTool,
  type WeekTask,
} from "@/lib/week";

type Task = Pick<WeekTask, "name" | "pile" | "hours">;

const partName = (id: PlanPartId) => planParts.parts.find((p) => p.id === id)!.title;

/** Biggest first, by her own hours. */
const biggest = (tasks: Task[]) => [...tasks].sort((a, b) => b.hours - a.hours);

function Card({ id, children }: { id: PlanPartId; children: ReactNode }) {
  return (
    <li className="peek-card">
      <h3 className="peek-part">{partName(id)}</h3>
      {children}
    </li>
  );
}

/** Where the plan writer's words go: stand-in words, blurred and hidden from screen readers, under a lock. */
function Locked() {
  return (
    <div className="peek-lock">
      <p className="peek-lock-words" aria-hidden="true">
        {previewCopy.standIn}
      </p>
      <p className="peek-lock-line">
        <span>
          <Lock />
          {previewCopy.lock}
        </span>
      </p>
    </div>
  );
}

/**
 * A look at her plan before she pays: one card per part, in the plan page's order. What comes from her answers
 * shows in clear (her tasks, her hours, her tool, her core work); the scripts, profile and prompts, which are
 * only written after checkout, sit behind a lock. The prompt tasks and the ask line come
 * from the same rules the plan writer uses.
 */
export function PlanPreview({ tasks, aiTools, aiPolicy }: { tasks: Task[]; aiTools: AiTool[]; aiPolicy: AiPolicy | null }) {
  const handBack = biggest(tasks.filter((t) => t.pile === "hand_back"));
  const core = tasks.filter((t) => t.pile === "keep_visible");
  const handedOff = biggest(tasks.filter((t) => t.pile !== "keep_visible"));
  const prompts = promptTasks(tasks);
  const rules = aiPolicy === "encouraged" || aiPolicy === "restricted" ? previewCopy.rules[aiPolicy] : null;
  const ask = !aiPolicy || !rules || shouldAsk({ aiTools, aiPolicy });

  return (
    <ol className="peek">
      <Card id="audit">
        {handBack.length ? (
          <>
            <p className="peek-title">{paywallCopy.handBack(handBack[0].name)}</p>
            <Locked />
            {handBack.length > 1 ? (
              <p className="peek-text">{previewCopy.moreScripts(handBack.slice(1).map((t) => t.name))}</p>
            ) : null}
          </>
        ) : (
          <>
            <p className="peek-title">{previewCopy.piles}</p>
            <ul className="peek-chips">
              {PILES.map((pile) => (
                <li key={pile}>
                  {pileLabels[pile]} <b>{tasks.filter((t) => t.pile === pile).length}</b>
                </li>
              ))}
            </ul>
          </>
        )}
      </Card>

      <Card id="hours">
        <p className="peek-title">{planCopy.hoursTitle(hoursNobodyNotices(tasks))}</p>
        <p className="peek-text">{handedOff.length ? planCopy.hours.text : planCopy.hoursNone}</p>
        {handedOff.length ? (
          <ul className="plan-hours">
            {handedOff.map((task) => (
              <li key={task.name}>
                <span>{task.name}</span>
                <b>{hoursText(task.hours)}</b>
              </li>
            ))}
          </ul>
        ) : null}
      </Card>

      <Card id="setup">
        <p className="peek-title">{planCopy.profileLabel(profileTool(aiTools))}</p>
        <p className="peek-text">{ask ? previewCopy.rulesAsk : rules}</p>
        <Locked />
      </Card>

      <Card id="handoff">
        {prompts.length ? (
          <>
            <p className="peek-title">{previewCopy.prompts(prompts.length)}</p>
            <ul className="peek-chips">
              {prompts.map((task) => (
                <li key={task.name}>{task.name}</li>
              ))}
            </ul>
            <Locked />
          </>
        ) : (
          <p className="peek-text">{planCopy.promptsNone}</p>
        )}
      </Card>

      <Card id="visibility">
        <p className="peek-title">{previewCopy.projectTitle}</p>
        {core.length ? (
          <ul className="peek-chips">
            {core.map((task) => (
              <li key={task.name}>{task.name}</li>
            ))}
          </ul>
        ) : null}
        <p className="peek-text">{previewCopy.projectLine}</p>
        <Locked />
      </Card>
    </ol>
  );
}
