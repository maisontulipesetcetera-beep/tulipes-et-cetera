"use client";

import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Loader2, TrendingUp, Calendar, Euro, CheckCircle } from "lucide-react";

interface StatsData {
  byMonth: { month: string; count: number; revenue: number }[];
  bySource: { source: string; count: number }[];
  totalReservations: number;
  totalRevenue: number;
  confirmedCount: number;
}

const SOURCE_LABELS: Record<string, string> = {
  direct: "Direct",
  booking: "Booking.com",
  airbnb: "Airbnb",
};

const PIE_COLORS = ["#667846", "#c5a55a", "#722f37", "#9cac76", "#4f5e36"];

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-2xl font-bold text-tulipe-green mt-1">{value}</p>
          {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
        </div>
        <div className="p-2.5 bg-tulipe-green/10 rounded-lg">
          <Icon size={20} className="text-tulipe-green" />
        </div>
      </div>
    </div>
  );
}

export default function StatistiquesPage() {
  const [data, setData] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/stats/reservations")
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => {
        setError("Impossible de charger les statistiques");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="animate-spin text-tulipe-green" size={32} />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-center py-24 text-red-500 text-sm">{error}</div>
    );
  }

  const conversionRate =
    data.totalReservations > 0
      ? Math.round((data.confirmedCount / data.totalReservations) * 100)
      : 0;

  const revenueData = data.byMonth.map((m) => ({
    ...m,
    revenue: parseFloat((m.revenue / 100).toFixed(2)),
  }));

  const sourceData = data.bySource.map((s) => ({
    ...s,
    name: SOURCE_LABELS[s.source] ?? s.source,
  }));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-heading font-bold text-tulipe-green">
        Statistiques
      </h1>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Calendar}
          label="Réservations totales"
          value={String(data.totalReservations)}
        />
        <StatCard
          icon={CheckCircle}
          label="Confirmées"
          value={String(data.confirmedCount)}
        />
        <StatCard
          icon={TrendingUp}
          label="Taux de conversion"
          value={`${conversionRate}%`}
          sub="confirmées / totales"
        />
        <StatCard
          icon={Euro}
          label="Revenus totaux"
          value={`${(data.totalRevenue / 100).toLocaleString("fr-FR")} €`}
        />
      </div>

      {/* Bar chart — reservations by month */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-sm font-semibold text-gray-800 mb-4">
          Réservations par mois
        </h2>
        {data.byMonth.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-12">
            Aucune donnée disponible
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={data.byMonth}
              margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  fontSize: 12,
                  borderRadius: 8,
                  border: "1px solid #e5e7eb",
                }}
              />
              <Bar
                dataKey="count"
                name="Réservations"
                fill="#667846"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue bar chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-800 mb-4">
            Revenus par mois (€)
          </h2>
          {revenueData.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-12">
              Aucune donnée
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={revenueData}
                margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    fontSize: 12,
                    borderRadius: 8,
                    border: "1px solid #e5e7eb",
                  }}
                  formatter={(v) => [`${v} €`, "Revenus"]}
                />
                <Bar
                  dataKey="revenue"
                  name="Revenus"
                  fill="#c5a55a"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Source pie chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-800 mb-4">
            Origine des réservations
          </h2>
          {sourceData.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-12">
              Aucune donnée
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={sourceData}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, percent }) =>
                    `${name} ${Math.round((percent ?? 0) * 100)}%`
                  }
                  labelLine={false}
                >
                  {sourceData.map((_, index) => (
                    <Cell
                      key={index}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Legend
                  iconType="circle"
                  iconSize={8}
                  formatter={(v) => <span style={{ fontSize: 12 }}>{v}</span>}
                />
                <Tooltip
                  contentStyle={{
                    fontSize: 12,
                    borderRadius: 8,
                    border: "1px solid #e5e7eb",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Top pages placeholder */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-sm font-semibold text-gray-800 mb-2">
          Pages les plus visitées
        </h2>
        <p className="text-sm text-gray-400">
          Disponible après intégration de Vercel Analytics.
        </p>
      </div>
    </div>
  );
}
