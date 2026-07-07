import { Customer } from "../data/dataset";
import {
  churnByDimension,
  computeKpis,
  fmtNum,
  fmtMoney,
  fmtMoneyFull,
  fmtPct,
} from "../data/metrics";
import { KpiCard, ChartCard, SectionTitle, InsightCard, Pill } from "../components/ui";
import {
  VBarChart,
  HBarChart,
  Heatmap,
  ScatterPlot,
  TrendChart,
} from "../components/charts";
import {
  IcExit,
  IcShield,
  IcAlert,
  IcGauge,
  IcUsers,
} from "../components/icons";

export function Churn({ data }: { data: Customer[] }) {
  const k = computeKpis(data);

  const byContract = churnByDimension(data, (c) => c.contract, [
    "Month-to-month",
    "One year",
    "Two year",
  ]);
  const byPayment = churnByDimension(data, (c) => c.paymentMethod);
  const byInternet = churnByDimension(data, (c) => c.internetService, [
    "Fiber optic",
    "DSL",
    "No",
  ]);

  const rateData = (arr: ReturnType<typeof churnByDimension>) =>
    arr.map((d) => ({ name: d.name, value: Math.round(d.churnRate * 10) / 10 }));

  const chargeChurn = ["<$30", "$30-60", "$60-90", ">$90"].map((label, i) => {
    const ranges = [
      [0, 30],
      [30, 60],
      [60, 90],
      [90, 999],
    ][i];
    const rows = data.filter(
      (c) => c.monthlyCharges >= ranges[0] && c.monthlyCharges < ranges[1]
    );
    const churned = rows.filter((r) => r.churn).length;
    return {
      name: label,
      value: rows.length ? Math.round((churned / rows.length) * 1000) / 10 : 0,
    };
  });

  const tenureChurn = ["0-12", "13-24", "25-36", "37-48", "49-60", "60+"].map(
    (label, i) => {
      const lo = i * 12;
      const hi = i === 5 ? 999 : lo + 12;
      const rows = data.filter((c) => c.tenure >= lo && c.tenure < hi);
      const churned = rows.filter((r) => r.churn).length;
      return {
        name: label,
        value: rows.length ? Math.round((churned / rows.length) * 1000) / 10 : 0,
      };
    }
  );

  const genderChurn = rateData(
    churnByDimension(data, (c) => c.gender, ["Male", "Female"])
  );
  const seniorChurn = rateData(
    churnByDimension(data, (c) => (c.seniorCitizen ? "Senior" : "Non-Senior"), [
      "Senior",
      "Non-Senior",
    ])
  );

  // Matrix Contract x Payment -> churn rate
  const contracts = ["Month-to-month", "One year", "Two year"];
  const payments = ["Electronic check", "Mailed check", "Bank transfer", "Credit card"];
  const matrix = contracts.map((ct) =>
    payments.map((pm) => {
      const rows = data.filter(
        (c) => c.contract === ct && c.paymentMethod === pm
      );
      const churned = rows.filter((r) => r.churn).length;
      return rows.length ? Math.round((churned / rows.length) * 1000) / 10 : 0;
    })
  );

  // scatter sample
  const scatter = data
    .filter((_, i) => i % 12 === 0)
    .map((c) => ({
      x: c.tenure,
      y: c.monthlyCharges,
      z: c.totalCharges / 100,
      churn: c.churn,
    }));

  const sortedContract = [...byContract].sort(
    (a, b) => b.churnRate - a.churnRate
  );
  const highest = sortedContract[0];
  const lowest = sortedContract[sortedContract.length - 1];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <SectionTitle
          eyebrow="Page 4 · Customer Churn Analysis"
          title="Customer Churn Analysis"
          subtitle="The core diagnostic page — what drives attrition and who is at risk."
        />
        <span className="ml-auto hidden sm:block">
          <Pill color="#EF4444">Primary Analysis Page</Pill>
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <KpiCard label="Churned Customers" value={fmtNum(k.churnCustomers)} accent="#EF4444" icon={<IcExit className="h-5 w-5" />} trend={fmtPct(k.churnRate)} trendUp={false} />
        <KpiCard label="Retained Customers" value={fmtNum(k.activeCustomers)} accent="#22C55E" icon={<IcShield className="h-5 w-5" />} trend={fmtPct(k.retentionRate)} trendUp />
        <KpiCard label="Churn Rate" value={fmtPct(k.churnRate)} accent="#F59E0B" icon={<IcGauge className="h-5 w-5" />} />
        <KpiCard label="Revenue Lost" value={fmtMoney(k.revenueLost)} sub={fmtMoneyFull(k.revenueLost)} accent="#EF4444" icon={<IcAlert className="h-5 w-5" />} />
        <KpiCard label="High Risk Customers" value={fmtNum(k.highRiskCustomers)} sub="Month-to-month & tenure <12mo" accent="#8B5CF6" icon={<IcUsers className="h-5 w-5" />} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ChartCard title="Churn by Contract" subtitle="Churn rate % by contract type">
          <VBarChart data={rateData(byContract)} bars={[{ key: "value", color: "#EF4444", name: "Churn %" }]} formatter={(v) => v + "%"} />
        </ChartCard>
        <ChartCard title="Churn by Payment Method" subtitle="Churn rate % by payment method">
          <HBarChart data={rateData(byPayment)} color="#F59E0B" formatter={(v) => v + "%"} />
        </ChartCard>
        <ChartCard title="Churn by Internet Service" subtitle="Churn rate % by service">
          <VBarChart data={rateData(byInternet)} bars={[{ key: "value", color: "#8B5CF6", name: "Churn %" }]} formatter={(v) => v + "%"} />
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ChartCard title="Churn by Monthly Charges" subtitle="Churn rate % by charge band">
          <VBarChart data={chargeChurn} bars={[{ key: "value", color: "#EF4444", name: "Churn %" }]} formatter={(v) => v + "%"} />
        </ChartCard>
        <ChartCard title="Churn by Tenure" subtitle="Churn rate % by tenure band (months)">
          <TrendChart data={tenureChurn} type="line" areas={[{ key: "value", color: "#F59E0B", name: "Churn %" }]} formatter={(v) => v + "%"} />
        </ChartCard>
        <ChartCard title="Churn by Demographics" subtitle="Churn rate % — gender & senior status">
          <VBarChart data={[...genderChurn, ...seniorChurn]} bars={[{ key: "value", color: "#3B82F6", name: "Churn %" }]} formatter={(v) => v + "%"} />
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard title="Matrix: Contract × Payment Method" subtitle="Churn rate % heatmap">
          <Heatmap rows={contracts} cols={["E-check", "Mail", "Bank", "Card"]} matrix={matrix} valueFormat={(v) => v + "%"} />
        </ChartCard>
        <ChartCard title="Customer Risk Analysis" subtitle="Tenure vs monthly charges · size = lifetime value">
          <ScatterPlot data={scatter} xName="Tenure" yName="Monthly $" formatter={(v) => String(v)} />
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="space-y-3">
          <InsightCard icon="🔥" tone="red" title={`Highest churn: ${highest.name}`} body={`This segment churns at ${fmtPct(highest.churnRate)} — the single biggest attrition driver in the base.`} />
          <InsightCard icon="🛡️" tone="green" title={`Lowest churn: ${lowest.name}`} body={`Only ${fmtPct(lowest.churnRate)} churn — the retention benchmark to replicate across other segments.`} />
          <InsightCard icon="💸" tone="orange" title="Revenue-loss drivers" body={`Churn has already cost ${fmtMoneyFull(k.revenueLost)}. Fiber + electronic-check + short tenure compound the loss.`} />
        </div>
        <div className="space-y-3">
          <InsightCard icon="⚠️" tone="purple" title="Top risk factors" body="Month-to-month contract, tenure under 12 months, electronic check payment, and fiber optic service are the strongest churn signals." />
          <InsightCard icon="🎯" tone="blue" title="Recommendation: risk-based save program" body={`Score every customer and route the ${fmtNum(k.highRiskCustomers)} high-risk accounts to a dedicated retention desk with tailored offers.`} />
          <InsightCard icon="🚀" tone="green" title="Recommendation: contract conversion" body="Aggressively convert month-to-month customers to annual terms — the highest-ROI structural fix for churn." />
        </div>
      </div>
    </div>
  );
}
