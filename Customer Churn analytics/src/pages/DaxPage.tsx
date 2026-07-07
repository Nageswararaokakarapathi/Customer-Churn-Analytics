import { useState } from "react";
import { DAX_MEASURES } from "../data/dax";
import { SectionTitle, GlassCard } from "../components/ui";
import { IcCode } from "../components/icons";

export function DaxPage() {
  const [copied, setCopied] = useState<string | null>(null);
  const copy = (name: string, formula: string) => {
    navigator.clipboard?.writeText(formula);
    setCopied(name);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="space-y-6">
      <SectionTitle
        eyebrow="Appendix · Data Model"
        title="DAX Measures Library"
        subtitle="Every measure powering the dashboard — production-ready DAX with explanations. Click to copy."
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {DAX_MEASURES.map((m) => (
          <GlassCard key={m.name} className="flex flex-col">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <IcCode className="h-4 w-4 text-blue-400" />
                <h3 className="text-sm font-semibold text-white">{m.name}</h3>
              </div>
              <button
                onClick={() => copy(m.name, m.formula)}
                className="rounded-md border border-white/10 bg-slate-900/60 px-2 py-1 text-[11px] font-medium text-slate-300 transition hover:border-blue-500/50 hover:text-blue-300"
              >
                {copied === m.name ? "Copied ✓" : "Copy"}
              </button>
            </div>
            <pre className="overflow-x-auto rounded-lg border border-white/5 bg-slate-950/70 p-3 text-[12px] leading-relaxed text-emerald-300">
              <code>{m.formula}</code>
            </pre>
            <p className="mt-2 text-xs leading-relaxed text-slate-400">
              {m.explanation}
            </p>
          </GlassCard>
        ))}
      </div>

      <GlassCard>
        <h3 className="mb-2 text-sm font-semibold text-white">
          🎨 Recommended Power BI Formatting
        </h3>
        <div className="grid grid-cols-2 gap-3 text-xs text-slate-300 sm:grid-cols-3 lg:grid-cols-4">
          {[
            ["Page Size", "16:9 (1280×720)"],
            ["Background", "#0F172A"],
            ["Card Fill", "#1E293B @ 60%"],
            ["Card Radius", "12–16 px"],
            ["Card Padding", "16 px"],
            ["Grid Spacing", "12 px gutters"],
            ["Font", "Segoe UI / Inter"],
            ["KPI Value", "24–28 px Bold"],
            ["Accent Blue", "#3B82F6"],
            ["Accent Purple", "#8B5CF6"],
            ["Positive Green", "#22C55E"],
            ["Alert Red", "#EF4444"],
          ].map(([k, v]) => (
            <div
              key={k}
              className="rounded-lg border border-white/10 bg-slate-900/50 p-2.5"
            >
              <div className="text-[11px] text-slate-500">{k}</div>
              <div className="mt-0.5 font-semibold text-white">{v}</div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
