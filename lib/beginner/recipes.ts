import { CARD_IDS, type CardId } from "./cards";

// Workflow recipes: checked ways to change how one kind of task gets done (docs/DIRECTION.md, sections 2 and
// 4, Phase 4). A recipe is the thing she buys; the setup cards in cards.ts are building blocks a recipe can
// point to. The model never writes setup steps. From Phase 5 the code picks recipes by id for her map and
// path, and rejects any id that is not in RECIPE_IDS.
//
// Every step was checked against the vendor's own help pages on the date in `checked`, and the daily run flags
// any recipe older than 30 days (BACKLOG.md). A step goes in only when a linked page says it: a route with no
// steps for a device means the pages give none for that device. Steps about Tally's own material ("paste the
// instructions Tally wrote for you") are Tally's, not the vendor's.
//
// Every title, step, note and line of copy here is a DRAFT until Karl approves it. Imports nothing from the server.

/** The five levels a task can get, in the plain words of DIRECTION.md, section 3. */
export const LEVELS = {
  1: "Stays yours",
  2: "Write it with AI",
  3: "Build once, reuse",
  4: "Inside your apps",
  5: "Runs with your OK",
} as const;
export type Level = keyof typeof LEVELS;
/** Recipes exist for the levels where the way a task gets done changes. */
export type RecipeLevel = Extract<Level, 3 | 4 | 5>;

/**
 * The kinds of task a recipe is for. In Phase 5 the intake gives each task one of these, and the code checks it
 * against this list before it looks for a recipe.
 */
export const TASK_KINDS = [
  "repeat_texts",
  "repeat_writing",
  "spoken_writing",
  "notes_to_table",
  "repeat_emails",
  "email_replies",
  "email_follow_ups",
  "awaiting_replies",
] as const;
export type TaskKind = (typeof TASK_KINDS)[number];

/** What each kind means, for the intake prompt in Phase 5 and for anyone reading the recipes. */
export const taskKindMeaning: Record<TaskKind, string> = {
  repeat_texts: "Short messages she sends again and again by text or chat, with the same few answers.",
  repeat_writing: "One kind of writing she does often, like quotes, posts, listings or summaries.",
  spoken_writing: "Writing she could explain out loud faster than she could type it.",
  notes_to_table: "Notes, lists or replies she copies into a sheet by hand.",
  repeat_emails: "The same few emails she writes again and again.",
  email_replies: "Replies to emails in her inbox that each need a little thought.",
  email_follow_ups: "Writing the emails that chase people who have not answered.",
  awaiting_replies: "Keeping track of who still owes her an answer by email.",
};

/**
 * The apps a route needs. `any_chat` is whichever chat tool she uses, for a step where any of them can write
 * the material once. `gboard` is Google's keyboard on Android.
 */
export const RECIPE_APPS = ["iphone", "gboard", "gmail", "google_sheets", "chatgpt", "claude", "any_chat"] as const;
export type RecipeApp = (typeof RECIPE_APPS)[number];

/** A step is a line of text, or a setup card whose steps go here in full. */
export type RecipeStep = string | { card: CardId };

/** One way to set the recipe up, for the apps it names. A recipe has a route per app she might use. */
export type RecipeRoute = {
  apps: RecipeApp[];
  steps: { phone?: RecipeStep[]; computer?: RecipeStep[] };
  /** Something true of this route only, like a device it does not work on. */
  note?: string;
};

/**
 * What must be true of her for the code to offer this recipe (DIRECTION.md, section 2, "How the level is
 * chosen"). The task's own private flag is checked against `taskContent` in Phase 5.
 */
export type RecipeConditions = {
  /** She must be allowed to use AI for this work. False when AI only writes general wording once, with nothing from her work. */
  needsAiAllowed: boolean;
  /** AI works inside one of her apps, so she must control that app or be allowed to connect it. */
  connectsApp: boolean;
  /**
   * Where the task's own content goes. `none`: AI never sees it. `in_app`: AI reads it inside the app that
   * already holds it. `chat_tool`: it goes into her chat tool, so a task with other people's private details
   * gets this recipe only when she controls the tool.
   */
  taskContent: "none" | "in_app" | "chat_tool";
};

