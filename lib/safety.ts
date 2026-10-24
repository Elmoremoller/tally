// The safety question and the calm page, exactly as approved. Keep it free of dashes, testimonials and
// statistics. Nothing about the answer is saved or sent anywhere: it only decides what shows next.

export const safetyQuestion = {
  title: "Have you ever felt afraid of your partner?",
  hint: "We don’t save your answer.",
  choices: [
    { id: "yes", label: "Yes" },
    { id: "no", label: "No" },
    { id: "not_sure", label: "Not sure" },
  ],
} as const;
export type SafetyAnswer = (typeof safetyQuestion.choices)[number]["id"];

/** Around the same question, the first time an invited partner opens the plan. */
export const partnerSafetyCheck = {
  eyebrow: "Before you start",
  hint: "We don’t save your answer, and it’s never shared.",
};

/** The calm page: after Yes or Not sure, and instead of a verdict when a message mentions fear or harm. */
export const safetyHelp = {
  title: "Your safety comes first",
  text: "No one should have to feel afraid of a partner. The National Domestic Violence Hotline is free, confidential and open 24/7. You can reach out even if you’re not sure.",
  call: "Call 1.800.799.7233",
  textMessage: "Text START to 88788",
  chat: "Chat at thehotline.org",
  notForThis: "Our plan is made for everyday arguments, so it isn’t the right help for this.",
  selfHarm: "If you’re thinking about hurting yourself, call or text 988.",
  leave: "Leave this page",
  back: "Go back",
};

/** The National Domestic Violence Hotline, as thehotline.org lists it (checked 2026-10-22). */
export const hotline = {
  call: "tel:+18007997233",
  // Opens a text to 88788 with START typed in, where the phone supports that.
  text: "sms:88788?&body=START",
  chat: "https://www.thehotline.org/",
};
/** The 988 Suicide and Crisis Lifeline takes calls and texts on the same number. */
export const lifeline = "tel:988";

/** Where Leave this page goes, like the hotline's own quick exit. */
export const QUICK_EXIT_URL = "https://www.google.com/";

/**
 * Set in the browser once an invited partner has answered, whatever they answered, so they are asked once
 * per browser. It holds no answer.
 */
export const SAFETY_ASKED_COOKIE = "tcs_safety_asked";

// For what people write where no AI reads it: the self review after a fight, and what a couple agreed in the
// 10 minute repair. These words are the only check there, so they lean toward showing the hotline, and Go
// back is one tap. Still narrow enough to let everyday fights through: "it hit me", "he pushed me to talk"
// and "it hurt me" don't match.
const HARM = new RegExp(
  [
    // Someone doing something to them: "he grabbed my arm", "she pushed me to the ground", but not "he
    // pushed me to talk"
    String.raw`\b(he|she|they|my (partner|husband|wife|boyfriend|girlfriend))( \w+)? (hit|hits|punched|slapped|kicked|choked|shoved|grabbed|pushed|spat at|bit) (me|my)\b(?! to (?!the\b))`,
    // Afraid of them: "I’m scared of him"
    String.raw`\b(afraid|scared|frightened|terrified) of (him|her|them|my (partner|husband|wife|boyfriend|girlfriend))\b`,
    String.raw`\b(do not|don't|did not|didn't|never|no longer) feel safe\b`,
    String.raw`\b(not safe|unsafe|threaten\w*|violen(t|ce)|abus(e|ed|es|ive|ing)|weapon|gun|knife|strangl\w*)\b`,
    String.raw`\b(kill(ing)? myself|hurt(ing)? myself|suicid\w*|end my life)\b`,
  ].join("|"),
  "i",
);
export const mentionsHarm = (text: string) => HARM.test(text.replace(/’/g, "'"));
