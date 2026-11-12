import { supabaseAdmin } from "./supabase";
import type { BeginnerPlanInput } from "./beginner/plan-writer";
import { IDEAS_SHOWN, type BeginnerIntake } from "./beginner/types";
import type { PlanInput } from "./plan-writer";
import type { AiPolicy, AiTool, Pile } from "./week";

// Tally's tables, as supabase/migrations/20261024120000_worth_her_time.sql makes them (with
// 20261024140000_extra_work_and_ai_tools.sql on top), and the calls that write them. Server only: every call
// uses the secret key. The types are written by hand, since the database lives in an account the type
// generator here can't reach. Keep them in step with the SQL.

export type { AiPolicy, AiTool, Pile };
export type SessionStatus = "started" | "completed" | "paid";
export type PlanStatus = "pending" | "ready" | "failed";
export type EventName =
  | "landing_view"
  | "quiz_start"
  | "quiz_step_complete"
  | "quiz_complete"
  | "result_view"
  | "paywall_view"
  | "checkout_start"
  | "purchase"
  | "plan_view"
  | "wins_log_click";

export type SessionRow = {
  id: string;
  created_at: string;
  updated_at: string;
  angle: string;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  last_step: string | null;
  status: SessionStatus;
  email: string | null;
  intake_calls: number;
  checkout_started_at: string | null;
};

export type IntakeRow = {
  session_id: string;
  job_text: string | null;
  week_text: string | null;
  /** The third question as it was until 2026-10-24, kept for the answers saved then. */
  known_for_text: string | null;
  /** The third question since 2026-10-24: what she ends up doing that isn't really her job. */
  extra_work_text: string | null;
  follow_up_question: string | null;
  follow_up_answer: string | null;
  ai_tools: AiTool[] | null;
  /** What she typed under Other. */
  ai_tools_other: string | null;
  ai_policy: AiPolicy | null;
  role_summary: string | null;
  /** Only on answers to the old third question. */
  known_for_summary: string | null;
  prompt_version: string | null;
  model: string | null;
  /** Only on the beginner version's answers (supabase/migrations/20261110120000_beginner.sql). */
  beginner?: BeginnerIntake | null;
  created_at: string;
  updated_at: string;
};

export type TaskRow = {
  id: string;
  session_id: string;
  name: string;
  pile: Pile;
  estimated_hours: number;
  confirmed_hours: number | null;
  /** True for a task from her extra work answer. */
  extra: boolean;
  position: number;
};

export type OrderRow = {
  id: string;
  session_id: string;
  product: "plan" | "wins_log";
  amount_cents: number;
  currency: string;
  status: "paid" | "refunded";
  provider_ref: string;
  email: string;
  created_at: string;
};

export type PlanRow = {
  id: string;
  session_id: string;
  order_id: string;
  access_token: string;
  status: PlanStatus;
  content: unknown;
  prompt_version: string | null;
  model: string | null;
  attempts: number;
  generating_since: string | null;
  last_error: string | null;
  created_at: string;
  ready_at: string | null;
};

export type UtmValues = { source?: string | null; medium?: string | null; campaign?: string | null; content?: string | null };

/** Calls one of the funnel's database functions with the secret key, and throws when it fails. */
async function call<T>(name: string, args: Record<string, unknown>): Promise<T> {
  const { data, error } = await supabaseAdmin().rpc(name, args);
  if (error) throw new Error(`${name} failed: ${error.message}`);
  return data as T;
}

export const startSession = (angle: string, utm: UtmValues) =>
  call<string>("start_session", {
    p_angle: angle,
    p_utm_source: utm.source ?? null,
    p_utm_medium: utm.medium ?? null,
    p_utm_campaign: utm.campaign ?? null,
    p_utm_content: utm.content ?? null,
  });

export const noteStep = (sessionId: string, step: string) => call<void>("note_step", { p_session_id: sessionId, p_step: step });

export const saveAnswers = (
  sessionId: string,
  answers: {
    job: string;
    week: string;
    /** Null on the beginner version, which doesn't ask it. */
    extraWork: string | null;
    aiTools: AiTool[];
    aiToolsOther: string | null;
    /** Null on the beginner version when she works for herself. */
    aiPolicy: AiPolicy | null;
  },
) =>
  call<void>("save_quiz_answers", {
    p_session_id: sessionId,
    p_job_text: answers.job,
    p_week_text: answers.week,
    p_extra_work_text: answers.extraWork,
    p_ai_tools: answers.aiTools,
    p_ai_tools_other: answers.aiToolsOther,
    p_ai_policy: answers.aiPolicy,
  });

