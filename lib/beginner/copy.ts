import type { ChatTool } from "../week";
import type { JobRead } from "./quiz";
import type { Mark } from "./types";

// The beginner version's words. The landing page, the quiz questions, the free result and the seven days were
// approved on 2026-11-10 (docs/audit/2026-11-10-beginner-draft.md). Lines marked DRAFT fill a gap and wait for
// approval. The rules are the site's, with one change for this audience: AI may be the headline. No dashes,
// no colons in headlines, no hype words, no price on the landing page, no made up reviews or numbers.

export const beginnerOffer = {
  lead: "Tell Tally what you do all day. It shows you what AI can take off your plate, and walks you through the first one.",
  adLine: "Everyone says use AI. Nobody shows you where to start.",
  cta: "Take the free quiz",
  quizTime: "Takes about 2 minutes",
  ctaNote: ["See your first AI win.", "About 2 minutes."],
  meta: {
    title: "Start using AI in your own job",
    description:
      "Curious about AI but not sure where to begin? Tell us your job and see your first AI win with a free 2 minute quiz.",
  },
  /** Where the beginner pages' buttons go. */
  startHref: "/begin",
} as const;

/**
 * Sound familiar: the same free tool asked twice for the same thing. First the way most people ask, with the
 * generic answer that gets; then the way her plan has her ask, with one she could post. The title and lines were
 * approved on 2026-11-11. Both answers are real: each prompt was run once, as written here, on 2026-11-11, and
 * the answers are copied as given, with only the site's typography applied: curly apostrophes, and a space where
 * a word had a hyphen (the first is the first of three options it gave, cut where `more` says so). Run them again if a prompt changes. The labels under each answer are a DRAFT. It took the place of
 * her day of asks, which is kept in docs/audit/2026-11-10-beginner-draft.md.
 */
export const beginnerProblem = {
  title: "Sound familiar?",
  lines: ["You tried it, got something bland, and closed the tab.", "It wasn’t the tool. It was the question."],
  caption: "Same free tool. The only difference is what you ask.",
  before: {
    label: "What most people type",
    prompt: "write a facebook post for a dental office",
    answer: [
      "😁 Your smile deserves the best care!",
      "At [Practice Name], we believe a healthy smile is the foundation of confidence and overall well being. Whether it’s a routine cleaning, a whitening treatment, or a concern you’ve been putting off, our friendly team is here to make your visit comfortable and stress free.",
      "✅ Gentle, personalized care\n✅ Modern technology\n✅ Convenient scheduling\n✅ New patients always welcome!",
      "📞 Call us at [phone number] or book online at [website] today.",
      "#HealthySmiles #DentalCare #[YourCity]Dentist #NewPatientsWelcome",
    ],
    more: "Then two more options and a list of tips.",
    verdict: "Sounds like an ad",
  },
  after: {
    label: "What your plan gives you to paste",
    prompt:
      "I run the Facebook page for a small family dental office. Write a post reminding parents that kids’ checkups before school starts fill up fast. Sound like a friendly neighbor, under 50 words, no hashtags, one emoji at most. End by asking them to call us to book.",
    answer: [
      "Back to school season is almost here, and kids’ checkups tend to fill up fast! Let’s get your little ones smiling bright for the first day. Spots are going quickly, so don’t wait until the last minute. Give us a call today to book your appointment! 😊",
    ],
    more: null,
    verdict: "Sounds like you",
  },
} as const;

export const beginnerWhy = {
  title: "It’s not you",
  lead: "Nobody was taught this. Most advice is written for people who already use it.",
  cards: [
    {
      feeling: "Not sure where to start",
      text: "A blank box and a blinking cursor.",
      outcome: "One tool picked for you, and one first task from your own week.",
    },
    {
      feeling: "Worried you’ll get it wrong",
      text: "What’s safe to type in, and what isn’t?",
      outcome: "Plain rules for your job on what never to paste.",
    },
    {
      feeling: "No time to learn it",
      text: "Courses take weeks you don’t have.",
      outcome: "One small step a day for seven days.",
    },
  ],
} as const;

export const beginnerSteps = [
  "Tell us about your job and what you do over and over.", // DRAFT
  "See your first AI win, drafted for you.",
  "Get your plan, with your tool, your prompts and your seven days.",
] as const;

export const beginnerParts = {
  title: "What’s in your plan",
  parts: [
    {
      id: "tool",
      title: "Your tool",
      text: "One free AI tool, picked for you, and how to open it.",
    },
    {
      id: "win",
      title: "Your first win",
      text: "One task from your week, with the prompt filled in and an example of a good answer.",
    },
    {
      id: "ideas",
      title: "Ideas for your job",
      text: "Eight or more things AI can do for you, each with a prompt ready to paste.",
    },
    {
      id: "safe",
      title: "Safe use",
      text: "Plain rules for your job on what never to type in.",
    },
    {
      id: "days",
      title: "Your seven days",
      text: "One small step a day, so it sticks.",
    },
  ],
} as const;
export type BeginnerPartId = (typeof beginnerParts.parts)[number]["id"];

