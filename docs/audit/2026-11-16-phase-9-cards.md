# Phase 9 cards, to walk through

Every card in `lib/beginner/cards.ts`, as plain steps, sorted app by app. The building block cards were checked on 16 November 2026 against the vendor's own help pages. Tick each device once you have done it yourself. Every title, step and note is a DRAFT until you approve it.

Printed from the code by `scripts/print-cards.ts`, so this file and the cards always match.

## Could not confirm

These are left out, left without phone steps, or confirmed only in part, because the vendor's pages don't say.

1. **Excel, highlight a whole row.** Left out. Microsoft's pages show a highlight rule written as a formula, but none shows one that colors a whole row. Google's page does, so Google Sheets has this card.
2. **Excel on a phone.** No phone steps on any Excel card. Microsoft says Excel on an iPhone can show highlights and pick from drop down lists, but can't make either. For Android, Microsoft's pages don't say.
3. **Microsoft Forms and Outlook on a phone.** No phone steps. Microsoft's pages for these features give computer steps only.
4. **Google Forms on a phone.** No phone steps. Google gives the first steps in a phone's browser, but not how to add questions there.
5. **Gmail templates on a phone.** No phone steps. Google says templates work only on a computer.
6. **Google Sheets outside the US.** Google's pages don't say whether a formula needs semicolons instead of commas with a European locale. They do say function names stay in English unless you turn off Always use English function names under File, then Settings. So the Google formula cards are confirmed for US English settings only, and have no region note.
7. **Excel function names in another language.** Microsoft's page on translated function names is gone, and no current page says which names Excel in another language expects. The Excel formula cards are confirmed with English function names only.
8. **What clearing answers does to the sheet.** Neither Microsoft nor Google says whether deleting all answers in a form also clears the workbook or sheet the answers go to. Both clearing cards say so.

## Worth a close look when you walk through

These are confirmed, but less directly than the rest.

1. **Excel formulas in a browser.** The pages for COUNTIF, FILTER, MIN, COUNT, IF and TODAY don't name Excel in a browser in their lists of versions. Microsoft's page on Excel in a browser says most functions work there as they do in the app, and that TODAY takes the date from Microsoft's server.
2. **Adding days in Google Sheets.** Google's pages never show a date plus a number of days. The card uses DATE(YEAR(B2),MONTH(B2),DAY(B2)+7) instead, which the DATE page documents, including carrying extra days into the next month.
3. **Opening Forms answers in Excel.** Microsoft describes answers that keep arriving for work and school accounts. With a personal account, choose Download a copy, which does not update.
4. **Outlook saved emails.** Microsoft says these need a qualifying Microsoft 365 subscription, so the card says the free plan is not enough.
5. **Counting Microsoft Forms answers.** Microsoft says a formula or table added to the workbook that Forms fills stops new answers arriving. So the count card says to count in a downloaded copy. This matters for the lunch workflow in Phase 10.
6. **Semicolons in Excel.** Microsoft says Excel uses the list separator of your region between the parts of a formula, a comma for US English. The Excel formula cards say to type a semicolon where Excel won't take a comma. The drop down list card now takes its choices from cells, so it needs no separator.

## A sheet to try the tracker on

The tracker cards use these columns. Put a start day in B2, then follow the cards for days after, next due and the highlight.

| A | B | C | D | E | F | G | H |
|---|---|---|---|---|---|---|---|
| Name | Start day | Welcome email | Check in | Paperwork | Review | Next due | Due |
| Sam | 11/10/2026 | =B2+0 | =B2+7 | =B2+14 | =B2+30 | next due formula | due formula |

In Google Sheets, write the step dates as =DATE(YEAR(B2),MONTH(B2),DAY(B2)+7) and so on. Type done over a date to mark that step done.

## Microsoft Forms

### Make a form in Microsoft Forms

Id `ms_forms_create`. Checked 2026-11-16.

* [ ] Walked through on a computer

**On a computer**

1. Go to forms.office.com and sign in with your work, school or Microsoft account.
2. Select New Form.
3. Type the title Tally wrote, and a description if you want one. The form saves itself as you go.
4. Select Add new, then choose the kind of question, such as Choice, Text or Date.
5. Type the question and its choices as Tally wrote them. Add each next question the same way.
6. Select Preview to see the form as people will, then select Back to keep editing.

