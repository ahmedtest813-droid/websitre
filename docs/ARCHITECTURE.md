# Find My Cars — Architecture

This document is the reference for how the MVP is built. Keep it updated when a
decision changes.

## 1. Technology stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js 16 (App Router)** | Server-rendered pages for SEO, file-based routing, static generation for car pages. |
| Language | **TypeScript (strict)** | The scoring engine and calculators are numeric code; types catch unit/shape mistakes. |
| Styling | **Tailwind CSS v4** | Design tokens live in `app/globals.css` (`@theme`). No component library. |
| Database | **PostgreSQL on Supabase** (from Phase 2) | Managed Postgres + a free table editor that doubles as the admin UI for car data. |
| Hosting | **Vercel** | Zero-config for Next.js. |
| Analytics | Cookie-less provider (Plausible or Umami), wired through `lib/analytics` | Privacy-friendly; no consent banner needed for basic usage stats. |

Deliberately **not** used: auth, ORM, state-management library, UI kit, icon
library, form library, AI/LLM calls. Each can be added later if a real need appears.

**Data access decision.** Pages never query the database directly. They call a
repository in `lib/data/`. In Phase 2 the repository reads typed seed files from
`data/`; when Supabase is connected, only the repository changes. This means the
whole app works locally with no database account, and switching to Supabase is
a one-file change.

## 2. Folder structure

```text
find-my-cars/
├── app/                         # Routes only — thin pages that compose components
│   ├── layout.tsx               # Shell, fonts, default metadata
│   ├── page.tsx                 # Home
│   ├── find-my-car/
│   │   ├── page.tsx             # Questionnaire
│   │   └── result/[id]/page.tsx # Shareable result (id = encoded answers)
│   ├── compare/                 # Phase 3  (+ /compare/[pair] for SEO pairs)
│   ├── car-cost/                # Phase 4
│   ├── cars/[brand]/[model]/    # Phase 2  car profile pages
│   ├── used-car-price/          # Phase 5  (architecture only)
│   ├── sitemap.ts, robots.ts, not-found.tsx
├── components/
│   ├── ui/                      # Design-system primitives (Button, Card, Badge, OptionTile, Icons)
│   ├── layout/                  # Header, footer, Container, ComingSoon
│   ├── home/                    # Home page sections
│   └── find-my-car/             # Questionnaire + its inputs, answers summary
├── config/                      # Tunable values — NOT logic
│   ├── site.ts                  # Name, URL, navigation
│   ├── find-my-car.ts           # Questions, options, limits, distance presets
│   └── scoring.ts               # Base weights, priority multipliers
├── lib/                         # Business logic — no React imports allowed
│   ├── find-my-car/             # Answer types, validation, share-code encoding
│   ├── scoring/                 # Phase 2: filters, criterion scorers, weights, ranking, explanations
│   ├── calculators/             # Phase 4: loan, fuel, depreciation, TCO
│   ├── valuation/               # Phase 5: used-car fair price (interfaces first)
│   ├── data/                    # Phase 2: repository (seed files now, Supabase later)
│   ├── analytics/               # Typed events + privacy helpers
│   ├── types/                   # Domain types (CarVersion, Provenance…)
│   └── format.ts, cn.ts
├── data/                        # Phase 2: seed data, one file per model, marked demo/estimate/verified
├── supabase/migrations/         # SQL schema (source of truth for the database)
└── docs/                        # This file
```

Rule of thumb: **`lib/` never imports from `components/` or `app/`.** That keeps
the scoring engine testable in isolation and reusable (e.g. by an API route later).

## 3. Database schema

Full SQL: [`supabase/migrations/0001_initial_schema.sql`](../supabase/migrations/0001_initial_schema.sql).

```text
brands ─┐
        └─< models ─┐
                    └─< versions ──┬── version_prices      (price history, per source)
                                   ├── ownership_estimates (maintenance, repairs, insurance, tax)
                                   ├── car_ratings         (reliability, safety, resale, comfort)
                                   └── used_listings       (Phase 5 comparables)
sources        (every number points to where it came from)
fuel_prices    (effective-dated, so fuel cost is updateable)
```

Key design choices:

- **A "car" is a version (trim)**, e.g. *Kia Picanto 1.2 GT-Line AT*. Brand and
  model pages aggregate versions. Scoring ranks versions.
- **Every data group carries provenance**: `origin` (`verified` / `estimate` /
  `demo`), `confidence` (`high` / `medium` / `low`), `source_id`, `updated_at`.
  The UI uses this to show "Estimate", "Data unavailable" or "Confidence: Low"
  instead of pretending.
- **Unknown values are `NULL`**, never zero. A missing boot volume is not a 0 L boot.
- **Prices are a separate history table** so price changes don't overwrite the past
  and the used-car module can reuse the same shape.
