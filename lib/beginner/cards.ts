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

// Building block cards (docs/DIRECTION.md, Phase 9): checked steps for the app features that workflows are built
// from, like a form, a count, a dated tracker or a saved email. Phase 10 points a workflow's steps at these ids. Each
// card was checked on the date in `checked` against the pages in `sources`, and the daily run flags any card older
// than 30 days (BACKLOG.md). Steps that name "the formula Tally wrote" or "the email Tally wrote" are Tally's own,
// not the vendor's. Computer steps for Microsoft are written for Excel and Outlook in a browser, which work on a Mac
// and on Windows. A device with no steps means the vendor's pages give none, or say it can't be done there.
// Left out on 2026-11-16 because Microsoft's pages don't show it: an Excel rule that colors a whole row.
// Every title, step and note below is a DRAFT until Karl approves it.

/** The apps with building block cards. Microsoft first, then Google (DIRECTION.md, section 8). */
export const BLOCK_APPS = [
  "microsoft_forms",
  "excel",
  "outlook",
  "google_forms",
  "google_sheets",
  "gmail",
  "google_calendar",
] as const;
export type BlockApp = (typeof BLOCK_APPS)[number];

/** Each app's name as she reads it. */
export const BLOCK_APP_NAMES: Record<BlockApp, string> = {
  microsoft_forms: "Microsoft Forms",
  excel: "Excel",
  outlook: "Outlook",
  google_forms: "Google Forms",
  google_sheets: "Google Sheets",
  gmail: "Gmail",
  google_calendar: "Google Calendar",
};

/** The vendor help sites a building block card may be checked against. */
export const BLOCK_HELP = {
  microsoft: ["https://support.microsoft.com/", "https://learn.microsoft.com/"],
  google: ["https://support.google.com/"],
} as const;

export const BLOCK_CARD_IDS = [
  "ms_forms_create",
  "ms_forms_share",
  "ms_forms_to_excel",
  "ms_forms_clear",
  "excel_dropdown",
  "excel_count_each",
  "excel_below_usual",
  "excel_days_after",
  "excel_next_due",
  "excel_due_highlight",
  "outlook_saved_email",
  "outlook_repeat_reminder",
  "google_forms_create",
  "google_forms_share",
  "google_forms_to_sheets",
  "google_forms_clear",
  "sheets_dropdown",
  "sheets_count_each",
  "sheets_highlight_row",
  "sheets_below_usual",
  "sheets_days_after",
  "sheets_next_due",
  "sheets_due_highlight",
  "gmail_saved_email",
  "calendar_repeat_reminder",
] as const;
export type BlockCardId = (typeof BLOCK_CARD_IDS)[number];

/** What a building block is for, so Phase 10 can find the cards a workflow needs. */
export const BLOCK_FEATURES = [
  "form_create",
  "form_share",
  "form_to_sheet",
  "form_clear",
  "dropdown",
  "count_each",
  "highlight_row",
  "below_usual",
  "days_after",
  "next_due",
  "due_highlight",
  "saved_email",
  "repeat_reminder",
] as const;
export type BlockFeature = (typeof BLOCK_FEATURES)[number];

export type BlockCard = {
  id: BlockCardId;
  app: BlockApp;
  feature: BlockFeature;
  title: string;
  /** The steps in order, per device. An Android phone and an iPhone are told apart, since the apps differ. */
  steps: { computer?: string[]; android?: string[]; iphone?: string[] };
  /** Something she should know before she starts, like a device it can't be made on. */
  note?: string;
  /** What changes outside US English settings, for a card whose formula has commas. */
  region?: string;
  /** Whether a free account is enough, and what it limits when that matters. */
  freePlan: { enough: boolean; note?: string };
  /** The day every step was checked, as YYYY-MM-DD. */
  checked: string;
  /** The vendor help pages the steps were checked against. */
  sources: string[];
};

const CHECKED_P9 = "2026-11-16";

