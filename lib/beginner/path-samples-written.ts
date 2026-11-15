import type { PathPlan } from "./path";

// Written by scripts/path-runs.ts with beginner-path-v1. Do not edit by hand.
export const writtenPaths: Record<string, PathPlan> = {
  "dental": {
    "version": 3,
    "role": "You’re the front desk receptionist at a dental office, handling phones, scheduling, insurance verification, reminder calls and texts, and billing questions.",
    "track": "starter",
    "tool": "claude",
    "worksFor": "employer",
    "policy": "no_idea",
    "device": "phone",
    "apps": [
      "any_chat",
      "claude",
      "iphone",
      "gboard",
      "samsung_keyboard"
    ],
    "skipped": [],
    "steps": [
      {
        "id": "ready",
        "kind": "ready",
        "card": "claude_get_started",
        "firstStep": "I’m a receptionist at a dental office. Patients text us to move their appointments. Write a short, warm reply I can send by text. Thank them, say we can move it, and ask which days and times work for them. Keep it under 50 words, friendly and plain, with no medical details. Here is the patient’s message: [paste the patient’s text here]"
      },
      {
        "id": "about",
        "kind": "about",
        "card": "claude_about_you",
        "note": "I am a front desk receptionist at a dental office. I handle phones, scheduling, insurance verification, reminder calls and texts, and billing questions. I write to patients, mostly by text, and sometimes to my coworkers. I like a warm, calm and polite tone, in short plain sentences, usually two or three sentences at most. Never add details I did not give you, like times, prices, coverage or office rules. If something is missing, put it in square brackets so I can fill it in. Never give medical or insurance advice. Always give me a draft I can read and change before I send it."
      },
      {
        "id": "task_1",
        "kind": "workflow",
        "task": "Rescheduling texts",
        "title": "Your rescheduling texts, saved once on your phone",
        "recipe": "phone_quick_replies",
        "read": "Your rescheduling texts now live on your phone’s keyboard. You type a few letters and the full reply is ready to put in. That keeps your answers steady and friendly even when the phone keeps ringing. You read each one and change the name or time before it goes out.",
        "material": [
          {
            "label": "Your reschedule replies",
            "items": [
              "Hi [first name], thanks for letting us know. We can move your appointment. Would [day and time] or [day and time] work for you?",
              "Hi [first name], no problem at all. What days and times usually work best for you? I will look for the closest opening.",
              "Hi [first name], I have moved your appointment to [day and time]. Please reply to let me know that works for you.",
              "Hi [first name], we have an opening on [day and time]. Would you like me to hold it for you?",
              "Hi [first name], I am sorry, that time is no longer open. Could [day and time] work instead?",
              "Hi [first name], we received your message about your appointment on [day and time]. I will check the schedule and text you back shortly.",
              "Hi [first name], thank you for telling us ahead of time. Your appointment on [day and time] is cancelled. Reply here whenever you are ready to book a new one."
            ]
          },
          {
            "label": "Your shortcuts",
            "items": [
              "rsch",
              "rnew",
              "rcfm",
              "ropen",
              "rnot",
              "rrec",
              "rcan"
            ]
          }
        ]
      },
      {
        "id": "task_2",
        "kind": "extra",
        "task": "Appointment reminders",
        "title": "Your appointment reminders, saved once on your phone",
        "recipe": "phone_quick_replies",
        "sameAs": "task_1",
        "read": "Your appointment reminders are added to the setup you made in the step Rescheduling texts. They sit on your phone’s keyboard next to your other saved replies.",
        "material": [
          {
            "label": "Your reminder replies",
            "items": [
              "Hi [first name], this is a reminder of your appointment at [office name] on [day and time]. Please reply to confirm.",
              "Hi [first name], your appointment is coming up on [day and time]. Let us know if you need to change it.",
              "Hi [first name], we are looking forward to seeing you tomorrow at [time]. Please reply to confirm that you can make it.",
              "Hi [first name], we have not heard back about your appointment on [day and time]. Could you please confirm when you can?",
              "Hi [first name], thank you for confirming. We will see you on [day and time].",
              "Hi [first name], it is time to book your next visit. Reply here and I will find a time that works for you."
            ]
          },
          {
            "label": "Your reminder shortcuts",
            "items": [
              "rmnd",
              "rsoon",
              "rtmrw",
              "rnoreply",
              "rthx",
              "rbook"
            ]
          }
        ]
      },
      {
        "id": "end",
        "kind": "end",
        "safeUse": [
          "Never type patient names, birth dates, phone numbers or addresses into a chat tool. Use square brackets and add those details yourself.",
          "Never type insurance member numbers, claim details or payment information into a chat tool.",
          "Never share health details or treatment notes with a chat tool.",
          "Read every text before you send it and check the name, day and time.",
          "For insurance or billing questions, treat what AI gives you as a draft and check it against your office’s approved sources."
        ],
        "askMessage": "Hi [manager or IT name], I would like to know which AI tools the office has approved and what I may use them for. I am thinking of using one to help me write patient rescheduling texts and appointment reminders, and I would use only placeholders, never patient details. I would also like to use it to draft questions about insurance, which I would always check against our approved sources first. Could you tell me what is allowed for each of these, or who can confirm? I will wait for your answer before using it for the insurance questions."
      }
    ]
  },
  "salon": {
    "version": 3,
    "role": "You own a small hair salon with three stylists, and you still cut hair five days a week while handling bookings, social media, ordering and payroll.",
    "track": "builder",
    "tool": "claude",
    "worksFor": "self",
    "policy": null,
    "device": "both",
    "apps": [
      "any_chat",
      "claude",
      "iphone",
      "gboard",
      "samsung_keyboard"
    ],
    "skipped": [
      "ready"
    ],
    "steps": [
      {
        "id": "about",
        "kind": "about",
        "card": "claude_about_you",
        "note": "I own a small hair salon with three stylists, and I still cut hair five days a week. I write to clients and followers on Instagram, in text messages, and in booking DMs. My tone is warm, friendly and relaxed, like a stylist talking to a regular, never stiff or salesy. I like short captions and short replies, with a clear next step like booking through the link in my bio. Never add details I did not give you, like prices, openings, products or promises about results. Never make up names or rules. If something is missing, put it in square brackets so I can fill it in."
      },
      {
        "id": "task_1",
        "kind": "workflow",
        "task": "Instagram posts",
        "title": "Your Instagram posts, with a saved assistant",
        "recipe": "saved_assistant",
        "read": "Claude drafts each Instagram caption and waits for your OK. The assistant already knows your salon, your warm tone and your habit of ending with a link in your bio. You stop starting from a blank box after a long day in the chair, and you still decide what goes out.",
        "material": [
          {
            "label": "Instructions for your assistant",
            "items": [
              "You are my assistant for writing Instagram captions for my small hair salon. I own the salon, we have three stylists, and I still cut hair five days a week, so I am usually tired when I post. Write in my voice: warm, friendly and relaxed, like a stylist talking to a regular. Keep captions short, usually two or three sentences. Often I invite people to DM a photo of the look they love, and I end by telling them to book through the link in my bio. Never invent prices, offers, openings, products, stylist names or promises about results. If you need a detail I did not give, put it in square brackets. Do not use hype or pushy sales talk. Each time, I will tell you the look, season or news I want to post about. Give me back one caption, plus a second shorter version, and nothing else."
            ]
          },
          {
            "label": "Examples to start with",
            "items": [
              "Balayage season is here! DM us a photo of the look you love and we will tell you how we would do it. Book through the link in bio.",
              "Fresh cut, fresh start. If you are ready for a change, send us a photo of what you have in mind and we will talk it through. Book through the link in bio.",
              "Our chairs are open for [service] this [season or month]. Not sure what you want? DM us a photo and we will help you figure it out. Book through the link in bio."
            ]
          }
        ]
      },
      {
        "id": "task_2",
        "kind": "workflow",
        "task": "Booking DMs",
        "title": "Your booking DMs, saved once on your phone",
        "recipe": "phone_quick_replies",
        "read": "Your common booking replies live on your phone’s keyboard, each a few letters away. You stop retyping the same answers one by one, and each reply is still yours to check and adjust before you send it. That keeps your DMs and texts quick and in your own voice.",
        "material": [
          {
            "label": "Your replies",
            "items": [
              "Hi [first name]! Thanks so much for reaching out. I would love to get you in. What service are you looking for, and what days work best for you?",
              "Hi [first name]! We have [day and time] open with [stylist]. Would that work for you? You can also book through the link in our bio.",
              "You are all booked for [service] on [day and time]. We look forward to seeing you!",
              "Hi [first name], just a reminder about your appointment on [day and time]. Let us know if anything changes.",
              "Thanks for letting us know. Let’s find a new time for you. Does [day and time] work?",
              "Great question! For a look like that, it is best to see your hair first. Send a photo or book a consult through the link in our bio and we will go from there.",
              "Thank you for visiting us, [first name]! If you loved your look, we would love for you to tell a friend."
            ]
          },
          {
            "label": "Your shortcuts",
            "items": [
              "bkq",
              "bkopen",
              "bkcf",
              "bkrem",
              "bkres",
              "bkcon",
              "bkthx"
            ]
          }
        ]
      },
      {
        "id": "end",
        "kind": "end",
        "safeUse": [
          "Never type client names, phone numbers or addresses into a chat tool. Use square brackets instead.",
          "Keep payment details, card numbers and Square account information out of every chat.",
          "Do not paste your stylists’ pay or payroll details when you ask for help with ordering or planning.",
          "Read every caption and reply before it goes out, and check prices, openings and any claims against what is true for your salon.",
          "Use only photos and stories of clients who have said yes to being shared."
        ],
        "askMessage": null
      }
    ]
  },
  "planner": {
    "version": 3,
    "role": "You run your own event planning business, booking vendors, answering client inquiries and keeping guest lists for weddings and company events.",
    "track": "builder",
    "tool": "chatgpt",
    "worksFor": "self",
    "policy": null,
    "device": "computer",
    "apps": [
      "any_chat",
      "chatgpt",
      "gmail",
      "google_sheets"
    ],
    "skipped": [
      "ready",
      "about"
    ],
    "steps": [
      {
        "id": "task_1",
        "kind": "workflow",
        "task": "Vendor follow ups",
        "title": "Your vendor follow ups, drafted from your inbox for your OK",
        "recipe": "gmail_claude_follow_ups",
        "read": "Your vendor follow ups now live in a chat with your Gmail connected. ChatGPT looks for the vendors who have gone quiet, drafts each nudge in your tone, and waits for your OK before anything goes out. You stop keeping a running list of who to chase in your head, and every follow up still gets your eyes before it is sent.",
        "material": [
          {
            "label": "Instructions for your assistant",
            "items": [
              "I run my own event planning business. I book vendors like caterers, florists, photographers, rental companies and venues for weddings and company events. Look in my Gmail for emails where I asked a vendor a question or sent a request and they have not answered. Count an email as waiting when I sent the last message in the thread and [number] business days have passed. Skip threads where the vendor already replied, and skip anything marked as done. For each waiting email, write a short follow up in the same thread. Use a warm, direct tone, a few sentences long, with no pressure and no fake urgency. Mention the event date and the one thing I still need, but only if it appears in the thread. Never add details I did not give you, such as prices, dates or terms. For a first nudge, keep it friendly. For a second nudge after another [number] business days, be clearer about the deadline I give you. Give me back a list of the vendors you found, then one draft for each, and wait for my OK before anything is sent."
            ]
          },
          {
            "label": "Your follow up wording",
            "items": [
              "Hi [first name], I wanted to check in on my email from [day] about [what I asked]. We are planning for [event date], so I would love to hear back when you have a moment. Thank you, [my name]",
              "Hi [first name], following up again on [what I asked] for [event date]. I need to confirm this by [deadline] so I can keep the rest of the plan moving. Could you let me know where things stand? If it is easier, a quick call works too. Thanks, [my name]"
            ]
          }
        ]
      },
      {
        "id": "task_2",
        "kind": "workflow",
        "task": "Client inquiries",
        "title": "Your client inquiries, drafted in your inbox",
        "recipe": "gmail_help_me_write",
        "read": "Your client inquiries get their first draft inside Gmail, right where the email arrives. Help me write turns a few words from you into a reply, and you read it and fix any detail before you send. You stop starting every answer from a blank page, and the reply still sounds like you.",
        "material": [
          {
            "label": "Starting lines for replies",
            "items": [
              "Thank the client for their inquiry about [type of event] on [date]. Say I would love to hear more and ask for guest count, venue ideas and budget range.",
              "Reply to a client asking if I am free on [date]. Say I will check my calendar and get back to them by [day]. Ask what time the event starts.",
              "Reply to a client asking about my services. Briefly explain that I handle vendor booking, guest lists and day of planning. Offer a call on [day and time].",
              "Reply to a client who wants to book. Thank them warmly and say the next step is [next step]. Ask for [what I need from them].",
              "Reply to a client asking for a quote. Say I need a few details first: [details]. Say I will send a quote after that.",
              "Politely decline an inquiry for [date] because I am already booked. Wish them well with their event and offer to point them to [another option].",
              "Reply to a client who went quiet after my quote. Check in kindly, ask if they have questions, and say there is no rush."
            ]
          },
          {
            "label": "Notes on your tone",
            "items": [
              "If a draft sounds stiff or too formal, press Friendly. That is best for first replies to couples and for anyone who writes casually.",
              "If a draft sounds too casual for a company event or a corporate client, press Formalize. Check that it still sounds like me and not like a form letter.",
              "If a draft is long, press Shorten. Most of my replies should be a few sentences, with one clear question at the end.",
              "If a draft makes a promise I did not give, such as a price, a date or a service, I delete that line before sending.",
              "If a draft still sounds off after one button, I type a new starting line saying what is wrong and create it again."
            ]
          }
        ]
      },
      {
        "id": "end",
        "kind": "end",
        "safeUse": [
          "Never type a client’s full name, home address, phone number or payment details into ChatGPT. Use brackets like [client] or [venue] instead.",
          "Keep guest names, dietary needs and accessibility needs out of the chat unless you have removed anything that identifies a person.",
          "Do not paste vendor contracts, bank details or invoice numbers into a chat.",
          "Check every draft against your own calendar, quotes and contracts, because the draft can get a date or price wrong.",
          "Read every follow up and reply before it goes out, and keep ChatGPT set to Always ask so nothing is sent without you."
        ],
        "askMessage": null
      }
    ]
  },
  "tutor": {
    "version": 3,
    "role": "You tutor high school math students on your own, planning sessions, writing practice problems and keeping parents up to date.",
    "track": "starter",
    "tool": "claude",
    "worksFor": "self",
    "policy": null,
    "device": "phone",
    "apps": [
      "any_chat",
      "claude",
      "iphone",
      "gboard",
      "samsung_keyboard"
    ],
    "skipped": [],
    "steps": [
      {
        "id": "ready",
        "kind": "ready",
        "card": "claude_get_started",
        "firstStep": "I tutor high school math. Write 5 practice problems on [topic] for a student who is [where they are], from easier to harder, with the answers listed at the end. Keep the wording plain and short."
      },
      {
        "id": "about",
        "kind": "about",
        "card": "claude_about_you",
        "note": "I tutor high school students in math on my own. I write practice problems, plan sessions and send short updates to parents. When I write to students, I keep it warm, clear and encouraging, with no talking down. When I write to parents, I stay friendly and plain, and I keep it short. Please use simple words and short sentences. Never add details I did not give you, like grades, test dates or names. If something is missing, ask me or leave a square bracket. Give me a draft I can read and change, and tell me when you are unsure about a math step so I can check it myself."
      },
      {
        "id": "task_1",
        "kind": "workflow",
        "task": "Practice problems",
        "title": "Your practice problems, written with AI",
        "recipe": null,
        "read": "From now on, Claude drafts your practice problems and you check every one before a student sees it. You tell it the topic and the level, and it gives you a set with an answer key. That way you start each session from a draft you can fix, instead of a blank page, and you still decide what goes to your students.",
        "material": [
          {
            "label": "Your practice problem request",
            "items": [
              "I tutor a high school student in math. Today’s topic is [topic]. The student is in [course] and is [struggling with / comfortable with / ready to push on] this topic. Please write [number] practice problems that start easy and get harder. Include a mix of plain computation and a couple of word problems with everyday settings. Do not use any real names. Then give me a separate answer key with short worked steps for each problem so I can check every one myself. Tell me if any problem might have more than one valid answer."
            ]
          }
        ]
      },
      {
        "id": "task_2",
        "kind": "workflow",
        "task": "Session plans",
        "title": "Your session plans, written with AI",
        "recipe": null,
        "read": "From now on, Claude drafts your session plan and you adjust it before the session. You give it the topic, the student’s level and the time you have, and it lays out the session in order. That way the night before gets easier, and the plan still reflects what you know about each student.",
        "material": [
          {
            "label": "Your session plan request",
            "items": [
              "I tutor a high school student in math in a one on one session. The session is [length] long. The student is in [course], and our topic today is [topic]. Last time we covered [what we did last time], and the student found [what was hard] difficult. Please draft a session plan with a short warm up, a clear order for the main teaching, a few check in questions to see if it is landing, and a short wrap up. Add one idea for homework. Keep it simple enough that I can follow it on one page. Give me the plan as a short numbered outline."
            ]
          }
        ]
      },
      {
        "id": "end",
        "kind": "end",
        "safeUse": [
          "Never type a student’s full name, school, grades or home address into a chat tool. Use [student] or a first initial instead.",
          "Never paste a parent’s name, phone number or email into a chat tool.",
          "Check every practice problem and answer key yourself by working it before a student sees it.",
          "Read every message to a parent before you send it, and make sure it says only what you know.",
          "Keep your own notes on how each student is doing in your own records, not in the chat."
        ],
        "askMessage": null
      }
    ]
  }
};
