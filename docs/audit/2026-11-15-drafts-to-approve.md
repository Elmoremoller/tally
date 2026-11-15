# Every DRAFT line, for one approval

Made on 15 November 2026 for Phase 7. Every line here is marked DRAFT in the code and waits for Karl. Each has a number, so you can answer "approve all except 12 and 40" and say what to change.

Lines that call a function show it with stand in words like [a] or [name]. The first version at /start keeps its own DRAFT lines and is not listed, apart from the quiz errors the beginner quiz shares with it.

## 1. The quiz at /begin

Shown on every quiz.

1. `beginnerQuestions.tools.title` Which AI have you used?
2. `beginnerQuestions.level.title` Where are you with AI?
3. `beginnerQuestions.repeats.title` What do you do over and over, every day or every week?
4. `beginnerQuestions.repeats.hint` Pick all that fit.
5. `beginnerQuestions.most.title` Which would save you the most time if it got easier?
6. `beginnerQuestions.most.hint` Pick one or two.
7. `beginnerQuestions.most.fallbackTitle` Which of these would help you most?
8. `beginnerQuestions.most.fallbackHint` Things AI could help with in your job.
9. `beginnerQuestions.somethingElse.label` Something else
10. `beginnerQuestions.somethingElse.placeholder` Type it here
11. `beginnerQuestions.waitLine` One moment
12. `thinAnswers` We need a little more to go on. Add another thing you do over and over, then try again.
13. `beginnerFollowUp` What else do you do over and over in your job?

**When the AI cannot read her job in time (the fixed lists)**

14. `FALLBACK_JOB_READ.repeats[0]` Answering messages
15. `FALLBACK_JOB_READ.repeats[1]` Writing emails
16. `FALLBACK_JOB_READ.repeats[2]` Helping people in person
17. `FALLBACK_JOB_READ.repeats[3]` Planning my week
18. `FALLBACK_JOB_READ.repeats[4]` Keeping records
19. `FALLBACK_JOB_READ.apps[0]` Texts
20. `FALLBACK_JOB_READ.apps[1]` WhatsApp
21. `FALLBACK_JOB_READ.apps[2]` Instagram
22. `FALLBACK_JOB_READ.apps[3]` Facebook
23. `FALLBACK_JOB_READ.apps[4]` Canva
24. `FALLBACK_JOB_READ.apps[5]` Google Calendar

**Shared with the first quiz (lib/questions.ts)**

25. `followUpCopy.hint` A line or two is enough.
26. `quizErrors.thin` We couldn’t find enough in your answers yet. Add a little more about your week, then try again.
27. `quizErrors.limit` We’ve read your answers as many times as we can for now. Please try again tomorrow.
28. `quizErrors.generic` Something went wrong reading your answers. Please try again.
29. `quizErrors.missing` Some answers are missing. Please go back and check them.

## 2. The free result

Shown after the quiz.

30. `firstWinCopy.restricted` Your company restricts AI, so your plan starts with practice on your own phone or computer, and gives you the message to ask what’s allowed.

**When every task waits for her company's OK**

31. `askFirstCopy.title` Ask first, then come back
32. `askFirstCopy.lead` Your company restricts AI, and every task on your map needs it. So there is nothing to buy yet. Here is the message to ask what’s allowed, free.
33. `askFirstCopy.label` The message to ask what’s allowed
34. `askFirstCopy.sendTo` Send this to your manager or IT.
35. `askFirstCopy.back` When you know what’s allowed, come back and take the quiz again. Your path starts from there.
36. `askFirstCopy.message(…)` Hi, I’d like to start using AI for parts of my work, like rescheduling texts and client notes. Which AI tools are we allowed to use, and what can I use them for? I would never put private details about people or the company into them. Thanks.

## 3. Stripe's page and her receipt

Text only. Approving it changes no Stripe setting.

37. `beginnerCheckout.name` Your plan
38. `beginnerCheckout.description` A personal plan to start using AI in your own job.

## 4. The paid path, one step at a time (Phase 6)

