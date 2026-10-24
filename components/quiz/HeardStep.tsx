import type { CSSProperties, RefObject } from "react";
import { heardCopy } from "@/lib/questions";
import { PILES, pileLabels, SLIDER_MAX, SLIDER_STEP, type Pile, type WeekTask } from "@/lib/week";

type HeardStepProps = {
  role: string;
  knownFor: string;
  tasks: WeekTask[];
  onTasks: (tasks: WeekTask[]) => void;
  editing: boolean;
  onEditing: (editing: boolean) => void;
  onConfirm: () => void;
  pending: boolean;
  error?: string;
  headingRef: RefObject<HTMLHeadingElement | null>;
};

/**
 * Here's what we heard: her role in one line, each task with its hours on a slider (0 to 15, in half hours),
 * and what she wants to be known for. Edit lets her rename a task, move it to another pile or remove it.
 * The hours she leaves on the sliders are the ones her result and her plan use.
 */
export function HeardStep({ role, knownFor, tasks, onTasks, editing, onEditing, onConfirm, pending, error, headingRef }: HeardStepProps) {
  const change = (id: string, patch: Partial<WeekTask>) => onTasks(tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  return (
    <>
      <h1 ref={headingRef} tabIndex={-1} className="quiz-title">
        {heardCopy.title}
      </h1>
      <p className="quiz-role">{role}</p>

      <h2 className="quiz-check" id="q-week">
        {heardCopy.tasks}
      </h2>
      <p className="quiz-hint">{heardCopy.slider}</p>
      <ul className="quiz-tasks" aria-labelledby="q-week">
        {tasks.map((task) => (
          <li key={task.id} className="quiz-task">
            {editing ? (
              <div className="quiz-task-edit">
                <label className="quiz-field">
                  <span>{heardCopy.name}</span>
                  <input type="text" maxLength={120} value={task.name} onChange={(e) => change(task.id, { name: e.target.value })} />
                </label>
                <div className="quiz-piles" role="group" aria-label={`${heardCopy.pile}, ${task.name}`}>
                  {PILES.map((pile: Pile) => (
                    <button
                      key={pile}
                      type="button"
                      aria-pressed={task.pile === pile}
                      onClick={() => change(task.id, { pile })}
                    >
                      {pileLabels[pile]}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  className="link-button quiz-task-remove"
                  disabled={tasks.length < 2}
                  onClick={() => onTasks(tasks.filter((t) => t.id !== task.id))}
                >
                  {heardCopy.remove}
                  <span className="sr-only"> {task.name}</span>
                </button>
              </div>
            ) : (
              <p className="quiz-task-head">
                <span className="quiz-task-name">{task.name}</span>
                <span className="quiz-task-pile">{pileLabels[task.pile]}</span>
              </p>
            )}
            <label className="quiz-task-hours">
              <span className="quiz-task-amount" aria-hidden="true">
                {heardCopy.perWeek(task.hours)}
              </span>
              <input
                type="range"
                className="quiz-slider"
                min={0}
                max={SLIDER_MAX}
                step={SLIDER_STEP}
                value={task.hours}
                aria-label={`${task.name}, hours a week`}
                aria-valuetext={heardCopy.perWeek(task.hours)}
                style={{ "--fill": `${(task.hours / SLIDER_MAX) * 100}%` } as CSSProperties}
                onChange={(e) => change(task.id, { hours: Number(e.target.value) })}
              />
            </label>
          </li>
        ))}
      </ul>

      <h2 className="quiz-check" id="q-known">
        {heardCopy.knownFor}
      </h2>
      <p className="quiz-role">{knownFor}</p>

      {error ? (
        <p className="quiz-error" role="alert">
          {error}
        </p>
      ) : null}
      <div className="quiz-confirm quiz-confirm-end">
        <button
          type="button"
          className="btn btn-lg"
          disabled={pending || tasks.some((t) => !t.name.trim())}
          onClick={onConfirm}
        >
          {heardCopy.yes}
        </button>
        <button type="button" className="btn btn-lg btn-quiet" onClick={() => onEditing(!editing)}>
          {editing ? heardCopy.doneEditing : heardCopy.edit}
        </button>
      </div>
    </>
  );
}