/** The refund answer comes from lib/offer.ts, so it is added where the questions are shown. */
export const beginnerFaqs = [
  {
    q: "Is this a course?",
    a: "No, it’s a personal plan built from your answers.",
  },
  {
    q: "Do I need to be technical?",
    a: "No. If you can send a text, you can do this.",
  },
  {
    q: "Do I need to pay for an AI tool?",
    a: "No. Your plan starts with a free one.",
  },
  { q: "Is it a subscription?", a: "No. Paid once." },
  {
    q: "My company restricts AI. Does this still work?",
    a: "Yes. Your plan marks what’s safe to do today and what to check first, and gives you the message to ask.",
  },
  {
    q: "Do I need to share confidential information?",
    a: "No. No need to name your company or colleagues.",
  },
  {
    q: "Why not just ask ChatGPT?",
    a: "You can, once you know what to ask. Your plan gives you the first questions, written for your job, and shows you what a good answer looks like.",
  },
] as const;

/** The pictures in How it works on the landing page. A sample for a dental office receptionist. DRAFT */
export const beginnerSample = {
  question: "What’s your job, in your own words?",
  answer: "Receptionist at a dental office. Phones, scheduling, insurance…",
  winTitle: "Your first AI win",
  winIntro: "You said reminder texts eat your time. Here is one.",
  winDraft: "Hi [first name], this is a reminder of your cleaning on [day] at [time]. Reply C to confirm.",
  also: "Also in your plan",
  ideas: ["A script for no show calls", "Facebook posts for the office"],
  tool: "Claude",
  promptLabel: "Paste this",
  prompt: "I’m a receptionist at a dental office. Write a reminder text for an appointment on [day and time].",
  daysLabel: "Your seven days",
  daysDone: 2,
} as const;

/** The pictures on the It's not you cards, in the cards' order. DRAFT */
export const beginnerFeelings = {
  blank: { title: "New chat", field: "Ask anything" },
  unsure: { before: "Rewrite this email to Mrs. ", after: " about her overdue balance", doubt: "Is it OK to paste this?" },
  course: {
    title: "AI for beginners",
    length: "6 weeks",
    modules: ["1. What is a language model?", "2. Prompt frameworks", "3. Tokens and context"],
  },
} as const;

// The quiz

export const beginnerQuestions = {
  job: {
    title: "What’s your job, in your own words?",
    examples: [
      "Receptionist at a dental office. Phones, scheduling, insurance and our Facebook page.",
      "I own a hair salon with three stylists. I do the bookings, the orders and the Instagram.",
      "Fourth grade teacher. Lesson plans, grading and a lot of emails to parents.",
      "Real estate agent, on my own. Listings, showings and follow ups with buyers.",
      "Office manager at a 30 person company. Invoices, supplies and everything nobody else does.",
    ],
  },
  worksFor: { title: "Do you work for yourself or for someone else?" },
  experience: { title: "How much have you used AI so far?" },
  tools: { title: "Which AI have you used?" }, // DRAFT
  level: { title: "Where are you with AI?" }, // DRAFT
  repeats: { title: "What do you do over and over, every day or every week?", hint: "Pick all that fit." }, // DRAFT
  most: {
    title: "Which would save you the most time if it got easier?", // DRAFT
    hint: "Pick one or two.", // DRAFT
    fallbackTitle: "Which of these would help you most?", // DRAFT
    fallbackHint: "Things AI could help with in your job.", // DRAFT
  },
  picture: { title: "How do you picture AI helping with it?", hint: "Any guess is fine.", skip: "Skip" }, // DRAFT
  apps: { title: "Which apps do you use every week?", hint: "Pick all that fit." }, // DRAFT
  somethingElse: { label: "Something else", placeholder: "Type it here" }, // DRAFT
  waitLine: "One moment", // DRAFT
} as const;

/** What the quiz uses when the AI can't read her job in time. Its labels follow the limits set on the AI's output. DRAFT */
export const FALLBACK_JOB_READ: JobRead = {
  repeats: [
    { label: "Answering messages", ai: true },
    { label: "Writing emails", ai: true },
    { label: "Helping people in person", ai: false },
    { label: "Planning my week", ai: true },
    { label: "Keeping records", ai: true },
  ],
  aiFallback: ["Answering messages", "Writing emails", "Planning my week", "Keeping records"],
  apps: [
    "Texts",
    "Email",
    "WhatsApp",
    "Instagram",
    "Facebook",
    "Google Docs or Word",
    "Google Sheets or Excel",
    "Canva",
  ],
  worksFor: "unclear",
};