39. `pathCopy.eyebrow` Your path
40. `pathCopy.progress(…)` Step 2 of 6
41. `pathCopy.skipped.ready` You already use AI, so your path skips getting a tool ready.
42. `pathCopy.skipped.about` You have already saved instructions about yourself, so your path skips that step.
43. `pathCopy.firstMessage` Then send this first message
44. `pathCopy.firstMessageLead` Fill in the part in brackets. What comes back is your first real result.
45. `pathCopy.aboutLabel` Your note about you
46. `pathCopy.aboutLead` Save this note as your instructions, so every answer fits you.
47. `pathCopy.noCard(…)` Tally has no checked steps for Gemini yet. Paste this note at the start of a new chat each time.
48. `pathCopy.readyNoCard(…)` Tally has no checked steps for Gemini yet. Open it, sign in, and send the message below.
49. `pathCopy.computerOnly(…)` Claude’s help pages give these steps on a computer only. Until you are at one, paste this note at the start of a chat.
50. `pathCopy.readLabel` How it works from now on
51. `pathCopy.setupLabel` Set it up
52. `pathCopy.devices.phone` On your phone
53. `pathCopy.devices.computer` On your computer
54. `pathCopy.materialLabel` What Tally wrote for you
55. `pathCopy.extraSetup(…)` Add these to the setup from Your reminder texts, the same way you did there.
56. `pathCopy.testLabel` Try it on three real ones
57. `pathCopy.goodLabel` What good looks like
58. `pathCopy.fixesLabel` When it is off, send one of these
59. `pathCopy.approvalLabel` You always check
60. `pathCopy.costLabel` What it costs
61. `pathCopy.costFirst` Before you start
62. `pathCopy.stopsLabel` If it stops working
63. `pathCopy.stops(…)` Apps change their menus now and then. Write to support@tallyher.com and we will check the steps for you.
64. `pathCopy.noSteps` This workflow has no steps for your phone yet. Skip it for now, and we will add them.
65. `pathCopy.phone.title` Which phone do you have?
66. `pathCopy.phone.hint` So you only see the steps for your phone.
67. `pathCopy.phone.labels.iphone` iPhone
68. `pathCopy.phone.labels.samsung` Samsung
69. `pathCopy.phone.labels.android` Another Android phone
70. `pathCopy.phone.change` Change phone
71. `pathCopy.withAi.steps(…)[0]` Open Claude and start a new chat.
72. `pathCopy.withAi.steps(…)[1]` Paste the message Tally wrote for you, above, and fill in the parts in brackets.
73. `pathCopy.withAi.steps(…)[2]` Read the answer and change anything that is not right before you use it.
74. `pathCopy.withAi.tryOn` The next three times this task comes up.
75. `pathCopy.withAi.good` You change no more than a sentence before you use it.
76. `pathCopy.withAi.fixes[0]` Make it shorter.
77. `pathCopy.withAi.fixes[1]` Make it sound more like me.
78. `pathCopy.withAi.fixes[2]` Use only what I gave you and add nothing.
79. `pathCopy.withAi.approval` You read it and check every detail before it goes out.
80. `pathCopy.withAi.cost(…)` The free plan of Claude is enough for this.
81. `pathCopy.didItWork` Did it work?
82. `pathCopy.yes` Yes
83. `pathCopy.notQuite` Not quite
84. `pathCopy.yesSaved` Good. On to the next step.
85. `pathCopy.notQuiteSaved` Try one of the lines above, then test it again.
86. `pathCopy.help.line(…)` Still not working? Write to support@tallyher.com and we will help you get it running. [the approved refund line]
87. `pathCopy.help.label` What went wrong? A few words help.
88. `pathCopy.help.send` Send
89. `pathCopy.help.sent` Thanks, we got it.
90. `pathCopy.next` Next step
91. `pathCopy.back` Back
92. `pathCopy.endTitle` What is safe at your job
93. `pathCopy.askLabel` The message to ask what’s allowed
94. `pathCopy.askLead` Send this to your manager or IT.
95. `pathCopy.end` That is your path. You can come back to any step.
96. `pathCopy.saveError` That didn’t save. Please try again.

## 5. Setup cards (lib/beginner/cards.ts)

Titles, steps and notes. Checked against the vendors' help pages on the date shown.


**chatgpt_get_started, checked 2026-11-14**

97. title: Get ChatGPT ready on your phone and computer
98. phone step 1: Open the App Store on an iPhone or Google Play on Android and search for OpenAI ChatGPT.
99. phone step 2: Check that the app comes from OpenAI before you download it.
100. phone step 3: Open the app and sign up with an email address you own, so your chats are saved.
101. phone step 4: Type what you need in the message box and send it.
102. computer step 1: Go to chatgpt.com in your browser.
103. computer step 2: Sign up with an email address you own, so your chats are saved.
104. computer step 3: Type what you need in the message box and send it. Select New chat when you want to start fresh.
105. free plan note: The free plan has lower message limits than the paid plans.

**chatgpt_about_you, checked 2026-11-14**

106. title: Save instructions about yourself in ChatGPT
107. phone step 1: Open the sidebar and select your profile icon to open Settings.
108. phone step 2: Select Customize ChatGPT.
109. phone step 3: Make sure Enable customization is turned on.
110. phone step 4: Type your instructions in the Custom Instructions field. They apply to every chat right away.
111. computer step 1: Open Settings from the sidebar.
112. computer step 2: Select Personalization.
113. computer step 3: Make sure Enable customization is turned on.
114. computer step 4: Type your instructions in the Custom Instructions field. They apply to every chat right away.
115. free plan note: The free plan saves up to 1,500 characters of instructions.

**chatgpt_project, checked 2026-11-14**

116. title: Make a ChatGPT project for a task you repeat
117. computer step 1: Select New project in the sidebar.
118. computer step 2: Give the project a name, then pick an icon and a color.
119. computer step 3: Open the menu with three dots and select Project settings.
120. computer step 4: Type your instructions for this task, then select Save.
121. computer step 5: Add your examples to the project by uploading a file or pasting text.
122. computer step 6: Start a new chat inside the project. It uses your instructions and examples, and no other chat does.
123. free plan note: The free plan lets you add fewer files to a project than the paid plans.

**claude_get_started, checked 2026-11-14**

124. title: Get Claude ready on your phone and computer
125. phone step 1: Download the Claude app from the App Store on an iPhone or Google Play on Android.
126. phone step 2: Open the app and create a free account. You need to be 18 or older.
127. phone step 3: Type what you need in the message box and send it.
128. computer step 1: Go to claude.ai in your browser. You can also download Claude Desktop for Mac or Windows.
129. computer step 2: Create a free account. You need to be 18 or older.
130. computer step 3: Type what you need in the message box and click the submit button.
131. free plan note: The free plan has a usage limit that resets every five hours.

**claude_about_you, checked 2026-11-14**

132. title: Save instructions about yourself in Claude
133. computer step 1: Click your initials in the lower left corner.
134. computer step 2: Select Settings, then Your Claude. If you see the older Settings page, select Account.
135. computer step 3: Under Instructions, describe how you work and how you like your answers. On the older page this is called Instructions for Claude.
136. computer step 4: Claude uses these instructions in all your chats.

**claude_project, checked 2026-11-14**

137. title: Make a Claude project for a task you repeat
138. computer step 1: Open the left side panel and click Projects, or go to claude.ai/projects.
139. computer step 2: Click New Project in the upper right corner.
140. computer step 3: Give the project a name and a description. Claude does not read these.
141. computer step 4: Click Set project instructions, write how Claude should handle this task, then click Save instructions.
142. computer step 5: In the project knowledge on the right, click the plus button and add your examples as documents or text.
143. computer step 6: Start a chat inside the project. Claude uses your instructions and examples in every chat there.
144. free plan note: The free plan lets you make up to five projects.

