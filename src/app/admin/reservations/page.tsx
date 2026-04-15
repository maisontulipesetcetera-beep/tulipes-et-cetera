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
      const res = await fetch("/api/reservations");
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
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-heading font-bold text-tulipe-bordeaux">
          Réservations
        </h1>
        <button
          onClick={fetchReservations}
          className="text-sm text-gray-500 hover:text-tulipe-green transition-colors"
        >
          Actualiser
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-24">
          <Loader2 className="animate-spin text-tulipe-green" size={32} />
        </div>
      ) : error ? (
        <div className="text-center py-24 text-red-500 text-sm">{error}</div>
      ) : (
        <ReservationTable
          reservations={reservations}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
}