- **Row Level Security** is on; the public (anon) key can only read.
- `fiscal_hp` (puissance fiscale) is stored because Tunisian annual tax (vignette)
  and insurance depend on it.

## 4. Main components

| Component | Responsibility |
|---|---|
| `SiteHeader` / `SiteFooter` | Navigation; footer carries the "estimates, not guarantees" disclaimer. |
| `Button` / `ButtonLink` | Primary, secondary, ghost, inverted variants. |
| `Card`, `Badge` | Content surfaces; badges for confidence and data origin. |
| `OptionTile` | Large tap-friendly radio/checkbox used by every question. |
| `Questionnaire` | Step state machine for Find My Car (client component). |
| `BudgetInput`, `DistanceInput`, `PriorityPicker` | Specialised question inputs. |
| `AnswersSummary` | Read-only view of a user's answers (result page). |
| *Phase 2*: `ResultCard`, `ScoreBreakdown`, `WhyThisCar`, `ConfidenceBadge` | Scored recommendation with explanation. |

## 5. Find My Car data flow

```text
/find-my-car  (Questionnaire, client)
   │  validateField() per step  ─ lib/find-my-car/validation.ts
   │  validateAnswers() on submit
   │  encodeAnswers() → "1yq0-15o-ncpamed"
   ▼
/find-my-car/result/1yq0-15o-ncpamed   (server component)
   │  decodeAnswers()  → invalid? 404
   │  carRepository.listVersions()          (Phase 2)
   │  recommend(answers, cars, config)      (Phase 2, pure function)
   ▼
Top 5 + score breakdown + "Why this car?" + confidence
```

**Sharing without login or storage:** the result id *is* the answers, compactly
encoded (`lib/find-my-car/share-code.ts`). Anyone opening the link gets the same
answers re-scored against current data. No database table, no personal data stored.
The code is versioned (leading `1`) so the format can evolve without breaking old links.

## 6. Scoring engine architecture (Phase 2)

All pure functions in `lib/scoring/`, no React, no I/O:

```text
filters.ts      applyHardFilters(cars, answers) → { eligible, excluded[] with reason }
criteria/*.ts   one scorer per criterion → { score 0–100 | null, facts[] }
weights.ts      buildWeights(BASE_WEIGHTS, priorities, PRIORITY_MULTIPLIERS) → normalised to 1
score.ts        Σ(criterion score × normalised weight)  (null scores handled explicitly)
confidence.ts   combine data provenance → high / medium / low
explain.ts      turn top criterion scores + facts into "Why this car?" lines
recommend.ts    orchestrates the above → ranked top 5
```

Config lives in `config/scoring.ts` (weights, multipliers, thresholds) so tuning
never requires touching the algorithm. Explanations are generated only from
computed scores and the facts each scorer returns — never free text.

**Missing data rule:** a criterion with no data is excluded from that car's
weighted sum and the weights are re-normalised over the criteria that do have
data; the car's confidence drops in proportion to the weight that was missing.
This avoids both inventing a value and unfairly scoring the car as 0.

## 7. Development phases

1. **Foundation** *(this phase)* — architecture, schema, design system, routing, home, questionnaire, share codes, analytics plumbing, SEO basics.
2. **Recommendations** — domain types + repository, 15–20 seeded cars (marked demo/estimate), scoring engine + unit tests, results page, car profile pages.
3. **Compare** — two-car comparison, factual difference summary, SEO pair pages.
4. **Car Cost Calculator** — loan, fuel, depreciation, TCO, breakdown; reused by car pages and compare.
5. **Used Car Fair Price** — schema + interfaces + input form; valuation only once real comparable data exists.

## 8. Technical risks

| Risk | Mitigation |
|---|---|
| **Data quality is the product.** Reliable Tunisian prices, insurance and resale data are hard to obtain and change often. | Provenance on every group; `demo` values are labelled in the UI; build a simple update routine (Supabase table editor) before scaling the catalogue. |
| **Reliability / resale scores are subjective.** | Document the method per score in `sources`; show confidence; start with fewer, defensible criteria rather than fake precision. |
| **Weights can produce odd rankings** with only 15–20 cars. | Unit tests with golden scenarios; review top-5 output manually for common profiles before launch. |
| **Language.** The Tunisian car market mostly reads French (and Arabic). The MVP is English. | Keep all copy in `config/` and components (no strings in `lib/`) so adding `fr` via Next.js i18n routing is mechanical. Decide before SEO traffic matters — URLs change with locale. |
| **Used market has no clean public price feed.** | Phase 5 stays architecture-only until comparable data is collected; no fake valuations. |
| **Financing terms** (autofinancement rules, bank rates) differ by bank. | Always labelled "Estimated"; rates are user inputs with sensible defaults. |
| **Share links re-score with live data**, so a shared result can change after a data update. | Show "Data updated: …" on results; acceptable for MVP. If frozen snapshots are needed later, add a `shared_results` table. |
