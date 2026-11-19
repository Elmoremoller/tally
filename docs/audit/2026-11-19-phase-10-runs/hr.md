# hr: the paid path, word for word (Phase 10)

Someone in Outlook and Excel: Priya, the HR coordinator from the earlier runs. Starter on a computer, not sure what her company allows.

Every line below is DRAFT unless DIRECTION.md or Karl already approved it. Buttons are in square brackets. Under each step, the exact clicks come from the checked card or recipe named in the code, never from the model.

### Screen 1. Your two workflows

Tally builds these with you, one at a time. Before each one, a few quick questions about how you do it today.

**Onboarding new hires, tracked from the start day** [Swap]

* Your new hire tracker, one row for each new hire
* Your new hire steps, each dated from the start day
* Your new hire due dates, highlighted when they come round

**Benefits enrollment, collected in one place** [Swap]

* Your benefits enrollment form, written for you
* Your benefits enrollment list, all in one place

[Start with these]

### Screen 2. Onboarding new hires, tracked from the start day

A few quick questions about how you do this today. Tally writes your setup from your answers.

**What starts it each time?**

**[x] A start day, like a new hire's first day** · [ ] A date in the calendar · [ ] Someone asks for it · [ ] An app already runs it for me

**About how many steps are there?**

[ ] Under 5 · [ ] 5 to 10 · **[x] More than 10**

**How many run at the same time?**

[ ] Usually one · **[x] 2 to 5** · [ ] More than 5

**Where do you keep the steps today?**

[ ] In my head · [ ] A checklist on paper · **[x] A sheet** · [ ] In old emails

**Paste your steps** *In any order, as you remember them. Optional.*

> Offer accepted, so send the offer letter and welcome email. Set up the Outlook calendar invites for the first-week meetings. Book the interviews and orientation slots. Put the new hire in the onboarding checklist sheet and tick off each item. Confirm the laptop and badge request. Send the benefits and leave FAQ link. Check the records are updated in the HR system before the start day.

[Write my setup]

### Screen 3. Onboarding new hires, tracked from the start day

From now on, each new hire is one row in a single tracker, and every step is dated from the start day for you. You no longer work out dates by hand or scan a checklist for what is late. The tracker shows the next date due in each row and marks it Due once that day has come, so you can see at a glance which of your new hires needs you today.

**What Tally wrote for you**

*Your new hire tracker*

1. Column A: New hire [Copy]
2. Column B: Start day [Copy]
3. Column C: Offer letter and welcome email [Copy]
4. Column D: Calendar invites for first week [Copy]
5. Column E: Interviews and orientation booked [Copy]
6. Column F: Laptop and badge confirmed [Copy]
7. Column G: Benefits and leave FAQ sent [Copy]
8. Column H: HR system records checked [Copy]
9. Column I: Next due [Copy]
10. Column J: Status [Copy]

*Your new hire step dates*

1. C2: =B2-14 [Copy]
2. D2: =B2-7 [Copy]
3. E2: =B2-7 [Copy]
4. F2: =B2-5 [Copy]
5. G2: =B2-3 [Copy]
6. H2: =B2-1 [Copy]

*Your next due formulas*

1. I2: =IF(COUNT(C2:H2)=0,"All done",MIN(C2:H2)) [Copy]
2. J2: =IF(AND(I2<>"",ISNUMBER(I2),I2<=TODAY()),"Due","") [Copy]

*Your due date highlight*

=AND(ISNUMBER(I2),I2<=TODAY()) [Copy]

**Set it up once**

1. **Set up the tracker with one row for each new hire, and date every step from the start day. Tally has written the columns and the day counts, which you can change to match how you work.** Uses Your new hire step dates, above.
    * Put the start day in its own column, like B.
    * In the cell for a step, paste the formula Tally wrote, like =B2+7 for a week after the start day, and press Enter.
    * If you see a number instead of a date, select the cell, then the arrow next to Number Format, then Short Date.
    * Copy the formulas down to each new row.
2. **Add the Next due column and the Status column so each row shows its earliest step still to do.** Uses Your next due formulas, above.
    * When a step is done, type done over its date. The formula skips words, so done steps drop out.
    * In the Next due column, paste the formula Tally wrote, like =IF(COUNT(C2:F2)=0,"All done",MIN(C2:F2)). It shows the earliest date left in the row.
    * In the column after it, paste =IF(AND(G2<>"",G2<=TODAY()),"Due",""). The row says Due once that day has come, with no highlight needed.
    * Copy both formulas down to each new row.
    * *Good to know:* Excel in a browser takes today's date from Microsoft's server, not from your computer.
    * *Outside the US:* If Excel won't take the formula, type a semicolon wherever it has a comma. Excel uses the separator of your region, and many European regions use a semicolon.