Free plan. Enough.

Checked against

* <https://support.microsoft.com/en-us/forms/create-a-form-with-microsoft-forms>

### Send your Microsoft form as a link

Id `ms_forms_share`. Checked 2026-11-16.

* [ ] Walked through on a computer

**On a computer**

1. Go to forms.office.com and open your form.
2. Select Collect responses.
3. Choose who can respond. Only people in my organization can respond keeps it inside your workplace. Anyone can respond lets people answer without signing in.
4. Select Copy link.
5. Paste the link into the message Tally wrote and send it.

Free plan. Enough. Keeping a form inside your workplace needs a Microsoft 365 work or school account. A personal account can share it with anyone.

Checked against

* <https://support.microsoft.com/en-us/forms/send-a-form-and-collect-responses>

### Open your Microsoft form answers in Excel

Id `ms_forms_to_excel`. Checked 2026-11-16.

* [ ] Walked through on a computer

**On a computer**

1. Go to forms.office.com and open your form.
2. Select View responses.
3. Select Open results in Excel. The answers open in Excel in your browser, one row for each answer and one column for each question.
4. New answers show up in the same workbook, so keep using that one rather than making a new one.

Note. Don't add your own formulas or tables to this workbook, or new answers stop arriving. Count in a copy instead, made with Download a copy.

Free plan. Not enough. Answers that keep arriving in Excel need a work or school account. Otherwise choose Download a copy, which does not update.

Checked against

* <https://support.microsoft.com/en-us/forms/check-and-share-your-form-results>
* <https://support.microsoft.com/en-us/forms/how-to-ensure-your-form-and-workbook-are-in-sync>

### Clear last week's answers in Microsoft Forms

Id `ms_forms_clear`. Checked 2026-11-16.

* [ ] Walked through on a computer

**On a computer**

1. If you want to keep last week's answers, open them in Excel first and choose Download a copy.
2. Go to forms.office.com and open your form.
3. Select View responses.
4. Select More options for responses, then Delete all responses.
5. The answers are gone from the form, ready for this week.

Note. Microsoft's pages don't say whether this also clears the workbook made with Open results in Excel.

Free plan. Enough.

Checked against

* <https://support.microsoft.com/en-us/forms/check-and-share-your-form-results>
* <https://support.microsoft.com/en-us/forms/form-question-response-and-character-limits-in-microsoft-forms>

## Excel

### Add a drop down list in Excel

Id `excel_dropdown`. Checked 2026-11-16.

* [ ] Walked through on a computer

**On a computer**

1. Open your workbook in Excel and select the cells where the drop down list goes.
2. Go to the Data tab, then select Data Validation. In Excel in a browser it sits under Data Tools.
3. On the Settings tab, in the Allow box, select List.
4. Type the choices Tally wrote in a spare column, one in each cell. Then select in the Source box and drag over those cells, without a heading.
5. Check In-cell dropdown, then select OK.

Note. Excel on an iPhone can pick from a drop down list but can't make one.

Free plan. Enough. Excel in a browser is free with a Microsoft account.

Checked against

* <https://support.microsoft.com/en-us/excel/get-started/create-a-drop-down-list>
* <https://support.microsoft.com/en-us/excel/excel-for-iphone-features>

### Count each answer in Excel

Id `excel_count_each`. Checked 2026-11-16.

* [ ] Walked through on a computer

**On a computer**

1. Open the workbook with your answers and select an empty cell beside them, where the count goes.
2. Paste the formula Tally wrote, like =COUNTIF(C2:C100,"Vegetarian"). The first part says where to look, the second what to count.
3. Press Enter. Add a count for each choice the same way.

Note. If the answers come from Microsoft Forms, count in a downloaded copy. A formula added to the form's own workbook stops new answers arriving.

Outside the US. If Excel won't take the formula, type a semicolon wherever it has a comma. Excel uses the separator of your region, and many European regions use a semicolon.

Free plan. Enough. Excel in a browser is free with a Microsoft account.

Checked against

