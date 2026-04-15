import { db } from "@/lib/db";
import StatsCard from "@/components/admin/StatsCard";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Plane, Clock, BarChart3, Euro } from "lucide-react";
import Link from "next/link";

const statusLabels: Record<string, { label: string; className: string }> = {
  pending: {
    label: "En attente",
    className: "bg-orange-100 text-orange-800 border-orange-200",
  },
  confirmed: {
    label: "Confirmée",
    className: "bg-green-100 text-green-800 border-green-200",
  },
  in_progress: {
    label: "En cours",
    className: "bg-blue-100 text-blue-800 border-blue-200",
  },
  completed: {
    label: "Terminée",
    className: "bg-gray-100 text-gray-700 border-gray-200",
  },
  cancelled: {
    label: "Annulée",
    className: "bg-red-100 text-red-800 border-red-200",
  },
};

const sourceLabels: Record<
  string,
  { label: string; dotColor: string; className: string }
> = {
  booking: {
    label: "Booking",
    dotColor: "bg-blue-500",
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },
  airbnb: {
    label: "Airbnb",
    dotColor: "bg-pink-500",
    className: "bg-pink-50 text-pink-700 border-pink-200",
  },
  direct: {
    label: "Direct",
    dotColor: "bg-green-500",
    className: "bg-green-50 text-green-700 border-green-200",
  },
};

export default async function AdminDashboardPage() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 1);
  const daysInMonth = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    0,
  ).getDate();

  const dateJour = format(today, "EEEE d MMMM yyyy", { locale: fr });
  const moisNom = today.toLocaleDateString("fr-FR", { month: "long" });

  const [arrivees, enAttente, reservationsMois, recentesRaw] =
    await Promise.all([
      db.reservation.count({
        where: {
          status: "confirmed",
          checkIn: { gte: today, lt: tomorrow },
        },
      }),
      db.reservation.count({
        where: { status: "pending" },
      }),
      db.reservation.findMany({
        where: {
          status: { in: ["confirmed", "completed", "in_progress"] },
          checkIn: { lt: monthEnd },
          checkOut: { gt: monthStart },
        },
        select: {
          checkIn: true,
          checkOut: true,
          totalAmount: true,
          status: true,
        },
      }),
      db.reservation.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          guestName: true,
          checkIn: true,
          checkOut: true,
          guests: true,
          status: true,
          source: true,
          totalAmount: true,
        },
      }),
    ]);

  // Taux d'occupation
  let joursReserves = 0;
  for (const r of reservationsMois) {
    const debut = r.checkIn < monthStart ? monthStart : r.checkIn;
    const fin = r.checkOut > monthEnd ? monthEnd : r.checkOut;
    const jours = Math.max(
      0,
      Math.ceil((fin.getTime() - debut.getTime()) / (1000 * 60 * 60 * 24)),
    );
    joursReserves += jours;
  }
  const tauxOccupation = Math.min(
    100,
    Math.round((joursReserves / daysInMonth) * 100),
  );

  // CA du mois
  const caMois = reservationsMois
    .filter((r) => ["confirmed", "completed"].includes(r.status))
    .reduce((s, r) => s + (r.totalAmount ?? 0), 0);

  const caMoisEuros = (caMois / 100).toLocaleString("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  });

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header card */}
      <div className="bg-white rounded-2xl px-8 py-7 shadow-sm border border-gray-100">
        <h1 className="text-3xl font-heading font-bold text-tulipe-royal">
          Bonjour !
        </h1>
        <p className="text-lg text-gray-500 mt-1 capitalize">{dateJour}</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <StatsCard
          icon={Plane}
          label="Arrivées aujourd'hui"
          value={arrivees}
          color="green"
        />
        <StatsCard
          icon={Clock}
          label="En attente de confirmation"
          value={enAttente}
          color="orange"
        />
        <StatsCard
          icon={BarChart3}
          label={`Occupation en ${moisNom}`}
          value={`${tauxOccupation}%`}
          color="blue"
        />
        <StatsCard
          icon={Euro}
          label={`Revenus en ${moisNom}`}
          value={caMoisEuros}
          color="gold"
        />
      </div>

      {/* Recent reservations */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
          <h2 className="font-heading text-2xl font-bold text-tulipe-royal">
            Dernières réservations
          </h2>
          <Link
            href="/admin/reservations"
            className="text-base font-semibold text-tulipe-green hover:underline"
          >
            Tout voir →
          </Link>
        </div>

        {recentesRaw.length === 0 ? (
          <p className="text-xl text-gray-400 text-center py-16">
            Aucune réservation pour le moment
          </p>
        ) : (
          <div className="p-6 space-y-4">
            {recentesRaw.map((r) => {
              const statusInfo = statusLabels[r.status] ?? {
                label: r.status,
                className: "bg-gray-100 text-gray-700 border-gray-200",
              };
              const sourceInfo = sourceLabels[r.source] ?? {
                label: r.source,
                dotColor: "bg-gray-400",
                className: "bg-gray-50 text-gray-700 border-gray-200",
              };
              const checkIn = format(new Date(r.checkIn), "dd MMMM yyyy", {
                locale: fr,
              });
              const checkOut = format(new Date(r.checkOut), "dd MMMM yyyy", {
                locale: fr,
              });
              const montant =
                r.totalAmount !== null
                  ? (r.totalAmount / 100).toLocaleString("fr-FR", {
                      style: "currency",
                      currency: "EUR",
                    })
                  : "—";

              return (
                <div
                  key={r.id}
                  className="bg-[#FAF8F5] rounded-2xl px-6 py-5 flex flex-col sm:flex-row sm:items-center gap-4 border border-gray-100"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-xl font-bold text-tulipe-royal truncate">
                      {r.guestName}
                    </p>
                    <p className="text-base text-gray-600 mt-1">
                      Du {checkIn} au {checkOut}
                    </p>
                    <p className="text-base text-gray-500 mt-0.5">
                      {r.guests} personne{r.guests > 1 ? "s" : ""} · {montant}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    {/* Source badge with dot */}
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold border ${sourceInfo.className}`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ${sourceInfo.dotColor}`}
                      />
                      {sourceInfo.label}
                    </span>
                    {/* Status badge */}
                    <span
                      className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-semibold border ${statusInfo.className}`}
                    >
                      {statusInfo.label}
                    </span>
                  </div>
                  <div className="flex gap-3 shrink-0">
                    <Link
                      href="/admin/reservations"
                      className="flex items-center gap-2 px-5 py-2.5 bg-tulipe-green text-white text-base font-semibold rounded-xl hover:bg-tulipe-green-dark transition-colors min-h-[44px]"
                    >
                      Voir
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
