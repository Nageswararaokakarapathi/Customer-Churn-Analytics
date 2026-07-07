import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  PieChart,
  Pie,
  Legend,
  LineChart,
  Line,
  AreaChart,
  Area,
  Treemap,
  ScatterChart,
  Scatter,
  ZAxis,
} from "recharts";
import { CHART_PALETTE } from "./ui";

const axisStyle = { fill: "#94A3B8", fontSize: 11 };
const gridColor = "#334155";

function Tip({ active, payload, label, formatter }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-white/10 bg-slate-900/95 px-3 py-2 text-xs shadow-xl backdrop-blur">
      {label != null && (
        <div className="mb-1 font-semibold text-white">{label}</div>
      )}
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex items-center gap-2 text-slate-300">
          <span
            className="h-2 w-2 rounded-full"
            style={{ background: p.color || p.fill }}
          />
          <span>{p.name}:</span>
          <span className="font-semibold text-white">
            {formatter ? formatter(p.value, p.name) : p.value}
          </span>
        </div>
      ))}
    </div>
  );
}

interface Datum {
  name: string;
  [k: string]: string | number;
}

export function DonutChart({
  data,
  dataKey = "value",
  formatter,
  colors = CHART_PALETTE,
}: {
  data: Datum[];
  dataKey?: string;
  formatter?: (v: number) => string;
  colors?: string[];
}) {
  return (
    <ResponsiveContainer width="100%" height={230}>
      <PieChart>
        <Pie
          data={data}
          dataKey={dataKey}
          nameKey="name"
          innerRadius={55}
          outerRadius={85}
          paddingAngle={3}
          stroke="none"
        >
          {data.map((_, i) => (
            <Cell key={i} fill={colors[i % colors.length]} />
          ))}
        </Pie>
        <Tooltip content={<Tip formatter={formatter} />} />
        <Legend
          iconType="circle"
          wrapperStyle={{ fontSize: 11, color: "#94A3B8" }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function VBarChart({
  data,
  bars,
  formatter,
  stacked,
  height = 250,
}: {
  data: Datum[];
  bars: { key: string; color: string; name: string }[];
  formatter?: (v: number) => string;
  stacked?: boolean;
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 6, right: 6, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
        <XAxis dataKey="name" tick={axisStyle} tickLine={false} axisLine={false} />
        <YAxis tick={axisStyle} tickLine={false} axisLine={false} />
        <Tooltip
          content={<Tip formatter={formatter} />}
          cursor={{ fill: "#ffffff08" }}
        />
        {bars.length > 1 && (
          <Legend
            iconType="circle"
            wrapperStyle={{ fontSize: 11, color: "#94A3B8" }}
          />
        )}
        {bars.map((b) => (
          <Bar
            key={b.key}
            dataKey={b.key}
            name={b.name}
            fill={b.color}
            stackId={stacked ? "a" : undefined}
            radius={stacked ? [0, 0, 0, 0] : [6, 6, 0, 0]}
            maxBarSize={48}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

export function HBarChart({
  data,
  dataKey = "value",
  color = CHART_PALETTE[0],
  formatter,
  height = 250,
  colorByIndex,
}: {
  data: Datum[];
  dataKey?: string;
  color?: string;
  formatter?: (v: number) => string;
  height?: number;
  colorByIndex?: boolean;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 4, right: 12, left: 8, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} horizontal={false} />
        <XAxis type="number" tick={axisStyle} tickLine={false} axisLine={false} />
        <YAxis
          type="category"
          dataKey="name"
          tick={axisStyle}
          tickLine={false}
          axisLine={false}
          width={110}
        />
        <Tooltip content={<Tip formatter={formatter} />} cursor={{ fill: "#ffffff08" }} />
        <Bar dataKey={dataKey} radius={[0, 6, 6, 0]} maxBarSize={26}>
          {data.map((_, i) => (
            <Cell
              key={i}
              fill={colorByIndex ? CHART_PALETTE[i % CHART_PALETTE.length] : color}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function TrendChart({
  data,
  areas,
  formatter,
  height = 250,
  type = "area",
}: {
  data: Datum[];
  areas: { key: string; color: string; name: string }[];
  formatter?: (v: number) => string;
  height?: number;
  type?: "area" | "line";
}) {
  if (type === "line") {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 6, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
          <XAxis dataKey="name" tick={axisStyle} tickLine={false} axisLine={false} />
          <YAxis tick={axisStyle} tickLine={false} axisLine={false} />
          <Tooltip content={<Tip formatter={formatter} />} />
          {areas.length > 1 && (
            <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
          )}
          {areas.map((a) => (
            <Line
              key={a.key}
              type="monotone"
              dataKey={a.key}
              name={a.name}
              stroke={a.color}
              strokeWidth={2.5}
              dot={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    );
  }
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 6, right: 10, left: -10, bottom: 0 }}>
        <defs>
          {areas.map((a) => (
            <linearGradient key={a.key} id={`grad-${a.key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={a.color} stopOpacity={0.5} />
              <stop offset="95%" stopColor={a.color} stopOpacity={0} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
        <XAxis dataKey="name" tick={axisStyle} tickLine={false} axisLine={false} />
        <YAxis tick={axisStyle} tickLine={false} axisLine={false} />
        <Tooltip content={<Tip formatter={formatter} />} />
        {areas.length > 1 && (
          <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
        )}
        {areas.map((a) => (
          <Area
            key={a.key}
            type="monotone"
            dataKey={a.key}
            name={a.name}
            stroke={a.color}
            strokeWidth={2.5}
            fill={`url(#grad-${a.key})`}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
}

const TreemapContent = (props: any) => {
  const { x, y, width, height, name, index, value } = props;
  const color = CHART_PALETTE[index % CHART_PALETTE.length];
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={6}
        style={{ fill: color, stroke: "#0F172A", strokeWidth: 3 }}
      />
      {width > 70 && height > 34 && (
        <>
          <text x={x + 8} y={y + 20} fill="#fff" fontSize={12} fontWeight={600}>
            {name}
          </text>
          <text x={x + 8} y={y + 36} fill="#ffffffcc" fontSize={11}>
            {value}
          </text>
        </>
      )}
    </g>
  );
};

export function TreemapChart({ data, height = 250 }: { data: Datum[]; height?: number }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <Treemap
        data={data}
        dataKey="value"
        nameKey="name"
        content={<TreemapContent />}
        isAnimationActive={false}
      >
        <Tooltip content={<Tip />} />
      </Treemap>
    </ResponsiveContainer>
  );
}

export function ScatterPlot({
  data,
  xName,
  yName,
  formatter,
  height = 260,
}: {
  data: { x: number; y: number; z?: number; churn?: boolean }[];
  xName: string;
  yName: string;
  formatter?: (v: number) => string;
  height?: number;
}) {
  const churned = data.filter((d) => d.churn);
  const active = data.filter((d) => !d.churn);
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ScatterChart margin={{ top: 10, right: 10, left: -8, bottom: 6 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
        <XAxis
          type="number"
          dataKey="x"
          name={xName}
          tick={axisStyle}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          type="number"
          dataKey="y"
          name={yName}
          tick={axisStyle}
          tickLine={false}
          axisLine={false}
        />
        <ZAxis type="number" dataKey="z" range={[30, 220]} />
        <Tooltip content={<Tip formatter={formatter} />} cursor={{ strokeDasharray: "3 3" }} />
        <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
        <Scatter name="Retained" data={active} fill="#22C55E" fillOpacity={0.5} />
        <Scatter name="Churned" data={churned} fill="#EF4444" fillOpacity={0.6} />
      </ScatterChart>
    </ResponsiveContainer>
  );
}

// Simple heatmap grid (rows x cols) colored by intensity.
export function Heatmap({
  rows,
  cols,
  matrix,
  valueFormat,
}: {
  rows: string[];
  cols: string[];
  matrix: number[][];
  valueFormat?: (v: number) => string;
}) {
  const flat = matrix.flat();
  const max = Math.max(...flat, 1);
  const min = Math.min(...flat, 0);
  const color = (v: number) => {
    const t = (v - min) / (max - min || 1);
    // green -> orange -> red
    const r = Math.round(34 + t * (239 - 34));
    const g = Math.round(197 - t * (197 - 68));
    const b = Math.round(94 - t * (94 - 68));
    return `rgba(${r},${g},${b},${0.25 + t * 0.65})`;
  };
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-separate border-spacing-1 text-xs">
        <thead>
          <tr>
            <th className="p-1" />
            {cols.map((c) => (
              <th key={c} className="p-1 text-center font-medium text-slate-400">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, ri) => (
            <tr key={r}>
              <td className="whitespace-nowrap p-1 pr-2 text-right font-medium text-slate-400">
                {r}
              </td>
              {cols.map((_, ci) => (
                <td
                  key={ci}
                  className="rounded-md p-2 text-center font-semibold text-white"
                  style={{ background: color(matrix[ri][ci]) }}
                >
                  {valueFormat
                    ? valueFormat(matrix[ri][ci])
                    : matrix[ri][ci]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
