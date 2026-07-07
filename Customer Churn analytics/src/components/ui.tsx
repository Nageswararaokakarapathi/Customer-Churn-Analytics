import { ReactNode } from "react";
import { cn } from "../utils/cn";

export const COLORS = {
  bg: "#0F172A",
  card: "#1E293B",
  blue: "#3B82F6",
  purple: "#8B5CF6",
  green: "#22C55E",
  orange: "#F59E0B",
  red: "#EF4444",
};

export const CHART_PALETTE = [
  "#3B82F6",
  "#8B5CF6",
  "#22C55E",
  "#F59E0B",
  "#EF4444",
  "#06B6D4",
];

export function GlassCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/10 bg-slate-800/50 p-5 shadow-xl shadow-black/30 backdrop-blur-xl",
        "ring-1 ring-white/5",
        className
      )}
    >
      {children}
    </div>
  );
}

interface KpiProps {
  label: string;
  value: string;
  sub?: string;
  accent: string;
  icon: ReactNode;
  trend?: string;
  trendUp?: boolean;
}

export function KpiCard({
  label,
  value,
  sub,
  accent,
  icon,
  trend,
  trendUp,
}: KpiProps) {
  return (
    <GlassCard className="group relative overflow-hidden p-4">
      <div
        className="absolute -right-6 -top-6 h-20 w-20 rounded-full opacity-20 blur-2xl transition-opacity group-hover:opacity-40"
        style={{ background: accent }}
      />
      <div className="flex items-start justify-between">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-lg"
          style={{ background: `linear-gradient(135deg, ${accent}, ${accent}99)` }}
        >
          {icon}
        </div>
        {trend && (
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-[11px] font-semibold",
              trendUp
                ? "bg-emerald-500/15 text-emerald-400"
                : "bg-rose-500/15 text-rose-400"
            )}
          >
            {trendUp ? "▲" : "▼"} {trend}
          </span>
        )}
      </div>
      <div className="mt-3">
        <div className="text-2xl font-bold tracking-tight text-white">
          {value}
        </div>
        <div className="mt-0.5 text-xs font-medium text-slate-400">{label}</div>
        {sub && <div className="mt-1 text-[11px] text-slate-500">{sub}</div>}
      </div>
    </GlassCard>
  );
}

export function ChartCard({
  title,
  subtitle,
  children,
  className,
  action,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  action?: ReactNode;
}) {
  return (
    <GlassCard className={cn("flex flex-col", className)}>
      <div className="mb-3 flex items-start justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white">{title}</h3>
          {subtitle && (
            <p className="mt-0.5 text-xs text-slate-400">{subtitle}</p>
          )}
        </div>
        {action}
      </div>
      <div className="flex-1">{children}</div>
    </GlassCard>
  );
}

export function SectionTitle({
  title,
  subtitle,
  eyebrow,
}: {
  title: string;
  subtitle?: string;
  eyebrow?: string;
}) {
  return (
    <div className="mb-5">
      {eyebrow && (
        <div className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
          {eyebrow}
        </div>
      )}
      <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
        {title}
      </h2>
      {subtitle && <p className="mt-1 text-sm text-slate-400">{subtitle}</p>}
    </div>
  );
}

export function InsightCard({
  icon,
  title,
  body,
  tone = "blue",
}: {
  icon: string;
  title: string;
  body: string;
  tone?: "blue" | "green" | "red" | "orange" | "purple";
}) {
  const tones: Record<string, string> = {
    blue: "from-blue-500/15 to-blue-500/5 border-blue-500/25",
    green: "from-emerald-500/15 to-emerald-500/5 border-emerald-500/25",
    red: "from-rose-500/15 to-rose-500/5 border-rose-500/25",
    orange: "from-amber-500/15 to-amber-500/5 border-amber-500/25",
    purple: "from-violet-500/15 to-violet-500/5 border-violet-500/25",
  };
  return (
    <div
      className={cn(
        "rounded-xl border bg-gradient-to-br p-4 backdrop-blur-sm",
        tones[tone]
      )}
    >
      <div className="flex items-start gap-3">
        <div className="text-xl leading-none">{icon}</div>
        <div>
          <div className="text-sm font-semibold text-white">{title}</div>
          <div className="mt-1 text-xs leading-relaxed text-slate-300">
            {body}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Pill({
  children,
  color,
}: {
  children: ReactNode;
  color: string;
}) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold"
      style={{ background: `${color}22`, color }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ background: color }}
      />
      {children}
    </span>
  );
}