* <https://support.microsoft.com/en-us/excel/get-started/use-the-countif-function-in-microsoft-excel>
* <https://support.microsoft.com/en-us/excel/differences-between-using-a-workbook-in-the-browser-and-in-excel>
* <https://support.microsoft.com/en-us/forms/how-to-ensure-your-form-and-workbook-are-in-sync>
* <https://learn.microsoft.com/en-us/troubleshoot/microsoft-365-apps/excel/formula-errors>
* <https://support.microsoft.com/en-us/excel/change-regional-format-settings-in-excel-for-the-web>

### List what is below its usual amount in Excel

Id `excel_below_usual`. Checked 2026-11-16.

* [ ] Walked through on a computer

**On a computer**

1. Keep each item in its own row, with what you have now in one column and the usual amount in the next.
2. Select an empty cell beside the table, where the list starts.
3. Paste the formula Tally wrote, like =FILTER(A2:A30,B2:B30<C2:C30,"Nothing low"), and press Enter.
4. The list fills the cells below by itself and changes when you update what you have. When nothing is low it says Nothing low.

Outside the US. If Excel won't take the formula, type a semicolon wherever it has a comma. Excel uses the separator of your region, and many European regions use a semicolon.

Free plan. Enough. Excel in a browser is free with a Microsoft account.

Checked against

* <https://support.microsoft.com/en-us/excel/functions/filter-function>
* <https://support.microsoft.com/en-us/excel/differences-between-using-a-workbook-in-the-browser-and-in-excel>
* <https://learn.microsoft.com/en-us/troubleshoot/microsoft-365-apps/excel/formula-errors>
* <https://support.microsoft.com/en-us/excel/change-regional-format-settings-in-excel-for-the-web>

### Date each step from the start day in Excel

Id `excel_days_after`. Checked 2026-11-16.

* [ ] Walked through on a computer

**On a computer**

1. Put the start day in its own column, like B.
2. In the cell for a step, paste the formula Tally wrote, like =B2+7 for a week after the start day, and press Enter.
3. If you see a number instead of a date, select the cell, then the arrow next to Number Format, then Short Date.
4. Copy the formulas down to each new row.

Free plan. Enough. Excel in a browser is free with a Microsoft account.

Checked against

* <https://support.microsoft.com/en-us/excel/add-or-subtract-dates>

### Show the next date due in each row in Excel

Id `excel_next_due`. Checked 2026-11-16.

* [ ] Walked through on a computer

**On a computer**

1. When a step is done, type done over its date. The formula skips words, so done steps drop out.
2. In the Next due column, paste the formula Tally wrote, like =IF(COUNT(C2:F2)=0,"All done",MIN(C2:F2)). It shows the earliest date left in the row.
3. In the column after it, paste =IF(AND(G2<>"",G2<=TODAY()),"Due",""). The row says Due once that day has come, with no highlight needed.
4. Copy both formulas down to each new row.

Note. Excel in a browser takes today's date from Microsoft's server, not from your computer.

Outside the US. If Excel won't take the formula, type a semicolon wherever it has a comma. Excel uses the separator of your region, and many European regions use a semicolon.

Free plan. Enough. Excel in a browser is free with a Microsoft account.

Checked against

* <https://support.microsoft.com/en-us/excel/functions/min-function>
* <https://support.microsoft.com/en-us/excel/functions/count-function>
* <https://support.microsoft.com/en-us/excel/functions/if-function>
* <https://support.microsoft.com/en-us/excel/using-if-with-and-or-and-not-functions-in-excel>
* <https://support.microsoft.com/en-us/excel/functions/today-function>
* <https://support.microsoft.com/en-us/excel/differences-between-using-a-workbook-in-the-browser-and-in-excel>
* <https://learn.microsoft.com/en-us/troubleshoot/microsoft-365-apps/excel/formula-errors>
* <https://support.microsoft.com/en-us/excel/change-regional-format-settings-in-excel-for-the-web>

### Highlight a date in Excel once it has come

Id `excel_due_highlight`. Checked 2026-11-16.

* [ ] Walked through on a computer

**On a computer**

1. Open your workbook in Excel in your browser and select the dates to watch, like the Next due column from G2 down.
2. Select Home, then Conditional Formatting, then New Rule.
3. Check that Apply to range shows the cells you selected.
4. In Rule Type, select Formula, then paste the formula Tally wrote, like =AND(G2<>"",G2<=TODAY()). It names the first cell you selected.
5. Choose how the cell should look, like a fill color, then select Done.

