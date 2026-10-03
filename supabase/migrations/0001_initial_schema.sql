-- Find My Cars — initial schema
-- Conventions:
--   * Money is stored in Tunisian dinars (TND) as numeric(12,3) — TND has 3 decimals (millimes).
--   * Unknown values are NULL, never 0.
--   * Every data group carries provenance: origin, confidence, source_id, updated_at.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
create type market_status     as enum ('new', 'used', 'new_and_used', 'discontinued');
create type fuel_type         as enum ('petrol', 'diesel', 'hybrid', 'plug_in_hybrid', 'electric');
create type transmission_type as enum ('manual', 'automatic');
create type body_type         as enum ('city_car', 'hatchback', 'sedan', 'suv', 'crossover', 'mpv', 'pickup', 'van', 'coupe', 'convertible', 'wagon');
create type data_origin       as enum ('verified', 'estimate', 'demo');
create type data_confidence   as enum ('high', 'medium', 'low');
create type source_kind       as enum ('official_dealer', 'manufacturer', 'euro_ncap', 'government', 'press', 'marketplace', 'internal_estimate', 'demo');
create type price_kind        as enum ('new_list', 'new_promo', 'used_typical');

-- ---------------------------------------------------------------------------
-- Sources: every number should be traceable to one of these
-- ---------------------------------------------------------------------------
create table sources (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  kind        source_kind not null,
  url         text,
  notes       text,
  accessed_at date,
  created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Catalogue: brand → model → version (trim)
-- ---------------------------------------------------------------------------
create table brands (
  id         uuid primary key default gen_random_uuid(),
  slug       text not null unique check (slug ~ '^[a-z0-9-]+$'),
  name       text not null,
  country    text,
  created_at timestamptz not null default now()
);

create table models (
  id         uuid primary key default gen_random_uuid(),
  brand_id   uuid not null references brands(id) on delete restrict,
  slug       text not null check (slug ~ '^[a-z0-9-]+$'),
  name       text not null,
  body_type  body_type,
  segment    text,                       -- e.g. 'A', 'B', 'C-SUV'
  image_url  text,
  created_at timestamptz not null default now(),
  unique (brand_id, slug)
);

create table versions (
  id                     uuid primary key default gen_random_uuid(),
  model_id               uuid not null references models(id) on delete restrict,
  slug                   text not null check (slug ~ '^[a-z0-9-]+$'),
  trim_name              text not null,           -- e.g. '1.2 GT-Line AT'
  model_year             smallint check (model_year between 1990 and 2100),
  market_status          market_status not null,
  is_voiture_populaire   boolean not null default false,

  -- Powertrain
  fuel                   fuel_type not null,
  engine_cc              integer check (engine_cc > 0),
  power_hp               integer check (power_hp > 0),
  torque_nm              integer check (torque_nm > 0),
  fiscal_hp              smallint check (fiscal_hp > 0),    -- puissance fiscale (tax & insurance)
  transmission           transmission_type not null,
  gears                  smallint check (gears > 0),

  -- Consumption: L/100km for combustion/hybrid, kWh/100km for electric
  consumption_combined   numeric(5,2) check (consumption_combined > 0),
  consumption_city       numeric(5,2) check (consumption_city > 0),
  consumption_highway    numeric(5,2) check (consumption_highway > 0),
  consumption_standard   text,                    -- 'WLTP', 'NEDC', 'manufacturer', 'estimate'

  -- Practicality
  seats                  smallint not null check (seats between 1 and 9),
  doors                  smallint check (doors between 2 and 5),
  boot_liters            integer check (boot_liters >= 0),
  length_mm              integer check (length_mm > 0),
  width_mm               integer check (width_mm > 0),
  height_mm              integer check (height_mm > 0),
  wheelbase_mm           integer check (wheelbase_mm > 0),
  kerb_weight_kg         integer check (kerb_weight_kg > 0),

  -- Warranty
  warranty_years         smallint check (warranty_years >= 0),
  warranty_km            integer check (warranty_km >= 0),

  -- Provenance of the spec sheet
  specs_origin           data_origin not null,
  specs_confidence       data_confidence not null,
  specs_source_id        uuid references sources(id),
  updated_at             timestamptz not null default now(),
  created_at             timestamptz not null default now(),

  unique (model_id, slug)
);

-- ---------------------------------------------------------------------------
-- Prices (history; latest effective row is the current price)
-- ---------------------------------------------------------------------------
create table version_prices (
  id             uuid primary key default gen_random_uuid(),
  version_id     uuid not null references versions(id) on delete cascade,
  kind           price_kind not null,
  amount_tnd     numeric(12,3) not null check (amount_tnd > 0),
  effective_date date not null,
  origin         data_origin not null,
  confidence     data_confidence not null,
  source_id      uuid references sources(id),
  created_at     timestamptz not null default now()
);
create index version_prices_lookup on version_prices (version_id, kind, effective_date desc);

-- ---------------------------------------------------------------------------
-- Ownership cost estimates (annual, TND)
-- ---------------------------------------------------------------------------
create table ownership_estimates (
  version_id                 uuid primary key references versions(id) on delete cascade,
  annual_maintenance_tnd     numeric(10,3) check (annual_maintenance_tnd >= 0),
  annual_repair_reserve_tnd  numeric(10,3) check (annual_repair_reserve_tnd >= 0),
  annual_insurance_tnd       numeric(10,3) check (annual_insurance_tnd >= 0),
  annual_tax_tnd             numeric(10,3) check (annual_tax_tnd >= 0),   -- vignette
  origin                     data_origin not null,
  confidence                 data_confidence not null,
  source_id                  uuid references sources(id),
  notes                      text,
  updated_at                 timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Ratings (0–100). Each needs a documented method in sources.notes.
-- ---------------------------------------------------------------------------
create table car_ratings (
  version_id         uuid primary key references versions(id) on delete cascade,
  reliability_score  smallint check (reliability_score between 0 and 100),
  safety_score       smallint check (safety_score between 0 and 100),
  safety_ncap_stars  smallint check (safety_ncap_stars between 0 and 5),
  safety_ncap_year   smallint,
  resale_score       smallint check (resale_score between 0 and 100),
  comfort_score      smallint check (comfort_score between 0 and 100),
  origin             data_origin not null,
  confidence         data_confidence not null,
  source_id          uuid references sources(id),
  notes              text,
  updated_at         timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Fuel prices (effective-dated so the calculator can be updated)
-- ---------------------------------------------------------------------------
create table fuel_prices (
  id              uuid primary key default gen_random_uuid(),
  fuel            text not null check (fuel in ('petrol_unleaded', 'diesel', 'diesel_premium', 'electricity')),
  unit            text not null check (unit in ('L', 'kWh')),
  price_tnd       numeric(8,3) not null check (price_tnd > 0),
  effective_date  date not null,
  origin          data_origin not null,
  source_id       uuid references sources(id),
  created_at      timestamptz not null default now(),
  unique (fuel, effective_date)
);

-- ---------------------------------------------------------------------------
-- Phase 5 — Used car fair price: comparable market data
-- Populated only from real listings. No valuation logic depends on demo rows.
-- ---------------------------------------------------------------------------
create table used_listings (
  id              uuid primary key default gen_random_uuid(),
  version_id      uuid references versions(id) on delete set null, -- null until matched
  raw_title       text not null,
  brand_slug      text not null,
  model_slug      text not null,
  model_year      smallint not null check (model_year between 1980 and 2100),
  mileage_km      integer not null check (mileage_km >= 0),
  asking_price_tnd numeric(12,3) not null check (asking_price_tnd > 0),
  fuel            fuel_type,
  transmission    transmission_type,
  governorate     text,
  seller_type     text check (seller_type in ('private', 'dealer')),
  listed_at       date not null,
  removed_at      date,
  url             text,
  source_id       uuid not null references sources(id),
  created_at      timestamptz not null default now()
);
create index used_listings_match on used_listings (brand_slug, model_slug, model_year);

-- ---------------------------------------------------------------------------
-- Convenience view: current new price per version
-- ---------------------------------------------------------------------------
create view current_new_prices as
select distinct on (version_id)
  version_id, kind, amount_tnd, effective_date, origin, confidence, source_id
from version_prices
where kind in ('new_list', 'new_promo') and effective_date <= current_date
order by version_id, effective_date desc, kind;

-- ---------------------------------------------------------------------------
-- Row Level Security: public can read catalogue data, nobody writes via anon key
-- ---------------------------------------------------------------------------
alter table sources             enable row level security;
alter table brands              enable row level security;
alter table models              enable row level security;
alter table versions            enable row level security;
alter table version_prices      enable row level security;
alter table ownership_estimates enable row level security;
alter table car_ratings         enable row level security;
alter table fuel_prices         enable row level security;
alter table used_listings       enable row level security;

create policy "public read" on sources             for select using (true);
create policy "public read" on brands              for select using (true);
create policy "public read" on models              for select using (true);
create policy "public read" on versions            for select using (true);
create policy "public read" on version_prices      for select using (true);
create policy "public read" on ownership_estimates for select using (true);
create policy "public read" on car_ratings         for select using (true);
create policy "public read" on fuel_prices         for select using (true);
-- used_listings: no public policy (raw scraped/collected data stays server-side)