## 6. Workflow recipes (lib/beginner/recipes.ts)

Everything she reads from a recipe: the offer name, the map line, the material list, the test, the approval point, the cost line and every step that is plain text. Steps that point to a card are the card's lines above.


**phone_quick_replies, level 3, checked 2026-11-14**

145. title: Your most common replies, saved on your phone
146. offer: saved once on your phone
147. withPath: Your common replies are saved on your phone, each a few letters away.
148. material: Your most common replies, in your own words, with no names, times or private details in them.
149. material: A short shortcut for each reply, for an iPhone or a Samsung phone.
150. test, try on: The next three messages that need one of these replies.
151. test, good: The reply fits after you change at most a name or a time.
152. test, fix: Make this reply shorter and warmer.
153. test, fix: Add a line that asks them to confirm.
154. test, fix: Rewrite this the way I would say it out loud.
155. approval: You read every reply before you send it. Nothing is sent by itself.
156. cost: Text replacement on an iPhone, text shortcuts on a Samsung phone and the Gboard clipboard are free, and Tally writes the replies for you.
157. iphone + any_chat, phone step 1: Keep the replies and shortcuts Tally wrote for you open, above.
158. iphone + any_chat, phone step 2: In any app where you can type, touch and hold the Emoji button or the Switch Keyboard key.
159. iphone + any_chat, phone step 3: Tap Keyboard Settings, then tap Text Replacement.
160. iphone + any_chat, phone step 4: Tap the Add button.
161. iphone + any_chat, phone step 5: Type one reply in the Phrase field and its shortcut in the Shortcut field.
162. iphone + any_chat, phone step 6: Do the same for each reply on your list.
163. gboard + any_chat note: These steps are for Gboard, Google's keyboard. If your phone uses another keyboard, this workflow has no steps for your phone yet.
164. gboard + any_chat, phone step 1: Copy one reply Tally wrote for you, above.
165. gboard + any_chat, phone step 2: Open an app you can type in and tap a text field.
166. gboard + any_chat, phone step 3: At the top of the keyboard, tap Clipboard.
167. gboard + any_chat, phone step 4: Touch and hold the reply you copied, then tap Pin. Pinned replies stay in the Pinned section.
168. gboard + any_chat, phone step 5: Do the same for each reply on your list.
169. samsung_keyboard note: These steps are for Samsung Keyboard. If your settings look different, Samsung says to try Settings, then Language and input, then On screen keyboard, then Samsung Keyboard, then Smart typing.
170. samsung_keyboard, phone step 1: Keep the replies and shortcuts Tally wrote for you open, above.
171. samsung_keyboard, phone step 2: Go to Settings, then tap General management.
172. samsung_keyboard, phone step 3: Tap Samsung Keyboard settings.
173. samsung_keyboard, phone step 4: Tap Text shortcuts.
174. samsung_keyboard, phone step 5: Tap the plus icon in the top right corner of the screen.
175. samsung_keyboard, phone step 6: Type a shortcut in Shortcut phrase and its reply in Expanded phrase, then tap Add.
176. samsung_keyboard, phone step 7: Do the same for each reply on your list.
177. samsung_keyboard, phone step 8: When you type a shortcut, its reply appears in the bar above the keyboard. Tap it to put it in.

**saved_assistant, level 3, checked 2026-11-14**

178. title: A saved assistant for the writing you repeat
179. offer: with a saved assistant
180. withPath: You hand it the job, and it writes in your voice with your details already in.
181. material: Instructions for your assistant, with your details, your wording and what to avoid.
182. material: Two or three of your own examples, with names and private details taken out.
183. test, try on: The next three times this task comes up.
184. test, good: You change no more than a sentence before you use it.
185. test, fix: This is too long. Keep it to the length of my examples.
186. test, fix: You added something I never said. Use only what I gave you.
187. test, fix: Match the tone of my second example more closely.
188. approval: You read what it wrote and fix anything wrong before you send or post it.
189. cost: The free plans of ChatGPT and Claude are enough. Claude's free plan allows up to five projects.
190. chatgpt, computer step 2: Use the instructions and examples Tally wrote for you when the card asks for them.
191. chatgpt, computer step 3: Each time the task comes up, start a new chat in the project and say what you need.
192. claude, computer step 2: Use the instructions and examples Tally wrote for you when the card asks for them.
193. claude, computer step 3: Each time the task comes up, start a new chat in the project and say what you need.

**say_it_out_loud, level 3, checked 2026-11-14**

194. title: Say it out loud, get the finished text
195. offer: said out loud, finished as text
196. withPath: You say what you need out loud, and the finished text comes back.
197. material: An opening line that tells your chat tool what to turn your words into, with your format and wording.
198. material: A short list of what to say each time, so nothing gets left out.
199. test, try on: The next three times you would have typed this.
200. test, good: The text is ready to send after one read, with every detail you said and nothing you did not.
201. test, fix: You left out a detail I said. Put back everything I mentioned.
202. test, fix: Use my format from the opening line.
203. test, fix: Make it sound less formal, like I wrote it.
204. approval: You read the finished text and check every name, number and price before you send it.
205. cost: Dictation in the Claude app is on every plan, including free, and counts toward your normal limits. OpenAI's page does not say whether ChatGPT's free plan limits dictation.
206. claude note: On a computer this works in the Claude app for Mac with macOS 14 or later, not on Windows.
207. claude, phone step 1: Open the Claude app and start a new chat. Paste the opening line Tally wrote for you.
208. claude, phone step 2: Tap the microphone icon on the right side of the message box. The first time, choose your language.
209. claude, phone step 3: Say what you need, the way you would tell a colleague.
210. claude, phone step 4: Tap the arrow to send. Claude writes the finished text from what you said.
211. claude, computer step 1: Open the Claude app for Mac and turn on the voice shortcut when it offers it.
212. claude, computer step 2: Press Caps Lock, say what you need, then press Caps Lock again.
213. claude, computer step 3: Check the words, then click the arrow to send.
214. chatgpt note: OpenAI's page does not say which devices show the microphone icon.
215. chatgpt, phone step 1: Paste the opening line Tally wrote for you into a new chat.
216. chatgpt, phone step 2: Press the microphone icon and say what you need.
217. chatgpt, phone step 3: Check the words ChatGPT heard and change anything that is wrong, then send it.
218. chatgpt, computer step 1: Paste the opening line Tally wrote for you into a new chat.
219. chatgpt, computer step 2: Press the microphone icon and say what you need.
220. chatgpt, computer step 3: Check the words ChatGPT heard and change anything that is wrong, then send it.

