# social_new: recipe path

experiment. Never used it, starter. Both. Can use AI: Not sure.

## Her map

* **Post captions** (level 3, Build once, reuse, recipe saved_assistant)
  * Today: You write these about once a day, each one from scratch.
  * With your path: For your post captions, you hand it the job, and it writes in your voice with your details already in.
* **Comment replies** (level 3, Build once, reuse, recipe phone_quick_replies)
  * Today: You reply to comments one by one as they come in.
  * With your path: For your comment replies, your common replies are saved on your phone, each a few letters away.
* **Weekly content planning** (level 2, Write it with AI)
  * Today: You plan the week’s posts by hand.
  * With your path: You still make the calls on what goes up, and AI helps you lay out the ideas faster.
* **Direct messages** (level 3, Build once, reuse, recipe phone_quick_replies)
  * Today: You answer messages as they come in, often the same questions.
  * With your path: For your message replies, your common replies are saved on your phone, each a few letters away.
* **Emails** (level 3, Build once, reuse, recipe gmail_templates)
  * Today: You write emails by hand each time.
  * With your path: For your emails, your common emails are saved in Gmail as templates, ready to fill in.

## Her offer

* Your post captions, with a saved assistant
* Your comment replies, saved once on your phone

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

First message: I’m a social media manager for a bakery chain. I write Instagram and Facebook captions every day. Write one caption for this post, in a warm, cheerful voice, under 40 words, with one emoji at most and two relevant hashtags. Here is what the post is about: [paste the photo details and the key facts here].

### Step 2, about

Card: claude_about_you

On a computer:
1. Click your initials in the lower left corner.
2. Select Settings, then Your Claude. If you see the older Settings page, select Account.
3. Under Instructions, describe how you work and how you like your answers. On the older page this is called Instructions for Claude.
4. Claude uses these instructions in all your chats.

Her note: I am the social media manager for a chain of bakeries. I write captions, reply to comments and messages, and send emails to customers and to my team. My readers are neighbors and regulars who love fresh bread and pastry, so I keep things warm, short and friendly, with a light touch of charm. Captions stay to a few lines. Replies are one or two sentences. Never add details I did not give you, like prices, hours, flavors or promotions. If something is missing, put it in square brackets and ask me. Do not use hype words. Give me one draft, and I will read and change it before anything goes out.

### Step 3, workflow: Your post captions, with a saved assistant

Your captions now come from a Claude project that already knows your bakeries, your voice and your habits. You tell it what is in the photo and when to come in, and it drafts the caption for you to read. That is better in your job because every post sounds like you without starting from a blank page each day.

Recipe saved_assistant, route claude

On a computer:
1. Open the left side panel and click Projects, or go to claude.ai/projects.
2. Click New Project in the upper right corner.
3. Give the project a name and a description. Claude does not read these.
4. Click Set project instructions, write how Claude should handle this task, then click Save instructions.
5. In the project knowledge on the right, click the plus button and add your examples as documents or text.
6. Start a chat inside the project. Claude uses your instructions and examples in every chat there.
7. Use the instructions and examples Tally wrote for you when the card asks for them.
8. Each time the task comes up, start a new chat in the project and say what you need.

Test: The next three times this task comes up. Good: You change no more than a sentence before you use it.
Approval point: You read what it wrote and fix anything wrong before you send or post it.
Cost: The free plans of ChatGPT and Claude are enough. Claude's free plan allows up to five projects.

**Instructions for your assistant**
* I am the social media manager for a chain of bakeries. You write post captions for our Instagram and Facebook in my voice. Our voice is warm, short and a little playful, like a friendly baker talking to a neighbor. Captions run two to four short lines. I will usually give you a photo description, what the item is and when people should come in. Start with the item or the moment, not with a greeting. Use sensory words like flaky, warm or buttery only when they fit what I told you. Never invent prices, flavors, hours, locations, deals or ingredients I did not give you. If something is missing, put it in square brackets and tell me what you need. Do not use hype words. Avoid long hashtag lists. At most add two or three simple hashtags if I ask. Give me three caption options each time, and say which one is the shortest. I will read and change everything before it is posted.

**Examples to start with**
* Flaky layers, butter rich, and a little bake sitting by the window. Come in before 10 and grab one warm.
* Fresh [item] just came out of the oven. They are best in the first hour, so come say hi before [time].
* [Item] is back this week. Soft inside, golden outside, and ready when you are at [location].

### Step 4, workflow: Your comment replies, saved once on your phone

Your common comment replies now live on your phone’s keyboard. You type a few letters and the whole reply appears, ready for you to adjust. That is better in your job because comments come in all day, and your answers stay warm and consistent without typing each one again.

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
* Thank you so much! We are so glad you enjoyed it. Hope to see you again soon!
* Great question! You can find the details at [location or link]. Let us know if you need anything else.
* We love hearing that. I will pass your kind words on to the bakers!
* Thanks for letting us know. I am sorry about that. Could you send us a message with the details so we can look into it?
* Yes, we do have it! Availability can change, so please check with [location] before you come.
* Thank you for tagging us! We love seeing it.
* Come see us at [location]. We would love to have you!

**Your shortcuts**
* thnk
* qstn
* bkrs
* sry
* hvit
* tgd
* cmsee

### Step 5, end

* Never type customer names, phone numbers, emails or home addresses into Claude. Use square brackets instead.
* Never paste private messages or complaints that include a customer’s personal details.
* Keep your company’s sales numbers, internal plans and staff schedules out of the chat unless your manager says it is fine.
* Check every price, hour, flavor and ingredient against your own approved sources, especially anything about allergens.
* Read every caption and reply before it goes out, and change anything that does not sound like you.

> Hi [manager or IT contact], I would like to know which AI tools the company has approved and what I may use them for. I am thinking of using one to draft post captions and to write replies to comments, and later to plan weekly content, answer messages and write emails. I would also like to know whether I may link my work email to an AI tool, and if not, which of these tasks should wait for your OK. I will read everything before it goes out and keep customer details out of it. Could you let me know what is allowed?
