// Written by scripts/phase-10-runs.ts from the Phase 10 proof runs: each person's answers and her path with both
// workflows written live. Used by /plan/preview?sample=v4_office (also v4_property and v4_hr). Do not edit by hand.
import type { PathInput } from "./path-writer";
import type { PathV4 } from "./workflow";

export const pathV4Samples: Record<string, { input: PathInput; path: PathV4 }> = {
  "v4_office": {
    "input": {
      "job": "I am an office coordinator for an office of about 70 people. I prepare and organize lunch for everyone. I order drinks, restock the fridges and keep the office clean and organized. I take care of the plants and general maintenance. I handle special orders and preparations for company events. I coordinate suppliers and make sure we have what we need. I am the person everyone comes to when something is missing or needs fixing. If the printer runs out of ink I find a replacement, and if we have none I order more.",
      "qas": [
        {
          "id": "level",
          "title": "Where are you with AI?",
          "picked": [
            "Never used it"
          ],
          "text": null,
          "shown": [
            "Never used it",
            "Tried it a few times",
            "Use it some weeks",
            "Use it most days"
          ]
        },
        {
          "id": "repeats",
          "title": "What do you do over and over, every day or every week?",
          "picked": [
            "Ordering lunch",
            "Restocking the fridges",
            "Office cleaning",
            "Supplier coordination",
            "Office supplies",
            "Maintenance requests"
          ],
          "text": null,
          "shown": [
            "Ordering lunch",
            "Restocking the fridges",
            "Office cleaning",
            "Event preparations",
            "Supplier coordination",
            "Office supplies",
            "Maintenance requests",
            "Visitor scheduling"
          ]
        },
        {
          "id": "most",
          "title": "Which would save you the most time if it got easier?",
          "picked": [
            "Ordering lunch",
            "Restocking the fridges"
          ],
          "text": null,
          "shown": [
            "Ordering lunch",
            "Restocking the fridges",
            "Office cleaning",
            "Supplier coordination",
            "Office supplies",
            "Maintenance requests"
          ]
        },
        {
          "id": "often",
          "title": "How often do you do this?",
          "picked": [
            "About once a day"
          ],
          "text": null,
          "shown": [
            "Many times a day",
            "About once a day",
            "A few times a week",
            "Once a week or less"
          ]
        },
        {
          "id": "where",
          "title": "Where does your work happen?",
          "picked": [
            "Outlook",
            "Excel",
            "Microsoft Teams",
            "Text messages",
            "Paper",
            "In person"
          ],
          "text": null,
          "shown": [
            "Outlook",
            "Excel",
            "Microsoft Teams",
            "Google Drive",
            "Slack",
            "Amazon Business",
            "Uber Eats",
            "Trello",
            "Text messages",
            "Gmail",
            "Google Sheets",
            "Instagram",
            "A work system",
            "Paper",
            "In person"
          ]
        },
        {
          "id": "device",
          "title": "Do you work on a phone, a computer or both?",
          "picked": [
            "Both"
          ],
          "text": null,
          "shown": [
            "Phone only",
            "Computer only",
            "Both"
          ]
        },
        {
          "id": "can_use",
          "title": "Can you use AI for your work?",
          "picked": [
            "Not sure"
          ],
          "text": null,
          "shown": [
            "Yes",
            "Not sure",
            "No, it’s restricted",
            "I work for myself"
          ]
        },
        {
          "id": "connect",
          "title": "Would your company let you link your work email to an AI tool?",
          "picked": [
            "Not sure"
          ],
          "text": null,
          "shown": [
            "Yes",
            "No",
            "Not sure"
          ]
        }
      ],
      "mostWanted": [
        "Ordering lunch",
        "Restocking the fridges"
      ],
      "role": "You’re the office coordinator for about 70 people, keeping the office fed, stocked, clean and running.",
      "worksFor": "employer",
      "experience": "not_yet",
      "aiTools": [
        "none_yet"
      ],
      "aiPolicy": "no_idea",
      "map": [
        {
          "task": "Ordering lunch",
          "phrase": "lunch orders",
          "thing": "lunch order",
          "today": "You prepare and organize lunch for everyone, about once a day.",
          "withPath": "One lunch order gathered from everyone’s choices, ready for you to place.",
          "ai": true,
          "private": false,
          "kind": null,
          "patterns": [
            4,
            6
          ],
          "level": 3,
          "waits": false,
          "recipe": null,
          "held": null,
          "askFirst": false,
          "workflow": "pattern_4",
          "stays": null
        },
        {
          "task": "Restocking the fridges",
          "phrase": "fridge restocks",
          "thing": "fridge restock",
          "today": "You keep the office fridges stocked with drinks yourself.",
          "withPath": "One standard list of fridge items, ready whenever the fridges run low.",
          "ai": true,
          "private": false,
          "kind": null,
          "patterns": [
            3
          ],
          "level": 3,
          "waits": false,
          "recipe": null,
          "held": null,
          "askFirst": false,
          "workflow": "pattern_3",
          "stays": null
        },
        {
          "task": "Office cleaning",
          "phrase": null,
          "thing": "office cleaning",
          "today": "You keep the office clean and organized as part of your week.",
          "withPath": "Cleaning jobs laid out on a routine so nothing gets missed.",
          "ai": true,
          "private": false,
          "kind": null,
          "patterns": [
            7
          ],
          "level": 3,
          "waits": false,
          "recipe": null,
          "held": null,
          "askFirst": false,
          "workflow": "pattern_7",
          "stays": null
        },
        {
          "task": "Supplier coordination",
          "phrase": "supplier messages",
          "thing": "supplier",
          "today": "You coordinate suppliers so the office has what it needs.",
          "withPath": "Your usual supplier replies ready to reuse.",
          "ai": true,
          "private": false,
          "kind": null,
          "patterns": [
            1
          ],
          "level": 3,
          "waits": false,
          "recipe": null,
          "held": null,
          "askFirst": false,
          "workflow": "pattern_1",
          "stays": null
        },
        {
          "task": "Office supplies",
          "phrase": null,
          "thing": "office supplies",
          "today": "You find replacements and order more when the office runs out.",
          "withPath": "One list of office supplies with usual amounts, ready to reorder.",
          "ai": true,
          "private": false,
          "kind": null,
          "patterns": [
            3
          ],
          "level": 3,
          "waits": false,
          "recipe": null,
          "held": null,
          "askFirst": false,
          "workflow": "pattern_3",
          "stays": null
        },
        {
          "task": "Maintenance requests",
          "phrase": "maintenance requests",
          "thing": "maintenance request",
          "today": "People come to you one by one when something is missing or needs fixing.",
          "withPath": "Requests collected in one place instead of arriving one at a time.",
          "ai": true,
          "private": false,
          "kind": null,
          "patterns": [
            6
          ],
          "level": 3,
          "waits": false,
          "recipe": null,
          "held": null,
          "askFirst": false,
          "workflow": "pattern_6",
          "stays": null
        }
      ],
      "top": "Ordering lunch",
      "track": "starter",
      "tool": "claude",
      "device": "both",
      "apps": [
        "any_chat",
        "claude",
        "iphone",
        "gboard",
        "samsung_keyboard"
      ],
      "firstStep": null
    },
    "path": {
      "version": 4,
      "role": "You’re the office coordinator for about 70 people, keeping the office fed, stocked, clean and running.",
      "track": "starter",
      "tool": "claude",
      "worksFor": "employer",
      "policy": "no_idea",
      "device": "both",
      "places": [
        "Outlook",
        "Excel",
        "Microsoft Teams",
        "Text messages",
        "Paper",
        "In person"
      ],
      "apps": [
        "any_chat",
        "claude",
        "iphone",
        "gboard",
        "samsung_keyboard"
      ],
      "map": [
        {
          "task": "Ordering lunch",
          "phrase": "lunch orders",
          "thing": "lunch order",
          "today": "You prepare and organize lunch for everyone, about once a day.",
          "withPath": "One lunch order gathered from everyone’s choices, ready for you to place.",
          "ai": true,
          "private": false,
          "kind": null,
          "patterns": [
            4,
            6
          ],
          "level": 3,
          "waits": false,
          "recipe": null,
          "held": null,
          "askFirst": false,
          "workflow": "pattern_4",
          "stays": null
        },
        {
          "task": "Restocking the fridges",
          "phrase": "fridge restocks",
          "thing": "fridge restock",
          "today": "You keep the office fridges stocked with drinks yourself.",
          "withPath": "One standard list of fridge items, ready whenever the fridges run low.",
          "ai": true,
          "private": false,
          "kind": null,
          "patterns": [
            3
          ],
          "level": 3,
          "waits": false,
          "recipe": null,
          "held": null,
          "askFirst": false,
          "workflow": "pattern_3",
          "stays": null
        },
        {
          "task": "Office cleaning",
          "phrase": null,
          "thing": "office cleaning",
          "today": "You keep the office clean and organized as part of your week.",
          "withPath": "Cleaning jobs laid out on a routine so nothing gets missed.",
          "ai": true,
          "private": false,
          "kind": null,
          "patterns": [
            7
          ],
          "level": 3,
          "waits": false,
          "recipe": null,
          "held": null,
          "askFirst": false,
          "workflow": "pattern_7",
          "stays": null
        },
        {
          "task": "Supplier coordination",
          "phrase": "supplier messages",
          "thing": "supplier",
          "today": "You coordinate suppliers so the office has what it needs.",
          "withPath": "Your usual supplier replies ready to reuse.",
          "ai": true,
          "private": false,
          "kind": null,
          "patterns": [
            1
          ],
          "level": 3,
          "waits": false,
          "recipe": null,
          "held": null,
          "askFirst": false,
          "workflow": "pattern_1",
          "stays": null
        },
        {
          "task": "Office supplies",
          "phrase": null,
          "thing": "office supplies",
          "today": "You find replacements and order more when the office runs out.",
          "withPath": "One list of office supplies with usual amounts, ready to reorder.",
          "ai": true,
          "private": false,
          "kind": null,
          "patterns": [
            3
          ],
          "level": 3,
          "waits": false,
          "recipe": null,
          "held": null,
          "askFirst": false,
          "workflow": "pattern_3",
          "stays": null
        },
        {
          "task": "Maintenance requests",
          "phrase": "maintenance requests",
          "thing": "maintenance request",
          "today": "People come to you one by one when something is missing or needs fixing.",
          "withPath": "Requests collected in one place instead of arriving one at a time.",
          "ai": true,
          "private": false,
          "kind": null,
          "patterns": [
            6
          ],
          "level": 3,
          "waits": false,
          "recipe": null,
          "held": null,
          "askFirst": false,
          "workflow": "pattern_6",
          "stays": null
        }
      ],
      "confirmed": true,
      "slots": [
        {
          "id": "task_1",
          "task": "Ordering lunch",
          "answers": [
            {
              "id": "reach",
              "picked": [
                "email",
                "paper",
                "person"
              ],
              "text": null
            },
            {
              "id": "combined",
              "picked": [
                "yes"
              ],
              "text": null
            },
            {
              "id": "place",
              "picked": [
                "email"
              ],
              "text": null
            },
            {
              "id": "often",
              "picked": [
                "weekly"
              ],
              "text": null
            },
            {
              "id": "example",
              "picked": [],
              "text": "This week: lasagna, chicken salad, tomato soup. Vegetarian or gluten free on request."
            }
          ],
          "design": {
            "read": "From now on, people enter their own lunch choice in one form, so you no longer collect orders by email, on paper or in person. The form's results page counts each choice for you, and you send the caterer one email with those counts. Each week you clear the old answers and send the same link again.",
            "material": [
              {
                "label": "Your lunch order form",
                "items": [
                  "Title: Lunch order for this week",
                  "Your name\nTheir own words",
                  "Your lunch choice\nLasagna\nLasagna, vegetarian\nLasagna, gluten free\nChicken salad\nChicken salad, vegetarian\nChicken salad, gluten free\nTomato soup\nTomato soup, vegetarian\nTomato soup, gluten free",
                  "Anything else I should know?\nTheir own words"
                ]
              },
              {
                "label": "Your message with the link",
                "items": [
                  "Hi everyone, it's time to pick your lunch for this week. Please fill in this short form by [day and time]: [link]. If you need vegetarian or gluten free, choose it in the form. Thank you!"
                ]
              },
              {
                "label": "Your lunch order email",
                "items": [
                  "Subject: Lunch order for [day]",
                  "Hello,\n\nI would like to place our lunch order for [day], to be delivered at [time].\n\nLasagna: [count]\nLasagna, vegetarian: [count]\nLasagna, gluten free: [count]\nChicken salad: [count]\nChicken salad, vegetarian: [count]\nChicken salad, gluten free: [count]\nTomato soup: [count]\nTomato soup, vegetarian: [count]\nTomato soup, gluten free: [count]\n\nTotal: [total count]\nNotes: [notes]\n\nPlease confirm that you received this order.\n\nThank you,\n[Your name]"
                ]
              }
            ],
            "steps": [
              {
                "use": "ms_forms_create",
                "say": "Create the form. Tally has written the questions for you.",
                "piece": 1,
                "when": "once"
              },
              {
                "use": "ms_forms_share",
                "say": "Send the form link to everyone in your message.",
                "piece": 2,
                "when": "each_time"
              },
              {
                "use": "ms_forms_results",
                "say": "On order day, open the answers in Forms. The count for each choice is already there.",
                "piece": null,
                "when": "each_time"
              },
              {
                "use": "outlook_saved_email",
                "say": "Save the order email once, so each week you only fill in the blanks.",
                "piece": 3,
                "when": "once"
              },
              {
                "use": "goal",
                "say": "Open your saved email, fill in the counts from the results page, read it through and send it to the caterer.",
                "piece": 3,
                "when": "each_time"
              },
              {
                "use": "ms_forms_clear",
                "say": "After you order, clear last week's answers so the form is ready for the next round.",
                "piece": null,
                "when": "each_time"
              }
            ],
            "tryOn": "This week's lunch order.",
            "good": "Everyone answers in the form, the counts on the results page add up to the number of people ordering, and the caterer confirms the order you sent.",
            "approval": "Before you send the email, check that the counts match the results page, the day and time are right, and any vegetarian or gluten free orders are included.",
            "usesAi": false,
            "suite": "microsoft",
            "phone": null
          },
          "solved": false,
          "tries": 1
        },
        {
          "id": "task_2",
          "task": "Restocking the fridges",
          "answers": [
            {
              "id": "low",
              "picked": [
                "look"
              ],
              "text": null
            },
            {
              "id": "items",
              "picked": [
                "many"
              ],
              "text": null
            },
            {
              "id": "reorder",
              "picked": [
                "email"
              ],
              "text": null
            },
            {
              "id": "often",
              "picked": [
                "daily"
              ],
              "text": null
            },
            {
              "id": "example",
              "picked": [],
              "text": "Milk x6, oat milk x4, orange juice x2, sparkling water x24, still water x24, cola x12, yoghurt x20, cheese slices, butter, eggs x18, hummus x3, cucumber, apples, carrots, cream cheese x2"
            }
          ],
          "design": {
            "read": "Your fridge restock now runs from one Excel list. You type what is in the fridges, the list shows what is below your usual amount, and you send one email to the supplier from a saved draft. This replaces looking and counting every item in your head, and you only order what the list shows.",
            "material": [
              {
                "label": "Your fridge restock list",
                "items": [
                  "Item | In the fridge now | Usual amount",
                  "Milk | [count] | 6",
                  "Oat milk | [count] | 4",
                  "Orange juice | [count] | 2",
                  "Sparkling water | [count] | 24",
                  "Still water | [count] | 24",
                  "Cola | [count] | 12",
                  "Yoghurt | [count] | 20",
                  "Cheese slices | [count] | [usual amount]",
                  "Butter | [count] | [usual amount]",
                  "Eggs | [count] | 18",
                  "Hummus | [count] | 3",
                  "Cucumber | [count] | [usual amount]",
                  "Apples | [count] | [usual amount]",
                  "Carrots | [count] | [usual amount]",
                  "Cream cheese | [count] | 2"
                ]
              },
              {
                "label": "Your low list formulas",
                "items": [
                  "=FILTER(A2:A16,B2:B16<C2:C16,\"Nothing low\")",
                  "=FILTER(C2:C16-B2:B16,B2:B16<C2:C16,\"\")"
                ]
              },
              {
                "label": "Your fridge restock order",
                "items": [
                  "Subject: Fridge restock order for [delivery day]",
                  "Hello [supplier name],\n\nI would like to place our fridge restock order for [delivery day].\n\nItem and amount:\n[item 1] x[amount]\n[item 2] x[amount]\n[item 3] x[amount]\n\nPlease confirm the order and the delivery time. Let me know if anything is not available.\n\nThank you,\n[your name]"
                ]
              },
              {
                "label": "Your reminder title",
                "items": [
                  "Check the fridges and send the restock order"
                ]
              }
            ],
            "steps": [
              {
                "use": "goal",
                "say": "Create an Excel sheet with the three columns and the items Tally wrote. Fill in the usual amounts where you see brackets.",
                "piece": 1,
                "when": "once"
              },
              {
                "use": "excel_below_usual",
                "say": "Add the list that shows what is below its usual amount, with the amount to order beside it.",
                "piece": 2,
                "when": "once"
              },
              {
                "use": "outlook_saved_email",
                "say": "Save the order email so it is ready to reuse.",
                "piece": 3,
                "when": "once"
              },
              {
                "use": "outlook_repeat_reminder",
                "say": "Set a daily reminder to check the fridges.",
                "piece": 4,
                "when": "once"
              },
              {
                "use": "goal",
                "say": "Each day, type what is in the fridges now beside each item. The low list updates by itself.",
                "piece": null,
                "when": "each_time"
              },
              {
                "use": "goal",
                "say": "Open your saved email as a new draft, copy the low items and amounts into it, read it through and send it. The next day you simply update the counts again.",
                "piece": null,
                "when": "each_time"
              }
            ],
            "tryOn": "This week's fridge check, starting with the drinks.",
            "good": "You count once, the list shows only what is low, and one email goes to the supplier with the right amounts.",
            "approval": "Check the amounts against what you see in the fridges, and read the email and the supplier name before you send it.",
            "usesAi": false,
            "suite": "microsoft",
            "phone": null
          },
          "solved": false,
          "tries": 1
        }
      ],
      "prep": null,
      "skipped": []
    }
  },
  "v4_property": {
    "input": {
      "job": "Property manager for 40 rental apartments in three buildings. Repairs, tenants, move ins and outs, inspections.",
      "qas": [
        {
          "id": "level",
          "title": "Where are you with AI?",
          "picked": [
            "Use it some weeks"
          ],
          "text": null,
          "shown": [
            "Never used it",
            "Tried it a few times",
            "Use it some weeks",
            "Use it most days"
          ]
        },
        {
          "id": "done",
          "title": "What have you already done with AI?",
          "picked": [
            "Pasted in my own text"
          ],
          "text": null,
          "shown": [
            "Pasted in my own text",
            "Saved instructions about myself",
            "Made a project",
            "Connected an app",
            "Pay for a plan",
            "None of these"
          ]
        },
        {
          "id": "tools",
          "title": "Which AI have you used?",
          "picked": [
            "ChatGPT"
          ],
          "text": null,
          "shown": [
            "ChatGPT",
            "Copilot",
            "Gemini",
            "Claude",
            "Other",
            "None yet",
            "Not sure"
          ]
        },
        {
          "id": "repeats",
          "title": "What do you do over and over, every day or every week?",
          "picked": [
            "Repairs",
            "Tenant requests",
            "Move ins and outs",
            "Inspections",
            "Rent collection",
            "Maintenance scheduling"
          ],
          "text": null,
          "shown": [
            "Repairs",
            "Tenant requests",
            "Move ins and outs",
            "Inspections",
            "Rent collection",
            "Lease renewals",
            "Maintenance scheduling",
            "Vendor invoices"
          ]
        },
        {
          "id": "most",
          "title": "Which would save you the most time if it got easier?",
          "picked": [
            "Repairs",
            "Inspections"
          ],
          "text": null,
          "shown": [
            "Repairs",
            "Tenant requests",
            "Move ins and outs",
            "Inspections",
            "Rent collection",
            "Maintenance scheduling"
          ]
        },
        {
          "id": "often",
          "title": "How often do you do this?",
          "picked": [
            "Many times a day"
          ],
          "text": null,
          "shown": [
            "Many times a day",
            "About once a day",
            "A few times a week",
            "Once a week or less"
          ]
        },
        {
          "id": "where",
          "title": "Where does your work happen?",
          "picked": [
            "Google Sheets",
            "Gmail",
            "Text messages",
            "In person"
          ],
          "text": null,
          "shown": [
            "Buildium",
            "AppFolio",
            "QuickBooks",
            "Google Sheets",
            "Outlook",
            "Microsoft Teams",
            "WhatsApp",
            "DocuSign",
            "Text messages",
            "Gmail",
            "Instagram",
            "A work system",
            "Paper",
            "In person"
          ]
        },
        {
          "id": "device",
          "title": "Do you work on a phone, a computer or both?",
          "picked": [
            "Both"
          ],
          "text": null,
          "shown": [
            "Phone only",
            "Computer only",
            "Both"
          ]
        },
        {
          "id": "can_use",
          "title": "Can you use AI for your work?",
          "picked": [
            "Yes"
          ],
          "text": null,
          "shown": [
            "Yes",
            "Not sure",
            "No, it’s restricted",
            "I work for myself"
          ]
        },
        {
          "id": "connect",
          "title": "Would your company let you link your work email to an AI tool?",
          "picked": [
            "Not sure"
          ],
          "text": null,
          "shown": [
            "Yes",
            "No",
            "Not sure"
          ]
        }
      ],
      "mostWanted": [
        "Repairs",
        "Inspections"
      ],
      "role": "You’re the property manager for 40 rental apartments across three buildings, keeping repairs, tenants, move ins and outs, and inspections running.",
      "worksFor": "employer",
      "experience": "uses",
      "aiTools": [
        "chatgpt"
      ],
      "aiPolicy": "encouraged",
      "map": [
        {
          "task": "Repairs",
          "phrase": "repair requests",
          "thing": "repair",
          "today": "You handle repairs many times a day across three buildings.",
          "withPath": "Repair requests collected in one place so they reach you in order.",
          "ai": true,
          "private": false,
          "kind": null,
          "patterns": [
            6,
            3
          ],
          "level": 3,
          "waits": false,
          "recipe": null,
          "held": null,
          "askFirst": false,
          "workflow": "pattern_6",
          "stays": null
        },
        {
          "task": "Inspections",
          "phrase": null,
          "thing": "inspection",
          "today": "You take inspection notes across your 40 apartments and copy them over.",
          "withPath": "Your notes go in as they are and come out as rows for your sheet.",
          "ai": true,
          "private": false,
          "kind": "notes_to_table",
          "patterns": [
            9,
            5
          ],
          "level": 3,
          "waits": false,
          "recipe": "notes_to_sheet",
          "held": null,
          "askFirst": false,
          "workflow": null,
          "stays": null
        },
        {
          "task": "Tenant requests",
          "phrase": "tenant requests",
          "thing": "tenant request",
          "today": "Tenant requests reach you one by one across your three buildings.",
          "withPath": "Tenant requests collected in one place instead of arriving one at a time.",
          "ai": true,
          "private": false,
          "kind": null,
          "patterns": [
            6
          ],
          "level": 3,
          "waits": false,
          "recipe": null,
          "held": null,
          "askFirst": false,
          "workflow": "pattern_6",
          "stays": null
        },
        {
          "task": "Move ins and outs",
          "phrase": null,
          "thing": null,
          "today": "You run move ins and outs for your tenants as they come up.",
          "withPath": "Move in and move out steps kept on one checklist you follow each time.",
          "ai": true,
          "private": false,
          "kind": null,
          "patterns": [
            5
          ],
          "level": 3,
          "waits": false,
          "recipe": null,
          "held": null,
          "askFirst": false,
          "workflow": "pattern_5",
          "stays": null
        },
        {
          "task": "Rent collection",
          "phrase": null,
          "thing": "rent",
          "today": "You collect rent each month across your 40 apartments.",
          "withPath": "Rent reminders that come round on schedule, so you keep track of them.",
          "ai": true,
          "private": false,
          "kind": null,
          "patterns": [
            7
          ],
          "level": 3,
          "waits": false,
          "recipe": null,
          "held": null,
          "askFirst": false,
          "workflow": "pattern_7",
          "stays": null
        },
        {
          "task": "Maintenance scheduling",
          "phrase": "maintenance schedule",
          "thing": "maintenance",
          "today": "You schedule maintenance across the three buildings by hand.",
          "withPath": "Maintenance jobs laid out on a schedule so each one comes round on time.",
          "ai": true,
          "private": false,
          "kind": null,
          "patterns": [
            7
          ],
          "level": 3,
          "waits": false,
          "recipe": null,
          "held": null,
          "askFirst": false,
          "workflow": "pattern_7",
          "stays": null
        }
      ],
      "top": "Repairs",
      "track": "builder",
      "tool": "chatgpt",
      "device": "both",
      "apps": [
        "any_chat",
        "chatgpt",
        "iphone",
        "gboard",
        "samsung_keyboard",
        "gmail",
        "google_sheets"
      ],
      "firstStep": null
    },
    "path": {
      "version": 4,
      "role": "You’re the property manager for 40 rental apartments across three buildings, keeping repairs, tenants, move ins and outs, and inspections running.",
      "track": "builder",
      "tool": "chatgpt",
      "worksFor": "employer",
      "policy": "encouraged",
      "device": "both",
      "places": [
        "Google Sheets",
        "Gmail",
        "Text messages",
        "In person"
      ],
      "apps": [
        "any_chat",
        "chatgpt",
        "iphone",
        "gboard",
        "samsung_keyboard",
        "gmail",
        "google_sheets"
      ],
      "map": [
        {
          "task": "Repairs",
          "phrase": "repair requests",
          "thing": "repair",
          "today": "You handle repairs many times a day across three buildings.",
          "withPath": "Repair requests collected in one place so they reach you in order.",
          "ai": true,
          "private": false,
          "kind": null,
          "patterns": [
            6,
            3
          ],
          "level": 3,
          "waits": false,
          "recipe": null,
          "held": null,
          "askFirst": false,
          "workflow": "pattern_6",
          "stays": null
        },
        {
          "task": "Inspections",
          "phrase": null,
          "thing": "inspection",
          "today": "You take inspection notes across your 40 apartments and copy them over.",
          "withPath": "Your notes go in as they are and come out as rows for your sheet.",
          "ai": true,
          "private": false,
          "kind": "notes_to_table",
          "patterns": [
            9,
            5
          ],
          "level": 3,
          "waits": false,
          "recipe": "notes_to_sheet",
          "held": null,
          "askFirst": false,
          "workflow": null,
          "stays": null
        },
        {
          "task": "Tenant requests",
          "phrase": "tenant requests",
          "thing": "tenant request",
          "today": "Tenant requests reach you one by one across your three buildings.",
          "withPath": "Tenant requests collected in one place instead of arriving one at a time.",
          "ai": true,
          "private": false,
          "kind": null,
          "patterns": [
            6
          ],
          "level": 3,
          "waits": false,
          "recipe": null,
          "held": null,
          "askFirst": false,
          "workflow": "pattern_6",
          "stays": null
        },
        {
          "task": "Move ins and outs",
          "phrase": null,
          "thing": null,
          "today": "You run move ins and outs for your tenants as they come up.",
          "withPath": "Move in and move out steps kept on one checklist you follow each time.",
          "ai": true,
          "private": false,
          "kind": null,
          "patterns": [
            5
          ],
          "level": 3,
          "waits": false,
          "recipe": null,
          "held": null,
          "askFirst": false,
          "workflow": "pattern_5",
          "stays": null
        },
        {
          "task": "Rent collection",
          "phrase": null,
          "thing": "rent",
          "today": "You collect rent each month across your 40 apartments.",
          "withPath": "Rent reminders that come round on schedule, so you keep track of them.",
          "ai": true,
          "private": false,
          "kind": null,
          "patterns": [
            7
          ],
          "level": 3,
          "waits": false,
          "recipe": null,
          "held": null,
          "askFirst": false,
          "workflow": "pattern_7",
          "stays": null
        },
        {
          "task": "Maintenance scheduling",
          "phrase": "maintenance schedule",
          "thing": "maintenance",
          "today": "You schedule maintenance across the three buildings by hand.",
          "withPath": "Maintenance jobs laid out on a schedule so each one comes round on time.",
          "ai": true,
          "private": false,
          "kind": null,
          "patterns": [
            7
          ],
          "level": 3,
          "waits": false,
          "recipe": null,
          "held": null,
          "askFirst": false,
          "workflow": "pattern_7",
          "stays": null
        }
      ],
      "confirmed": true,
      "slots": [
        {
          "id": "task_1",
          "task": "Repairs",
          "answers": [
            {
              "id": "reach",
              "picked": [
                "email",
                "texts"
              ],
              "text": null
            },
            {
              "id": "need",
              "picked": [
                "who",
                "where",
                "what",
                "urgent",
                "when"
              ],
              "text": null
            },
            {
              "id": "after",
              "picked": [
                "book"
              ],
              "text": null
            },
            {
              "id": "volume",
              "picked": [
                "many"
              ],
              "text": null
            },
            {
              "id": "example",
              "picked": [],
              "text": "Hi Dana, the kitchen sink in unit 3B is backing up again and water is pooling on the floor. Can someone come today? I'm home after 4 if that works. Thanks, Marcy"
            }
          ],
          "design": {
            "read": "From now on, repairs no longer reach you one by one by email and text. Everyone sends a request through one form, and every request lands as a row in one list. You see who it is from, where it is, what it is about, how urgent it is and when it is needed, all in the same place, so you can book someone to come without piecing details together.",
            "material": [
              {
                "label": "Your repair form",
                "items": [
                  "Who is this from?\nTheir own words",
                  "Where is the problem?\nTheir own words",
                  "What is the problem?\nTheir own words",
                  "How urgent is it?\nEmergency, water or safety risk\nUrgent, needs to be fixed in a day or two\nNormal, can wait for the next visit",
                  "When do you need someone to come?\nTheir own words"
                ]
              },
              {
                "label": "Your message with the link",
                "items": [
                  "Hi all, to report a repair, please use this form instead of emailing or texting me: [link]. It takes a minute. Tell me who you are, where the problem is, what is wrong, how urgent it is and when someone can come. If there is water or a safety risk, please also call me right away. Thanks, [your name]"
                ]
              },
              {
                "label": "Your repair list columns",
                "items": [
                  "Timestamp",
                  "Who is this from?",
                  "Where is the problem?",
                  "What is the problem?",
                  "How urgent is it?",
                  "When do you need someone to come?",
                  "Status",
                  "Who is booked"
                ]
              },
              {
                "label": "Your urgent row color",
                "items": [
                  "=$E1=\"Emergency, water or safety risk\""
                ]
              }
            ],
            "steps": [
              {
                "use": "google_forms_create",
                "say": "Create the form. Tally has written the questions for you.",
                "piece": 1,
                "when": "once"
              },
              {
                "use": "google_forms_to_sheets",
                "say": "Send the form answers to a sheet, so every request becomes a row in one list.",
                "piece": null,
                "when": "once"
              },
              {
                "use": "sheets_dropdown",
                "say": "In the Status column, add a drop down with these choices: New, Booked, Done. Put the same kind of drop down in Who is booked if you like.",
                "piece": 3,
                "when": "once"
              },
              {
                "use": "sheets_highlight_row",
                "say": "Color the emergency rows so they stand out. Tally has written the formula for you.",
                "piece": 4,
                "when": "once"
              },
              {
                "use": "google_forms_share",
                "say": "Share the form link with tenants and colleagues, using the message Tally wrote.",
                "piece": 2,
                "when": "once"
              },
              {
                "use": "goal",
                "say": "Each time, open your list, read the new rows, book someone for each one, and set the Status to Booked. Send people back to the form if they text or email you a repair.",
                "piece": null,
                "when": "each_time"
              }
            ],
            "tryOn": "Your next three repair requests.",
            "good": "Every repair arrives as one row with all five details filled in, and you book someone without having to ask follow up questions.",
            "approval": "Check each emergency row yourself and confirm the details and the day before you book anyone to come.",
            "usesAi": false,
            "suite": "google",
            "phone": null
          },
          "solved": false,
          "tries": 1
        },
        {
          "id": "task_2",
          "task": "Inspections",
          "answers": [
            {
              "id": "notes",
              "picked": [
                "phone"
              ],
              "text": null
            },
            {
              "id": "end",
              "picked": [
                "sheet"
              ],
              "text": null
            },
            {
              "id": "fields",
              "picked": [
                "date",
                "place",
                "found",
                "todo"
              ],
              "text": null
            },
            {
              "id": "often",
              "picked": [
                "monthly"
              ],
              "text": null
            },
            {
              "id": "example",
              "picked": [],
              "text": "Bldg 2, Unit 3B, bathroom: slow drain and small drip under sink. Needs plumber, booked for Thursday. Hallway light out by the stairs, handyman to replace bulb and check fixture."
            }
          ],
          "design": {
            "read": "From now on, your inspection notes go straight from your phone into rows for your sheet. You keep jotting notes the way you do today, then paste them in with your saved instructions and get clean rows back. You stop retyping each note by hand across your 40 apartments.",
            "material": [
              {
                "label": "Your inspection instructions",
                "items": [
                  "I will paste in my inspection notes. Turn them into rows for my sheet, one row per issue found. Use exactly these columns, in this order: Date, Building, Unit, Place, What was found, What needs doing. Date: write the date of the inspection as [date], or leave it blank if I did not give one. Building: for example Bldg 2. Unit: for example 3B. Place: the room or area, for example bathroom or hallway. What was found: the problem in a few plain words. What needs doing: the action and who does it, and the day if I gave one. If one note has two problems, make two rows. Never add details I did not give. Show the rows as a table I can copy into Google Sheets.",
                  "If a line does not fit the columns, do not drop it. Put it in a last row with the full line copied word for word in What was found, and write [check] in What needs doing. Leave any column you cannot fill blank, and never guess."
                ]
              },
              {
                "label": "Your inspection sheet columns",
                "items": [
                  "Date",
                  "Building",
                  "Unit",
                  "Place",
                  "What was found",
                  "What needs doing"
                ]
              }
            ],
            "steps": [
              {
                "use": "goal",
                "say": "Open a new Google Sheet and type the six column names in the first row, in this order.",
                "piece": 2,
                "when": "once"
              },
              {
                "use": "goal",
                "say": "Save your inspection instructions in ChatGPT so you can use them again each month.",
                "piece": 1,
                "when": "once"
              },
              {
                "use": "notes_to_sheet",
                "say": "Paste your phone notes under your saved instructions and let ChatGPT turn them into rows.",
                "piece": 1,
                "when": "each_time"
              },
              {
                "use": "goal",
                "say": "Read each row against your notes, then copy the rows into the next empty rows of your sheet.",
                "piece": null,
                "when": "each_time"
              }
            ],
            "tryOn": "This month's notes from one building.",
            "good": "Every issue in your notes is one row in your sheet, with the right unit, place and action, and nothing added that you did not write.",
            "approval": "Check every row against your own notes, especially unit numbers, dates and who is booked to do the work, and look at any row marked [check].",
            "usesAi": true,
            "suite": "google",
            "phone": null
          },
          "solved": false,
          "tries": 1
        }
      ],
      "prep": {
        "aboutNote": "I am a property manager for 40 rental apartments in three buildings. I handle repairs, tenant requests, move ins and move outs, and inspections. I often paste in my own rough notes from my phone and want them turned into clean, short rows for a Google Sheet. I like plain, direct wording with no extra chat. Never add details I did not give, such as dates, names, prices or causes. If something is unclear, leave it blank or mark it with [check] and ask me. Never drop a line of my notes. Keep tenant names and private details out of your answers.",
        "safeUse": [
          "Never type tenant names, phone numbers or email addresses into ChatGPT.",
          "Leave out door codes, keys, lockbox details and passwords.",
          "Do not paste lease terms, rent amounts or payment details.",
          "Use unit numbers and plain descriptions of the problem only.",
          "Read every row before it goes into your sheet."
        ],
        "askMessage": null
      },
      "skipped": [
        "ready"
      ]
    }
  },
  "v4_hr": {
    "input": {
      "job": "HR coordinator at a logistics company, about 300 employees.",
      "qas": [
        {
          "id": "level",
          "title": "Where are you with AI?",
          "picked": [
            "Tried it a few times"
          ],
          "text": null,
          "shown": [
            "Never used it",
            "Tried it a few times",
            "Use it some weeks",
            "Use it most days"
          ]
        },
        {
          "id": "repeats",
          "title": "What do you do over and over, every day or every week?",
          "picked": [
            "Onboarding new hires",
            "Leave requests",
            "Benefits enrollment",
            "Employee records",
            "Interview scheduling"
          ],
          "text": null,
          "shown": [
            "Onboarding new hires",
            "Payroll questions",
            "Leave requests",
            "Benefits enrollment",
            "Employee records",
            "Interview scheduling",
            "Policy updates",
            "Training reminders"
          ]
        },
        {
          "id": "most",
          "title": "Which would save you the most time if it got easier?",
          "picked": [
            "Onboarding new hires",
            "Benefits enrollment"
          ],
          "text": null,
          "shown": [
            "Onboarding new hires",
            "Leave requests",
            "Benefits enrollment",
            "Employee records",
            "Interview scheduling"
          ]
        },
        {
          "id": "often",
          "title": "How often do you do this?",
          "picked": [
            "A few times a week"
          ],
          "text": null,
          "shown": [
            "Many times a day",
            "About once a day",
            "A few times a week",
            "Once a week or less"
          ]
        },
        {
          "id": "where",
          "title": "Where does your work happen?",
          "picked": [
            "Microsoft Excel",
            "Outlook",
            "A work system"
          ],
          "text": null,
          "shown": [
            "Workday",
            "Microsoft Excel",
            "Outlook",
            "Microsoft Teams",
            "ADP",
            "DocuSign",
            "SharePoint",
            "Google Sheets",
            "Text messages",
            "Gmail",
            "Instagram",
            "A work system",
            "Paper",
            "In person"
          ]
        },
        {
          "id": "device",
          "title": "Do you work on a phone, a computer or both?",
          "picked": [
            "Computer only"
          ],
          "text": null,
          "shown": [
            "Phone only",
            "Computer only",
            "Both"
          ]
        },
        {
          "id": "can_use",
          "title": "Can you use AI for your work?",
          "picked": [
            "Not sure"
          ],
          "text": null,
          "shown": [
            "Yes",
            "Not sure",
            "No, it’s restricted",
            "I work for myself"
          ]
        },
        {
          "id": "connect",
          "title": "Would your company let you link your work email to an AI tool?",
          "picked": [
            "Not sure"
          ],
          "text": null,
          "shown": [
            "Yes",
            "No",
            "Not sure"
          ]
        }
      ],
      "mostWanted": [
        "Onboarding new hires",
        "Benefits enrollment"
      ],
      "role": "You’re the HR coordinator for about 300 people at a logistics company, keeping onboarding, benefits, leave and records running smoothly.",
      "worksFor": "employer",
      "experience": "tried",
      "aiTools": [
        "not_sure"
      ],
      "aiPolicy": "no_idea",
      "map": [
        {
          "task": "Onboarding new hires",
          "phrase": null,
          "thing": "new hire",
          "today": "You onboard new hires a few times a week, all on your own.",
          "withPath": "New hire steps run from one checklist you follow each time.",
          "ai": true,
          "private": false,
          "kind": "repeat_emails",
          "patterns": [
            5,
            1
          ],
          "level": 3,
          "waits": false,
          "recipe": null,
          "held": null,
          "askFirst": false,
          "workflow": "pattern_5",
          "stays": null
        },
        {
          "task": "Benefits enrollment",
          "phrase": null,
          "thing": "benefits enrollment",
          "today": "You answer benefits enrollment questions as they come in, one by one.",
          "withPath": "Benefits questions collected in one place with saved replies ready.",
          "ai": true,
          "private": false,
          "kind": "repeat_emails",
          "patterns": [
            6,
            1
          ],
          "level": 3,
          "waits": false,
          "recipe": null,
          "held": null,
          "askFirst": false,
          "workflow": "pattern_6",
          "stays": null
        },
        {
          "task": "Leave requests",
          "phrase": "leave requests",
          "thing": "leave request",
          "today": "Leave requests reach you one at a time from employees.",
          "withPath": "Leave requests collected in one place for you to review.",
          "ai": true,
          "private": false,
          "kind": null,
          "patterns": [
            6
          ],
          "level": 3,
          "waits": false,
          "recipe": null,
          "held": null,
          "askFirst": false,
          "workflow": "pattern_6",
          "stays": null
        },
        {
          "task": "Interview scheduling",
          "phrase": null,
          "thing": "interview",
          "today": "You schedule interviews by email, one candidate at a time.",
          "withPath": "Interview emails you send again and again, ready to reuse.",
          "ai": true,
          "private": false,
          "kind": "repeat_emails",
          "patterns": [
            1
          ],
          "level": 3,
          "waits": false,
          "recipe": null,
          "held": null,
          "askFirst": false,
          "workflow": "pattern_1",
          "stays": null
        },
        {
          "task": "Employee records",
          "phrase": "employee records",
          "thing": "employee record",
          "today": "You keep employee records up to date in your own systems.",
          "withPath": "This stays yours.",
          "ai": false,
          "private": true,
          "kind": null,
          "patterns": [],
          "level": 1,
          "waits": false,
          "recipe": null,
          "held": null,
          "askFirst": false,
          "workflow": null,
          "stays": "private"
        }
      ],
      "top": "Onboarding new hires",
      "track": "starter",
      "tool": "claude",
      "device": "computer",
      "apps": [
        "any_chat",
        "claude"
      ],
      "firstStep": null
    },
    "path": {
      "version": 4,
      "role": "You’re the HR coordinator for about 300 people at a logistics company, keeping onboarding, benefits, leave and records running smoothly.",
      "track": "starter",
      "tool": "claude",
      "worksFor": "employer",
      "policy": "no_idea",
      "device": "computer",
      "places": [
        "Microsoft Excel",
        "Outlook",
        "A work system"
      ],
      "apps": [
        "any_chat",
        "claude"
      ],
      "map": [
        {
          "task": "Onboarding new hires",
          "phrase": null,
          "thing": "new hire",
          "today": "You onboard new hires a few times a week, all on your own.",
          "withPath": "New hire steps run from one checklist you follow each time.",
          "ai": true,
          "private": false,
          "kind": "repeat_emails",
          "patterns": [
            5,
            1
          ],
          "level": 3,
          "waits": false,
          "recipe": null,
          "held": null,
          "askFirst": false,
          "workflow": "pattern_5",
          "stays": null
        },
        {
          "task": "Benefits enrollment",
          "phrase": null,
          "thing": "benefits enrollment",
          "today": "You answer benefits enrollment questions as they come in, one by one.",
          "withPath": "Benefits questions collected in one place with saved replies ready.",
          "ai": true,
          "private": false,
          "kind": "repeat_emails",
          "patterns": [
            6,
            1
          ],
          "level": 3,
          "waits": false,
          "recipe": null,
          "held": null,
          "askFirst": false,
          "workflow": "pattern_6",
          "stays": null
        },
        {
          "task": "Leave requests",
          "phrase": "leave requests",
          "thing": "leave request",
          "today": "Leave requests reach you one at a time from employees.",
          "withPath": "Leave requests collected in one place for you to review.",
          "ai": true,
          "private": false,
          "kind": null,
          "patterns": [
            6
          ],
          "level": 3,
          "waits": false,
          "recipe": null,
          "held": null,
          "askFirst": false,
          "workflow": "pattern_6",
          "stays": null
        },
        {
          "task": "Interview scheduling",
          "phrase": null,
          "thing": "interview",
          "today": "You schedule interviews by email, one candidate at a time.",
          "withPath": "Interview emails you send again and again, ready to reuse.",
          "ai": true,
          "private": false,
          "kind": "repeat_emails",
          "patterns": [
            1
          ],
          "level": 3,
          "waits": false,
          "recipe": null,
          "held": null,
          "askFirst": false,
          "workflow": "pattern_1",
          "stays": null
        },
        {
          "task": "Employee records",
          "phrase": "employee records",
          "thing": "employee record",
          "today": "You keep employee records up to date in your own systems.",
          "withPath": "This stays yours.",
          "ai": false,
          "private": true,
          "kind": null,
          "patterns": [],
          "level": 1,
          "waits": false,
          "recipe": null,
          "held": null,
          "askFirst": false,
          "workflow": null,
          "stays": "private"
        }
      ],
      "confirmed": true,
      "slots": [
        {
          "id": "task_1",
          "task": "Onboarding new hires",
          "answers": [
            {
              "id": "start",
              "picked": [
                "start_day"
              ],
              "text": null
            },
            {
              "id": "steps",
              "picked": [
                "many"
              ],
              "text": null
            },
            {
              "id": "together",
              "picked": [
                "few"
              ],
              "text": null
            },
            {
              "id": "kept",
              "picked": [
                "sheet"
              ],
              "text": null
            },
            {
              "id": "example",
              "picked": [],
              "text": "Offer accepted, so send the offer letter and welcome email. Set up the Outlook calendar invites for the first-week meetings. Book the interviews and orientation slots. Put the new hire in the onboarding checklist sheet and tick off each item. Confirm the laptop and badge request. Send the benefits and leave FAQ link. Check the records are updated in the HR system before the start day."
            }
          ],
          "design": {
            "read": "From now on, each new hire is one row in a single tracker, and every step is dated from the start day for you. You no longer work out dates by hand or scan a checklist for what is late. The tracker shows the next date due in each row and marks it Due once that day has come, so you can see at a glance which of your new hires needs you today.",
            "material": [
              {
                "label": "Your new hire tracker",
                "items": [
                  "Column A: New hire",
                  "Column B: Start day",
                  "Column C: Offer letter and welcome email",
                  "Column D: Calendar invites for first week",
                  "Column E: Interviews and orientation booked",
                  "Column F: Laptop and badge confirmed",
                  "Column G: Benefits and leave FAQ sent",
                  "Column H: HR system records checked",
                  "Column I: Next due",
                  "Column J: Status"
                ]
              },
              {
                "label": "Your new hire step dates",
                "items": [
                  "C2: =B2-14",
                  "D2: =B2-7",
                  "E2: =B2-7",
                  "F2: =B2-5",
                  "G2: =B2-3",
                  "H2: =B2-1"
                ]
              },
              {
                "label": "Your next due formulas",
                "items": [
                  "I2: =IF(COUNT(C2:H2)=0,\"All done\",MIN(C2:H2))",
                  "J2: =IF(AND(I2<>\"\",ISNUMBER(I2),I2<=TODAY()),\"Due\",\"\")"
                ]
              },
              {
                "label": "Your due date highlight",
                "items": [
                  "=AND(ISNUMBER(I2),I2<=TODAY())"
                ]
              }
            ],
            "steps": [
              {
                "use": "excel_days_after",
                "say": "Set up the tracker with one row for each new hire, and date every step from the start day. Tally has written the columns and the day counts, which you can change to match how you work.",
                "piece": 2,
                "when": "once"
              },
              {
                "use": "excel_next_due",
                "say": "Add the Next due column and the Status column so each row shows its earliest step still to do.",
                "piece": 3,
                "when": "once"
              },
              {
                "use": "excel_due_highlight",
                "say": "Make the Next due dates stand out once the day has come.",
                "piece": 4,
                "when": "once"
              },
              {
                "use": "goal",
                "say": "When you get a new offer acceptance, add a row with the name and start day, then copy the date formulas down from the row above.",
                "piece": 1,
                "when": "each_time"
              },
              {
                "use": "goal",
                "say": "Each morning, open the tracker and work through the rows marked Due. When a step is finished, type done over its date.",
                "piece": null,
                "when": "each_time"
              },
              {
                "use": "goal",
                "say": "Once a new hire shows All done, move that row to your archive sheet so the tracker holds only people still being onboarded.",
                "piece": null,
                "when": "each_time"
              }
            ],
            "tryOn": "Your next two or three new hires, starting from their start days.",
            "good": "Every new hire has one row, each step has a date, and you see which rows are Due without checking a separate checklist.",
            "approval": "Check each start day and each date before you rely on it, and confirm the laptop, badge and HR system records yourself before the first day.",
            "usesAi": false,
            "suite": "microsoft",
            "phone": null
          },
          "solved": false,
          "tries": 1
        },
        {
          "id": "task_2",
          "task": "Benefits enrollment",
          "answers": [
            {
              "id": "reach",
              "picked": [
                "email"
              ],
              "text": null
            },
            {
              "id": "need",
              "picked": [
                "who",
                "what",
                "urgent",
                "when"
              ],
              "text": null
            },
            {
              "id": "after",
              "picked": [
                "self"
              ],
              "text": null
            },
            {
              "id": "volume",
              "picked": [
                "many"
              ],
              "text": null
            },
            {
              "id": "example",
              "picked": [],
              "text": "Hi, I'm going on leave at the start of next month and I'm not sure if I need to change my health plan before it starts. Does coverage stop on the last day I work, and is there a deadline to add my new baby? Thanks, I need to submit before Friday."
            }
          ],
          "design": {
            "read": "From now on, colleagues enter their benefits enrollment questions themselves in one form, instead of writing to you one by one. Every request arrives with who it is from, what it is about, how urgent it is and when it is needed. You read them all in one place, so you stop sorting through email.",
            "material": [
              {
                "label": "Your benefits enrollment form",
                "items": [
                  "Title: Benefits enrollment request",
                  "Your full name\nTheir own words",
                  "What is your request about?\nChanging my health plan\nAdding a family member\nWhen my coverage starts or ends\nLeave and benefits\nSomething else",
                  "How urgent is it?\nI need an answer today\nI need an answer this week\nNo rush",
                  "When do you need it by?\nTheir own words",
                  "Tell us a little more\nTheir own words"
                ]
              },
              {
                "label": "Your message with the link",
                "items": [
                  "Hi all, for any benefits enrollment question or change, please use this form instead of emailing me: [link]. It asks who you are, what it is about, how urgent it is and when you need it by. I will read every answer in one place and reply to you. Thanks, [your name]"
                ]
              },
              {
                "label": "Your benefits enrollment list",
                "items": [
                  "Open the form answers in Excel and leave that workbook as it is.",
                  "Read each row: name, request type, urgency, date needed and details.",
                  "On the form's results page, the count for each request type and urgency is already shown."
                ]
              }
            ],
            "steps": [
              {
                "use": "ms_forms_create",
                "say": "Create the form. Tally has written the questions for you.",
                "piece": 1,
                "when": "once"
              },
              {
                "use": "ms_forms_share",
                "say": "Send the form link to your colleagues using the message Tally wrote.",
                "piece": 2,
                "when": "once"
              },
              {
                "use": "ms_forms_results",
                "say": "Each time you sit down to work on enrollment, open the results page to see how many requests there are for each type and how urgent they are.",
                "piece": null,
                "when": "each_time"
              },
              {
                "use": "ms_forms_to_excel",
                "say": "Open the answers in Excel to read each person's request, who it is from and when they need it. Leave the workbook as it is.",
                "piece": 3,
                "when": "each_time"
              },
              {
                "use": "goal",
                "say": "Reply to each person, starting with the most urgent and earliest dates. When a round of enrollment is finished, start the next one by deleting the old answers in Forms once you have recorded what you need.",
                "piece": null,
                "when": "each_time"
              }
            ],
            "tryOn": "The next benefits enrollment questions that reach you this week.",
            "good": "Colleagues send their requests through the form, and you see each one with who it is from, what it is about, how urgent it is and when it is needed, with no email sorting.",
            "approval": "Before you reply to anyone or change anything in a benefits record, check the person's details and the deadline yourself.",
            "usesAi": false,
            "suite": "microsoft",
            "phone": null
          },
          "solved": false,
          "tries": 1
        }
      ],
      "prep": null,
      "skipped": []
    }
  }
};
