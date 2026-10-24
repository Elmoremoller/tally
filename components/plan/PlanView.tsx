import Link from "next/link";
import { signOut } from "@/app/plan/actions";
import { Backdrop } from "@/components/Backdrop";
import { CheckInCard } from "@/components/check-in/CheckInCard";
import { FightHelpBox } from "@/components/fight-help/FightHelpBox";
import type { CheckInId } from "@/lib/check-ins";
import { faqs, method } from "@/lib/content";
import { helpCopy, helpHref, STEP_HELP } from "@/lib/fight-help";
import { checkCopy } from "@/lib/message-check-copy";
import {
  everyoneTopics,
  listOf,
  partNames,
  partnerWord,
  scriptsFor,
  scriptsSection,
  topicLabels,
  typeTips,
  type Part,
  type PlanContext,
} from "@/lib/plan";
import { previewQuery, type PreviewPlan } from "@/lib/preview";
import { AGREE_STEPS, STEP_PARTS, type Ack, type Progress, type ReviewRow, type StepId } from "@/lib/progress";
import { coupleTypes, fightTopics } from "@/lib/quiz";
import { standardCopy } from "@/lib/standard";
import { acks, moments, planCopy, reviewCopy, stepWords, tryText } from "@/lib/steps";
import { AllSteps, type ToolGroup } from "./AllSteps";
import { MessageCheck } from "./MessageCheck";
import { PartnerCard } from "./PartnerCard";
import { StandardCard } from "./StandardCard";
import { TodayCard } from "./TodayCard";
import { TopicScripts } from "./TopicScripts";

/** The FAQ’s answer about safety, word for word. */
const safetyLine = faqs.find((f) => f.q.startsWith("What if"))?.a;
const parts: Part[] = ["prevent", "pause", "repair"];
/** The landing page's line for each part, word for word. */
const partLines = Object.fromEntries(method.map((m) => [m.title.toLowerCase(), m.text])) as Record<Part, string>;

type PlanViewProps = {
  ctx: PlanContext;
  name: string | null;
  role: "owner" | "partner";
  partnerEmail: string | null;
  /** Where they are in their path, from their own answers. */
  progress: Progress;
  /** Ask Did you try it? before showing today's step. */
  reviewDue: boolean;
  /** The answers that moved them on, oldest first. */
  history: ReviewRow[];
  /** The line for the answer they just gave, shown above the next step. */
  ack: Ack | null;
  /** Today's small moment. */
  moment: number;
  /** The check in to ask about under Today's step, if one is due. */
  checkIn?: CheckInId | null;
  /** Set on /plan/preview: the sample plan, so nothing is sent or saved. */
  preview?: PreviewPlan;
};

/**
 * Their plan. It opens on Today's step, or on Did you try it? when it's time to ask, then today's small
 * moment, the steps so far, and every step under Prevent, Pause and Repair. The words for their own fight
 * topics and the message check follow, open from the first day. Everything speaks to their situation,
 * never to what they bought.
 */
