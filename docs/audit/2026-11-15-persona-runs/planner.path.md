# planner: recipe path

self employed Builder. Use it most days, builder. Both. Can use AI: I work for myself.

## Her map

* **Answering messages** (level 4, Inside your apps, recipe gmail_help_me_write)
  * Today: You answer these many times a day from scratch or old emails.
  * With your path: Reply drafts appear inside Gmail, and you check each one before you send.
* **Vendor booking emails** (level 3, Build once, reuse, recipe gmail_templates)
  * Today: You write these many times a day, often by copying an old email.
  * With your path: For your vendor booking emails, your common emails are saved in Gmail as templates, ready to fill in.
* **Timeline planning** (level 2, Write it with AI)
  * Today: You build these by hand for each wedding.
  * With your path: Your planning stays yours, with AI helping you sort and tidy the steps.
* **Writing emails** (level 3, Build once, reuse, recipe gmail_templates)
  * Today: You write these many times a day.
  * With your path: Your common emails are saved in Gmail as templates, ready to fill in.
* **Making lists** (level 3, Build once, reuse, recipe notes_to_sheet)
  * Today: You make these by hand in your Sheet.
  * With your path: For your planning lists, your notes go in as they are and come out as rows for your sheet.
* **Chasing vendors** (level 4, Inside your apps, recipe gmail_claude_follow_ups)
  * Today: You write these by hand whenever a vendor goes quiet.
  * With your path: For your vendor follow ups, follow ups are drafted from your Gmail and wait for your OK.

## Her offer

* Answering messages, drafted in your inbox
* Your vendor follow ups, drafted from your inbox for your OK

## Her path

Skipped: ready, about

### Step 1, workflow: Answering messages, drafted in your inbox

Your replies now start inside Gmail. Help me write drafts each one from a short line you type, and you read it before you send it. That keeps your answers warm and quick when new messages come in many times a day, without starting from an old email each time.

Recipe gmail_help_me_write, route gmail

On a computer:
1. Open the email in Gmail and click Reply.
2. Type what you want to say in the prompt bar at the bottom. If you do not see it, click the Help me write icon.
3. Click Create. To change the tone, click Formalize, Friendly or Shorten.
4. Read the draft, fix anything that is wrong, then send it yourself.

On a phone:
1. Open the email in the Gmail app and reply.
2. Tap Help me write at the top right.
3. Type what you want to say and tap Create.
4. Tap the text to change anything, then tap Insert.
5. Read the draft, then send it yourself.

Test: The next three emails that need a real reply. Good: The draft says what you meant, and you only change a detail or two.
Approval point: Nothing is sent by itself. You read each draft and press Send yourself.
Cost: Free personal Gmail accounts get Help me write in the US only. Elsewhere it needs a Google AI plan or an eligible Google Workspace plan, and on a work account your company decides.

**Your starting lines**
* Thank them for reaching out about their [month] wedding and suggest a call on [day and time] to talk about their date and budget.
* Thank them for their interest, say I have openings for [month], and ask for their date, guest count and rough budget.
* Say I am booked on [date], thank them kindly, and offer to point them to [another planner or resource] if they would like.
* Confirm our call on [day and time], say I will send a short list of questions beforehand, and tell them I am looking forward to it.
* Reply to a vendor who sent a quote: thank them, say I am reviewing it with my client, and I will answer by [day].
* Answer a client’s question about [topic] in a calm, reassuring way and say I will confirm the details by [day].
* Tell a client their timeline draft is attached, ask them to read it, and send changes by [day].

**Tone notes for the buttons**
* Friendly: use this for new inquiries and past clients. The draft should sound warm and welcoming, like how I talk on a call.
* Formalize: use this for vendor contracts, venues and anything about money or dates. It should sound clear and professional.
* Shorten: use this for quick confirmations, like a time or a delivery. One or two sentences is enough.
* If a draft sounds too stiff or too salesy, press Friendly, then read it again and fix any detail that is wrong.
* If a draft adds anything I did not say, such as a price, a date or a promise, I delete it before sending.

### Step 2, workflow: Your vendor follow ups, drafted from your inbox for your OK

When a vendor goes quiet, ChatGPT looks through your Gmail and drafts the follow up for you. It waits for your OK on each one, so nothing goes out until you have read it. Chasing stops being something you write by hand and remember on your own.

Recipe gmail_claude_follow_ups, route chatgpt + gmail

On a computer:
1. In ChatGPT on the web, open Settings, then Plugins, and select Gmail. Some versions call this Apps.
2. Select Install plugin if you see it, then Connect, and sign in with Google.
3. Review the permissions Google asks for and finish.
4. In Settings, then Plugins, then Permissions, choose Always ask.
5. In a new chat, type @ and pick Gmail, then paste the instructions Tally wrote for you. ChatGPT drafts each follow up in the chat.
6. Read each draft. You choose whether to send it.

Test: The next three people who have not answered you. Good: Each draft goes to the right person, about the right email, in your tone.
Approval point: Your chat tool asks before it sends anything. You read each draft and approve or send it yourself.
Cost: Claude's page says the Gmail connector is for all users but does not say whether the free plan is enough. In ChatGPT, sending from the chat needs Plus or a higher plan.

**Instructions for your assistant**
* I run my own wedding planning business. Look in my Gmail for emails I sent to vendors, like venues, caterers, florists and photographers, where I asked a question or needed a booking, quote or confirmation and have had no reply. Count an email as waiting if I sent the last message and [number] business days have passed. For each one, write a short follow up to that same person, about that same email, in my voice: warm, plain and polite, never pushy. Mention the event date only if it is in the thread. Do not invent prices, dates or promises. Give me a list showing who each draft is for, the subject of the email, and the draft itself. Do not send anything. I will read each draft and decide.

**Your follow up wording**
* Hi [first name], I wanted to check in on my email from [day] about [topic]. Have you had a chance to look? I would love to confirm things for [client event date] if you can let me know by [day]. Thank you!
* Hi [first name], following up again on [topic]. I know things get busy. Could you let me know by [day] whether you can hold [date] for my client? If I do not hear back, I may need to look at other options. Thanks so much!

### Step 3, end

* Never type a client’s full name, phone number, home address or email into ChatGPT. Use square brackets or a first name only.
* Keep contract terms, payment details and card or bank numbers out of any chat. Add them yourself after.
* Leave out guest lists, allergy or health details and anything a couple told you in private.
* Read every draft before it goes out and check dates, times, prices and names against your Sheet.
* Keep Always ask on, so nothing is sent from your Gmail without your OK.
