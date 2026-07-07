import { useMemo, useState } from "react";
import { CUSTOMERS } from "./data/dataset";
import { DEFAULT_FILTERS, Filters, applyFilters, computeKpis, fmtNum } from "./data/metrics";
import { Slicers } from "./components/Slicers";
import { cn } from "./utils/cn";
import {
  IcGauge,
  IcUsers,
  IcMoney,
  IcExit,
  IcLayers,
  IcDoc,
  IcCode,
  IcSpark,
} from "./components/icons";
import { Overview } from "./pages/Overview";
import { Demographics } from "./pages/Demographics";
import { Revenue } from "./pages/Revenue";
import { Churn } from "./pages/Churn";
import { Segmentation } from "./pages/Segmentation";
import { Recommendations } from "./pages/Recommendations";
import { DaxPage } from "./pages/DaxPage";

type PageId =
  | "overview"
  | "demographics"
  | "revenue"
  | "churn"
  | "segmentation"
  | "recommendations"
  | "dax";

const NAV: { id: PageId; label: string; icon: (p: { className?: string }) => React.ReactElement; num?: string }[] = [
  { id: "overview", label: "Executive Overview", icon: IcGauge, num: "01" },
  { id: "demographics", label: "Demographics", icon: IcUsers, num: "02" },
  { id: "revenue", label: "Revenue Analytics", icon: IcMoney, num: "03" },
  { id: "churn", label: "Churn Analysis", icon: IcExit, num: "04" },
  { id: "segmentation", label: "Segmentation", icon: IcLayers, num: "05" },
  { id: "recommendations", label: "Recommendations", icon: IcDoc, num: "06" },
  { id: "dax", label: "DAX Library", icon: IcCode },
];

export default function App() {
  const [page, setPage] = useState<PageId>("overview");
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [navOpen, setNavOpen] = useState(false);

  const filtered = useMemo(() => applyFilters(CUSTOMERS, filters), [filters]);
  const k = useMemo(() => computeKpis(filtered), [filtered]);

  const showSlicers = page !== "recommendations" && page !== "dax";

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100">
      {/* ambient gradient blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute -right-40 top-1/3 h-96 w-96 rounded-full bg-violet-600/10 blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-emerald-600/5 blur-[120px]" />
      </div>

      <div className="relative flex">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed z-40 flex h-screen w-64 flex-col border-r border-white/10 bg-slate-900/80 backdrop-blur-xl transition-transform lg:translate-x-0",
            navOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex items-center gap-3 border-b border-white/10 px-5 py-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 shadow-lg shadow-blue-500/30">
              <IcSpark className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="text-sm font-bold leading-tight text-white">
                Churn Analytics
              </div>
              <div className="text-[11px] text-slate-400">Enterprise BI Suite</div>
            </div>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto p-3">
            {NAV.map((n) => {
              const Icon = n.icon;
              const active = page === n.id;
              return (
                <button
                  key={n.id}
                  onClick={() => {
                    setPage(n.id);
                    setNavOpen(false);
                  }}
                  className={cn(
                    "group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                    active
                      ? "bg-gradient-to-r from-blue-500/20 to-violet-500/10 text-white ring-1 ring-blue-500/30"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <span
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-lg transition",
                      active ? "bg-blue-500/20 text-blue-300" : "text-slate-500 group-hover:text-slate-300"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="flex-1 text-left">{n.label}</span>
                  {n.num && (
                    <span className="text-[10px] font-bold text-slate-600">
                      {n.num}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="border-t border-white/10 p-4">
            <div className="rounded-xl border border-white/10 bg-slate-800/50 p-3">
              <div className="text-[11px] text-slate-400">Records analyzed</div>
              <div className="mt-0.5 text-lg font-bold text-white">
                {fmtNum(filtered.length)}
                <span className="ml-1 text-xs font-normal text-slate-500">
                  / {fmtNum(CUSTOMERS.length)}
                </span>
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-700">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500"
                  style={{
                    width: `${(filtered.length / CUSTOMERS.length) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </aside>

        {navOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/50 lg:hidden"
            onClick={() => setNavOpen(false)}
          />
        )}

        {/* Main */}
        <div className="flex min-h-screen flex-1 flex-col lg:ml-64">
          {/* Topbar */}
          <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-900/70 backdrop-blur-xl">
            <div className="flex items-center gap-3 px-4 py-3 sm:px-6">
              <button
                className="rounded-lg border border-white/10 p-2 text-slate-300 lg:hidden"
                onClick={() => setNavOpen(true)}
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 12h18M3 6h18M3 18h18" />
                </svg>
              </button>
              <div className="min-w-0">
                <h1 className="truncate text-base font-bold text-white sm:text-lg">
                  Customer Churn Prediction & Retention Analytics
                </h1>
                <p className="hidden text-xs text-slate-400 sm:block">
                  Executive Business Intelligence Dashboard · Live &amp; interactive
                </p>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <div className="hidden items-center gap-2 rounded-lg border border-white/10 bg-slate-800/50 px-3 py-1.5 md:flex">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                  <span className="text-xs font-medium text-slate-300">
                    Retention {k.retentionRate.toFixed(1)}%
                  </span>
                </div>
                <div className="hidden items-center gap-2 rounded-lg border border-white/10 bg-slate-800/50 px-3 py-1.5 md:flex">
                  <span className="h-2 w-2 rounded-full bg-rose-400" />
                  <span className="text-xs font-medium text-slate-300">
                    Churn {k.churnRate.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
            {showSlicers && (
              <div className="px-4 pb-3 sm:px-6">
                <Slicers
                  filters={filters}
                  setFilters={setFilters}
                  onReset={() => setFilters(DEFAULT_FILTERS)}
                />
              </div>
            )}
          </header>

          {/* Page body */}
          <main className="flex-1 px-4 py-6 sm:px-6">
            {page === "overview" && <Overview data={filtered} />}
            {page === "demographics" && <Demographics data={filtered} />}
            {page === "revenue" && <Revenue data={filtered} />}
            {page === "churn" && <Churn data={filtered} />}
            {page === "segmentation" && <Segmentation data={filtered} />}
            {page === "recommendations" && <Recommendations data={filtered} />}
            {page === "dax" && <DaxPage />}
          </main>

          <footer className="border-t border-white/10 px-6 py-4 text-center text-xs text-slate-500">
            Built as an enterprise Power BI reference solution · Synthetic Telco
            dataset ({fmtNum(CUSTOMERS.length)} customers) · Dark Professional
            Theme
          </footer>
        </div>
      </div>
    </div>
  );
}
