"use client";

import { useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { X, Check, Ban, Eye } from "lucide-react";

interface Reservation {
  id: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string | null;
  checkIn: string;
  checkOut: string;
  guests: number;
  source: string;
  status: string;
  totalAmount: number | null;
  depositAmount: number | null;
  depositPaid: boolean;
  message: string | null;
  notes: string | null;
  createdAt: string;
}

interface ReservationTableProps {
  reservations: Reservation[];
  onStatusChange?: (id: string, status: string) => void;
}

const statusLabels: Record<string, { label: string; className: string }> = {
  pending: {
    label: "En attente",
    className: "bg-yellow-100 text-yellow-800",
  },
  confirmed: { label: "Confirmée", className: "bg-green-100 text-green-800" },
  in_progress: { label: "En cours", className: "bg-blue-100 text-blue-800" },
  completed: { label: "Terminée", className: "bg-gray-100 text-gray-700" },
  cancelled: { label: "Annulée", className: "bg-red-100 text-red-800" },
};

const sourceLabels: Record<string, { label: string; className: string }> = {
  booking: { label: "Booking", className: "bg-blue-100 text-blue-800" },
  airbnb: { label: "Airbnb", className: "bg-pink-100 text-pink-800" },
  direct: { label: "Direct", className: "bg-green-100 text-green-800" },
};

function StatusBadge({ status }: { status: string }) {
  const s = statusLabels[status] ?? {
    label: status,
    className: "bg-gray-100 text-gray-700",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${s.className}`}
    >
      {s.label}
    </span>
  );
}

function SourceBadge({ source }: { source: string }) {
  const s = sourceLabels[source] ?? {
    label: source,
    className: "bg-gray-100 text-gray-700",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${s.className}`}
    >
      {s.label}
    </span>
  );
}

function formatDate(dateStr: string) {
  return format(new Date(dateStr), "dd/MM/yyyy", { locale: fr });
}

function formatAmount(cents: number | null) {
  if (cents === null) return "—";
  return (cents / 100).toLocaleString("fr-FR", {
    style: "currency",
    currency: "EUR",
  });
}