3. **Make the Next due dates stand out once the day has come.** Uses Your due date highlight, above.
    * Open your workbook in Excel in your browser and select the dates to watch, like the Next due column from G2 down.
    * Select Home, then Conditional Formatting, then New Rule.
    * Check that Apply to range shows the cells you selected.
    * In Rule Type, select Formula, then paste the formula Tally wrote, like =AND(G2<>"",G2<=TODAY()). It names the first cell you selected.
    * Choose how the cell should look, like a fill color, then select Done.
    * *Good to know:* Excel on an iPhone shows the highlight but can't make it. The Due column from the next due card works everywhere.
    * *Outside the US:* If Excel won't take the formula, type a semicolon wherever it has a comma. Excel uses the separator of your region, and many European regions use a semicolon.

**Each time from then on**

4. **When you get a new offer acceptance, add a row with the name and start day, then copy the date formulas down from the row above.** Uses Your new hire tracker, above.
5. **Each morning, open the tracker and work through the rows marked Due. When a step is finished, type done over its date.**
6. **Once a new hire shows All done, move that row to your archive sheet so the tracker holds only people still being onboarded.**

**Try it on** Your next two or three new hires, starting from their start days.

**What good looks like** Every new hire has one row, each step has a date, and you see which rows are Due without checking a separate checklist.

**You always check** Check each start day and each date before you rely on it, and confirm the laptop, badge and HR system records yourself before the first day.

**Did it work?** [Yes] [Not quite]

*If it stops working* Apps change their menus now and then. Write to support@tallyher.com and we will check the steps for you.

### Screen 4. Benefits enrollment, collected in one place

A few quick questions about how you do this today. Tally writes your setup from your answers.

**How do requests reach you today?** *Tick all that fit.*

**[x] Email** · [ ] Text messages · [ ] Teams or another chat · [ ] In person · [ ] An app already collects them

**What do you need to know for each one?** *Tick all that fit.*

**[x] Who it is from** · [ ] Where it is · **[x] What it is about** · **[x] How urgent it is** · **[x] When it is needed**

**What happens after one comes in?**

**[x] I sort it out myself** · [ ] I pass it to someone · [ ] I book someone to come

**About how many a week?**

[ ] Under 5 · [ ] 5 to 20 · **[x] More than 20**

**Paste one request you got** *Take out names and private details. Optional.*

> Hi, I'm going on leave at the start of next month and I'm not sure if I need to change my health plan before it starts. Does coverage stop on the last day I work, and is there a deadline to add my new baby? Thanks, I need to submit before Friday.

[Write my setup]

### Screen 5. Benefits enrollment, collected in one place

From now on, colleagues enter their benefits enrollment questions themselves in one form, instead of writing to you one by one. Every request arrives with who it is from, what it is about, how urgent it is and when it is needed. You read them all in one place, so you stop sorting through email.

**Before you start**

* Answers that keep arriving in Excel need a work or school account. Otherwise choose Download a copy, which does not update.

**What Tally wrote for you**

*Your benefits enrollment form*

1. Title: Benefits enrollment request [Copy]
2. Your full name
   Their own words [Copy]
3. What is your request about?
   Changing my health plan
   Adding a family member
   When my coverage starts or ends
   Leave and benefits
   Something else [Copy]
4. How urgent is it?
   I need an answer today
   I need an answer this week
   No rush [Copy]
5. When do you need it by?
   Their own words [Copy]
6. Tell us a little more
   Their own words [Copy]

*Your message with the link*

Hi all, for any benefits enrollment question or change, please use this form instead of emailing me: [link]. It asks who you are, what it is about, how urgent it is and when you need it by. I will read every answer in one place and reply to you. Thanks, [your name] [Copy]

*Your benefits enrollment list*

1. Open the form answers in Excel and leave that workbook as it is. [Copy]
2. Read each row: name, request type, urgency, date needed and details. [Copy]
3. On the form's results page, the count for each request type and urgency is already shown. [Copy]

**Set it up once**

