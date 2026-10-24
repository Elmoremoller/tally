import { mainTopic, partnerWord, situation, type PlanContext } from "./plan";
import { STEP_PARTS, type Ack, type Outcome, type Part, type StepId } from "./progress";

// The plan's steps and the words around them, exactly as approved. Same rules as the rest of the site: no
// dashes as punctuation, no testimonials or statistics, never "course", "program", "product", "module" or
// "lesson", and no big promises. Which step comes when lives in lib/progress.ts.

/** One action, or a sentence they can edit and copy, with what comes before and after it. */
export type TryWords = { kind: "do"; text: string } | { kind: "say"; lead: string; words: string; after?: string };
export type StepWords = { part: Part; title: string; notice: string; try: TryWords; alone: string | null };

/** The Try as one line, the way it reads outside the editable box. */
export const tryText = (t: TryWords) =>
  t.kind === "do" ? t.text : `${t.lead} “${t.words}”${t.after ? ` ${t.after}` : ""}`;

const firstPreventTitle: Record<string, string> = {
  said_the_wrong_way: "When something small comes out the wrong way",
  building_up: "When things build up until they spill over",
  tired_or_stressed: "When one of you is tired and it all lands harder",
  old_fight: "When an old fight keeps coming back",
};

/** One step's words, for this person: their partner's name, their topic, their situation. */
export function stepWords(id: StepId, c: PlanContext): StepWords {
  const p = partnerWord(c);
  const topic = mainTopic(c);
  const pushPull = c.coupleType === "push_and_pull";
  const steps: Record<StepId, Omit<StepWords, "part">> = {
    small_thing: {
      title: firstPreventTitle[c.start] ?? "When small things keep turning into big ones",
      notice: "Small things are easiest to say while they’re still small. Waiting makes them heavier, not lighter.",
      try: {
        kind: "do",
        text: `Today, notice one small thing about ${topic} that bugs you, and say it while it’s still small. One sentence, starting with “I”.`,
      },
      alone: "Send it as a short text instead, starting with “I”. Run it through the message check first.",
    },
    ask_one_question: {
      title: "When you each assume the other one knows",
      notice: "Most of us guess what our partner needs. Asking takes ten seconds and saves a lot of guessing.",
      try: {
        kind: "do",
        text: `Ask ${p} one question today: “What’s one small thing I could do this week that would help with ${topic}?” Just listen. You don’t have to agree or fix it yet.`,
      },
      alone: `Pick one small thing you think would help ${p} with ${topic}, and do it this week. No need to mention it.`,
    },
    check_in: {
      title: `When the only time you talk about ${topic} is during a fight`,
      notice: "A short, planned talk takes the pressure off every other moment. Things have a place to go.",
      try: {
        kind: "do",
        text: "Pick 15 minutes this week for a check in. Same day, same time, every week. Keep the first one light, and put it in both your calendars today.",
      },
      alone: "Put 15 minutes in your own calendar each week to think through what went well and what was hard. It’s a start, even on your own.",
    },
    running_on_empty: {
      title: "When you’re tired and everything sounds like criticism",
      notice: "Tired brains hear criticism where there isn’t any. Big topics go better when you both have something left.",
      try: {
        kind: "do",
        text: "Agree on a short signal for “I’m running on empty”. A word, a look, anything. When either of you uses it, big topics wait until tomorrow.",
      },
      alone: "Use the words yourself, even without an agreed signal: “I’m running on empty tonight. Can this wait until tomorrow?”",
    },
    notice_good: {
      title: "When you only notice what goes wrong",
      notice: "When things are tense, the good stuff is easy to miss. Saying it out loud helps you both see it.",
      try: { kind: "do", text: `Tell ${p} one thing they did today that you liked. Be specific, and say it before bed.` },
      alone: "Write it in a text or a note instead. You don’t need a reply.",
    },
    one_request: {
      title: "When a complaint comes out as “you never”",
      notice: `“You never” starts a defense. One clear request gives ${p} something they can say yes to.`,
      try: { kind: "say", lead: `Turn one complaint about ${topic} into one small request:`, words: "Could you ___ this week?" },
      alone: "Write the request down and bring it to a calm moment. Small and specific is easier to hear.",
    },
    one_thing: {
      title: "When one thing turns into everything",
      notice:
        "When three topics pile into one fight, none of them gets settled. Taking one at a time is slower, and fairer to both of you.",
      try: { kind: "say", lead: "Next time it starts to spread, name just one thing:", words: `Can we just talk about ${topic} for now?` },
      alone: "Before your next talk, write down the one thing you want to talk about, and bring only that one.",
    },
    agree_pause: {
      title: pushPull ? `When ${situation(c)}` : "When a fight gets bigger and neither of you can stop it",
      notice: "A pause you agree on while you’re calm is easier to use in the middle of it. It’s a plan, not a walkout.",
      try: {
        kind: "do",
        text: pushPull
          ? "Agree on a pause that works for both of you, today, while you’re calm. The one who needs space says when they’ll be back: “Give me 20 minutes, then let’s try again.”"
          : "Agree on a pause word together today, while you’re calm. Either of you can say it, and it means: we stop for now, and we come back to it.",
      },
      alone: `Decide your own pause and tell ${p} about it once, calmly: “When I need a break, I’ll say so, and I’ll be back in 20 minutes.”`,
    },
    racing_heart: {
      title: "When your heart is racing in the middle of it",
      notice: "A racing heart means nobody can really listen, you included. That’s the moment to stop, not to push through.",
      try: {
        kind: "say",
        lead: "Next time it happens, say",
        words: "I’m getting flooded. I need 20 minutes.",
        after:
          "Then step away for at least 20 minutes and do something with your hands, like the dishes or a walk. Try not to replay the fight in your head. It’s always “I’m getting flooded”, never “you’re flooded”.",
      },
      alone: `If ${p} keeps going, you can still step away: “I’m not leaving. I just can’t listen well right now. I’ll be back in 20 minutes.”`,
    },
    coming_back: {
      title: "When the break turns into silence",
      notice: "A pause only works if you come back. Knowing when, where and who starts takes the worry out of it.",
      try: {
        kind: "do",
        text: "Today, agree on what coming back looks like: a time, a place, and who starts. Write it down somewhere you both see.",
      },
      alone: "Decide your part: next time there’s a break, you’ll be the one who comes back, at the time you said.",
    },
    one_minute: {
      title: "When you both talk at once and nobody hears anything",
      notice: "People calm down when they feel heard. Saying back what you heard is a quick way to show it.",
      try: {
        kind: "do",
        text: "Try the one minute rule on something small today. One of you talks for a minute, the other says back what they heard before answering. Then swap.",
      },
      alone: `Do your half: next time ${p} talks, say back what you heard before you answer. “So you’re saying…”`,
    },
    text_regret: {
      title: "When you’re about to send the text you’ll regret",
      notice: "Texts lose your tone and keep every word. Heat reads louder on a screen.",
      try: {
        kind: "do",
        text: "Before you send anything heated today, run it through the message check below, or wait 20 minutes and read it again.",
      },
      alone: null,
    },
    soft_start: {
      title: "When the first words decide the whole fight",
      notice: `The first few minutes decide how most fights end. A soft, short start keeps ${p} in the conversation.`,
      try: {
        kind: "say",
        lead: "Start your next hard talk with one sentence about you, not them:",
        words: `I’m feeling a bit stretched thin. Can we talk about ${topic} for a few minutes tonight?`,
      },
      alone: "Write your first sentence before the talk. Read it out loud once and take out any “you always” or “you never”.",
    },
    say_when_back: {
      title: `When you need space and ${p} wants to talk now`,
      notice: `Space can feel like a door closing unless ${p} knows you’re coming back. A time turns it into a pause.`,
      try: { kind: "say", lead: "Next time you need space, say when you’ll be back:", words: "I need 20 minutes. I’ll come find you at 8." },
      alone: "Then come back at the time you said, even if it’s only to say “I’m back. Can we try again?”",
    },
    first_move: {
      title: "When you’re both waiting for the other to make the first move",
      notice: "Making up doesn’t need a winner. It needs someone to go first, and taking turns keeps it fair.",
      try: {
        kind: "do",
        text: "Decide today who reaches out first after a fight, and take turns. A simple “Can we try again?” is enough.",
      },
      alone: "Go first this time, without keeping score: “Can we try again?”",
    },
    sorry_lands: {
      title: "When sorry doesn’t seem to land",
      notice: "A sorry lands better when it names what happened, with no “but” after it.",
      try: {
        kind: "do",
        text: `Practice on an old, small fight: say what you did, how it landed on ${p}, and what you’ll try next time. Three sentences, and no “but”.`,
      },
      alone: "Write the three sentences down first, and say them when it feels right.",
    },
    ten_minute: {
      title:
        c.makeUp === "move_on" || c.makeUp === "wait_it_out"
          ? "When you move on, but it doesn’t feel finished"
          : "When the fight is over, but it doesn’t feel finished",
      notice: "Moving on without talking lets things pile up. Ten minutes can be enough to finish a fight properly.",
      try: {
        kind: "do",
        text: "After your next fight, try the 10 minute repair. Two minutes each on how it felt, two minutes each on what you’d need next time, and two minutes to agree on one small thing.",
      },
      alone: `Do your half: tell ${p}, in two minutes, how it felt for you and one thing you’d need next time. Then let it rest.`,
    },
    after_break: {
      title: "When you cool down fast and skip the making up",
      notice: "Cooling down is the break, not the repair. Skipping the repair is often why the same fight comes back.",
      try: { kind: "say", lead: "After your next break, come back for the repair before you move on:", words: "Can we finish this properly? Ten minutes." },
      alone: `Even if ${p} doesn’t want to talk it through, say your part in a minute: what you’re sorry for, and what you’ll try next time.`,
    },
    first_check_in: {
      title: `When you want the next fight about ${topic} to go better`,
      notice: "Looking back once a week helps small changes stick.",
      try: {
        kind: "do",
        text: "Sit down for your first weekly check in. What went well this week, what was hard, and one thing to try next week. Fifteen minutes, then do something nice together.",
      },
      alone: "Do it on your own this week: what went well, what was hard, and one thing you’ll try next week. Write it down.",
    },
    made_worse: {
      title: "When trying it made things worse",
      notice: "That happens, and it doesn’t mean it can’t work. After a bad round, calming down comes first. Fixing it comes later.",
      try: {
        kind: "say",
        lead: "Take at least 20 minutes apart and try not to replay it. When you’re both calm, try one line:",
        words: "That went badly. Can we start again?",
      },
      alone: null,
    },
  };
  return { part: STEP_PARTS[id], ...steps[id] };
}

