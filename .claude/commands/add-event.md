---
description: Add a new sourced MQ-9 loss/addition event to inventory.json
argument-hint: [one-line description of what happened]
---

Add a new event to the `events` array in `src/data/inventory.json` for: $ARGUMENTS

Follow the schema/types in `src/lib/inventory.ts` exactly. Steps:

1. Gather the required fields. If any are missing from my description, ask me
   (use AskUserQuestion) — **do not invent them**, especially sources:
   - `id`: unique kebab-case slug prefixed with year(-month), e.g. `2026-06-foo`.
   - `date`: ISO `YYYY-MM-DD` (best estimate if the exact day is unknown).
   - `type`: `loss` or `addition`.
   - `count`: number of airframes.
   - `cause`: one of `shootdown | crash | combat | retired | other`.
   - `title`: short plain-English headline.
   - `summary`: one or two sentences.
   - `confidence`: `confirmed` (official U.S. acknowledgement/investigation) |
     `reported` (credible reporting / adversary claim) | `estimated` (inferred).
   - `sources`: at least one `{ title, publisher, url }` with a **real** URL.
2. Insert it in `events` in the correct spot — the array is newest-first by date.
3. Honor the honesty model (see CLAUDE.md): events are context only and are
   **never summed** into the headline. Do not edit `totals` here.
4. If a Spanish/Arabic content file exists (`src/i18n/content.ar.ts`), offer to
   add the Arabic `title`/`summary` for this event id (English fallback is fine).
5. Run `npm run build` to confirm the data validates and the site compiles.
6. Summarize what you added and remind me to review and commit on a feature
   branch (direct commits to `main` are blocked by a hook).