**notes_to_sheet, level 3, checked 2026-11-14**

221. title: Your messy notes, turned into a clean table
222. offer: turned into rows for your sheet
223. withPath: Your notes go in as they are and come out as rows for your sheet.
224. material: Instructions with the columns of your sheet, in order, and how to write each one.
225. material: A rule for what to do with a line that does not fit, so nothing is lost.
226. test, try on: Your next three batches of notes.
227. test, good: Every line lands in the right column, and nothing is left out or made up.
228. test, fix: You missed some lines. Count my notes and include every one.
229. test, fix: Put the dates in this format, the same in every row.
230. test, fix: Leave a cell empty when my notes do not say it. Do not guess.
231. approval: You compare the table with your notes before you import it.
232. cost: The free plans of Claude and ChatGPT work, and Google Sheets is free. Making files uses more of your limit, and ChatGPT's free plan has a lower limit for this.
233. claude + google_sheets, computer step 1: In Claude, open Settings, then Capabilities, and turn on Code execution and file creation. In newer settings it is called Create and edit files.
234. claude + google_sheets, computer step 2: Paste your notes with the instructions Tally wrote for you and ask for a CSV file.
235. claude + google_sheets, computer step 3: Download the file from the conversation.
236. claude + google_sheets, computer step 4: Open your spreadsheet in Google Sheets.
237. claude + google_sheets, computer step 5: At the top, click File, then Import.
238. claude + google_sheets, computer step 6: Choose the file, pick Insert new sheets or Append rows to current sheet, then click Import.
239. chatgpt + google_sheets, computer step 1: Paste your notes with the instructions Tally wrote for you and ask for the result as a table.
240. chatgpt + google_sheets, computer step 2: Click the download button in the top right corner of the table. It saves as a CSV file.
241. chatgpt + google_sheets, computer step 3: Open your spreadsheet in Google Sheets.
242. chatgpt + google_sheets, computer step 4: At the top, click File, then Import.
243. chatgpt + google_sheets, computer step 5: Choose the file, pick Insert new sheets or Append rows to current sheet, then click Import.

**gmail_templates, level 3, checked 2026-11-14**

244. title: Your most common emails, saved as Gmail templates
245. offer: saved once as Gmail templates
246. withPath: Your common emails are saved in Gmail as templates, ready to fill in.
247. material: Your most common emails, in your own words, with a gap in brackets for each detail that changes.
248. material: A clear name for each template, so you find it fast.
249. test, try on: The next three times you would write one of these emails.
250. test, good: You fill in the gaps and send it without rewriting anything else.
251. test, fix: This one is too stiff. Make it sound like me.
252. test, fix: Split this into two templates, one for each case.
253. test, fix: Add a line for the question people always ask next.
254. approval: You fill in every gap and read the email before you send it yourself.
255. cost: Gmail templates are free, and Tally writes the emails for you.
256. gmail + any_chat note: Gmail templates work only on a computer, not in the Gmail phone app.
257. gmail + any_chat, computer step 1: Keep the emails Tally wrote for you open, above.
258. gmail + any_chat, computer step 2: In Gmail, click Settings at the top right, then See all settings.
259. gmail + any_chat, computer step 3: Click Advanced at the top, click Enable next to Templates, then click Save Changes at the bottom.
260. gmail + any_chat, computer step 4: Click Compose and paste one email.
261. gmail + any_chat, computer step 5: At the bottom of the window, click More options, then Templates, then Save draft as template, then Save as new template.
262. gmail + any_chat, computer step 6: To use one, click Compose, then More options, then Templates, and pick it under Insert template.

**gmail_help_me_write, level 4, checked 2026-11-14**

263. title: Reply drafts inside Gmail, from Google's own AI
264. offer: drafted in your inbox
265. withPath: Reply drafts appear inside Gmail, and you check each one before you send.
266. material: Short starting lines for each kind of reply you send, to type into Help me write.
267. material: Notes on your tone, so you know which button to press when a draft sounds off.
268. test, try on: The next three emails that need a real reply.
269. test, good: The draft says what you meant, and you only change a detail or two.
270. test, fix: Shorten this to three sentences.
271. test, fix: Make this friendlier but keep the answer the same.
272. test, fix: Leave out anything I did not say and keep only my answer.
273. approval: Nothing is sent by itself. You read each draft and press Send yourself.
274. cost: Free personal Gmail accounts get Help me write in the US only. Elsewhere it needs a Google AI plan or an eligible Google Workspace plan, and on a work account your company decides.
275. gmail, phone step 1: Open the email in the Gmail app and reply.
276. gmail, phone step 2: Tap Help me write at the top right.
277. gmail, phone step 3: Type what you want to say and tap Create.
278. gmail, phone step 4: Tap the text to change anything, then tap Insert.
279. gmail, phone step 5: Read the draft, then send it yourself.
280. gmail, computer step 1: Open the email in Gmail and click Reply.
281. gmail, computer step 2: Type what you want to say in the prompt bar at the bottom. If you do not see it, click the Help me write icon.
282. gmail, computer step 3: Click Create. To change the tone, click Formalize, Friendly or Shorten.
283. gmail, computer step 4: Read the draft, fix anything that is wrong, then send it yourself.

**gmail_claude_follow_ups, level 4, checked 2026-11-14**