1. **Create the form. Tally has written the questions for you.** Uses Your benefits enrollment form, above.
    * Go to forms.office.com and sign in with your work, school or Microsoft account.
    * Select New Form.
    * Type the title Tally wrote, and a description if you want one. The form saves itself as you go.
    * Select Add new, then choose the kind of question, such as Choice, Text or Date.
    * Type the question and its choices as Tally wrote them. Add each next question the same way.
    * Select Preview to see the form as people will, then select Back to keep editing.
2. **Send the form link to your colleagues using the message Tally wrote.** Uses Your message with the link, above.
    * Go to forms.office.com and open your form.
    * Select Collect responses.
    * Choose who can respond. Only people in my organization can respond keeps it inside your workplace. Anyone can respond lets people answer without signing in.
    * Select Copy link.
    * Paste the link into the message Tally wrote and send it.

**Each time from then on**

3. **Each time you sit down to work on enrollment, open the results page to see how many requests there are for each type and how urgent they are.**
    * Go to forms.office.com and open your form.
    * Select View responses.
    * Each question shows a chart with a number beside each choice. That number is how many people picked it.
    * To see who picked what, select More details under a question.
4. **Open the answers in Excel to read each person's request, who it is from and when they need it. Leave the workbook as it is.** Uses Your benefits enrollment list, above.
    * Go to forms.office.com and open your form.
    * Select View responses.
    * Select Open results in Excel. The answers open in Excel in your browser, one row for each answer and one column for each question.
    * New answers show up in the same workbook, so keep using that one rather than making a new one.
    * *Good to know:* Don't add your own formulas or tables to this workbook, or new answers stop arriving. Count in a copy instead, made with Download a copy.
5. **Reply to each person, starting with the most urgent and earliest dates. When a round of enrollment is finished, start the next one by deleting the old answers in Forms once you have recorded what you need.**

**Try it on** The next benefits enrollment questions that reach you this week.

**What good looks like** Colleagues send their requests through the form, and you see each one with who it is from, what it is about, how urgent it is and when it is needed, with no email sorting.

**You always check** Before you reply to anyone or change anything in a benefits record, check the person's details and the deadline yourself.

**Did it work?** [Yes] [Not quite]

*If it stops working* Apps change their menus now and then. Write to support@tallyher.com and we will check the steps for you.

### Screen 6. That is your path

Both of your workflows are set up. You can come back to any step.

## Seconds and AI cost

| Workflow | Seconds after her answers | Attempts | Tokens in | Tokens out | AI cost |
| --- | --- | --- | --- | --- | --- |
| Onboarding new hires | 8.0 | 1 | 4754 | 968 | $0.0192 |
| Benefits enrollment | 7.7 | 1 | 4570 | 911 | $0.0182 |

Model claude-sonnet-5-5. Her path opened with no AI call when she paid. Playing her answers cost $0.0007 more and is not part of the product.

## Checks

* PASS valid_path: the saved path loads
* PASS did_it_work_steps: Did it work is saved per workflow as task_1 and task_2
* PASS task_1_ids: excel_days_after, excel_next_due, excel_due_highlight, goal, goal, goal
* PASS task_1_not_checked: nothing says not checked
* PASS task_1_no_clicks_from_model: every short line is free of clicks
* PASS task_1_approval: Check each start day and each date before you rely on it, and confirm the laptop, badge and HR system records yourself before the first day.
* PASS task_1_each_time: When you get a new offer acceptance, add a row with the name and start day, then copy the date formulas down from the row above. | Each morning, open the tracker and work through the rows marked Due. When a step is finished, type done over its date. | Once a new hire shows All done, move that row to your archive sheet so the tracker holds only people still being onboarded.
* PASS task_1_no_ai_ask: no AI named
* PASS task_1_goals_plain: 3 goals
* PASS task_1_fast: 8.0 s
* PASS task_2_ids: ms_forms_create, ms_forms_share, ms_forms_results, ms_forms_to_excel, goal
* PASS task_2_not_checked: nothing says not checked
* PASS task_2_no_clicks_from_model: every short line is free of clicks
* PASS task_2_approval: Before you reply to anyone or change anything in a benefits record, check the person's details and the deadline yourself.
* PASS task_2_each_time: Each time you sit down to work on enrollment, open the results page to see how many requests there are for each type and how urgent they are. | Open the answers in Excel to read each person's request, who it is from and when they need it. Leave the workbook as it is. | Reply to each person, starting with the most urgent and earliest dates. When a round of enrollment is finished, start the next one by deleting the old answers in Forms once you have recorded what you need.
* PASS task_2_no_ai_ask: no AI named
* PASS task_2_goals_plain: 1 goals
* PASS task_2_fast: 7.7 s
