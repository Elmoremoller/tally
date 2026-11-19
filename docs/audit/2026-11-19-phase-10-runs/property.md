# property: the paid path, word for word (Phase 10)

A job never tested before: a property manager for 40 rental apartments. Builder who uses ChatGPT some weeks, Gmail and Google Sheets, computer and phone, her company is fine with AI.

Every line below is DRAFT unless DIRECTION.md or Karl already approved it. Buttons are in square brackets. Under each step, the exact clicks come from the checked card or recipe named in the code, never from the model.

### Screen 1. Your two workflows

Tally builds these with you, one at a time. Before each one, a few quick questions about how you do it today.

**Your repair requests, collected in one place** [Swap]

* Your repair form, written for you
* Your repair list, all in one place

**Inspections, turned into rows for your sheet** [Swap]

* Your inspection sheet columns, set up for you
* Your inspection instructions that turn notes into rows

[Start with these]

### Screen 2. Your repair requests, collected in one place

A few quick questions about how you do this today. Tally writes your setup from your answers.

**How do requests reach you today?** *Tick all that fit.*

**[x] Email** · **[x] Text messages** · [ ] Teams or another chat · [ ] In person · [ ] An app already collects them

**What do you need to know for each one?** *Tick all that fit.*

**[x] Who it is from** · **[x] Where it is** · **[x] What it is about** · **[x] How urgent it is** · **[x] When it is needed**

**What happens after one comes in?**

[ ] I sort it out myself · [ ] I pass it to someone · **[x] I book someone to come**

**About how many a week?**

[ ] Under 5 · [ ] 5 to 20 · **[x] More than 20**

**Paste one request you got** *Take out names and private details. Optional.*

> Hi Dana, the kitchen sink in unit 3B is backing up again and water is pooling on the floor. Can someone come today? I'm home after 4 if that works. Thanks, Marcy

[Write my setup]

### Screen 3. Your repair requests, collected in one place

From now on, repairs no longer reach you one by one by email and text. Everyone sends a request through one form, and every request lands as a row in one list. You see who it is from, where it is, what it is about, how urgent it is and when it is needed, all in the same place, so you can book someone to come without piecing details together.

**What Tally wrote for you**

*Your repair form*

1. Who is this from?
   Their own words [Copy]
2. Where is the problem?
   Their own words [Copy]
3. What is the problem?
   Their own words [Copy]
4. How urgent is it?
   Emergency, water or safety risk
   Urgent, needs to be fixed in a day or two
   Normal, can wait for the next visit [Copy]
5. When do you need someone to come?
   Their own words [Copy]

*Your message with the link*

Hi all, to report a repair, please use this form instead of emailing or texting me: [link]. It takes a minute. Tell me who you are, where the problem is, what is wrong, how urgent it is and when someone can come. If there is water or a safety risk, please also call me right away. Thanks, [your name] [Copy]

*Your repair list columns*

1. Timestamp [Copy]
2. Who is this from? [Copy]
3. Where is the problem? [Copy]
4. What is the problem? [Copy]
5. How urgent is it? [Copy]
6. When do you need someone to come? [Copy]
7. Status [Copy]
8. Who is booked [Copy]

*Your urgent row color*

=$E1="Emergency, water or safety risk" [Copy]

**Set it up once**

1. **Create the form. Tally has written the questions for you.** Uses Your repair form, above.
    * Go to forms.google.com.
    * Click Blank form, then name the form with the title Tally wrote.
    * Click Add, then to the right of the question title, choose the type of question.
    * Type the question and its choices as Tally wrote them. To make sure nobody skips it, turn on Required.
    * Add each next question the same way.
2. **Send the form answers to a sheet, so every request becomes a row in one list.**
    * Open your form in Google Forms.
    * At the top, click Responses, then Summary.
    * At the top right, click More, then Select destination for responses.
    * Choose Create a new spreadsheet, then click Create.
    * Each new answer now arrives as a row in that sheet. You find it on the Google Sheets home screen and in Google Drive.
