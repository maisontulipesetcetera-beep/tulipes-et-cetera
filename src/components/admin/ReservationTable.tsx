"use client";

import { useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  X,
  Loader2,
  FileText,
  CheckCircle,
  XCircle,
  Mail,
  Phone,
} from "lucide-react";

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

const statusConfig: Record<string, { label: string; badgeClass: string }> = {
  pending: {
    label: "En attente",
    badgeClass: "bg-orange-100 text-orange-800 border-orange-300",
  },
  confirmed: {
    label: "Confirmée",
    badgeClass: "bg-green-100 text-green-800 border-green-300",
  },
  in_progress: {
    label: "En cours",
    badgeClass: "bg-blue-100 text-blue-800 border-blue-300",
  },
  completed: {
    label: "Terminée",
    badgeClass: "bg-gray-100 text-gray-700 border-gray-300",
  },
  cancelled: {
    label: "Annulée",
    badgeClass: "bg-red-100 text-red-800 border-red-300",
  },
};

const sourceConfig: Record<
  string,
  { label: string; dotColor: string; badgeClass: string }
> = {
  booking: {
    label: "Booking",
    dotColor: "bg-blue-500",
    badgeClass: "bg-blue-50 text-blue-700 border-blue-200",
  },
  airbnb: {
    label: "Airbnb",
    dotColor: "bg-pink-500",
    badgeClass: "bg-pink-50 text-pink-700 border-pink-200",
  },
  direct: {
    label: "Direct",
    dotColor: "bg-green-500",
    badgeClass: "bg-green-50 text-green-700 border-green-200",
  },
};

function formatDate(dateStr: string) {
  return format(new Date(dateStr), "dd MMMM yyyy", { locale: fr });
}

function formatAmount(cents: number | null) {
  if (cents === null) return "—";
  return (cents / 100).toLocaleString("fr-FR", {
    style: "currency",
    currency: "EUR",
  });
}

const FILTER_BUTTONS = [
  { value: "all", label: "Toutes" },
  { value: "pending", label: "En attente" },
  { value: "confirmed", label: "Confirmées" },
  { value: "cancelled", label: "Annulées" },
];

