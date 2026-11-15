# Every DRAFT line, for one approval

Made on 15 November 2026 for Phase 7, and made again after the fixes the same day. Every line here is marked DRAFT in the code and waits for Karl. Each has a number, so you can answer "approve all except 12 and 40" and say what to change.

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
31. `levelCopy.askFirstNotSure` Ask first what your company allows with AI. (new 15 November, on every task AI touches when she answered Not sure)

**When every task waits for her company's OK**

32. `askFirstCopy.title` Ask first, then come back
33. `askFirstCopy.lead` Your company restricts AI, and every task on your map needs it. So there is nothing to buy yet. Here is the message to ask what’s allowed, free.
34. `askFirstCopy.label` The message to ask what’s allowed
35. `askFirstCopy.sendTo` Send this to your manager or IT.
36. `askFirstCopy.back` When you know what’s allowed, come back and take the quiz again. Your path starts from there.
37. `askFirstCopy.message(…)` Hi, I’d like to start using AI for parts of my work, like rescheduling texts and client notes. Which AI tools are we allowed to use, and what can I use them for? I would never put private details about people or the company into them. Thanks.

## 3. Stripe's page and her receipt

Text only. Approving it changes no Stripe setting.

38. `beginnerCheckout.name` Your plan
39. `beginnerCheckout.description` A personal plan to start using AI in your own job.

## 4. The paid path, one step at a time (Phase 6)

40. `pathCopy.eyebrow` Your path
41. `pathCopy.progress(…)` Step 2 of 6
42. `pathCopy.skipped.ready` You already use AI, so your path skips getting a tool ready.
43. `pathCopy.skipped.about` You have already saved instructions about yourself, so your path skips that step.
44. `pathCopy.firstMessage` Then send this first message
45. `pathCopy.firstMessageLead` Fill in the part in brackets. What comes back is your first real result.
46. `pathCopy.aboutLabel` Your note about you
47. `pathCopy.aboutLead` Save this note as your instructions, so every answer fits you.
48. `pathCopy.noCard(…)` Tally has no checked steps for Gemini yet. Paste this note at the start of a new chat each time.
49. `pathCopy.readyNoCard(…)` Tally has no checked steps for Gemini yet. Open it, sign in, and send the message below.
50. `pathCopy.computerOnly(…)` Claude’s help pages give these steps on a computer only. Until you are at one, paste this note at the start of a chat.
51. `pathCopy.readLabel` How it works from now on
52. `pathCopy.setupLabel` Set it up
53. `pathCopy.devices.phone` On your phone
54. `pathCopy.devices.computer` On your computer
55. `pathCopy.materialLabel` What Tally wrote for you
56. `pathCopy.extraSetup(…)` Add these to the setup from Your reminder texts, the same way you did there.
57. `pathCopy.testLabel` Try it on three real ones
58. `pathCopy.goodLabel` What good looks like
59. `pathCopy.fixesLabel` When it is off, send one of these
60. `pathCopy.approvalLabel` You always check
61. `pathCopy.costLabel` What it costs
62. `pathCopy.costFirst` Before you start
63. `pathCopy.stopsLabel` If it stops working
64. `pathCopy.stops(…)` Apps change their menus now and then. Write to support@tallyher.com and we will check the steps for you.
65. `pathCopy.noSteps` This workflow has no steps for your phone yet. Skip it for now, and we will add them.
66. `pathCopy.phone.title` Which phone do you have?
67. `pathCopy.phone.hint` So you only see the steps for your phone.
68. `pathCopy.phone.labels.iphone` iPhone
69. `pathCopy.phone.labels.samsung` Samsung
70. `pathCopy.phone.labels.android` Another Android phone
71. `pathCopy.phone.change` Change phone
72. `pathCopy.withAi.steps(…)[0]` Open Claude and start a new chat.
73. `pathCopy.withAi.steps(…)[1]` Paste the message Tally wrote for you, above, and fill in the parts in brackets.
74. `pathCopy.withAi.steps(…)[2]` Read the answer and change anything that is not right before you use it.
75. `pathCopy.withAi.tryOn` The next three times this task comes up.
76. `pathCopy.withAi.good` You change no more than a sentence before you use it.
77. `pathCopy.withAi.fixes[0]` Make it shorter.
78. `pathCopy.withAi.fixes[1]` Make it sound more like me.
79. `pathCopy.withAi.fixes[2]` Use only what I gave you and add nothing.
80. `pathCopy.withAi.approval` You read it and check every detail before it goes out.
81. `pathCopy.withAi.cost(…)` The free plan of Claude is enough for this.
82. `pathCopy.didItWork` Did it work?
83. `pathCopy.yes` Yes
84. `pathCopy.notQuite` Not quite
85. `pathCopy.yesSaved` Good. On to the next step.
86. `pathCopy.notQuiteSaved` Try one of the lines above, then test it again.
87. `pathCopy.help.line(…)` Still not working? Write to support@tallyher.com and we will help you get it running. [the approved refund line]
88. `pathCopy.help.label` What went wrong? A few words help.
89. `pathCopy.help.send` Send
90. `pathCopy.help.sent` Thanks, we got it.
91. `pathCopy.next` Next step
92. `pathCopy.back` Back
93. `pathCopy.endTitle` What is safe at your job
94. `pathCopy.askLabel` The message to ask what’s allowed
95. `pathCopy.askLead` Send this to your manager or IT.
96. `pathCopy.end` That is your path. You can come back to any step.
97. `pathCopy.saveError` That didn’t save. Please try again.

## 5. Setup cards (lib/beginner/cards.ts)