3. **In the Status column, add a drop down with these choices: New, Booked, Done. Put the same kind of drop down in Who is booked if you like.** Uses Your repair list columns, above.
    * Open your spreadsheet and select the cells where the drop down list goes.
    * At the top, click Insert, then Dropdown.
    * Under Criteria, choose Dropdown and type the first choice Tally wrote. Click Add another item for each of the rest.
    * Click Done.
    * *Good to know:* On an iPhone you can pick from the list, but you make it on a computer or an Android phone.
4. **Color the emergency rows so they stand out. Tally has written the formula for you.** Uses Your urgent row color, above.
    * Open your spreadsheet and select the columns to color, like A to F.
    * Click Format, then Conditional formatting.
    * Under Format cells if, choose Custom formula is.
    * Type the formula Tally wrote, like =$D1="Yes". Keep the dollar sign, so every row looks at the same column.
    * Choose a fill color, then click Done.
    * *Good to know:* On an iPhone you can see the highlight but not make it.
5. **Share the form link with tenants and colleagues, using the message Tally wrote.** Uses Your message with the link, above.
    * Open your form in Google Forms.
    * At the top right, click Publish.
    * To choose who can respond, click Manage. Under General access, choose anyone with the link or a group at your workplace.
    * Click Done, then Publish. The top right now says Published.
    * Click Published, then Copy responder link.
    * Paste the link into the message Tally wrote and send it.

**Each time from then on**

6. **Each time, open your list, read the new rows, book someone for each one, and set the Status to Booked. Send people back to the form if they text or email you a repair.**

**Try it on** Your next three repair requests.

**What good looks like** Every repair arrives as one row with all five details filled in, and you book someone without having to ask follow up questions.

**You always check** Check each emergency row yourself and confirm the details and the day before you book anyone to come.

**Did it work?** [Yes] [Not quite]

*If it stops working* Apps change their menus now and then. Write to support@tallyher.com and we will check the steps for you.

### Screen 4. Inspections, turned into rows for your sheet

A few quick questions about how you do this today. Tally writes your setup from your answers.

**Where do you take the notes?**

[ ] On paper · **[x] Notes on my phone** · [ ] Photos · [ ] An app already keeps them for me

**Where should they end up?**

**[x] In a sheet** · [ ] In a report · [ ] In an email to someone

**What goes in each note?** *Tick all that fit.*

**[x] The date** · **[x] The place or unit** · **[x] What you found** · **[x] What needs doing** · [ ] Who did it

**How often do you take them?**

[ ] Every day · [ ] Every week · **[x] Every month**

**Paste one set of notes** *As you wrote them. Take out names. Optional.*

> Bldg 2, Unit 3B, bathroom: slow drain and small drip under sink. Needs plumber, booked for Thursday. Hallway light out by the stairs, handyman to replace bulb and check fixture.

[Write my setup]

### Screen 5. Teach ChatGPT who you are

1. Open Settings from the sidebar.
2. Select Personalization.
3. Make sure Enable customization is turned on.
4. Type your instructions in the Custom Instructions field. They apply to every chat right away.

**Your note about you** [Copy]

> I am a property manager for 40 rental apartments in three buildings. I handle repairs, tenant requests, move ins and move outs, and inspections. I often paste in my own rough notes from my phone and want them turned into clean, short rows for a Google Sheet. I like plain, direct wording with no extra chat. Never add details I did not give, such as dates, names, prices or causes. If something is unclear, leave it blank or mark it with [check] and ask me. Never drop a line of my notes. Keep tenant names and private details out of your answers.

### Screen 6. Inspections, turned into rows for your sheet

From now on, your inspection notes go straight from your phone into rows for your sheet. You keep jotting notes the way you do today, then paste them in with your saved instructions and get clean rows back. You stop retyping each note by hand across your 40 apartments.

**What Tally wrote for you**

*Your inspection instructions*

1. I will paste in my inspection notes. Turn them into rows for my sheet, one row per issue found. Use exactly these columns, in this order: Date, Building, Unit, Place, What was found, What needs doing. Date: write the date of the inspection as [date], or leave it blank if I did not give one. Building: for example Bldg 2. Unit: for example 3B. Place: the room or area, for example bathroom or hallway. What was found: the problem in a few plain words. What needs doing: the action and who does it, and the day if I gave one. If one note has two problems, make two rows. Never add details I did not give. Show the rows as a table I can copy into Google Sheets. [Copy]
2. If a line does not fit the columns, do not drop it. Put it in a last row with the full line copied word for word in What was found, and write [check] in What needs doing. Leave any column you cannot fill blank, and never guess. [Copy]

