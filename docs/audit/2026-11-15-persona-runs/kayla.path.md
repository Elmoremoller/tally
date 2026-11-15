# kayla: recipe path

self employed Starter. Tried it a few times, starter. Phone only. Can use AI: I work for myself.

## Her map

* **Quoting jobs** (level 3, Build once, reuse, recipe say_it_out_loud)
  * Today: You write a quote most days, and each one starts from scratch.
  * With your path: For your quotes, you say what you need out loud, and the finished text comes back.
* **Texting homeowners** (level 3, Build once, reuse, recipe phone_quick_replies)
  * Today: You send texts to homeowners through the day, often the same few answers.
  * With your path: For your homeowner texts, your common replies are saved on your phone, each a few letters away.
* **Writing invoices** (level 3, Build once, reuse, recipe say_it_out_loud)
  * Today: You write invoices after jobs, one at a time.
  * With your path: For your invoices, you say what you need out loud, and the finished text comes back.
* **Following up quotes** (level 3, Build once, reuse, recipe phone_quick_replies)
  * Today: You chase quotes that have not been answered, usually by text.
  * With your path: Your common replies are saved on your phone, each a few letters away.
* **Answering messages** (level 3, Build once, reuse, recipe phone_quick_replies)
  * Today: You answer homeowner messages as they come in during the day.
  * With your path: Your common replies are saved on your phone, each a few letters away.
* **Chasing payment and asking for reviews** (level 3, Build once, reuse, recipe phone_quick_replies)
  * Today: You send payment reminders and review requests after jobs are done.
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

First message: I’m a self employed electrician in Phoenix, and I write quotes for home jobs after a homeowner describes the work. Write a short quote message I can text to the homeowner. Keep it friendly and plain, under 90 words. Include the total, the deposit percentage, the earliest start day, and a line inviting them to call. Here are the job details: [paste the job details and price here].

### Step 2, about

Card: claude_about_you

Her note: I’m a self employed electrician in Phoenix. I run my own business from one truck, and most of my work is in homes. I write to homeowners who are busy and not technical, so I keep it short, friendly and plain. I like quotes and texts to be clear about the work, the price, the deposit and when I can start. Never add details I did not give you, like prices, dates, permit rules or code claims. Use square brackets for anything missing. Do not use big words or sales talk. Write the way I would talk to a customer at their door. Give me the finished text only, ready for me to read and send.

### Step 3, workflow: Your quotes, said out loud, finished as text

From now on you say the job out loud and Claude writes the quote as a text. You are in the truck or the driveway with your phone, so speaking is faster than typing with your thumbs. Claude puts your words in your format and keeps the details you said, so you read it once and send it.

Recipe say_it_out_loud, route claude

On a phone:
1. Open the Claude app and start a new chat. Paste the opening line Tally wrote for you.
2. Tap the microphone icon on the right side of the message box. The first time, choose your language.
3. Say what you need, the way you would tell a colleague.
4. Tap the arrow to send. Claude writes the finished text from what you said.

Test: The next three times you would have typed this. Good: The text is ready to send after one read, with every detail you said and nothing you did not.
Approval point: You read the finished text and check every name, number and price before you send it.
Cost: Dictation in the Claude app is on every plan, including free, and counts toward your normal limits. OpenAI's page does not say whether ChatGPT's free plan limits dictation.

**Opening line for Claude**
* I’m a self employed electrician in Phoenix. I work from one truck, mostly on home jobs. I will talk to you out loud, and you turn what I say into a quote text I can send to a homeowner. Use this format: one line naming the job, then what is included, then the price, then the deposit, then the earliest start day, then a short line asking them to call or text me if the timing works. Keep my wording plain and friendly, and keep it short. Use only the details I say. Do not add prices, dates, permit rules or anything I did not mention. If something is missing, put it in square brackets. Give me back only the finished text, ready for me to read and send.

**What to say each time**
* The kind of job, like panel upgrade, new circuits or a fixture install
* Where the work is, like attic runs or an outside wall
* What is included, like the permit, parts and cleanup
* The total price
* The deposit amount or percent
* The day you can start
* Anything that could change the price, like a hidden problem found once the wall is open

### Step 4, workflow: Your homeowner texts, saved once on your phone

Your common homeowner replies now live on your phone’s keyboard. You type a few letters and the full reply is ready to put in. The answers you give all day stay in your own words, and you only change a name or a time before you send.

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
* Hi [first name], thanks for reaching out. I can come take a look at the work. What address is it, and what is going on?
* Hi [first name], I can come by [day and time]. Does that work for you?
* Hi [first name], I’m on my way and should be there around [time]. See you soon.
* Hi [first name], here is your quote for [job]. Let me know if you have any questions, and I’m happy to go over it with you.
* Hi [first name], just checking in on the quote I sent for [job]. Do you have any questions, or would you like me to hold a start day for you?
* Hi [first name], your invoice for [job] is attached. Thank you for the work, and let me know if anything looks off.
* Hi [first name], a friendly reminder that the invoice for [job] is still open. Please let me know if you have any questions.
* Hi [first name], thank you for having me out. If you were happy with the work, a short review would mean a lot to me: [review link].

**Your shortcuts**
* lkwk
* vsit
* omw
* qtsnt
* qtfu
* invs
* pyrm
* revw

### Step 5, end

* Never type a homeowner’s full name, home address, phone number or gate and door codes into Claude. Use square brackets and fill them in yourself.
* Never type payment details, like card numbers or bank info, into a chat tool.
* Leave out photos or notes that show a customer’s home security, alarm or camera setup.
* Check every price, deposit, date and permit line against your own numbers and your city’s rules before you send a quote.
* Read everything Claude writes before it goes out, and fix anything that does not sound like you.
