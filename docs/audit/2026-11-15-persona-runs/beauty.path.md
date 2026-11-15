# beauty: recipe path

restricted employee. Tried it a few times, starter. Phone only. Can use AI: No, it’s restricted.

## Her map

* **Follow up texts** (level 3, Build once, reuse, recipe phone_quick_replies)
  * Today: You write these many times a day, each one from scratch.
  * With your path: For your follow up texts, your common replies are saved on your phone, each a few letters away.
* **Client book updates** (level Waits for your company's OK)
  * Today: Client notes pile up after visits and take a lot of your time.
  * With your path: You still enter the details yourself, but AI can turn your notes into clean entries faster.
* **Appointment bookings** (level 1, Stays yours)
  * Today: You book appointments many times a day, mostly by hand.
  * With your path: This stays yours, since it happens in person and on the phone.
* **Answering messages** (level 3, Build once, reuse, recipe phone_quick_replies)
  * Today: Client messages come in all day and each needs a quick reply.
  * With your path: Your common replies are saved on your phone, each a few letters away.

## Her offer

* Your follow up texts, saved once on your phone
* Answering messages, saved once on your phone
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

First message: I’m a beauty advisor at a department store makeup counter, and I send follow up texts to clients after a visit or when a new product arrives. Write a short, friendly text, two or three sentences, that sounds warm and personal, not pushy. Keep it casual, the way I’d text a regular client. Here is what this one is about: [paste what the text is for, like a new product, a restock or a visit follow up].

### Step 2, about

Card: claude_about_you

Her note: I work as a beauty advisor at a department store makeup counter, and part of my pay is commission. I write to clients by text, mostly to follow up after a visit or answer a quick question. My tone is warm, friendly and upbeat, never pushy. I like short messages, one to three sentences, that sound like me. Never add details I did not give you, like prices, shade names, stock or dates. Use square brackets for anything I need to fill in. Never invent offers. Give me the draft only, and I will read it and change it before I send it.

### Step 3, workflow: Your follow up texts, saved once on your phone

Your follow up texts live on your phone’s keyboard, each a few letters away. You stop starting from a blank message many times a day. Each reply still sounds like you, and you change only the small details before you send it.

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
* Hi [first name]! It was so nice seeing you today. I hope you love your new look. Come see me anytime if you want to try something else.
* Hi [first name]! [Product name] is in and I thought of you. Stop by when you can and I’ll set it aside for you.
* Hi [first name]! How are you liking [product name]? If you want any tips on using it, I’m happy to show you.
* Hi [first name]! Your [product name] is almost finished, I think. Want me to hold a new one for you? Just let me know.
* Hi [first name]! We have a new [collection or launch] at the counter and I’d love to show you. When would be a good time to stop by?
* Hi [first name]! Thank you for coming in. I’d love to see you again soon. Want me to save a time for you on [day and time]?
* Hi [first name]! I’m thinking of you. If you have an event coming up, I’d be glad to help you plan a look. Just text me.

**Your shortcuts**
* vthx
* vnew
* vhow
* vrfl
* vlnch
* vbk
* vevt

### Step 4, extra: Answering messages, saved once on your phone

Answering messages is added to the setup you made in the step Follow up texts. Your quick answers go on the same phone keyboard list.

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
* Hi [first name]! Thanks for your message. Yes, I can help with that. Let me check and I’ll get right back to you.
* Hi [first name]! I’m with a client right now. I’ll text you back as soon as I’m free.
* Hi [first name]! I can see you on [day and time]. Does that work for you?
* Hi [first name]! I’m not sure on that one. I’ll check and let you know.
* Hi [first name]! Thanks for asking. I’d suggest we talk about your skin and your look in person so I can help you pick the right thing.
* Hi [first name]! I’d be happy to help. Which [product or shade] were you thinking about?

**Your shortcuts**
* qack
* qbusy
* qappt
* qchk
* qinp
* qask

### Step 5, end

* Never type a client’s full name, phone number, address or email into a chat tool.
* Never type skin conditions, allergies or other health details a client told you.
* Never paste your client book or any notes about a client into a chat tool.
* Check with your company before using any AI tool for work, since yours is restricted.
* Read every text before it goes out, and fill in the square brackets yourself.
* Never type prices, stock levels or sales numbers that are not public.

> Hi [manager’s name], I’d like to know which AI tools are approved for my work at the counter and what I may use them for. I have two tasks in mind: writing follow up texts to clients and answering client messages. I would only put in general wording, never client names or private details, and I would read everything before it goes out. I’d also like to know whether I may use AI to help keep my client book up to date, since I know that may need approval first. Could you let me know, or point me to the right person in IT?