Titles, steps and notes. Checked against the vendors' help pages on the date shown.


**chatgpt_get_started, checked 2026-11-14**

98. title: Get ChatGPT ready on your phone and computer
99. phone step 1: Open the App Store on an iPhone or Google Play on Android and search for OpenAI ChatGPT.
100. phone step 2: Check that the app comes from OpenAI before you download it.
101. phone step 3: Open the app and sign up with an email address you own, so your chats are saved.
102. phone step 4: Type what you need in the message box and send it.
103. computer step 1: Go to chatgpt.com in your browser.
104. computer step 2: Sign up with an email address you own, so your chats are saved.
105. computer step 3: Type what you need in the message box and send it. Select New chat when you want to start fresh.
106. free plan note: The free plan has lower message limits than the paid plans.

**chatgpt_about_you, checked 2026-11-14**

107. title: Save instructions about yourself in ChatGPT
108. phone step 1: Open the sidebar and select your profile icon to open Settings.
109. phone step 2: Select Customize ChatGPT.
110. phone step 3: Make sure Enable customization is turned on.
111. phone step 4: Type your instructions in the Custom Instructions field. They apply to every chat right away.
112. computer step 1: Open Settings from the sidebar.
113. computer step 2: Select Personalization.
114. computer step 3: Make sure Enable customization is turned on.
115. computer step 4: Type your instructions in the Custom Instructions field. They apply to every chat right away.
116. free plan note: The free plan saves up to 1,500 characters of instructions.

**chatgpt_project, checked 2026-11-14**

117. title: Make a ChatGPT project for a task you repeat
118. computer step 1: Select New project in the sidebar.
119. computer step 2: Give the project a name, then pick an icon and a color.
120. computer step 3: Open the menu with three dots and select Project settings.
121. computer step 4: Type your instructions for this task, then select Save.
122. computer step 5: Add your examples to the project by uploading a file or pasting text.
123. computer step 6: Start a new chat inside the project. It uses your instructions and examples, and no other chat does.
124. free plan note: The free plan lets you add fewer files to a project than the paid plans.

**claude_get_started, checked 2026-11-14**

125. title: Get Claude ready on your phone and computer
126. phone step 1: Download the Claude app from the App Store on an iPhone or Google Play on Android.
127. phone step 2: Open the app and create a free account. You need to be 18 or older.
128. phone step 3: Type what you need in the message box and send it.
129. computer step 1: Go to claude.ai in your browser. You can also download Claude Desktop for Mac or Windows.
130. computer step 2: Create a free account. You need to be 18 or older.
131. computer step 3: Type what you need in the message box and click the submit button.
132. free plan note: The free plan has a usage limit that resets every five hours.

**claude_about_you, checked 2026-11-14**

133. title: Save instructions about yourself in Claude
134. computer step 1: Click your initials in the lower left corner.
135. computer step 2: Select Settings, then Your Claude. If you see the older Settings page, select Account.
136. computer step 3: Under Instructions, describe how you work and how you like your answers. On the older page this is called Instructions for Claude.
137. computer step 4: Claude uses these instructions in all your chats.

**claude_project, checked 2026-11-14**

138. title: Make a Claude project for a task you repeat
139. computer step 1: Open the left side panel and click Projects, or go to claude.ai/projects.
140. computer step 2: Click New Project in the upper right corner.
141. computer step 3: Give the project a name and a description. Claude does not read these.
142. computer step 4: Click Set project instructions, write how Claude should handle this task, then click Save instructions.
143. computer step 5: In the project knowledge on the right, click the plus button and add your examples as documents or text.
144. computer step 6: Start a chat inside the project. Claude uses your instructions and examples in every chat there.
145. free plan note: The free plan lets you make up to five projects.

## 6. Workflow recipes (lib/beginner/recipes.ts)

Everything she reads from a recipe: the offer name, the map line, the material list, the test, the approval point, the cost line and every step that is plain text. Steps that point to a card are the card's lines above.


**phone_quick_replies, level 3, checked 2026-11-14**

146. title: Your most common replies, saved on your phone
147. offer: saved once on your phone
148. withPath: Your common replies are saved on your phone, each a few letters away.
149. material: Your most common replies, in your own words, with no names, times or private details in them.
150. material: A short shortcut for each reply, for an iPhone or a Samsung phone.
151. test, try on: The next three messages that need one of these replies.
152. test, good: The reply fits after you change at most a name or a time.
153. test, fix: Make this reply shorter and warmer.
154. test, fix: Add a line that asks them to confirm.
155. test, fix: Rewrite this the way I would say it out loud.
156. approval: You read every reply before you send it. Nothing is sent by itself.
157. cost: Text replacement on an iPhone, text shortcuts on a Samsung phone and the Gboard clipboard are free, and Tally writes the replies for you.
158. iphone + any_chat, phone step 1: Keep the replies and shortcuts Tally wrote for you open, above.
159. iphone + any_chat, phone step 2: In any app where you can type, touch and hold the Emoji button or the Switch Keyboard key.
160. iphone + any_chat, phone step 3: Tap Keyboard Settings, then tap Text Replacement.
161. iphone + any_chat, phone step 4: Tap the Add button.
162. iphone + any_chat, phone step 5: Type one reply in the Phrase field and its shortcut in the Shortcut field.
163. iphone + any_chat, phone step 6: Do the same for each reply on your list.
164. gboard + any_chat note: These steps are for Gboard, Google's keyboard. If your phone uses another keyboard, this workflow has no steps for your phone yet.
165. gboard + any_chat, phone step 1: Copy one reply Tally wrote for you, above.
166. gboard + any_chat, phone step 2: Open an app you can type in and tap a text field.
167. gboard + any_chat, phone step 3: At the top of the keyboard, tap Clipboard.
168. gboard + any_chat, phone step 4: Touch and hold the reply you copied, then tap Pin. Pinned replies stay in the Pinned section.
169. gboard + any_chat, phone step 5: Do the same for each reply on your list.
170. samsung_keyboard note: These steps are for Samsung Keyboard. If your settings look different, Samsung says to try Settings, then Language and input, then On screen keyboard, then Samsung Keyboard, then Smart typing.
171. samsung_keyboard, phone step 1: Keep the replies and shortcuts Tally wrote for you open, above.
172. samsung_keyboard, phone step 2: Go to Settings, then tap General management.
173. samsung_keyboard, phone step 3: Tap Samsung Keyboard settings.
174. samsung_keyboard, phone step 4: Tap Text shortcuts.
175. samsung_keyboard, phone step 5: Tap the plus icon in the top right corner of the screen.
176. samsung_keyboard, phone step 6: Type a shortcut in Shortcut phrase and its reply in Expanded phrase, then tap Add.
177. samsung_keyboard, phone step 7: Do the same for each reply on your list.
178. samsung_keyboard, phone step 8: When you type a shortcut, its reply appears in the bar above the keyboard. Tap it to put it in.

