import { Backdrop } from "@/components/Backdrop";
import { pileNotes, planCopy } from "@/lib/plan-copy";
import type { PlanContent } from "@/lib/plan-writer";
import { checkFirst, hoursNobodyNotices, hoursText, PILES, pileLabels, profileTool } from "@/lib/week";
import { ResendLink } from "./ResendLink";
import { SayBox } from "./SayBox";
import { ScriptTabs } from "./ScriptTabs";

export type WelcomeNote = { email: string; token: string | null };

/** The note at the top right after paying: where the email with her link went, and sending it again. */
export function PlanWelcome({ welcome }: { welcome: WelcomeNote }) {
  return (
    <div className="plan-now">
      <p className="plan-ack">{planCopy.welcomeNote(welcome.email)}</p>
      <ResendLink token={welcome.token} />
    </div>
  );
}

/**
 * Her plan, in the brief's five parts: the work audit with a script for each task to hand back, her hours
 * back from her own numbers, her AI setup, a ready prompt for each busywork task, and her visibility plan.
 * Every script, prompt and the work profile can be changed and copied.
 */
export function PlanPage({ content, welcome }: { content: PlanContent; welcome?: WelcomeNote | null }) {
  const scripts = new Map(content.handBack.map((h) => [h.task, h.script]));
  const handedOff = content.tasks.filter((t) => t.pile !== "keep_visible").sort((a, b) => b.hours - a.hours);
  const total = hoursNobodyNotices(content.tasks);
  // Plans written before 2026-10-24 name one tool.
  const tools = content.tools ?? (content.tool ? [content.tool] : []);
  const approvedFirst = checkFirst(content.policy);
  return (
    <main id="main" className="plan">
      <Backdrop progress={1} />
      <header className="plan-hello">
        <h1 className="plan-title">{planCopy.title}</h1>
        <p className="plan-intro">{content.role}</p>
      </header>

      {welcome ? <PlanWelcome welcome={welcome} /> : null}

      {/* 1. Work audit: her tasks in their piles, with a way to hand back each one that isn't hers */}
      <section className="plan-section" aria-labelledby="audit-title">
        <h2 id="audit-title" className="plan-section-title">
          {planCopy.audit.title}
        </h2>
        <p className="plan-section-text">{planCopy.audit.text}</p>
        <div className="plan-tools">
          {PILES.map((pile) => {
            const tasks = content.tasks.filter((t) => t.pile === pile);
            if (!tasks.length) return null;
            return (
              <div key={pile} className="plan-tool">
                <h3 className="plan-tool-title">{pileLabels[pile]}</h3>
                <p className="plan-tools-line">{pileNotes[pile]}</p>
                <ul className="plan-tasks">
                  {tasks.map((task) => {
                    const script = scripts.get(task.name);
                    return (
                      <li key={task.name}>
                        <p className="plan-task-name">{task.name}</p>
                        {script ? (
                          <div className="plan-try">
                            <p className="plan-try-label">{planCopy.handBackLabel}</p>
                            <SayBox words={script} />
                          </div>
                        ) : null}
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      {/* 2. Hours back: only her own numbers */}
      <section className="plan-today" aria-labelledby="hours-title">
        <div className="plan-today-head">
          <p className="plan-today-label">{planCopy.hoursLabel}</p>
        </div>
        <h2 id="hours-title" className="plan-today-title">
          {planCopy.hoursTitle(total)}
        </h2>
        <p className="plan-notice">{planCopy.hours.text}</p>
        {handedOff.length ? (
          <ul className="plan-hours">
            {handedOff.map((task) => (
              <li key={task.name}>
                <span>{task.name}</span>
                <b>{hoursText(task.hours)}</b>
              </li>
            ))}
          </ul>
        ) : (
          <p className="plan-section-text">{planCopy.hoursNone}</p>
        )}
      </section>

      {/* 3. AI setup: checking what's approved first when she should, her work profile and where to paste it in
          each chat tool she picked (or which tool to start with), safe use rules, and what to ask */}
      <section className="plan-section" aria-labelledby="setup-title">
        <h2 id="setup-title" className="plan-section-title">
          {planCopy.setup.title}
        </h2>
        <p className="plan-section-text">{planCopy.setup.text}</p>
        {approvedFirst ? <p className="plan-ack">{planCopy.checkFirst}</p> : null}
        <figure className="plan-script">
          <p className="plan-script-label">{planCopy.profileLabel(profileTool(tools))}</p>
          {approvedFirst || !tools.length ? <p className="plan-script-lead">{planCopy.profileLead}</p> : null}
          <SayBox words={content.workProfile} />
        </figure>
        {tools.length ? (
          <div className="plan-tool">
            <h3 className="plan-tool-title">{planCopy.pasteTitle(approvedFirst)}</h3>
            <ul className="plan-rules">
              {tools.map((tool) => (
                <li key={tool}>{planCopy.pasteWhere[tool]}</li>
              ))}
            </ul>
            <p className="plan-tools-line">{planCopy.pasteFallback}</p>
          </div>
        ) : null}
        {content.startTool ? (
          <div className="plan-tool">
            <h3 className="plan-tool-title">{planCopy.startTitle}</h3>
            <p>{content.startTool}</p>
          </div>
        ) : null}
        <div className="plan-tool">
          <h3 className="plan-tool-title">{planCopy.rulesTitle}</h3>
          <ul className="plan-rules">
            {content.rules.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
        </div>
        {content.askMessage ? (
          <figure className="plan-script">
            <p className="plan-script-label">{planCopy.askLabel}</p>
            <p className="plan-script-lead">{planCopy.askLead}</p>
            <SayBox words={content.askMessage} />
          </figure>
        ) : null}
      </section>

      {/* 4. Busywork handoff: a ready prompt for each of her biggest tasks to hand to AI */}
      <section className="plan-section" aria-labelledby="handoff-title">
        <h2 id="handoff-title" className="plan-section-title">
          {planCopy.handoff.title}
        </h2>
        <p className="plan-section-text">{content.prompts.length ? planCopy.handoff.text : planCopy.promptsNone}</p>
        <ScriptTabs
          groupLabel={planCopy.promptsGroup}
          tabs={content.prompts.map((p, i) => ({
            id: String(i),
            label: p.task,
            cards: [{ label: planCopy.promptLabel, lead: p.how, words: p.prompt }],
          }))}
        />
      </section>

      {/* 5. Visibility plan: one project for the time she wins back, and how to talk about her AI use */}
      <section className="plan-section" aria-labelledby="visibility-title">
        <h2 id="visibility-title" className="plan-section-title">
          {planCopy.visibility.title}
        </h2>
        <p className="plan-section-text">{planCopy.visibility.text}</p>
        <div className="plan-tool">
          <p className="plan-try-label">{planCopy.projectLabel}</p>
          <h3 className="plan-tool-title">{content.project.title}</h3>
          <p>{content.project.why}</p>
          <p className="plan-try-label">{planCopy.stepsLabel}</p>
          <ol className="plan-steps">
            {content.project.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>
        <figure className="plan-script">
          <p className="plan-script-label">{planCopy.talkLabel}</p>
          <SayBox words={content.aiTalk} />
        </figure>
      </section>

      <footer className="plan-foot">
        <p>{planCopy.keepLink}</p>
      </footer>
    </main>
  );
}
