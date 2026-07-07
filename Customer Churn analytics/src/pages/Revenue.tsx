import { Customer, segment } from "../data/dataset";
import {
  churnByDimension,
  computeKpis,
  fmtMoney,
  fmtMoneyFull,
} from "../data/metrics";
import { KpiCard, ChartCard, SectionTitle, InsightCard } from "../components/ui";
import { HBarChart, VBarChart, TreemapChart, Heatmap } from "../components/charts";
import { IcMoney, IcTrend, IcStar, IcAlert, IcGauge } from "../components/icons";

export function Revenue({ data }: { data: Customer[] }) {
  const k = computeKpis(data);

  const revContract = churnByDimension(data, (c) => c.contract, [
    "Month-to-month",
    "One year",
    "Two year",
  ]).map((d) => ({ name: d.name, value: Math.round(d.revenue) }));

  const revInternet = churnByDimension(data, (c) => c.internetService, [
    "Fiber optic",
    "DSL",
    "No",
  ]).map((d) => ({ name: d.name, value: Math.round(d.revenue) }));

  const revPayment = churnByDimension(data, (c) => c.paymentMethod).map((d) => ({
    name: d.name,
    value: Math.round(d.revenue),
  }));

  const revSegment = churnByDimension(data, (c) => segment(c)).map((d) => ({
    name: d.name,
    value: Math.round(d.revenue),
  }));

  // revenue by tenure band
  const revTenure = ["0-12", "13-24", "25-36", "37-48", "49-60", "60+"].map(
    (label, i) => {
      const lo = i * 12;
      const hi = i === 5 ? 999 : lo + 12;
      const rows = data.filter((c) => c.tenure >= lo && c.tenure < hi);
      return {
        name: label,
        value: Math.round(rows.reduce((s, c) => s + c.totalCharges, 0)),
      };
    }
  );

  const highSeg = [...revSegment].sort((a, b) => b.value - a.value)[0];
  const lowSeg = [...revSegment].sort((a, b) => a.value - b.value)[0];

  // Heatmap: contract x internet -> avg revenue
  const contracts = ["Month-to-month", "One year", "Two year"];
  const internets = ["Fiber optic", "DSL", "No"];
  const matrix = contracts.map((ct) =>
    internets.map((is) => {
      const rows = data.filter(
        (c) => c.contract === ct && c.internetService === is
      );
      return rows.length
        ? Math.round(rows.reduce((s, c) => s + c.totalCharges, 0) / rows.length)
        : 0;
    })
  );

  return (
    <div className="space-y-6">
      <SectionTitle
        eyebrow="Page 3 · Revenue Analytics"
        title="Revenue Analytics"
        subtitle="Where revenue concentrates and which segments deliver the most value."
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <KpiCard label="Total Revenue" value={fmtMoney(k.totalRevenue)} sub={fmtMoneyFull(k.totalRevenue)} accent="#22C55E" icon={<IcMoney className="h-5 w-5" />} />
        <KpiCard label="Avg Revenue / Customer" value={fmtMoney(k.avgRevenue)} accent="#3B82F6" icon={<IcTrend className="h-5 w-5" />} />
        <KpiCard label="Avg Monthly Charges" value={"$" + k.avgMonthlyCharges.toFixed(2)} accent="#8B5CF6" icon={<IcGauge className="h-5 w-5" />} />
        <KpiCard label="Highest Revenue Segment" value={highSeg?.name ?? "-"} sub={fmtMoney(highSeg?.value ?? 0)} accent="#22C55E" icon={<IcStar className="h-5 w-5" />} />
        <KpiCard label="Lowest Revenue Segment" value={lowSeg?.name ?? "-"} sub={fmtMoney(lowSeg?.value ?? 0)} accent="#EF4444" icon={<IcAlert className="h-5 w-5" />} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard title="Revenue by Contract" subtitle="Lifetime revenue by contract type">
          <VBarChart data={revContract} bars={[{ key: "value", color: "#22C55E", name: "Revenue" }]} formatter={fmtMoneyFull} />
        </ChartCard>
        <ChartCard title="Revenue by Internet Service" subtitle="Lifetime revenue by service">
          <HBarChart data={revInternet} colorByIndex formatter={fmtMoneyFull} />
        </ChartCard>
        <ChartCard title="Revenue by Payment Method" subtitle="Lifetime revenue by payment method">
          <HBarChart data={revPayment} colorByIndex formatter={fmtMoneyFull} />
        </ChartCard>
        <ChartCard title="Revenue by Customer Segment" subtitle="Value tiers">
          <TreemapChart data={revSegment} />
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard title="Revenue by Tenure" subtitle="Lifetime revenue accumulation by tenure band">
          <VBarChart data={revTenure} bars={[{ key: "value", color: "#3B82F6", name: "Revenue" }]} formatter={fmtMoneyFull} />
        </ChartCard>
        <ChartCard title="Revenue Heatmap" subtitle="Avg lifetime revenue · Contract × Internet Service">
          <Heatmap rows={contracts} cols={internets} matrix={matrix} valueFormat={fmtMoney} />
        </ChartCard>
      </div>

      <GlassSummary />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <InsightCard icon="💰" tone="green" title="Two-year contracts drive premium revenue" body="Longer contracts accumulate the highest lifetime revenue per customer — the most profitable and loyal cohort." />
        <InsightCard icon="🌐" tone="purple" title="Fiber optic is the revenue engine" body="Fiber generates the largest revenue pool despite higher churn — protecting it has outsized financial impact." />
        <InsightCard icon="📈" tone="blue" title="Recommendation: grow long-tenure value" body="Upsell add-ons to high-tenure customers and convert flexible plans to annual to compound lifetime revenue." />
      </div>
    </div>
  );
}

function GlassSummary() {
  return (
    <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-800/60 to-slate-900/60 p-5 backdrop-blur-xl">
      <h3 className="mb-2 text-sm font-semibold text-white">
        📊 Executive Summary — Revenue
      </h3>
      <p className="text-sm leading-relaxed text-slate-300">
        Revenue is heavily concentrated in <b className="text-white">fiber optic</b>{" "}
        and <b className="text-white">long-tenure customers</b>. While
        month-to-month customers represent the largest count, their short
        lifetimes limit lifetime value. The strategic priority is to protect the
        high-revenue fiber base from churn while migrating flexible customers to
        annual contracts — a dual motion that both defends and grows revenue.
      </p>
    </div>
  );
}