**saved_assistant, level 3, checked 2026-11-14**

179. title: A saved assistant for the writing you repeat
180. offer: with a saved assistant
181. withPath: You hand it the job, and it writes in your voice with your details already in.
182. material: Instructions for your assistant, with your details, your wording and what to avoid.
183. material: Two or three of your own examples, with names and private details taken out.
184. test, try on: The next three times this task comes up.
185. test, good: You change no more than a sentence before you use it.
186. test, fix: This is too long. Keep it to the length of my examples.
187. test, fix: You added something I never said. Use only what I gave you.
188. test, fix: Match the tone of my second example more closely.
189. approval: You read what it wrote and fix anything wrong before you send or post it.
190. cost: The free plans of ChatGPT and Claude are enough. Claude's free plan allows up to five projects.
191. chatgpt, computer step 2: Use the instructions and examples Tally wrote for you when the card asks for them.
192. chatgpt, computer step 3: Each time the task comes up, start a new chat in the project and say what you need.
193. claude, computer step 2: Use the instructions and examples Tally wrote for you when the card asks for them.
194. claude, computer step 3: Each time the task comes up, start a new chat in the project and say what you need.

**say_it_out_loud, level 3, checked 2026-11-14**

195. title: Say it out loud, get the finished text
196. offer: said out loud, finished as text
197. withPath: You say what you need out loud, and the finished text comes back.
198. material: An opening line that tells your chat tool what to turn your words into, with your format and wording.
199. material: A short list of what to say each time, so nothing gets left out.
200. test, try on: The next three times you would have typed this.
201. test, good: The text is ready to send after one read, with every detail you said and nothing you did not.
202. test, fix: You left out a detail I said. Put back everything I mentioned.
203. test, fix: Use my format from the opening line.
204. test, fix: Make it sound less formal, like I wrote it.
205. approval: You read the finished text and check every name, number and price before you send it.
206. cost: Dictation in the Claude app is on every plan, including free, and counts toward your normal limits. OpenAI's page does not say whether ChatGPT's free plan limits dictation.
207. claude note: On a computer this works in the Claude app for Mac with macOS 14 or later, not on Windows.
208. claude, phone step 1: Open the Claude app and start a new chat. Paste the opening line Tally wrote for you.
209. claude, phone step 2: Tap the microphone icon on the right side of the message box. The first time, choose your language.
210. claude, phone step 3: Say what you need, the way you would tell a colleague.
211. claude, phone step 4: Tap the arrow to send. Claude writes the finished text from what you said.
212. claude, computer step 1: Open the Claude app for Mac and turn on the voice shortcut when it offers it.
213. claude, computer step 2: Press Caps Lock, say what you need, then press Caps Lock again.
214. claude, computer step 3: Check the words, then click the arrow to send.
215. chatgpt note: OpenAI's page does not say which devices show the microphone icon.
216. chatgpt, phone step 1: Paste the opening line Tally wrote for you into a new chat.
217. chatgpt, phone step 2: Press the microphone icon and say what you need.
218. chatgpt, phone step 3: Check the words ChatGPT heard and change anything that is wrong, then send it.
219. chatgpt, computer step 1: Paste the opening line Tally wrote for you into a new chat.
220. chatgpt, computer step 2: Press the microphone icon and say what you need.
221. chatgpt, computer step 3: Check the words ChatGPT heard and change anything that is wrong, then send it.

**notes_to_sheet, level 3, checked 2026-11-14**

