# office: recipe path

experiment. Never used it, starter. Both. Can use AI: Not sure.

## Her map

* **Supplier emails** (level 2, Write it with AI)
  * Today: You write these often, and each one takes a fresh start.
  * With your path: Each email starts from a draft you adjust rather than writing from zero.
* **Ordering lunch and drinks** (level 2, Write it with AI)
  * Today: You order these many times a day, and each one starts from scratch.
  * With your path: Each order starts from a draft you only need to check and send.
* **Planning company events** (level 3, Build once, reuse, recipe saved_assistant)
  * Today: You plan events and write the details out by hand.
  * With your path: For your event plans, you hand it the job, and it writes in your voice with your details already in.
* **Restocking the fridges** (level 1, Stays yours)
  * Today: You restock the fridges by hand as needed.
  * With your path: This stays yours, though AI can help you write the list you check against.

## Her offer

* Your supplier emails, written with AI
* Your event plans, with a saved assistant

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

First message: I’m an office coordinator for an office of about 70 people. I regularly email suppliers to order lunch and restock drinks. Write a short, polite email to a supplier. Keep it under 90 words, friendly and clear. Include the date, the number of people, any dietary needs and the items to restock. End the email by asking for their availability and delivery time. Here are this time’s details: [paste the order details here].

### Step 2, about

Card: claude_about_you

On a computer:
1. Click your initials in the lower left corner.
2. Select Settings, then Your Claude. If you see the older Settings page, select Account.
3. Under Instructions, describe how you work and how you like your answers. On the older page this is called Instructions for Claude.
4. Claude uses these instructions in all your chats.

Her note: I am an office coordinator for an office of about 70 people. I handle lunch, drinks, fridge restocking, supplies, company events and suppliers, and I am the person people come to when something is missing or broken. I write to coworkers, suppliers and my manager. Keep the tone friendly, clear and direct, and keep messages short unless I ask for more. Use plain words. Never add details I did not give you, like prices, quantities, dates or policies. If something is missing, put it in square brackets so I can fill it in. Always give me a draft I can read and change before it goes out.

### Step 3, workflow: Your supplier emails, written with AI

Supplier emails get written in Claude each time they come up. You paste one message with today’s details, and Claude drafts the email for you to read and send. That way every email starts from your situation and your tone instead of a blank page.

No recipe: Tally's own three steps for writing it with AI each time.

**Message for supplier emails**
* I am an office coordinator for an office of about 70 people. Please write an email to a supplier in my voice, friendly, clear and short. The email is about [what I need, like a lunch order, drinks, restocking or printer ink]. Details for today: [items and quantities], needed by [day and time], delivery to [address or location], dietary needs [for example 2 vegetarian and 1 gluten free]. Do not add prices, policies or details I did not give you. If something is missing, put it in square brackets. Give me a subject line and the email, ready for me to read and change before I send it.

### Step 4, workflow: Your event plans, with a saved assistant

Your event plans live in a saved Claude assistant that already knows your office, your tone and your usual suppliers. You hand it the event and it drafts the details in your voice, and you read and change them before anything goes out. That way you stop rewriting the same plan from scratch for every event.

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
* You help me plan company events. I am an office coordinator for an office of about 70 people. I handle lunch, drinks, supplies, suppliers and anything that needs fixing, so I plan events from start to finish. When I describe an event, write the plan or the message I ask for in my voice: friendly, clear and plain, with short sentences. Cover the date, the headcount, food and drinks, dietary needs, setup, suppliers to contact and what needs to be ready beforehand. Never invent prices, quantities, dates, vendors or company rules. When a detail is missing, put it in square brackets so I can fill it in. Do not give legal, safety or financial advice. Give me a draft I can read and change, with a short checklist of what I still need to confirm.

**Examples to start with**
* Event: team lunch on [day] for [number] people. Plan: Order lunch from [caterer] by [day]. Include [number] vegetarian and [number] gluten free options. Ask for delivery at [time]. Set up drinks, plates and napkins in [room]. Send the team a note on [day] asking for dietary needs.
* Event: end of quarter celebration on [date]. Plan: Confirm the headcount with my manager. Ask [supplier] for a quote for food and drinks. Book [room] and set up chairs and tables the day before. Remind everyone [number] days ahead with the time and place.
* Event: visitor day at the office on [date]. Plan: Email [supplier] to order coffee, water and snacks for [number] guests. Tidy the common areas and restock the fridges the day before. Tell the team where guests will park and where to meet them.

### Step 5, end

* Never type coworker names, health or allergy details tied to a person, home addresses or phone numbers into Claude. Use square brackets or roles instead.
* Never paste account numbers, payment card details, login details or supplier contract terms.
* Keep dietary needs as counts, like 2 vegetarian, and not names.
* Read every email and plan before it goes out, and check quantities, dates and prices yourself.
* Check with your manager or IT before you use Claude for work, and ask about linking your work email.

> Hi [manager or IT name], I would like to know which AI tools the company has approved and what I may use them for. I am thinking of using one to draft supplier emails and to plan company events, like lunches and drinks orders. I would not put coworker names, personal details or payment information into it, and I would read everything before it is sent. Could you let me know what is allowed, and whether linking my work email to an AI tool needs approval first?
