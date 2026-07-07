// Synthetic customer dataset modeled on the classic Telco Churn schema.
// Deterministic (seeded) so KPIs are stable across renders.

export interface Customer {
  id: string;
  gender: "Male" | "Female";
  seniorCitizen: boolean;
  partner: boolean;
  dependents: boolean;
  tenure: number; // months
  contract: "Month-to-month" | "One year" | "Two year";
  internetService: "DSL" | "Fiber optic" | "No";
  paymentMethod:
    | "Electronic check"
    | "Mailed check"
    | "Bank transfer"
    | "Credit card";
  monthlyCharges: number;
  totalCharges: number;
  churn: boolean;
}

// Simple seeded PRNG (mulberry32)
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick<T>(rng: () => number, items: [T, number][]): T {
  const total = items.reduce((s, [, w]) => s + w, 0);
  let r = rng() * total;
  for (const [item, w] of items) {
    if ((r -= w) <= 0) return item;
  }
  return items[items.length - 1][0];
}

function buildCustomers(n: number): Customer[] {
  const rng = mulberry32(20240517);
  const out: Customer[] = [];
  for (let i = 0; i < n; i++) {
    const gender = rng() < 0.505 ? "Male" : "Female";
    const seniorCitizen = rng() < 0.162;
    const partner = rng() < 0.483;
    const dependents = rng() < 0.3;
    const contract = pick<Customer["contract"]>(rng, [
      ["Month-to-month", 55],
      ["One year", 21],
      ["Two year", 24],
    ]);
    const internetService = pick<Customer["internetService"]>(rng, [
      ["Fiber optic", 44],
      ["DSL", 34],
      ["No", 22],
    ]);
    const paymentMethod = pick<Customer["paymentMethod"]>(rng, [
      ["Electronic check", 34],
      ["Mailed check", 23],
      ["Bank transfer", 22],
      ["Credit card", 21],
    ]);

    const tenure =
      contract === "Two year"
        ? 20 + Math.floor(rng() * 52)
        : contract === "One year"
          ? 8 + Math.floor(rng() * 48)
          : 1 + Math.floor(rng() * 40);

    let monthlyCharges =
      internetService === "Fiber optic"
        ? 70 + rng() * 45
        : internetService === "DSL"
          ? 45 + rng() * 35
          : 18 + rng() * 12;
    monthlyCharges = Math.round(monthlyCharges * 100) / 100;
    const totalCharges =
      Math.round(monthlyCharges * Math.max(1, tenure) * (0.95 + rng() * 0.1) * 100) / 100;

    // Churn probability driven by realistic risk factors.
    let p = 0.06;
    if (contract === "Month-to-month") p += 0.32;
    if (contract === "One year") p += 0.06;
    if (internetService === "Fiber optic") p += 0.14;
    if (paymentMethod === "Electronic check") p += 0.14;
    if (tenure < 12) p += 0.16;
    if (tenure > 40) p -= 0.1;
    if (seniorCitizen) p += 0.08;
    if (!partner) p += 0.05;
    if (monthlyCharges > 90) p += 0.06;
    p = Math.min(0.92, Math.max(0.02, p));
    const churn = rng() < p;

    out.push({
      id: `CUST-${(10000 + i).toString()}`,
      gender,
      seniorCitizen,
      partner,
      dependents,
      tenure,
      contract,
      internetService,
      paymentMethod,
      monthlyCharges,
      totalCharges,
      churn,
    });
  }
  return out;
}

export const CUSTOMERS: Customer[] = buildCustomers(7043);

// Risk scoring used for "High Risk Customers" and segmentation.
export function riskScore(c: Customer): number {
  let s = 0;
  if (c.contract === "Month-to-month") s += 35;
  if (c.internetService === "Fiber optic") s += 15;
  if (c.paymentMethod === "Electronic check") s += 15;
  if (c.tenure < 12) s += 20;
  if (c.seniorCitizen) s += 8;
  if (!c.partner) s += 4;
  if (c.monthlyCharges > 90) s += 8;
  return Math.min(100, s);
}

export function segment(c: Customer): "Premium" | "High Value" | "Standard" | "At Risk" {
  if (riskScore(c) >= 60) return "At Risk";
  if (c.monthlyCharges >= 85 && c.tenure >= 24) return "Premium";
  if (c.tenure >= 36 || c.totalCharges >= 4000) return "High Value";
  return "Standard";
}
