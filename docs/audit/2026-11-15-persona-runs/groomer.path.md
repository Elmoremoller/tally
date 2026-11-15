# groomer: recipe path

self employed Starter. Never used it, starter. Phone only. Can use AI: I work for myself.

## Her map

* **Owner reminder texts** (level 3, Build once, reuse, recipe phone_quick_replies)
  * Today: You send these many times a day, each one typed from scratch.
  * With your path: For your owner reminder texts, your common replies are saved on your phone, each a few letters away.
* **Booking appointments** (level 3, Build once, reuse, recipe phone_quick_replies)
  * Today: You send booking messages many times a day, one at a time.
  * With your path: For your booking messages, your common replies are saved on your phone, each a few letters away.
* **Social posts** (level 3, Build once, reuse, recipe say_it_out_loud)
  * Today: You write social posts for Instagram as you find time for them.
  * With your path: For your social posts, you say what you need out loud, and the finished text comes back.
* **Grooming notes** (level 3, Build once, reuse, recipe say_it_out_loud)
  * Today: You write notes after each groom, often in a rush between clients.
  * With your path: For your grooming notes, you say what you need out loud, and the finished text comes back.

## Her offer

* Your owner reminder texts, saved once on your phone
* Your booking messages, saved once on your phone

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

First message: I’m a mobile dog groomer running my own grooming van. I text owners appointment reminders many times a day. Write a short, friendly text reminder I can send by text message. It should be warm, under 50 words, and say the dog’s name, the day and time, that the van will be in their driveway, and to keep the dog inside until I arrive. Here are this reminder’s details: [paste the owner’s name, dog’s name, day and time here]

### Step 2, about

Card: claude_about_you

Her note: I run my own mobile dog grooming van, and I work from my phone. I write to dog owners by text, mostly about bookings and reminders. My tone is warm, friendly and short, like a quick message from someone who knows their dog. Keep replies to a few sentences. Use plain words and no fancy phrases. Never add details I did not give you, like prices, times, addresses or what a dog needs. If something is missing, put it in square brackets so I can fill it in. I read everything before I send it.

### Step 3, workflow: Your owner reminder texts, saved once on your phone

Your reminder texts now live on your phone’s keyboard, each one a few letters away. You type a short shortcut and the full text appears, then you change the name or the time. That fits your day better because you send these many times a day, from the van, with one hand free.

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
* Hi! Just a reminder [dog’s name] is booked for [day] at [time]. The van will be in your driveway. Please keep [him or her] in the house until I arrive. See you then!
* Hi! I’m on my way and should be there around [time]. Please keep [dog’s name] inside until I get there. See you soon!
* Hi! Quick reminder that [dog’s name] has a groom coming up on [day and time]. Could you reply to let me know that still works?
* Hi! I’m running a little behind and now expect to be there around [new time]. Thank you for your patience!
* Hi! I’ve arrived and the van is parked at your place. You can bring [dog’s name] out when you’re ready.
* Hi! [dog’s name] is all done and looks great. [Short note about the groom]. Thank you, see you next time!

**Shortcuts for replies**
* rmnd
* onwy
* cfrm
* bhnd
* hrvn
* dnxg

### Step 4, extra: Your booking messages, saved once on your phone

Booking messages are added to the same phone keyboard setup you made for your reminder texts. They get their own shortcuts, so a booking reply is a few letters away too.

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

**Your booking replies**
* Hi! Thanks for reaching out. I’d love to groom [dog’s name]. I have [day and time] open. Does that work for you?
* Hi! To book [dog’s name] in, could you send me the breed, the size and the address where the van will park?
* Hi! You’re booked for [day] at [time] for [dog’s name]. I’ll send you a reminder before then. Thank you!
* Hi! I don’t have anything open on [day]. I can do [first option] or [second option]. Which suits you better?
* Hi! No problem, let’s move [dog’s name] to [new day and time]. Does that work for you?
* Hi! Thanks for letting me know. I’ve cancelled [day and time] for [dog’s name]. Message me whenever you’d like to rebook.

**Shortcuts for bookings**
* opnd
* bkin
* bkdd
* nopn
* mvit
* cxld

### Step 5, end

* Never type an owner’s full name, phone number or home address into a chat tool. Use square brackets or a role like “an owner”.
* Keep your replies to saved text on your phone’s keyboard, with brackets for the parts that change, so private details stay in your own messages.
* Never put payment details or card numbers into a chat tool.
* When a dog has a skin or health concern, describe it in general words and leave out the owner’s details. Check anything about a dog’s health against what you know and trust before it goes out.
* Read every message before you send it, and fill in every square bracket.
