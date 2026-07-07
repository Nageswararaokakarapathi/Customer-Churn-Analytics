import { Customer } from "../data/dataset";
import {
  computeKpis,
  fmtNum,
  fmtMoney,
  fmtMoneyFull,
  fmtPct,
} from "../data/metrics";
import { SectionTitle, GlassCard } from "../components/ui";

function Card({
  icon,
  title,
  children,
  accent,
}: {
  icon: string;
  title: string;
  children: React.ReactNode;
  accent: string;
}) {
  return (
    <GlassCard className="relative overflow-hidden">
      <div
        className="absolute left-0 top-0 h-full w-1"
        style={{ background: accent }}
      />
      <div className="flex items-center gap-2">
        <span className="text-lg">{icon}</span>
        <h3 className="text-sm font-semibold text-white">{title}</h3>
      </div>
      <div className="mt-3 text-sm leading-relaxed text-slate-300">
        {children}
      </div>
    </GlassCard>
  );
}

export function Recommendations({ data }: { data: Customer[] }) {
  const k = computeKpis(data);
  const potentialSave = k.revenueLost * 0.25;

  return (
    <div className="space-y-6">
      <SectionTitle
        eyebrow="Page 6 · Executive Recommendations"
        title="Executive Recommendations"
        subtitle="Boardroom-ready synthesis of findings, risks, opportunities, and the strategic roadmap."
      />

      {/* impact banner */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-emerald-500/25 bg-gradient-to-br from-emerald-500/15 to-emerald-500/5 p-5">
          <div className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
            Estimated Revenue Recovery
          </div>
          <div className="mt-1 text-3xl font-bold text-white">
            {fmtMoney(potentialSave)}
          </div>
          <div className="mt-1 text-xs text-slate-400">
            ~25% of {fmtMoneyFull(k.revenueLost)} lost revenue is recoverable
            with targeted retention.
          </div>
        </div>
        <div className="rounded-2xl border border-blue-500/25 bg-gradient-to-br from-blue-500/15 to-blue-500/5 p-5">
          <div className="text-xs font-semibold uppercase tracking-wider text-blue-400">
            Estimated Retention Improvement
          </div>
          <div className="mt-1 text-3xl font-bold text-white">
            +6 to +9 pts
          </div>
          <div className="mt-1 text-xs text-slate-400">
            Lift retention from {fmtPct(k.retentionRate)} toward ~85% via
            contract & onboarding programs.
          </div>
        </div>
        <div className="rounded-2xl border border-violet-500/25 bg-gradient-to-br from-violet-500/15 to-violet-500/5 p-5">
          <div className="text-xs font-semibold uppercase tracking-wider text-violet-400">
            High-Risk Accounts to Action
          </div>
          <div className="mt-1 text-3xl font-bold text-white">
            {fmtNum(k.highRiskCustomers)}
          </div>
          <div className="mt-1 text-xs text-slate-400">
            Immediate save-desk targets across the flagged customer population.
          </div>
        </div>
      </div>

      <Card icon="📋" title="Executive Summary" accent="#3B82F6">
        The customer base of {fmtNum(k.totalCustomers)} accounts is currently
        churning at {fmtPct(k.churnRate)}, translating into{" "}
        {fmtMoneyFull(k.revenueLost)} of lost lifetime revenue. Churn is not
        random — it is concentrated in month-to-month contracts, early-tenure
        customers, fiber-optic subscribers, and electronic-check payers. A
        focused retention program targeting these drivers can materially improve
        both retention and revenue within two quarters.
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card icon="🔍" title="Key Findings" accent="#8B5CF6">
          <ul className="list-inside list-disc space-y-1.5">
            <li>Month-to-month contracts show the highest churn by a wide margin.</li>
            <li>Customers with tenure under 12 months are the most volatile.</li>
            <li>Fiber optic generates top revenue but above-average churn.</li>
            <li>Electronic-check payers churn more than auto-pay users.</li>
            <li>Partners/dependents and long contracts strongly reduce churn.</li>
          </ul>
        </Card>
        <Card icon="⚠️" title="Critical Business Problems" accent="#EF4444">
          <ul className="list-inside list-disc space-y-1.5">
            <li>Structural over-reliance on flexible, easily-cancelled plans.</li>
            <li>Weak onboarding leaves new customers unengaged and at risk.</li>
            <li>Premium fiber revenue is exposed to elevated attrition.</li>
            <li>No systematic risk scoring or proactive save motion in place.</li>
            <li>{fmtMoneyFull(k.revenueLost)} already lost and growing.</li>
          </ul>
        </Card>
        <Card icon="🌱" title="Business Opportunities" accent="#22C55E">
          <ul className="list-inside list-disc space-y-1.5">
            <li>Convert month-to-month to annual for durable retention.</li>
            <li>Upsell high-tenure, high-value customers to grow CLV.</li>
            <li>Bundle household plans to leverage partner/dependent stickiness.</li>
            <li>Shift customers to auto-pay to reduce payment-driven churn.</li>
            <li>Recover ~{fmtMoney(potentialSave)} through targeted saves.</li>
          </ul>
        </Card>
        <Card icon="🎯" title="Strategic Recommendations" accent="#F59E0B">
          <ol className="list-inside list-decimal space-y-1.5">
            <li>Launch a contract-conversion campaign with loyalty pricing.</li>
            <li>Stand up a 90-day onboarding & engagement program.</li>
            <li>Deploy a churn risk model + dedicated retention save desk.</li>
            <li>Improve fiber service quality and value bundling.</li>
            <li>Incentivize auto-pay migration with billing credits.</li>
          </ol>
        </Card>
      </div>

      <Card icon="🚀" title="Expected Business Impact" accent="#22C55E">
        Executing the roadmap is projected to lift retention by 6–9 points,
        recover approximately {fmtMoney(potentialSave)} in at-risk revenue, and
        materially increase average customer lifetime value by shifting the base
        toward longer contracts and higher-loyalty segments.
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card icon="🗺️" title="Next Steps" accent="#3B82F6">
          <ol className="list-inside list-decimal space-y-1.5">
            <li><b className="text-white">Weeks 1–2:</b> Operationalize risk scoring & save desk.</li>
            <li><b className="text-white">Weeks 3–6:</b> Launch contract-conversion offers.</li>
            <li><b className="text-white">Weeks 4–8:</b> Roll out 90-day onboarding journey.</li>
            <li><b className="text-white">Weeks 6–10:</b> Fiber quality & auto-pay campaigns.</li>
            <li><b className="text-white">Ongoing:</b> Monitor churn KPIs on this dashboard.</li>
          </ol>
        </Card>
        <Card icon="🏁" title="Professional Conclusion" accent="#8B5CF6">
          Churn in this business is highly predictable and therefore highly
          addressable. By treating retention as a structural priority — not a
          reactive afterthought — leadership can convert a{" "}
          {fmtMoneyFull(k.revenueLost)} problem into a measurable growth lever.
          This dashboard provides the single source of truth to track that
          transformation quarter over quarter.
        </Card>
      </div>
    </div>
  );
}
