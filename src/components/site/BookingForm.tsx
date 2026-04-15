"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
import { format, differenceInCalendarDays } from "date-fns";
import { fr } from "date-fns/locale";
import BookingCalendar from "./BookingCalendar";
import { cn } from "@/lib/utils";

const BookingSchema = z.object({
  guestName: z.string().min(2, "Nom trop court"),
  guestEmail: z.string().email("Email invalide"),
  guestPhone: z.string().optional(),
  guests: z.number().int().min(1).max(6),
  message: z.string().optional(),
});

type BookingFields = z.infer<typeof BookingSchema>;

export default function BookingForm() {
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [basePrice, setBasePrice] = useState<number | null>(null);
  const [fields, setFields] = useState<BookingFields>({
    guestName: "",
    guestEmail: "",
    guestPhone: "",
    guests: 2,
    message: "",
  });
  const [honeypot, setHoneypot] = useState("");
  const [errors, setErrors] = useState<
    Partial<Record<keyof BookingFields, string>>
  >({});
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    fetch("/api/prices")
      .then((r) => r.json())
      .then((data) => {
        if (typeof data.basePrice === "number") {
          setBasePrice(data.basePrice);
        }
      })
      .catch(() => {
        // fallback silently — recap won't show price
      });
  }, []);

  const handleDatesSelected = (ci: Date, co: Date) => {
    setCheckIn(ci);
    setCheckOut(co);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFields((prev) => ({
      ...prev,
      [name]: name === "guests" ? parseInt(value, 10) || 1 : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = (): boolean => {
    const result = BookingSchema.safeParse(fields);
    if (!result.success) {
      const flat = result.error.flatten().fieldErrors;
      const newErrors: typeof errors = {};
      for (const key of Object.keys(flat) as (keyof BookingFields)[]) {
        newErrors[key] = flat[key]?.[0];
      }
      setErrors(newErrors);
      return false;
    }
    if (!checkIn || !checkOut) {
      setServerError("Veuillez sélectionner vos dates d'arrivée et de départ.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...fields,
          checkIn: checkIn!.toISOString(),
          checkOut: checkOut!.toISOString(),
          website: honeypot,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setServerError(data.error ?? "Une erreur est survenue.");
        setStatus("error");
        return;
      }

      setStatus("success");
    } catch {
      setServerError("Impossible de contacter le serveur. Réessayez.");
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="rounded-2xl bg-tulipe-forest/10 border border-tulipe-forest/30 p-8 text-center">
        <p className="font-heading text-xl text-tulipe-forest mb-2">
          Demande envoyée !
        </p>
        <p className="font-body text-gray-600">
          Votre demande a été envoyée ! Vous recevrez un email avec un lien de
          paiement une fois votre réservation confirmée par l&apos;hôte.
        </p>
      </div>
    );
  }

  const inputCls = (error?: string) =>
    cn(
      "w-full rounded-lg border px-4 py-2.5 font-body text-sm text-gray-800 bg-white outline-none transition-colors focus:border-tulipe-forest focus:ring-2 focus:ring-tulipe-forest/20",
      error ? "border-red-400" : "border-gray-200",
    );

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {/* Calendar */}
      <div>
        <p className="font-body text-sm font-semibold text-gray-700 mb-3">
          Sélectionnez vos dates
        </p>
        <BookingCalendar onDatesSelected={handleDatesSelected} />
        {checkIn && checkOut && (
          <p className="mt-3 text-sm text-tulipe-forest font-body">
            {format(checkIn, "d MMM yyyy", { locale: fr })} →{" "}
            {format(checkOut, "d MMM yyyy", { locale: fr })}
          </p>
        )}

        {/* Price recap */}
        {checkIn &&
          checkOut &&
          basePrice !== null &&
          (() => {
            const nights = differenceInCalendarDays(checkOut, checkIn);
            if (nights <= 0) return null;
            const pricePerNight = Math.round(basePrice / 100);
            const total = nights * pricePerNight;
            return (
              <div className="mt-4 rounded-xl bg-tulipe-forest/10 border border-tulipe-forest/25 px-5 py-4 flex items-center justify-between gap-4">
                <div className="font-body text-sm text-gray-700">
                  <span className="font-semibold text-tulipe-blue">
                    {nights} nuit{nights > 1 ? "s" : ""}
                  </span>{" "}
                  × {pricePerNight}€
                </div>
                <div className="font-heading text-xl text-tulipe-forest font-bold">
                  {total}€ TTC
                </div>
              </div>
            );
          })()}
      </div>

      {/* Honeypot — hidden from real users */}
      <div aria-hidden="true" className="hidden">
        <input
          tabIndex={-1}
          autoComplete="off"
          name="website"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      {/* Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="block font-body text-sm font-semibold text-gray-700 mb-1">
            Nom complet <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            name="guestName"
            autoComplete="name"
            value={fields.guestName}
            onChange={handleChange}
            className={inputCls(errors.guestName)}
            placeholder="Marie Dupont"
          />
          {errors.guestName && (
            <p className="mt-1 text-xs text-red-500">{errors.guestName}</p>
          )}
        </div>

        <div>
          <label className="block font-body text-sm font-semibold text-gray-700 mb-1">
            Email <span className="text-red-400">*</span>
          </label>
          <input
            type="email"
            name="guestEmail"
            autoComplete="email"
            value={fields.guestEmail}
            onChange={handleChange}
            className={inputCls(errors.guestEmail)}
            placeholder="marie@example.com"
          />
          {errors.guestEmail && (
            <p className="mt-1 text-xs text-red-500">{errors.guestEmail}</p>
          )}
        </div>

        <div>
          <label className="block font-body text-sm font-semibold text-gray-700 mb-1">
            Téléphone
          </label>
          <input
            type="tel"
            name="guestPhone"
            autoComplete="tel"
            value={fields.guestPhone}
            onChange={handleChange}
            className={inputCls()}
            placeholder="+33 6 12 34 56 78"
          />
        </div>

        <div>
          <label className="block font-body text-sm font-semibold text-gray-700 mb-1">
            Voyageurs <span className="text-red-400">*</span>
          </label>
          <select
            name="guests"
            value={fields.guests}
            onChange={handleChange}
            className={inputCls(errors.guests)}
          >
            {Array.from({ length: 6 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n} {n === 1 ? "personne" : "personnes"}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-gray-500 font-body">
            6 voyageurs maximum
          </p>
        </div>

        <div className="sm:col-span-2">
          <label className="block font-body text-sm font-semibold text-gray-700 mb-1">
            Message
          </label>
          <textarea
            name="message"
            value={fields.message}
            onChange={handleChange}
            rows={4}
            className={inputCls()}
            placeholder="Informations complémentaires, demandes spéciales…"
          />
        </div>
      </div>

      {serverError && (
        <p className="text-sm text-red-500 font-body">{serverError}</p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full py-3 px-6 bg-tulipe-forest hover:bg-tulipe-forest-dark disabled:opacity-60 disabled:cursor-not-allowed text-white font-body font-semibold rounded-xl transition-colors"
      >
        {status === "loading" ? "Envoi en cours…" : "Envoyer la demande"}
      </button>
    </form>
  );
}
