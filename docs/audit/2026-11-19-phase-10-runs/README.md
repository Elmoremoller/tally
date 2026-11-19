# Phase 10 proof runs, 19 November 2026

Three people through the full paid path, run with `scripts/phase-10-runs.ts`. Each starts from the free result she got in the Phase 8 runs, as if she had just paid, keeps her two workflows, answers the follow up questions for each, and gets both written live by `designWorkflow` with `claude-sonnet-5-5` at low effort.

* `office.md`: the office coordinator. Lunch is answered exactly as in the target of DIRECTION.md section 4, with a short menu as her example. Her fridge answers are played from her bio.
* `property.md`: the property manager, a Builder in Gmail and Google Sheets whose company allows AI. Her answers are played from her bio.
* `hr.md`: Priya, HR in Outlook and Excel, not sure what her company allows. Her answers are played from her bio.

Each file prints her path screen by screen, word for word as she reads it, then the seconds and the AI cost of each workflow and the checks. The `.json` files hold the raw answers, every attempt the model made with the reasons any was rejected, and the saved path. `summary.json` holds the checks and times for all three.

Prices used for the cost: $2 per million input tokens and $10 per million output tokens for Claude Sonnet 5.5 (Claude API reference, cached 3 November 2026). Playing her answers uses Claude Haiku 5.5 and is not part of the product's cost.
