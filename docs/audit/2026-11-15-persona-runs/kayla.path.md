# kayla: recipe path

self employed Starter. Tried it a few times, starter. Phone only. Can use AI: I work for myself.

## Her map

* **Writing quotes** (level 3, Build once, reuse, recipe say_it_out_loud)
  * Today: You write these a few times a week, usually at night after talking the job through on a voice memo.
  * With your path: For your quotes, you say what you need out loud, and the finished text comes back.
* **Invoicing jobs** (level 2, Write it with AI, held: needs_computer)
  * Today: You write invoices by hand after each job, using the same layout again and again.
  * With your path: Each invoice starts from a ready layout, so you only fill in the job details.
* **Texting homeowners** (level 3, Build once, reuse, recipe phone_quick_replies)
  * Today: You text homeowners often, and many of the messages are about the same few things.
  * With your path: For your homeowner texts, your common replies are saved on your phone, each a few letters away.
* **Asking for reviews** (level 3, Build once, reuse, recipe phone_quick_replies)
  * Today: You ask for reviews after jobs, and the request looks much the same each time.
  * With your path: Your common replies are saved on your phone, each a few letters away.
* **Chasing payments** (level 3, Build once, reuse, recipe phone_quick_replies)
  * Today: You chase late payments as they come up, and each reminder takes time to word.
  * With your path: Your common replies are saved on your phone, each a few letters away.

## Her offer

* Your quotes, said out loud, finished as text
* Your homeowner texts, saved once on your phone

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

First message: I’m a self employed electrician with one truck, mostly doing home jobs in Phoenix. Each time I finish a site visit, I need a clear written quote for the homeowner. Turn my notes into a clean quote with a parts line, a labor line, a permit fee line, and a total at the bottom. Include a line saying the quote is good for 30 days and a 50% deposit is needed to book. Keep it short, polite and easy to read on a phone. Here are my notes from this visit: [paste your voice memo notes or typed notes here]

### Step 2, about

Card: claude_about_you

Her note: I’m a self employed electrician with one truck, and most of my work is in homes around Phoenix. I write quotes, invoices and texts to homeowners, so write like a tradesperson talking to a neighbor: plain, friendly and direct. Keep messages short, usually a few sentences. Use simple words and no jargon unless I use it first. Never add details I did not give you, like prices, parts, dates or code rules. If something is missing, put it in square brackets and ask me. Do not make promises for me. I will read everything before it goes out.

### Step 3, workflow: Your quotes, said out loud, finished as text

From now on you say the job out loud and Claude turns it into a finished quote. You already talk it through on a voice memo, so this fits how you work in the truck and at night. Claude writes it in the same layout every time, with parts, labor, permit fee and total, and it only uses what you said.

Recipe say_it_out_loud, route claude

On a phone:
1. Open the Claude app and start a new chat. Paste the opening line Tally wrote for you.
2. Tap the microphone icon on the right side of the message box. The first time, choose your language.
3. Say what you need, the way you would tell a colleague.
4. Tap the arrow to send. Claude writes the finished text from what you said.

Test: The next three times you would have typed this. Good: The text is ready to send after one read, with every detail you said and nothing you did not.
Approval point: You read the finished text and check every name, number and price before you send it.
Cost: Dictation in the Claude app is on every plan, including free, and counts toward your normal limits. OpenAI's page does not say whether ChatGPT's free plan limits dictation.

**Instructions for your assistant**
* I’m a self employed electrician with one truck, doing mostly homes in Phoenix. I’m going to talk through a job after a site visit. Turn what I say into a finished quote I can send to the homeowner. Use this layout: a short line naming the job and the type of home, then parts, labor, permit fee, and the total at the bottom. End with this line: Good for 30 days, 50% deposit to book. Use only the prices, parts and details I say out loud. Never add or guess any. If something is missing, such as a price or a quantity, leave it in square brackets and list what is missing after the quote. Keep the wording plain and friendly, like I’m talking to the homeowner. Give me back the quote as text I can read and send.

**What to say each time**
* The kind of job and the home, for example the type of house and its age.
* Each part and how many, with its price.
* Labor, and what you charge for it.
* The permit fee, if the job needs one.
* Anything that is not included, or anything the homeowner needs to do first.
* The homeowner’s first name, and how long the quote is good for if it is not 30 days.

### Step 4, workflow: Your homeowner texts, saved once on your phone

Your common homeowner texts now live on your phone’s keyboard. You type a few letters and the full reply is ready to tap in. That keeps your texts consistent while you are on the job site, and you only change a name or a time.

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
* Hi [first name], thanks for reaching out. I can come take a look at [address or area] on [day and time]. Does that work for you?
* Hi [first name], I’m on my way and should be there around [time]. See you soon.
* Hi [first name], your quote is ready. I’ll send it over now. It’s good for 30 days, and a 50% deposit books the job.
* Hi [first name], I got your deposit. You’re booked for [day and time]. Let me know if anything changes on your end.
* Hi [first name], the work is done and your invoice is on its way. Thanks for choosing me. Call or text if you have any questions.
* Hi [first name], a friendly reminder that invoice [number] is still open. Could you let me know when I can expect payment?
* Hi [first name], it was good working with you. If you were happy with the job, would you leave me a quick review here? [review link]
* Hi [first name], I’m running behind on a job and will be about [amount of time] late. Sorry for the wait, and thanks for your patience.

**Your shortcuts**
* vsit
* otwy
* qtrd
* depc
* jdone
* pyrm
* revw
* late

### Step 5, end

* Never type a homeowner’s full name, home address, phone number or gate and door codes into Claude. Use square brackets and add them yourself.
* Keep payment details, like card numbers, bank info and account numbers, out of any chat.
* Leave out anything that shows when a home is empty or how its security is set up.
* Read every quote, invoice and text before it goes out. Check each price, part and total against your own numbers.
* Check permit fees and code details against your city’s own sources, not what Claude says.
