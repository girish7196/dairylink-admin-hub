import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const axis = {
  stroke: "var(--muted-foreground)",
  fontSize: 11,
  tickLine: false,
  axisLine: false,
};

const tooltipStyle = {
  contentStyle: {
    background: "var(--popover)",
    border: "1px solid var(--border)",
    borderRadius: "10px",
    color: "var(--popover-foreground)",
    fontSize: "12px",
  },
  labelStyle: { color: "var(--muted-foreground)", marginBottom: 4 },
};

export function CollectionAreaChart({
  data,
  height = 280,
}: {
  data: { label: string; morning: number; evening: number }[];
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ left: 4, right: 6, top: 8 }}>
        <defs>
          <linearGradient id="gMorning" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.45} />
            <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0.03} />
          </linearGradient>
          <linearGradient id="gEvening" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--chart-2)" stopOpacity={0.45} />
            <stop offset="100%" stopColor="var(--chart-2)" stopOpacity={0.03} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis dataKey="label" {...axis} />
        <YAxis {...axis} width={52} unit=" L" />
        <Tooltip {...tooltipStyle} formatter={(v: number) => `${v} L`} />
        <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
        <Area
          type="monotone"
          dataKey="morning"
          name="Morning"
          stroke="var(--chart-1)"
          fill="url(#gMorning)"
          strokeWidth={2}
        />
        <Area
          type="monotone"
          dataKey="evening"
          name="Evening"
          stroke="var(--chart-2)"
          fill="url(#gEvening)"
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function PaymentBarChart({
  data,
  height = 280,
}: {
  data: { label: string; paid: number; pending: number }[];
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ left: -6, right: 6, top: 8 }} barGap={4}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis dataKey="label" {...axis} />
        <YAxis {...axis} width={62} tickFormatter={(v: number) => `₹${v / 1000}k`} />
        <Tooltip
          {...tooltipStyle}
          formatter={(v: number) => `₹${v.toLocaleString("en-IN")}`}
        />
        <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
        <Bar dataKey="paid" name="Paid" fill="var(--chart-1)" radius={[6, 6, 0, 0]} />
        <Bar dataKey="pending" name="Pending" fill="var(--chart-2)" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function SimpleBarChart({
  data,
  unit = "",
  dataKey = "litres",
  name = "Litres",
}: {
  data: { label: string; [k: string]: string | number }[];
  unit?: string;
  dataKey?: string;
  name?: string;
}) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ left: -12, right: 6, top: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis dataKey="label" {...axis} />
        <YAxis {...axis} width={58} />
        <Tooltip {...tooltipStyle} formatter={(v: number) => `${v}${unit}`} />
        <Bar dataKey={dataKey} name={name} fill="var(--chart-1)" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function TrendLineChart({
  data,
  dataKey = "value",
  name = "Value",
  prefix = "₹",
}: {
  data: { label: string; [k: string]: string | number }[];
  dataKey?: string;
  name?: string;
  prefix?: string;
}) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ left: -4, right: 6, top: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis dataKey="label" {...axis} />
        <YAxis {...axis} width={62} tickFormatter={(v: number) => `${prefix}${v / 1000}k`} />
        <Tooltip
          {...tooltipStyle}
          formatter={(v: number) => `${prefix}${v.toLocaleString("en-IN")}`}
        />
        <Line
          type="monotone"
          dataKey={dataKey}
          name={name}
          stroke="var(--chart-1)"
          strokeWidth={2.5}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

const pieColors = ["var(--chart-1)", "var(--chart-3)", "var(--chart-2)", "var(--chart-4)"];

export function QualityPieChart({ data }: { data: { label: string; value: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="label"
          innerRadius={58}
          outerRadius={92}
          paddingAngle={3}
          stroke="var(--card)"
        >
          {data.map((_, i) => (
            <Cell key={i} fill={pieColors[i % pieColors.length]} />
          ))}
        </Pie>
        <Tooltip {...tooltipStyle} formatter={(v: number) => `${v} samples`} />
        <Legend iconType="circle" wrapperStyle={{ fontSize: 12, textTransform: "capitalize" }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
