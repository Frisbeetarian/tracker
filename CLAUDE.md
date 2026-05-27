# MQ-9 Reaper Tracker — Project Guide

A source-linked tracker of how many **MQ-9 Reaper** drones remain in the U.S.
Air Force fleet. React + Vite + TypeScript + Tailwind v4, prerendered to static
HTML, served as a static site on Railway. Retro 8-bit / tactical-HUD design.

## Commands

```bash
npm run dev         # local dev server (Vite)
npm run build       # tsc + vite-react-ssg build → dist/ (prerendered)
npm run preview     # preview the production build
npm run start       # serve dist/ on $PORT (how Railway runs it)
npm run typecheck   # tsc --noEmit
npm run lighthouse  # build + run Lighthouse CI locally
```

## Core principle — read before touching data

The site is an **estimate with receipts**. The honesty model is the whole point;
don't "simplify" it away:

- **The headline number is the latest officially-stated fleet total, taken
  directly from a sourced figure — NOT computed by subtracting losses.** Forcing
  `baseline − losses` produces a falsely-precise, wrong number (retirements also
  shrink the fleet; loss reports overlap). See `Methodology.tsx`.
- `totals[]` = official totals over time (drives headline + trend chart).
- `events[]` = documented losses, shown for context only, **never summed** into
  the headline. "Net change" (stat grid) ≠ "documented losses" by design.

## Updating the data

All data lives in [`src/data/inventory.json`](src/data/inventory.json). **There
is no backend** — edit this file and commit; git history is the audit trail.
Types/validation in [`src/lib/inventory.ts`](src/lib/inventory.ts) make
`npm run build` fail on a malformed entry. The README has copy-paste templates
for adding a total or an event.

## Architecture notes / gotchas

- **Prerendered SPA** via `vite-react-ssg` (`src/main.tsx`). The page renders to
  static HTML at build (good for SEO/crawlers) and hydrates on the client.
  Anything that touches the DOM, `window`, or measures layout must be
  **client-only** (gate behind a mounted flag) so prerender + hydration stay
  clean — see `TrendChart.tsx` (Recharts is lazy + client-only), `BootSequence`,
  and `useCountUp`. Keep the prerendered HTML matching the first client render.
- **Performance is gated by Lighthouse CI** (`.github/workflows/lighthouse.yml`,
  budget in `lighthouserc.json`, runs on PRs to `main`). Don't regress CLS
  (< 0.1) or the category floors.
  - **Do NOT reintroduce render-blocking Google Fonts.** Fonts are self-hosted
    in `public/fonts/` and preloaded in `index.html`; declared in `index.css`.
    This is what keeps CLS down — adding a `<link>` to fonts.googleapis.com
    would undo it.
  - Cache headers for hashed assets/fonts live in `public/serve.json`.
- **Styling**: Tailwind v4 with design tokens in `@theme` (`index.css`); pixel
  fonts (`Press Start 2P` headings, `VT323` body), neon glow + CRT scanlines.
- **Analytics**: Cloudflare Web Analytics beacon in `index.html` (cookieless).
- **Internationalization** (landing via PR #1 / branch `arabic-i18n`): English +
  Arabic with a context-based i18n (`src/i18n/`). English is the prerender
  default. Arabic content has English fallback. The Arabic font (Noto Kufi) is
  `unicode-range`-scoped and **not preloaded**, so English visitors don't
  download it — keep it that way.

## Deploy

Static site on **Railway** (`railway.json`, builder `RAILPACK`, served by
`serve` on `$PORT`). Pushing to `main` deploys. Custom domain `reapertracker.com`
via Namecheap (apex uses an ALIAS record; see README). Apex is canonical;
`www` → apex via the inline redirect in `index.html`.

## Conventions

- Match the surrounding code style; components are small and presentational.
- Commit/push only when asked. Branch off `main` for features; PRs into `main`
  run the Lighthouse check.
