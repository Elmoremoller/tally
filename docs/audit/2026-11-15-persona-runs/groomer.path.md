# groomer: recipe path

self employed Starter. Never used it, starter. Phone only. Can use AI: I work for myself.

## Her map

* **Answering owner messages** (level 3, Build once, reuse, recipe phone_quick_replies)
  * Today: You answer these many times a day, one by one.
  * With your path: Your common replies are saved on your phone, each a few letters away.
* **Booking appointments** (level 1, Stays yours)
  * Today: You book these by hand, one at a time, through your calendar and paper.
  * With your path: Your bookings stay yours, and AI can only help with the wording around them.
* **Owner reminder texts** (level 3, Build once, reuse, recipe phone_quick_replies)
  * Today: You write these again and again by hand, each time from scratch.
  * With your path: For your reminder texts, your common replies are saved on your phone, each a few letters away.
* **Bathing and drying dogs** (level 1, Stays yours)
  * Today: This is hands on work with the dog in front of you.
  * With your path: This stays yours, and AI does not play a part in it.
* **Cutting and styling coats** (level 1, Stays yours)
  * Today: This is hands on work with the dog in front of you.
  * With your path: This stays yours, and AI does not play a part in it.
* **Social posts** (level 3, Build once, reuse, recipe say_it_out_loud)
  * Today: You write these now and then, each one from a blank page.
  * With your path: For your Instagram posts, you say what you need out loud, and the finished text comes back.

## Her offer

* Answering owner messages, saved once on your phone
* Your Instagram posts, said out loud, finished as text

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

First message: I’m a mobile dog groomer who runs my own grooming van, and I answer owner text messages many times a day. Write a short, friendly text reply to the message I paste below. Keep it under 60 words, warm and plain, with no emojis. Only say what I’ve told you. If the owner asks about a time, price or service I haven’t given, say I’ll check and get back to them. Here is the owner’s message: [paste the owner’s message here]

### Step 2, about

Card: claude_about_you

Her note: I run my own mobile dog grooming van. I book appointments, text owners, groom dogs and post on Instagram, all from my phone. I write to dog owners, and sometimes to people who follow my page. My tone is warm, friendly and short, like a quick text from someone who loves their dogs. I like replies of one to three sentences, in plain words. Never add details I did not give you, like prices, times, openings or promises about a dog’s coat or health. If something is missing, put it in square brackets so I can fill it in. Never use fancy words. Always give me something I can read and send as it is.

### Step 3, workflow: Answering owner messages, saved once on your phone

Your common replies live on your phone’s keyboard, each a few letters away. You type a short shortcut and the whole reply is one tap from going in. Owners get a quick answer in your own words, and you stop typing the same price and timing answers from scratch.

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
* Hi [first name], thanks for reaching out! Let me check my calendar and I’ll get right back to you with a time.
* Hi [first name], yes, your appointment is still on for [day and time]. See you and [dog’s name] then!
* Hi [first name], I can do a nails only visit for [dog’s name]. Just let me know what day works and I’ll check my calendar.
* Hi [first name], my prices depend on the size and coat of your dog. Can you tell me the breed and how long it’s been since the last groom? Then I’ll send you a price and the time it takes.
* Hi [first name], a friendly reminder that [dog’s name] has an appointment on [day and time]. Please text me if anything changes!
* Hi [first name], I’m on my way and will be there around [time]. See you soon!
* Hi [first name], thank you for having me today! [dog’s name] was a joy. Let me know when you’d like to book the next visit.

**Your shortcuts**
* chkc
* cnfm
* nlsn
* prcq
* rmnd
* onwy
* thnx

### Step 4, workflow: Your Instagram posts, said out loud, finished as text

You say your post out loud, and Claude turns it into finished text that waits for your OK. You skip the blank page and keep your own voice. You read it, change what you want, then post it yourself.

Recipe say_it_out_loud, route claude

On a phone:
1. Open the Claude app and start a new chat. Paste the opening line Tally wrote for you.
2. Tap the microphone icon on the right side of the message box. The first time, choose your language.
3. Say what you need, the way you would tell a colleague.
4. Tap the arrow to send. Claude writes the finished text from what you said.

Test: The next three times you would have typed this. Good: The text is ready to send after one read, with every detail you said and nothing you did not.
Approval point: You read the finished text and check every name, number and price before you send it.
Cost: Dictation in the Claude app is on every plan, including free, and counts toward your normal limits. OpenAI's page does not say whether ChatGPT's free plan limits dictation.

**Instructions for your assistant**
* I run my own mobile dog grooming van and I post on Instagram. I will tell you out loud what I want to post about, like a groom I just finished, an opening in my schedule or a tip for dog owners. Turn what I say into a finished Instagram caption in my voice, which is warm, friendly and short, in two to four sentences. Use only the details I give you. Do not add prices, times, offers or claims about a dog’s health or coat that I did not say. Do not use the dog owner’s name or any private details. If something is missing, put it in square brackets so I can fill it in. Give me the caption first, then a short line of hashtag ideas I can choose from.

**What to say each time**
* What the post is about, like a before and after, a tip or an opening in my schedule
* The dog’s breed or size, only if I want it in the post
* Anything I want said, like a date, a time or how to book
* Anything to leave out
* The feeling I want, like fun, calm or proud
* Whether I want hashtags

### Step 5, end

* Never type an owner’s full name, phone number or home address into Claude. Use square brackets or just say “an owner”.
* Never type a dog’s health or medical details tied to a person, like a vet record or medication notes.
* Keep prices, times and openings out of what you ask Claude to invent. Add the real ones yourself.
* Read every reply and every post before it goes out, and fix anything that does not sound like you.
* For any health question about a dog, send the owner to their vet instead of using a draft.