284. title: Follow ups drafted from your Gmail, sent only with your OK
285. offer: drafted from your inbox for your OK
286. withPath: Follow ups are drafted from your Gmail and wait for your OK.
287. material: Instructions that say which emails count as waiting, how long to wait, and how you chase.
288. material: Your follow up wording for a first and a second nudge.
289. test, try on: The next three people who have not answered you.
290. test, good: Each draft goes to the right person, about the right email, in your tone.
291. test, fix: This person already answered. Check the whole thread before you draft.
292. test, fix: Make the follow up shorter and do not apologize.
293. test, fix: Wait until a week has passed before you draft a follow up.
294. approval: Your chat tool asks before it sends anything. You read each draft and approve or send it yourself.
295. cost: Claude's page says the Gmail connector is for all users but does not say whether the free plan is enough. In ChatGPT, sending from the chat needs Plus or a higher plan.
296. claude + gmail note: On a Claude Team or Enterprise plan, an owner must turn on the connector first, and a Google Workspace admin may need to allow Claude.
297. claude + gmail, computer step 1: In Claude, open Customize, then Connectors, and click the plus button.
298. claude + gmail, computer step 2: Click Gmail, read what it can do, then click Connect.
299. claude + gmail, computer step 3: Sign in with Google and follow the prompts.
300. claude + gmail, computer step 4: In a new chat, click the plus button, point to Connectors and turn on Gmail for that chat.
301. claude + gmail, computer step 5: Paste the instructions Tally wrote for you. Claude finds the emails that need a follow up and drafts each one.
302. claude + gmail, computer step 6: Claude asks for your approval before it sends, replies or forwards anything. Read each draft first.
303. chatgpt + gmail note: Sending from ChatGPT works on the web, on Plus and higher plans.
304. chatgpt + gmail, computer step 1: In ChatGPT on the web, open Settings, then Plugins, and select Gmail. Some versions call this Apps.
305. chatgpt + gmail, computer step 2: Select Install plugin if you see it, then Connect, and sign in with Google.
306. chatgpt + gmail, computer step 3: Review the permissions Google asks for and finish.
307. chatgpt + gmail, computer step 4: In Settings, then Plugins, then Permissions, choose Always ask.
308. chatgpt + gmail, computer step 5: In a new chat, type @ and pick Gmail, then paste the instructions Tally wrote for you. ChatGPT drafts each follow up in the chat.
309. chatgpt + gmail, computer step 6: Read each draft. You choose whether to send it.

**weekly_no_reply_list, level 5, checked 2026-11-14**

310. title: A weekly list of who has not answered you
311. offer: listed for you every week
312. withPath: Once a week you get a list of who still owes you an answer.
313. material: Instructions that say which emails count as waiting for an answer, how many days to wait, and what to leave off the list.
314. material: The format of your list, with the person, the subject and how long it has been.
315. test, try on: The first three weekly lists.
316. test, good: Every name on the list really owes you an answer, and nobody who does is missing.
317. test, fix: This person already answered. Check the whole thread before you list it.
318. test, fix: Leave newsletters and automatic emails off the list.
319. test, fix: Only list emails I sent more than five days ago.
320. approval: The task only reads your email and gives you a list. Nothing is sent, and you decide who to chase. If a task ever tries to send, it stops and waits for you.
321. cost: ChatGPT's free plan allows three scheduled tasks, but OpenAI's pages do not say whether Gmail works on the free plan. Scheduled tasks in Claude need a paid plan.
322. chatgpt + gmail note: For a phone notification, make the task in the ChatGPT phone app instead.
323. chatgpt + gmail, computer step 1: In ChatGPT on the web, open Settings, then Plugins, and connect Gmail. Some versions call this Apps.
324. chatgpt + gmail, computer step 2: In Settings, then Plugins, then Permissions, choose Always ask.
325. chatgpt + gmail, computer step 3: In a new chat, paste the instructions Tally wrote for you. They ask ChatGPT to check your Gmail once a week.
326. chatgpt + gmail, computer step 4: ChatGPT shows the schedule. Check the day and time.
327. chatgpt + gmail, computer step 5: In Settings, then Notifications, pick Push, Email or both, so you see the list when it is ready.
328. chatgpt + gmail, computer step 6: To change or stop it, open Scheduled.
329. claude + gmail note: Scheduled tasks in Claude need a paid plan, Pro or higher. These steps are for Claude Cowork.
330. claude + gmail, computer step 1: In Claude, open Customize, then Connectors, and connect Gmail.
331. claude + gmail, computer step 2: Click Scheduled in the left sidebar, then New task, then Set up manually.
332. claude + gmail, computer step 3: Enter a name and paste the instructions Tally wrote for you.
333. claude + gmail, computer step 4: Set the approval mode to Manually approve and the frequency to Weekly.
334. claude + gmail, computer step 5: Click Save. The task runs even when your computer is asleep.

## 7. The beginner landing page (the ad links only, not the home page)

These sections show on /?angle=new_to_ai, own_job and first_try today. The Phase 7 promise list says which of them the path cannot keep yet.