// The free result and the paywall

export const firstWinCopy = {
  eyebrow: "Your first AI win",
  made: "AI wrote that from what you told us. Your plan shows you how to make it yourself, in your own words, in about 15 minutes.",
  also: "Also in your plan",
  more: (count: number) => `${count} more`,
  /** When her company restricts AI. DRAFT */
  restricted:
    "Your company restricts AI, so your plan starts with practice on your own phone or computer, and gives you the message to ask what’s allowed.",
};

/** DRAFT: the paywall's headline for this version. The price, button and fine print are the first version's. */
export const beginnerPaywall = {
  title: "Get your plan and make the next one yourself.",
  lead: "Here’s what’s inside, built from your answers.",
};

/** What people see on Stripe's page and their receipt. DRAFT */
export const beginnerCheckout = {
  name: "Your plan",
  description: "A personal plan to start using AI in your own job.",
};

// The plan page. Section titles and lines are the landing page's; everything else here is a DRAFT.

export const markLabels: Record<Mark, string> = {
  safe_today: "Safe today",
  check_first: "Check first",
};

export const toolSite: Record<ChatTool, { name: string; steps: string[] }> = {
  claude: {
    name: "Claude",
    steps: [
      "Open claude.ai in your browser, or get the Claude app on your phone.",
      "Sign up with your email. The free version is enough.",
      "Type or paste into the message box and send it, like a text.",
    ],
  },
  chatgpt: {
    name: "ChatGPT",
    steps: [
      "Open chatgpt.com in your browser, or get the ChatGPT app on your phone.",
      "Sign up with your email. The free version is enough.",
      "Type or paste into the message box and send it, like a text.",
    ],
  },
  gemini: {
    name: "Gemini",
    steps: [
      "Open gemini.google.com in your browser, or get the Gemini app on your phone.",
      "Sign in with your Google account. The free version is enough.",
      "Type or paste into the message box and send it, like a text.",
    ],
  },
  copilot: {
    name: "Copilot",
    steps: [
      "Open copilot.microsoft.com in your browser, or get the Copilot app on your phone.",
      "Sign in with your Microsoft account. The free version is enough.",
      "Type or paste into the message box and send it, like a text.",
    ],
  },
};

export const beginnerPlanCopy = {
  title: "Your plan",
  toolLabel: "Start here",
  toolSteps: "How to open it",
  /** At the top of her first win when her company restricts AI. */
  restricted:
    "Your company restricts AI, so treat this as practice on your own phone or computer, with nothing from work in it. The message under At work asks what’s allowed.",
  winLabel: "About 15 minutes",
  promptLabel: "Paste this",
  exampleLabel: "A good answer looks like this",
  fixesLabel: "If it’s off, send one of these",
  done: "I did it",
  undone: "Done",
  ideasWork: "For your job",
  ideasLife: "From daily life",
  ideaPrompt: "Ready prompt",
  marksNote: {
    employer: "Safe today needs nothing private. Check first waits until you know what your company allows.",
    self: "Safe today needs nothing private. Your safe use rules say what to leave out of the rest.",
  },
  profileLabel: "Your work profile",
  profileLead: "Paste it at the start of a chat, so answers sound like you.",
  daysProgress: (done: number) => `${done} of 7 done`,
  daysNote: "Your ticks are kept on this phone or computer.",
  atWork: {
    title: "At work",
    text: "For when you’re ready to use AI on your real work, openly.",
  },
  askLabel: "Ask what’s approved",
  askLead: "Send this to IT or your manager.",
  talkLabel: "Talking about AI with your manager",
};

/** Her seven days. Day four names one of her ideas and day five one from daily life. */
export const sevenDays = (idea: string | null, life: string | null) => [
  {
    title: "Your first win",
    text: "The prompt is above. Paste it, send it and read what comes back.",
  },
  {
    title: "Do it again with a real one from today",
    text: "Same prompt, with today’s details in the brackets. Use what it gives you.",
  },
  {
    title: "Teach it who you are",
    text: "Paste your work profile at the start of a chat, so answers sound like you.",
  },
  {
    title: "A second task from your ideas",
    text: idea ? `Try “${idea}”.` : "Pick any one from your ideas.",
  },
  {
    title: "One from daily life",
    text: life ? `Try “${life}”. It doesn’t have to be about work.` : "Pick one that isn’t about work.",
  },
  {
    title: "Fix a bad answer",
    text: "When an answer misses, don’t start over. Tell it what’s wrong and ask again.",
  },
  {
    title: "Pick the three you’ll keep",
    text: "Look back over the week and keep the three that helped most.",
  },
];
