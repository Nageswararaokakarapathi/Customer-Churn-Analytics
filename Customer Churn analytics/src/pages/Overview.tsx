import { Customer } from "../data/dataset";
import {
  computeKpis,
  churnByDimension,
  fmtNum,
  fmtMoney,
  fmtMoneyFull,
  fmtPct,
} from "../data/metrics";
import {
  KpiCard,
  ChartCard,
  SectionTitle,
  InsightCard,
} from "../components/ui";
import { DonutChart, VBarChart, TreemapChart, TrendChart } from "../components/charts";
import {
  IcUsers,
  IcCheck,
  IcExit,
  IcShield,
  IcGauge,
  IcMoney,
  IcClock,
  IcTrend,
  IcAlert,
  IcStar,
} from "../components/icons";

export function Overview({ data }: { data: Customer[] }) {
  const k = computeKpis(data);

  const custDist = [
    { name: "Active", value: k.activeCustomers },
    { name: "Churned", value: k.churnCustomers },
  ];
  const contractDist = churnByDimension(data, (c) => c.contract, [
    "Month-to-month",
    "One year",
    "Two year",
  ]).map((d) => ({ name: d.name, value: d.total }));
  const internetDist = churnByDimension(data, (c) => c.internetService, [
    "Fiber optic",
    "DSL",
    "No",
  ]).map((d) => ({ name: d.name, value: d.total }));

  const revByContract = churnByDimension(data, (c) => c.contract, [
    "Month-to-month",
    "One year",
    "Two year",
  ]).map((d) => ({ name: d.name, value: Math.round(d.revenue) }));

  // Monthly charges buckets
  const chargeBuckets = [
    { name: "<$30", lo: 0, hi: 30 },
    { name: "$30-60", lo: 30, hi: 60 },
    { name: "$60-90", lo: 60, hi: 90 },
    { name: ">$90", lo: 90, hi: 999 },
  ].map((b) => ({
    name: b.name,
    value: data.filter(
      (c) => c.monthlyCharges >= b.lo && c.monthlyCharges < b.hi
    ).length,
  }));

  // Tenure distribution
  const tenureBuckets = ["0-12", "13-24", "25-36", "37-48", "49-60", "60+"].map(
    (label, i) => {
      const lo = i * 12;
      const hi = i === 5 ? 999 : lo + 12;
      return {
        name: label,
        value: data.filter((c) => c.tenure >= lo && c.tenure < hi).length,
      };
    }
  );

  return (
    <div className="space-y-6">
      <SectionTitle
        eyebrow="Page 1 · Executive Overview"
        title="Executive Overview"
        subtitle="One-page summary of customer base health, revenue exposure, and retention performance."
      />

      {/* KPI row 1 */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <KpiCard label="Total Customers" value={fmtNum(k.totalCustomers)} accent="#3B82F6" icon={<IcUsers className="h-5 w-5" />} />
        <KpiCard label="Active Customers" value={fmtNum(k.activeCustomers)} accent="#22C55E" icon={<IcCheck className="h-5 w-5" />} trend={fmtPct(k.retentionRate)} trendUp />
        <KpiCard label="Churned Customers" value={fmtNum(k.churnCustomers)} accent="#EF4444" icon={<IcExit className="h-5 w-5" />} trend={fmtPct(k.churnRate)} trendUp={false} />
        <KpiCard label="Retention Rate" value={fmtPct(k.retentionRate)} accent="#8B5CF6" icon={<IcShield className="h-5 w-5" />} />
        <KpiCard label="Churn Rate" value={fmtPct(k.churnRate)} accent="#F59E0B" icon={<IcGauge className="h-5 w-5" />} />
      </div>

      {/* KPI row 2 */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <KpiCard label="Total Revenue" value={fmtMoney(k.totalRevenue)} sub={fmtMoneyFull(k.totalRevenue)} accent="#22C55E" icon={<IcMoney className="h-5 w-5" />} />
        <KpiCard label="Avg Monthly Charges" value={"$" + k.avgMonthlyCharges.toFixed(2)} accent="#3B82F6" icon={<IcMoney className="h-5 w-5" />} />
        <KpiCard label="Customer Lifetime Value" value={fmtMoney(k.avgCLV)} accent="#8B5CF6" icon={<IcStar className="h-5 w-5" />} />
        <KpiCard label="Avg Tenure" value={k.avgTenure.toFixed(1) + " mo"} accent="#F59E0B" icon={<IcClock className="h-5 w-5" />} />
        <KpiCard label="Revenue Lost" value={fmtMoney(k.revenueLost)} sub={fmtMoneyFull(k.revenueLost)} accent="#EF4444" icon={<IcAlert className="h-5 w-5" />} trend={fmtPct((k.revenueLost / (k.totalRevenue || 1)) * 100)} trendUp={false} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ChartCard title="Customer Distribution" subtitle="Active vs churned">
          <DonutChart data={custDist} colors={["#22C55E", "#EF4444"]} formatter={fmtNum} />
        </ChartCard>
        <ChartCard title="Contract Distribution" subtitle="Customers by contract type">
          <DonutChart data={contractDist} formatter={fmtNum} />
        </ChartCard>
        <ChartCard title="Internet Service Distribution" subtitle="Customers by service">
          <DonutChart data={internetDist} colors={["#8B5CF6", "#3B82F6", "#64748B"]} formatter={fmtNum} />
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ChartCard title="Revenue Distribution" subtitle="Lifetime revenue by contract">
          <TreemapChart data={revByContract} height={230} />
        </ChartCard>
        <ChartCard title="Monthly Charges" subtitle="Customer count by charge band">
          <VBarChart data={chargeBuckets} bars={[{ key: "value", color: "#3B82F6", name: "Customers" }]} formatter={fmtNum} height={230} />
        </ChartCard>
        <ChartCard title="Tenure Distribution" subtitle="Customer count by tenure band (months)">
          <TrendChart data={tenureBuckets} areas={[{ key: "value", color: "#8B5CF6", name: "Customers" }]} formatter={fmtNum} height={230} />
        </ChartCard>
      </div>

      {/* Insights */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div>
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
            <IcTrend className="h-4 w-4 text-blue-400" /> Top 5 Business Insights
          </h3>
          <div className="space-y-3">
            <InsightCard icon="📉" tone="red" title={`Overall churn rate is ${fmtPct(k.churnRate)}`} body={`${fmtNum(k.churnCustomers)} of ${fmtNum(k.totalCustomers)} customers have churned, representing ${fmtMoneyFull(k.revenueLost)} in lost lifetime revenue.`} />
            <InsightCard icon="📄" tone="orange" title="Month-to-month contracts dominate the base" body="Flexible contracts make up the majority of customers and carry the highest churn — a structural retention risk." />
            <InsightCard icon="🌐" tone="purple" title="Fiber optic drives high revenue but higher churn" body="Premium fiber customers pay the most yet leave more often, signalling a price-value or service-quality gap." />
            <InsightCard icon="💳" tone="blue" title="Electronic check payers are least sticky" body="This payment method correlates with elevated attrition versus automatic bank/card payments." />
            <InsightCard icon="⏳" tone="green" title="Early tenure is the danger zone" body="Customers in their first 12 months churn disproportionately; onboarding is the highest-leverage intervention." />
          </div>
        </div>
        <div>
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
            <IcStar className="h-4 w-4 text-amber-400" /> Top 5 Executive Recommendations
          </h3>
          <div className="space-y-3">
            <InsightCard icon="🎯" tone="blue" title="Migrate month-to-month to annual contracts" body="Offer loyalty discounts to convert flexible customers to 1- or 2-year terms and lock in retention." />
            <InsightCard icon="🚀" tone="green" title="Launch a 90-day onboarding program" body="Proactive check-ins and value nudges in months 1–3 directly attack the early-tenure churn spike." />
            <InsightCard icon="🔧" tone="purple" title="Audit fiber optic service quality & pricing" body="Improve reliability and introduce value bundles to justify premium pricing and reduce fiber churn." />
            <InsightCard icon="💡" tone="orange" title="Incentivize auto-pay adoption" body="Nudge electronic-check users to bank transfer / credit card auto-pay with small credits." />
            <InsightCard icon="🛡️" tone="red" title="Deploy a high-risk save desk" body={`Prioritize the ${fmtNum(k.highRiskCustomers)} high-risk customers with targeted retention offers.`} />
          </div>
        </div>
      </div>
    </div>
  );
}