335. `beginnerSteps[0]` Tell us your job, the apps you use and where you are with AI.
336. `beginnerSteps[1]` See where AI fits in your week, with the first task done for you, free.
337. `beginnerSteps[2]` Get your plan. The tools to use, the skills to learn, and how to do each one.
338. `beginnerStepsAfter` Not a list of prompts. A path built around your job and your level.
339. `beginnerPaths.title` Your path starts where you are
340. `beginnerPaths.lead` Tally works out what’s worth using for your job, then walks you through it. No research, no trial and error.
341. `beginnerPaths.paths[0].label` If you’re just starting
342. `beginnerPaths.paths[0].steps[0]` Open your first AI tool. We show you where to click.
343. `beginnerPaths.paths[0].steps[1]` One task from your job to try today.
344. `beginnerPaths.paths[0].steps[2]` Exactly what to type, and why.
345. `beginnerPaths.paths[0].steps[3]` What a good answer looks like, and how to fix a bad one.
346. `beginnerPaths.paths[0].steps[4]` The next skill to learn, and where to find it.
347. `beginnerPaths.paths[1].label` If you already use AI
348. `beginnerPaths.paths[1].steps[0]` We find where your hours go. Email, reports, content.
349. `beginnerPaths.paths[1].steps[1]` The right tool for it, not just a better prompt.
350. `beginnerPaths.paths[1].steps[2]` How to set it up, step by step.
351. `beginnerPaths.paths[1].steps[3]` How to connect it to the apps you already use.
352. `beginnerPaths.paths[1].steps[4]` Getting it running on your real work.
353. `beginnerPaths.after` As you get better, your path moves on with you.
354. `beginnerPage.which.shots.blank.title` New chat
355. `beginnerPage.which.shots.blank.field` Ask anything
356. `beginnerPage.which.shots.small.title` Your chats
357. `beginnerPage.which.shots.small.rows[0]` Chicken thigh recipe
358. `beginnerPage.which.shots.small.rows[1]` Reword email to landlord
359. `beginnerPage.which.shots.small.rows[2]` Another word for “also”
360. `beginnerPage.jobs.title` What it could take off your plate
361. `beginnerPage.jobs.lead` Every job is made of the same few kinds of work. Pick the one you’d most like off your plate.
362. `beginnerPage.jobs.label` Kinds of work
363. `beginnerPage.jobs.list[0].id` email
364. `beginnerPage.jobs.list[0].name` Email and messages
365. `beginnerPage.jobs.list[0].items[0].text` Reply drafts that sound like you
366. `beginnerPage.jobs.list[0].items[0].kind` Skill
367. `beginnerPage.jobs.list[0].items[1].text` Your inbox sorted by what needs you
368. `beginnerPage.jobs.list[0].items[1].kind` Automation
369. `beginnerPage.jobs.list[0].items[2].text` A nudge for anything left unanswered
370. `beginnerPage.jobs.list[0].items[2].kind` Automation
371. `beginnerPage.jobs.list[0].items[3].text` Saved answers to the questions you get every week
372. `beginnerPage.jobs.list[0].items[3].kind` Tool
373. `beginnerPage.jobs.list[1].id` planning
374. `beginnerPage.jobs.list[1].name` Scheduling and planning
375. `beginnerPage.jobs.list[1].items[0].text` A time found without the back and forth
376. `beginnerPage.jobs.list[1].items[0].kind` Tool
377. `beginnerPage.jobs.list[1].items[1].text` Your week planned from your calendar
378. `beginnerPage.jobs.list[1].items[1].kind` Workflow
379. `beginnerPage.jobs.list[1].items[2].text` Reminders written and lined up to send
380. `beginnerPage.jobs.list[1].items[2].kind` Automation
381. `beginnerPage.jobs.list[1].items[3].text` A checklist for anything you run twice
382. `beginnerPage.jobs.list[1].items[3].kind` Skill
383. `beginnerPage.jobs.list[2].id` reports
384. `beginnerPage.jobs.list[2].name` Reports and numbers
385. `beginnerPage.jobs.list[2].items[0].text` A weekly summary straight from your spreadsheet
386. `beginnerPage.jobs.list[2].items[0].kind` Automation
387. `beginnerPage.jobs.list[2].items[1].text` Raw numbers turned into charts and plain words
388. `beginnerPage.jobs.list[2].items[1].kind` Tool
389. `beginnerPage.jobs.list[2].items[2].text` One report you never rebuild from scratch
390. `beginnerPage.jobs.list[2].items[2].kind` Skill
391. `beginnerPage.jobs.list[2].items[3].text` What changed since last week, pointed out
392. `beginnerPage.jobs.list[2].items[3].kind` Workflow
393. `beginnerPage.jobs.list[3].id` content
394. `beginnerPage.jobs.list[3].name` Posts and content
395. `beginnerPage.jobs.list[3].items[0].text` A month of posts planned in one sitting
396. `beginnerPage.jobs.list[3].items[0].kind` Workflow
397. `beginnerPage.jobs.list[3].items[1].text` Captions in your own voice
398. `beginnerPage.jobs.list[3].items[1].kind` Skill
399. `beginnerPage.jobs.list[3].items[2].text` One idea turned into every format you post
400. `beginnerPage.jobs.list[3].items[2].kind` Workflow
401. `beginnerPage.jobs.list[3].items[3].text` Images and layouts started for you
402. `beginnerPage.jobs.list[3].items[3].kind` Tool
403. `beginnerPage.jobs.list[4].id` admin
404. `beginnerPage.jobs.list[4].name` Paperwork and admin
405. `beginnerPage.jobs.list[4].items[0].text` Forms filled from what you already have
406. `beginnerPage.jobs.list[4].items[0].kind` Automation
407. `beginnerPage.jobs.list[4].items[1].text` Quotes and invoices from a few details
408. `beginnerPage.jobs.list[4].items[1].kind` Workflow
409. `beginnerPage.jobs.list[4].items[2].text` How tos written once, not explained again
410. `beginnerPage.jobs.list[4].items[2].kind` Skill
411. `beginnerPage.jobs.list[4].items[3].text` Long documents searched and summed up
412. `beginnerPage.jobs.list[4].items[3].kind` Tool
413. `beginnerPage.jobs.list[5].id` meetings
414. `beginnerPage.jobs.list[5].name` Meetings and notes
415. `beginnerPage.jobs.list[5].items[0].text` Notes taken for you
416. `beginnerPage.jobs.list[5].items[0].kind` Tool
417. `beginnerPage.jobs.list[5].items[1].text` A recap and next steps sent afterward
418. `beginnerPage.jobs.list[5].items[1].kind` Automation
419. `beginnerPage.jobs.list[5].items[2].text` An agenda from a rough list
420. `beginnerPage.jobs.list[5].items[2].kind` Skill
421. `beginnerPage.jobs.list[5].items[3].text` Prep pulled from your past notes
422. `beginnerPage.jobs.list[5].items[3].kind` Workflow
423. `beginnerPage.jobs.after` Your plan is built from your own job and your own week, not from a list like this.
424. `beginnerPage.changes.title` Your work, before and after
425. `beginnerPage.changes.lead` Same job. Same hours in the day. Less of it spent on the work you hate.
426. `beginnerPage.changes.before` Today
427. `beginnerPage.changes.after` With Tally
428. `beginnerPage.changes.days[0].what` The same task, again
429. `beginnerPage.changes.days[0].before` Starting from scratch every time
430. `beginnerPage.changes.days[0].after` Set up once, then it takes minutes
431. `beginnerPage.changes.days[0].kind` Automation
432. `beginnerPage.changes.days[1].what` Writing
433. `beginnerPage.changes.days[1].before` Every email, post and report typed by hand
434. `beginnerPage.changes.days[1].after` A first draft waiting for you to check
435. `beginnerPage.changes.days[1].kind` Skill
436. `beginnerPage.changes.days[2].what` Finding the right tool
437. `beginnerPage.changes.days[2].before` Ten tabs open, still not sure which one
438. `beginnerPage.changes.days[2].after` The one that fits your work, picked for you
439. `beginnerPage.changes.days[2].kind` Tool
440. `beginnerPage.changes.days[3].what` Getting it to work
441. `beginnerPage.changes.days[3].before` Trying it once and giving up
442. `beginnerPage.changes.days[3].after` Step by step, until it runs
443. `beginnerPage.changes.days[3].kind` How to
444. `beginnerPage.changes.days[4].what` The end of the day
445. `beginnerPage.changes.days[4].before` Work that follows you home
446. `beginnerPage.changes.days[4].after` Done before you leave
447. `beginnerPage.changes.close[0]` The busywork takes minutes.
448. `beginnerPage.changes.close[1]` Your evening is yours.
449. `beginnerPage.changes.close[2]` You become the one who knows how.
450. `beginnerFaqs[6].a` ChatGPT answers what you ask. Tally works out what’s worth asking in your job, which tools fit it, and walks you through setting them up.

