# beauty: recipe path

restricted employee. Tried it a few times, starter. Phone only. Can use AI: No, it’s restricted.

## Her map

* **Follow up texts** (level 3, Build once, reuse, recipe phone_quick_replies)
  * Today: You write these many times a day, often starting from your client book each time.
  * With your path: For your follow up texts, your common replies are saved on your phone, each a few letters away.
* **Answering messages** (level 3, Build once, reuse, recipe phone_quick_replies)
  * Today: You answer client texts many times a day, one at a time from scratch.
  * With your path: For your client messages, your common replies are saved on your phone, each a few letters away.
* **Client consultations** (level 1, Stays yours)
  * Today: You run these face to face at the counter as part of your day.
  * With your path: This stays yours in person, and AI can only help with the notes you write afterward.
* **Product demos** (level 1, Stays yours)
  * Today: You give these in person at the counter.
  * With your path: This stays yours in person, with no change from AI.
* **Restocking testers** (level 1, Stays yours)
  * Today: You restock testers by hand throughout the week.
  * With your path: This stays hands on, and AI doesn’t change it.

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

First message: I’m a beauty advisor at a department store makeup counter, and I text clients about new launches, holds and gift with purchase offers from my phone. Write a short, friendly text of 2 to 3 sentences that follows up with a client about a product I’m holding for them, ending with a clear question so they can reply. Keep the tone warm and personal, with no pushy sales language. This time the details are: [describe the product, the client’s shade or item, and any hold date].

### Step 2, about

Card: claude_about_you

Her note: I work as a beauty advisor at a department store makeup counter, and part of my pay is commission. I text my clients from my phone about new launches, held items, gifts with purchase and follow ups after a visit. My clients are regulars and new customers, and I want every message to sound warm, short and like me. Keep replies to a few sentences. Never add details I did not give you, like prices, shades, dates, offers or stock. Use square brackets for anything I need to fill in. Never claim a product does something I did not say. Give me the text only, ready for me to read and change before I send it.

### Step 3, workflow: Your follow up texts, saved once on your phone

Your follow up texts live on your phone’s keyboard, each a few letters away. You stop starting from your client book every time, and you only fill in the name, shade or day. Every text still sounds like you, because the words are yours.

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

**Your follow up replies**
* Hi [first name]! The new [product] just came in and I saved you a shade. Want me to hold it until [day]? Text me back and I’ll set it aside.
* Hi [first name]! It was so nice seeing you today. How are you liking the [product]? Let me know if you want to tweak anything.
* Hi [first name]! We have a gift with purchase starting [day] with [product or set]. Want me to put one aside for you? Just text me back.
* Hi [first name]! Your [product] is back in stock. Shall I hold one for you until [day]?
* Hi [first name]! Just checking in on the [product] you picked up. Any questions on how to apply it? Happy to show you again when you stop by.
* Hi [first name]! We have a launch coming on [day]: [product]. Would you like me to save you one? I can also set up a time to try it.
* Hi [first name]! Thank you for stopping by [day]. I’d love to see you again soon. Text me when you’re free and I’ll save you a spot at the counter.

**Your shortcuts**
* hldb
* thnk
* gwpl
* bkst
* chkn
* lnch
* visi

### Step 4, extra: Your client messages, saved once on your phone

Answering messages is added to the setup you made in the follow up texts step. Your common answers to client texts sit on your phone’s keyboard next to your follow ups.

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

**Your message replies**
* Hi [first name]! Yes, we have [product] in stock. Want me to hold one for you until [day]?
* Hi [first name]! Thanks for asking. I’m at the counter [days and hours], so come by whenever suits you.
* Hi [first name]! I’m not sure about that one yet. Let me check and get back to you today.
* Hi [first name]! Yes, I can show you how to use it. Stop by the counter and ask for me.
* Hi [first name]! Thank you so much for your message. I’ll set it aside for you under your name.
* Hi [first name]! The gift with purchase is available [dates or while supplies last]. Let me know if you’d like me to save one.
* Hi [first name]! So glad you love it! Let me know if you’d like a refill or something to go with it.

**Your shortcuts**
* stck
* hrs
* chkb
* shwm
* setd
* gift
* luvt

### Step 5, end

* Never type a client’s full name, phone number, address or purchase history into a chat tool.
* Use square brackets in place of names and details, and fill them in yourself on your phone.
* Don’t paste your client book or sales numbers into a chat tool.
* Check every text for the right product, shade, offer and day before you send it.
* Only use AI for work tasks once your company says it is okay.

> Hi [manager’s name], I’d like to know which AI tools the company has approved and what I may use them for. I’m thinking of using one to help write my follow up texts to clients and my replies to their messages, without ever typing client names or details into it. I would read every text before sending it. Could you let me know what is allowed, or point me to the right person in IT?