222. title: Your messy notes, turned into a clean table
223. offer: turned into rows for your sheet
224. withPath: Your notes go in as they are and come out as rows for your sheet.
225. material: Instructions with the columns of your sheet, in order, and how to write each one.
226. material: A rule for what to do with a line that does not fit, so nothing is lost.
227. test, try on: Your next three batches of notes.
228. test, good: Every line lands in the right column, and nothing is left out or made up.
229. test, fix: You missed some lines. Count my notes and include every one.
230. test, fix: Put the dates in this format, the same in every row.
231. test, fix: Leave a cell empty when my notes do not say it. Do not guess.
232. approval: You compare the table with your notes before you import it.
233. cost: The free plans of Claude and ChatGPT work, and Google Sheets is free. Making files uses more of your limit, and ChatGPT's free plan has a lower limit for this.
234. claude + google_sheets, computer step 1: In Claude, open Settings, then Capabilities, and turn on Code execution and file creation. In newer settings it is called Create and edit files.
235. claude + google_sheets, computer step 2: Paste your notes with the instructions Tally wrote for you and ask for a CSV file.
236. claude + google_sheets, computer step 3: Download the file from the conversation.
237. claude + google_sheets, computer step 4: Open your spreadsheet in Google Sheets.
238. claude + google_sheets, computer step 5: At the top, click File, then Import.
239. claude + google_sheets, computer step 6: Choose the file, pick Insert new sheets or Append rows to current sheet, then click Import.
240. chatgpt + google_sheets, computer step 1: Paste your notes with the instructions Tally wrote for you and ask for the result as a table.
241. chatgpt + google_sheets, computer step 2: Click the download button in the top right corner of the table. It saves as a CSV file.
242. chatgpt + google_sheets, computer step 3: Open your spreadsheet in Google Sheets.
243. chatgpt + google_sheets, computer step 4: At the top, click File, then Import.
244. chatgpt + google_sheets, computer step 5: Choose the file, pick Insert new sheets or Append rows to current sheet, then click Import.

**gmail_templates, level 3, checked 2026-11-14**

245. title: Your most common emails, saved as Gmail templates
246. offer: saved once as Gmail templates
247. withPath: Your common emails are saved in Gmail as templates, ready to fill in.
248. material: Your most common emails, in your own words, with a gap in brackets for each detail that changes.
249. material: A clear name for each template, so you find it fast.
250. test, try on: The next three times you would write one of these emails.
251. test, good: You fill in the gaps and send it without rewriting anything else.
252. test, fix: This one is too stiff. Make it sound like me.
253. test, fix: Split this into two templates, one for each case.
254. test, fix: Add a line for the question people always ask next.
255. approval: You fill in every gap and read the email before you send it yourself.
256. cost: Gmail templates are free, and Tally writes the emails for you.
257. gmail + any_chat note: Gmail templates work only on a computer, not in the Gmail phone app.
258. gmail + any_chat, computer step 1: Keep the emails Tally wrote for you open, above.
259. gmail + any_chat, computer step 2: In Gmail, click Settings at the top right, then See all settings.
260. gmail + any_chat, computer step 3: Click Advanced at the top, click Enable next to Templates, then click Save Changes at the bottom.
261. gmail + any_chat, computer step 4: Click Compose and paste one email.
262. gmail + any_chat, computer step 5: At the bottom of the window, click More options, then Templates, then Save draft as template, then Save as new template.
263. gmail + any_chat, computer step 6: To use one, click Compose, then More options, then Templates, and pick it under Insert template.

**gmail_help_me_write, level 4, checked 2026-11-14**

264. title: Reply drafts inside Gmail, from Google's own AI
265. offer: drafted in your inbox
266. withPath: Reply drafts appear inside Gmail, and you check each one before you send.
267. material: Short starting lines for each kind of reply you send, to type into Help me write.
268. material: Notes on your tone, so you know which button to press when a draft sounds off.
269. test, try on: The next three emails that need a real reply.
270. test, good: The draft says what you meant, and you only change a detail or two.
271. test, fix: Shorten this to three sentences.
272. test, fix: Make this friendlier but keep the answer the same.
273. test, fix: Leave out anything I did not say and keep only my answer.
274. approval: Nothing is sent by itself. You read each draft and press Send yourself.
275. cost: Free personal Gmail accounts get Help me write in the US only. Elsewhere it needs a Google AI plan or an eligible Google Workspace plan, and on a work account your company decides.
276. gmail, phone step 1: Open the email in the Gmail app and reply.
277. gmail, phone step 2: Tap Help me write at the top right.
278. gmail, phone step 3: Type what you want to say and tap Create.
279. gmail, phone step 4: Tap the text to change anything, then tap Insert.
280. gmail, phone step 5: Read the draft, then send it yourself.
281. gmail, computer step 1: Open the email in Gmail and click Reply.
282. gmail, computer step 2: Type what you want to say in the prompt bar at the bottom. If you do not see it, click the Help me write icon.
283. gmail, computer step 3: Click Create. To change the tone, click Formalize, Friendly or Shorten.
284. gmail, computer step 4: Read the draft, fix anything that is wrong, then send it yourself.

**gmail_claude_follow_ups, level 4, checked 2026-11-14**

285. title: Follow ups drafted from your Gmail, sent only with your OK
286. offer: drafted from your inbox for your OK
287. withPath: Follow ups are drafted from your Gmail and wait for your OK.
288. material: Instructions that say which emails count as waiting, how long to wait, and how you chase.
289. material: Your follow up wording for a first and a second nudge.
290. test, try on: The next three people who have not answered you.
291. test, good: Each draft goes to the right person, about the right email, in your tone.
292. test, fix: This person already answered. Check the whole thread before you draft.
293. test, fix: Make the follow up shorter and do not apologize.
294. test, fix: Wait until a week has passed before you draft a follow up.
295. approval: Your chat tool asks before it sends anything. You read each draft and approve or send it yourself.
296. cost: Claude's page says the Gmail connector is for all users but does not say whether the free plan is enough. In ChatGPT, sending from the chat needs Plus or a higher plan.
297. claude + gmail note: On a Claude Team or Enterprise plan, an owner must turn on the connector first, and a Google Workspace admin may need to allow Claude.
298. claude + gmail, computer step 1: In Claude, open Customize, then Connectors, and click the plus button.
299. claude + gmail, computer step 2: Click Gmail, read what it can do, then click Connect.
300. claude + gmail, computer step 3: Sign in with Google and follow the prompts.
301. claude + gmail, computer step 4: In a new chat, click the plus button, point to Connectors and turn on Gmail for that chat.
302. claude + gmail, computer step 5: Paste the instructions Tally wrote for you. Claude finds the emails that need a follow up and drafts each one.
303. claude + gmail, computer step 6: Claude asks for your approval before it sends, replies or forwards anything. Read each draft first.
304. chatgpt + gmail note: Sending from ChatGPT works on the web, on Plus and higher plans.
305. chatgpt + gmail, computer step 1: In ChatGPT on the web, open Settings, then Plugins, and select Gmail. Some versions call this Apps.
306. chatgpt + gmail, computer step 2: Select Install plugin if you see it, then Connect, and sign in with Google.
307. chatgpt + gmail, computer step 3: Review the permissions Google asks for and finish.
308. chatgpt + gmail, computer step 4: In Settings, then Plugins, then Permissions, choose Always ask.
309. chatgpt + gmail, computer step 5: In a new chat, type @ and pick Gmail, then paste the instructions Tally wrote for you. ChatGPT drafts each follow up in the chat.
310. chatgpt + gmail, computer step 6: Read each draft. You choose whether to send it.