**The pictures in How it works (beginnerSample)**

451. `beginnerSample.question` What’s your job, in your own words?
452. `beginnerSample.answer` Receptionist at a dental office. Phones, scheduling, insurance…
453. `beginnerSample.winTitle` Your first AI win
454. `beginnerSample.winIntro` You said reminder texts eat your time. Here is one.
455. `beginnerSample.winDraft` Hi [first name], this is a reminder of your cleaning on [day] at [time]. Reply C to confirm.
456. `beginnerSample.also` Also in your plan
457. `beginnerSample.ideas[0]` A script for no show calls
458. `beginnerSample.ideas[1]` Facebook posts for the office
459. `beginnerSample.tool` Claude
460. `beginnerSample.promptLabel` Paste this
461. `beginnerSample.prompt` I’m a receptionist at a dental office. Write a reminder text for an appointment on [day and time].
462. `beginnerSample.daysLabel` Your seven days
463. `beginnerSample.profileTitle` Your profile
464. `beginnerSample.profileProgress` 5 of 7
465. `beginnerSample.profile[0].label` Role
466. `beginnerSample.profile[0].value` Event coordinator, restaurant group
467. `beginnerSample.profile[1].label` Apps
468. `beginnerSample.profile[1].chips[0]` Gmail
469. `beginnerSample.profile[1].chips[1]` Google Sheets
470. `beginnerSample.profile[1].chips[2]` Slack
471. `beginnerSample.profile[2].label` With AI
472. `beginnerSample.profile[2].value` Uses it, wants more from it
473. `beginnerSample.profile[3].label` Biggest time sink
474. `beginnerSample.profile[3].value` Vendor emails
475. `beginnerSample.profile[4].label` Over and over
476. `beginnerSample.profile[4].chips[0]` Run of show
477. `beginnerSample.profile[4].chips[1]` Headcounts
478. `beginnerSample.profile[4].chips[2]` Recaps
479. `beginnerSample.profileNext` Which would save you the most time?
480. `beginnerSample.mapTitle` Where AI fits in your week
481. `beginnerSample.mapRole` Event coordinator · 5 found
482. `beginnerSample.map[0].task` Vendor emails
483. `beginnerSample.map[0].fix` Reply drafts inside Gmail
484. `beginnerSample.map[0].kind` Tool
485. `beginnerSample.map[1].task` Run of show
486. `beginnerSample.map[1].fix` Built from your sheet
487. `beginnerSample.map[1].kind` Workflow
488. `beginnerSample.map[2].task` Weekly headcounts
489. `beginnerSample.map[2].fix` Summary sent every Monday
490. `beginnerSample.map[2].kind` Automation
491. `beginnerSample.map[3].task` Client recaps
492. `beginnerSample.map[3].fix` Notes to recap in one step
493. `beginnerSample.map[3].kind` Skill
494. `beginnerSample.map[4].task` Banquet orders
495. `beginnerSample.map[4].fix` Filled in from the client’s email
496. `beginnerSample.map[4].kind` Automation
497. `beginnerSample.mapFree` First one done for you, free
498. `beginnerSample.pathTitle` Workflow 1 of 4
499. `beginnerSample.pathName` Vendor email replies
500. `beginnerSample.pathDoneStep` Connect Claude to Gmail
501. `beginnerSample.pathNow.title` Create a project for your vendors
502. `beginnerSample.pathNow.lines[0]` In Claude, open Projects and choose New project.
503. `beginnerSample.pathNow.lines[1]` Name it Vendor replies.
504. `beginnerSample.pathNow.lines[2]` Paste in your tone notes and vendor list. We wrote both for you.
505. `beginnerSample.pathNow.copy` Copy tone notes
506. `beginnerSample.pathNow.next` Done, next step
507. `beginnerSample.pathLater[0]` Save the reply as a reusable skill
508. `beginnerSample.pathLater[1]` Test it on five real emails
509. `beginnerSample.pathLater[2]` Turn it on for your inbox

