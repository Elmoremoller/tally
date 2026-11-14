import type { ChatTool } from "../week";

// Setup cards: checked click paths for the paid path (docs/DIRECTION.md, Phase 3). The model never writes
// menu or button names. In Phase 4 it picks cards by id from a list the code gives it, and the code rejects
// any id that is not in CARD_IDS. Each card was checked against the vendor's own help pages on the date in
// `checked`, and the daily run flags any card older than 30 days (BACKLOG.md). A step goes in only when the
// linked page says it: a card with no steps for a device means the page gives none for that device.
// Every title, step and note here is a DRAFT until Karl approves it. Imports nothing from the server.

/** The tools with cards. Other tools get the path without click paths, and the path says so. */
export const CARD_TOOLS = ["chatgpt", "claude"] as const satisfies readonly ChatTool[];
export type CardTool = (typeof CARD_TOOLS)[number];

/** Get started on phone and computer, save instructions about yourself, a project with instructions and examples. */
export const CARD_SETUPS = ["get_started", "about_you", "project"] as const;
export type CardSetup = (typeof CARD_SETUPS)[number];

export type CardId = `${CardTool}_${CardSetup}`;

export type SetupCard = {
  id: CardId;
  tool: CardTool;
  setup: CardSetup;
  title: string;
  /** The steps in order, per device. */
  steps: { phone?: string[]; computer?: string[] };
  /** Whether the free plan is enough, and what it limits when that matters. */
  freePlan: { enough: boolean; note?: string };
  /** The day every step was checked, as YYYY-MM-DD. */
  checked: string;
  /** The vendor help pages the steps were checked against. */
  sources: string[];
};

export const setupCards: readonly SetupCard[] = [
  // DRAFT
  {
    id: "chatgpt_get_started",
    tool: "chatgpt",
    setup: "get_started",
    title: "Get ChatGPT ready on your phone and computer",
    steps: {
      phone: [
        "Open the App Store on an iPhone or Google Play on Android and search for OpenAI ChatGPT.",
        "Check that the app comes from OpenAI before you download it.",
        "Open the app and sign up with an email address you own, so your chats are saved.",
        "Type what you need in the message box and send it.",
      ],
      computer: [
        "Go to chatgpt.com in your browser.",
        "Sign up with an email address you own, so your chats are saved.",
        "Type what you need in the message box and send it. Select New chat when you want to start fresh.",
      ],
    },
    freePlan: { enough: true, note: "The free plan has lower message limits than the paid plans." },
    checked: "2026-11-14",
    sources: [
      "https://help.openai.com/en/articles/12677804-what-is-chatgpt-faq",
      "https://help.openai.com/en/articles/9125172-the-chatgpt-home-page",
      "https://help.openai.com/en/articles/8142208-chatgpt-ios-and-android-app-faq",
    ],
  },
  // DRAFT
  {
    id: "chatgpt_about_you",
    tool: "chatgpt",
    setup: "about_you",
    title: "Save instructions about yourself in ChatGPT",
    steps: {
      phone: [
        "Open the sidebar and select your profile icon to open Settings.",
        "Select Customize ChatGPT.",
        "Make sure Enable customization is turned on.",
        "Type your instructions in the Custom Instructions field. They apply to every chat right away.",
      ],
      computer: [
        "Open Settings from the sidebar.",
        "Select Personalization.",
        "Make sure Enable customization is turned on.",
        "Type your instructions in the Custom Instructions field. They apply to every chat right away.",
      ],
    },
    freePlan: { enough: true, note: "The free plan saves up to 1,500 characters of instructions." },
    checked: "2026-11-14",
    sources: [
      "https://help.openai.com/en/articles/8096356-chatgpt-custom-instructions",
      "https://help.openai.com/en/articles/8142208-chatgpt-ios-and-android-app-faq",
      "https://help.openai.com/en/articles/9125172-the-chatgpt-home-page",
    ],
  },
  // DRAFT
  {
    id: "chatgpt_project",
    tool: "chatgpt",
    setup: "project",
    title: "Make a ChatGPT project for a task you repeat",
    steps: {
      computer: [
        "Select New project in the sidebar.",
        "Give the project a name, then pick an icon and a color.",
        "Open the menu with three dots and select Project settings.",
        "Type your instructions for this task, then select Save.",
        "Add your examples to the project by uploading a file or pasting text.",
        "Start a new chat inside the project. It uses your instructions and examples, and no other chat does.",
      ],
    },
    freePlan: { enough: true, note: "The free plan lets you add fewer files to a project than the paid plans." },
    checked: "2026-11-14",
    sources: ["https://help.openai.com/en/articles/10169521-projects-in-chatgpt"],
  },
  // DRAFT
  {
    id: "claude_get_started",
    tool: "claude",
    setup: "get_started",
    title: "Get Claude ready on your phone and computer",
    steps: {
      phone: [
        "Download the Claude app from the App Store on an iPhone or Google Play on Android.",
        "Open the app and create a free account. You need to be 18 or older.",
        "Type what you need in the message box and send it.",
      ],
      computer: [
        "Go to claude.ai in your browser. You can also download Claude Desktop for Mac or Windows.",
        "Create a free account. You need to be 18 or older.",
        "Type what you need in the message box and click the submit button.",
      ],
    },
    freePlan: { enough: true, note: "The free plan has a usage limit that resets every five hours." },
    checked: "2026-11-14",
    sources: ["https://support.claude.com/en/articles/8114491-get-started-with-claude"],
  },
  // DRAFT
  {
    id: "claude_about_you",
    tool: "claude",
    setup: "about_you",
    title: "Save instructions about yourself in Claude",
    steps: {
      computer: [
        "Click your initials in the lower left corner.",
        "Select Settings, then Your Claude. If you see the older Settings page, select Account.",
        "Under Instructions, describe how you work and how you like your answers. On the older page this is called Instructions for Claude.",
        "Claude uses these instructions in all your chats.",
      ],
    },
    freePlan: { enough: true },
    checked: "2026-11-14",
    sources: ["https://support.claude.com/en/articles/10185728-understanding-claude-s-personalization-features"],
  },
  // DRAFT
  {
    id: "claude_project",
    tool: "claude",
    setup: "project",
    title: "Make a Claude project for a task you repeat",
    steps: {
      computer: [
        "Open the left side panel and click Projects, or go to claude.ai/projects.",
        "Click New Project in the upper right corner.",
        "Give the project a name and a description. Claude does not read these.",
        "Click Set project instructions, write how Claude should handle this task, then click Save instructions.",
        "In the project knowledge on the right, click the plus button and add your examples as documents or text.",
        "Start a chat inside the project. Claude uses your instructions and examples in every chat there.",
      ],
    },
    freePlan: { enough: true, note: "The free plan lets you make up to five projects." },
    checked: "2026-11-14",
    sources: ["https://support.claude.com/en/articles/9519177-how-can-i-create-and-manage-projects"],
  },
];

export const CARD_IDS: readonly CardId[] = setupCards.map((card) => card.id);

/** The card with this id, or undefined for an id that is not on the list. */
export const cardById = (id: string): SetupCard | undefined => setupCards.find((card) => card.id === id);
