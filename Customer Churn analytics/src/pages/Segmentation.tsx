import { Customer, segment } from "../data/dataset";
import {
  computeKpis,
  churnByDimension,
  fmtNum,
  fmtMoney,
  fmtPct,
} from "../data/metrics";
import { KpiCard, ChartCard, SectionTitle, InsightCard } from "../components/ui";
import { DonutChart, VBarChart, HBarChart, TreemapChart } from "../components/charts";
import { IcStar, IcUsers, IcAlert, IcShield } from "../components/icons";

export function Segmentation({ data }: { data: Customer[] }) {
  const k = computeKpis(data);

  const segCounts = churnByDimension(data, (c) => segment(c)).map((d) => ({
    name: d.name,
    value: d.total,
  }));

  const chargeSeg = ["Budget <$40", "Mid $40-75", "Premium >$75"].map(
    (label, i) => {
      const ranges = [
        [0, 40],
        [40, 75],
        [75, 999],
      ][i];
      return {
        name: label,
        value: data.filter(
          (c) => c.monthlyCharges >= ranges[0] && c.monthlyCharges < ranges[1]
        ).length,
      };
    }
  );

  const tenureSeg = ["New 0-12", "Growing 13-36", "Loyal 37+"].map(
    (label, i) => {
      const ranges = [
        [0, 12],
        [12, 36],
        [36, 999],
      ][i];
      return {
        name: label,
        value: data.filter(
          (c) => c.tenure >= ranges[0] && c.tenure < ranges[1]
        ).length,
      };
    }
  );

  const revSeg = churnByDimension(data, (c) => segment(c)).map((d) => ({
    name: d.name,
    value: Math.round(d.revenue),
  }));

  const internetSeg = churnByDimension(data, (c) => c.internetService, [
    "Fiber optic",
    "DSL",
    "No",
  ]).map((d) => ({ name: d.name, value: d.total }));

  const contractSeg = churnByDimension(data, (c) => c.contract, [
    "Month-to-month",
    "One year",
    "Two year",
  ]).map((d) => ({ name: d.name, value: d.total }));

  return (
    <div className="space-y-6">
      <SectionTitle
        eyebrow="Page 5 · Customer Segmentation"
        title="Customer Segmentation"
        subtitle="Group customers by value and risk to target retention and growth strategies."
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiCard label="Premium Customers" value={fmtNum(k.premiumCustomers)} sub="High spend · long tenure" accent="#8B5CF6" icon={<IcStar className="h-5 w-5" />} />
        <KpiCard label="High Value Customers" value={fmtNum(k.highValueCustomers)} accent="#22C55E" icon={<IcShield className="h-5 w-5" />} />
        <KpiCard label="Standard Customers" value={fmtNum(k.standardCustomers)} accent="#3B82F6" icon={<IcUsers className="h-5 w-5" />} />
        <KpiCard label="At-Risk Customers" value={fmtNum(k.atRiskCustomers)} sub={fmtPct((k.atRiskCustomers / (data.length || 1)) * 100) + " of base"} accent="#EF4444" icon={<IcAlert className="h-5 w-5" />} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ChartCard title="Customer Segments" subtitle="Value & risk tiers">
          <DonutChart data={segCounts} colors={["#8B5CF6", "#22C55E", "#3B82F6", "#EF4444"]} formatter={fmtNum} />
        </ChartCard>
        <ChartCard title="Monthly Charges Segments" subtitle="Spend tiers">
          <VBarChart data={chargeSeg} bars={[{ key: "value", color: "#3B82F6", name: "Customers" }]} formatter={fmtNum} />
        </ChartCard>
        <ChartCard title="Tenure Segments" subtitle="Lifecycle stage">
          <VBarChart data={tenureSeg} bars={[{ key: "value", color: "#F59E0B", name: "Customers" }]} formatter={fmtNum} />
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ChartCard title="Revenue Segments" subtitle="Lifetime revenue by tier">
          <TreemapChart data={revSeg} />
        </ChartCard>
        <ChartCard title="Internet Service Segments" subtitle="Customers by service">
          <HBarChart data={internetSeg} colorByIndex formatter={fmtNum} />
        </ChartCard>
        <ChartCard title="Contract Segments" subtitle="Customers by contract">
          <HBarChart data={contractSeg} colorByIndex formatter={fmtNum} />
        </ChartCard>
      </div>

      <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-800/60 to-slate-900/60 p-5 backdrop-blur-xl">
        <h3 className="mb-3 text-sm font-semibold text-white">
          🧭 Customer Lifetime Value & Segmentation Strategy
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm leading-relaxed text-slate-300">
              Average CLV across the base is{" "}
              <b className="text-white">{fmtMoney(k.avgCLV)}</b>. Premium and
              High-Value tiers deliver the bulk of lifetime revenue while
              representing a minority of customers — the classic value
              concentration pattern. The At-Risk tier threatens{" "}
              <b className="text-white">{fmtNum(k.atRiskCustomers)}</b> accounts
              that must be defended before they churn.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              ["Premium", "Protect & upsell", "#8B5CF6"],
              ["High Value", "Deepen loyalty", "#22C55E"],
              ["Standard", "Grow to High Value", "#3B82F6"],
              ["At Risk", "Retain aggressively", "#EF4444"],
            ].map(([seg, action, color]) => (
              <div
                key={seg}
                className="rounded-lg border border-white/10 bg-slate-900/50 p-3"
              >
                <div className="text-xs font-semibold" style={{ color }}>
                  {seg}
                </div>
                <div className="mt-0.5 text-[11px] text-slate-400">{action}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <InsightCard icon="💎" tone="purple" title="Premium tier is the crown jewel" body="Highest CLV per customer — assign account managers and exclusive perks to guarantee retention." />
        <InsightCard icon="📈" tone="blue" title="Standard tier is the growth pool" body="Nurture standard customers with bundles and tenure incentives to migrate them into High Value." />
        <InsightCard icon="🚨" tone="red" title="At-risk tier needs immediate action" body="Deploy proactive save offers now — this tier is one billing cycle away from becoming revenue lost." />
      </div>
    </div>
  );
}