**weekly_no_reply_list, level 5, checked 2026-11-14**

311. title: A weekly list of who has not answered you
312. offer: listed for you every week
313. withPath: Once a week you get a list of who still owes you an answer.
314. material: Instructions that say which emails count as waiting for an answer, how many days to wait, and what to leave off the list.
315. material: The format of your list, with the person, the subject and how long it has been.
316. test, try on: The first three weekly lists.
317. test, good: Every name on the list really owes you an answer, and nobody who does is missing.
318. test, fix: This person already answered. Check the whole thread before you list it.
319. test, fix: Leave newsletters and automatic emails off the list.
320. test, fix: Only list emails I sent more than five days ago.
321. approval: The task only reads your email and gives you a list. Nothing is sent, and you decide who to chase. If a task ever tries to send, it stops and waits for you.
322. cost: ChatGPT's free plan allows three scheduled tasks, but OpenAI's pages do not say whether Gmail works on the free plan. Scheduled tasks in Claude need a paid plan.
323. chatgpt + gmail note: For a phone notification, make the task in the ChatGPT phone app instead.
324. chatgpt + gmail, computer step 1: In ChatGPT on the web, open Settings, then Plugins, and connect Gmail. Some versions call this Apps.
325. chatgpt + gmail, computer step 2: In Settings, then Plugins, then Permissions, choose Always ask.
326. chatgpt + gmail, computer step 3: In a new chat, paste the instructions Tally wrote for you. They ask ChatGPT to check your Gmail once a week.
327. chatgpt + gmail, computer step 4: ChatGPT shows the schedule. Check the day and time.
328. chatgpt + gmail, computer step 5: In Settings, then Notifications, pick Push, Email or both, so you see the list when it is ready.
329. chatgpt + gmail, computer step 6: To change or stop it, open Scheduled.
330. claude + gmail note: Scheduled tasks in Claude need a paid plan, Pro or higher. These steps are for Claude Cowork.
331. claude + gmail, computer step 1: In Claude, open Customize, then Connectors, and connect Gmail.
332. claude + gmail, computer step 2: Click Scheduled in the left sidebar, then New task, then Set up manually.
333. claude + gmail, computer step 3: Enter a name and paste the instructions Tally wrote for you.
334. claude + gmail, computer step 4: Set the approval mode to Manually approve and the frequency to Weekly.
335. claude + gmail, computer step 5: Click Save. The task runs even when your computer is asleep.

## 7. The beginner landing page (the ad links only, not the home page)

These sections show on /?angle=new_to_ai, own_job and first_try today. The Phase 7 promise list says which of them the path cannot keep yet.

