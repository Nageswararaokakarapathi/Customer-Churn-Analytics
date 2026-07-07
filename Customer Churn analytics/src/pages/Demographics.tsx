import { Customer } from "../data/dataset";
import { churnByDimension, groupBy, fmtNum, fmtPct } from "../data/metrics";
import { KpiCard, ChartCard, SectionTitle, InsightCard } from "../components/ui";
import { VBarChart, DonutChart } from "../components/charts";
import { IcUsers, IcClock, IcShield, IcCheck } from "../components/icons";

function crossTab(
  data: Customer[],
  keyFn: (c: Customer) => string,
  order: string[]
) {
  return churnByDimension(data, keyFn, order).map((d) => ({
    name: d.name,
    Churned: d.churned,
    Retained: d.retained,
    rate: d.churnRate,
  }));
}

export function Demographics({ data }: { data: Customer[] }) {
  const male = data.filter((c) => c.gender === "Male").length;
  const female = data.filter((c) => c.gender === "Female").length;
  const seniors = data.filter((c) => c.seniorCitizen).length;
  const partners = data.filter((c) => c.partner).length;
  const deps = data.filter((c) => c.dependents).length;

  const genderChurn = crossTab(data, (c) => c.gender, ["Male", "Female"]);
  const seniorChurn = crossTab(
    data,
    (c) => (c.seniorCitizen ? "Senior" : "Non-Senior"),
    ["Senior", "Non-Senior"]
  );
  const partnerChurn = crossTab(
    data,
    (c) => (c.partner ? "Partner" : "No Partner"),
    ["Partner", "No Partner"]
  );
  const depChurn = crossTab(
    data,
    (c) => (c.dependents ? "Dependents" : "No Dependents"),
    ["Dependents", "No Dependents"]
  );

  const contractByGender = ["Month-to-month", "One year", "Two year"].map(
    (ct) => {
      const rows = data.filter((c) => c.contract === ct);
      return {
        name: ct,
        Male: rows.filter((c) => c.gender === "Male").length,
        Female: rows.filter((c) => c.gender === "Female").length,
      };
    }
  );

  const internetByGender = ["Fiber optic", "DSL", "No"].map((is) => {
    const rows = data.filter((c) => c.internetService === is);
    return {
      name: is,
      Male: rows.filter((c) => c.gender === "Male").length,
      Female: rows.filter((c) => c.gender === "Female").length,
    };
  });

  const payByGender = [
    "Electronic check",
    "Mailed check",
    "Bank transfer",
    "Credit card",
  ].map((pm) => {
    const map = groupBy(
      data.filter((c) => c.paymentMethod === pm),
      (c) => c.gender
    );
    return { name: pm, value: (map.get("Male")?.length || 0) + (map.get("Female")?.length || 0) };
  });

  return (
    <div className="space-y-6">
      <SectionTitle
        eyebrow="Page 2 · Customer Demographics"
        title="Customer Demographics"
        subtitle="Who our customers are and how demographic attributes correlate with churn."
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <KpiCard label="Male Customers" value={fmtNum(male)} accent="#3B82F6" icon={<IcUsers className="h-5 w-5" />} />
        <KpiCard label="Female Customers" value={fmtNum(female)} accent="#8B5CF6" icon={<IcUsers className="h-5 w-5" />} />
        <KpiCard label="Senior Citizens" value={fmtNum(seniors)} sub={fmtPct((seniors / (data.length || 1)) * 100) + " of base"} accent="#F59E0B" icon={<IcClock className="h-5 w-5" />} />
        <KpiCard label="With Partners" value={fmtNum(partners)} accent="#22C55E" icon={<IcShield className="h-5 w-5" />} />
        <KpiCard label="With Dependents" value={fmtNum(deps)} accent="#EF4444" icon={<IcCheck className="h-5 w-5" />} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard title="Gender vs Churn" subtitle="Retained vs churned by gender">
          <VBarChart data={genderChurn} stacked bars={[{ key: "Retained", color: "#22C55E", name: "Retained" }, { key: "Churned", color: "#EF4444", name: "Churned" }]} formatter={fmtNum} />
        </ChartCard>
        <ChartCard title="Senior Citizen vs Churn" subtitle="Retained vs churned by age group">
          <VBarChart data={seniorChurn} stacked bars={[{ key: "Retained", color: "#22C55E", name: "Retained" }, { key: "Churned", color: "#EF4444", name: "Churned" }]} formatter={fmtNum} />
        </ChartCard>
        <ChartCard title="Partner vs Churn" subtitle="Retained vs churned by partner status">
          <VBarChart data={partnerChurn} stacked bars={[{ key: "Retained", color: "#22C55E", name: "Retained" }, { key: "Churned", color: "#EF4444", name: "Churned" }]} formatter={fmtNum} />
        </ChartCard>
        <ChartCard title="Dependents vs Churn" subtitle="Retained vs churned by dependents">
          <VBarChart data={depChurn} stacked bars={[{ key: "Retained", color: "#22C55E", name: "Retained" }, { key: "Churned", color: "#EF4444", name: "Churned" }]} formatter={fmtNum} />
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ChartCard title="Contract Type by Gender" subtitle="Clustered by gender">
          <VBarChart data={contractByGender} bars={[{ key: "Male", color: "#3B82F6", name: "Male" }, { key: "Female", color: "#8B5CF6", name: "Female" }]} formatter={fmtNum} />
        </ChartCard>
        <ChartCard title="Internet Service by Gender" subtitle="Clustered by gender">
          <VBarChart data={internetByGender} bars={[{ key: "Male", color: "#3B82F6", name: "Male" }, { key: "Female", color: "#8B5CF6", name: "Female" }]} formatter={fmtNum} />
        </ChartCard>
        <ChartCard title="Payment Method Split" subtitle="Customers by payment method">
          <DonutChart data={payByGender} formatter={fmtNum} />
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <InsightCard icon="⚖️" tone="blue" title="Churn is gender-neutral" body="Male and female churn rates are near-identical — demographics like gender are weak predictors versus contract and tenure." />
        <InsightCard icon="👴" tone="red" title="Senior citizens churn more" body={`Seniors churn at a notably higher rate (${fmtPct(seniorChurn[0].rate)}) than non-seniors (${fmtPct(seniorChurn[1].rate)}), warranting tailored support.`} />
        <InsightCard icon="💞" tone="green" title="Partners & dependents increase stickiness" body="Customers with partners or dependents show lower churn — household bundles reinforce retention." />
        <InsightCard icon="🎯" tone="orange" title="Recommendation: family & senior bundles" body="Design senior-friendly plans and household bundles to convert weak demographics into loyal, low-churn segments." />
      </div>
    </div>
  );
}
