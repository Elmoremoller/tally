# groomer: recipe path

self employed Starter. Never used it, starter. Phone only. Can use AI: I work for myself.

## Her map

* **Answering messages** (level 3, Build once, reuse, recipe phone_quick_replies)
  * Today: You answer client texts from the van, often right between grooms.
  * With your path: Your common replies are saved on your phone, each a few letters away.
* **Booking grooming slots** (level 1, Stays yours)
  * Today: You fit bookings into your calendar as they come in, many times a day.
  * With your path: Your calendar stays yours, and AI can only help with the wording of the messages around it.
* **Appointment reminders** (level 3, Build once, reuse, recipe phone_quick_replies)
  * Today: You send reminder texts by hand, many times a day.
  * With your path: For your reminder texts, your common replies are saved on your phone, each a few letters away.
* **Client follow ups** (level 3, Build once, reuse, recipe phone_quick_replies)
  * Today: You write follow ups one at a time after each visit.
  * With your path: Your common replies are saved on your phone, each a few letters away.
* **Social media updates** (level 2, Write it with AI, held: needs_computer)
  * Today: You write Instagram posts when you have time between jobs.
  * With your path: Each post starts from a draft you tweak to match your day’s work.
* **Price and reschedule questions** (level 3, Build once, reuse, recipe phone_quick_replies)
  * Today: You answer the same price and reschedule questions every day.
  * With your path: Your common replies are saved on your phone, each a few letters away.

## Her offer

* Answering messages, saved once on your phone
* Your reminder texts, saved once on your phone

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

First message: I’m a mobile dog groomer working from my van. When a client texts asking about an appointment, a price, or a reschedule, I need a short, friendly reply I can send from my phone between grooms. Write a text reply in a warm, plain tone, two to three sentences, no sign off. Tell me what the client asked and any details I know, and I will fill them in. The client’s message is: [paste the client’s message here]

### Step 2, about

Card: claude_about_you

Her note: I run my own mobile dog grooming van. I handle bookings, appointment reminders, client messages and social posts from my phone, often between grooms. I write to dog owners who want a quick, friendly, clear answer. Keep a warm and plain tone, short sentences, and keep texts to two or three lines. Never add details I did not give you, like prices, openings or services I did not mention. Use square brackets for anything I need to fill in. Never promise a time slot for me. I read everything before I send it.

### Step 3, workflow: Answering messages, saved once on your phone

Your replies live on your phone’s keyboard. Each one is a few letters away, so you can answer from the van with wet hands and change only a name or a time. Your answers stay in your own voice, and you read each one before it goes out.

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
* Hi [first name], thanks for reaching out! Yes, [day and time] is open. Want me to book it for [dog’s name]?
* Hi [first name], thanks for asking! [Day and time] is not open, but I have [other day and time]. Does that work?
* Hi [first name], I’d be happy to help. The price depends on your dog’s size and coat. Can you tell me the breed and how long since the last groom?
* Hi [first name], if [dog’s name] is matted, the groom can take longer and may cost more. I’ll check the coat when I arrive and talk with you first.
* Hi [first name], no problem at all. I can move your appointment to [new day and time]. Does that work for you?
* Hi [first name], thanks for letting me know. I’m with a dog right now and will reply properly as soon as I’m done. Talk soon!
* Hi [first name], I’m on my way and will be there around [arrival time]. See you soon!

**Your shortcuts**
* opn
* nope
* prc
* mtd
* rsch
* busy
* eta

### Step 4, extra: Your reminder texts, saved once on your phone

Your reminder texts are added to the replies you saved in the step on answering messages. They sit on your phone’s keyboard, a few letters away, so you stop typing each one by hand.

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

**Your reminder texts**
* Hi [first name], a friendly reminder that [dog’s name] has a grooming appointment on [day and time]. Please reply to confirm.
* Hi [first name], I’ll be at your place tomorrow at [time] for [dog’s name]. Please reply to confirm.
* Hi [first name], I’m on my way for [dog’s name]’s groom and should arrive around [arrival time]. See you soon!
* Hi [first name], just checking that [day and time] still works for [dog’s name]. Let me know if you need to change it.
* Hi [first name], thanks for having us today! [dog’s name] did great. Let me know when you’d like to book the next visit.

**Your shortcuts**
* rmdr
* tmrw
* otw
* cfm
* thx

### Step 5, end

* Never type a client’s full name, home address, phone number or gate code into a chat tool. Use square brackets instead.
* Keep your dog’s health details, like medical notes or medication, out of what you type. Write a general draft and add them yourself.
* Do not type payment details or account numbers into a chat tool.
* Read every reply, reminder and post before it goes out, and fix anything that is not right.
* Check prices, openings and your own rules yourself, since the AI does not know them.
