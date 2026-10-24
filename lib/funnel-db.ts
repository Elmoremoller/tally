import { supabaseAdmin } from "./supabase";

// Worth Her Time's tables, as supabase/migrations/20261024120000_worth_her_time.sql makes them, and the
// calls that write them. Server only: every call uses the secret key. The types are written by hand, since
// the database lives in an account the type generator here can't reach. Keep them in step with the SQL.

export type Pile = "hand_to_ai" | "hand_back" | "keep_visible";
export type AiTool = "chatgpt" | "copilot" | "gemini" | "claude" | "not_sure";
export type AiPolicy = "encouraged" | "unclear" | "restricted" | "no_idea";
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
  known_for_text: string | null;
  follow_up_question: string | null;
  follow_up_answer: string | null;
  ai_tools: AiTool[] | null;
  ai_policy: AiPolicy | null;
  role_summary: string | null;
  known_for_summary: string | null;
  prompt_version: string | null;
  model: string | null;
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
  answers: { job: string; week: string; knownFor: string; aiTools: AiTool[]; aiPolicy: AiPolicy },
) =>
  call<void>("save_answers", {
    p_session_id: sessionId,
    p_job_text: answers.job,
    p_week_text: answers.week,
    p_known_for_text: answers.knownFor,
    p_ai_tools: answers.aiTools,
    p_ai_policy: answers.aiPolicy,
  });

/** False once the session has had its three AI readings. */
export const useIntakeCall = (sessionId: string) => call<boolean>("use_intake_call", { p_session_id: sessionId });

export const saveIntakeResult = (
  sessionId: string,
  result: {
    roleSummary: string;
    knownForSummary: string;
    followUpQuestion: string | null;
    promptVersion: string;
    model: string;
    tasks: { name: string; pile: Pile; estimated_hours: number }[];
  },
) =>
  call<void>("save_intake_result", {
    p_session_id: sessionId,
    p_role_summary: result.roleSummary,
    p_known_for_summary: result.knownForSummary,
    p_follow_up_question: result.followUpQuestion,
    p_prompt_version: result.promptVersion,
    p_model: result.model,
    p_tasks: result.tasks,
  });

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