Note. Excel on an iPhone shows the highlight but can't make it. The Due column from the next due card works everywhere.

Outside the US. If Excel won't take the formula, type a semicolon wherever it has a comma. Excel uses the separator of your region, and many European regions use a semicolon.

Free plan. Enough. Excel in a browser is free with a Microsoft account.

Checked against

* <https://support.microsoft.com/en-us/excel/use-conditional-formatting-to-highlight-information-in-excel>
* <https://support.microsoft.com/en-us/excel/using-if-with-and-or-and-not-functions-in-excel>
* <https://support.microsoft.com/en-us/excel/functions/today-function>
* <https://support.microsoft.com/en-us/excel/excel-for-iphone-features>
* <https://learn.microsoft.com/en-us/troubleshoot/microsoft-365-apps/excel/formula-errors>
* <https://support.microsoft.com/en-us/excel/change-regional-format-settings-in-excel-for-the-web>

## Outlook

### Save an email to reuse in Outlook

Id `outlook_saved_email`. Checked 2026-11-16.

* [ ] Walked through on a computer

**On a computer**

1. In Outlook in your browser or the new Outlook, select New, then Mail.
2. Paste the email Tally wrote, with its subject.
3. On the Message ribbon, select Mail template, then Save email as template.
4. Type a name you will recognize, then select Save.
5. To use it, select New, then Mail from template, and choose it. It opens as a draft.
6. Fill in what changes, read it through, then select Send.

Note. Classic Outlook saves a template another way, with File, then Save As, then Outlook Template.

Free plan. Not enough. Saved email templates need a qualifying Microsoft 365 subscription.

Checked against

* <https://support.microsoft.com/en-us/outlook/create-email-templates-in-outlook>
* <https://support.microsoft.com/en-us/outlook/send-an-email-message-based-on-a-template>

### Set a reminder that repeats in Outlook

Id `outlook_repeat_reminder`. Checked 2026-11-16.

* [ ] Walked through on a computer

**On a computer**

1. Open the calendar in Outlook in your browser, or in Outlook.com.
2. Select New event at the top of the page.
3. Add the title Tally wrote for the job.
4. Select More details, then Repeat. Choose how often from the list, then when the series begins and ends.
5. Select Remind me and choose when you want to be reminded. It starts at 15 minutes before.
6. Select Save.

Free plan. Enough. Outlook.com is free and has the same Repeat and Remind me choices.

Checked against

* <https://support.microsoft.com/en-us/outlook/create-modify-or-delete-a-meeting-request-or-appointment-in-outlook-on-the-web>
* <https://support.microsoft.com/en-us/outlook/create-modify-or-delete-a-meeting-request-or-appointment-in-outlook-com>

## Google Forms

### Make a form in Google Forms

Id `google_forms_create`. Checked 2026-11-16.

* [ ] Walked through on a computer

**On a computer**

1. Go to forms.google.com.
2. Click Blank form, then name the form with the title Tally wrote.
3. Click Add, then to the right of the question title, choose the type of question.
4. Type the question and its choices as Tally wrote them. To make sure nobody skips it, turn on Required.
5. Add each next question the same way.

Free plan. Enough.

Checked against

* <https://support.google.com/docs/answer/6281888?hl=en>
* <https://support.google.com/docs/answer/2839737?hl=en>

### Send your Google form as a link

Id `google_forms_share`. Checked 2026-11-16.

* [ ] Walked through on a computer

**On a computer**

1. Open your form in Google Forms.
2. At the top right, click Publish.
3. To choose who can respond, click Manage. Under General access, choose anyone with the link or a group at your workplace.
4. Click Done, then Publish. The top right now says Published.
5. Click Published, then Copy responder link.
6. Paste the link into the message Tally wrote and send it.

Free plan. Enough.

Checked against

* <https://support.google.com/docs/answer/2839588?hl=en>

### Send your Google form answers to a sheet

Id `google_forms_to_sheets`. Checked 2026-11-16.

* [ ] Walked through on a computer

**On a computer**

