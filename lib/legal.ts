import { dollars, offer } from "./offer";

// The privacy and terms pages. Plain language drafts with no promises beyond what the site does: have a
// lawyer check them before launch. [REVIEW] marks a line Karl or the lawyer needs to look at; take each one
// out once it's settled. Same rules as the rest of the site: no dashes, and it's always a plan.

/**
 * Fill these in before going live. Until then the pages show them in brackets. The email lives in
 * lib/offer.ts and becomes a link once it's a real address.
 */
export const company = {
  name: "[company name]",
  email: offer.supportEmail,
  state: "[state]",
};

/** The day these pages last changed in a way that matters. */
export const LAST_UPDATED = "October 24, 2026";

/** A paragraph, or a list. */
export type LegalBlock = { p: string } | { list: string[] };
export type LegalSection = { title: string; blocks: LegalBlock[] };
export type LegalPage = { key: "privacy" | "terms"; title: string; updated: string; intro: string; sections: LegalSection[] };

/** "[Company name]" or "Acme" at the start of a sentence. */
const atStart = (name: string) => name.replace(/^(\[?)(\w)/, (_, bracket: string, first: string) => bracket + first.toUpperCase());
const p = (text: string): LegalBlock => ({ p: text });
const name = offer.name;

export const privacyPage: LegalPage = {
  key: "privacy",
  title: "Privacy",
  updated: `Last updated ${LAST_UPDATED}`,
  intro: `${name} gives you a personal plan to win back time at work and get credit for it. To build it, we need some of what you tell us about your work. This page explains what we keep, why, who else handles it, and what you can ask us to do. ${name} is run by ${company.name}.`,
  sections: [
    {
      title: "What we keep",
      blocks: [
        {
          list: [
            "When you take the quiz: what you write about your job, your week and the work you end up doing that isn’t really your job, which AI tools you use (and any you type in), your company’s view on AI, and the tasks and hours we work out with you.",
            "When you pay: your email, that you paid, how much, and when. Your card details go straight to Stripe, and we never see them.",
            "Your plan, and when it was made.",
            "Where you came from: the ad or link that brought you here, like its campaign name, and which steps of the quiz you finished. [REVIEW]",
            "To stop the AI parts being overused: a scrambled form of your internet address, kept for one day.",
          ],
        },
      ],
    },
    {
      title: "Please leave out names and secrets",
      blocks: [
        p("You don’t need to name your company or colleagues. We keep your answers as you wrote them, so please leave out names and anything confidential."),
      ],
    },
    {
      title: "Talking instead of typing",
      blocks: [
        p("If you tap the microphone, your browser turns what you say into text before anything reaches us. Depending on your browser, that happens on your device or on your browser maker’s servers, like Google’s or Apple’s, under their own privacy terms. We only receive the text. [REVIEW]"),
      ],
    },
    {
      title: "Cookies",
      blocks: [
        p("We use a few cookies, only to make the site work: to keep your quiz going, to remember for 30 days which ad or link brought you here, and to open your plan. There are no ad or tracking cookies. [REVIEW: this changes if a Meta pixel is added]"),
      ],
    },
    {
      title: "How we use it",
      blocks: [
        p("To build your plan, take payment, send you your plan, and keep the site working."),
        p("To count how many people reach each step of the quiz, so we can make it better. We count steps, not what you wrote."),
        p("We email you only about your plan."),
        p("We don’t sell what you share, use it for ads, or show you ads."),
      ],
    },
    {
      title: "Who else handles it",
      blocks: [
        p(`A few companies help us run ${name}. Each gets only what it needs for its part:`),
        {
          list: [
            "Supabase stores our data in the US and sends the email with your plan link. [REVIEW]",
            "Stripe takes payment. It gets your email and your card details.",
            "Anthropic, which makes Claude, the AI we use, gets your quiz answers, to sort your tasks and write your plan. It never gets your email. Anthropic doesn’t use any of it to train its AI.",
            "Vercel runs the site and keeps short logs of visits, like internet addresses, to keep it working and safe.",
          ],
        },
        p("We don’t share it with anyone else unless the law requires it."),
      ],
    },
    {
      title: "Who on our side sees it",
      blocks: [
        p("A few of us can open our database, to run the site, fix problems and answer your requests. We don’t read your answers unless we need to fix a problem with your plan or you ask us for help."),
      ],
    },
    {
      title: "How long we keep it",
      blocks: [
        p("If you don’t buy a plan, we delete what you wrote in the quiz after 30 days. [REVIEW: Karl to confirm the number]"),
        p("If you do, we keep your plan so it’s there whenever you come back, until you ask us to delete it."),
        p("Stripe keeps payment records as long as the law requires."),
      ],
    },
    {
      title: "Your choices",
      blocks: [
        p(`Email us at ${company.email} to get a copy of what we keep about you, to fix it, or to delete it. We’ll do it within 30 days.`),
        p("We’re based in the EU, so the GDPR covers what we keep about you, and you can also complain to a data protection authority. [REVIEW]"),
      ],
    },
    {
      title: "Keeping it safe",
      blocks: [
        p("Your plan opens only with your own private link, so keep it to yourself. No system is perfectly safe, so we keep what we collect small."),
      ],
    },
    {
      title: "Children",
      blocks: [p(`${name} is for adults. We don’t knowingly keep anything about anyone under 18.`)],
    },
    {
      title: "Changes",
      blocks: [
        p("When we change this page, we’ll update the date at the top. If a change affects what you’ve already shared, we’ll tell you before it applies."),
      ],
    },
    { title: "Questions", blocks: [p(`Email ${company.email}.`)] },
  ],
};

export const termsPage: LegalPage = {
  key: "terms",
  title: "Terms",
  updated: `Last updated ${LAST_UPDATED}`,
  intro: `These terms are the agreement between you and ${company.name}, which runs ${name}. By using the site or buying a plan, you agree to them. Please read them first, along with our Privacy page.`,
  sections: [
    {
      title: `What ${name} is`,
      blocks: [
        p("A personal plan built from your answers to a short quiz: which of your tasks to hand to AI, hand back or keep visible, ready prompts and scripts, and a plan for getting credit for your work."),
        p("It isn’t career, legal or HR advice, and it can’t promise how your manager or your company will respond. [REVIEW]"),
      ],
    },
    {
      title: "Your company’s rules come first",
      blocks: [
        p("Your plan is built to follow your company’s rules on AI, as you describe them. You’re responsible for following your employer’s policies and agreements. Never paste confidential information into a tool your company hasn’t approved."),
      ],
    },
    { title: "Who can use it", blocks: [p(`You need to be 18 or older. ${name} is made for people in the US.`)] },
    {
      title: "Your plan",
      blocks: [
        p(`Your plan is yours to use for as long as we run ${name}. It opens with a private link we give you, so please don’t share it.`),
      ],
    },
    {
      title: "Price and payment",
      blocks: [p(`A plan is ${dollars(offer.price.cents)}, paid once. There’s no subscription. Stripe takes the payment for us.`)],
    },
    { title: "Refunds", blocks: [p(offer.refund)] },
    {
      title: "The AI parts",
      blocks: [
        p("We use AI to read your answers and write your plan. AI can get things wrong, so check what it gives you before you use it. You decide what to say, send or do."),
      ],
    },
    {
      title: "Using it fairly",
      blocks: [
        p("Please don’t use it to break the law or your employer’s rules, or to get around its limits. We may refuse service to anyone who does. [REVIEW]"),
      ],
    },
    {
      title: "What you write",
      blocks: [
        p("What you write stays yours. You let us keep it and use it to make your plan, as our Privacy page explains. You can ask us to delete it any time."),
      ],
    },
    {
      title: "What we made",
      blocks: [
        p(`Your plan and everything else we made for ${name} belong to us. Use your plan at work as much as you like, but please don’t copy or sell it. [REVIEW]`),
      ],
    },
    {
      title: "If something goes wrong",
      blocks: [
        p(`We work to keep the site running well, but it may sometimes be down or get something wrong. As far as the law allows, ${name} comes as it is, with no promises beyond these terms. ${atStart(company.name)} isn’t responsible for indirect losses, and if we’re ever responsible for a loss, the most we owe you is what you paid us. [REVIEW]`),
      ],
    },
    {
      title: "Changes",
      blocks: [
        p(`We may update these terms. If a change matters, we’ll tell you before it applies. If we ever stop running ${name}, we’ll tell you first.`),
      ],
    },
    {
      title: "If we disagree",
      blocks: [p(`Please email us first, and we’ll try to sort it out together. These terms are governed by the laws of ${company.state}. [REVIEW]`)],
    },
    { title: "Questions", blocks: [p(`Email ${company.email}.`)] },
  ],
};

/** Under Get my plan, with the two links. */
export const paywallConsent = { before: "By paying, you agree to our ", terms: "terms", and: " and ", privacy: "privacy policy", after: "." };
