# ecom: free design, every task (experiment two)

Designed by the model for every task on her map, with what it knows about her apps. Click paths from cards and recipes are checked by us. Every other step in an app names the feature it relies on and is not checked by us; its link is the vendor's own help page, found with web search, or none found. A click path from the model shows only beside such a link, and needs checking against it.

14 steps: 8 checked, 6 not checked by us (6 with a vendor help page, 0 with none found), 0 outside any app. 0 tasks left as hers.

## Product descriptions

Level in the product: 3, Build once, reuse, recipe saved_assistant.

**Today.** You write these from spec sheets, your own notes, photos and old listing copy, usually one a day.

**The new way.** You set up one saved assistant that knows your brand voice and the layout of a good description. Each day you paste in the supplier spec sheet and your notes, and it returns a draft in your format. You check the facts and publish in Shopify, so the writing starts from a draft instead of a blank page.

**Setup**

1. Make a project for product descriptions so your instructions and examples are kept in one place. (ChatGPT). Checked: card chatgpt_project.
2. Paste in your brand voice, the section order you use, words to avoid, and two or three of your best old descriptions as examples. (ChatGPT). Relies on **ChatGPT Projects instructions**. **Not checked by us.**
   * Vendor help page: [Projects in ChatGPT](https://help.openai.com/en/articles/10169521-using-projects-in-chatgpt)
3. Use the project as your saved assistant: paste the spec sheet and notes, and ask for a description in your format. (ChatGPT). Checked: recipe saved_assistant.

**What Tally would write for her**

* Assistant instructions: Your brand voice, description layout and rules, such as never inventing a size or material.
* Example descriptions: A few of your best past descriptions for the assistant to copy in style.
* Intake prompt: A short message you paste with each spec sheet asking for the title, short summary, bullets and full description.

**Where she checks.** You compare every dimension, material and finish in the draft with the supplier spec sheet before you publish it in Shopify.

## Product listing updates

Level in the product: 3, Build once, reuse, recipe saved_assistant.

**Today.** You refresh listing copy by hand, one product at a time.

**The new way.** You reuse the same project as the descriptions, with a refresh request. You paste the current listing and any new details, and it rewrites the copy in your voice and flags what changed. You then paste the result into Shopify yourself, so refreshes are quicker and more consistent across products.

**Setup**

1. Open the product description project, or make a second one named for listing updates, so the same voice applies. (ChatGPT). Checked: card chatgpt_project.
2. Add a refresh instruction: given the old listing and new details, rewrite only what needs to change and list the changes. (ChatGPT). Checked: recipe saved_assistant.
3. Paste the approved copy into the product page and save it. (Shopify). Relies on **Shopify product editor**. **Not checked by us.**
   * Vendor help page: [Adding and updating products](https://help.shopify.com/en/manual/products/add-update-products)
   * Where it is, from the model, to check against that page: Products, then choose the product

**What Tally would write for her**

* Refresh instructions: Rules for updating copy, keeping what still holds and listing every change made.
* Refresh prompt: A short message you paste with the current listing and the new details.

**Where she checks.** You read the changes list and compare the new copy with the live listing before you save anything in Shopify.

## Promo emails

Level in the product: 3, Build once, reuse, recipe gmail_templates.

**Today.** You write promo emails from scratch for each campaign.

**The new way.** You save the structure of your usual promo emails as templates with gaps for the offer, dates and product. For each campaign you fill the gaps and ask AI to polish the copy for that offer. You build and send the final email in Klaviyo, so each campaign starts from a tested shape.

**Setup**

1. Save your two or three usual promo layouts as templates with clear gaps for offer, dates, code and product. (Gmail). Checked: recipe gmail_templates.
2. Make a project holding your brand voice and past promo emails, so drafts for each campaign match your style. (Claude). Checked: card claude_project.
3. Paste the approved copy into your Klaviyo campaign and set up the send as you do today. (Klaviyo). Relies on **Klaviyo email editor**. **Not checked by us.**
   * Vendor help page: [Templates and design glossary](https://help.klaviyo.com/hc/en-us/articles/14904583929755)

**What Tally would write for her**

* Promo email templates: Layouts for a sale, a new product and a restock, each with gaps to fill.
* Promo project instructions: Your voice, subject line style and rules for offers and dates.
* Campaign prompt: A short message to fill in with the offer, dates and audience.

**Where she checks.** You check the offer, code, dates and links in the email, and send a Klaviyo test to yourself, before you schedule it.

## Customer message replies

Level in the product: 4, Inside your apps, recipe gmail_help_me_write.

**Today.** You answer customer messages one by one as they come in.

**The new way.** For emails in Gmail, the built in Help me write drafts a reply you can adjust. You keep the personal and order specific parts yours. Most replies then start from a draft, while you stay in charge of what the customer is told.

**Setup**

1. Use Help me write inside Gmail to draft replies to customer emails, then edit each one. (Gmail). Checked: recipe gmail_help_me_write.
2. Ask for a shorter, warmer or more formal version when the first draft is off. (Gmail). Relies on **Gmail Help me write refinements**. **Not checked by us.**
   * Vendor help page: [Draft emails with Gemini in Gmail - Android phone & tablet - Gmail Help](https://support.google.com/mail/answer/13955415?hl=en&co=GENIE.Platform%3DAndroid)

**What Tally would write for her**

* Reply guidance: A short list of your policies on shipping, returns and care, to guide your edits to each draft.
* Draft requests: Short instructions to give Help me write, such as the answer to give and the tone.

**Where she checks.** You read each draft, check order details and policy statements, and press Send yourself.

## Weekly sales numbers

Level in the product: 2, Write it with AI.

**Today.** You pull weekly sales numbers into Sheets by hand.

**The new way.** You export or copy the week's figures from Shopify, then let AI turn the raw rows into a clean table in the layout of your sheet. You get the same tidy format every week and spend your effort on what the numbers mean.

**Setup**

1. Export the week's sales report from Shopify as a file or copy the table. (Shopify). Relies on **Shopify Analytics export**. **Not checked by us.**
   * Vendor help page: [Shopify Help Center](https://help.shopify.com/en/manual/reports-and-analytics/shopify-reports/report-types/custom-reports/export-reports)
   * Where it is, from the model, to check against that page: Analytics, then Reports
2. Paste the raw figures and ask for a clean table in the exact column order of your sales sheet. (Claude). Checked: recipe notes_to_sheet.
3. Paste the checked table into the next empty rows of your weekly sheet. (Google Sheets). Relies on **Google Sheets import**. **Not checked by us.**
   * Vendor help page: [Use both Excel and Sheets: Best practices - Google Docs Editors Help](https://support.google.com/docs/answer/9331167?hl=en-GB)

**What Tally would write for her**

* Table layout: Your sheet's column names and order, so the output fits without rework.
* Weekly prompt: A short message you paste with each export asking for the clean table and totals.

**Where she checks.** You compare the table totals with the Shopify report before you paste anything into your sheet.
