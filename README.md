# Find My Cars

Car decision platform for the Tunisian market: find the right car for your budget,
usage and priorities, compare cars, and estimate the real cost of ownership.

## Getting started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000.

| Script | What it does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build (also type-checks) |
| `npm run lint` | ESLint |

## Where things live

- `app/` — routes (thin pages)
- `components/` — UI (`ui/` = design-system primitives)
- `config/` — tunable values: questionnaire options, scoring weights, site settings
- `lib/` — business logic, no React (scoring, calculators, validation, analytics)
- `supabase/migrations/` — database schema
- `docs/ARCHITECTURE.md` — architecture, data flow, phases, risks (**read this first**)

## Status

- [x] Phase 1 — foundation, home, Find My Car questionnaire, shareable result links
- [ ] Phase 2 — car database, scoring engine, results page, car pages
- [ ] Phase 3 — compare
- [ ] Phase 4 — car cost calculator
- [ ] Phase 5 — used car fair price (architecture)
