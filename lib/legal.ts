// The privacy and terms pages, exactly as approved. Same rules as the rest of the site: no dashes as
// punctuation, no testimonials or statistics, never "course", "program", "product", "module" or "lesson",
// and no big promises. These are plain language drafts: have a lawyer check them before launch. This file
// imports nothing, so Node can test it.

/**
 * Fill these in before going live. Until then the pages show them in brackets. The email becomes a link
 * once it's a real address.
 */
export const company = {
  name: "[company name]",
  email: "[contact email]",
  state: "[state]",
};

/** The day these pages last changed in a way that matters. */
export const LAST_UPDATED = "October 22, 2026";

/** A paragraph, or a list. */
export type LegalBlock = { p: string } | { list: string[] };
export type LegalSection = { title: string; blocks: LegalBlock[] };
export type LegalPage = { key: "privacy" | "terms"; title: string; updated: string; intro: string; sections: LegalSection[] };

/** "[Company name]" or "Acme" at the start of a sentence. */
const atStart = (name: string) => name.replace(/^(\[?)(\w)/, (_, bracket: string, first: string) => bracket + first.toUpperCase());
const p = (text: string): LegalBlock => ({ p: text });

export const privacyPage: LegalPage = {
  key: "privacy",
  title: "Privacy",
  updated: `Last updated ${LAST_UPDATED}`,
  intro: `The Couple Standard helps with the everyday arguments in a relationship, so what you share with us is personal. This page explains what we keep, why, who else sees it, and what you can ask us to do. The Couple Standard is run by ${company.name}.`,
  sections: [
    {
      title: "What we keep",
      blocks: [
        {
          list: [
            "When you take the quiz: your answers, the first names you give us, and your email. We don’t keep your answer to the safety question.",
            "If you write about your last fight: your words, and what we read back to you.",
            "When you pay: that you paid, how much, and when. Your card details go straight to Stripe, and we never see them.",
            "When you use your plan: when you first and last opened it, your answers to “Did you try it?” and anything you add there, what you write on your Couple Standard and at the end of a 10 minute repair, and your check ins.",
            "If a check in asks what you’d tell another couple and you answer: your words. We show them on our website, with your first name, only if you tick the box that says we can.",
            "When you check a message: the time, so we can keep to 10 checks a day. We don’t keep the message.",
            "When you invite your partner: their email address.",
            "To stop the AI parts being overused: a scrambled form of your internet address, kept for one day.",
          ],
        },
      ],
    },
    {
      title: "What stays on your phone",
      blocks: [
        p("The 20 minute timer, where you stopped a 10 minute repair, and when you put off a check in stay in your browser, not with us. What you write when you look back on a fight on your own isn’t kept anywhere."),
      ],
    },
    {
      title: "Cookies",
      blocks: [
        p("We use a few cookies, only to make the site work: to keep you signed in, to keep your quiz result for 30 days so you can come back to it, to remember that an invited partner has seen the safety question (never their answer), and to bring you back to a check in after you sign in. There are no ad or tracking cookies."),
      ],
    },
    {
      title: "How we use it",
      blocks: [
        p("To build your plan and move it along, sign you in, take payment, and keep the site working. We also read check in answers to make the plan better."),
        p("We email you only about your plan, like your sign in links or a check in."),
        p("We don’t sell what you share, use it for ads, or show you ads."),
      ],
    },
    {
      title: "What your partner sees",
      blocks: [
        p("If you invite your partner, you share one plan. They can see your quiz answers and first names, since the plan is built from them. They also see your Couple Standard, and whether you’ve opened the plan."),
        p("They never see what you wrote about your last fight or what we read back, your answers after each step, your check ins, or the messages you check."),
        p("The one exception is words you let us show on our website. Anyone can read those there, your partner too. Ask us and we’ll take them down."),
      ],
    },
    {
      title: "Who else handles it",
      blocks: [
        p("A few companies help us run The Couple Standard. Each gets only what it needs for its part:"),
        {
          list: [
            "Supabase stores our data in the US and signs you in, including sending the sign in emails.",
            "Stripe takes payment. It gets your email and your card details.",
            "Anthropic, which makes Claude, the AI we use, gets what you write about your last fight, what you add after a step, and the messages you check, to give you its answer. It also gets a little about your plan, like your couple type and your partner’s first name, but never your email. Anthropic doesn’t use any of it to train its AI.",
            "Vercel runs the site and keeps short logs of visits, like internet addresses, to keep it working and safe.",
          ],
        },
        p("We don’t share it with anyone else unless the law requires it."),
      ],
    },
    {
      title: "Who on our side sees it",
      blocks: [
        p("A few of us can open our database, to run the site, fix problems and answer your requests. Beyond check ins, we don’t read what you write unless you ask us for help."),
      ],
    },
    {
      title: "How long we keep it",
      blocks: [
        p("If you don’t buy a plan, we delete your quiz answers, and anything you wrote, after 30 days."),
        p("If you do, we keep your plan so it’s there whenever you come back, until you ask us to delete it."),
        p("Stripe keeps payment records as long as the law requires."),
      ],
    },
    {
      title: "Your choices",
      blocks: [
        p("The open question, your names and every note are up to you."),
        p(`Email us at ${company.email} to get a copy of what we keep about you, to fix it, or to delete it. We’ll do it within 30 days. If you delete your plan, your partner loses it too.`),
      ],
    },
    {
      title: "Keeping it safe",
      blocks: [
        p("Only signed in people can open a plan, and each person can read only what’s theirs or what you share. No system is perfectly safe, so we keep what we collect small."),
      ],
    },
    {
      title: "Children",
      blocks: [p("The Couple Standard is for adults. We don’t knowingly keep anything about anyone under 18.")],
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
  intro: `These terms are the agreement between you and ${company.name}, which runs The Couple Standard. By using the site or buying a plan, you agree to them. Please read them first, along with our Privacy page.`,
  sections: [
    {
      title: "What The Couple Standard is",
      blocks: [
        p("Practical help for the everyday arguments in a relationship: a plan built from your answers, words to use, help for right after a fight, a message check, and your Couple Standard."),
        p("It isn’t therapy, counseling, or medical or legal advice. It can’t promise your partner will change, or how a disagreement will go."),
        p("It isn’t made for abuse or emergencies. If you ever feel afraid of your partner, contact the National Domestic Violence Hotline: call 1.800.799.7233, text START to 88788, or chat at thehotline.org. If you’re thinking about hurting yourself, call or text 988. In an emergency, call 911."),
      ],
    },
    { title: "Who can use it", blocks: [p("You need to be 18 or older. The Couple Standard is made for people in the US.")] },
    {
      title: "Your plan and signing in",
      blocks: [
        p("Your plan is yours to use for as long as we run The Couple Standard. You sign in with a link we email you, so keep your email account safe and don’t share your links."),
      ],
    },
    {
      title: "Inviting your partner",
      blocks: [
        p("Inviting your partner is free. Only invite someone who wants to join, using an email address they’ve given you. Our Privacy page explains what you share with them and what stays yours."),
      ],
    },
    { title: "Price and payment", blocks: [p("A plan is $19.99, paid once. There’s no subscription. Stripe takes the payment for us.")] },
    {
      title: "Refunds",
      blocks: [p(`If your plan isn’t right for you, email us at ${company.email} within 30 days of buying, and we’ll refund you in full.`)],
    },
    {
      title: "The AI parts",
      blocks: [
        p("Some parts use AI to read what you write: the read back in the quiz and after a step, and the message check. AI can get things wrong, so treat what it says as a suggestion. You decide what to say, send or do."),
      ],
    },
    {
      title: "Using it fairly",
      blocks: [
        p("Please don’t use The Couple Standard to harass, threaten or harm anyone, to break the law, or to get around its limits, like the daily message checks. We may close an account that does."),
      ],
    },
    {
      title: "What you write",
      blocks: [
        p("What you write stays yours. You let us keep it and use it to run your plan, as our Privacy page explains. You can ask us to delete it any time."),
      ],
    },
    {
      title: "What we made",
      blocks: [
        p("The steps, scripts and everything else we made for The Couple Standard belong to us. Use them in your own relationship as much as you like, but please don’t copy or sell them."),
      ],
    },
    {
      title: "If something goes wrong",
      blocks: [
        p(`We work to keep the site running well, but it may sometimes be down or get something wrong. As far as the law allows, The Couple Standard comes as it is, with no promises beyond these terms. ${atStart(company.name)} isn’t responsible for indirect losses, and if we’re ever responsible for a loss, the most we owe you is what you paid us.`),
      ],
    },
    {
      title: "Changes",
      blocks: [
        p("We may update these terms. If a change matters, we’ll tell you before it applies. If we ever stop running The Couple Standard, we’ll tell you first."),
      ],
    },
    {
      title: "If we disagree",
      blocks: [p(`Please email us first, and we’ll try to sort it out together. These terms are governed by the laws of ${company.state}.`)],
    },
    { title: "Questions", blocks: [p(`Email ${company.email}.`)] },
  ],
};

/** Under Get my plan, with the two links. */
export const paywallConsent = { before: "By paying, you agree to our ", terms: "terms", and: " and ", privacy: "privacy policy", after: "." };
