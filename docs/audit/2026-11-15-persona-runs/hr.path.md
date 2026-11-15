# hr: recipe path

experiment. Tried it a few times, starter. Computer only. Can use AI: Not sure.

## Her map

* **Answering policy questions** (level 2, Write it with AI)
  * Today: You answer these many times a day, mostly one at a time.
  * With your path: Each reply starts from a draft you only need to check and send.
* **Scheduling interviews** (level 2, Write it with AI)
  * Today: You send these by hand, back and forth, each time from scratch.
  * With your path: Each email starts from a draft with the details left for you to fill in.
* **Onboarding new hires** (level 2, Write it with AI)
  * Today: You handle these in Outlook and Excel, step by step for each new hire.
  * With your path: Your checklists and welcome notes start from a draft you only adjust.
* **Writing emails** (level 2, Write it with AI)
  * Today: You write these often, each one from a blank page.
  * With your path: Each email starts from a draft you only need to check.
* **Monthly newsletter** (level 3, Build once, reuse, recipe saved_assistant)
  * Today: You put this together once a month, mostly from scratch.
  * With your path: For your monthly newsletter, you hand it the job, and it writes in your voice with your details already in.

## Her offer

* Answering policy questions, written with AI
* Your monthly newsletter, with a saved assistant

Starts with two quick steps:
* Get Claude ready on your computer
* Teach Claude who you are

## Her path

Skipped: nothing

### Step 1, ready

Card: claude_get_started

On a computer:
1. Go to claude.ai in your browser. You can also download Claude Desktop for Mac or Windows.
2. Create a free account. You need to be 18 or older.
3. Type what you need in the message box and click the submit button.

First message: I’m an HR coordinator at a logistics company with about 300 employees. I answer many policy questions a day, by email, chat and in person, usually pointing people to the employee handbook. Write a short, friendly reply I can send, in plain language and under 90 words, that points to the right handbook section and invites them to contact HR for special cases. Use square brackets for the policy details and the handbook section. Here is the question: [paste the employee’s question here]

### Step 2, about

Card: claude_about_you

On a computer:
1. Click your initials in the lower left corner.
2. Select Settings, then Your Claude. If you see the older Settings page, select Account.
3. Under Instructions, describe how you work and how you like your answers. On the older page this is called Instructions for Claude.
4. Claude uses these instructions in all your chats.

Her note: I’m an HR coordinator at a logistics company with about 300 employees. I handle onboarding, interview scheduling, policy questions, employee records, reminders and a monthly newsletter. I write to employees, new hires, candidates and hiring managers. My tone is warm, clear and professional, and I keep things short, usually a few sentences. Use plain words and no jargon. Never add details I did not give you, such as policy numbers, dates, benefits or rules. If you are missing a fact, leave a square bracket for me to fill in. When a question is about policy, give me a draft I will check against the handbook before it goes out.

### Step 3, workflow: Answering policy questions, written with AI

Each policy question starts with a short message you paste into Claude, with the question and the handbook wording you checked. Claude drafts the reply and you read it before it goes out. Your answers stay consistent and point people to the right handbook section, even when questions come in by email, chat and the shared mailbox.

No recipe: Tally's own three steps for writing it with AI each time.

**Your policy question message**
* I’m an HR coordinator at a logistics company with about 300 employees. An employee asked me this: [paste the question without names]. Here is the wording from our handbook that applies: [paste the handbook section]. Write a short, warm reply in my voice that answers only from that wording. Name the handbook section [section number] and tell them to contact HR if their case is special. Do not add any rule, number or exception that is not in the text I gave you. If something is missing, put it in square brackets. Give me just the reply, ready for me to read and check.

### Step 4, workflow: Your monthly newsletter, with a saved assistant

Claude keeps a saved assistant for your newsletter, with your voice and details already in. Each month you start a new chat, tell it what is going in, and it drafts the issue for you to read and edit. You stop starting from a blank page, and the newsletter sounds the same from month to month.

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
* You help me write our monthly company newsletter. I’m an HR coordinator at a logistics company with about 300 employees. Readers are drivers, warehouse staff, dispatchers and office teams, so keep the words plain and the tone warm and friendly, never stiff. Each issue has a short welcome, [sections I usually include], and a closing line. I will tell you what is going in each month. Use only the facts I give you. Never invent dates, names, numbers, policies or events, and use square brackets where something is missing. Keep each item short and easy to skim. Avoid corporate jargon and hype. Give me a full draft of the issue with a subject line, ready for me to read and edit before it goes out.

**Examples to start with**
* Welcome to the [month] issue. It’s been a busy few weeks, and we want to say thank you to every team for the work you put in. Here’s what’s new and what’s coming up.
* New faces: Please say hello to [first name], who joined our [team] team on [date]. If you see them around, take a minute to welcome them.
* Reminder: [short reminder, such as open enrollment or a form due date] is coming up on [date]. Questions? Reach out to HR at [contact]. Thanks for reading, and see you next month.

### Step 5, end

* Never type employee names, ID numbers, pay, medical details or performance notes into Claude.
* Leave out candidate names, contact details and résumés when you ask for help with interview scheduling or emails.
* Policy answers are drafts. Check each one against your handbook before it goes out.
* Read everything Claude writes before you send or post it.
* Ask before you connect your work email or HR system to any AI tool.

> Hi [manager or IT contact], I’d like to know which AI tools the company has approved and what I’m allowed to use them for. I’m thinking of using one to draft replies to policy questions, to help with interview scheduling emails, and to help write the monthly newsletter. I would never enter employee records or other private details, and I would read everything before it goes out. Could you also tell me whether I may link my work email to an AI tool, or whether that needs approval first?