export default function ReservationTable({
  reservations,
  onStatusChange,
}: ReservationTableProps) {
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedReservation, setSelectedReservation] =
    useState<Reservation | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);
  const [paymentEmailSent, setPaymentEmailSent] = useState<string | null>(null);

  const filtered = reservations.filter((r) => {
    if (filterStatus !== "all" && r.status !== filterStatus) return false;
    return true;
  });

  async function handleStatusChange(id: string, status: string) {
    setUpdating(id);
    setPaymentEmailSent(null);
    try {
      const res = await fetch(`/api/reservations/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        onStatusChange?.(id, status);
        if (selectedReservation?.id === id) {
          setSelectedReservation((prev) => (prev ? { ...prev, status } : null));
        }
        if (status === "confirmed") {
          setPaymentEmailSent(id);
          setTimeout(() => setPaymentEmailSent(null), 5000);
        }
      }
    } finally {
      setUpdating(null);
    }
  }

  return (
    <div className="space-y-6">
      {/* Filtres */}
      <div className="flex flex-wrap gap-3">
        {FILTER_BUTTONS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setFilterStatus(value)}
            className={`px-6 py-3 rounded-xl text-lg font-semibold border-2 transition-all ${
              filterStatus === value
                ? "bg-tulipe-forest text-white border-tulipe-forest shadow-sm"
                : "bg-white text-gray-700 border-gray-200 hover:border-tulipe-forest hover:text-tulipe-forest"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Cartes */}
      {filtered.length === 0 ? (
        <div className="bg-white/90 rounded-2xl p-16 text-center">
          <p className="text-2xl text-gray-400">Aucune réservation trouvée</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((r) => {
            const status = statusConfig[r.status] ?? {
              label: r.status,
              badgeClass: "bg-gray-100 text-gray-700 border-gray-300",
            };
            const source = sourceConfig[r.source] ?? {
              label: r.source,
              dotColor: "bg-gray-400",
              badgeClass: "bg-gray-50 text-gray-700 border-gray-200",
            };
            const isUpdating = updating === r.id;

            return (
              <div
                key={r.id}
                className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-100"
              >
                {/* En-tête carte */}
                <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
                  <div>
                    <p className="text-2xl font-bold text-tulipe-forest">
                      {r.guestName}
                    </p>
                    <p className="text-lg text-gray-500 mt-1">{r.guestEmail}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold border ${source.badgeClass}`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ${source.dotColor}`}
                      />
                      {source.label}
                    </span>
                    <span
                      className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-semibold border ${status.badgeClass}`}
                    >
                      {status.label}
                    </span>
                  </div>
                </div>

                {/* Infos séjour */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 bg-tulipe-beige rounded-xl p-4">
                  <div>
                    <p className="text-base text-gray-500 font-medium">
                      Arrivée
                    </p>
                    <p className="text-lg font-bold text-gray-800">
                      {formatDate(r.checkIn)}
                    </p>
                  </div>
                  <div>
                    <p className="text-base text-gray-500 font-medium">
                      Départ
                    </p>
                    <p className="text-lg font-bold text-gray-800">
                      {formatDate(r.checkOut)}
                    </p>
                  </div>
                  <div>
                    <p className="text-base text-gray-500 font-medium">
                      Personnes
                    </p>
                    <p className="text-lg font-bold text-gray-800">
                      {r.guests} pers.
                    </p>
                  </div>
                  <div>
                    <p className="text-base text-gray-500 font-medium">
                      Montant
                    </p>
                    <p className="text-lg font-bold text-gray-800">
                      {formatAmount(r.totalAmount)}
                    </p>
                  </div>
                </div>

                {/* Boutons d'action */}
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setSelectedReservation(r)}
                    className="flex items-center gap-2 px-5 py-3 bg-gray-100 text-gray-800 text-base font-semibold rounded-xl hover:bg-gray-200 transition-colors min-h-[52px]"
                  >
                    <FileText size={18} strokeWidth={2} />
                    Voir les détails
                  </button>
                  {r.status === "pending" && (
                    <button
                      onClick={() => handleStatusChange(r.id, "confirmed")}
                      disabled={isUpdating}
                      className="flex items-center gap-2 px-5 py-3 bg-green-600 text-white text-base font-semibold rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 min-h-[52px]"
                    >
                      {isUpdating ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <CheckCircle size={18} strokeWidth={2} />
                      )}
                      Confirmer
                    </button>
                  )}
                  {r.status !== "cancelled" && r.status !== "completed" && (
                    <button
                      onClick={() => handleStatusChange(r.id, "cancelled")}
                      disabled={isUpdating}
                      className="flex items-center gap-2 px-5 py-3 bg-red-100 text-red-700 text-base font-semibold rounded-xl hover:bg-red-200 transition-colors disabled:opacity-50 min-h-[52px]"
                    >
                      {isUpdating ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <XCircle size={18} strokeWidth={2} />
                      )}
                      Annuler
                    </button>
                  )}
                  {r.guestEmail && (
                    <a
                      href={`mailto:${r.guestEmail}`}
                      className="flex items-center gap-2 px-5 py-3 bg-tulipe-forest/10 text-tulipe-forest text-base font-semibold rounded-xl hover:bg-tulipe-forest/20 transition-colors min-h-[52px]"
                    >
                      <Mail size={18} strokeWidth={2} />
                      Contacter
                    </a>
                  )}
                </div>
                {paymentEmailSent === r.id && (
                  <p className="mt-3 text-sm font-semibold text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-2">
                    Email de paiement envoyé au client.
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal détail */}
      {selectedReservation && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedReservation(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* En-tête modal */}
            <div className="flex items-center justify-between px-7 py-5 border-b border-gray-100">
              <h2 className="font-heading text-2xl font-bold text-tulipe-forest">
                Fiche réservation
              </h2>
              <button
                onClick={() => setSelectedReservation(null)}
                className="p-2 text-gray-400 hover:text-gray-700 rounded-xl hover:bg-gray-100 transition-colors"
                aria-label="Fermer"
              >
                <X size={24} />
              </button>
            </div>

            <div className="px-7 py-6 space-y-6">
              {/* Badges statut + source */}
              <div className="flex flex-wrap gap-3">
                {(() => {
                  const s = statusConfig[selectedReservation.status] ?? {
                    label: selectedReservation.status,
                    badgeClass: "bg-gray-100 text-gray-700 border-gray-300",
                  };
                  const src = sourceConfig[selectedReservation.source] ?? {
                    label: selectedReservation.source,
                    dotColor: "bg-gray-400",
                    badgeClass: "bg-gray-50 text-gray-700 border-gray-200",
                  };
                  return (
                    <>
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold border ${src.badgeClass}`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full shrink-0 ${src.dotColor}`}
                        />
                        {src.label}
                      </span>
                      <span
                        className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-semibold border ${s.badgeClass}`}
                      >
                        {s.label}
                      </span>
                    </>
                  );
                })()}
              </div>

              {/* Client */}
              <div className="bg-tulipe-beige rounded-xl p-5 space-y-2">
                <p className="text-base font-semibold text-gray-500 uppercase tracking-wider">
                  Client
                </p>
                <p className="text-xl font-bold text-tulipe-forest">
                  {selectedReservation.guestName}
                </p>
                <p className="text-lg text-gray-600">
                  {selectedReservation.guestEmail}
                </p>
                {selectedReservation.guestPhone && (
                  <p className="text-lg text-gray-600 flex items-center gap-2">
                    <Phone
                      size={16}
                      strokeWidth={2}
                      className="text-gray-400 shrink-0"
                    />
                    {selectedReservation.guestPhone}
                  </p>
                )}
              </div>

              {/* Séjour */}
              <div className="bg-tulipe-cream rounded-xl p-5">
                <p className="text-base font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Séjour
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-base text-gray-500">Arrivée</p>
                    <p className="text-lg font-bold text-gray-800">
                      {formatDate(selectedReservation.checkIn)}
                    </p>
                  </div>
                  <div>
                    <p className="text-base text-gray-500">Départ</p>
                    <p className="text-lg font-bold text-gray-800">
                      {formatDate(selectedReservation.checkOut)}
                    </p>
                  </div>
                  <div>
                    <p className="text-base text-gray-500">Personnes</p>
                    <p className="text-lg font-bold text-gray-800">
                      {selectedReservation.guests}
                    </p>
                  </div>
                  <div>
                    <p className="text-base text-gray-500">Montant total</p>
                    <p className="text-lg font-bold text-gray-800">
                      {formatAmount(selectedReservation.totalAmount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-base text-gray-500">Paiement</p>
                    <p className="text-lg font-bold text-gray-800">
                      {selectedReservation.depositPaid ? (
                        <span className="text-green-600 text-base font-semibold">
                          Payé
                        </span>
                      ) : (
                        <span className="text-red-500 text-base font-semibold">
                          En attente de paiement
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Message */}
              {selectedReservation.message && (
                <div>
                  <p className="text-base font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Message du client
                  </p>
                  <p className="text-lg text-gray-700 bg-gray-50 rounded-xl p-4">
                    {selectedReservation.message}
                  </p>
                </div>
              )}

              {/* Notes */}
              {selectedReservation.notes && (
                <div>
                  <p className="text-base font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Notes internes
                  </p>
                  <p className="text-lg text-gray-700 bg-yellow-50 rounded-xl p-4">
                    {selectedReservation.notes}
                  </p>
                </div>
              )}

              {/* Actions dans la modal */}
              <div className="pt-2 flex flex-wrap gap-3">
                {selectedReservation.status === "pending" && (
                  <button
                    onClick={() =>
                      handleStatusChange(selectedReservation.id, "confirmed")
                    }
                    disabled={updating === selectedReservation.id}
                    className="flex items-center gap-2 px-5 py-3 bg-green-600 text-white text-base font-semibold rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 min-h-[52px]"
                  >
                    {updating === selectedReservation.id ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <CheckCircle size={18} strokeWidth={2} />
                    )}
                    Confirmer la réservation
                  </button>
                )}
                {selectedReservation.status !== "cancelled" &&
                  selectedReservation.status !== "completed" && (
                    <button
                      onClick={() =>
                        handleStatusChange(selectedReservation.id, "cancelled")
                      }
                      disabled={updating === selectedReservation.id}
                      className="flex items-center gap-2 px-5 py-3 bg-red-100 text-red-700 text-base font-semibold rounded-xl hover:bg-red-200 transition-colors disabled:opacity-50 min-h-[52px]"
                    >
                      {updating === selectedReservation.id ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <XCircle size={18} strokeWidth={2} />
                      )}
                      Annuler la réservation
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
