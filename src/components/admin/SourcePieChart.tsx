"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface SourceBreakdown {
  source: string;
  amount: number;
}

interface Props {
  data: SourceBreakdown[];
}

const SOURCE_CONFIG: Record<string, { label: string; color: string }> = {
  booking: { label: "Booking.com", color: "#3b82f6" },
  airbnb: { label: "Airbnb", color: "#ec4899" },
  direct: { label: "Direct", color: "#2D6A4F" },
};

function formatEuros(cents: number): string {
  return (cents / 100).toLocaleString("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  });
}

interface LabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
}

function renderCustomLabel({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: LabelProps) {
  if (percent < 0.05) return null;
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={12}
      fontWeight={600}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
}

export default function SourcePieChart({ data }: Props) {
  const total = data.reduce((s, d) => s + d.amount, 0);

  const chartData = data
    .filter((d) => d.amount > 0)
    .map((d) => ({
      name: SOURCE_CONFIG[d.source]?.label ?? d.source,
      value: d.amount,
      color: SOURCE_CONFIG[d.source]?.color ?? "#9ca3af",
    }));

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-[260px] text-gray-400 text-sm">
        Aucune donnée
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            outerRadius={90}
            dataKey="value"
            labelLine={false}
            label={renderCustomLabel as any}
          >
            {chartData.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => [formatEuros(value as number), "Revenus"]}
            contentStyle={{
              border: "1px solid #e5e7eb",
              borderRadius: 8,
              fontSize: 12,
            }}
          />
          <Legend
            formatter={(value) => (
              <span style={{ fontSize: 12, color: "#374151" }}>{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Totals row */}
      <div className="flex gap-4 justify-center text-xs text-gray-500">
        {chartData.map((d) => (
          <div key={d.name} className="text-center">
            <p style={{ color: d.color }} className="font-semibold">
              {formatEuros(d.value)}
            </p>
            <p>{d.name}</p>
          </div>
        ))}
      </div>
      <p className="text-center text-xs text-gray-400">
        Total : {formatEuros(total)}
      </p>
    </div>
  );
}