/** False once the session has had its three AI readings. */
export const spendIntakeCall = (sessionId: string) => call<boolean>("use_intake_call", { p_session_id: sessionId });

/** False once the session has had its four calls for the beginner quiz's job reading and questions. */
export const spendQuestionCall = (sessionId: string) => call<boolean>("use_question_call", { p_session_id: sessionId });

export const saveIntakeResult = (
  sessionId: string,
  result: {
    roleSummary: string;
    followUpQuestion: string | null;
    promptVersion: string;
    model: string;
    tasks: { name: string; pile: Pile; estimated_hours: number; extra: boolean }[];
  },
) =>
  call<void>("save_intake_result", {
    p_session_id: sessionId,
    p_role_summary: result.roleSummary,
    // Only the old third question had a summary line.
    p_known_for_summary: null,
    p_follow_up_question: result.followUpQuestion,
    p_prompt_version: result.promptVersion,
    p_model: result.model,
    p_tasks: result.tasks,
  });

/** The beginner version's extras beside her answers: who she works for, her first win and her idea titles. */
export async function saveBeginner(sessionId: string, beginner: BeginnerIntake) {
  const { error } = await supabaseAdmin().from("intake").update({ beginner }).eq("session_id", sessionId);
  if (error) throw new Error(`Saving the first win failed: ${error.message}`);
}

export const saveFollowUpAnswer = (sessionId: string, answer: string) =>
  call<void>("save_follow_up_answer", { p_session_id: sessionId, p_answer: answer });

export const confirmTasks = (
  sessionId: string,
  tasks: { id: string; name: string; pile: Pile; confirmed_hours: number }[],
) => call<void>("confirm_tasks", { p_session_id: sessionId, p_tasks: tasks });

export const noteSessionCheckout = (sessionId: string) => call<void>("note_session_checkout", { p_session_id: sessionId });

export type RecordedOrder = { order_id: string; plan_id: string | null; access_token: string | null; first: boolean };

/** Safe to call twice for the same Checkout: `first` is true only the first time. */
export const recordOrder = (order: {
  providerRef: string;
  sessionId: string;
  product: "plan" | "wins_log";
  amountCents: number;
  currency: string;
  email: string;
}) =>
  call<RecordedOrder>("record_order", {
    p_provider_ref: order.providerRef,
    p_session_id: order.sessionId,
    p_product: order.product,
    p_amount_cents: order.amountCents,
    p_currency: order.currency,
    p_email: order.email,
  });

export const claimPlanGeneration = (planId: string) => call<boolean>("claim_plan_generation", { p_plan_id: planId });

export const savePlan = (planId: string, content: unknown, promptVersion: string, model: string) =>
  call<void>("save_plan", { p_plan_id: planId, p_content: content, p_prompt_version: promptVersion, p_model: model });

export const failPlan = (planId: string, error: string) => call<void>("fail_plan", { p_plan_id: planId, p_error: error });

export const logEvent = (name: EventName, sessionId: string | null, angle: string, props: Record<string, unknown> = {}) =>
  call<void>("log_event", { p_session_id: sessionId, p_name: name, p_angle: angle, p_props: props });

/** A plan by its access token. Anything that doesn't look like one of ours never reaches the database. */
export async function planByToken(token: string): Promise<PlanRow | null> {
  if (!/^[0-9a-f]{43,128}$/i.test(token)) return null;
  const { data, error } = await supabaseAdmin().from("plans").select("*").eq("access_token", token).maybeSingle();
  if (error) throw new Error(`Loading a plan failed: ${error.message}`);
  return data as PlanRow | null;
}

export async function planById(id: string): Promise<PlanRow | null> {
  const { data, error } = await supabaseAdmin().from("plans").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(`Loading a plan failed: ${error.message}`);
  return data as PlanRow | null;
}

export async function planForSession(sessionId: string): Promise<PlanRow | null> {
  const { data, error } = await supabaseAdmin().from("plans").select("*").eq("session_id", sessionId).maybeSingle();
  if (error) throw new Error(`Loading a plan failed: ${error.message}`);
  return data as PlanRow | null;
}

