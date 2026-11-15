# dental: recipe path

allowed employee. Tried it a few times, starter. Both. Can use AI: Yes.

## Her map

* **Appointment reminders** (level 3, Build once, reuse, recipe phone_quick_replies)
  * Today: You write these many times a day, each one from scratch.
  * With your path: For your reminder texts, your common replies are saved on your phone, each a few letters away.
* **Booking appointments** (level 1, Stays yours)
  * Today: You book these by phone and in person throughout the day.
  * With your path: This stays yours, since it happens face to face and on the phone with patients.
* **Answering phone calls** (level 1, Stays yours)
  * Today: You answer many calls a day, many of them the same few questions.
  * With your path: This stays yours, but the scripted answers you reuse can be drafted ahead with AI.
* **Checking insurance coverage** (level 1, Stays yours)
  * Today: You check coverage for patients throughout the week, by phone and in the system.
  * With your path: This stays yours, since it depends on patient and insurance details that should not be typed into AI.
* **Recall messages** (level 3, Build once, reuse, recipe phone_quick_replies)
  * Today: You write these regularly, often the same few messages.
  * With your path: For your recall messages, your common replies are saved on your phone, each a few letters away.
* **Rescheduling when a dentist is out** (level 3, Build once, reuse, recipe phone_quick_replies)
  * Today: You send these when a dentist is out, each time with new dates.
  * With your path: For your reschedule messages, your common replies are saved on your phone, each a few letters away.

## Her offer

* Your reminder texts, saved once on your phone
* Your recall messages, saved once on your phone

Starts with two quick steps:
* Get Claude ready on your phone and computer
* Teach Claude who you are

## Her path

Skipped: nothing

### Step 1, ready

Card: claude_get_started

On a computer:
1. Go to claude.ai in your browser. You can also download Claude Desktop for Mac or Windows.
2. Create a free account. You need to be 18 or older.
3. Type what you need in the message box and click the submit button.

On a phone:
1. Download the Claude app from the App Store on an iPhone or Google Play on Android.
2. Open the app and create a free account. You need to be 18 or older.
3. Type what you need in the message box and send it.

First message: I’m a receptionist at a dental office. I write text messages to patients about appointment changes and reminders. Write a short, friendly text in plain language, under 50 words, that tells the patient about the change below and invites them to reply if the new time doesn’t work. Keep it warm and professional, with no medical advice. Details for this message: [paste the appointment change details here].

### Step 2, about

Card: claude_about_you

On a computer:
1. Click your initials in the lower left corner.
2. Select Settings, then Your Claude. If you see the older Settings page, select Account.
3. Under Instructions, describe how you work and how you like your answers. On the older page this is called Instructions for Claude.
4. Claude uses these instructions in all your chats.

Her note: I am a receptionist at a dental office. I handle phones, scheduling, insurance questions and patient messages. I write short, warm, clear texts to patients, usually a few sentences, in plain words. I never want details added that I did not give you, like times, prices, office rules or insurance facts. If something is missing, put it in square brackets for me to fill in. I never share patient names or health details with you. Give me one draft at a time, and tell me what you assumed so I can check it before anything goes out.

### Step 3, workflow: Your reminder texts, saved once on your phone

Your reminder texts live on your phone’s keyboard, each one a few letters away. You stop rewriting the same message many times a day, and each one still sounds like you. You only change the name or the time before you send.

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

**Your reminder replies**
* Hi [first name], this is a reminder about your visit at [office name] on [day and time]. Reply here to confirm, or call us if you need to change it.
* Hi [first name], the dentist is out on [day], so your visit is moved to [new day and time]. Reply here if that doesn’t work and we’ll find another time.
* Hi [first name], we have you down for [day and time]. Please reply here to let us know you’re coming.
* Hi [first name], we have an opening on [day and time] if you’d like to move your visit. Reply here and we’ll hold it for you.
* Hi [first name], your visit is tomorrow at [time]. Please bring [what to bring]. See you then.
* Hi [first name], we got your note that you can’t make [day and time]. Reply with a few days that work and we’ll find a new time.

**Shortcuts for each reply**
* rmnd
* dsmv
* cfmv
* opnx
* tmrw
* rscx

### Step 4, extra: Your recall messages, saved once on your phone

Recall messages are added to the same saved replies you set up for reminders. They sit on your phone’s keyboard next to the others, each a few letters away.

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

**Your recall replies**
* Hi [first name], it’s time to schedule your next cleaning at [office name]. Reply here with a few days that work, or call us at [phone number].
* Hi [first name], we haven’t seen you in a while and we’d love to get you back on the schedule. Reply here and we’ll find a time.
* Hi [first name], we have openings on [days] for your cleaning. Reply with the one you’d like and we’ll book it.
* Hi [first name], just a friendly follow up about your cleaning. Reply here when you’re ready to pick a time.
* Hi [first name], your next visit is due. Reply with times that work and we’ll set it up.

**Shortcuts for each reply**
* rclm
* rcls
* rcop
* rcfu
* rcdu

### Step 5, end

* Never type patient names, birth dates, phone numbers, addresses or health details into a chat tool. Use square brackets and fill them in yourself.
* Never type insurance member numbers or claim details. Check coverage in your office system.
* Saved replies are templates only. Keep names, times and anything private out of them.
* Read every reply before it goes out, and check the day, time and name.
* Only use tools and tasks your office has approved.

> Hi [manager’s name], I’d like to know which AI tools the office has approved and what I may use them for. I have two tasks in mind: appointment reminder texts and recall messages. I would write general templates with no patient names or health details, and I would read every message before it goes out. Could you let me know what is allowed, or point me to who can say?
