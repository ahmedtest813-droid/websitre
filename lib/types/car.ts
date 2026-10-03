// Domain types for the car catalogue. Mirrors supabase/migrations/0001_initial_schema.sql.
// Unknown values are null — never 0 — so the UI can say "Data unavailable".

export type FuelType = "petrol" | "diesel" | "hybrid" | "plug_in_hybrid" | "electric";
export type TransmissionType = "manual" | "automatic";
export type MarketStatus = "new" | "used" | "new_and_used" | "discontinued";
export type BodyType =
  | "city_car"
  | "hatchback"
  | "sedan"
  | "suv"
  | "crossover"
  | "mpv"
  | "pickup"
  | "van"
  | "coupe"
  | "convertible"
  | "wagon";

/** verified = checked against a cited source; estimate = our reasoned estimate; demo = placeholder, never shown as fact. */
export type DataOrigin = "verified" | "estimate" | "demo";
export type Confidence = "high" | "medium" | "low";

export interface Provenance {
  origin: DataOrigin;
  confidence: Confidence;
  sourceId: string | null;
  /** ISO date */
  updatedAt: string;
}

export interface CarSpecs {
  fuel: FuelType;
  engineCc: number | null;
  powerHp: number | null;
  torqueNm: number | null;
  fiscalHp: number | null;
  transmission: TransmissionType;
  gears: number | null;
  /** L/100km, or kWh/100km for electric cars. */
  consumption: { combined: number | null; city: number | null; highway: number | null };
  seats: number;
  doors: number | null;
  bootLiters: number | null;
  dimensions: {
    lengthMm: number | null;
    widthMm: number | null;
    heightMm: number | null;
    wheelbaseMm: number | null;
  };
  kerbWeightKg: number | null;
  warranty: { years: number | null; km: number | null };
}

export interface CarPrice {
  kind: "new_list" | "new_promo" | "used_typical";
  amountTnd: number;
  effectiveDate: string;
  provenance: Provenance;
}

export interface OwnershipEstimates {
  annualMaintenanceTnd: number | null;
  annualRepairReserveTnd: number | null;
  annualInsuranceTnd: number | null;
  annualTaxTnd: number | null;
  provenance: Provenance;
}

export interface CarRatings {
  reliability: number | null;
  safety: number | null;
  resale: number | null;
  comfort: number | null;
  provenance: Provenance;
}

/** One buyable configuration — the unit that gets scored and compared. */
export interface CarVersion {
  id: string;
  slug: string;
  brand: { slug: string; name: string };
  model: { slug: string; name: string; bodyType: BodyType | null; segment: string | null };
  trimName: string;
  modelYear: number | null;
  marketStatus: MarketStatus;
  isVoiturePopulaire: boolean;
  imageUrl: string | null;
  specs: CarSpecs;
  specsProvenance: Provenance;
  price: CarPrice | null;
  ownership: OwnershipEstimates | null;
  ratings: CarRatings | null;
}
