import { Backdrop } from "@/components/Backdrop";
import { PlanWelcome, type WelcomeNote } from "@/components/plan/PlanPage";
import { SayBox } from "@/components/plan/SayBox";
import { beginnerParts, beginnerPlanCopy as copy, markLabels, sevenDays, toolSite } from "@/lib/beginner/copy";
import type { BeginnerIdea, BeginnerPlan } from "@/lib/beginner/plan-writer";
import { planToolsCopy } from "@/lib/beginner/quiz-copy";
import { hasEmployer } from "@/lib/beginner/types";
import { planCopy } from "@/lib/plan-copy";
import { DoneButton, SevenDays } from "./Ticks";

const part = (id: (typeof beginnerParts.parts)[number]["id"]) => beginnerParts.parts.find((p) => p.id === id)!;

/** One idea, closed until she opens it: its title and mark, then why, and the prompt to change and copy. */
function Idea({ idea }: { idea: BeginnerIdea }) {
  return (
    <li>
      <details className="idea">
        <summary>
          <span className="idea-title">{idea.title}</span>
          {idea.mark ? (
            <span className="idea-mark" data-mark={idea.mark}>
              {markLabels[idea.mark]}
            </span>
          ) : null}
        </summary>
        <div className="idea-body">
          <p>{idea.why}</p>
          <p className="plan-script-label">{copy.ideaPrompt}</p>
          <SayBox words={idea.prompt} />
        </div>
      </details>
    </li>
  );
}

/**
 * The beginner plan, in the order she uses it: her tool, the other tools she named, her first win, ideas for her job, safe use, her seven
 * days with her work profile, and, with an employer, what to send and say at work. Every prompt and message
 * can be changed and copied.
 */
export function BeginnerPlanPage({ content, welcome }: { content: BeginnerPlan; welcome?: WelcomeNote | null }) {
  const tool = toolSite[content.tool];
  const work = content.ideas.filter((i) => !i.life);
  const life = content.ideas.filter((i) => i.life);
  const employed = hasEmployer(content.worksFor);
  const days = sevenDays(work[0]?.title ?? null, life[0]?.title ?? null);
  return (
    <main id="main" className="plan">
      <Backdrop progress={1} />
      <header className="plan-hello">
        <h1 className="plan-title">{copy.title}</h1>
        <p className="plan-intro">{content.role}</p>
      </header>

      {welcome ? <PlanWelcome welcome={welcome} /> : null}

      {/* 1. Her tool: one, by name, and how to open it */}
      <section className="plan-section" aria-labelledby="tool-title">
        <h2 id="tool-title" className="plan-section-title">
          {part("tool").title}
        </h2>
        <div className="plan-tool">
          <p className="plan-try-label">{copy.toolLabel}</p>
          <h3 className="plan-tool-title">{tool.name}</h3>
          <p>{content.toolWhy}</p>
          <p className="plan-try-label">{copy.toolSteps}</p>
          <ol className="plan-steps">
            {tool.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>
      </section>

      {/* 1b. Her other tools, at her level: only when she named any */}
      {content.yourTools?.length ? (
        <section className="plan-section" aria-labelledby="your-tools-title">
          <h2 id="your-tools-title" className="plan-section-title">
            {planToolsCopy.title}
          </h2>
          <div className="plan-tools">
            {content.yourTools.map((t) => (
              <div key={t.name} className="plan-tool">
                <h3 className="plan-tool-title">{t.name}</h3>
                <p>{t.what}</p>
                {t.tryThis ? (
                  <>
                    <p className="plan-try-label">{planToolsCopy.tryThis}</p>
                    <p>{t.tryThis}</p>
                  </>
                ) : null}
                {t.withChat ? (
                  <>
                    <p className="plan-try-label">{planToolsCopy.withChat}</p>
                    <p>{t.withChat}</p>
                  </>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* 2. Her first win: the prompt with her details in it, what a good answer looks like, and what to send when it's off */}
      <section className="plan-today" aria-labelledby="win-title">
        <div className="plan-today-head">
          <p className="plan-today-label">{part("win").title}</p>
          <span className="plan-part">{copy.winLabel}</span>
        </div>
        <h2 id="win-title" className="plan-today-title">
          {content.firstWin.task}
        </h2>
        {content.policy === "restricted" ? <p className="plan-ack">{copy.restricted}</p> : null}
        <figure className="plan-script">
          <p className="plan-script-label">{copy.promptLabel}</p>
          <SayBox words={content.firstWin.prompt} />
        </figure>
        <div className="plan-try">
          <p className="plan-try-label">{copy.exampleLabel}</p>
          <p className="win-example">{content.firstWin.example}</p>
        </div>
        <div className="plan-try">
          <p className="plan-try-label">{copy.fixesLabel}</p>
          <ul className="plan-rules">
            {content.firstWin.fixes.map((fix) => (
              <li key={fix}>{fix}</li>
            ))}
          </ul>
        </div>
        <DoneButton />
      </section>

      {/* 3. Ideas: for her job first, then from daily life */}
      <section className="plan-section" aria-labelledby="ideas-title">
        <h2 id="ideas-title" className="plan-section-title">
          {part("ideas").title}
        </h2>
        <p className="plan-section-text">{employed ? copy.marksNote.employer : copy.marksNote.self}</p>
        <h3 className="ideas-group">{copy.ideasWork}</h3>
        <ul className="ideas">
          {work.map((idea) => (
            <Idea key={idea.title} idea={idea} />
          ))}
        </ul>
        {life.length ? (
          <>
            <h3 className="ideas-group">{copy.ideasLife}</h3>
            <ul className="ideas">
              {life.map((idea) => (
                <Idea key={idea.title} idea={idea} />
              ))}
            </ul>
          </>
        ) : null}
      </section>

      {/* 4. Safe use, in her job's own terms */}
      <section className="plan-section" aria-labelledby="safe-title">
        <h2 id="safe-title" className="plan-section-title">
          {part("safe").title}
        </h2>
        <div className="plan-tool">
          <ul className="plan-rules">
            {content.safeUse.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* 5. Her seven days, and the work profile day three asks for */}
      <section className="plan-section" aria-labelledby="days-title">
        <h2 id="days-title" className="plan-section-title">
          {part("days").title}
        </h2>
        <p className="plan-section-text">{part("days").text}</p>
        <SevenDays days={days} />
        <figure className="plan-script">
          <p className="plan-script-label">{copy.profileLabel}</p>
          <p className="plan-script-lead">{copy.profileLead}</p>
          <SayBox words={content.workProfile} />
        </figure>
      </section>

      {/* 6. At work: only with an employer */}
      {content.atWork ? (
        <section className="plan-section" aria-labelledby="work-title">
          <h2 id="work-title" className="plan-section-title">
            {copy.atWork.title}
          </h2>
          <p className="plan-section-text">{copy.atWork.text}</p>
          <figure className="plan-script">
            <p className="plan-script-label">{copy.askLabel}</p>
            <p className="plan-script-lead">{copy.askLead}</p>
            <SayBox words={content.atWork.askMessage} />
          </figure>
          <figure className="plan-script">
            <p className="plan-script-label">{copy.talkLabel}</p>
            <SayBox words={content.atWork.aiTalk} />
          </figure>
        </section>
      ) : null}

      <footer className="plan-foot">
        <p>{planCopy.keepLink}</p>
      </footer>
    </main>
  );
}