export type Recipe = {
  id: string;
  kind: TaskKind;
  level: RecipeLevel;
  /** The workflow as the offer names it. */
  title: string;
  conditions: RecipeConditions;
  routes: RecipeRoute[];
  /** What Tally writes for her, one line per piece. */
  material: string[];
  /** Trying it on three real ones: what to try it on, what good looks like, and three lines to send when it is off. */
  test: { tryOn: string; good: string; fixes: [string, string, string] };
  /** What she always checks herself before anything goes out. */
  approval: string;
  /** Whether the free plan is enough, and the line that says what it costs. Null when the vendor's page does not say. */
  cost: { freePlanEnough: boolean | null; note: string };
  /** The day every step was checked, as YYYY-MM-DD. */
  checked: string;
  /** The vendor help pages the steps were checked against. */
  sources: string[];
};

const IOS_TEXT_REPLACEMENT = "https://support.apple.com/guide/iphone/use-text-replacements-iph6d01d862/ios";
const GBOARD_CLIPBOARD = "https://support.google.com/gboard/answer/10742542?hl=en";
const SHEETS_IMPORT = "https://support.google.com/docs/answer/40608?hl=en";

/** The last steps of a table recipe on a computer, the same for every chat tool. */
const importToSheets: RecipeStep[] = [
  "Open your spreadsheet in Google Sheets.",
  "At the top, click File, then Import.",
  "Choose the file, pick Insert new sheets or Append rows to current sheet, then click Import.",
];