const MS = {
  formsCreate: "https://support.microsoft.com/en-us/forms/create-a-form-with-microsoft-forms",
  formsSend: "https://support.microsoft.com/en-us/forms/send-a-form-and-collect-responses",
  formsResults: "https://support.microsoft.com/en-us/forms/check-and-share-your-form-results",
  formsSync: "https://support.microsoft.com/en-us/forms/how-to-ensure-your-form-and-workbook-are-in-sync",
  formsLimits: "https://support.microsoft.com/en-us/forms/form-question-response-and-character-limits-in-microsoft-forms",
  separator: "https://learn.microsoft.com/en-us/troubleshoot/microsoft-365-apps/excel/formula-errors",
  region: "https://support.microsoft.com/en-us/excel/change-regional-format-settings-in-excel-for-the-web",
  dropdown: "https://support.microsoft.com/en-us/excel/get-started/create-a-drop-down-list",
  iphone: "https://support.microsoft.com/en-us/excel/excel-for-iphone-features",
  browser: "https://support.microsoft.com/en-us/excel/differences-between-using-a-workbook-in-the-browser-and-in-excel",
  countif: "https://support.microsoft.com/en-us/excel/get-started/use-the-countif-function-in-microsoft-excel",
  filter: "https://support.microsoft.com/en-us/excel/functions/filter-function",
  dates: "https://support.microsoft.com/en-us/excel/add-or-subtract-dates",
  min: "https://support.microsoft.com/en-us/excel/functions/min-function",
  count: "https://support.microsoft.com/en-us/excel/functions/count-function",
  if: "https://support.microsoft.com/en-us/excel/functions/if-function",
  ifAnd: "https://support.microsoft.com/en-us/excel/using-if-with-and-or-and-not-functions-in-excel",
  today: "https://support.microsoft.com/en-us/excel/functions/today-function",
  highlight: "https://support.microsoft.com/en-us/excel/use-conditional-formatting-to-highlight-information-in-excel",
  templates: "https://support.microsoft.com/en-us/outlook/create-email-templates-in-outlook",
  useTemplate: "https://support.microsoft.com/en-us/outlook/send-an-email-message-based-on-a-template",
  event: "https://support.microsoft.com/en-us/outlook/create-modify-or-delete-a-meeting-request-or-appointment-in-outlook-on-the-web",
  eventFree: "https://support.microsoft.com/en-us/outlook/create-modify-or-delete-a-meeting-request-or-appointment-in-outlook-com",
};

const GOOGLE = {
  forms: "https://support.google.com/docs/answer/6281888?hl=en",
  formEdit: "https://support.google.com/docs/answer/2839737?hl=en",
  formSend: "https://support.google.com/docs/answer/2839588?hl=en",
  formSheet: "https://support.google.com/docs/answer/2917686?hl=en",
  dropdown: "https://support.google.com/docs/answer/186103?hl=en",
  formulas: "https://support.google.com/docs/answer/46977?hl=en",
  countif: "https://support.google.com/docs/answer/3093480?hl=en",
  highlight: "https://support.google.com/docs/answer/78413?hl=en",
  filter: "https://support.google.com/docs/answer/3093197?hl=en",
  iferror: "https://support.google.com/docs/answer/3093304?hl=en",
  date: "https://support.google.com/docs/answer/3092969?hl=en",
  year: "https://support.google.com/docs/answer/3093061?hl=en",
  month: "https://support.google.com/docs/answer/3093052?hl=en",
  day: "https://support.google.com/docs/answer/3093040?hl=en",
  min: "https://support.google.com/docs/answer/3094017?hl=en",
  count: "https://support.google.com/docs/answer/3093620?hl=en",
  if: "https://support.google.com/docs/answer/3093364?hl=en",
  and: "https://support.google.com/docs/answer/3093301?hl=en",
  today: "https://support.google.com/docs/answer/3092984?hl=en",
  gmailTemplates: "https://support.google.com/mail/answer/14864208?hl=en",
  repeat: "https://support.google.com/calendar/answer/37115?hl=en",
  notify: "https://support.google.com/calendar/answer/37242?hl=en",
};

