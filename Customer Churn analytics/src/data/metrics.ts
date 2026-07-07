import { Customer, riskScore, segment } from "./dataset";

export interface Filters {
  gender: string;
  contract: string;
  internetService: string;
  paymentMethod: string;
  senior: string; // "All" | "Yes" | "No"
}

export const DEFAULT_FILTERS: Filters = {
  gender: "All",
  contract: "All",
  internetService: "All",
  paymentMethod: "All",
  senior: "All",
};

export function applyFilters(data: Customer[], f: Filters): Customer[] {
  return data.filter((c) => {
    if (f.gender !== "All" && c.gender !== f.gender) return false;
    if (f.contract !== "All" && c.contract !== f.contract) return false;
    if (f.internetService !== "All" && c.internetService !== f.internetService)
      return false;
    if (f.paymentMethod !== "All" && c.paymentMethod !== f.paymentMethod)
      return false;
    if (f.senior === "Yes" && !c.seniorCitizen) return false;
    if (f.senior === "No" && c.seniorCitizen) return false;
    return true;
  });
}

export interface Kpis {
  totalCustomers: number;
  activeCustomers: number;
  churnCustomers: number;
  retentionRate: number;
  churnRate: number;
  totalRevenue: number;
  avgMonthlyCharges: number;
  avgCLV: number;
  avgTenure: number;
  revenueLost: number;
  highRiskCustomers: number;
  premiumCustomers: number;
  highValueCustomers: number;
  standardCustomers: number;
  atRiskCustomers: number;
  avgRevenue: number;
}

export function computeKpis(data: Customer[]): Kpis {
  const totalCustomers = data.length || 1;
  const churn = data.filter((c) => c.churn);
  const active = data.filter((c) => !c.churn);
  const totalRevenue = data.reduce((s, c) => s + c.totalCharges, 0);
  const revenueLost = churn.reduce((s, c) => s + c.totalCharges, 0);
  const sumMonthly = data.reduce((s, c) => s + c.monthlyCharges, 0);
  const sumTenure = data.reduce((s, c) => s + c.tenure, 0);
  const avgMonthlyCharges = sumMonthly / totalCustomers;
  const avgTenure = sumTenure / totalCustomers;
  // Customer Lifetime Value: avg monthly * avg expected lifetime
  const avgCLV = avgMonthlyCharges * (avgTenure || 1);

  let high = 0,
    prem = 0,
    hv = 0,
    std = 0,
    ar = 0;
  for (const c of data) {
    if (riskScore(c) >= 60) high++;
    const seg = segment(c);
    if (seg === "Premium") prem++;
    else if (seg === "High Value") hv++;
    else if (seg === "Standard") std++;
    else ar++;
  }

  return {
    totalCustomers: data.length,
    activeCustomers: active.length,
    churnCustomers: churn.length,
    retentionRate: (active.length / totalCustomers) * 100,
    churnRate: (churn.length / totalCustomers) * 100,
    totalRevenue,
    avgMonthlyCharges,
    avgCLV,
    avgTenure,
    revenueLost,
    highRiskCustomers: high,
    premiumCustomers: prem,
    highValueCustomers: hv,
    standardCustomers: std,
    atRiskCustomers: ar,
    avgRevenue: totalRevenue / totalCustomers,
  };
}

// ---- grouping helpers ----
export function groupBy<T extends string>(
  data: Customer[],
  keyFn: (c: Customer) => T
) {
  const map = new Map<T, Customer[]>();
  for (const c of data) {
    const k = keyFn(c);
    if (!map.has(k)) map.set(k, []);
    map.get(k)!.push(c);
  }
  return map;
}

export function churnByDimension(
  data: Customer[],
  keyFn: (c: Customer) => string,
  order?: string[]
) {
  const map = groupBy(data, keyFn);
  let entries = Array.from(map.entries());
  if (order) {
    entries = order
      .filter((o) => map.has(o))
      .map((o) => [o, map.get(o)!] as [string, Customer[]]);
  }
  return entries.map(([name, rows]) => {
    const churned = rows.filter((r) => r.churn).length;
    const retained = rows.length - churned;
    return {
      name,
      total: rows.length,
      churned,
      retained,
      churnRate: rows.length ? (churned / rows.length) * 100 : 0,
      revenue: rows.reduce((s, r) => s + r.totalCharges, 0),
    };
  });
}

export const fmtNum = (n: number) =>
  new Intl.NumberFormat("en-US").format(Math.round(n));
export const fmtMoney = (n: number) => {
  if (Math.abs(n) >= 1_000_000)
    return "$" + (n / 1_000_000).toFixed(2) + "M";
  if (Math.abs(n) >= 1_000) return "$" + (n / 1_000).toFixed(1) + "K";
  return "$" + n.toFixed(0);
};
export const fmtMoneyFull = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
export const fmtPct = (n: number) => n.toFixed(1) + "%";
