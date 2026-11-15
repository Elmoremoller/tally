# cashier: recipe path

restricted employee. Never used it, starter. Phone only. Can use AI: No, it’s restricted.

## Her map

* **Answering messages** (level 3, Build once, reuse, recipe phone_quick_replies)
  * Today: You answer messages many times a day, each one from scratch.
  * With your path: For your customer texts, your common replies are saved on your phone, each a few letters away.
* **Handling returns** (level 1, Stays yours)
  * Today: You handle returns many times a day, often by asking a manager first.
  * With your path: Your return steps stay at the register, and AI can only help with the wording of a message around them.
* **Answering price questions** (level 1, Stays yours)
  * Today: You answer price questions many times a day while you work the register.
  * With your path: Answering stays face to face at the counter, and AI does not help with that part.
* **Counting the till** (level 1, Stays yours)
  * Today: You count the till at the end of your shift.
  * With your path: Counting stays with you and the till, and AI does not help with it.

## Her offer

* Your customer texts, saved once on your phone
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

First message: I’m a cashier at a big box store and I answer customer messages all day by text. Write a short, polite reply in plain language that a cashier can send. Keep it under 60 words, friendly and clear, and do not invent store policies. Here is what the customer asked: [paste the customer’s message here]

### Step 2, about

Card: claude_about_you

Her note: I work as a cashier at a big box store. I scan items, handle returns, count the till, and answer price and coupon questions. The people I write to are customers, and sometimes coworkers. I like short, friendly, plain replies that sound like a real person. Two or three sentences is plenty. Never add details I did not give you, like prices, dates, store rules or return policies. Use square brackets for anything I need to fill in. Never write anything about someone’s private information. Keep the draft simple so I can read it, change it and send it myself.

### Step 3, workflow: Your customer texts, saved once on your phone

Your customer replies live on your phone’s keyboard, each one a few letters away. You stop typing the same answer from scratch many times a day. Each reply fits after you change a name or a time, so you read it, adjust it and send it.

Recipe phone_quick_replies, route gboard + any_chat

On a phone:
1. Copy one reply Tally wrote for you, above.
2. Open an app you can type in and tap a text field.
3. At the top of the keyboard, tap Clipboard.
4. Touch and hold the reply you copied, then tap Pin. Pinned replies stay in the Pinned section.
5. Do the same for each reply on your list.

Test: The next three messages that need one of these replies. Good: The reply fits after you change at most a name or a time.
Approval point: You read every reply before you send it. Nothing is sent by itself.
Cost: Text replacement on an iPhone, text shortcuts on a Samsung phone and the Gboard clipboard are free, and Tally writes the replies for you.

**Your replies**
* Hi [first name], thanks for reaching out. I can check on that for you. Can you tell me the item and what you need?
* Hi [first name], for a return without a receipt, store credit may be an option. Please check with a manager on [what applies] and we will go from there.
* Hi [first name], I am not able to confirm that price by text. Please bring the item to a register or a price check scanner and we will look it up with you.
* Hi [first name], if a coupon does not scan, bring it to the front and I will ask a manager to check it. It depends on [coupon details].
* Thanks for waiting, [first name]. I checked and [answer]. Let me know if you need anything else.
* Hi [first name], I am sorry about the trouble. A manager can help with this best. Please ask for them when you come in on [day and time].
* Hi [first name], I am not able to help with that one. Please ask a manager or call the store at [store phone number].
* Thanks, [first name]. Have a good day.

**Your shortcuts**
* hlpq
* nrct
* prck
* cpnx
* wait
* sorr
* mgrx
* thnx

### Step 4, end

* Never type a customer’s name, phone number, address, or card or payment details into a chat tool.
* Never type receipt numbers, loyalty account numbers or anything from a customer’s order.
* Never type your store’s till counts, safe details or employee numbers.
* Check what your store allows before using any AI tool for work.
* Read every reply before you send it, and check prices, coupon and return rules against what your manager gives you.

> Hi [manager or IT contact], I would like to know which AI tools, if any, are approved for my work as a cashier, and what I may use them for. I have two uses in mind. One is drafting replies to customer messages. The other is working out how to handle returns and coupons that do not scan. I would not enter any customer details, and I would read everything before using it. Both of these wait for the company’s OK, so please let me know what is allowed.