1. Open your form in Google Forms.
2. At the top, click Responses, then Summary.
3. At the top right, click More, then Select destination for responses.
4. Choose Create a new spreadsheet, then click Create.
5. Each new answer now arrives as a row in that sheet. You find it on the Google Sheets home screen and in Google Drive.

Free plan. Enough.

Checked against

* <https://support.google.com/docs/answer/2917686?hl=en>

### Clear last week's answers in Google Forms

Id `google_forms_clear`. Checked 2026-11-16.

* [ ] Walked through on a computer

**On a computer**

1. Open your form in Google Forms.
2. At the top, click Responses, then Summary.
3. At the top right, click More, then Delete all responses.
4. Click OK. This can't be undone.

Note. Your answers sheet is a separate file, and Google's pages don't say whether its rows are cleared too.

Free plan. Enough.

Checked against

* <https://support.google.com/docs/answer/2917686?hl=en>

## Google Sheets

### Add a drop down list in Google Sheets

Id `sheets_dropdown`. Checked 2026-11-16.

* [ ] Walked through on a computer
* [ ] Walked through on an Android phone

**On a computer**

1. Open your spreadsheet and select the cells where the drop down list goes.
2. At the top, click Insert, then Dropdown.
3. Under Criteria, choose Dropdown and type the first choice Tally wrote. Click Add another item for each of the rest.
4. Click Done.

**On an Android phone**

1. Open your spreadsheet in the Google Sheets app and tap the cells where the drop down list goes.
2. In the top right, tap More, then Data Validation.
3. Under Criteria, choose List of items. Tap Add, type a choice Tally wrote, then tap Done. Do this for each choice.
4. In the top right, tap Save.

Note. On an iPhone you can pick from the list, but you make it on a computer or an Android phone.

Free plan. Enough.

Checked against

* <https://support.google.com/docs/answer/186103?hl=en>

### Count each answer in Google Sheets

Id `sheets_count_each`. Checked 2026-11-16.

* [ ] Walked through on a computer
* [ ] Walked through on an Android phone
* [ ] Walked through on an iPhone

**On a computer**

1. Open your spreadsheet and click an empty cell beside the answers, where the count goes.
2. Type the formula Tally wrote, like =COUNTIF(C2:C100,"Vegetarian"). The first part says where to look, the second what to count.
3. Press Enter. Add a count for each choice the same way.

**On an Android phone**

1. Open your spreadsheet in the Google Sheets app and tap an empty cell where the count goes.
2. Type the formula Tally wrote, like =COUNTIF(C2:C100,"Vegetarian").
3. Tap Done. Add a count for each choice the same way.

**On an iPhone**

1. Open your spreadsheet in the Google Sheets app and tap an empty cell where the count goes.
2. Type the formula Tally wrote, like =COUNTIF(C2:C100,"Vegetarian").
3. Tap Done. Add a count for each choice the same way.

Free plan. Enough.

Checked against

* <https://support.google.com/docs/answer/3093480?hl=en>
* <https://support.google.com/docs/answer/46977?hl=en>

### Highlight a whole row in Google Sheets

Id `sheets_highlight_row`. Checked 2026-11-16.

* [ ] Walked through on a computer
* [ ] Walked through on an Android phone

**On a computer**

1. Open your spreadsheet and select the columns to color, like A to F.
2. Click Format, then Conditional formatting.
3. Under Format cells if, choose Custom formula is.
4. Type the formula Tally wrote, like =$D1="Yes". Keep the dollar sign, so every row looks at the same column.
5. Choose a fill color, then click Done.

**On an Android phone**

1. Open your spreadsheet in the Google Sheets app and select the columns to color.
2. Tap Format, then Conditional formatting.
3. Under Format cells if, tap Custom formula.
4. Tap Value or formula and type the formula Tally wrote, like =$D1="Yes".
5. Choose a color, then tap Done.

Note. On an iPhone you can see the highlight but not make it.

Free plan. Enough.

Checked against

* <https://support.google.com/docs/answer/78413?hl=en>

### List what is below its usual amount in Google Sheets

Id `sheets_below_usual`. Checked 2026-11-16.

* [ ] Walked through on a computer
* [ ] Walked through on an Android phone
* [ ] Walked through on an iPhone

**On a computer**