/** The formula steps for the Google Sheets app, the same on an Android phone and an iPhone. */
const sheetsAppFormula = (cell: string, formula: string, after: string) => [
  `Open your spreadsheet in the Google Sheets app and tap ${cell}.`,
  `Type the formula Tally wrote, like ${formula}.`,
  `Tap Done. ${after}`,
];

/**
 * Excel uses the list separator of her region between the parts of a formula: a comma with US English settings, often
 * a semicolon in Europe (Microsoft, checked 2026-11-16). Excel in a browser follows its own regional setting. DRAFT
 */
const EXCEL_REGION =
  "If Excel won't take the formula, type a semicolon wherever it has a comma. Excel uses the separator of your region, and many European regions use a semicolon.";

const NEXT_DUE = '=IF(COUNT(C2:F2)=0,"All done",MIN(C2:F2))';
const DUE_WORD = '=IF(AND(G2<>"",G2<=TODAY()),"Due","")';
const DUE_RULE = '=AND(G2<>"",G2<=TODAY())';

export const blockCards: readonly BlockCard[] = [
  // Microsoft Forms. DRAFT
  {
    id: "ms_forms_create",
    app: "microsoft_forms",
    feature: "form_create",
    title: "Make a form in Microsoft Forms",
    steps: {
      computer: [
        "Go to forms.office.com and sign in with your work, school or Microsoft account.",
        "Select New Form.",
        "Type the title Tally wrote, and a description if you want one. The form saves itself as you go.",
        "Select Add new, then choose the kind of question, such as Choice, Text or Date.",
        "Type the question and its choices as Tally wrote them. Add each next question the same way.",
        "Select Preview to see the form as people will, then select Back to keep editing.",
      ],
    },
    freePlan: { enough: true },
    checked: CHECKED_P9,
    sources: [MS.formsCreate],
  },
  {
    id: "ms_forms_share",
    app: "microsoft_forms",
    feature: "form_share",
    title: "Send your Microsoft form as a link",
    steps: {
      computer: [
        "Go to forms.office.com and open your form.",
        "Select Collect responses.",
        "Choose who can respond. Only people in my organization can respond keeps it inside your workplace. Anyone can respond lets people answer without signing in.",
        "Select Copy link.",
        "Paste the link into the message Tally wrote and send it.",
      ],
    },
    freePlan: {
      enough: true,
      note: "Keeping a form inside your workplace needs a Microsoft 365 work or school account. A personal account can share it with anyone.",
    },
    checked: CHECKED_P9,
    sources: [MS.formsSend],
  },
  {
    id: "ms_forms_to_excel",
    app: "microsoft_forms",
    feature: "form_to_sheet",
    title: "Open your Microsoft form answers in Excel",
    steps: {
      computer: [
        "Go to forms.office.com and open your form.",
        "Select View responses.",
        "Select Open results in Excel. The answers open in Excel in your browser, one row for each answer and one column for each question.",
        "New answers show up in the same workbook, so keep using that one rather than making a new one.",
      ],
    },
    note: "Don't add your own formulas or tables to this workbook, or new answers stop arriving. Count in a copy instead, made with Download a copy.",
    freePlan: {
      enough: false,
      note: "Answers that keep arriving in Excel need a work or school account. Otherwise choose Download a copy, which does not update.",
    },
    checked: CHECKED_P9,
    sources: [MS.formsResults, MS.formsSync],
  },
  {
    id: "ms_forms_clear",
    app: "microsoft_forms",
    feature: "form_clear",
    title: "Clear last week's answers in Microsoft Forms",
    steps: {
      computer: [
        "If you want to keep last week's answers, open them in Excel first and choose Download a copy.",
        "Go to forms.office.com and open your form.",
        "Select View responses.",
        "Select More options for responses, then Delete all responses.",
        "The answers are gone from the form, ready for this week.",
      ],
    },
    note: "Microsoft's pages don't say whether this also clears the workbook made with Open results in Excel.",
    freePlan: { enough: true },
    checked: CHECKED_P9,
    sources: [MS.formsResults, MS.formsLimits],
  },
  // Excel, in a browser. DRAFT
  {
    id: "excel_dropdown",
    app: "excel",
    feature: "dropdown",
    title: "Add a drop down list in Excel",
    steps: {
      computer: [
        "Open your workbook in Excel and select the cells where the drop down list goes.",
        "Go to the Data tab, then select Data Validation. In Excel in a browser it sits under Data Tools.",
        "On the Settings tab, in the Allow box, select List.",
        "Type the choices Tally wrote in a spare column, one in each cell. Then select in the Source box and drag over those cells, without a heading.",
        "Check In-cell dropdown, then select OK.",
      ],
    },
    note: "Excel on an iPhone can pick from a drop down list but can't make one.",
    freePlan: { enough: true, note: "Excel in a browser is free with a Microsoft account." },
    checked: CHECKED_P9,
    sources: [MS.dropdown, MS.iphone],
  },
  {
    id: "excel_count_each",
    app: "excel",
    feature: "count_each",
    title: "Count each answer in Excel",
    steps: {
      computer: [
        "Open the workbook with your answers and select an empty cell beside them, where the count goes.",
        'Paste the formula Tally wrote, like =COUNTIF(C2:C100,"Vegetarian"). The first part says where to look, the second what to count.',
        "Press Enter. Add a count for each choice the same way.",
      ],
    },
    note: "If the answers come from Microsoft Forms, count in a downloaded copy. A formula added to the form's own workbook stops new answers arriving.",
    region: EXCEL_REGION,
    freePlan: { enough: true, note: "Excel in a browser is free with a Microsoft account." },
    checked: CHECKED_P9,
    sources: [MS.countif, MS.browser, MS.formsSync, MS.separator, MS.region],
  },
  {
    id: "excel_below_usual",
    app: "excel",
    feature: "below_usual",
    title: "List what is below its usual amount in Excel",
    steps: {
      computer: [
        "Keep each item in its own row, with what you have now in one column and the usual amount in the next.",
        "Select an empty cell beside the table, where the list starts.",
        'Paste the formula Tally wrote, like =FILTER(A2:A30,B2:B30<C2:C30,"Nothing low"), and press Enter.',
        "The list fills the cells below by itself and changes when you update what you have. When nothing is low it says Nothing low.",
      ],
    },
    region: EXCEL_REGION,
    freePlan: { enough: true, note: "Excel in a browser is free with a Microsoft account." },
    checked: CHECKED_P9,
    sources: [MS.filter, MS.browser, MS.separator, MS.region],
  },
  {
    id: "excel_days_after",
    app: "excel",
    feature: "days_after",
    title: "Date each step from the start day in Excel",
    steps: {
      computer: [
        "Put the start day in its own column, like B.",
        "In the cell for a step, paste the formula Tally wrote, like =B2+7 for a week after the start day, and press Enter.",
        "If you see a number instead of a date, select the cell, then the arrow next to Number Format, then Short Date.",
        "Copy the formulas down to each new row.",
      ],
    },
    freePlan: { enough: true, note: "Excel in a browser is free with a Microsoft account." },
    checked: CHECKED_P9,
    sources: [MS.dates],
  },
  {
    id: "excel_next_due",
    app: "excel",
    feature: "next_due",
    title: "Show the next date due in each row in Excel",
    steps: {
      computer: [
        "When a step is done, type done over its date. The formula skips words, so done steps drop out.",
        `In the Next due column, paste the formula Tally wrote, like ${NEXT_DUE}. It shows the earliest date left in the row.`,
        `In the column after it, paste ${DUE_WORD}. The row says Due once that day has come, with no highlight needed.`,
        "Copy both formulas down to each new row.",
      ],
    },
    note: "Excel in a browser takes today's date from Microsoft's server, not from your computer.",
    region: EXCEL_REGION,
    freePlan: { enough: true, note: "Excel in a browser is free with a Microsoft account." },
    checked: CHECKED_P9,
    sources: [MS.min, MS.count, MS.if, MS.ifAnd, MS.today, MS.browser, MS.separator, MS.region],
  },
  {
    id: "excel_due_highlight",
    app: "excel",
    feature: "due_highlight",
    title: "Highlight a date in Excel once it has come",
    steps: {
      computer: [
        "Open your workbook in Excel in your browser and select the dates to watch, like the Next due column from G2 down.",
        "Select Home, then Conditional Formatting, then New Rule.",
        "Check that Apply to range shows the cells you selected.",
        `In Rule Type, select Formula, then paste the formula Tally wrote, like ${DUE_RULE}. It names the first cell you selected.`,
        "Choose how the cell should look, like a fill color, then select Done.",
      ],
    },
    note: "Excel on an iPhone shows the highlight but can't make it. The Due column from the next due card works everywhere.",
    region: EXCEL_REGION,
    freePlan: { enough: true, note: "Excel in a browser is free with a Microsoft account." },
    checked: CHECKED_P9,
    sources: [MS.highlight, MS.ifAnd, MS.today, MS.iphone, MS.separator, MS.region],
  },
  // Outlook, in a browser or the new Outlook. DRAFT
  {
    id: "outlook_saved_email",
    app: "outlook",
    feature: "saved_email",
    title: "Save an email to reuse in Outlook",
    steps: {
      computer: [
        "In Outlook in your browser or the new Outlook, select New, then Mail.",
        "Paste the email Tally wrote, with its subject.",
        "On the Message ribbon, select Mail template, then Save email as template.",
        "Type a name you will recognize, then select Save.",
        "To use it, select New, then Mail from template, and choose it. It opens as a draft.",
        "Fill in what changes, read it through, then select Send.",
      ],
    },
    note: "Classic Outlook saves a template another way, with File, then Save As, then Outlook Template.",
    freePlan: { enough: false, note: "Saved email templates need a qualifying Microsoft 365 subscription." },
    checked: CHECKED_P9,
    sources: [MS.templates, MS.useTemplate],
  },
  {
    id: "outlook_repeat_reminder",
    app: "outlook",
    feature: "repeat_reminder",
    title: "Set a reminder that repeats in Outlook",
    steps: {
      computer: [
        "Open the calendar in Outlook in your browser, or in Outlook.com.",
        "Select New event at the top of the page.",
        "Add the title Tally wrote for the job.",
        "Select More details, then Repeat. Choose how often from the list, then when the series begins and ends.",
        "Select Remind me and choose when you want to be reminded. It starts at 15 minutes before.",
        "Select Save.",
      ],
    },
    freePlan: { enough: true, note: "Outlook.com is free and has the same Repeat and Remind me choices." },
    checked: CHECKED_P9,
    sources: [MS.event, MS.eventFree],
  },
  // Google Forms. DRAFT
  {
    id: "google_forms_create",
    app: "google_forms",
    feature: "form_create",
    title: "Make a form in Google Forms",
    steps: {
      computer: [
        "Go to forms.google.com.",
        "Click Blank form, then name the form with the title Tally wrote.",
        "Click Add, then to the right of the question title, choose the type of question.",
        "Type the question and its choices as Tally wrote them. To make sure nobody skips it, turn on Required.",
        "Add each next question the same way.",
      ],
    },
    freePlan: { enough: true },
    checked: CHECKED_P9,
    sources: [GOOGLE.forms, GOOGLE.formEdit],
  },
  {
    id: "google_forms_share",
    app: "google_forms",
    feature: "form_share",
    title: "Send your Google form as a link",
    steps: {
      computer: [
        "Open your form in Google Forms.",
        "At the top right, click Publish.",
        "To choose who can respond, click Manage. Under General access, choose anyone with the link or a group at your workplace.",
        "Click Done, then Publish. The top right now says Published.",
        "Click Published, then Copy responder link.",
        "Paste the link into the message Tally wrote and send it.",
      ],
    },
    freePlan: { enough: true },
    checked: CHECKED_P9,
    sources: [GOOGLE.formSend],
  },
  {
    id: "google_forms_to_sheets",
    app: "google_forms",
    feature: "form_to_sheet",
    title: "Send your Google form answers to a sheet",
    steps: {
      computer: [
        "Open your form in Google Forms.",
        "At the top, click Responses, then Summary.",
        "At the top right, click More, then Select destination for responses.",
        "Choose Create a new spreadsheet, then click Create.",
        "Each new answer now arrives as a row in that sheet. You find it on the Google Sheets home screen and in Google Drive.",
      ],
    },
    freePlan: { enough: true },
    checked: CHECKED_P9,
    sources: [GOOGLE.formSheet],
  },
  {
    id: "google_forms_clear",
    app: "google_forms",
    feature: "form_clear",
    title: "Clear last week's answers in Google Forms",
    steps: {
      computer: [
        "Open your form in Google Forms.",
        "At the top, click Responses, then Summary.",
        "At the top right, click More, then Delete all responses.",
        "Click OK. This can't be undone.",
      ],
    },
    note: "Your answers sheet is a separate file, and Google's pages don't say whether its rows are cleared too.",
    freePlan: { enough: true },
    checked: CHECKED_P9,
    sources: [GOOGLE.formSheet],
  },
  // Google Sheets. DRAFT
  {
    id: "sheets_dropdown",
    app: "google_sheets",
    feature: "dropdown",
    title: "Add a drop down list in Google Sheets",
    steps: {
      computer: [
        "Open your spreadsheet and select the cells where the drop down list goes.",
        "At the top, click Insert, then Dropdown.",
        "Under Criteria, choose Dropdown and type the first choice Tally wrote. Click Add another item for each of the rest.",
        "Click Done.",
      ],
      android: [
        "Open your spreadsheet in the Google Sheets app and tap the cells where the drop down list goes.",
        "In the top right, tap More, then Data Validation.",
        "Under Criteria, choose List of items. Tap Add, type a choice Tally wrote, then tap Done. Do this for each choice.",
        "In the top right, tap Save.",
      ],
    },
    note: "On an iPhone you can pick from the list, but you make it on a computer or an Android phone.",
    freePlan: { enough: true },
    checked: CHECKED_P9,
    sources: [GOOGLE.dropdown],
  },
  {
    id: "sheets_count_each",
    app: "google_sheets",
    feature: "count_each",
    title: "Count each answer in Google Sheets",
    steps: {
      computer: [
        "Open your spreadsheet and click an empty cell beside the answers, where the count goes.",
        'Type the formula Tally wrote, like =COUNTIF(C2:C100,"Vegetarian"). The first part says where to look, the second what to count.',
        "Press Enter. Add a count for each choice the same way.",
      ],
      android: sheetsAppFormula("an empty cell where the count goes", '=COUNTIF(C2:C100,"Vegetarian")', "Add a count for each choice the same way."),
      iphone: sheetsAppFormula("an empty cell where the count goes", '=COUNTIF(C2:C100,"Vegetarian")', "Add a count for each choice the same way."),
    },
    freePlan: { enough: true },
    checked: CHECKED_P9,
    sources: [GOOGLE.countif, GOOGLE.formulas],
  },
  {
    id: "sheets_highlight_row",
    app: "google_sheets",
    feature: "highlight_row",
    title: "Highlight a whole row in Google Sheets",
    steps: {
      computer: [
        "Open your spreadsheet and select the columns to color, like A to F.",
        "Click Format, then Conditional formatting.",
        "Under Format cells if, choose Custom formula is.",
        'Type the formula Tally wrote, like =$D1="Yes". Keep the dollar sign, so every row looks at the same column.',
        "Choose a fill color, then click Done.",
      ],
      android: [
        "Open your spreadsheet in the Google Sheets app and select the columns to color.",
        "Tap Format, then Conditional formatting.",
        "Under Format cells if, tap Custom formula.",
        'Tap Value or formula and type the formula Tally wrote, like =$D1="Yes".',
        "Choose a color, then tap Done.",
      ],
    },
    note: "On an iPhone you can see the highlight but not make it.",
    freePlan: { enough: true },
    checked: CHECKED_P9,
    sources: [GOOGLE.highlight],
  },
  {
    id: "sheets_below_usual",
    app: "google_sheets",
    feature: "below_usual",
    title: "List what is below its usual amount in Google Sheets",
    steps: {
      computer: [
        "Keep each item in its own row, with what you have now in one column and the usual amount in the next.",
        "Click an empty cell beside the table, where the list starts.",
        'Type the formula Tally wrote, like =IFERROR(FILTER(A2:A30,B2:B30<C2:C30),"Nothing low"), and press Enter.',
        "The list fills the cells below and changes when you update what you have. When nothing is low it says Nothing low.",
      ],
      android: sheetsAppFormula("an empty cell beside the table", '=IFERROR(FILTER(A2:A30,B2:B30<C2:C30),"Nothing low")', "The list fills the cells below."),
      iphone: sheetsAppFormula("an empty cell beside the table", '=IFERROR(FILTER(A2:A30,B2:B30<C2:C30),"Nothing low")', "The list fills the cells below."),
    },
    freePlan: { enough: true },
    checked: CHECKED_P9,
    sources: [GOOGLE.filter, GOOGLE.iferror, GOOGLE.formulas],
  },
  {
    id: "sheets_days_after",
    app: "google_sheets",
    feature: "days_after",
    title: "Date each step from the start day in Google Sheets",
    steps: {
      computer: [
        "Put the start day in its own column, like B.",
        "In the cell for a step, type the formula Tally wrote, like =DATE(YEAR(B2),MONTH(B2),DAY(B2)+7) for a week after the start day. Days past the end of a month carry into the next one.",
        "Press Enter, then add the formulas to each new row the same way.",
      ],
      android: sheetsAppFormula("the cell for a step", "=DATE(YEAR(B2),MONTH(B2),DAY(B2)+7)", "Add the formulas to each new row the same way."),
      iphone: sheetsAppFormula("the cell for a step", "=DATE(YEAR(B2),MONTH(B2),DAY(B2)+7)", "Add the formulas to each new row the same way."),
    },
    freePlan: { enough: true },
    checked: CHECKED_P9,
    sources: [GOOGLE.date, GOOGLE.year, GOOGLE.month, GOOGLE.day, GOOGLE.formulas],
  },
  {
    id: "sheets_next_due",
    app: "google_sheets",
    feature: "next_due",
    title: "Show the next date due in each row in Google Sheets",
    steps: {
      computer: [
        "When a step is done, type done over its date. The formula skips words, so done steps drop out.",
        `In the Next due column, type the formula Tally wrote, like ${NEXT_DUE}. It shows the earliest date left in the row.`,
        `In the column after it, type ${DUE_WORD}. The row says Due once that day has come, with no highlight needed.`,
        "Add both formulas to each new row the same way.",
      ],
      android: [
        "When a step is done, type done over its date. The formula skips words, so done steps drop out.",
        ...sheetsAppFormula("the first cell of the Next due column", NEXT_DUE, "It shows the earliest date left in the row."),
        `In the column after it, type ${DUE_WORD} the same way. The row says Due once that day has come.`,
      ],
      iphone: [
        "When a step is done, type done over its date. The formula skips words, so done steps drop out.",
        ...sheetsAppFormula("the first cell of the Next due column", NEXT_DUE, "It shows the earliest date left in the row."),
        `In the column after it, type ${DUE_WORD} the same way. The row says Due once that day has come.`,
      ],
    },
    freePlan: { enough: true },
    checked: CHECKED_P9,
    sources: [GOOGLE.min, GOOGLE.count, GOOGLE.if, GOOGLE.and, GOOGLE.today, GOOGLE.formulas],
  },
  {
    id: "sheets_due_highlight",
    app: "google_sheets",
    feature: "due_highlight",
    title: "Highlight a date in Google Sheets once it has come",
    steps: {
      computer: [
        "Open your spreadsheet and select the dates to watch, like the Next due column from G2 down.",
        "Click Format, then Conditional formatting.",
        "Under Format cells if, choose Custom formula is.",
        `Type the formula Tally wrote, like ${DUE_RULE}. It is written for the first cell you selected.`,
        "Choose a fill color, then click Done.",
      ],
      android: [
        "Open your spreadsheet in the Google Sheets app and select the dates to watch.",
        "Tap Format, then Conditional formatting.",
        "Under Format cells if, tap Custom formula.",
        `Tap Value or formula and type the formula Tally wrote, like ${DUE_RULE}.`,
        "Choose a color, then tap Done.",
      ],
    },
    note: "On an iPhone you can see the highlight but not make it. The Due column from the next due card works there.",
    freePlan: { enough: true },
    checked: CHECKED_P9,
    sources: [GOOGLE.highlight, GOOGLE.and, GOOGLE.today],
  },
  // Gmail and Google Calendar. DRAFT
  {
    id: "gmail_saved_email",
    app: "gmail",
    feature: "saved_email",
    title: "Save an email to reuse in Gmail",
    steps: {
      computer: [
        "In Gmail, click Settings at the top right, then See all settings.",
        "At the top, click Advanced. Next to Templates, click Enable, then click Save Changes at the bottom.",
        "Click Compose and paste the email Tally wrote.",
        "At the bottom of the window, click More options, then Templates, then Save draft as template, then Save as new template.",
        "To use it, click Compose, then More options, then Templates, and choose it under Insert template.",
        "Fill in what changes, read it through, then click Send.",
      ],
    },
    note: "Gmail templates work only on a computer, not in the Gmail phone app.",
    freePlan: { enough: true },
    checked: CHECKED_P9,
    sources: [GOOGLE.gmailTemplates],
  },
  {
    id: "calendar_repeat_reminder",
    app: "google_calendar",
    feature: "repeat_reminder",
    title: "Set a reminder that repeats in Google Calendar",
    steps: {
      computer: [
        "Open Google Calendar. In the top left, click Create.",
        "Add the title Tally wrote for the job.",
        "Next to Does not repeat, click the arrow. Choose how often it comes back and when it ends.",
        "At the top right, click Save.",
        "To choose when it reminds you, click the event, then Edit event. Next to Notifications, set the time, then click Save at the top.",
      ],
      android: [
        "Open the Google Calendar app. In the bottom right corner, tap Create, then Event.",
        "Add the title Tally wrote and tap Done, then choose the date and time.",
        "Under the time, tap Does not repeat and choose how often it comes back.",
        "In the top right, tap Save.",
        "To choose when it reminds you, tap the event, then Edit, then Add notification. Set when, tap Done, then tap Save.",
      ],
      iphone: [
        "Open the Google Calendar app. In the bottom right corner, tap Create, then Event.",
        "Add the title Tally wrote and tap Done, then choose the date and time.",
        "Under the time, tap More options, then Does not repeat, and choose how often it comes back.",
        "In the top right, tap Save.",
        "To choose when it reminds you, tap the event, then Edit, then Add another notification. Then tap Save at the top right.",
      ],
    },
    freePlan: { enough: true },
    checked: CHECKED_P9,
    sources: [GOOGLE.repeat, GOOGLE.notify],
  },
];

/** The building block card with this id, or undefined for an id that is not on the list. */
export const blockCardById = (id: string): BlockCard | undefined => blockCards.find((card) => card.id === id);

/** The building block cards for one feature, Microsoft first. */
export const blockCardsFor = (feature: BlockFeature): BlockCard[] => blockCards.filter((card) => card.feature === feature);