export default function ReservationTable({
  reservations,
  onStatusChange,
}: ReservationTableProps) {
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterSource, setFilterSource] = useState("all");
  const [filterDate, setFilterDate] = useState("");
  const [selectedReservation, setSelectedReservation] =
    useState<Reservation | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  const filtered = reservations.filter((r) => {
    if (filterStatus !== "all" && r.status !== filterStatus) return false;
    if (filterSource !== "all" && r.source !== filterSource) return false;
    if (filterDate) {
      const checkIn = new Date(r.checkIn).toISOString().slice(0, 10);
      const checkOut = new Date(r.checkOut).toISOString().slice(0, 10);
      if (checkIn > filterDate || checkOut < filterDate) return false;
    }
    return true;
  });

  async function handleStatusChange(id: string, status: string) {
    setUpdating(id);
    try {
      const res = await fetch(`/api/reservations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        onStatusChange?.(id, status);
        if (selectedReservation?.id === id) {
          setSelectedReservation((prev) => (prev ? { ...prev, status } : null));
        }
      }
    } finally {
      setUpdating(null);
    }
  }

  function exportCSV() {
    const headers = [
      "ID",
      "Client",
      "Email",
      "Téléphone",
      "Arrivée",
      "Départ",
      "Personnes",
      "Source",
      "Statut",
      "Montant",
    ];
    const rows = filtered.map((r) => [
      r.id,
      r.guestName,
      r.guestEmail,
      r.guestPhone ?? "",
      formatDate(r.checkIn),
      formatDate(r.checkOut),
      r.guests,
      r.source,
      r.status,
      formatAmount(r.totalAmount),
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map((v) => `"${v}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `reservations-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      {/* Filters + Export */}
      <div className="flex flex-wrap gap-3 mb-4 items-center">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-tulipe-green"
        >
          <option value="all">Tous les statuts</option>
          <option value="pending">En attente</option>
          <option value="confirmed">Confirmée</option>
          <option value="in_progress">En cours</option>
          <option value="completed">Terminée</option>
          <option value="cancelled">Annulée</option>
        </select>

        <select
          value={filterSource}
          onChange={(e) => setFilterSource(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-tulipe-green"
        >
          <option value="all">Toutes les sources</option>
          <option value="direct">Direct</option>
          <option value="booking">Booking</option>
          <option value="airbnb">Airbnb</option>
        </select>

        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-tulipe-green"
          placeholder="Filtrer par date"
        />

        {(filterStatus !== "all" || filterSource !== "all" || filterDate) && (
          <button
            onClick={() => {
              setFilterStatus("all");
              setFilterSource("all");
              setFilterDate("");
            }}
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            Réinitialiser
          </button>
        )}

        <button
          onClick={exportCSV}
          className="ml-auto flex items-center gap-1.5 px-4 py-1.5 bg-tulipe-green text-white text-sm font-medium rounded-lg hover:bg-tulipe-green-dark transition-colors"
        >
          Exporter CSV
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Client
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Dates
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700 hidden md:table-cell">
                Pers.
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700 hidden sm:table-cell">
                Source
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Statut
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700 hidden lg:table-cell">
                Montant
              </th>
              <th className="px-4 py-3 text-right font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-10 text-gray-400">
                  Aucune réservation trouvée
                </td>
              </tr>
            )}
            {filtered.map((r) => (
              <tr
                key={r.id}
                className="hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => setSelectedReservation(r)}
              >
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-900">{r.guestName}</p>
                  <p className="text-xs text-gray-500">{r.guestEmail}</p>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <p>{formatDate(r.checkIn)}</p>
                  <p className="text-xs text-gray-500">
                    → {formatDate(r.checkOut)}
                  </p>
                </td>
                <td className="px-4 py-3 hidden md:table-cell text-gray-600">
                  {r.guests}
                </td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  <SourceBadge source={r.source} />
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={r.status} />
                </td>
                <td className="px-4 py-3 hidden lg:table-cell text-gray-700">
                  {formatAmount(r.totalAmount)}
                </td>
                <td
                  className="px-4 py-3 text-right"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => setSelectedReservation(r)}
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="Voir détails"
                    >
                      <Eye size={15} />
                    </button>
                    {r.status === "pending" && (
                      <button
                        onClick={() => handleStatusChange(r.id, "confirmed")}
                        disabled={updating === r.id}
                        className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors disabled:opacity-50"
                        title="Confirmer"
                      >
                        <Check size={15} />
                      </button>
                    )}
                    {r.status !== "cancelled" && r.status !== "completed" && (
                      <button
                        onClick={() => handleStatusChange(r.id, "cancelled")}
                        disabled={updating === r.id}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                        title="Annuler"
                      >
                        <Ban size={15} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {selectedReservation && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedReservation(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-heading text-lg font-semibold text-tulipe-bordeaux">
                Fiche réservation
              </h2>
              <button
                onClick={() => setSelectedReservation(null)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded"
              >
                <X size={20} />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              {/* Status + source row */}
              <div className="flex gap-2">
                <StatusBadge status={selectedReservation.status} />
                <SourceBadge source={selectedReservation.source} />
              </div>

              {/* Client */}
              <div>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Client
                </h3>
                <div className="space-y-1 text-sm">
                  <p className="font-medium text-gray-900">
                    {selectedReservation.guestName}
                  </p>
                  <p className="text-gray-600">
                    {selectedReservation.guestEmail}
                  </p>
                  {selectedReservation.guestPhone && (
                    <p className="text-gray-600">
                      {selectedReservation.guestPhone}
                    </p>
                  )}
                </div>
              </div>

              {/* Séjour */}
              <div>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Séjour
                </h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-gray-500">Arrivée</p>
                    <p className="font-medium">
                      {formatDate(selectedReservation.checkIn)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Départ</p>
                    <p className="font-medium">
                      {formatDate(selectedReservation.checkOut)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Personnes</p>
                    <p className="font-medium">{selectedReservation.guests}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Montant total</p>
                    <p className="font-medium">
                      {formatAmount(selectedReservation.totalAmount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Acompte</p>
                    <p className="font-medium">
                      {formatAmount(selectedReservation.depositAmount)}{" "}
                      {selectedReservation.depositPaid ? (
                        <span className="text-green-600 text-xs">(payé)</span>
                      ) : (
                        <span className="text-red-500 text-xs">(non payé)</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Message */}
              {selectedReservation.message && (
                <div>
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Message du client
                  </h3>
                  <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">
                    {selectedReservation.message}
                  </p>
                </div>
              )}

              {/* Notes */}
              {selectedReservation.notes && (
                <div>
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Notes internes
                  </h3>
                  <p className="text-sm text-gray-700 bg-yellow-50 rounded-lg p-3">
                    {selectedReservation.notes}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="pt-2 flex gap-2 flex-wrap">
                {selectedReservation.status === "pending" && (
                  <button
                    onClick={() =>
                      handleStatusChange(selectedReservation.id, "confirmed")
                    }
                    disabled={updating === selectedReservation.id}
                    className="flex items-center gap-1.5 px-4 py-2 bg-tulipe-green text-white text-sm font-medium rounded-lg hover:bg-tulipe-green-dark transition-colors disabled:opacity-50"
                  >
                    <Check size={15} />
                    Confirmer
                  </button>
                )}
                {selectedReservation.status !== "cancelled" &&
                  selectedReservation.status !== "completed" && (
                    <button
                      onClick={() =>
                        handleStatusChange(selectedReservation.id, "cancelled")
                      }
                      disabled={updating === selectedReservation.id}
                      className="flex items-center gap-1.5 px-4 py-2 bg-red-100 text-red-700 text-sm font-medium rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50"
                    >
                      <Ban size={15} />
                      Annuler
                    </button>
                  )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
