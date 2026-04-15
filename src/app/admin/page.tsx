import { db } from "@/lib/db";
import StatsCard from "@/components/admin/StatsCard";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const statusLabels: Record<string, { label: string; className: string }> = {
  pending: { label: "En attente", className: "bg-yellow-100 text-yellow-800" },
  confirmed: { label: "Confirmée", className: "bg-green-100 text-green-800" },
  in_progress: { label: "En cours", className: "bg-blue-100 text-blue-800" },
  completed: { label: "Terminée", className: "bg-gray-100 text-gray-700" },
  cancelled: { label: "Annulée", className: "bg-red-100 text-red-800" },
};

const sourceLabels: Record<string, { label: string; className: string }> = {
  booking: { label: "Booking", className: "bg-blue-100 text-blue-700" },
  airbnb: { label: "Airbnb", className: "bg-pink-100 text-pink-700" },
  direct: { label: "Direct", className: "bg-green-100 text-green-700" },
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

  const [arrivees, enAttente, reservationsMois, recentesRaw] =
    await Promise.all([
      // Arrivées aujourd'hui
      db.reservation.count({
        where: {
          status: "confirmed",
          checkIn: { gte: today, lt: tomorrow },
        },
      }),
      // Réservations en attente
      db.reservation.count({
        where: { status: "pending" },
      }),
      // Réservations ce mois pour taux d'occupation + CA
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
      // 5 dernières réservations
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
          createdAt: true,
        },
      }),
    ]);

  // Calcul taux d'occupation : nombre de jours réservés dans le mois
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

  // CA du mois : sum confirmed + completed
  const caMois = reservationsMois
    .filter((r) => ["confirmed", "completed"].includes(r.status))
    .reduce((s, r) => s + (r.totalAmount ?? 0), 0);

  const caMoisEuros = (caMois / 100).toLocaleString("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-heading font-bold text-tulipe-bordeaux">
        Tableau de bord
      </h1>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard
          icon="🏠"
          label="Arrivées aujourd'hui"
          value={arrivees}
          color="green"
        />
        <StatsCard
          icon="⏳"
          label="En attente"
          value={enAttente}
          color="orange"
        />
        <StatsCard
          icon="📅"
          label={`Occupation ${today.toLocaleDateString("fr-FR", { month: "long" })}`}
          value={`${tauxOccupation}%`}
          color="blue"
        />
        <StatsCard
          icon="💶"
          label={`CA ${today.toLocaleDateString("fr-FR", { month: "long" })}`}
          value={caMoisEuros}
          color="green"
        />
      </div>

      {/* Réservations récentes */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="font-heading font-semibold text-gray-900">
            Réservations récentes
          </h2>
          <a
            href="/admin/reservations"
            className="text-sm text-tulipe-green hover:underline"
          >
            Voir tout →
          </a>
        </div>

        {recentesRaw.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-10">
            Aucune réservation pour le moment
          </p>
        ) : (
          <div className="divide-y divide-gray-50">
            {recentesRaw.map((r) => {
              const statusInfo = statusLabels[r.status] ?? {
                label: r.status,
                className: "bg-gray-100 text-gray-700",
              };
              const sourceInfo = sourceLabels[r.source] ?? {
                label: r.source,
                className: "bg-gray-100 text-gray-700",
              };
              const checkIn = format(new Date(r.checkIn), "dd/MM/yyyy", {
                locale: fr,
              });
              const checkOut = format(new Date(r.checkOut), "dd/MM/yyyy", {
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
                  className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 text-sm truncate">
                      {r.guestName}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {checkIn} → {checkOut} · {r.guests} pers.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-4 shrink-0">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${sourceInfo.className}`}
                    >
                      {sourceInfo.label}
                    </span>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusInfo.className}`}
                    >
                      {statusInfo.label}
                    </span>
                    <span className="text-sm font-semibold text-gray-700 hidden sm:block">
                      {montant}
                    </span>
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
