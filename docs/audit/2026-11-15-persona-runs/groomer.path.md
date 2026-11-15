# groomer: recipe path

self employed Starter. Never used it, starter. Phone only. Can use AI: I work for myself.

## Her map

* **Answering client messages** (level 3, Build once, reuse, recipe phone_quick_replies)
  * Today: You answer these all day, each one from scratch.
  * With your path: For your client texts, your common replies are saved on your phone, each a few letters away.
* **Appointment reminders** (level 3, Build once, reuse, recipe phone_quick_replies)
  * Today: You text these by hand from your paper diary.
  * With your path: For your appointment reminders, your common replies are saved on your phone, each a few letters away.
* **Booking new clients** (level 3, Build once, reuse, recipe phone_quick_replies)
  * Today: You handle new bookings by text and in person, many times a day.
  * With your path: For your new client bookings, your common replies are saved on your phone, each a few letters away.
* **Social media posts** (level 2, Write it with AI, held: needs_computer)
  * Today: You write posts for your business on your own time.
  * With your path: Each post starts from a rough draft you shape to match your voice.
* **Price and timing questions** (level 3, Build once, reuse, recipe phone_quick_replies)
  * Today: You answer questions about prices and timing for each breed, all day.
  * With your path: For your breed price questions, your common replies are saved on your phone, each a few letters away.

## Her offer

* Your client texts, saved once on your phone
* Your appointment reminders, saved once on your phone

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

First message: I’m a mobile dog groomer who runs my own grooming van. My clients text me to change or ask about appointments. Write a short, friendly text reply I can send from my phone. Keep it under 40 words and sound warm and professional. Here is the client’s message: [paste the client’s message here]

### Step 2, about

Card: claude_about_you

Her note: I run my own mobile dog grooming van. I mostly write to my clients, who are dog owners, by text on my phone. I answer booking questions, move appointments, send reminders and post on social media. I like a friendly, warm tone that is short and plain, usually two or three sentences. I sign off simply. Never add details I did not give you, like prices, times, breeds or names. If something is missing, put it in square brackets so I can fill it in. Always give me one version I can read and send myself, and tell me if you need more information first.

### Step 3, workflow: Your client texts, saved once on your phone

Your client replies now live on your phone’s keyboard, each one a few letters away. You stop typing the same answer from scratch many times a day. Every reply is still yours to read and change before it goes out, so it sounds like you and fits the dog and the day.

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

**Your client replies**
* Hi [first name], thanks for getting in touch! I’d be happy to fit [dog’s name] in. I have [day and time] open. Does that work for you?
* Hi [first name], no problem at all, I can move [dog’s name] to [new day and time]. I’ll update my diary now. See you then!
* Hi [first name], thanks for asking! The price depends on [dog’s breed and size] and the coat. Can you tell me a bit about [dog’s name] and I’ll give you a quote and timing?
* Hi [first name], I’m fully booked on [day], but I have [other day and time] free. Would that suit you?
* Hi [first name], thanks for letting me know. I’m sorry [dog’s name] isn’t feeling well. Let’s pick a new time when [he/she/they] feel better. What day works for you?
* Hi [first name], I’m on my way and will be at your place around [time]. See you soon!
* Hi [first name], thank you so much for having me today! [Dog’s name] was a pleasure. Let me know when you’d like to book the next visit.

**Your shortcuts**
* bkng
* mvap
* qprc
* fulld
* sick
* onwy
* thnx

### Step 4, extra: Your appointment reminders, saved once on your phone

Appointment reminders are added to the setup you made in the first step. They join your saved replies on your phone’s keyboard, so you no longer retype them from your paper diary.

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
* Hi [first name], a quick reminder that [dog’s name] is booked with me on [day and time] at [address]. Please reply to confirm!
* Hi [first name], I’m looking forward to seeing [dog’s name] tomorrow at [time]. Please let me know if anything has changed.
* Hi [first name], just a reminder that [dog’s name] is due for a groom soon. Would you like me to book [day and time]?
* Hi [first name], I’ll be at your place around [time] for [dog’s name]. Please have [dog’s name] ready by the door if you can.
* Hi [first name], I haven’t heard back about [dog’s name]’s appointment on [day and time]. Can you confirm it still works for you?

**Your reminder shortcuts**
* rmnd
* tmrw
* duen
* arvl
* cfrm

### Step 5, end

* Never type a client’s full name, home address, phone number or door codes into a chat tool. Use [square brackets] and fill them in yourself.
* Keep dog health details, like medication or a vet’s diagnosis, out of the chat. Ask for a draft and use your own judgment on the dog’s care.
* Never type payment details or bank information into a chat tool.
* Read every reply, reminder and post before it goes out, and check the day, time and dog’s name against your diary.
* Check any price or timing against your own rates before you send it.
