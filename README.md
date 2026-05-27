# MQ-9 Reaper Tracker

A source-linked tracker of how many **MQ-9 Reaper** drones remain in the U.S.
Air Force fleet. Retro 8-bit / tactical-HUD design. React + Vite + TypeScript +
Tailwind v4.

The site is an **estimate with receipts**: the headline number is the most
recent fleet total the Air Force has stated publicly, and every figure links to
its source.

## Develop

```bash
npm install
npm run dev      # local dev server
npm run build    # typecheck + production build to dist/
npm run preview  # serve the production build locally
```

## How the numbers work

All data lives in [`src/data/inventory.json`](src/data/inventory.json). There
is no backend and no database — **editing this file and committing is how you
update the site.** Git history is the audit trail.

The model deliberately does **not** compute the fleet size by subtracting
losses (that would be falsely precise — retirements also shrink the fleet, and
loss reports overlap). Instead:

- `totals[]` — officially-stated fleet totals over time. The most recent one is
  the headline number and drives the trend chart.
- `events[]` — documented losses/additions, shown in the log for context only.
  These are **not** summed into the headline.

### Add a new official total

Append to `totals` (keep them sourced):

```jsonc
{
  "date": "2026-09-30",          // ISO date the figure applies to
  "label": "End FY2026",         // short label for the chart
  "count": 130,
  "note": "Optional context.",
  "source": {
    "title": "Report or article title",
    "publisher": "Publisher (cite the org behind the number)",
    "url": "https://..."
  }
}
```

The headline auto-updates to whichever total has the latest `date`.

### Add a loss (or addition) event

Append to `events`:

```jsonc
{
  "id": "2026-06-example",       // unique slug
  "date": "2026-06-01",          // ISO date (best estimate if exact day unknown)
  "type": "loss",                // "loss" | "addition"
  "count": 1,                    // number of airframes
  "cause": "shootdown",          // shootdown | crash | combat | retired | other
  "title": "Short headline",
  "summary": "One or two sentences in plain English.",
  "confidence": "reported",      // confirmed | reported | estimated
  "sources": [
    { "title": "...", "publisher": "...", "url": "https://..." }
  ]
}
```

**Confidence:** `confirmed` = official U.S. acknowledgement/investigation ·
`reported` = credible reporting or adversary claim · `estimated` = inferred.

Types are enforced by `src/lib/inventory.ts`; `npm run build` will fail if an
entry is malformed, so it can't ship broken.

## Deploy

It's a static site — `npm run build` outputs `dist/`. Any static host works.

### Live deploy: Railway (current)

Railway expects a long-running service, so the app is served by [`serve`](https://www.npmjs.com/package/serve)
(see the `start` script) rather than just shipping `dist/`. Config is pinned in
[`railway.json`](railway.json).

1. **New Project → Deploy from GitHub repo →** select this repo.
2. Railway runs `npm install` → `npm run build` → `npm start` automatically.
3. Service → **Variables** → set `PORT=8080` (the app listens on `$PORT`; this
   makes the port deterministic).
4. Service → **Settings → Networking → Custom Domain** → add `reapertracker.com`
   and `www.reapertracker.com`, each with **target port `8080`**.

Sanity check: open the generated `*.up.railway.app` URL — if the tracker loads,
the service is healthy and anything else is just DNS.

### Custom domain DNS (Namecheap)

Railway shows a unique CNAME target + a `_railway-verify` TXT token per domain.
**The apex (`@`) cannot use a CNAME** (DNS forbids it) — use Namecheap's **ALIAS**
record type, which is their CNAME-flattening equivalent. Delete Namecheap's
default parking records (`URL Redirect @`, `CNAME www → parkingpage`) first.

| Type  | Host               | Value                                  |
| ----- | ------------------ | -------------------------------------- |
| ALIAS | `@`                | _(apex CNAME target from Railway)_     |
| TXT   | `_railway-verify`  | `railway-verify=…` _(apex token)_      |
| CNAME | `www`              | _(www CNAME target from Railway)_      |
| TXT   | `_railway-verify.www` | `railway-verify=…` _(www token)_    |

Verify resolution before expecting SSL:

```bash
dig reapertracker.com +short
dig www.reapertracker.com +short
dig txt _railway-verify.reapertracker.com +short
```

Railway auto-issues SSL once the records resolve.

### Canonical host

Apex (`reapertracker.com`) is canonical. `index.html` carries a
`<link rel="canonical">` plus a small inline script that redirects
`www.` → apex (preserving path/query/hash), so the two hosts don't get indexed
as duplicate content. `serve` only does path-based redirects, so this host-level
redirect is handled client-side.

### Other hosts

- **Vercel / Netlify**: import the repo, preset "Vite", output `dist` (these
  serve statics directly — no `serve`/`PORT` needed).
- **GitHub Pages**: publish `dist/` (set `base` in `vite.config.ts` if served
  from a subpath).

## Roadmap

- Arabic + English (i18n, RTL, Arabic font fallback) — deferred.
- Optional: a scheduled agent that drafts proposed events from news/gov sources
  into a review queue, keeping a human in the loop before any number changes.
