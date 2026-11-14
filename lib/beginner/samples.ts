import type { BeginnerPlan } from "./plan-writer";
import type { Device } from "./quiz-copy";
import type { FirstWin, MapLine, Track } from "./types";

// Sample first wins and plans for the local previews (/begin/preview and /plan/preview?sample=dental), written
// by the beginner intake and plan writer on 2026-11-10 for three made up women: a dental office receptionist
// (an employer, no idea of its view on AI), a salon owner (works for herself) and a hospital nurse (AI is
// restricted). Nothing here is shown on the live site. The free result parts (`free`, and the dental and salon
// first wins, done from a real example) were written by hand on 2026-11-14 for Phase 2 of docs/DIRECTION.md, in
// the shape beginner-intake-v5 returns: the dental receptionist and the nurse are Starters, the salon owner a
// Builder. Her setups are built from them in code, as on the live result.

type Sample = {
  firstWin: FirstWin;
  ideas: string[];
  free: { firstStep: string; map: MapLine[]; track: Track; device: Device | null };
  plan: BeginnerPlan;
};

export const beginnerSamples: Record<"dental" | "salon" | "nurse", Sample> = {
  dental: {
    firstWin: {
      task: "Rescheduling texts",
      intro: "You pasted a patient’s text asking to move her cleaning. Here is your reply, ready to send.",
      draft:
        "Hi [first name], thanks for letting us know. Happy to move your cleaning from Tuesday. Which days and times later this week work best for you? Send me two or three and I’ll check the schedule and confirm one with you.",
    },
    free: {
      firstStep:
        "I’m a receptionist at a dental office. Patients text us to move their appointments. Write a short, warm reply I can send by text. Thank them, say we can move it, and ask which days and times work for them. Keep it under 50 words, friendly and plain, with no medical details. Here is the patient’s message: [paste the patient’s text here]",
      map: [
        { task: "Rescheduling texts", line: "Becomes a reply you paste into Claude and adjust before you send it.", ai: true, private: false },
        { task: "Appointment reminders", line: "Becomes one reminder text you write with Claude and reuse every day.", ai: true, private: false },
        { task: "Insurance questions", line: "Becomes plain answers to the common questions, written with no patient details.", ai: true, private: true },
        { task: "Answering phones", line: "Stays yours. Claude can help you write a short script for the calls you get most.", ai: false, private: false },
      ],
      track: "starter",
      device: "phone",
    },
    ideas: [
      "A script for confirming appointments by phone",
      "Friendly follow up texts for missed visits",
      "Template for new patient welcome emails",
      "Checklist for a smooth check in routine",
      "Plain language answers to common billing questions",
      "Office newsletter ideas for patients",
    ],
    plan: {
      version: 2,
      role: "You’re the front desk receptionist at a dental office, handling phones, scheduling, insurance verification, reminder calls and texts, and billing questions.",
      tool: "claude",
      toolWhy:
        "Claude is a good place to start because the free version is enough to begin, and it works in a browser or a phone app. You type to it like a text message, so there is nothing to set up or learn first.",
      worksFor: "employer",
      policy: "no_idea",
      firstWin: {
        task: "Appointment reminders",
        prompt:
          "I’m a front desk receptionist at a dental office. Write a short appointment reminder text I can send to patients. It should say the appointment is on [day] at [time], ask them to call [phone number] if they need to reschedule, and mention we need 24 hours notice so we can offer the time to someone else. Keep it under 50 words, warm and polite, in plain language. Start with Hi [first name] and sign off with the office name [office name]. Don’t include any medical details.",
        example:
          "Hi [first name], this is a reminder from [office name] about your visit on [day] at [time]. If you need to change it, please call us at [phone number] at least 24 hours ahead so we can offer the spot to someone else. We look forward to seeing you!",
        fixes: [
          "Shorter.",
          "Warmer, like I’m texting a regular.",
          "Make it sound a bit more formal.",
        ],
      },
      ideas: [
        {
          title: "A script for confirming appointments by phone",
          why: "Gives you calm, clear words for every confirmation call.",
          prompt:
            "I’m a front desk receptionist at a dental office. Write a short phone script for confirming an appointment the day before. It should greet the patient, confirm the day and time [day and time], ask if they can still make it, and offer to reschedule if not. Add a version for leaving a voicemail that does not mention any treatment details. Keep it friendly and under 120 words each.",
          life: false,
          mark: "safe_today",
        },
        {
          title: "Friendly follow up texts for missed visits",
          why: "Helps you reach out kindly without sounding annoyed.",
          prompt:
            "I’m a front desk receptionist at a dental office. Write three short follow up texts for a patient who missed their appointment. One should be gentle, one more direct, and one for a second attempt. Each should offer to rebook by calling [phone number], leave out any treatment details, and stay under 45 words. Tone: warm, not scolding.",
          life: false,
          mark: "safe_today",
        },
        {
          title: "Template for new patient welcome emails",
          why: "Gives every new patient the same warm first impression.",
          prompt:
            "I’m a front desk receptionist at a dental office. Write a welcome email for a new patient before their first visit. Include where to park or find us [directions], what to bring such as ID and insurance card, and that they can arrive a little early for paperwork. Warm and professional, under 150 words, with a place for [first name] and [office name]. No medical advice.",
          life: false,
          mark: "safe_today",
        },
        {
          title: "Billing questions",
          why: "Helps you explain charges in plain, kind words.",
          prompt:
            "I’m a front desk receptionist at a dental office. Write a calm, clear reply I can adapt when a patient asks why they received a bill. Explain in general terms that insurance pays its portion and the patient may owe the rest, and invite them to call [phone number] to go over their account. Leave out names and account numbers. I will check it against our office billing policy before using it. Under 120 words.",
          life: false,
          mark: "safe_today",
        },
        {
          title: "Explaining insurance basics to patients",
          why: "Turns confusing insurance terms into simple words.",
          prompt:
            "I’m a front desk receptionist at a dental office. Explain in plain, friendly language what a deductible, a copay and an annual maximum mean, in two sentences each, so I can use it when talking with patients. Keep it general and don’t give any specifics about any plan. I’ll check it against our office’s approved information before sharing.",
          life: false,
          mark: "safe_today",
        },
        {
          title: "Voicemail greeting for after hours",
          why: "Gives callers clear next steps when the office is closed.",
          prompt:
            "I’m a front desk receptionist at a dental office. Write an after hours voicemail greeting. It should say our office hours are [hours], tell callers to leave their name and number, and say we will call back on the next business day. Add one line about what to do in an emergency, reading as [our office’s emergency instructions]. Warm, clear, under 60 words.",
          life: false,
          mark: "safe_today",
        },
        {
          title: "Handling an upset caller",
          why: "Gives you calm words ready for tense moments.",
          prompt:
            "I’m a front desk receptionist at a dental office. Give me five short, calm phrases I can say to a caller who is frustrated about [a long wait, a bill, or a schedule change]. They should show I’m listening, stay polite, and move toward a next step. Keep each under 20 words. Leave out any names or personal details.",
          life: false,
          mark: "safe_today",
        },
        {
          title: "Cancellation and reschedule reply messages",
          why: "Makes it quick to answer change requests kindly.",
          prompt:
            "I’m a front desk receptionist at a dental office. Write three short reply texts for when a patient asks to cancel or reschedule: one when we have openings this week [days], one when the schedule is full, and one for a last minute cancellation. Keep each under 50 words, friendly, and mention our 24 hour notice policy gently.",
          life: false,
          mark: "safe_today",
        },
        {
          title: "Easy weeknight dinners after a busy day",
          why: "Gives you meal ideas when you’re tired after a long shift.",
          prompt:
            "I work a full day at a front desk and I’m usually tired when I get home. Give me five dinner ideas that take little effort and use simple ingredients. I like [foods I like] and I don’t eat [foods to avoid]. For each, give a short ingredient list and three quick steps. Keep it plain and practical.",
          life: true,
          mark: "safe_today",
        },
        {
          title: "Plan for a free weekend",
          why: "Helps you use days off without much planning effort.",
          prompt:
            "I have a free weekend on [dates] and I work a busy front desk job during the week. Help me plan two relaxed days. I live in [city or area], my budget is about [amount], and I enjoy [things I enjoy]. Give me a simple plan for each day with one restful option and one outing. Keep it short and easy to follow.",
          life: true,
          mark: "safe_today",
        },
      ],
      safeUse: [
        "Never type in patient names, birth dates, phone numbers, addresses or insurance ID numbers.",
        "Leave out anything from a patient’s chart, treatment notes or account details.",
        "Read and check everything before it goes out to a patient.",
        "AI can be confidently wrong about facts, dates and numbers, so check them against your own sources.",
        "Check anything about insurance or billing against your office’s approved information.",
        "Until you know your office’s AI rules, practice with made up examples on your own device.",
      ],
      workProfile:
        "I work the front desk at a dental office. I answer phones, schedule appointments, verify insurance, send reminder calls and texts, and answer patient billing questions. I write mostly to patients, and sometimes to my office manager or insurance offices. I like drafts that are warm, polite and clear, in plain words with no jargon. Keep texts short, usually under 50 words, and emails under 150 words. Always leave blanks in square brackets for names, dates and numbers so I can fill them in myself. Don’t give medical advice.",
      atWork: {
        askMessage:
          "Hi [manager or IT contact], I’d like to ask which AI tools, if any, the office approves for staff use. I’m thinking about using one to help draft appointment reminder texts, phone scripts and welcome emails, without entering any patient information. Could you let me know what I’m allowed to use it for and what’s off limits? I want to make sure I follow our office policies. Thank you!",
        aiTalk:
          "Hi [manager], I wanted to let you know I’ve started using an AI assistant to help me write first drafts, like reminder texts, phone scripts and welcome emails. I never type in patient names or details, and I read and edit everything myself before it goes out. It helps me keep our messages clear and friendly. I’m happy to show you how I use it if you’d like.",
      },
    },
  },
  salon: {
    firstWin: {
      task: "Instagram posts",
      intro: "You pasted your last post about balayage. Here it is rewritten, ready to post.",
      draft:
        "Thinking about balayage? Send us a photo of the look you love in a DM, and we’ll tell you how we’d make it work for your hair. Book your consultation through the link in bio. [booking note]",
    },
    free: {
      firstStep:
        "I own a small hair salon and post on Instagram a few times a week. Write one caption for a post about [what this post is about]. Keep it under 60 words, warm and confident, like a stylist talking to a regular. End by asking people to book through the link in bio or send a DM. At most three hashtags, and no prices or offers I haven’t given you.",
      map: [
        { task: "Instagram posts", line: "Becomes a saved project with your salon’s voice, so each caption starts from your notes.", ai: true, private: false },
        { task: "Booking DMs", line: "Becomes saved replies for the questions clients ask you most.", ai: true, private: false },
        { task: "Ordering stock", line: "Becomes a weekly routine that drafts your order list from what you used.", ai: true, private: false },
        { task: "Cutting hair", line: "Stays yours, chair side, as it should.", ai: false, private: false },
      ],
      track: "builder",
      device: null,
    },
    ideas: [
      "Auto replies for common DM questions",
      "A simple FAQ for booking and cancellations",
      "Weekly content calendar for Instagram",
      "Stories ideas for behind the chair moments",
      "Reminder texts for upcoming appointments",
      "Product description ideas for your retail shelf",
    ],
    plan: {
      version: 2,
      role: "You own a small hair salon with three stylists, and you still cut hair five days a week while handling bookings, social media, ordering and payroll.",
      tool: "claude",
      toolWhy:
        "Claude is a good place to start because the free version is enough to begin, and it works in a browser or a phone app. You type to it like a text message, so you can ask for a post between clients.",
      yourTools: [
        {
          name: "Instagram",
          what: "Instagram is where most new clients see your work, and saved replies let you answer the DM questions you get every day in a tap.",
          tryThis:
            "Pick the three questions you answer most, like how to book, and save an answer for each. Look for quick or saved replies in your professional account options.",
          withChat:
            "Paste those three questions into Claude and ask for short, warm answers with [booking link] in brackets. Pick the best ones, fill in the brackets and save them in Instagram.",
        },
        {
          name: "Canva",
          what: "Canva gives you ready made templates for posts and stories, and its AI tools can help with the words and tidy up photos.",
          tryThis:
            "Put one before and after photo from this week into a post template sized for Instagram. Look for the AI or magic option in the editor to tidy the photo.",
          withChat:
            "Ask Claude for three captions for that photo, paste your favorite under the post, and save the design so next week you only swap the photo.",
        },
      ],
      worksFor: "self",
      policy: null,
      firstWin: {
        task: "Instagram posts",
        prompt:
          "I own a small hair salon with three stylists, and I still cut hair five days a week. Write one Instagram caption for my salon about [what you want to promote, like balayage or openings this week]. Make it warm and friendly, like I’m talking to a regular. Keep it under 60 words, with a clear line at the end telling people to DM me or use the link in my bio to book. Add 5 hashtags at the bottom. Give me two versions so I can pick.",
        example:
          "Version 1: Ready for a fresh look? We have a few openings this week for balayage and trims. Tell us what you are dreaming of and we will help you find the right fit for your hair and your routine. DM us or tap the link in our bio to grab your spot. #balayage #haircolor #salonlife #freshcut #booknow",
        fixes: [
          "Shorter.",
          "Warmer, like I’m texting a regular.",
          "Make the last line a stronger invite to book.",
        ],
      },
      ideas: [
        {
          title: "Auto replies for common DM questions",
          why: "Gives you ready answers for the questions you get every day.",
          prompt:
            "I own a small hair salon with three stylists. Write short, friendly replies I can save for the DM questions I get most: prices, availability, how to book, and whether we take walk ins. Use placeholders like [price range] and [booking link] for details I will fill in. Keep each reply under 40 words, warm and professional, like I’m texting a regular client.",
          life: false,
          mark: "safe_today",
        },
        {
          title: "A simple FAQ for booking and cancellations",
          why: "Puts your policies in one clear place you can share.",
          prompt:
            "I own a small hair salon. Help me write a simple FAQ for clients about booking, rescheduling, late arrivals, and cancellations. My rules are: [your cancellation window], [deposit rule if any], and [late policy]. Write it in friendly, clear language, with short answers of two sentences or less, and keep it kind but firm.",
          life: false,
          mark: "safe_today",
        },
        {
          title: "Weekly content calendar for Instagram",
          why: "Takes the guesswork out of what to post each week.",
          prompt:
            "I own a small hair salon with three stylists, and I post on Instagram. Make a one week content calendar with one post idea per day, mixing before and after photos, a stylist spotlight, a hair care tip, and a booking reminder. This week I want to feature [service or product]. For each day, give a short idea and a photo suggestion. Keep the tone friendly and relaxed.",
          life: false,
          mark: "safe_today",
        },
        {
          title: "Answering DMs and booking questions",
          why: "Helps you reply quickly when a message needs more than a template.",
          prompt:
            "I own a small hair salon and I answer client DMs between appointments. A client wrote: [paste the message, leave out their name and phone number]. Write a short, warm reply that answers it and invites them to book. Our opening hours are [hours]. Keep it under 50 words and friendly, like texting a regular.",
          life: false,
          mark: null,
        },
        {
          title: "Polite reply to a late cancellation",
          why: "Helps you stay kind while holding your policy.",
          prompt:
            "I own a small hair salon. A client canceled [how late] before their appointment, and my policy is [your policy]. Write a short, polite message reminding them of the policy and offering to rebook. Leave out their name. Keep it under 60 words, kind but clear, with no guilt trip.",
          life: false,
          mark: null,
        },
        {
          title: "Product reorder checklist",
          why: "Keeps your ordering organized so nothing runs out.",
          prompt:
            "I own a small hair salon with three stylists. Help me build a simple reorder checklist for salon supplies, grouped into color, styling products, retail products, and towels and disposables. Leave room for me to add [current stock] and [reorder level] beside each item. Make it a clean table I can copy into a note or spreadsheet.",
          life: false,
          mark: "safe_today",
        },
        {
          title: "Message to my stylists about the schedule",
          why: "Makes schedule changes clear and friendly for your team.",
          prompt:
            "I own a small hair salon with three stylists. Write a short team message about next week’s schedule change: [what is changing, like a new day off or a swapped shift]. Ask them to reply by [day] if there is a problem. Keep it friendly, clear, and under 80 words. Do not include any pay details.",
          life: false,
          mark: null,
        },
        {
          title: "Stylist spotlight posts for Instagram",
          why: "Lets clients get to know your team before they book.",
          prompt:
            "I own a small hair salon with three stylists. Write a short Instagram caption introducing one of my stylists. Here is what I want to highlight: [their specialty, like color or short cuts] and [one fun fact]. Keep it warm, under 60 words, and end with a line inviting people to book with them.",
          life: false,
          mark: "safe_today",
        },
        {
          title: "A weeknight dinner plan for long days on my feet",
          why: "Gives you easy meals for days when you are tired after cutting hair.",
          prompt:
            "I stand and cut hair most of the day and get home tired. Make a plan for five weeknight dinners that take little effort and use simple ingredients. I like [foods you like] and avoid [foods you avoid]. Give me a short grocery list at the end, grouped by store section.",
          life: true,
          mark: "safe_today",
        },
        {
          title: "A plan for a free weekend",
          why: "Helps you actually rest when a weekend opens up.",
          prompt:
            "I work on my feet most of the week and have a free weekend coming up on [dates]. I live in [city or area] and want to feel rested, with a few fun things to do. My budget is [amount]. Suggest a simple plan for Saturday and Sunday with one relaxing option and one outing each day.",
          life: true,
          mark: "safe_today",
        },
      ],
      safeUse: [
        "Read and check everything before it goes out, including every Instagram caption and client message.",
        "AI can be confidently wrong about facts, dates and numbers, so double check prices, hours and policies.",
        "Never type in client names, phone numbers, emails, or appointment details.",
        "Never type in your staff’s pay, payroll details, or personal information.",
        "Keep bank details, login passwords and supplier account numbers out of the chat.",
        "Only post photos of clients you have permission to share, and don’t upload client photos to the chat.",
      ],
      workProfile:
        "I own a small hair salon with three stylists, and I still cut hair five days a week. I write to clients through Instagram DMs and booking messages, to my stylists about the schedule, and to suppliers about orders. I also write social media posts for the salon. I like drafts that are warm, friendly and relaxed, like I’m talking to a regular client. Keep them short, with clear next steps like how to book. Use plain words, no hype and no corporate language. When I ask for a post, give me two versions to choose from. If you need details like prices or hours, leave a bracket for me to fill in.",
      atWork: null,
    },
  },
  nurse: {
    firstWin: {
      task: "Precepting new nurses",
      intro:
        "You said you precept the new nurses. Here is a first week checklist you can adapt for them.",
      draft:
        "New nurse first week checklist\n\nDay 1: Tour the unit, meet the charge nurse, review unit policies and where supplies are kept, and set up your login and charting access.\n\nDay 2: Shadow a full shift with [preceptor name], practice a shift handoff report, and review how the floor’s medication process works.\n\nDay 3: Take on one or two patients with close guidance, and go over your documentation checklist.\n\nDay 4 and 5: Take a larger patient load step by step, ask questions after each task, and set one learning goal for next week.",
    },
    free: {
      firstStep:
        "I’m a registered nurse on a med surg floor, and I precept new nurses. Write a one week checklist for a new nurse on my unit, day by day, with three or four short items each day. Plain words, no patient details, nothing about medications or treatment. Here is what this nurse needs most: [what this nurse needs]",
      map: [
        { task: "Precepting new nurses", line: "Becomes a checklist you make with Claude and adjust for each new nurse.", ai: true, private: false },
        { task: "Family calls", line: "Becomes a short script for hard calls, with no patient details in it.", ai: true, private: true },
        { task: "Shift handoffs", line: "Waits until you know what your hospital allows.", ai: true, private: true },
        { task: "Patient education", line: "Stays yours, since it is medical advice.", ai: false, private: false },
      ],
      track: "starter",
      device: "computer",
    },
    ideas: [
      "Shift handoff summary template",
      "Patient education handout outlines",
      "A script for calling families",
      "Charting time saving checklist",
      "Precepting feedback notes",
      "Questions to ask after a difficult shift",
    ],
    plan: {
      version: 2,
      role: "You’re a registered nurse on a med surg floor at a hospital, handling charting, shift handoffs, patient education, family calls and precepting new nurses.",
      tool: "claude",
      toolWhy:
        "Claude is a good place to start because the free version is enough to begin, and it works in a browser or a phone app. You type to it like a text message, so there is nothing to set up or learn first.",
      worksFor: "employer",
      policy: "restricted",
      firstWin: {
        task: "Precepting new nurses",
        prompt:
          "I’m a registered nurse on a med surg floor at a hospital, and I precept new nurses. Write a checklist for a new nurse’s first week on the floor, with one short section for each day, Monday to Friday. Cover getting oriented, shadowing, handoff practice, charting practice, and setting a learning goal. Use plain words and a friendly, encouraging tone, and keep it under 200 words. Put blanks like [preceptor name] where my unit’s details go, and don’t include any patient information.",
        example:
          "Monday: Tour the unit, meet the charge nurse, and get comfortable with where supplies are kept. Tuesday: Shadow your preceptor for the full shift and listen closely during handoff. Wednesday: Practice giving a handoff report and a few charting entries with guidance. Thursday: Care for a small group of patients with support. Friday: Review your week and choose one learning goal.",
        fixes: [
          "Shorter.",
          "Warmer, like I’m welcoming a friend.",
          "Make it a simple list I can print.",
        ],
      },
      ideas: [
        {
          title: "Shift handoff summary template",
          why: "Gives you a steady order to follow so nothing gets skipped at the end of a long shift.",
          prompt:
            "I’m a registered nurse on a med surg floor. Create a simple handoff summary template I can use to organize my thoughts before giving report. Use short headings in a logical order, with blank spaces for me to fill in. Keep it to one page and easy to scan. Do not include any real patient information. I will check it against my unit’s own handoff format before using it.",
          life: false,
          mark: "check_first",
        },
        {
          title: "Patient education handout outlines",
          why: "Gets you a clear starting outline so you are not facing a blank page.",
          prompt:
            "I’m a registered nurse on a med surg floor. Write an outline for a patient handout on [general topic, like getting up safely after surgery]. Use plain words at about a sixth grade reading level, short sections, and a friendly tone. Keep it to one page. This is a first draft only, and I will check every detail against my hospital’s approved materials before sharing anything.",
          life: false,
          mark: "check_first",
        },
        {
          title: "A script for calling families",
          why: "Helps you find calm, clear words for calls that can feel hard to start.",
          prompt:
            "I’m a registered nurse on a med surg floor. Write a short, caring script for a phone call to a family member about [general situation, like a patient being moved to another unit]. Use a warm, calm tone and plain words, in about five sentences. Leave out all names and medical details. I will adjust it to follow my hospital’s rules on what I can share.",
          life: false,
          mark: "check_first",
        },
        {
          title: "Charting",
          why: "Helps you practice clear, well organized wording for your notes.",
          prompt:
            "I’m a registered nurse on a med surg floor. Give me a general guide to writing clear, objective charting notes, with a few made up sample phrases showing the difference between vague and specific wording. Use short bullet points. Do not use any real patient details, and leave out names. I will compare everything with my hospital’s charting standards.",
          life: false,
          mark: "check_first",
        },
        {
          title: "Shift handoff reports",
          why: "Helps you practice giving a short, confident report in a steady order.",
          prompt:
            "I’m a registered nurse on a med surg floor. Help me practice giving a handoff report. Make up a fictional patient with a general situation, then ask me questions one at a time as the incoming nurse would. After I answer, tell me what I could say more clearly. Keep your tone encouraging. I will not type in any real patient information.",
          life: false,
          mark: "check_first",
        },
        {
          title: "Patient education",
          why: "Helps you explain things in plain words that patients can follow.",
          prompt:
            "I’m a registered nurse on a med surg floor. Take this general explanation, [paste a sentence you often say to patients, with no names], and rewrite it in plain words at about a sixth grade reading level. Give me a short version and a slightly longer one, in a warm tone. I will check it against my hospital’s approved education materials before using it.",
          life: false,
          mark: "check_first",
        },
        {
          title: "Questions to ask a new nurse",
          why: "Helps you check in on a new nurse’s learning without it feeling like a quiz.",
          prompt:
            "I’m a registered nurse on a med surg floor and I precept new nurses. Write a list of friendly questions I can ask at the end of a shift to see how a new nurse is feeling and what they want to practice next. Keep them open ended and encouraging, and keep the list under ten questions. Do not include any names or patient details.",
          life: false,
          mark: "check_first",
        },
        {
          title: "Feedback for a new nurse",
          why: "Helps you say honest feedback kindly and clearly.",
          prompt:
            "I’m a registered nurse and I precept new nurses. Help me give feedback on [a general skill, like organizing the shift]. Write three sentences: one on what went well, one on what to work on, and one that encourages next steps. Use a kind, direct tone. Leave out names. I will change the wording so it sounds like me.",
          life: false,
          mark: "check_first",
        },
        {
          title: "Easy meals for after a long shift",
          why: "Gives you ideas for dinner when you are tired and don’t want to think about it.",
          prompt:
            "I work long twelve hour shifts as a nurse and I’m tired when I get home. Give me a plan for five simple dinners that need very little effort and few dishes. I like [foods you enjoy] and I don’t eat [foods to avoid]. Include a short shopping list. Keep the recipes casual and easy to follow.",
          life: true,
          mark: "safe_today",
        },
        {
          title: "A plan for a free weekend",
          why: "Helps you use days off to rest and still enjoy yourself.",
          prompt:
            "I’m a nurse who works a lot of long shifts, and I have a free weekend on [dates]. Help me plan it so I get real rest and also do one thing I enjoy. I like [things you enjoy] and my budget is [amount]. Give me a simple plan for Saturday and Sunday, with a few options for each day.",
          life: true,
          mark: "safe_today",
        },
      ],
      safeUse: [
        "Until your employer says which tools are approved, practice only with made up examples and general topics on your own device.",
        "Never type in patient names, dates of birth, medical record numbers, room numbers or any details that could identify a patient.",
        "Never type in family member names, phone numbers or anything a family member told you.",
        "Read and check everything before it goes out, especially anything a patient or a new nurse will rely on.",
        "AI can be confidently wrong about facts, dates and numbers, so check anything clinical against your hospital’s approved sources.",
        "Do not use it for medication doses or clinical decisions, and keep your own judgment as the final word.",
      ],
      workProfile:
        "I’m a registered nurse on a med surg floor at a hospital. My days include charting, giving shift handoff reports, teaching patients, calling families, and precepting new nurses. I write to patients, families, coworkers and new nurses. I like drafts in plain, warm words that are short and easy to scan. I prefer a calm, encouraging tone, with simple headings or short lists when it helps. I never share real patient details, so please use general examples and leave blanks for specifics. Treat everything as a first draft that I will check against my hospital’s own policies and approved materials.",
      atWork: {
        askMessage:
          "Hi, I’d like to understand which AI tools, if any, are approved for use here and what I’m allowed to use them for. I’m thinking about general tasks like drafting a checklist for new nurses, outlining patient education in plain words, and practicing how to explain things. I would not enter patient information or anything confidential. Could you let me know the policy and who I should ask if I have questions? Thank you.",
        aiTalk:
          "I wanted to let you know that I’ve started using AI on my own time to practice writing and organizing my thoughts. I use it for things like first drafts of checklists for new nurses and plain language outlines for patient education, with no patient information involved. I read and check everything myself before using any of it. I’m happy to share what I learn and to follow whatever guidelines we have here.",
      },
    },
  },
};

export const beginnerSampleFor = (name: unknown) =>
  name === "dental" || name === "salon" || name === "nurse"
    ? beginnerSamples[name]
    : null;