1. Keep each item in its own row, with what you have now in one column and the usual amount in the next.
2. Click an empty cell beside the table, where the list starts.
3. Type the formula Tally wrote, like =IFERROR(FILTER(A2:A30,B2:B30<C2:C30),"Nothing low"), and press Enter.
4. The list fills the cells below and changes when you update what you have. When nothing is low it says Nothing low.

**On an Android phone**

1. Open your spreadsheet in the Google Sheets app and tap an empty cell beside the table.
2. Type the formula Tally wrote, like =IFERROR(FILTER(A2:A30,B2:B30<C2:C30),"Nothing low").
3. Tap Done. The list fills the cells below.

**On an iPhone**

1. Open your spreadsheet in the Google Sheets app and tap an empty cell beside the table.
2. Type the formula Tally wrote, like =IFERROR(FILTER(A2:A30,B2:B30<C2:C30),"Nothing low").
3. Tap Done. The list fills the cells below.

Free plan. Enough.

Checked against

* <https://support.google.com/docs/answer/3093197?hl=en>
* <https://support.google.com/docs/answer/3093304?hl=en>
* <https://support.google.com/docs/answer/46977?hl=en>

### Date each step from the start day in Google Sheets

Id `sheets_days_after`. Checked 2026-11-16.

* [ ] Walked through on a computer
* [ ] Walked through on an Android phone
* [ ] Walked through on an iPhone

**On a computer**

1. Put the start day in its own column, like B.
2. In the cell for a step, type the formula Tally wrote, like =DATE(YEAR(B2),MONTH(B2),DAY(B2)+7) for a week after the start day. Days past the end of a month carry into the next one.
3. Press Enter, then add the formulas to each new row the same way.

**On an Android phone**

1. Open your spreadsheet in the Google Sheets app and tap the cell for a step.
2. Type the formula Tally wrote, like =DATE(YEAR(B2),MONTH(B2),DAY(B2)+7).
3. Tap Done. Add the formulas to each new row the same way.

**On an iPhone**

1. Open your spreadsheet in the Google Sheets app and tap the cell for a step.
2. Type the formula Tally wrote, like =DATE(YEAR(B2),MONTH(B2),DAY(B2)+7).
3. Tap Done. Add the formulas to each new row the same way.

Free plan. Enough.

Checked against

* <https://support.google.com/docs/answer/3092969?hl=en>
* <https://support.google.com/docs/answer/3093061?hl=en>
* <https://support.google.com/docs/answer/3093052?hl=en>
* <https://support.google.com/docs/answer/3093040?hl=en>
* <https://support.google.com/docs/answer/46977?hl=en>

### Show the next date due in each row in Google Sheets

Id `sheets_next_due`. Checked 2026-11-16.

* [ ] Walked through on a computer
* [ ] Walked through on an Android phone
* [ ] Walked through on an iPhone

**On a computer**

1. When a step is done, type done over its date. The formula skips words, so done steps drop out.
2. In the Next due column, type the formula Tally wrote, like =IF(COUNT(C2:F2)=0,"All done",MIN(C2:F2)). It shows the earliest date left in the row.
3. In the column after it, type =IF(AND(G2<>"",G2<=TODAY()),"Due",""). The row says Due once that day has come, with no highlight needed.
4. Add both formulas to each new row the same way.

**On an Android phone**

1. When a step is done, type done over its date. The formula skips words, so done steps drop out.
2. Open your spreadsheet in the Google Sheets app and tap the first cell of the Next due column.
3. Type the formula Tally wrote, like =IF(COUNT(C2:F2)=0,"All done",MIN(C2:F2)).
4. Tap Done. It shows the earliest date left in the row.
5. In the column after it, type =IF(AND(G2<>"",G2<=TODAY()),"Due","") the same way. The row says Due once that day has come.

**On an iPhone**

1. When a step is done, type done over its date. The formula skips words, so done steps drop out.
2. Open your spreadsheet in the Google Sheets app and tap the first cell of the Next due column.
3. Type the formula Tally wrote, like =IF(COUNT(C2:F2)=0,"All done",MIN(C2:F2)).
4. Tap Done. It shows the earliest date left in the row.
5. In the column after it, type =IF(AND(G2<>"",G2<=TODAY()),"Due","") the same way. The row says Due once that day has come.

