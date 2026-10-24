import type { PlanContent } from "./plan-writer";

// Two sample plans, written by the real master prompt (plan-v1) for the brief's test personas 1 and 3. Shown
// at /plan/preview on a local setup, so the plan page can be seen without paying. Not shown to customers.

export const planSamples: Record<"marketing" | "law_firm", PlanContent> = {
  marketing: {
    "version": 1,
    "role": "You’re a marketing coordinator at a software company, running events and the monthly newsletter.",
    "knownFor": "You want to be known for strategy, not just the person who gets things done.",
    "tool": "chatgpt",
    "policy": "encouraged",
    "tasks": [
      {
        "name": "Meeting notes and recaps",
        "pile": "hand_to_ai",
        "hours": 3
      },
      {
        "name": "Fixing slides for my boss",
        "pile": "hand_back",
        "hours": 2
      },
      {
        "name": "Chasing people for updates",
        "pile": "hand_to_ai",
        "hours": 2
      },
      {
        "name": "Running events and the newsletter",
        "pile": "keep_visible",
        "hours": 6
      }
    ],
    "handBack": [
      {
        "task": "Fixing slides for my boss",
        "script": "I want to make sure your leadership slides land well, and I’d like to put my time into the strategy behind them. Could we try a simple shared slide template so the formatting is handled up front? If you send the content a few days before the meeting, I can give it a quick review for flow and message instead of a full rebuild. For heavier design work, it may make sense for the team to look at a design resource or a standing template."
      }
    ],
    "workProfile": "I’m a marketing coordinator at a 200 person software company. I run our company events and write and send the monthly newsletter. I also take notes in meetings, send recaps, and follow up with people for updates. I want to be known for strategy, not only for getting things done, so I value help that turns details into clear thinking: what matters, what the options are, and what I would recommend. When you draft for me, use a warm, professional, plain tone. Keep things short and easy to scan. Lead with the main point, then give supporting detail. Use bullet points for lists, action items and decisions, with owners and dates when I have them. For emails, keep them to a few sentences unless I ask for more. Don’t invent facts, dates or names. If something is missing, leave a placeholder. Before you draft anything, check what’s missing and ask me any questions you need answered to do it well.",
    "rules": [
      "Use only AI tools your company approves, and right now that means ChatGPT.",
      "Never paste confidential information, like client details, financials or personal data about colleagues, into a tool your company hasn’t approved.",
      "Read and check every draft before it goes out, especially names, dates and action items.",
      "Be open about using AI with your manager and your team.",
      "Keep sensitive meeting content out of your prompts unless your company’s rules say it’s fine."
    ],
    "askMessage": null,
    "prompts": [
      {
        "task": "Meeting notes and recaps",
        "prompt": "Turn my meeting notes into a recap I can send to attendees. Use this format: a two sentence summary, then Decisions, then Action items with owner and due date, then Open questions. Keep it under 200 words and use a friendly, professional tone. If an owner or date is missing, mark it as [needs owner] or [needs date] rather than guessing. Here are my notes: [paste your meeting notes]. Before you write it, tell me if anything looks unclear or missing.",
        "how": "Use right after a meeting to turn rough notes into a recap you can send in minutes."
      },
      {
        "task": "Chasing people for updates",
        "prompt": "Write a short, friendly follow up message asking for a status update. The project is [project or event name], and I need an update on [what you need] by [deadline]. The person’s role is [their role]. Keep it to three or four sentences, make the ask and the deadline clear, and don’t sound pushy. Then write a second version for if they haven’t replied after a few days, that’s slightly more direct but still warm. Ask me for anything you need first.",
        "how": "Use when you need an update from a teammate, vendor or partner and want a clear nudge fast."
      }
    ],
    "project": {
      "title": "Events strategy review",
      "why": "Turning your event results into a clear point of view shows you think about where events should go, not just how to run them. It puts your strategic thinking in front of leadership.",
      "steps": [
        "List your recent events and note what each was meant to achieve and what came of it.",
        "Draft a one page view of which events and newsletter topics to keep, change or drop, and why.",
        "Ask your manager for fifteen minutes to share it and get feedback."
      ]
    },
    "aiTalk": "I’ve started using ChatGPT, which our company encourages, to draft meeting recaps and follow up messages. It gives me time back to spend on event and newsletter strategy, like looking at what’s working and where we should focus next. I always review everything before it goes out, and I keep confidential information out of it. I’d love to share what I’m working on as that time opens up."
  },
  law_firm: {
    "version": 1,
    "role": "You’re an executive assistant to two partners at a law firm, handling their inboxes, travel, meetings and calendars.",
    "knownFor": "You want to be known as the person who runs operations here.",
    "tool": null,
    "policy": "restricted",
    "tasks": [
      {
        "name": "Managing inboxes",
        "pile": "hand_to_ai",
        "hours": 4
      },
      {
        "name": "Booking travel",
        "pile": "hand_to_ai",
        "hours": 2
      },
      {
        "name": "Taking meeting minutes",
        "pile": "hand_to_ai",
        "hours": 2
      },
      {
        "name": "Planning the holiday party",
        "pile": "hand_back",
        "hours": 2
      },
      {
        "name": "Calendar juggling",
        "pile": "keep_visible",
        "hours": 4
      }
    ],
    "handBack": [
      {
        "task": "Planning the holiday party",
        "script": "I’ve handled the holiday party the past few years, and I’d like to make it a shared effort this time. I think a small planning committee with a couple of people from different teams would make it better for everyone. I’m happy to share what worked before and keep an eye on the budget and timeline, but I’d like someone else to own the planning. Can we name an owner by the end of the month?"
      }
    ],
    "workProfile": "I am an executive assistant to two partners at a law firm. My day to day work includes managing their inboxes, booking travel, taking minutes in partner meetings, and coordinating their calendars. I want to be known as the person who runs operations here, so I care about work that makes the office run smoothly and shows my judgment. When you draft for me, keep the tone professional, warm and concise. Use short paragraphs, clear subject lines for emails, and bullet points for action items, dates and decisions. Draft emails in under 150 words unless I ask for more. Write meeting minutes with headings for decisions, action items with owners and due dates, and open questions. Never invent facts, dates or names. If something is unclear, mark it with a placeholder in brackets. I will not share confidential client information with you, so use placeholders instead. Before you draft anything, check what is missing and ask me the questions you need answered.",
    "rules": [
      "Use AI only where your firm approves it, and only for the tasks it allows.",
      "Never paste client details, financials or personal data about colleagues into a tool your firm hasn’t approved.",
      "Read and check every draft before it goes out, especially names, dates and times.",
      "Be open about using AI with your partners and your manager.",
      "Use placeholders like [client name] instead of real details in anything you draft.",
      "If you are unsure whether a task is allowed, ask before you try it."
    ],
    "askMessage": "Hi, I’m hoping you can help me understand which AI tools, if any, are approved for use at the firm. I’d like to know what I’m allowed to use them for. The tasks I have in mind are drafting routine email replies, organizing travel itineraries, and turning meeting notes into a clean summary. I would not put any client or confidential details into a tool unless it is cleared for that. Could you point me to the current policy or let me know who to check with?",
    "prompts": [
      {
        "task": "Managing inboxes",
        "prompt": "Help me draft a reply to this email. Use a professional, warm tone and keep it under 120 words. Here is the email with any confidential details removed: [paste the email]. Here is what I want the reply to say: [paste your key points]. Give me a clear subject line if one is needed, and mark anything you are unsure about in brackets. Before you draft, tell me if anything is missing.",
        "how": "Use when you need a quick, polished reply to a routine email."
      },
      {
        "task": "Booking travel",
        "prompt": "Create a clear travel itinerary from these details: [paste destination, dates, times, flight and hotel info, with no confidential details]. Format it as a day by day schedule with times, locations and confirmation numbers as placeholders. Add a short checklist of what to confirm before the trip, like ground transport and meeting addresses. Flag any gaps or timing conflicts you notice. Ask me questions if anything is missing.",
        "how": "Use when you are turning booking details into an itinerary for a partner."
      },
      {
        "task": "Taking meeting minutes",
        "prompt": "Turn these meeting notes into clean minutes: [paste your meeting notes, with client names removed]. Use these headings: Attendees, Decisions, Action items with owner and due date, and Open questions. Keep each point to one or two lines. Do not add anything that is not in my notes, and mark unclear items with [check]. Ask me what is missing before you write the minutes.",
        "how": "Use right after a partner meeting to turn rough notes into minutes."
      }
    ],
    "project": {
      "title": "Office operations playbook",
      "why": "A simple playbook for how the partners’ offices run shows your command of operations and makes your work visible. It also turns what you know into something the firm can rely on.",
      "steps": [
        "List the recurring processes you run, like travel booking, calendar rules and meeting follow ups.",
        "Write one page for the most important process, with steps, owners and timing.",
        "Share it with your manager and ask which process to document next."
      ]
    },
    "aiTalk": "I want to let you know how I’m using AI tools at work, within the firm’s rules. I use approved tools only for first drafts of routine emails, itineraries and meeting minutes, and I always review everything before it goes out. I don’t put confidential client information into them. This frees up my time for the operations work I want to focus on, like improving how the partners’ offices run. I’m happy to walk you through it or change anything you’d like me to."
  },
};
