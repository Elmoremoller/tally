# hr: her job as responsibilities (experiment three)

Designed by the model from her quiz answers. Her job is read as responsibilities, not writing tasks, each matched to the ten patterns and given the simplest workflow that removes the repeated work. Click paths from cards and recipes are checked by us. Every other step in an app names the feature it relies on and is not checked by us; its link is the vendor's own help page, found with web search, or none found. A click path from the model shows only beside such a link, and needs checking against it.

starter. Computer only. Can use AI: Not sure. Where her work happens: Microsoft Teams, SharePoint, Outlook, HR system, Excel for the checklist. Not sure which others.

7 responsibilities, 1 left as hers, 6 with something AI builds once. 18 steps: 2 checked, 12 not checked by us (8 with a vendor help page, 4 with none found), 4 outside any app.

Patterns used: 1 (Messages she repeats) 5, 6 (Requests from colleagues, collected in one place) 4, 7 (Routines and reminders on a schedule) 4, 2 (Documents she repeats) 2, 5 (Events that repeat, run from a checklist) 2, 8 (An inbox that needs sorting and follow up) 1, 9 (Notes that become tables or reports) 1, 10 (Answers looked up in documents she already has) 1.

Levels: Stays yours 1, Build once, reuse 6.

## Her top two

1. **Answering benefits questions.** It comes up many times a day and the answers repeat.
2. **Onboarding new hires.** You named it as a top time saver and every hire repeats the same steps.

## Answering benefits questions

Patterns: 10, Answers looked up in documents she already has; 1, Messages she repeats; 6, Requests from colleagues, collected in one place.

Level: 3, Build once, reuse. Held: you are not sure yet what your company allows.

**Around it.** Questions arrive by Outlook, Teams and at your desk, and you look up the same answers in the benefits portal and check some with payroll.

**Today.** Questions come many times a day by email, Teams chat and people stopping at your desk. You point people to the benefits portal and confirm details with payroll.

**The new way.** You make a Claude project that holds your benefits documents and your usual answers, once. When a question comes in, you paste the question without names, read the draft answer and send it yourself from Outlook or Teams. Anything about pay goes to payroll first, so the answers stay consistent and you stop looking things up again.

**Built once.** a Claude project with your benefits documents, your usual answers and a note on what needs payroll confirmation

**On her map.** A saved assistant that knows your benefits documents drafts the usual answers, and you check each one.

**In her offer.** Your benefits answers, from one saved assistant

**Setup**

1. Ask your manager or IT whether you may put benefits documents and questions into an AI tool.
2. Make a Claude project for benefits questions and add the benefits documents you are allowed to share. (Claude). Checked: card claude_project.
   * On a computer:
     1. Open the left side panel and click Projects, or go to claude.ai/projects.
     2. Click New Project in the upper right corner.
     3. Give the project a name and a description. Claude does not read these.
     4. Click Set project instructions, write how Claude should handle this task, then click Save instructions.
     5. In the project knowledge on the right, click the plus button and add your examples as documents or text.
     6. Start a chat inside the project. Claude uses your instructions and examples in every chat there.
