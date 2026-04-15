"use client";

import { useEffect, useState, useCallback } from "react";
import ReservationTable from "@/components/admin/ReservationTable";
import { Loader2 } from "lucide-react";

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

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchReservations = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/reservations", { credentials: "include" });
      if (!res.ok) throw new Error("Erreur de chargement");
      const data = await res.json();
      setReservations(data);
    } catch {
      setError("Impossible de charger les réservations");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  function handleStatusChange(id: string, status: string) {
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r)),
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* En-tête */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-8 py-6 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-heading font-bold text-tulipe-royal">
          📋 Réservations
        </h1>
        <button
          onClick={fetchReservations}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 bg-tulipe-green text-white text-lg font-semibold rounded-xl hover:bg-tulipe-green-dark transition-colors disabled:opacity-50 min-h-[52px]"
        >
          {loading ? <Loader2 size={20} className="animate-spin" /> : "🔄"}{" "}
          Actualiser
        </button>
      </div>

      {/* Contenu */}
      {loading ? (
        <div className="bg-white/90 rounded-2xl flex flex-col items-center justify-center py-24 gap-4">
          <Loader2 className="animate-spin text-tulipe-green" size={48} />
          <p className="text-xl text-gray-500">Chargement en cours…</p>
        </div>
      ) : error ? (
        <div className="bg-white/90 rounded-2xl py-16 text-center">
          <p className="text-xl text-red-500">{error}</p>
          <button
            onClick={fetchReservations}
            className="mt-6 px-6 py-3 bg-tulipe-green text-white text-lg font-semibold rounded-xl hover:bg-tulipe-green-dark transition-colors"
          >
            Réessayer
          </button>
        </div>
      ) : (
        <ReservationTable
          reservations={reservations}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
}