/** Her most recent plan, for opening it from the sign in email. */
export async function latestPlanForEmail(email: string): Promise<PlanRow | null> {
  const db = supabaseAdmin();
  const { data: orders, error } = await db
    .from("orders")
    .select("id")
    .eq("email", email.toLowerCase())
    .eq("product", "plan")
    .order("created_at", { ascending: false })
    .limit(1);
  if (error) throw new Error(`Finding a plan failed: ${error.message}`);
  if (!orders?.length) return null;
  const { data, error: planError } = await db.from("plans").select("*").eq("order_id", orders[0].id).maybeSingle();
  if (planError) throw new Error(`Finding a plan failed: ${planError.message}`);
  return data as PlanRow | null;
}

/** The email a plan was bought with. */
export async function orderEmail(orderId: string): Promise<string | null> {
  const { data, error } = await supabaseAdmin().from("orders").select("email").eq("id", orderId).maybeSingle();
  if (error) throw new Error(`Loading an order failed: ${error.message}`);
  return (data?.email as string | undefined) ?? null;
}

/**
 * What the plan writer needs: her answers, her role and her tasks with the hours she confirmed. Answers saved
 * before 2026-10-24 have no extra work answer; their plan is written without one.
 */
export async function loadPlanInput(plan: PlanRow): Promise<PlanInput> {
  const { intake, tasks } = await loadWeek(plan.session_id);
  if (!intake?.job_text || !intake.week_text || !intake.ai_tools || !intake.ai_policy) {
    throw new Error("Her answers are missing");
  }
  if (!intake.role_summary || !tasks.length) throw new Error("Her quiz isn't finished");
  return {
    job: intake.job_text,
    week: intake.week_text,
    extraWork: intake.extra_work_text,
    followUp:
      intake.follow_up_question && intake.follow_up_answer
        ? { question: intake.follow_up_question, answer: intake.follow_up_answer }
        : null,
    role: intake.role_summary,
    aiTools: intake.ai_tools,
    aiToolsOther: intake.ai_tools_other,
    aiPolicy: intake.ai_policy,
    tasks: tasks.map((t) => ({ name: t.name, pile: t.pile, hours: t.confirmed_hours ?? t.estimated_hours, extra: t.extra })),
  };
}

/**
 * What the beginner plan writer needs: every screen she answered and what she most wants to make easier, from
 * the context quiz (v2). Her tasks to hand to AI are the ones a chat assistant can help with.
 */
export async function loadBeginnerPlanInput(plan: PlanRow): Promise<BeginnerPlanInput> {
  const { intake, tasks } = await loadWeek(plan.session_id);
  const beginner = intake?.beginner;
  if (!intake?.job_text || !intake.ai_tools || beginner?.v !== 2) throw new Error("Her answers are missing");
  if (!intake.role_summary || !tasks.length) throw new Error("Her quiz isn't finished");
  return {
    job: intake.job_text,
    qas: beginner.qas,
    mostWanted: beginner.mostWanted,
    followUp:
      intake.follow_up_question && intake.follow_up_answer
        ? { question: intake.follow_up_question, answer: intake.follow_up_answer }
        : null,
    role: intake.role_summary,
    worksFor: beginner.worksFor,
    experience: beginner.experience,
    aiTools: intake.ai_tools,
    aiToolsOther: intake.ai_tools_other,
    aiPolicy: intake.ai_policy,
    tasks: tasks.map((t) => ({ name: t.name, ai: t.pile === "hand_to_ai", private: beginner.privateTasks.includes(t.name) })),
    firstWin: beginner.firstWin,
    shownIdeas: beginner.ideas.slice(0, IDEAS_SHOWN),
  };
}

/** One session as the quiz and its result read it: the session, her answers, and her tasks in order. */
export async function loadWeek(sessionId: string) {
  const db = supabaseAdmin();
  const [session, intake, tasks] = await Promise.all([
    db.from("sessions").select("*").eq("id", sessionId).maybeSingle(),
    db.from("intake").select("*").eq("session_id", sessionId).maybeSingle(),
    db.from("tasks").select("*").eq("session_id", sessionId).order("position"),
  ]);
  const error = session.error ?? intake.error ?? tasks.error;
  if (error) throw new Error(`Loading session failed: ${error.message}`);
  return {
    session: session.data as SessionRow | null,
    intake: intake.data as IntakeRow | null,
    tasks: ((tasks.data ?? []) as TaskRow[]).map((t) => ({
      ...t,
      estimated_hours: Number(t.estimated_hours),
      confirmed_hours: t.confirmed_hours === null ? null : Number(t.confirmed_hours),
      // Before the migration that added it, every task was from her week.
      extra: t.extra === true,
    })),
  };
}