Free plan. Enough.

Checked against

* <https://support.google.com/docs/answer/3094017?hl=en>
* <https://support.google.com/docs/answer/3093620?hl=en>
* <https://support.google.com/docs/answer/3093364?hl=en>
* <https://support.google.com/docs/answer/3093301?hl=en>
* <https://support.google.com/docs/answer/3092984?hl=en>
* <https://support.google.com/docs/answer/46977?hl=en>

### Highlight a date in Google Sheets once it has come

Id `sheets_due_highlight`. Checked 2026-11-16.

* [ ] Walked through on a computer
* [ ] Walked through on an Android phone

**On a computer**

1. Open your spreadsheet and select the dates to watch, like the Next due column from G2 down.
2. Click Format, then Conditional formatting.
3. Under Format cells if, choose Custom formula is.
4. Type the formula Tally wrote, like =AND(G2<>"",G2<=TODAY()). It is written for the first cell you selected.
5. Choose a fill color, then click Done.

**On an Android phone**

1. Open your spreadsheet in the Google Sheets app and select the dates to watch.
2. Tap Format, then Conditional formatting.
3. Under Format cells if, tap Custom formula.
4. Tap Value or formula and type the formula Tally wrote, like =AND(G2<>"",G2<=TODAY()).
5. Choose a color, then tap Done.

Note. On an iPhone you can see the highlight but not make it. The Due column from the next due card works there.

Free plan. Enough.

Checked against

* <https://support.google.com/docs/answer/78413?hl=en>
* <https://support.google.com/docs/answer/3093301?hl=en>
* <https://support.google.com/docs/answer/3092984?hl=en>

## Gmail

### Save an email to reuse in Gmail

Id `gmail_saved_email`. Checked 2026-11-16.

* [ ] Walked through on a computer

**On a computer**

1. In Gmail, click Settings at the top right, then See all settings.
2. At the top, click Advanced. Next to Templates, click Enable, then click Save Changes at the bottom.
3. Click Compose and paste the email Tally wrote.
4. At the bottom of the window, click More options, then Templates, then Save draft as template, then Save as new template.
5. To use it, click Compose, then More options, then Templates, and choose it under Insert template.
6. Fill in what changes, read it through, then click Send.

Note. Gmail templates work only on a computer, not in the Gmail phone app.

Free plan. Enough.

Checked against

* <https://support.google.com/mail/answer/14864208?hl=en>

## Google Calendar

### Set a reminder that repeats in Google Calendar

Id `calendar_repeat_reminder`. Checked 2026-11-16.

* [ ] Walked through on a computer
* [ ] Walked through on an Android phone
* [ ] Walked through on an iPhone

**On a computer**

1. Open Google Calendar. In the top left, click Create.
2. Add the title Tally wrote for the job.
3. Next to Does not repeat, click the arrow. Choose how often it comes back and when it ends.
4. At the top right, click Save.
5. To choose when it reminds you, click the event, then Edit event. Next to Notifications, set the time, then click Save at the top.

**On an Android phone**

1. Open the Google Calendar app. In the bottom right corner, tap Create, then Event.
2. Add the title Tally wrote and tap Done, then choose the date and time.
3. Under the time, tap Does not repeat and choose how often it comes back.
4. In the top right, tap Save.
5. To choose when it reminds you, tap the event, then Edit, then Add notification. Set when, tap Done, then tap Save.

**On an iPhone**

1. Open the Google Calendar app. In the bottom right corner, tap Create, then Event.
2. Add the title Tally wrote and tap Done, then choose the date and time.
3. Under the time, tap More options, then Does not repeat, and choose how often it comes back.
4. In the top right, tap Save.
5. To choose when it reminds you, tap the event, then Edit, then Add another notification. Then tap Save at the top right.

Free plan. Enough.

Checked against

* <https://support.google.com/calendar/answer/37115?hl=en>
* <https://support.google.com/calendar/answer/37242?hl=en>

## ChatGPT and Claude

These six cards came in Phase 3 and were checked on 14 November 2026. They are here so the file holds every card.

### Get ChatGPT ready on your phone and computer

Id `chatgpt_get_started`, ChatGPT. Checked 2026-11-14.

