---
description: Add or update an official MQ-9 fleet total in src/data/inventory.json (drives the headline number and trend chart).
argument-hint: [count + date/source, e.g. "130 as of FY2026 per CRS"]
disable-model-invocation: true
allowed-tools: Read Edit Write AskUserQuestion Bash(npm run build) Bash(npm run typecheck)
---

Add a new official fleet total to the `totals` array in `src/data/inventory.json`:

$ARGUMENTS

Here is the current data so you can see existing totals and the chart-label conventions:

!`cat src/data/inventory.json`

This figure drives the headline number and the trend chart, so accuracy matters.
Steps:

1. Gather/confirm (ask via AskUserQuestion if missing — **don't invent**):
   - `date`: ISO `YYYY-MM-DD` the figure applies to.
   - `label`: short chart label, e.g. "May 2026", "End FY2026".
   - `count`: the official total (integer).
   - `note`: optional one-line context.
   - `source`: `{ title, publisher, url }` — required, must be a real source.
2. Insert it in `totals` in chronological order (sorted oldest→newest). The entry
   with the **latest date** automatically becomes the new headline number.
3. If `src/i18n/content.ar.ts` exists, add the new `label` to `totalsLabelAr`
   (with an Arabic rendering) so the chart axis localizes.
4. Run `npm run build` to validate and compile.
5. Summarize the change — call out the new headline number and the resulting
   "net change" delta — and remind me to review/commit. Do not commit unless I
   explicitly ask.