/** The review: Did you try it?, the four answers, and what comes after them. */
export const reviewCopy = {
  lastStep: "Your last step",
  question: "Did you try it?",
  outcomes: {
    helped: "It helped",
    no_engage: "My partner didn’t engage",
    worse: "It got worse",
    not_yet: "Didn’t get to it",
  } satisfies Record<Outcome, string>,
  line: "Want to add a line about what happened?",
  agree: "What did you two agree on?",
  agreeHint: "A few words is enough. You can change it later.",
  save: "Save",
  now: "Tried it? Tell us how it went",
};

/** The line above the next step, for the answer they just gave. */
export const acks: Record<Ack, string> = {
  helped: "Glad it helped. Here’s your next step.",
  no_engage: "That happens, and it says nothing about either of you. Here’s a version you can do on your own.",
  no_engage_next: "That happens, and it says nothing about either of you. Here’s your next step.",
  worse: "Sorry it went that way. First, let’s get things calm.",
  not_yet: "No problem. It’s still here when you’re ready.",
  not_yet_smaller: "Let’s make it smaller.",
};

export const planCopy = {
  tryThis: "Try this",
  trySaying: "Try saying",
  changeWords: "You can change the words.",
  copy: "Copy",
  copied: "Copied",
  alone: "On your own",
  allSteps: "All your steps",
  allStepsText: "Today’s step is a suggestion. Open any of these whenever you need it.",
  doneTitle: "You’ve been through your whole plan",
  doneText: "Your steps stay here. Open any of them whenever you need it.",
  moment: "Today’s small moment",
  momentText: "Small moments like this, sometimes called bird theory, help the hard talks go better.",
};

