import { Filters } from "../data/metrics";
import { IcReset } from "./icons";

interface SlicerConfig {
  key: keyof Filters;
  label: string;
  options: string[];
}

const CONFIGS: SlicerConfig[] = [
  { key: "gender", label: "Gender", options: ["All", "Male", "Female"] },
  {
    key: "contract",
    label: "Contract",
    options: ["All", "Month-to-month", "One year", "Two year"],
  },
  {
    key: "internetService",
    label: "Internet Service",
    options: ["All", "DSL", "Fiber optic", "No"],
  },
  {
    key: "paymentMethod",
    label: "Payment Method",
    options: [
      "All",
      "Electronic check",
      "Mailed check",
      "Bank transfer",
      "Credit card",
    ],
  },
  { key: "senior", label: "Senior Citizen", options: ["All", "Yes", "No"] },
];

export function Slicers({
  filters,
  setFilters,
  onReset,
}: {
  filters: Filters;
  setFilters: (f: Filters) => void;
  onReset: () => void;
}) {
  const active = Object.entries(filters).filter(([, v]) => v !== "All").length;
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-800/40 p-3 backdrop-blur-xl">
      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Filters
        </span>
        {CONFIGS.map((c) => (
          <div key={c.key} className="relative">
            <select
              value={filters[c.key]}
              onChange={(e) =>
                setFilters({ ...filters, [c.key]: e.target.value })
              }
              className="cursor-pointer appearance-none rounded-lg border border-white/10 bg-slate-900/70 py-1.5 pl-3 pr-8 text-xs font-medium text-slate-200 outline-none transition hover:border-blue-500/50 focus:border-blue-500"
            >
              {c.options.map((o) => (
                <option key={o} value={o} className="bg-slate-900">
                  {o === "All" ? `${c.label}: All` : o}
                </option>
              ))}
            </select>
            <svg
              className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-500"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </div>
        ))}
        <button
          onClick={onReset}
          className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-slate-900/70 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:border-rose-500/50 hover:text-rose-300"
        >
          <IcReset className="h-3.5 w-3.5" />
          Reset {active > 0 && <span className="text-rose-400">({active})</span>}
        </button>
      </div>
    </div>
  );
}
