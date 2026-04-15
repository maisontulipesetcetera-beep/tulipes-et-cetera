"use client";

import { useState, useEffect } from "react";
import { Save, Loader2, RefreshCw, Eye, EyeOff } from "lucide-react";

interface Settings {
  id: string;
  propertyName: string;
  address: string;
  phone: string;
  email: string;
  checkInTime: string;
  checkOutTime: string;
  basePrice: number;
  highSeasonPrice: number | null;
  weekendPrice: number | null;
  cancellationPolicy: string | null;
  bookingIcalUrl: string | null;
  airbnbIcalUrl: string | null;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-sm font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">
      {children}
    </h3>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputClass =
  "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-tulipe-forest";

export default function SettingsForm() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  // iCal test
  const [testingIcal, setTestingIcal] = useState(false);
  const [icalResult, setIcalResult] = useState("");

  // Password change
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState("");
  const [changingPw, setChangingPw] = useState(false);
  const [showPw, setShowPw] = useState(false);

  useEffect(() => {
    fetch("/api/settings", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        setSettings(data);
        setLoading(false);
      });
  }, []);

  function update<K extends keyof Settings>(key: K, value: Settings[K]) {
    setSettings((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    setError("");
    setSaved(false);

    const payload = {
      ...settings,
      basePrice: Math.round((settings.basePrice ?? 0) * 100),
      highSeasonPrice: settings.highSeasonPrice
        ? Math.round(settings.highSeasonPrice * 100)
        : null,
      weekendPrice: settings.weekendPrice
        ? Math.round(settings.weekendPrice * 100)
        : null,
    };

    const res = await fetch("/api/settings", {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setSaving(false);
    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } else {
      const data = await res.json();
      setError(data.error ?? "Erreur lors de la sauvegarde");
    }
  }

  async function testIcal() {
    setTestingIcal(true);
    setIcalResult("");
    const res = await fetch("/api/ical/import", { credentials: "include" });
    setTestingIcal(false);
    setIcalResult(
      res.ok
        ? "✓ Synchronisation réussie"
        : "✗ Erreur lors de la synchronisation",
    );
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwError("");
    setPwSuccess("");
    setChangingPw(true);

    const res = await fetch("/api/auth/change-password", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
    });

    setChangingPw(false);
    if (res.ok) {
      setPwSuccess("Mot de passe modifié avec succès.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      const data = await res.json();
      setPwError(data.error ?? "Erreur");
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="animate-spin text-tulipe-forest" size={28} />
      </div>
    );
  }

  if (!settings) return null;

  // Display prices in euros (DB stores cents)
  const basePriceEur = (settings.basePrice / 100).toFixed(2);
  const highSeasonEur = settings.highSeasonPrice
    ? (settings.highSeasonPrice / 100).toFixed(2)
    : "";
  const weekendEur = settings.weekendPrice
    ? (settings.weekendPrice / 100).toFixed(2)
    : "";

  return (
    <div className="space-y-6 max-w-2xl">
      <form onSubmit={handleSave} className="space-y-6">
        {/* Informations propriété */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <SectionTitle>Informations de la propriété</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Nom de la propriété">
              <input
                type="text"
                value={settings.propertyName}
                onChange={(e) => update("propertyName", e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Téléphone">
              <input
                type="tel"
                value={settings.phone}
                onChange={(e) => update("phone", e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Email">
              <input
                type="email"
                value={settings.email}
                onChange={(e) => update("email", e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Adresse">
              <input
                type="text"
                value={settings.address}
                onChange={(e) => update("address", e.target.value)}
                className={inputClass}
              />
            </Field>
          </div>
        </div>

        {/* Réservation */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <SectionTitle>Réservation &amp; Tarifs</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Check-in">
              <input
                type="time"
                value={settings.checkInTime}
                onChange={(e) => update("checkInTime", e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Check-out">
              <input
                type="time"
                value={settings.checkOutTime}
                onChange={(e) => update("checkOutTime", e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Prix de base (€/nuit)">
              <input
                type="number"
                min="0"
                step="0.01"
                value={basePriceEur}
                onChange={(e) =>
                  update(
                    "basePrice",
                    Math.round(parseFloat(e.target.value || "0") * 100),
                  )
                }
                className={inputClass}
              />
            </Field>
            <Field label="Prix haute saison (€/nuit)">
              <input
                type="number"
                min="0"
                step="0.01"
                value={highSeasonEur}
                onChange={(e) =>
                  update(
                    "highSeasonPrice",
                    e.target.value
                      ? Math.round(parseFloat(e.target.value) * 100)
                      : null,
                  )
                }
                className={inputClass}
                placeholder="Optionnel"
              />
            </Field>
            <Field label="Prix week-end (€/nuit)">
              <input
                type="number"
                min="0"
                step="0.01"
                value={weekendEur}
                onChange={(e) =>
                  update(
                    "weekendPrice",
                    e.target.value
                      ? Math.round(parseFloat(e.target.value) * 100)
                      : null,
                  )
                }
                className={inputClass}
                placeholder="Optionnel"
              />
            </Field>
          </div>
          <div className="mt-4">
            <Field label="Politique d'annulation">
              <textarea
                value={settings.cancellationPolicy ?? ""}
                onChange={(e) =>
                  update("cancellationPolicy", e.target.value || null)
                }
                rows={3}
                className={inputClass + " resize-y"}
                placeholder="Décrivez votre politique d'annulation…"
              />
            </Field>
          </div>
        </div>

        {/* iCal */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <SectionTitle>Synchronisation iCal</SectionTitle>
          <div className="space-y-4">
            <Field label="URL iCal Booking.com">
              <input
                type="url"
                value={settings.bookingIcalUrl ?? ""}
                onChange={(e) =>
                  update("bookingIcalUrl", e.target.value || null)
                }
                className={inputClass}
                placeholder="https://…"
              />
            </Field>
            <Field label="URL iCal Airbnb">
              <input
                type="url"
                value={settings.airbnbIcalUrl ?? ""}
                onChange={(e) =>
                  update("airbnbIcalUrl", e.target.value || null)
                }
                className={inputClass}
                placeholder="https://…"
              />
            </Field>
            <button
              type="button"
              onClick={testIcal}
              disabled={testingIcal}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-sm rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              {testingIcal ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <RefreshCw size={14} />
              )}
              Tester la synchronisation
            </button>
            {icalResult && (
              <p
                className={`text-sm ${icalResult.startsWith("✓") ? "text-green-600" : "text-red-600"}`}
              >
                {icalResult}
              </p>
            )}
          </div>
        </div>

        {/* Save */}
        {error && (
          <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 bg-tulipe-forest text-white font-medium text-sm rounded-lg hover:bg-tulipe-forest-dark disabled:opacity-50 transition-colors"
        >
          {saving ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <Save size={15} />
          )}
          {saving ? "Sauvegarde…" : saved ? "✓ Sauvegardé" : "Sauvegarder"}
        </button>
      </form>

      {/* Password change */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <SectionTitle>Sécurité — Changer le mot de passe</SectionTitle>
        <form onSubmit={handleChangePassword} className="space-y-4 max-w-sm">
          <Field label="Mot de passe actuel">
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className={inputClass + " pr-10"}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </Field>
          <Field label="Nouveau mot de passe (min. 8 caractères)">
            <input
              type={showPw ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={8}
              className={inputClass}
              autoComplete="new-password"
            />
          </Field>
          <Field label="Confirmer le nouveau mot de passe">
            <input
              type={showPw ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
              className={inputClass}
              autoComplete="new-password"
            />
          </Field>
          {pwError && <p className="text-sm text-red-600">{pwError}</p>}
          {pwSuccess && <p className="text-sm text-green-600">{pwSuccess}</p>}
          <button
            type="submit"
            disabled={changingPw}
            className="flex items-center gap-2 px-4 py-2 bg-tulipe-forest hover:bg-tulipe-forest-dark text-white text-sm rounded-lg disabled:opacity-50 transition-colors"
          >
            {changingPw && <Loader2 size={14} className="animate-spin" />}
            Modifier le mot de passe
          </button>
        </form>
      </div>
    </div>
  );
}
