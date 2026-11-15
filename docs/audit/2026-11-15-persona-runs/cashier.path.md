# cashier: recipe path

restricted employee. Never used it, starter. Phone only. Can use AI: No, it’s restricted.

## Her map

* **Handling returns** (level 3, Build once, reuse, recipe phone_quick_replies)
  * Today: You handle returns many times a day, mostly by looking things up yourself.
  * With your path: Your common replies are saved on your phone, each a few letters away.
* **Scanning customer items** (level 1, Stays yours)
  * Today: You scan customer items all shift, by hand, at the till.
  * With your path: This part stays yours at the till, since it happens in person and on the register.
* **Restocking shelves** (level 1, Stays yours)
  * Today: You restock shelves through your shift, in person on the floor.
  * With your path: This part stays yours on the floor, since it is hands on work.
* **Answering price questions** (level 1, Stays yours)
  * Today: You answer price questions many times a day, in person.
  * With your path: This part stays yours at the counter, since customers ask you face to face.
* **Counting the till** (level 1, Stays yours)
  * Today: You count the till at the start and end of your shift.
  * With your path: This part stays yours at the register, since it is counted by hand.

## Her offer

* Handling returns, saved once on your phone
* The message to ask what’s allowed

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

First message: I’m a cashier at a big box store and I handle returns and customer questions all day. I need a short, friendly text reply I can send to a coworker. Write it in a casual tone, under 50 words, with blanks for name, day and time. Here is the message I got: [paste the coworker’s text here].

### Step 2, about

Card: claude_about_you

Her note: I work as a cashier at a big box store. I scan items, handle returns, answer price questions, restock shelves and count the till. I talk to customers in person and to coworkers by text. Keep every answer short, friendly and plain, the way I would say it out loud at the register. Write at a simple reading level and never use long paragraphs. Never add details I did not give you, like store rules, prices, dates or return windows. If something is missing, put it in square brackets so I can fill it in. Never use names of real people. Always leave the final check to me before anything goes out.

### Step 3, workflow: Handling returns, saved once on your phone

Your return replies live on your phone’s keyboard, each a few letters away. You stop retyping the same message when you are short on time and a customer or coworker is waiting. You still read each reply before it goes out and fill in the brackets yourself.

Recipe phone_quick_replies, route gboard + any_chat

On a phone:
1. Copy one reply Tally wrote for you, above.
2. Open an app you can type in and tap a text field.
3. At the top of the keyboard, tap Clipboard.
4. Touch and hold the reply you copied, then tap Pin. Pinned replies stay in the Pinned section.
5. Do the same for each reply on your list.

Test: The next three messages that need one of these replies. Good: The reply fits after you change at most a name or a time.
Approval point: You read every reply before you send it. Nothing is sent by itself.
Cost: Text replacement on an iPhone, text shortcuts on a Samsung phone and the Gboard clipboard are free, and Tally writes the replies for you.

**Your replies**
* Hi [first name], thanks for waiting. Do you have your receipt or the card you paid with? That helps me find your purchase.
* I can help with that return. Can you tell me what the item is and when you bought it?
* Let me check our return policy for that item. I’ll tell you what I find in a moment: [policy details from my manager or the posted policy].
* I’m sorry, I can’t finish this return at my register. Let me get [role, like a supervisor] to help you.
* Your return is done. You’ll get [refund method] back. Thanks for coming in, [first name].
* Hey, can you cover my [day] shift? I have an appointment. I can take your [day] in return.
* Thanks for covering. I’ll take your [day] shift, just like we said. I’ll check the schedule app too.

**Your shortcuts**
* rcpt
* rtnq
* plcy
* sprv
* rfnd
* cvrq
* cvok

### Step 4, end

* Never type a customer’s name, card number, address or phone number into a chat tool.
* Never type receipt numbers, account details or anything from the till into a chat tool.
* Do not share coworkers’ names or schedules with a chat tool.
* Check any return policy words against your store’s posted policy or your manager before you use them.
* Read every reply before you send it or say it to a customer.

> Hi [manager or IT], I’m a cashier and I’d like to know which AI tools the company has approved, and what I’m allowed to use them for. I have two tasks in mind: saving common return replies on my phone’s keyboard, and writing shift swap texts to coworkers. I won’t enter customer details or anything from the till. Until I hear back, I won’t use any AI tool for work. Can you tell me what is okay?