336. `beginnerSteps[0]` Tell us your job, the apps you use and where you are with AI.
337. `beginnerSteps[1]` See where AI fits in your week, with the first task done for you, free.
338. `beginnerSteps[2]` Get your plan. The tools to use, the skills to learn, and how to do each one.
339. `beginnerStepsAfter` Not a list of prompts. A path built around your job and your level.
340. `beginnerPaths.title` Your path starts where you are
341. `beginnerPaths.lead` Tally works out what’s worth using for your job, then walks you through it. No research, no trial and error.
342. `beginnerPaths.paths[0].label` If you’re just starting
343. `beginnerPaths.paths[0].steps[0]` Open your first AI tool. We show you where to click.
344. `beginnerPaths.paths[0].steps[1]` One task from your job to try today.
345. `beginnerPaths.paths[0].steps[2]` Exactly what to type, and why.
346. `beginnerPaths.paths[0].steps[3]` What a good answer looks like, and how to fix a bad one.
347. `beginnerPaths.paths[0].steps[4]` The next skill to learn, and where to find it.
348. `beginnerPaths.paths[1].label` If you already use AI
349. `beginnerPaths.paths[1].steps[0]` We find where your hours go. Email, reports, content.
350. `beginnerPaths.paths[1].steps[1]` The right tool for it, not just a better prompt.
351. `beginnerPaths.paths[1].steps[2]` How to set it up, step by step.
352. `beginnerPaths.paths[1].steps[3]` How to connect it to the apps you already use.
353. `beginnerPaths.paths[1].steps[4]` Getting it running on your real work.
354. `beginnerPaths.after` As you get better, your path moves on with you.
355. `beginnerPage.which.shots.blank.title` New chat
356. `beginnerPage.which.shots.blank.field` Ask anything
357. `beginnerPage.which.shots.small.title` Your chats
358. `beginnerPage.which.shots.small.rows[0]` Chicken thigh recipe
359. `beginnerPage.which.shots.small.rows[1]` Reword email to landlord
360. `beginnerPage.which.shots.small.rows[2]` Another word for “also”
361. `beginnerPage.jobs.title` What it could take off your plate
362. `beginnerPage.jobs.lead` Every job is made of the same few kinds of work. Pick the one you’d most like off your plate.
363. `beginnerPage.jobs.label` Kinds of work
364. `beginnerPage.jobs.list[0].id` email
365. `beginnerPage.jobs.list[0].name` Email and messages
366. `beginnerPage.jobs.list[0].items[0].text` Reply drafts that sound like you
367. `beginnerPage.jobs.list[0].items[0].kind` Skill
368. `beginnerPage.jobs.list[0].items[1].text` Your inbox sorted by what needs you
369. `beginnerPage.jobs.list[0].items[1].kind` Automation
370. `beginnerPage.jobs.list[0].items[2].text` A nudge for anything left unanswered
371. `beginnerPage.jobs.list[0].items[2].kind` Automation
372. `beginnerPage.jobs.list[0].items[3].text` Saved answers to the questions you get every week
373. `beginnerPage.jobs.list[0].items[3].kind` Tool
374. `beginnerPage.jobs.list[1].id` planning
375. `beginnerPage.jobs.list[1].name` Scheduling and planning
376. `beginnerPage.jobs.list[1].items[0].text` A time found without the back and forth
377. `beginnerPage.jobs.list[1].items[0].kind` Tool
378. `beginnerPage.jobs.list[1].items[1].text` Your week planned from your calendar
379. `beginnerPage.jobs.list[1].items[1].kind` Workflow
380. `beginnerPage.jobs.list[1].items[2].text` Reminders written and lined up to send
381. `beginnerPage.jobs.list[1].items[2].kind` Automation
382. `beginnerPage.jobs.list[1].items[3].text` A checklist for anything you run twice
383. `beginnerPage.jobs.list[1].items[3].kind` Skill
384. `beginnerPage.jobs.list[2].id` reports
385. `beginnerPage.jobs.list[2].name` Reports and numbers
386. `beginnerPage.jobs.list[2].items[0].text` A weekly summary straight from your spreadsheet
387. `beginnerPage.jobs.list[2].items[0].kind` Automation
388. `beginnerPage.jobs.list[2].items[1].text` Raw numbers turned into charts and plain words
389. `beginnerPage.jobs.list[2].items[1].kind` Tool
390. `beginnerPage.jobs.list[2].items[2].text` One report you never rebuild from scratch
391. `beginnerPage.jobs.list[2].items[2].kind` Skill
392. `beginnerPage.jobs.list[2].items[3].text` What changed since last week, pointed out
393. `beginnerPage.jobs.list[2].items[3].kind` Workflow
394. `beginnerPage.jobs.list[3].id` content
395. `beginnerPage.jobs.list[3].name` Posts and content
396. `beginnerPage.jobs.list[3].items[0].text` A month of posts planned in one sitting
397. `beginnerPage.jobs.list[3].items[0].kind` Workflow
398. `beginnerPage.jobs.list[3].items[1].text` Captions in your own voice
399. `beginnerPage.jobs.list[3].items[1].kind` Skill
400. `beginnerPage.jobs.list[3].items[2].text` One idea turned into every format you post
401. `beginnerPage.jobs.list[3].items[2].kind` Workflow
402. `beginnerPage.jobs.list[3].items[3].text` Images and layouts started for you
403. `beginnerPage.jobs.list[3].items[3].kind` Tool
404. `beginnerPage.jobs.list[4].id` admin
405. `beginnerPage.jobs.list[4].name` Paperwork and admin
406. `beginnerPage.jobs.list[4].items[0].text` Forms filled from what you already have
407. `beginnerPage.jobs.list[4].items[0].kind` Automation
408. `beginnerPage.jobs.list[4].items[1].text` Quotes and invoices from a few details
409. `beginnerPage.jobs.list[4].items[1].kind` Workflow
410. `beginnerPage.jobs.list[4].items[2].text` How tos written once, not explained again
411. `beginnerPage.jobs.list[4].items[2].kind` Skill
412. `beginnerPage.jobs.list[4].items[3].text` Long documents searched and summed up
413. `beginnerPage.jobs.list[4].items[3].kind` Tool
414. `beginnerPage.jobs.list[5].id` meetings
415. `beginnerPage.jobs.list[5].name` Meetings and notes
416. `beginnerPage.jobs.list[5].items[0].text` Notes taken for you
417. `beginnerPage.jobs.list[5].items[0].kind` Tool
418. `beginnerPage.jobs.list[5].items[1].text` A recap and next steps sent afterward
419. `beginnerPage.jobs.list[5].items[1].kind` Automation
420. `beginnerPage.jobs.list[5].items[2].text` An agenda from a rough list
421. `beginnerPage.jobs.list[5].items[2].kind` Skill
422. `beginnerPage.jobs.list[5].items[3].text` Prep pulled from your past notes
423. `beginnerPage.jobs.list[5].items[3].kind` Workflow
424. `beginnerPage.jobs.after` Your plan is built from your own job and your own week, not from a list like this.
425. `beginnerPage.changes.title` Your work, before and after
426. `beginnerPage.changes.lead` Same job. Same hours in the day. Less of it spent on the work you hate.
427. `beginnerPage.changes.before` Today
428. `beginnerPage.changes.after` With Tally
429. `beginnerPage.changes.days[0].what` The same task, again
430. `beginnerPage.changes.days[0].before` Starting from scratch every time
431. `beginnerPage.changes.days[0].after` Set up once, then it takes minutes
432. `beginnerPage.changes.days[0].kind` Automation
433. `beginnerPage.changes.days[1].what` Writing
434. `beginnerPage.changes.days[1].before` Every email, post and report typed by hand
435. `beginnerPage.changes.days[1].after` A first draft waiting for you to check
436. `beginnerPage.changes.days[1].kind` Skill
437. `beginnerPage.changes.days[2].what` Finding the right tool
438. `beginnerPage.changes.days[2].before` Ten tabs open, still not sure which one
439. `beginnerPage.changes.days[2].after` The one that fits your work, picked for you
440. `beginnerPage.changes.days[2].kind` Tool
441. `beginnerPage.changes.days[3].what` Getting it to work
442. `beginnerPage.changes.days[3].before` Trying it once and giving up
443. `beginnerPage.changes.days[3].after` Step by step, until it runs
444. `beginnerPage.changes.days[3].kind` How to
445. `beginnerPage.changes.days[4].what` The end of the day
446. `beginnerPage.changes.days[4].before` Work that follows you home
447. `beginnerPage.changes.days[4].after` Done before you leave
448. `beginnerPage.changes.close[0]` The busywork takes minutes.
449. `beginnerPage.changes.close[1]` Your evening is yours.
450. `beginnerPage.changes.close[2]` You become the one who knows how.
451. `beginnerFaqs[6].a` ChatGPT answers what you ask. Tally works out what’s worth asking in your job, which tools fit it, and walks you through setting them up.

