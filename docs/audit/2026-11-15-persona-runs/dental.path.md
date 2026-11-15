# dental: recipe path

allowed employee. Tried it a few times, starter. Both. Can use AI: Yes.

## Her map

* **Appointment reminder texts** (level 3, Build once, reuse, recipe phone_quick_replies)
  * Today: You write these many times a day, often from scratch.
  * With your path: For your reminder texts, your common replies are saved on your phone, each a few letters away.
* **Booking appointments** (level 1, Stays yours)
  * Today: You book these all day, often while the phone is ringing.
  * With your path: This stays with you, since it runs through the schedule and needs the live calendar.
* **Answering phone calls** (level 1, Stays yours)
  * Today: You take calls all day, and many ask the same questions.
  * With your path: This stays with you on the phone, with AI helping only to prepare short answers ahead of time.
* **Checking insurance coverage** (level 1, Stays yours)
  * Today: You check coverage for patients many times a day, one at a time.
  * With your path: This stays with you, since it depends on each patient’s plan and records.
* **Recall reminders** (level 3, Build once, reuse, recipe phone_quick_replies)
  * Today: You send these on a regular basis to bring patients back in.
  * With your path: For your recall reminders, your common replies are saved on your phone, each a few letters away.
* **Moving appointments** (level 3, Build once, reuse, recipe phone_quick_replies)
  * Today: You rebook patients whenever a dentist is out, which happens often.
  * With your path: Your common replies are saved on your phone, each a few letters away.

## Her offer

* Your reminder texts, saved once on your phone
* Your recall reminders, saved once on your phone

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

First message: I’m a receptionist at a dental office. I send patients text messages about appointments, including reminders and moved appointments. Write a short, friendly text message, two or three sentences, that is warm and clear and easy to read on a phone. Keep it to one message with no extra explanation. Here is what this one is about: [paste the details of this appointment here]

### Step 2, about

Card: claude_about_you

On a computer:
1. Click your initials in the lower left corner.
2. Select Settings, then Your Claude. If you see the older Settings page, select Account.
3. Under Instructions, describe how you work and how you like your answers. On the older page this is called Instructions for Claude.
4. Claude uses these instructions in all your chats.

Her note: I am a receptionist at a dental office. I handle phones, scheduling, insurance questions and patient messages. When I ask you to write something, it goes to patients, so keep it warm, calm and short. I like plain sentences and a friendly tone, and I usually want a text to be two or three sentences. Never add details I did not give you, like times, prices, coverage or policies. Use square brackets for anything I need to fill in. Never include private patient details. If you are not sure about something, ask me before you guess.

### Step 3, workflow: Your reminder texts, saved once on your phone

Your reminder texts now live on your phone’s keyboard. Each one is a few letters away, so you stop writing the same message from scratch many times a day. You read it, change the name or the time, and send it. That keeps every text steady and in your own voice.

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
* Hi [first name], this is a reminder of your appointment on [day] at [time]. Reply here if you need to change it. Thanks!
* Hi [first name], we are looking forward to seeing you on [day] at [time]. Please let us know if anything changes. Thanks!
* Hi [first name], [dentist] is out on [day], so your appointment is moving to [new day and time]. Reply here if that does not work and I will find another slot. Thanks!
* Hi [first name], we have not heard back about your appointment on [day] at [time]. Please reply to confirm, or call us if you need to move it. Thanks!
* Hi [first name], we are sorry we missed you today. Reply here and I will help you find a new time. Thanks!
* Hi [first name], a spot opened up on [day] at [time]. Reply here if you would like it and I will book it for you.

**Your shortcuts**
* rmnd
* lkfw
* dmov
* cfrm
* msd
* opn

### Step 4, extra: Your recall reminders, saved once on your phone

Recall reminders are added to the keyboard replies you set up for your reminder texts. They sit with the others, each a few letters away.

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

**Your recall reminders**
* Hi [first name], it is time to schedule your next visit with us. Reply here or call [office phone] and we will find a time that works. Thanks!
* Hi [first name], it has been a while since your last visit. Would you like to book your next appointment? Reply with a day that suits you and I will check the schedule.
* Hi [first name], we still have your recall visit open. We have times on [day] and [day]. Reply with the one you prefer and I will book it.
* Hi [first name], just checking in about your next visit. If you already booked, please ignore this message. If not, reply here and I will help you find a time.
* Hi [first name], we would love to see you again. Reply here or call us to book your next visit. Thanks!

**Your recall shortcuts**
* rcl
* rcls
* rcop
* rcck
* rcsy

### Step 5, end

* Never type a patient’s name, date of birth, phone number or address into Claude. Use brackets and fill those in yourself.
* Never type insurance member numbers, claim details or payment information.
* Never paste notes from a patient chart or anything about a patient’s health.
* Read every reminder text before you send it, and check the day and time against the schedule.
* Keep insurance and coverage answers coming from your office’s own approved sources, not from a draft.

> Hi [manager name], I would like to know which AI tools the office approves and what I may use them for. I have two tasks in mind. One is writing appointment reminder texts and recall reminders, and the other is drafting answers to common phone questions. I would not type any patient names or private details into a tool, and I would read everything before it goes out. Could you tell me what is allowed, or point me to the right person?