export const recipes: readonly Recipe[] = [
  // DRAFT
  {
    id: "phone_quick_replies",
    kind: "repeat_texts",
    level: 3,
    title: "Your most common replies, saved on your phone",
    conditions: { needsAiAllowed: false, connectsApp: false, taskContent: "none" },
    routes: [
      {
        apps: ["iphone", "any_chat"],
        steps: {
          phone: [
            "Paste the instructions Tally wrote for you into your chat tool. You get your most common replies, each with a short shortcut.",
            "In any app where you can type, touch and hold the Emoji button or the Switch Keyboard key.",
            "Tap Keyboard Settings, then tap Text Replacement.",
            "Tap the Add button.",
            "Type one reply in the Phrase field and its shortcut in the Shortcut field.",
            "Do the same for each reply on your list.",
          ],
        },
      },
      {
        apps: ["gboard", "any_chat"],
        steps: {
          phone: [
            "Paste the instructions Tally wrote for you into your chat tool. You get your most common replies.",
            "Copy one reply.",
            "Open an app you can type in and tap a text field.",
            "At the top of the keyboard, tap Clipboard.",
            "Touch and hold the reply you copied, then tap Pin. Pinned replies stay in the Pinned section.",
            "Do the same for each reply on your list.",
          ],
        },
        note: "This works with Google's keyboard, Gboard, on Android.",
      },
    ],
    material: [
      "Your most common replies, in your own words, with no names, times or private details in them.",
      "A short shortcut for each reply, for an iPhone.",
    ],
    test: {
      tryOn: "The next three messages that need one of these replies.",
      good: "The reply fits after you change at most a name or a time.",
      fixes: [
        "Make this reply shorter and warmer.",
        "Add a line that asks them to confirm.",
        "Rewrite this the way I would say it out loud.",
      ],
    },
    approval: "You read every reply before you send it. Nothing is sent by itself.",
    cost: {
      freePlanEnough: true,
      note: "Text replacement on an iPhone and the Gboard clipboard are free, and the free plan of your chat tool is enough to write the replies once.",
    },
    checked: "2026-11-14",
    sources: [IOS_TEXT_REPLACEMENT, GBOARD_CLIPBOARD],
  },
  // DRAFT
  {
    id: "saved_assistant",
    kind: "repeat_writing",
    level: 3,
    title: "A saved assistant for the writing you repeat",
    conditions: { needsAiAllowed: true, connectsApp: false, taskContent: "chat_tool" },
    routes: [
      {
        apps: ["chatgpt"],
        steps: {
          computer: [
            { card: "chatgpt_project" },
            "Use the instructions and examples Tally wrote for you when the card asks for them.",
            "Each time the task comes up, start a new chat in the project and say what you need.",
          ],
        },
      },
      {
        apps: ["claude"],
        steps: {
          computer: [
            { card: "claude_project" },
            "Use the instructions and examples Tally wrote for you when the card asks for them.",
            "Each time the task comes up, start a new chat in the project and say what you need.",
          ],
        },
      },
    ],
    material: [
      "Instructions for your assistant, with your details, your wording and what to avoid.",
      "Two or three of your own examples, with names and private details taken out.",
    ],
    test: {
      tryOn: "The next three times this task comes up.",
      good: "You change no more than a sentence before you use it.",
      fixes: [
        "This is too long. Keep it to the length of my examples.",
        "You added something I never said. Use only what I gave you.",
        "Match the tone of my second example more closely.",
      ],
    },
    approval: "You read what it wrote and fix anything wrong before you send or post it.",
    cost: {
      freePlanEnough: true,
      note: "The free plans of ChatGPT and Claude are enough. Claude's free plan allows up to five projects.",
    },
    checked: "2026-11-14",
    sources: [
      "https://help.openai.com/en/articles/10169521-projects-in-chatgpt",
      "https://support.claude.com/en/articles/9519177-how-can-i-create-and-manage-projects",
    ],
  },
  // DRAFT
  {
    id: "say_it_out_loud",
    kind: "spoken_writing",
    level: 3,
    title: "Say it out loud, get the finished text",
    conditions: { needsAiAllowed: true, connectsApp: false, taskContent: "chat_tool" },
    routes: [
      {
        apps: ["claude"],
        steps: {
          phone: [
            "Open the Claude app and start a new chat. Paste the opening line Tally wrote for you.",
            "Tap the microphone icon on the right side of the message box. The first time, choose your language.",
            "Say what you need, the way you would tell a colleague.",
            "Tap the arrow to send. Claude writes the finished text from what you said.",
          ],
          computer: [
            "Open the Claude app for Mac and turn on the voice shortcut when it offers it.",
            "Press Caps Lock, say what you need, then press Caps Lock again.",
            "Check the words, then click the arrow to send.",
          ],
        },
        note: "On a computer this works in the Claude app for Mac with macOS 14 or later, not on Windows.",
      },
      {
        apps: ["chatgpt"],
        steps: {
          phone: [
            "Paste the opening line Tally wrote for you into a new chat.",
            "Press the microphone icon and say what you need.",
            "Check the words ChatGPT heard and change anything that is wrong, then send it.",
          ],
          computer: [
            "Paste the opening line Tally wrote for you into a new chat.",
            "Press the microphone icon and say what you need.",
            "Check the words ChatGPT heard and change anything that is wrong, then send it.",
          ],
        },
        note: "OpenAI's page does not say which devices show the microphone icon.",
      },
    ],
    material: [
      "An opening line that tells your chat tool what to turn your words into, with your format and wording.",
      "A short list of what to say each time, so nothing gets left out.",
    ],
    test: {
      tryOn: "The next three times you would have typed this.",
      good: "The text is ready to send after one read, with every detail you said and nothing you did not.",
      fixes: [
        "You left out a detail I said. Put back everything I mentioned.",
        "Use my format from the opening line.",
        "Make it sound less formal, like I wrote it.",
      ],
    },
    approval: "You read the finished text and check every name, number and price before you send it.",
    cost: {
      freePlanEnough: true,
      note: "Dictation in the Claude app is on every plan, including free, and counts toward your normal limits. OpenAI's page does not say whether ChatGPT's free plan limits dictation.",
    },
    checked: "2026-11-14",
    sources: [
      "https://support.claude.com/en/articles/10065434-use-dictation-on-claude-mobile",
      "https://support.claude.com/en/articles/12626668-use-quick-entry-with-claude-desktop-on-mac",
      "https://support.claude.com/en/articles/11101966-use-voice-mode",
      "https://help.openai.com/en/articles/12168547-voice-dictation-faq",
    ],
  },
  // DRAFT
  {
    id: "notes_to_sheet",
    kind: "notes_to_table",
    level: 3,
    title: "Your messy notes, turned into a clean table",
    conditions: { needsAiAllowed: true, connectsApp: false, taskContent: "chat_tool" },
    routes: [
      {
        apps: ["claude", "google_sheets"],
        steps: {
          computer: [
            "In Claude, open Settings, then Capabilities, and turn on Code execution and file creation. In newer settings it is called Create and edit files.",
            "Paste your notes with the instructions Tally wrote for you and ask for a CSV file.",
            "Download the file from the conversation.",
            ...importToSheets,
          ],
        },
      },
      {
        apps: ["chatgpt", "google_sheets"],
        steps: {
          computer: [
            "Paste your notes with the instructions Tally wrote for you and ask for the result as a table.",
            "Click the download button in the top right corner of the table. It saves as a CSV file.",
            ...importToSheets,
          ],
        },
      },
    ],
    material: [
      "Instructions with the columns of your sheet, in order, and how to write each one.",
      "A rule for what to do with a line that does not fit, so nothing is lost.",
    ],
    test: {
      tryOn: "Your next three batches of notes.",
      good: "Every line lands in the right column, and nothing is left out or made up.",
      fixes: [
        "You missed some lines. Count my notes and include every one.",
        "Put the dates in this format, the same in every row.",
        "Leave a cell empty when my notes do not say it. Do not guess.",
      ],
    },
    approval: "You compare the table with your notes before you import it.",
    cost: {
      freePlanEnough: true,
      note: "The free plans of Claude and ChatGPT work, and Google Sheets is free. Making files uses more of your limit, and ChatGPT's free plan has a lower limit for this.",
    },
    checked: "2026-11-14",
    sources: [
      "https://support.claude.com/en/articles/12111783-create-and-edit-files-with-claude",
      "https://help.openai.com/en/articles/9213685-extracting-insights-with-chatgpt-data-analysis",
      SHEETS_IMPORT,
    ],
  },
  // DRAFT
  {
    id: "gmail_templates",
    kind: "repeat_emails",
    level: 3,
    title: "Your most common emails, saved as Gmail templates",
    conditions: { needsAiAllowed: false, connectsApp: false, taskContent: "none" },
    routes: [
      {
        apps: ["gmail", "any_chat"],
        steps: {
          computer: [
            "Paste the instructions Tally wrote for you into your chat tool. You get your most common emails, ready to save.",
            "In Gmail, click Settings at the top right, then See all settings.",
            "Click Advanced at the top, click Enable next to Templates, then click Save Changes at the bottom.",
            "Click Compose and paste one email.",
            "At the bottom of the window, click More options, then Templates, then Save draft as template, then Save as new template.",
            "To use one, click Compose, then More options, then Templates, and pick it under Insert template.",
          ],
        },
        note: "Gmail templates work only on a computer, not in the Gmail phone app.",
      },
    ],
    material: [
      "Your most common emails, in your own words, with a gap in brackets for each detail that changes.",
      "A clear name for each template, so you find it fast.",
    ],
    test: {
      tryOn: "The next three times you would write one of these emails.",
      good: "You fill in the gaps and send it without rewriting anything else.",
      fixes: [
        "This one is too stiff. Make it sound like me.",
        "Split this into two templates, one for each case.",
        "Add a line for the question people always ask next.",
      ],
    },
    approval: "You fill in every gap and read the email before you send it yourself.",
    cost: {
      freePlanEnough: true,
      note: "Gmail templates are free, and the free plan of your chat tool is enough to write them once.",
    },
    checked: "2026-11-14",
    sources: ["https://support.google.com/mail/answer/14864208?hl=en"],
  },
  // DRAFT
  {
    id: "gmail_help_me_write",
    kind: "email_replies",
    level: 4,
    title: "Reply drafts inside Gmail, from Google's own AI",
    conditions: { needsAiAllowed: true, connectsApp: true, taskContent: "in_app" },
    routes: [
      {
        apps: ["gmail"],
        steps: {
          computer: [
            "Open the email in Gmail and click Reply.",
            "Type what you want to say in the prompt bar at the bottom. If you do not see it, click the Help me write icon.",
            "Click Create. To change the tone, click Formalize, Friendly or Shorten.",
            "Read the draft, fix anything that is wrong, then send it yourself.",
          ],
          phone: [
            "Open the email in the Gmail app and reply.",
            "Tap Help me write at the top right.",
            "Type what you want to say and tap Create.",
            "Tap the text to change anything, then tap Insert.",
            "Read the draft, then send it yourself.",
          ],
        },
      },
    ],
    material: [
      "Short starting lines for each kind of reply you send, to type into Help me write.",
      "Notes on your tone, so you know which button to press when a draft sounds off.",
    ],
    test: {
      tryOn: "The next three emails that need a real reply.",
      good: "The draft says what you meant, and you only change a detail or two.",
      fixes: [
        "Shorten this to three sentences.",
        "Make this friendlier but keep the answer the same.",
        "Leave out anything I did not say and keep only my answer.",
      ],
    },
    approval: "Nothing is sent by itself. You read each draft and press Send yourself.",
    cost: {
      freePlanEnough: true,
      note: "Free personal Gmail accounts get Help me write in the US only. Elsewhere it needs a Google AI plan or an eligible Google Workspace plan, and on a work account your company decides.",
    },
    checked: "2026-11-14",
    sources: [
      "https://support.google.com/mail/answer/13955415?hl=en&co=GENIE.Platform%3DDesktop",
      "https://support.google.com/mail/answer/13955415?hl=en&co=GENIE.Platform%3DAndroid",
      "https://support.google.com/mail/answer/13955415?hl=en&co=GENIE.Platform%3DiOS",
      "https://support.google.com/mail/answer/16831098?hl=en",
    ],
  },
  // DRAFT
  {
    id: "gmail_claude_follow_ups",
    kind: "email_follow_ups",
    level: 4,
    title: "Follow ups drafted from your Gmail, sent only with your OK",
    conditions: { needsAiAllowed: true, connectsApp: true, taskContent: "chat_tool" },
    routes: [
      {
        apps: ["claude", "gmail"],
        steps: {
          computer: [
            "In Claude, open Customize, then Connectors, and click the plus button.",
            "Click Gmail, read what it can do, then click Connect.",
            "Sign in with Google and follow the prompts.",
            "In a new chat, click the plus button, point to Connectors and turn on Gmail for that chat.",
            "Paste the instructions Tally wrote for you. Claude finds the emails that need a follow up and drafts each one.",
            "Claude asks for your approval before it sends, replies or forwards anything. Read each draft first.",
          ],
        },
        note: "On a Claude Team or Enterprise plan, an owner must turn on the connector first, and a Google Workspace admin may need to allow Claude.",
      },
      {
        apps: ["chatgpt", "gmail"],
        steps: {
          computer: [
            "In ChatGPT on the web, open Settings, then Plugins, and select Gmail. Some versions call this Apps.",
            "Select Install plugin if you see it, then Connect, and sign in with Google.",
            "Review the permissions Google asks for and finish.",
            "In Settings, then Plugins, then Permissions, choose Always ask.",
            "In a new chat, type @ and pick Gmail, then paste the instructions Tally wrote for you. ChatGPT drafts each follow up in the chat.",
            "Read each draft. You choose whether to send it.",
          ],
        },
        note: "Sending from ChatGPT works on the web, on Plus and higher plans.",
      },
    ],
    material: [
      "Instructions that say which emails count as waiting, how long to wait, and how you chase.",
      "Your follow up wording for a first and a second nudge.",
    ],
    test: {
      tryOn: "The next three people who have not answered you.",
      good: "Each draft goes to the right person, about the right email, in your tone.",
      fixes: [
        "This person already answered. Check the whole thread before you draft.",
        "Make the follow up shorter and do not apologize.",
        "Wait until a week has passed before you draft a follow up.",
      ],
    },
    approval: "Your chat tool asks before it sends anything. You read each draft and approve or send it yourself.",
    cost: {
      freePlanEnough: null,
      note: "Claude's page says the Gmail connector is for all users but does not say whether the free plan is enough. In ChatGPT, sending from the chat needs Plus or a higher plan.",
    },
    checked: "2026-11-14",
    sources: [
      "https://support.claude.com/en/articles/10166901-use-google-workspace-connectors",
      "https://support.claude.com/en/articles/11176164-use-connectors-to-extend-claude-s-capabilities",
      "https://help.openai.com/en/articles/20001494-connecting-and-managing-app-accounts-in-chatgpt",
      "https://help.openai.com/en/articles/20001495-managing-app-permissions-in-chatgpt",
      "https://help.openai.com/en/articles/6825453-chatgpt-release-notes",
    ],
  },
  // DRAFT
  {
    id: "weekly_no_reply_list",
    kind: "awaiting_replies",
    level: 5,
    title: "A weekly list of who has not answered you",
    conditions: { needsAiAllowed: true, connectsApp: true, taskContent: "chat_tool" },
    routes: [
      {
        apps: ["chatgpt", "gmail"],
        steps: {
          computer: [
            "In ChatGPT on the web, open Settings, then Plugins, and connect Gmail. Some versions call this Apps.",
            "In Settings, then Plugins, then Permissions, choose Always ask.",
            "In a new chat, paste the instructions Tally wrote for you. They ask ChatGPT to check your Gmail once a week.",
            "ChatGPT shows the schedule. Check the day and time.",
            "In Settings, then Notifications, pick Push, Email or both, so you see the list when it is ready.",
            "To change or stop it, open Scheduled.",
          ],
        },
        note: "For a phone notification, make the task in the ChatGPT phone app instead.",
      },
      {
        apps: ["claude", "gmail"],
        steps: {
          computer: [
            "In Claude, open Customize, then Connectors, and connect Gmail.",
            "Click Scheduled in the left sidebar, then New task, then Set up manually.",
            "Enter a name and paste the instructions Tally wrote for you.",
            "Set the approval mode to Manually approve and the frequency to Weekly.",
            "Click Save. The task runs even when your computer is asleep.",
          ],
        },
        note: "Scheduled tasks in Claude need a paid plan, Pro or higher. These steps are for Claude Cowork.",
      },
    ],
    material: [
      "Instructions that say which emails count as waiting for an answer, how many days to wait, and what to leave off the list.",
      "The format of your list, with the person, the subject and how long it has been.",
    ],
    test: {
      tryOn: "The first three weekly lists.",
      good: "Every name on the list really owes you an answer, and nobody who does is missing.",
      fixes: [
        "This person already answered. Check the whole thread before you list it.",
        "Leave newsletters and automatic emails off the list.",
        "Only list emails I sent more than five days ago.",
      ],
    },
    approval: "The task only reads your email and gives you a list. Nothing is sent, and you decide who to chase. If a task ever tries to send, it stops and waits for you.",
    cost: {
      freePlanEnough: null,
      note: "ChatGPT's free plan allows three scheduled tasks, but OpenAI's pages do not say whether Gmail works on the free plan. Scheduled tasks in Claude need a paid plan.",
    },
    checked: "2026-11-14",
    sources: [
      "https://help.openai.com/en/articles/10291617-scheduled-tasks-in-chatgpt",
      "https://help.openai.com/en/articles/20001494-connecting-and-managing-app-accounts-in-chatgpt",
      "https://help.openai.com/en/articles/20001495-managing-app-permissions-in-chatgpt",
      "https://support.claude.com/en/articles/13854387-schedule-recurring-tasks-in-claude-cowork",
      "https://support.claude.com/en/articles/10166901-use-google-workspace-connectors",
    ],
  },
];

export const RECIPE_IDS: readonly string[] = recipes.map((recipe) => recipe.id);

/** The recipe with this id, or undefined for an id that is not on the list. */
export const recipeById = (id: string): Recipe | undefined => recipes.find((recipe) => recipe.id === id);

/** Every card a recipe points to, so a check can confirm each one exists. */
export const recipeCards = (recipe: Recipe): CardId[] =>
  recipe.routes.flatMap((route) =>
    [...(route.steps.phone ?? []), ...(route.steps.computer ?? [])].flatMap((step) =>
      typeof step === "string" ? [] : [step.card],
    ),
  );

/** True when the id is a real card, for checks that run on ids from outside the code. */
export const isCardId = (id: string): id is CardId => (CARD_IDS as readonly string[]).includes(id);
