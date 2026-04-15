"use client";

import { useState, useEffect } from "react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isAfter,
  isBefore,
  addMonths,
  subMonths,
  format,
  isWithinInterval,
} from "date-fns";
import { fr } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface BookedRange {
  checkIn: Date;
  checkOut: Date;
}

interface BookingCalendarProps {
  onDatesSelected: (checkIn: Date, checkOut: Date) => void;
}

export default function BookingCalendar({
  onDatesSelected,
}: BookingCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [bookedRanges, setBookedRanges] = useState<BookedRange[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/reservations/availability")
      .then((r) => r.json())
      .then((data: { checkIn: string; checkOut: string }[]) => {
        setBookedRanges(
          data.map((r) => ({
            checkIn: new Date(r.checkIn),
            checkOut: new Date(r.checkOut),
          })),
        );
      })
      .catch(() => {
        // availability fetch failed — calendar still usable, just no blocked dates shown
      })
      .finally(() => setLoading(false));
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: calStart, end: calEnd });

  const isBooked = (date: Date): boolean => {
    return bookedRanges.some((r) =>
      isWithinInterval(date, {
        start: r.checkIn,
        end: new Date(r.checkOut.getTime() - 1),
      }),
    );
  };

  const isPast = (date: Date) => isBefore(date, today);

  const isInSelection = (date: Date): boolean => {
    if (!checkIn || !checkOut) return false;
    return isWithinInterval(date, { start: checkIn, end: checkOut });
  };

  const handleDayClick = (date: Date) => {
    if (isPast(date) || isBooked(date)) return;

    if (!checkIn || (checkIn && checkOut)) {
      setCheckIn(date);
      setCheckOut(null);
    } else {
      if (isBefore(date, checkIn) || isSameDay(date, checkIn)) {
        setCheckIn(date);
        setCheckOut(null);
        return;
      }
      // Check no booked dates in range
      const range = eachDayOfInterval({ start: checkIn, end: date });
      const hasConflict = range.some((d) => isBooked(d));
      if (hasConflict) {
        setCheckIn(date);
        setCheckOut(null);
        return;
      }
      setCheckOut(date);
      onDatesSelected(checkIn, date);
    }
  };

  const dayLabels = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

  return (
    <div className="w-full max-w-md mx-auto select-none">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          disabled={isBefore(endOfMonth(subMonths(currentMonth, 1)), today)}
          className="p-2 rounded-lg hover:bg-tulipe-green/10 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          aria-label="Mois précédent"
        >
          <ChevronLeft className="size-5 text-tulipe-green" />
        </button>
        <span className="font-heading text-lg text-tulipe-green capitalize">
          {format(currentMonth, "MMMM yyyy", { locale: fr })}
        </span>
        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="p-2 rounded-lg hover:bg-tulipe-green/10 transition-colors"
          aria-label="Mois suivant"
        >
          <ChevronRight className="size-5 text-tulipe-green" />
        </button>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 mb-2">
        {dayLabels.map((d) => (
          <div
            key={d}
            className="text-center text-xs font-body font-semibold text-gray-400 py-1"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Days grid */}
      {loading ? (
        <div className="h-48 flex items-center justify-center text-gray-400 text-sm">
          Chargement…
        </div>
      ) : (
        <div className="grid grid-cols-7 gap-0.5">
          {days.map((day) => {
            const past = isPast(day);
            const booked = isBooked(day);
            const isStart = checkIn && isSameDay(day, checkIn);
            const isEnd = checkOut && isSameDay(day, checkOut);
            const inSelection = isInSelection(day);
            const outOfMonth = !isSameMonth(day, currentMonth);

            return (
              <button
                key={day.toISOString()}
                onClick={() => handleDayClick(day)}
                disabled={past || booked || outOfMonth}
                className={cn(
                  "relative h-9 w-full rounded-lg text-sm font-body transition-colors",
                  outOfMonth && "opacity-0 pointer-events-none",
                  past && "text-gray-300 cursor-not-allowed",
                  booked &&
                    !past &&
                    "bg-red-100 text-red-400 cursor-not-allowed line-through",
                  !past &&
                    !booked &&
                    !inSelection &&
                    "hover:bg-tulipe-green/20 text-gray-700",
                  inSelection &&
                    !isStart &&
                    !isEnd &&
                    "bg-tulipe-green/20 text-tulipe-green rounded-none",
                  (isStart || isEnd) &&
                    "bg-tulipe-green text-white font-semibold",
                  isStart && "rounded-l-lg",
                  isEnd && "rounded-r-lg",
                )}
                aria-label={format(day, "d MMMM yyyy", { locale: fr })}
              >
                {format(day, "d")}
              </button>
            );
          })}
        </div>
      )}

      {/* Legend */}
      <div className="mt-4 flex gap-4 text-xs text-gray-500 font-body">
        <span className="flex items-center gap-1.5">
          <span className="inline-block size-3 rounded-sm bg-tulipe-green" />{" "}
          Sélectionné
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block size-3 rounded-sm bg-red-100" /> Réservé
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block size-3 rounded-sm bg-gray-100" />{" "}
          Disponible
        </span>
      </div>
    </div>
  );
}