/** Today's small moment, one a day, in the same order as MOMENT_THEMES in lib/progress.ts. */
export function moments(c: PlanContext): string[] {
  const p = partnerWord(c);
  return [
    `When ${p} shows you something on their phone, stop and really look.`,
    `Send ${p} one text today that has nothing to do with plans or problems.`,
    `Ask ${p} one real question tonight and listen to the whole answer: “What was the best part of your day?”`,
    `When ${p} sighs, laughs or points something out, turn toward it and ask about it.`,
    "Hug a few seconds longer than usual today.",
    "Leave your phone in another room for the first 10 minutes after you’re both home.",
    `Thank ${p} for one small thing they did today, and say what it was.`,
    `Make ${p} a drink or a snack without being asked.`,
    `Tell ${p} one thing you’re looking forward to doing together.`,
    `Ask ${p} about something they mentioned earlier this week.`,
    "Share one small worry from your day, and ask about theirs.",
    `Send ${p} a photo of something that made you think of them.`,
    "Say good morning or good night like you mean it, eyes up from your phone.",
    `Do one small thing ${p} usually does, quietly, without keeping score.`,
    "Ask “How are you, really?” and give them time to answer.",
    "Laugh at something together today. A video, an old photo, anything.",
    `When ${p} tells you about their day, ask one more question before you share yours.`,
    "Plan a 20 minute walk together this week, with no big topics.",
    `Tell ${p} one thing you admire about them. Keep it short.`,
    "Sit together for five minutes tonight with no screens.",
    `Send ${p} a song that reminds you of them.`,
  ];
}
