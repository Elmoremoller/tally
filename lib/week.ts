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

export const AI_TOOLS = ["chatgpt", "copilot", "gemini", "claude", "not_sure"] as const;
export type AiTool = (typeof AI_TOOLS)[number];
export const toolLabels: Record<AiTool, string> = {
  chatgpt: "ChatGPT",
  copilot: "Copilot",
  gemini: "Gemini",
  claude: "Claude",
  not_sure: "Not sure",
};

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
/** At most this many tasks come out of her answers. */
export const TASKS_MAX = 7;

export type WeekTask = { id: string; name: string; pile: Pile; hours: number };

/** To the nearest half hour, between 0 and max. */
export const halfHours = (value: number, max: number) => Math.min(Math.max(Math.round(value * 2) / 2, 0), max);

/** The hours she spends on work nobody notices: her hours for the tasks to hand to AI and to hand back. */
export const hoursNobodyNotices = (tasks: readonly { pile: Pile; hours: number }[]) =>
  tasks.filter((t) => t.pile !== "keep_visible").reduce((sum, t) => sum + t.hours, 0);

/** "9.5 hours", "1 hour", "0 hours". */
export const hoursText = (hours: number) => `${Number.isInteger(hours) ? hours : hours.toFixed(1)} ${hours === 1 ? "hour" : "hours"}`;