3. Tell the project to answer only from your documents, to say when the answer is not there, and to flag anything about pay for payroll. (Claude). Relies on **Claude project instructions**. **Not checked by us.**
   * Vendor help page: [How can I create and manage projects?](https://support.claude.com/en/articles/9519177-how-can-i-create-and-manage-projects)
4. Save the final answers you use most as reusable text blocks for the questions that repeat. (Microsoft Outlook). Relies on **Outlook Quick Parts**. **Not checked by us.**
   * Vendor help page: [Quick Parts](https://support.microsoft.com/en-us/word/quick-parts)

**What Tally would write for her**

* Project instructions: How the assistant answers from your documents, when it says it does not know and when it flags payroll.
* Usual answers: Short answers to the most common benefits questions, with blanks for [company specific details].
* Payroll check list: The kinds of questions, like paid parental leave, that you confirm with payroll before answering.

**Where she checks.** You read each draft against the benefits portal and send it yourself, with no employee names put into the tool.

## Onboarding new hires

Patterns: 5, Events that repeat, run from a checklist; 2, Documents she repeats; 1, Messages she repeats; 7, Routines and reminders on a schedule.

Level: 3, Build once, reuse. Held: you are not sure yet what your company allows.

**Around it.** Each new hire needs the same checklist in Excel, the same welcome messages, the same forms and the same follow ups.

**Today.** You onboard new hires using a checklist in Excel. The steps and messages repeat for each person.

**The new way.** AI helps you build once a clean Excel checklist with every step, who does it and when, counted from the start date. For each new hire you copy the sheet, enter the start date and work down it. The welcome email and reminders come from saved text, so nothing gets forgotten.

**Built once.** an onboarding checklist in Excel with date formulas, plus saved welcome and reminder messages

**On her map.** One standard onboarding checklist with dates that fill in, and saved welcome messages for each step.

**In her offer.** Your onboarding, from one standard checklist

**Setup**

1. Ask whether you may use an AI tool for HR work, using only general descriptions with no employee details.
2. Paste your current checklist steps without names and ask for a standard checklist with owners and days from the start date. (Claude). Relies on **a feature it did not name**. **Not checked by us.**
   * Vendor help page: none found.
3. Build the checklist with a start date cell that works out each due date. (Microsoft Excel). Relies on **Excel formulas**. **Not checked by us.**
   * Vendor help page: [Overview of formulas in Excel](https://support.microsoft.com/en-us/excel/get-started/overview-of-formulas-in-excel)
4. Colour overdue steps so you see what is late. (Microsoft Excel). Relies on **Excel conditional formatting**. **Not checked by us.**
   * Vendor help page: [Use conditional formatting to highlight information in Excel](https://support.microsoft.com/en-us/excel/use-conditional-formatting-to-highlight-information-in-excel)
5. Save the welcome email and the first week reminder as text blocks with gaps for name and date. (Microsoft Outlook). Relies on **Outlook Quick Parts**. **Not checked by us.**
   * Vendor help page: [Quick Parts](https://support.microsoft.com/en-us/word/quick-parts)

**What Tally would write for her**

* Checklist layout: Columns and steps for the Excel onboarding checklist, with owner and days from start.
* Welcome email: A standard welcome with gaps for [name], [start date] and [manager].
* Reminder messages: Short notes to managers and IT about their onboarding tasks.

**Where she checks.** You fill in each gap and read every message before you send it yourself.

## Scheduling interviews

Patterns: 1, Messages she repeats; 5, Events that repeat, run from a checklist; 6, Requests from colleagues, collected in one place.

Level: 3, Build once, reuse.

**Around it.** You go back and forth with candidates and managers to find times, then send the same confirmations.

**Today.** You schedule interviews by email and messages with candidates and managers.

**The new way.** You save the invitation, the confirmation and the reschedule note as Outlook text blocks, and keep a short checklist for each interview. You fill in the time and name and send. The wording stays the same every time, so you stop retyping it.

**Built once.** saved Outlook text blocks for invitation, confirmation and reschedule

**On her map.** Saved invitation and confirmation messages, with a standard interview checklist.

**In her offer.** Your interview scheduling, from saved messages

**Setup**

1. Write the invitation, confirmation and reschedule messages once as text blocks with gaps. (Microsoft Outlook). Relies on **Outlook Quick Parts**. **Not checked by us.**
   * Vendor help page: [Quick Parts](https://support.microsoft.com/en-us/word/quick-parts)
2. Keep a simple list of candidates, interview times and status. (Microsoft Excel). Relies on **Excel table**. **Not checked by us.**
   * Vendor help page: [Overview of Excel tables](https://support.microsoft.com/en-us/excel/overview-of-excel-tables)

**What Tally would write for her**

* Invitation: Interview invitation with gaps for [name], [role], [date] and [place].
* Confirmation and reschedule: Two short messages for confirming and moving a time.

**Where she checks.** You check the time, name and role in each message before you send it yourself.

## Updating employee records

Patterns: 6, Requests from colleagues, collected in one place; 7, Routines and reminders on a schedule.

Level: 1, Stays yours.

**Around it.** Changes arrive in different ways and you enter them in the HR system, which needs care each time.

**Today.** You update employee records in the HR system when changes come in.

**Stays hers.** This should stay yours. It holds private details about colleagues and an error affects pay or benefits. Putting that into an AI tool is not worth the risk.


## Writing policy reminders

Patterns: 1, Messages she repeats; 7, Routines and reminders on a schedule.

Level: 3, Build once, reuse. Held: you are not sure yet what your company allows.

**Around it.** The same kinds of reminders go out again and again to staff.

**Today.** You write policy reminders for staff when they are needed.

**The new way.** You build one set of reminders with AI, one for each policy, with gaps for dates and details. You add a recurring Outlook reminder to send each one. Then you copy, fill in and send without writing again.

**Built once.** a set of policy reminder messages with a send schedule

**On her map.** A saved set of reminder messages and a schedule for when each goes out.

**In her offer.** Your policy reminders, from saved messages

**Setup**

1. Ask whether you may use an AI tool to draft general HR messages.
2. Ask for a reminder message for each policy with gaps for [policy], [date] and [link]. (Claude). Relies on **a feature it did not name**. **Not checked by us.**
   * Vendor help page: none found.
3. Set a repeating reminder for each policy message to yourself. (Microsoft Outlook). Relies on **Outlook recurring tasks**. **Not checked by us.**
   * Vendor help page: none found (no vendor page in the results).

**What Tally would write for her**

* Policy reminders: One short message per policy with gaps for the details.
* Reminder calendar: A list of which reminder goes out and when.

**Where she checks.** You check the policy details and link, then send each reminder yourself.

## Monthly newsletter

Patterns: 2, Documents she repeats; 9, Notes that become tables or reports; 7, Routines and reminders on a schedule.

Level: 3, Build once, reuse. Held: you are not sure yet what your company allows.

**Around it.** Every month you gather items and write it in the same shape.

**Today.** You write the newsletter every month.

**The new way.** You make a Claude project with the layout and a past issue. Each month you paste your notes and get a draft in the same shape. You edit it and publish it yourself.

**Built once.** a Claude project with the newsletter layout and tone

**On her map.** A saved newsletter layout and a prompt that turns your notes into a draft.

**In her offer.** Your newsletter, from one saved layout

**Setup**

1. Ask whether you may put newsletter content into an AI tool.
2. Make a project for the newsletter with a past issue and the layout. (Claude). Checked: card claude_project.
   * On a computer:
     1. Open the left side panel and click Projects, or go to claude.ai/projects.
     2. Click New Project in the upper right corner.
     3. Give the project a name and a description. Claude does not read these.
     4. Click Set project instructions, write how Claude should handle this task, then click Save instructions.
     5. In the project knowledge on the right, click the plus button and add your examples as documents or text.
     6. Start a chat inside the project. Claude uses your instructions and examples in every chat there.
3. Set a monthly reminder to collect items. (Microsoft Outlook). Relies on **Outlook recurring tasks**. **Not checked by us.**
   * Vendor help page: none found (no vendor page in the results).

**What Tally would write for her**

* Newsletter layout: Sections in the order you use them each month.
* Monthly prompt: What to paste in and how the draft should come back.

**Where she checks.** You read the draft, check every date and fact, and send it yourself.

## Answering messages and emails

Patterns: 1, Messages she repeats; 8, An inbox that needs sorting and follow up; 6, Requests from colleagues, collected in one place.

Level: 3, Build once, reuse.

**Around it.** Many messages repeat the same answers and arrive in Outlook and Teams.

**Today.** You answer messages and write emails daily.

**The new way.** You pick your ten most common replies and save them as Outlook text blocks. You fill gaps and send. Questions that need thought you still answer yourself.

**Built once.** saved Outlook text blocks for your most common replies

**On her map.** Saved replies for the questions you answer most.

**In her offer.** Your common replies, saved once

**Setup**

1. Save your most common replies as text blocks. (Microsoft Outlook). Relies on **Outlook Quick Parts**. **Not checked by us.**
   * Vendor help page: [Quick Parts](https://support.microsoft.com/en-us/word/quick-parts)

**What Tally would write for her**

* Common replies: Short replies for the questions you answer most, with gaps.

**Where she checks.** You read each reply and send it yourself.

## Checks

* Pass, three_patterns: 7 responsibilities, each with patterns from the ten
* Pass, three_refs_real: Every card and recipe id exists
* Pass, three_links_vendor: Every link is on the vendor's own site
* **Fail**, three_feature_named: Paste your current checklist steps without names and ask for a standard checklist with owners and da | Ask for a reminder message for each policy with gaps for [policy], [date] and [link].
* Pass, three_no_click_without_link: No menu path or button name outside a linked click path
* Pass, three_approval: Every workflow has a point where she checks
* Pass, three_copy_rules: No dashes, promised times, prices or percents
* Pass, three_levels: Every level is 1 to 5, and level 1 means it stays hers
* Pass, three_starter_level: Every level is 3 or lower for a Starter
* **Fail**, three_not_writing_help: A saved newsletter layout and a prompt that turns your notes into a draft.
* Pass, three_no_connect: No step connects a work app
* Pass, three_ask_first: Her path opens with the message to ask what is allowed
* Pass, three_top_two: Top: Answering benefits questions, Onboarding new hires; 2 workflows on her path
