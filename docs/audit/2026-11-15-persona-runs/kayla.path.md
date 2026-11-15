# kayla: recipe path

self employed Starter. Tried it a few times, starter. Phone only. Can use AI: I work for myself.

## Her map

* **Writing quotes** (level 2, Write it with AI, held: needs_computer)
  * Today: You write these from scratch for each job, often several times a week.
  * With your path: Each quote starts from a draft you only need to check and adjust.
* **Chasing payment and asking for reviews** (level 3, Build once, reuse, recipe phone_quick_replies)
  * Today: You chase payments and ask for reviews one by one, which takes time.
  * With your path: For your payment and review messages, your common replies are saved on your phone, each a few letters away.
* **Texting homeowners** (level 3, Build once, reuse, recipe phone_quick_replies)
  * Today: You text homeowners through the day to schedule and update them.
  * With your path: For your texts to homeowners, your common replies are saved on your phone, each a few letters away.
* **Invoicing customers** (level 2, Write it with AI)
  * Today: You send invoices to customers once jobs are done.
  * With your path: This stays yours, since the invoice itself is done in Square.
* **Answering messages** (level 3, Build once, reuse, recipe phone_quick_replies)
  * Today: You answer customer messages as they come in during the day.
  * With your path: Your common replies are saved on your phone, each a few letters away.

## Her offer

* Your quotes, written with AI
* Your payment and review messages, saved once on your phone

Starts with two quick steps:
* Get Claude ready on your phone
* Teach Claude who you are

## Her path

Skipped: nothing

### Step 1, ready

Card: claude_get_started

On a phone:
1. Download the Claude app from the App Store on an iPhone or Google Play on Android.
2. Open the app and create a free account. You need to be 18 or older.
3. Type what you need in the message box and send it.

First message: I’m an electrician who runs my own one truck business, mostly doing homes in Phoenix. I write quotes for customers several times a week and want a quick, clear quote each time. Write a short, plain text quote I can send by text message, with a parts line, a labor line, a total, and a line saying how long the quote is good for. Keep it friendly and under 90 words. Here are the job details: [paste the job details, parts costs, labor hours and the quote’s validity here].

### Step 2, about

Card: claude_about_you

Her note: I’m an electrician and I run my own one truck business, mostly doing work in homes around Phoenix. I write to homeowners, so I keep things short, friendly and plain. I text most of the time, so a few sentences is usually enough. I like a straight answer with the price or the next step up front. Never add details I did not give you, like a price, a date, a part or a promise. If something is missing, put it in square brackets and leave it for me to fill in. Never use big words or sales talk. Give me one version I can read, fix and send myself.

### Step 3, workflow: Your quotes, written with AI

From now on you tell Claude the job, the parts and the price, and it drafts the quote for you to read. You already know the numbers, so Claude only does the writing and you keep the final say. Every quote comes out in the same plain, clear shape, and you fix anything before it goes to the homeowner.

No recipe: Tally's own three steps for writing it with AI each time.

**Your quote message**
* I’m an electrician running my own one truck business, mostly doing homes in Phoenix. Write a quote I can text or email to a homeowner. Job: [what the work is, like a 200 amp panel swap]. Site notes: [anything that changes the work, like a tight attic and extra labor hours]. Parts: about [parts cost]. Total: [total price]. Good for: [number of days]. Keep it short, friendly and plain, in my voice. Use only the numbers I gave you. Do not add details, promises or prices I did not give. Put anything missing in square brackets. Give me one quote I can read, fix and send, and a one line text I can send with it.

### Step 4, workflow: Your payment and review messages, saved once on your phone

Your payment and review messages live on your phone’s keyboard, each a few letters away. You type a short shortcut and the full message appears, so you stop writing the same nudge over and over. You still read it, change the name or amount, and then send it.

Recipe phone_quick_replies, route samsung_keyboard

On a phone:
1. Keep the replies and shortcuts Tally wrote for you open, above.
2. Go to Settings, then tap General management.
3. Tap Samsung Keyboard settings.
4. Tap Text shortcuts.
5. Tap the plus icon in the top right corner of the screen.
6. Type a shortcut in Shortcut phrase and its reply in Expanded phrase, then tap Add.
7. Do the same for each reply on your list.
8. When you type a shortcut, its reply appears in the bar above the keyboard. Tap it to put it in.

Test: The next three messages that need one of these replies. Good: The reply fits after you change at most a name or a time.
Approval point: You read every reply before you send it. Nothing is sent by itself.
Cost: Text replacement on an iPhone, text shortcuts on a Samsung phone and the Gboard clipboard are free, and Tally writes the replies for you.

**Your replies**
* Hi [first name], this is [my name] with [my business]. Just a quick reminder that the invoice for [job] is still open. You can pay at [payment link]. Let me know if you have any questions.
* Hi [first name], following up on the invoice for [job], [amount]. It’s past due now. Could you take care of it by [day]? Thank you.
* Hi [first name], I want to check in about the invoice for [job]. Is there anything holding it up? I’m happy to answer any questions.
* Hi [first name], thanks again for choosing me for [job]. The invoice is here: [payment link]. I appreciate your business.
* Hi [first name], it was a pleasure working on your home. If you were happy with the work, would you leave me a quick review? Here’s the link: [review link]. It really helps a small business like mine.
* Hi [first name], just a friendly reminder about the review. It only takes a minute here: [review link]. Thank you so much.
* Hi [first name], thank you for the payment. I really appreciate it. If you need any more electrical work, just text me.

**Your shortcuts**
* pyn1
* pyn2
* pyn3
* pyin
* rvw1
* rvw2
* pdth

### Step 5, end

* Never type a homeowner’s name, home address, phone number or gate code into Claude. Use square brackets and fill them in yourself.
* Never type payment details like card numbers, bank info or a customer’s account numbers.
* Check every price, parts count and labor hour in a quote against your own numbers before it goes out.
* Check anything about permits, code or inspections against your local rules, because Claude can get these wrong.
* Read every message before you send it, and change anything that does not sound like you.
