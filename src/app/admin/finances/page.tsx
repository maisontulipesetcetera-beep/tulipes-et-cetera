"use client";

import { useState, useEffect } from "react";
import { Loader2, Euro, TrendingUp, Calendar, CreditCard } from "lucide-react";
import RevenueChart from "@/components/admin/RevenueChart";
import OccupancyGauge from "@/components/admin/OccupancyGauge";
import SourcePieChart from "@/components/admin/SourcePieChart";

interface MonthlyRevenue {
  month: string;
  amount: number;
}

interface MonthlyOccupancy {
  month: string;
  rate: number;
}

interface SourceBreakdown {
  source: string;
  amount: number;
}

interface Payment {
  id: string;
  guestName: string;
  checkIn: string;
  checkOut: string;
  total: number;
  deposit: number;
  depositPaid: boolean;
  balance: number;
  paymentStatus: "paid" | "deposit" | "pending";
}

interface FinancesData {
  monthlyRevenue: MonthlyRevenue[];
  monthlyOccupancy: MonthlyOccupancy[];
  sourceBreakdown: SourceBreakdown[];
  payments: Payment[];
}

const paymentStatusConfig: Record<
  string,
  { label: string; badgeClass: string }
> = {
  paid: {
    label: "Payé",
    badgeClass: "bg-green-100 text-green-800 border-green-300",
  },
  deposit: {
    label: "Acompte",
    badgeClass: "bg-orange-100 text-orange-800 border-orange-300",
  },
  pending: {
    label: "En attente",
    badgeClass: "bg-red-100 text-red-800 border-red-300",
  },
};

function formatEuros(cents: number): string {
  return (cents / 100).toLocaleString("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  });
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function FinancesPage() {
  const [data, setData] = useState<FinancesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/stats/finances", { credentials: "include" })
      .then((r) => {
        if (!r.ok) throw new Error("Erreur de chargement");
        return r.json();
      })
      .then((d: FinancesData) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => {
        setError("Impossible de charger les données financières");
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
    return <div className="text-center py-24 text-red-500">{error}</div>;
  }

  const totalRevenue = data.monthlyRevenue.reduce((s, m) => s + m.amount, 0);
  const avgOccupancy =
    data.monthlyOccupancy.length > 0
      ? Math.round(
          data.monthlyOccupancy.reduce((s, m) => s + m.rate, 0) /
            data.monthlyOccupancy.length,
        )
      : 0;
  const pendingCount = data.payments.filter(
    (p) => p.paymentStatus === "pending",
  ).length;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* En-tête */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-8 py-6 shadow-sm">
        <h1 className="text-3xl font-heading font-bold text-tulipe-royal">
          💰 Finances
        </h1>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col gap-3">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
            <Euro size={20} className="text-green-700" />
          </div>
          <div>
            <p className="text-2xl font-bold text-tulipe-royal">
              {formatEuros(totalRevenue)}
            </p>
            <p className="text-sm text-gray-500 mt-1">Revenus (12 mois)</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <TrendingUp size={20} className="text-blue-700" />
          </div>
          <div>
            <p className="text-2xl font-bold text-tulipe-royal">
              {avgOccupancy}%
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Taux d&apos;occupation moyen
            </p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
            <Calendar size={20} className="text-amber-700" />
          </div>
          <div>
            <p className="text-2xl font-bold text-tulipe-royal">
              {data.payments.length}
            </p>
            <p className="text-sm text-gray-500 mt-1">Réservations (12 mois)</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col gap-3">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
            <CreditCard size={20} className="text-red-700" />
          </div>
          <div>
            <p className="text-2xl font-bold text-tulipe-royal">
              {pendingCount}
            </p>
            <p className="text-sm text-gray-500 mt-1">Paiements en attente</p>
          </div>
        </div>
      </div>

      {/* Charts grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue chart */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-800 mb-4">
            Revenus mensuels
          </h2>
          {data.monthlyRevenue.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-12">
              Aucune donnée
            </p>
          ) : (
            <RevenueChart data={data.monthlyRevenue} />
          )}
        </div>

        {/* Occupancy gauge */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-800 mb-4">
            Taux d&apos;occupation mensuel
          </h2>
          {data.monthlyOccupancy.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-12">
              Aucune donnée
            </p>
          ) : (
            <OccupancyGauge data={data.monthlyOccupancy} />
          )}
        </div>
      </div>

      {/* Source pie chart */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-800 mb-4">
          Revenus par source
        </h2>
        <div className="max-w-sm mx-auto">
          <SourcePieChart data={data.sourceBreakdown} />
        </div>
      </div>

      {/* Payments table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-800">
            Tableau des paiements
          </h2>
        </div>
        {data.payments.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-12">
            Aucun paiement
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Client
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">
                    Arrivée
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">
                    Départ
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Total
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">
                    Acompte
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">
                    Solde
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Statut
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {data.payments.map((payment) => {
                  const status =
                    paymentStatusConfig[payment.paymentStatus] ??
                    paymentStatusConfig.pending;
                  return (
                    <tr
                      key={payment.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3 font-medium text-tulipe-royal">
                        {payment.guestName}
                      </td>
                      <td className="px-4 py-3 text-gray-500 hidden md:table-cell">
                        {formatDate(payment.checkIn)}
                      </td>
                      <td className="px-4 py-3 text-gray-500 hidden md:table-cell">
                        {formatDate(payment.checkOut)}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-tulipe-royal">
                        {formatEuros(payment.total)}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-500 hidden sm:table-cell">
                        {formatEuros(payment.deposit)}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-500 hidden sm:table-cell">
                        {formatEuros(payment.balance)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border ${status.badgeClass}`}
                        >
                          {status.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