## 8. Written but not on the beginner page today

Kept in the code, shown nowhere on the beginner page now. Approve only if you want them back.

510. `beginnerProblem.before.label` What most people type
511. `beginnerProblem.after.label` What your plan gives you to paste
512. `beginnerProblem.before.verdict` Sounds like an ad
513. `beginnerProblem.after.verdict` Sounds like you
514. `beginnerFeelings.blank.title` New chat
515. `beginnerFeelings.blank.field` Ask anything
516. `beginnerFeelings.unsure.before` Rewrite this email to Mrs. 
517. `beginnerFeelings.unsure.after`  about her overdue balance
518. `beginnerFeelings.unsure.doubt` Is it OK to paste this?
519. `beginnerFeelings.course.title` AI for beginners
520. `beginnerFeelings.course.length` 6 weeks
521. `beginnerFeelings.course.modules[0]` 1. What is a language model?
522. `beginnerFeelings.course.modules[1]` 2. Prompt frameworks
523. `beginnerFeelings.course.modules[2]` 3. Tokens and context

## 9. The old plan page

Only for the few plans bought before Phase 6. New buyers get the path in part 4.

524. `beginnerPlanCopy.title` Your plan
525. `beginnerPlanCopy.toolLabel` Start here
526. `beginnerPlanCopy.toolSteps` How to open it
527. `beginnerPlanCopy.restricted` Your company restricts AI, so treat this as practice on your own phone or computer, with nothing from work in it. The message under At work asks what’s allowed.
528. `beginnerPlanCopy.winLabel` About 15 minutes
529. `beginnerPlanCopy.promptLabel` Paste this
530. `beginnerPlanCopy.exampleLabel` A good answer looks like this
531. `beginnerPlanCopy.fixesLabel` If it’s off, send one of these
532. `beginnerPlanCopy.done` I did it
533. `beginnerPlanCopy.undone` Done
534. `beginnerPlanCopy.ideasWork` For your job
535. `beginnerPlanCopy.ideasLife` From daily life
536. `beginnerPlanCopy.ideaPrompt` Ready prompt
537. `beginnerPlanCopy.marksNote.employer` Safe today needs nothing private. Check first waits until you know what your company allows.
538. `beginnerPlanCopy.marksNote.self` Safe today needs nothing private. Your safe use rules say what to leave out of the rest.
539. `beginnerPlanCopy.profileLabel` Your work profile
540. `beginnerPlanCopy.profileLead` Paste it at the start of a chat, so answers sound like you.
541. `beginnerPlanCopy.daysProgress(…)` 3 of 7 done
542. `beginnerPlanCopy.daysNote` Your ticks are kept on this phone or computer.
543. `beginnerPlanCopy.atWork.title` At work
544. `beginnerPlanCopy.atWork.text` For when you’re ready to use AI on your real work, openly.
545. `beginnerPlanCopy.askLabel` Ask what’s approved
546. `beginnerPlanCopy.askLead` Send this to IT or your manager.
547. `beginnerPlanCopy.talkLabel` Talking about AI with your manager
548. `markLabels.safe_today` Safe today
549. `markLabels.check_first` Check first
550. `toolSite.claude.name` Claude
551. `toolSite.claude.steps[0]` Open claude.ai in your browser, or get the Claude app on your phone.
552. `toolSite.claude.steps[1]` Sign up with your email. The free version is enough.
553. `toolSite.claude.steps[2]` Type or paste into the message box and send it, like a text.
554. `toolSite.chatgpt.name` ChatGPT
555. `toolSite.chatgpt.steps[0]` Open chatgpt.com in your browser, or get the ChatGPT app on your phone.
556. `toolSite.chatgpt.steps[1]` Sign up with your email. The free version is enough.
557. `toolSite.chatgpt.steps[2]` Type or paste into the message box and send it, like a text.
558. `toolSite.gemini.name` Gemini
559. `toolSite.gemini.steps[0]` Open gemini.google.com in your browser, or get the Gemini app on your phone.
560. `toolSite.gemini.steps[1]` Sign in with your Google account. The free version is enough.
561. `toolSite.gemini.steps[2]` Type or paste into the message box and send it, like a text.
562. `toolSite.copilot.name` Copilot
563. `toolSite.copilot.steps[0]` Open copilot.microsoft.com in your browser, or get the Copilot app on your phone.
564. `toolSite.copilot.steps[1]` Sign in with your Microsoft account. The free version is enough.
565. `toolSite.copilot.steps[2]` Type or paste into the message box and send it, like a text.
566. `sevenDays[0].title` Your first win
567. `sevenDays[0].text` The prompt is above. Paste it, send it and read what comes back.
568. `sevenDays[1].title` Do it again with a real one from today
569. `sevenDays[1].text` Same prompt, with today’s details in the brackets. Use what it gives you.
570. `sevenDays[2].title` Teach it who you are
571. `sevenDays[2].text` Paste your work profile at the start of a chat, so answers sound like you.
572. `sevenDays[3].title` A second task from your ideas
573. `sevenDays[3].text` Try “[idea]”.
574. `sevenDays[4].title` One from daily life
575. `sevenDays[4].text` Try “[life]”. It doesn’t have to be about work.
576. `sevenDays[5].title` Fix a bad answer
577. `sevenDays[5].text` When an answer misses, don’t start over. Tell it what’s wrong and ask again.
578. `sevenDays[6].title` Pick the three you’ll keep
579. `sevenDays[6].text` Look back over the week and keep the three that helped most.
580. `planToolsCopy.title` Your tools
581. `planToolsCopy.tryThis` Try this week
582. `planToolsCopy.withChat` With your chat tool

582 lines in all.
