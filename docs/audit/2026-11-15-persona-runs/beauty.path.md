# beauty: recipe path

restricted employee. Tried it a few times, starter. Phone only. Can use AI: No, it’s restricted.

## Her map

* **Follow up texts** (level 3, Build once, reuse, recipe phone_quick_replies)
  * Today: You write these many times a day, often starting from scratch or an old text.
  * With your path: For your follow up texts, your common replies are saved on your phone, each a few letters away.
* **Answering client messages** (level 3, Build once, reuse, recipe phone_quick_replies)
  * Today: Messages come in all day, and each one needs a bit of thought.
  * With your path: For your client messages, your common replies are saved on your phone, each a few letters away.
* **Customer makeovers** (level 1, Stays yours)
  * Today: Makeovers are hands on, face to face work at the counter.
  * With your path: Makeovers stay yours, and AI doesn’t touch that part of your day.
* **Restocking the counter** (level 1, Stays yours)
  * Today: Restocking happens by hand on the counter throughout your shift.
  * With your path: Restocking stays hands on, and AI doesn’t change that part of your day.
* **Tracking commission sales** (level Waits for your company's OK)
  * Today: You track your commission sales by hand in the book and store system.
  * With your path: Your sales notes stay yours, and AI can help you tidy them into a clear summary.

## Her offer

* Your follow up texts, saved once on your phone
* Your client messages, saved once on your phone
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

First message: I’m a beauty advisor at a department store makeup counter, and I text clients to follow up after visits, restocks and promotions. Write a short, warm text in a friendly, upbeat tone, two to three sentences, that a store can send from a personal phone. Keep it casual, use one emoji at most, and end with a simple question that invites a reply. Here is what this one is about: [paste the client’s name, what they bought or liked, and the news to share].

### Step 2, about

Card: claude_about_you

Her note: I am a beauty advisor at a department store makeup counter. I do makeovers, restock, and text my clients to follow up and answer their messages. I write to clients in a warm, short, friendly way, like a real person at the counter, and one or two sentences is usually enough. I never want you to add details I did not give you, like product facts, prices, offers, or what a client said. If something is missing, leave a square bracket for me to fill in. Give me plain text I can read, change, and send myself.

### Step 3, workflow: Your follow up texts, saved once on your phone

Your replies live on your phone’s keyboard, each a few letters away. You still read each one and change the name or the day before you send it. That beats starting from scratch or copying an old text, because every reply already sounds like you and fits your counter.

Recipe phone_quick_replies, route iphone + any_chat

On a phone:
1. Keep the replies and shortcuts Tally wrote for you open, above.
2. In any app where you can type, touch and hold the Emoji button or the Switch Keyboard key.
3. Tap Keyboard Settings, then tap Text Replacement.
4. Tap the Add button.
5. Type one reply in the Phrase field and its shortcut in the Shortcut field.
6. Do the same for each reply on your list.

Test: The next three messages that need one of these replies. Good: The reply fits after you change at most a name or a time.
Approval point: You read every reply before you send it. Nothing is sent by itself.
Cost: Text replacement on an iPhone, text shortcuts on a Samsung phone and the Gboard clipboard are free, and Tally writes the replies for you.

**Your replies**
* Hi [first name]! The [product] you liked is back in stock and I saved your shade. Want me to hold it until [day]?
* Hi [first name], it was so good seeing you at the counter. How is the [product] working for you? I’m happy to help with anything you need.
* Hi [first name], [current offer] starts [day]. I’d love to set aside [product] for you before then. Want me to?
* Hi [first name], I thought of you when [new product] arrived. Want to stop by on [day] and try it?
* Hi [first name], your [product] may be close to needing a refill. Want me to set one aside in [shade]?
* Hi [first name], just checking in after your makeover on [day]. Let me know if you’d like the steps for the look written down.

**Your shortcuts**
* bkst
* chkn
* ofrz
* nwpd
* rfll
* mkov

### Step 4, extra: Your client messages, saved once on your phone

Answering client messages is added to the setup you made in the follow up texts step. Your quick answers sit on the same keyboard, so each message gets a reply that sounds like you.

Recipe phone_quick_replies, route iphone + any_chat

On a phone:
1. Keep the replies and shortcuts Tally wrote for you open, above.
2. In any app where you can type, touch and hold the Emoji button or the Switch Keyboard key.
3. Tap Keyboard Settings, then tap Text Replacement.
4. Tap the Add button.
5. Type one reply in the Phrase field and its shortcut in the Shortcut field.
6. Do the same for each reply on your list.

Test: The next three messages that need one of these replies. Good: The reply fits after you change at most a name or a time.
Approval point: You read every reply before you send it. Nothing is sent by itself.
Cost: Text replacement on an iPhone, text shortcuts on a Samsung phone and the Gboard clipboard are free, and Tally writes the replies for you.

**Your replies**
* Hi [first name], thanks for your message! Yes, we have [product] in [shade]. Want me to hold it for you until [day]?
* Hi [first name], I’m with another client right now. I’ll write back properly as soon as I’m free.
* Hi [first name], I’m not sure that’s in stock. Let me check and I’ll get back to you by [day].
* Hi [first name], I’m at the counter [days and hours]. Come by any time and I’ll take care of you.
* Hi [first name], I’d suggest [product] for that. Come in and I’ll show you how it looks on you before you decide.
* Hi [first name], thanks for letting me know. I’ll add it to your notes so I remember for next time.

**Your shortcuts**
* qhld
* qbzy
* qchk
* qhrz
* qsgg
* qnts

### Step 5, end

* Never type a client’s full name, phone number, address, or purchase history into a chat tool. Use square brackets and fill them in yourself.
* Leave out anything private from your paper client book, like skin concerns, allergies, or personal notes about a client.
* Do not paste store system details, sales numbers, or commission figures into a chat tool.
* Only check product facts, offers, and stock against your store’s own sources, never from a chat tool’s answer.
* Read every text on your screen and change the brackets before you send it.
* Check with your manager on which tools are approved before you use any AI at work.

> Hi [manager’s name], I’d like to know which AI tools, if any, are approved for use at the counter, and what I’m allowed to use them for. I’m thinking of using one to help me write follow up texts to clients and to answer client messages faster, with no client names or private details typed in. I’d also like to know whether using AI to track my commission sales is allowed, and I will not do that until I hear from you. Could you let me know, or point me to the right person in IT?
