"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, X, Lock } from "lucide-react";

interface Reservation {
  id: string;
  guestName: string;
  checkIn: string;
  checkOut: string;
  source: string;
  status: string;
}

interface BlockedDate {
  id: string;
  date: string;
  reason?: string | null;
}

interface DayInfo {
  date: Date;
  isCurrentMonth: boolean;
  reservation: Reservation | null;
  blockedDate: BlockedDate | null;
  isCheckIn: boolean;
  isCheckOut: boolean;
}

const SOURCE_STYLES: Record<
  string,
  { bg: string; border: string; label: string }
> = {
  booking: { bg: "bg-blue-100", border: "border-blue-400", label: "Booking" },
  airbnb: { bg: "bg-pink-100", border: "border-pink-400", label: "Airbnb" },
  direct: { bg: "bg-green-100", border: "border-green-400", label: "Direct" },
};

function formatMonth(year: number, month: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}`;
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isDateInRange(date: Date, checkIn: Date, checkOut: Date): boolean {
  const d = date.getTime();
  return d >= checkIn.getTime() && d < checkOut.getTime();
}

export default function CalendarView() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReservation, setSelectedReservation] =
    useState<Reservation | null>(null);

  // Block modal state
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [blockStart, setBlockStart] = useState("");
  const [blockEnd, setBlockEnd] = useState("");
  const [blockReason, setBlockReason] = useState("");
  const [blockLoading, setBlockLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/reservations/calendar?month=${formatMonth(year, month)}`,
        { credentials: "include" },
      );
      if (res.ok) {
        const data = await res.json();
        setReservations(data.reservations ?? []);
        setBlockedDates(data.blockedDates ?? []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [year, month]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  function prevMonth() {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else setMonth((m) => m - 1);
  }

  function nextMonth() {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else setMonth((m) => m + 1);
  }

  // Build calendar grid (Mon–Sun)
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  // Adjust so week starts on Monday (0=Mon ... 6=Sun)
  let startPad = firstDay.getDay() - 1;
  if (startPad < 0) startPad = 6;

  const days: DayInfo[] = [];

  // Previous month padding
  for (let i = startPad - 1; i >= 0; i--) {
    const d = new Date(year, month, -i);
    days.push({
      date: d,
      isCurrentMonth: false,
      reservation: null,
      blockedDate: null,
      isCheckIn: false,
      isCheckOut: false,
    });
  }

  // Current month days
  for (let d = 1; d <= lastDay.getDate(); d++) {
    const date = new Date(year, month, d);

    const reservation =
      reservations.find((r) => {
        const ci = new Date(r.checkIn);
        const co = new Date(r.checkOut);
        return isDateInRange(date, ci, co);
      }) ?? null;

    const blockedDate =
      blockedDates.find((b) => isSameDay(new Date(b.date), date)) ?? null;

    const isCheckIn = reservations.some((r) =>
      isSameDay(new Date(r.checkIn), date),
    );
    const isCheckOut = reservations.some((r) =>
      isSameDay(new Date(r.checkOut), date),
    );

    days.push({
      date,
      isCurrentMonth: true,
      reservation,
      blockedDate,
      isCheckIn,
      isCheckOut,
    });
  }

  // Next month padding to complete grid
  const remaining = 42 - days.length;
  for (let d = 1; d <= remaining; d++) {
    const date = new Date(year, month + 1, d);
    days.push({
      date,
      isCurrentMonth: false,
      reservation: null,
      blockedDate: null,
      isCheckIn: false,
      isCheckOut: false,
    });
  }

  async function handleBlock() {
    if (!blockStart || !blockEnd) return;
    setBlockLoading(true);
    try {
      const res = await fetch("/api/blocked-dates", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          startDate: blockStart,
          endDate: blockEnd,
          reason: blockReason || undefined,
        }),
      });
      if (res.ok) {
        setShowBlockModal(false);
        setBlockStart("");
        setBlockEnd("");
        setBlockReason("");
        await fetchData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setBlockLoading(false);
    }
  }

  async function handleUnblock(id: string) {
    try {
      await fetch(`/api/blocked-dates?id=${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      await fetchData();
    } catch (err) {
      console.error(err);
    }
  }

  const MONTH_NAMES = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ];
  const DAY_NAMES = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={prevMonth}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <h2 className="text-lg font-semibold text-gray-900 min-w-[180px] text-center">
            {MONTH_NAMES[month]} {year}
          </h2>
          <button
            onClick={nextMonth}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </div>
        <button
          onClick={() => setShowBlockModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors"
        >
          <Lock size={14} />
          Bloquer des dates
        </button>
      </div>

      {/* Calendar grid */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Day headers */}
        <div className="grid grid-cols-7 border-b border-gray-200">
          {DAY_NAMES.map((d) => (
            <div
              key={d}
              className="py-2 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide"
            >
              {d}
            </div>
          ))}
        </div>

        {/* Day cells */}
        {loading ? (
          <div className="py-20 text-center text-gray-400 text-sm">
            Chargement…
          </div>
        ) : (
          <div className="grid grid-cols-7">
            {days.map((day, i) => {
              const isToday = isSameDay(day.date, today);
              const style = day.reservation
                ? (SOURCE_STYLES[day.reservation.source] ??
                  SOURCE_STYLES.direct)
                : null;

              let cellClass =
                "relative min-h-[80px] p-1.5 border-b border-r border-gray-100 transition-colors ";

              if (!day.isCurrentMonth) {
                cellClass += "bg-gray-50 ";
              } else if (day.blockedDate) {
                cellClass += "bg-gray-200 ";
              } else if (style) {
                cellClass += `${style.bg} `;
              } else {
                cellClass += "bg-white hover:bg-gray-50 ";
              }

              if (day.reservation && day.isCurrentMonth) {
                cellClass += `border-l-2 ${style?.border} cursor-pointer `;
              }

              return (
                <div
                  key={i}
                  className={cellClass}
                  onClick={() => {
                    if (day.reservation)
                      setSelectedReservation(day.reservation);
                    if (day.blockedDate) handleUnblock(day.blockedDate.id);
                  }}
                >
                  {/* Date number */}
                  <span
                    className={`text-xs font-medium block mb-1 ${
                      !day.isCurrentMonth
                        ? "text-gray-300"
                        : isToday
                          ? "bg-tulipe-green text-white w-5 h-5 rounded-full flex items-center justify-center"
                          : "text-gray-700"
                    }`}
                  >
                    {day.date.getDate()}
                  </span>

                  {/* Arrival / departure icons */}
                  <div className="flex gap-0.5">
                    {day.isCheckIn && day.isCurrentMonth && (
                      <span
                        className="text-xs text-emerald-600 font-bold"
                        title="Arrivée"
                      >
                        →
                      </span>
                    )}
                    {day.isCheckOut && day.isCurrentMonth && (
                      <span
                        className="text-xs text-orange-500 font-bold"
                        title="Départ"
                      >
                        ←
                      </span>
                    )}
                  </div>

                  {/* Guest name */}
                  {day.reservation && day.isCurrentMonth && day.isCheckIn && (
                    <p className="text-[10px] font-medium text-gray-700 truncate leading-tight mt-0.5">
                      {day.reservation.guestName}
                    </p>
                  )}

                  {/* Blocked label */}
                  {day.blockedDate && day.isCurrentMonth && (
                    <p className="text-[10px] text-gray-500 truncate leading-tight mt-0.5">
                      {day.blockedDate.reason ?? "Bloqué"}
                    </p>
                  )}

                  {/* Striped pattern for blocked */}
                  {day.blockedDate && day.isCurrentMonth && (
                    <div
                      className="absolute inset-0 pointer-events-none opacity-20"
                      style={{
                        backgroundImage:
                          "repeating-linear-gradient(45deg, #000 0, #000 1px, transparent 0, transparent 50%)",
                        backgroundSize: "6px 6px",
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs text-gray-600">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-blue-100 border border-blue-400" />
          <span>Booking.com</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-pink-100 border border-pink-400" />
          <span>Airbnb</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-green-100 border border-green-400" />
          <span>Direct</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-gray-200 border border-gray-400" />
          <span>Bloqué</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-emerald-600 font-bold">→</span>
          <span>Arrivée</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-orange-500 font-bold">←</span>
          <span>Départ</span>
        </div>
      </div>

      {/* Reservation detail modal */}
      {selectedReservation && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedReservation(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Réservation</h3>
              <button
                onClick={() => setSelectedReservation(null)}
                className="p-1 rounded hover:bg-gray-100"
              >
                <X size={16} />
              </button>
            </div>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-500">Client</dt>
                <dd className="font-medium">{selectedReservation.guestName}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Arrivée</dt>
                <dd>
                  {new Date(selectedReservation.checkIn).toLocaleDateString(
                    "fr-FR",
                  )}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Départ</dt>
                <dd>
                  {new Date(selectedReservation.checkOut).toLocaleDateString(
                    "fr-FR",
                  )}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Source</dt>
                <dd>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      selectedReservation.source === "booking"
                        ? "bg-blue-100 text-blue-700"
                        : selectedReservation.source === "airbnb"
                          ? "bg-pink-100 text-pink-700"
                          : "bg-green-100 text-green-700"
                    }`}
                  >
                    {SOURCE_STYLES[selectedReservation.source]?.label ??
                      selectedReservation.source}
                  </span>
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Statut</dt>
                <dd className="capitalize">{selectedReservation.status}</dd>
              </div>
            </dl>
          </div>
        </div>
      )}

      {/* Block dates modal */}
      {showBlockModal && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
          onClick={() => setShowBlockModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Bloquer des dates</h3>
              <button
                onClick={() => setShowBlockModal(false)}
                className="p-1 rounded hover:bg-gray-100"
              >
                <X size={16} />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-600 block mb-1">
                  Date de début
                </label>
                <input
                  type="date"
                  value={blockStart}
                  onChange={(e) => setBlockStart(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-tulipe-green/30"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 block mb-1">
                  Date de fin
                </label>
                <input
                  type="date"
                  value={blockEnd}
                  onChange={(e) => setBlockEnd(e.target.value)}
                  min={blockStart}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-tulipe-green/30"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 block mb-1">
                  Raison (optionnel)
                </label>
                <input
                  type="text"
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                  placeholder="Ex : travaux, usage personnel…"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-tulipe-green/30"
                />
              </div>
              <button
                onClick={handleBlock}
                disabled={!blockStart || !blockEnd || blockLoading}
                className="w-full bg-gray-800 text-white py-2 rounded-lg text-sm font-medium hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {blockLoading ? "En cours…" : "Confirmer le blocage"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