**On a phone**

1. Open the App Store on an iPhone or Google Play on Android and search for OpenAI ChatGPT.
2. Check that the app comes from OpenAI before you download it.
3. Open the app and sign up with an email address you own, so your chats are saved.
4. Type what you need in the message box and send it.

**On a computer**

1. Go to chatgpt.com in your browser.
2. Sign up with an email address you own, so your chats are saved.
3. Type what you need in the message box and send it. Select New chat when you want to start fresh.

Free plan. Enough. The free plan has lower message limits than the paid plans.

Checked against

* <https://help.openai.com/en/articles/12677804-what-is-chatgpt-faq>
* <https://help.openai.com/en/articles/9125172-the-chatgpt-home-page>
* <https://help.openai.com/en/articles/8142208-chatgpt-ios-and-android-app-faq>

### Save instructions about yourself in ChatGPT

Id `chatgpt_about_you`, ChatGPT. Checked 2026-11-14.

**On a phone**

1. Open the sidebar and select your profile icon to open Settings.
2. Select Customize ChatGPT.
3. Make sure Enable customization is turned on.
4. Type your instructions in the Custom Instructions field. They apply to every chat right away.

**On a computer**

1. Open Settings from the sidebar.
2. Select Personalization.
3. Make sure Enable customization is turned on.
4. Type your instructions in the Custom Instructions field. They apply to every chat right away.

Free plan. Enough. The free plan saves up to 1,500 characters of instructions.

Checked against

* <https://help.openai.com/en/articles/8096356-chatgpt-custom-instructions>
* <https://help.openai.com/en/articles/8142208-chatgpt-ios-and-android-app-faq>
* <https://help.openai.com/en/articles/9125172-the-chatgpt-home-page>

### Make a ChatGPT project for a task you repeat

Id `chatgpt_project`, ChatGPT. Checked 2026-11-14.

**On a computer**

1. Select New project in the sidebar.
2. Give the project a name, then pick an icon and a color.
3. Open the menu with three dots and select Project settings.
4. Type your instructions for this task, then select Save.
5. Add your examples to the project by uploading a file or pasting text.
6. Start a new chat inside the project. It uses your instructions and examples, and no other chat does.

Free plan. Enough. The free plan lets you add fewer files to a project than the paid plans.

Checked against

* <https://help.openai.com/en/articles/10169521-projects-in-chatgpt>

### Get Claude ready on your phone and computer

Id `claude_get_started`, Claude. Checked 2026-11-14.

**On a phone**

1. Download the Claude app from the App Store on an iPhone or Google Play on Android.
2. Open the app and create a free account. You need to be 18 or older.
3. Type what you need in the message box and send it.

**On a computer**

1. Go to claude.ai in your browser. You can also download Claude Desktop for Mac or Windows.
2. Create a free account. You need to be 18 or older.
3. Type what you need in the message box and click the submit button.

Free plan. Enough. The free plan has a usage limit that resets every five hours.

Checked against

* <https://support.claude.com/en/articles/8114491-get-started-with-claude>

### Save instructions about yourself in Claude

Id `claude_about_you`, Claude. Checked 2026-11-14.

**On a computer**

1. Click your initials in the lower left corner.
2. Select Settings, then Your Claude. If you see the older Settings page, select Account.
3. Under Instructions, describe how you work and how you like your answers. On the older page this is called Instructions for Claude.
4. Claude uses these instructions in all your chats.

Free plan. Enough.

Checked against

* <https://support.claude.com/en/articles/10185728-understanding-claude-s-personalization-features>

### Make a Claude project for a task you repeat

Id `claude_project`, Claude. Checked 2026-11-14.

**On a computer**

1. Open the left side panel and click Projects, or go to claude.ai/projects.
2. Click New Project in the upper right corner.
3. Give the project a name and a description. Claude does not read these.
4. Click Set project instructions, write how Claude should handle this task, then click Save instructions.
5. In the project knowledge on the right, click the plus button and add your examples as documents or text.
6. Start a chat inside the project. Claude uses your instructions and examples in every chat there.

Free plan. Enough. The free plan lets you make up to five projects.

Checked against

* <https://support.claude.com/en/articles/9519177-how-can-i-create-and-manage-projects>