**The pictures in How it works (beginnerSample)**

452. `beginnerSample.question` What’s your job, in your own words?
453. `beginnerSample.answer` Receptionist at a dental office. Phones, scheduling, insurance…
454. `beginnerSample.winTitle` Your first AI win
455. `beginnerSample.winIntro` You said reminder texts eat your time. Here is one.
456. `beginnerSample.winDraft` Hi [first name], this is a reminder of your cleaning on [day] at [time]. Reply C to confirm.
457. `beginnerSample.also` Also in your plan
458. `beginnerSample.ideas[0]` A script for no show calls
459. `beginnerSample.ideas[1]` Facebook posts for the office
460. `beginnerSample.tool` Claude
461. `beginnerSample.promptLabel` Paste this
462. `beginnerSample.prompt` I’m a receptionist at a dental office. Write a reminder text for an appointment on [day and time].
463. `beginnerSample.daysLabel` Your seven days
464. `beginnerSample.profileTitle` Your profile
465. `beginnerSample.profileProgress` 5 of 7
466. `beginnerSample.profile[0].label` Role
467. `beginnerSample.profile[0].value` Event coordinator, restaurant group
468. `beginnerSample.profile[1].label` Apps
469. `beginnerSample.profile[1].chips[0]` Gmail
470. `beginnerSample.profile[1].chips[1]` Google Sheets
471. `beginnerSample.profile[1].chips[2]` Slack
472. `beginnerSample.profile[2].label` With AI
473. `beginnerSample.profile[2].value` Uses it, wants more from it
474. `beginnerSample.profile[3].label` Biggest time sink
475. `beginnerSample.profile[3].value` Vendor emails
476. `beginnerSample.profile[4].label` Over and over
477. `beginnerSample.profile[4].chips[0]` Run of show
478. `beginnerSample.profile[4].chips[1]` Headcounts
479. `beginnerSample.profile[4].chips[2]` Recaps
480. `beginnerSample.profileNext` Which would save you the most time?
481. `beginnerSample.mapTitle` Where AI fits in your week
482. `beginnerSample.mapRole` Event coordinator · 5 found
483. `beginnerSample.map[0].task` Vendor emails
484. `beginnerSample.map[0].fix` Reply drafts inside Gmail
485. `beginnerSample.map[0].kind` Tool
486. `beginnerSample.map[1].task` Run of show
487. `beginnerSample.map[1].fix` Built from your sheet
488. `beginnerSample.map[1].kind` Workflow
489. `beginnerSample.map[2].task` Weekly headcounts
490. `beginnerSample.map[2].fix` Summary sent every Monday
491. `beginnerSample.map[2].kind` Automation
492. `beginnerSample.map[3].task` Client recaps
493. `beginnerSample.map[3].fix` Notes to recap in one step
494. `beginnerSample.map[3].kind` Skill
495. `beginnerSample.map[4].task` Banquet orders
496. `beginnerSample.map[4].fix` Filled in from the client’s email
497. `beginnerSample.map[4].kind` Automation
498. `beginnerSample.mapFree` First one done for you, free
499. `beginnerSample.pathTitle` Workflow 1 of 4
500. `beginnerSample.pathName` Vendor email replies
501. `beginnerSample.pathDoneStep` Connect Claude to Gmail
502. `beginnerSample.pathNow.title` Create a project for your vendors
503. `beginnerSample.pathNow.lines[0]` In Claude, open Projects and choose New project.
504. `beginnerSample.pathNow.lines[1]` Name it Vendor replies.
505. `beginnerSample.pathNow.lines[2]` Paste in your tone notes and vendor list. We wrote both for you.
506. `beginnerSample.pathNow.copy` Copy tone notes
507. `beginnerSample.pathNow.next` Done, next step
508. `beginnerSample.pathLater[0]` Save the reply as a reusable skill
509. `beginnerSample.pathLater[1]` Test it on five real emails
510. `beginnerSample.pathLater[2]` Turn it on for your inbox

## 8. Written but not on the beginner page today

