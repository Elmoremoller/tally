// The rules for her week, shared by the quiz screens, the server and the AI: the three piles, the AI tools
// and policies she can pick, the limits, and the hours sums. Imports nothing, so the browser, the server and
// a Node script can all use it.

export const PILES = ["hand_to_ai", "hand_back", "keep_visible"] as const;
export type Pile = (typeof PILES)[number];

/** How each pile is named on screen. */
export const pileLabels: Record<Pile, string> = {
  hand_to_ai: "Hand to AI",
  hand_back: "Hand back",
  keep_visible: "Keep visible",
};

/** The AI tools question's chips, in order. */
export const AI_TOOLS = ["chatgpt", "copilot", "gemini", "claude", "other", "none_yet", "not_sure"] as const;
export type AiTool = (typeof AI_TOOLS)[number];
export const toolLabels: Record<AiTool, string> = {
  chatgpt: "ChatGPT",
  copilot: "Copilot",
  gemini: "Gemini",
  claude: "Claude",
  other: "Other",
  none_yet: "None yet",
  not_sure: "Not sure",
};
/** The chat tools her work profile can be pasted into. */
export const CHAT_TOOLS = ["chatgpt", "copilot", "gemini", "claude"] as const;
export type ChatTool = (typeof CHAT_TOOLS)[number];
/** None yet and Not sure each go on their own: picking one clears the rest, picking anything else clears them. */
export const SOLO_TOOLS = ["none_yet", "not_sure"] as const;
/** Longest answer in the field under Other, in characters. */
export const OTHER_TOOLS_MAX = 200;

export const AI_POLICIES = ["encouraged", "unclear", "restricted", "no_idea"] as const;
export type AiPolicy = (typeof AI_POLICIES)[number];
export const policyLabels: Record<AiPolicy, string> = {
  encouraged: "Encouraged",
  unclear: "Unclear",
  restricted: "Restricted",
  no_idea: "No idea",
};

/** Longest answer to an open question, in characters. */
export const ANSWER_MAX = 1500;
/** The AI's estimates stay conservative: at most this many hours a week for one task, and for all of them. */
export const TASK_HOURS_MAX = 8;
export const TOTAL_HOURS_MAX = 20;
/** Her own number for a task, on the slider: 0 to 15 hours a week, in half hour steps. */
export const SLIDER_MAX = 15;
export const SLIDER_STEP = 0.5;
/** At most this many tasks come out of her answers, and at most this many of them from her extra work. */
export const TASKS_MAX = 7;
export const EXTRA_TASKS_MAX = 3;

/** `extra` is true for a task from the third question: work she got pulled into that isn't really her job. */
export type WeekTask = { id: string; name: string; pile: Pile; hours: number; extra: boolean };

/** To the nearest half hour, between 0 and max. */
export const halfHours = (value: number, max: number) => Math.min(Math.max(Math.round(value * 2) / 2, 0), max);

/** The hours she spends on work nobody notices: her hours for the tasks to hand to AI and to hand back. */
export const hoursNobodyNotices = (tasks: readonly { pile: Pile; hours: number }[]) =>
  tasks.filter((t) => t.pile !== "keep_visible").reduce((sum, t) => sum + t.hours, 0);

/** "9.5 hours", "1 hour", "0 hours". */
export const hoursText = (hours: number) => `${Number.isInteger(hours) ? hours : hours.toFixed(1)} ${hours === 1 ? "hour" : "hours"}`;

// What her plan will hold, shared by the plan writer and the preview under the paywall, so the preview shows
// exactly the tasks and the ask line the plan gets.

/** At most this many tasks get a ready prompt: her biggest ones to hand to AI. */
export const PROMPTS_MAX = 5;

/** The chat tools she picked, in the chips' order: her work profile goes into each. */
export const chatTools = (tools: readonly AiTool[]) => CHAT_TOOLS.filter((t) => tools.includes(t));

/** The tool her work profile is named for: the only chat tool she picked, or null when she picked none or several. */
export const profileTool = (tools: readonly AiTool[]) => {
  const chat = chatTools(tools);
  return chat.length === 1 ? chat[0] : null;
};

/** With Restricted or No idea, she checks which tool is approved before she starts. */
export const checkFirst = (policy: AiPolicy) => policy === "restricted" || policy === "no_idea";

/**
 * She should ask what's approved when her company's view isn't Encouraged, or when she picked no chat tool
 * (None yet, Not sure, or only Other).
 */
export const shouldAsk = (input: { aiTools: readonly AiTool[]; aiPolicy: AiPolicy }) =>
  input.aiPolicy !== "encouraged" || !chatTools(input.aiTools).length;

/** Her tasks to hand to AI that get a prompt: the biggest first, at most five. */
export const promptTasks = <T extends { pile: Pile; hours: number }>(tasks: readonly T[]) =>
  tasks
    .filter((t) => t.pile === "hand_to_ai")
    .sort((a, b) => b.hours - a.hours)
    .slice(0, PROMPTS_MAX);