export function PlanView({ ctx, name, role, partnerEmail, progress, reviewDue, history, ack, moment, checkIn, preview }: PlanViewProps) {
  const type = coupleTypes[ctx.coupleType];
  const labels = topicLabels(ctx);
  const current = progress.current;
  const today = current ? stepWords(current.stepId, ctx) : null;
  // Tone and Not feeling heard first, for everyone, then their own topics, the one their story was about first.
  const topics = [...everyoneTopics, ...ctx.topics.flatMap((id) => fightTopics.filter((t) => t.id === id))].map((t) => ({
    ...t,
    cards: scriptsFor(ctx, t.id),
  }));
  const done = history.filter((h) => h.outcome !== "not_yet");
  // The help after a fight, and the button four of the steps get into it.
  const nowHref = preview ? `/plan/preview/now?${previewQuery(preview)}` : "/plan/now";
  const standardHref = preview ? `/plan/preview/standard?${previewQuery(preview)}` : "/plan/standard";
  const checkInHref = preview ? `/plan/preview/check-in?${previewQuery(preview)}&checkin=${checkIn}` : "/plan/check-in";
  const stepHelp = (id: StepId) => {
    const go = STEP_HELP[id];
    return go ? { href: helpHref(nowHref, go), label: helpCopy.steps[go] } : null;
  };
  // The guided repair needs them both, so the do it alone versions only get the 20 minutes.
  const todayHelp = current && (current.version === "main" || STEP_HELP[current.stepId] === "pause") ? stepHelp(current.stepId) : null;
  const groups: ToolGroup[] = parts
    .map((part) => ({
      part,
      name: partNames[part],
      line: partLines[part],
      steps: progress.path
        .filter((id) => STEP_PARTS[id] === part)
        .map((id) => {
          const words = stepWords(id, ctx);
          return {
            id,
            title: words.title,
            tryLabel: words.try.kind === "say" ? planCopy.trySaying : planCopy.tryThis,
            tryText: tryText(words.try),
            alone: words.alone,
            help: stepHelp(id),
          };
        }),
    }))
    .filter((g) => g.steps.length);

  return (
    <main id="main" className="plan">
      <Backdrop part={today?.part ?? "repair"} />
      <header className="plan-hello">
        {name ? <p className="plan-eyebrow">Hi {name}</p> : null}
        <h1 className="plan-title">Your plan</h1>
        <p className="plan-intro">
          For the <strong>{type.name}</strong> pattern
          {labels.length ? <>, built around your fights about {listOf(labels)}</> : null}.
        </p>
      </header>

      <FightHelpBox href={nowHref} />

      {current && today ? (
        <TodayCard
          // A new card after every answer, even when the step stays the same (Didn't get to it), so the
          // review starts fresh instead of keeping the last one's state.
          key={`${current.stepId}-${current.version}-${progress.since.getTime()}`}
          stepId={current.stepId}
          version={current.version}
          words={today}
          partName={partNames[today.part]}
          tip={typeTips[ctx.coupleType][today.part]}
          ack={ack ? acks[ack] : null}
          reviewDue={reviewDue}
          agree={AGREE_STEPS.includes(current.stepId) && current.version === "main"}
          help={todayHelp}
          preview={preview ?? null}
        />
      ) : (
        <section className="plan-today" aria-labelledby="done-title">
          <h2 id="done-title" className="plan-today-title">
            {planCopy.doneTitle}
          </h2>
          <p className="plan-notice">{planCopy.doneText}</p>
          {/* At the end of the plan, the Couple Standard is the way on, so it lives on this card. */}
          <Link href={standardHref} className="btn btn-lg plan-standard-open">
            {standardCopy.card.open}
          </Link>
        </section>
      )}

      {checkIn ? <CheckInCard id={checkIn} names={{ me: name, partner: ctx.partnerName }} href={checkInHref} /> : null}

      {current ? <StandardCard href={standardHref} /> : null}

      <section className="plan-section" aria-labelledby="moment-title">
        <h2 id="moment-title" className="plan-section-title">
          {planCopy.moment}
        </h2>
        <p className="plan-section-text">{planCopy.momentText}</p>
        <p className="plan-moment">{moments(ctx)[moment]}</p>
      </section>

      {done.length ? (
        <details className="plan-earlier">
          <summary>Your steps so far</summary>
          <ul>
            {done.map((h) => {
              const words = stepWords(h.stepId, ctx);
              return (
                <li key={`${h.stepId}-${h.version}-${h.at.getTime()}`}>
                  <p className="plan-earlier-part">
                    {partNames[words.part]}
                    {h.version === "alone" ? ` · ${planCopy.alone}` : null}
                  </p>
                  <p className="plan-earlier-title">{words.title}</p>
                  <p className="plan-earlier-outcome">{reviewCopy.outcomes[h.outcome]}</p>
                </li>
              );
            })}
          </ul>
        </details>
      ) : null}

      <AllSteps groups={groups} start={today?.part ?? "prevent"} />

      <section className="plan-section" aria-labelledby="scripts-title">
        <h2 id="scripts-title" className="plan-section-title">
          {scriptsSection.title}
        </h2>
        <p className="plan-section-text">{scriptsSection.text}</p>
        <TopicScripts topics={topics} />
      </section>

      <section className="plan-section" aria-labelledby="check-title">
        <h2 id="check-title" className="plan-section-title">
          {checkCopy.title}
        </h2>
        <p className="plan-section-text">{checkCopy.text(partnerWord(ctx))}</p>
        <MessageCheck preview={preview?.type} partner={partnerWord(ctx)} />
      </section>

      {role === "owner" ? (
        <section className="plan-section" id="partner" aria-labelledby="partner-title">
          <h2 id="partner-title" className="plan-section-title">
            {partnerEmail ? "Your partner" : "Add my partner"}
          </h2>
          {partnerEmail ? null : (
            <p className="plan-section-text">Invite your partner for free, so you both use the same plan.</p>
          )}
          <PartnerCard partnerName={ctx.partnerName} partnerEmail={partnerEmail} preview={preview?.type} />
        </section>
      ) : null}

      <footer className="plan-foot">
        {safetyLine ? <p>{safetyLine}</p> : null}
        {preview ? null : (
          <form action={signOut}>
            <button type="submit" className="link-button">
              Sign out
            </button>
          </form>
        )}
      </footer>
    </main>
  );
}