*Your inspection sheet columns*

1. Date [Copy]
2. Building [Copy]
3. Unit [Copy]
4. Place [Copy]
5. What was found [Copy]
6. What needs doing [Copy]

**Set it up once**

1. **Open a new Google Sheet and type the six column names in the first row, in this order.** Uses Your inspection sheet columns, above.
2. **Save your inspection instructions in ChatGPT so you can use them again each month.** Uses Your inspection instructions, above.

**Each time from then on**

3. **Paste your phone notes under your saved instructions and let ChatGPT turn them into rows.** Uses Your inspection instructions, above.
    * Paste your notes with the instructions Tally wrote for you and ask for the result as a table.
    * Click the download button in the top right corner of the table. It saves as a CSV file.
    * Open your spreadsheet in Google Sheets.
    * At the top, click File, then Import.
    * Choose the file, pick Insert new sheets or Append rows to current sheet, then click Import.
4. **Read each row against your notes, then copy the rows into the next empty rows of your sheet.**

**Try it on** This month's notes from one building.

**What good looks like** Every issue in your notes is one row in your sheet, with the right unit, place and action, and nothing added that you did not write.

**You always check** Check every row against your own notes, especially unit numbers, dates and who is booked to do the work, and look at any row marked [check].

**Did it work?** [Yes] [Not quite]

*If it stops working* Apps change their menus now and then. Write to support@tallyher.com and we will check the steps for you.

### Screen 7. That is your path

Both of your workflows are set up. You can come back to any step.

**What is safe at your job**

* Never type tenant names, phone numbers or email addresses into ChatGPT.
* Leave out door codes, keys, lockbox details and passwords.
* Do not paste lease terms, rent amounts or payment details.
* Use unit numbers and plain descriptions of the problem only.
* Read every row before it goes into your sheet.

## Seconds and AI cost

| Workflow | Seconds after her answers | Attempts | Tokens in | Tokens out | AI cost |
| --- | --- | --- | --- | --- | --- |
| Repairs | 8.3 | 1 | 4619 | 936 | $0.0186 |
| Inspections | 9.2 | 1 | 4364 | 1062 | $0.0193 |

Model claude-sonnet-5-5. Her path opened with no AI call when she paid. Playing her answers cost $0.0005 more and is not part of the product.

## Checks

* PASS valid_path: the saved path loads
* PASS did_it_work_steps: Did it work is saved per workflow as task_1 and task_2
* PASS task_1_ids: google_forms_create, google_forms_to_sheets, sheets_dropdown, sheets_highlight_row, google_forms_share, goal
* PASS task_1_not_checked: nothing says not checked
* PASS task_1_no_clicks_from_model: every short line is free of clicks
* PASS task_1_approval: Check each emergency row yourself and confirm the details and the day before you book anyone to come.
* PASS task_1_each_time: Each time, open your list, read the new rows, book someone for each one, and set the Status to Booked. Send people back to the form if they text or email you a repair.
* PASS task_1_no_ai_ask: no AI named
* PASS task_1_goals_plain: 1 goals
* PASS task_1_fast: 8.3 s
* PASS task_2_ids: goal, goal, notes_to_sheet, goal
* PASS task_2_not_checked: nothing says not checked
* PASS task_2_no_clicks_from_model: every short line is free of clicks
* PASS task_2_approval: Check every row against your own notes, especially unit numbers, dates and who is booked to do the work, and look at any row marked [check].
* PASS task_2_each_time: Paste your phone notes under your saved instructions and let ChatGPT turn them into rows. | Read each row against your notes, then copy the rows into the next empty rows of your sheet.
* PASS task_2_no_ai_ask: uses AI by design
* PASS task_2_goals_plain: 3 goals
* PASS task_2_fast: 9.2 s