Kept in the code, shown nowhere on the beginner page now. Approve only if you want them back.

511. `beginnerProblem.before.label` What most people type
512. `beginnerProblem.after.label` What your plan gives you to paste
513. `beginnerProblem.before.verdict` Sounds like an ad
514. `beginnerProblem.after.verdict` Sounds like you
515. `beginnerFeelings.blank.title` New chat
516. `beginnerFeelings.blank.field` Ask anything
517. `beginnerFeelings.unsure.before` Rewrite this email to Mrs. 
518. `beginnerFeelings.unsure.after`  about her overdue balance
519. `beginnerFeelings.unsure.doubt` Is it OK to paste this?
520. `beginnerFeelings.course.title` AI for beginners
521. `beginnerFeelings.course.length` 6 weeks
522. `beginnerFeelings.course.modules[0]` 1. What is a language model?
523. `beginnerFeelings.course.modules[1]` 2. Prompt frameworks
524. `beginnerFeelings.course.modules[2]` 3. Tokens and context

## 9. The old plan page

Only for the few plans bought before Phase 6. New buyers get the path in part 4.

525. `beginnerPlanCopy.title` Your plan
526. `beginnerPlanCopy.toolLabel` Start here
527. `beginnerPlanCopy.toolSteps` How to open it
528. `beginnerPlanCopy.restricted` Your company restricts AI, so treat this as practice on your own phone or computer, with nothing from work in it. The message under At work asks what’s allowed.
529. `beginnerPlanCopy.winLabel` About 15 minutes
530. `beginnerPlanCopy.promptLabel` Paste this
531. `beginnerPlanCopy.exampleLabel` A good answer looks like this
532. `beginnerPlanCopy.fixesLabel` If it’s off, send one of these
533. `beginnerPlanCopy.done` I did it
534. `beginnerPlanCopy.undone` Done
535. `beginnerPlanCopy.ideasWork` For your job
536. `beginnerPlanCopy.ideasLife` From daily life
537. `beginnerPlanCopy.ideaPrompt` Ready prompt
538. `beginnerPlanCopy.marksNote.employer` Safe today needs nothing private. Check first waits until you know what your company allows.
539. `beginnerPlanCopy.marksNote.self` Safe today needs nothing private. Your safe use rules say what to leave out of the rest.
540. `beginnerPlanCopy.profileLabel` Your work profile
541. `beginnerPlanCopy.profileLead` Paste it at the start of a chat, so answers sound like you.
542. `beginnerPlanCopy.daysProgress(…)` 3 of 7 done
543. `beginnerPlanCopy.daysNote` Your ticks are kept on this phone or computer.
544. `beginnerPlanCopy.atWork.title` At work
545. `beginnerPlanCopy.atWork.text` For when you’re ready to use AI on your real work, openly.
546. `beginnerPlanCopy.askLabel` Ask what’s approved
547. `beginnerPlanCopy.askLead` Send this to IT or your manager.
548. `beginnerPlanCopy.talkLabel` Talking about AI with your manager
549. `markLabels.safe_today` Safe today
550. `markLabels.check_first` Check first
551. `toolSite.claude.name` Claude
552. `toolSite.claude.steps[0]` Open claude.ai in your browser, or get the Claude app on your phone.
553. `toolSite.claude.steps[1]` Sign up with your email. The free version is enough.
554. `toolSite.claude.steps[2]` Type or paste into the message box and send it, like a text.
555. `toolSite.chatgpt.name` ChatGPT
556. `toolSite.chatgpt.steps[0]` Open chatgpt.com in your browser, or get the ChatGPT app on your phone.
557. `toolSite.chatgpt.steps[1]` Sign up with your email. The free version is enough.
558. `toolSite.chatgpt.steps[2]` Type or paste into the message box and send it, like a text.
559. `toolSite.gemini.name` Gemini
560. `toolSite.gemini.steps[0]` Open gemini.google.com in your browser, or get the Gemini app on your phone.
561. `toolSite.gemini.steps[1]` Sign in with your Google account. The free version is enough.
562. `toolSite.gemini.steps[2]` Type or paste into the message box and send it, like a text.
563. `toolSite.copilot.name` Copilot
564. `toolSite.copilot.steps[0]` Open copilot.microsoft.com in your browser, or get the Copilot app on your phone.
565. `toolSite.copilot.steps[1]` Sign in with your Microsoft account. The free version is enough.
566. `toolSite.copilot.steps[2]` Type or paste into the message box and send it, like a text.
567. `sevenDays[0].title` Your first win
568. `sevenDays[0].text` The prompt is above. Paste it, send it and read what comes back.
569. `sevenDays[1].title` Do it again with a real one from today
570. `sevenDays[1].text` Same prompt, with today’s details in the brackets. Use what it gives you.
571. `sevenDays[2].title` Teach it who you are
572. `sevenDays[2].text` Paste your work profile at the start of a chat, so answers sound like you.
573. `sevenDays[3].title` A second task from your ideas
574. `sevenDays[3].text` Try “[idea]”.
575. `sevenDays[4].title` One from daily life
576. `sevenDays[4].text` Try “[life]”. It doesn’t have to be about work.
577. `sevenDays[5].title` Fix a bad answer
578. `sevenDays[5].text` When an answer misses, don’t start over. Tell it what’s wrong and ask again.
579. `sevenDays[6].title` Pick the three you’ll keep
580. `sevenDays[6].text` Look back over the week and keep the three that helped most.
581. `planToolsCopy.title` Your tools
582. `planToolsCopy.tryThis` Try this week
583. `planToolsCopy.withChat` With your chat tool

583 lines in all.
