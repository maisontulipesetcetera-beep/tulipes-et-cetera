"use client";

import { useState } from "react";
import ContentEditor from "@/components/admin/ContentEditor";
import PhotoManager from "@/components/admin/PhotoManager";
import ReviewManager from "@/components/admin/ReviewManager";

const TABS = [
  { id: "textes", label: "Textes" },
  { id: "photos", label: "Photos" },
  { id: "tarifs", label: "Tarifs" },
  { id: "avis", label: "Avis" },
] as const;

type Tab = (typeof TABS)[number]["id"];

function TarifsTab() {
  const [basePrice, setBasePrice] = useState("");
  const [highSeasonPrice, setHighSeasonPrice] = useState("");
  const [weekendPrice, setWeekendPrice] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);

  async function load() {
    if (loaded) return;
    const res = await fetch("/api/settings");
    if (res.ok) {
      const data = await res.json();
      setBasePrice(data.basePrice ? (data.basePrice / 100).toFixed(2) : "");
      setHighSeasonPrice(
        data.highSeasonPrice ? (data.highSeasonPrice / 100).toFixed(2) : "",
      );
      setWeekendPrice(
        data.weekendPrice ? (data.weekendPrice / 100).toFixed(2) : "",
      );
      setLoaded(true);
    }
  }

  // lazy load on first render
  if (!loaded) {
    load();
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSaved(false);

    const res = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        basePrice: basePrice
          ? Math.round(parseFloat(basePrice) * 100)
          : undefined,
        highSeasonPrice: highSeasonPrice
          ? Math.round(parseFloat(highSeasonPrice) * 100)
          : null,
        weekendPrice: weekendPrice
          ? Math.round(parseFloat(weekendPrice) * 100)
          : null,
      }),
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

  const inputClass =
    "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-tulipe-green";

  return (
    <form
      onSubmit={handleSave}
      className="bg-white rounded-xl border border-gray-200 p-5 max-w-md space-y-4"
    >
      <h3 className="text-sm font-semibold text-gray-800 pb-2 border-b border-gray-100">
        Tarifs (en euros)
      </h3>
      <div>
        <label className="block text-xs text-gray-500 mb-1">
          Prix de base (€/nuit)
        </label>
        <input
          type="number"
          min="0"
          step="0.01"
          value={basePrice}
          onChange={(e) => setBasePrice(e.target.value)}
          className={inputClass}
          placeholder="179.00"
        />
      </div>
      <div>
        <label className="block text-xs text-gray-500 mb-1">
          Prix haute saison (€/nuit)
        </label>
        <input
          type="number"
          min="0"
          step="0.01"
          value={highSeasonPrice}
          onChange={(e) => setHighSeasonPrice(e.target.value)}
          className={inputClass}
          placeholder="Optionnel"
        />
      </div>
      <div>
        <label className="block text-xs text-gray-500 mb-1">
          Prix week-end (€/nuit)
        </label>
        <input
          type="number"
          min="0"
          step="0.01"
          value={weekendPrice}
          onChange={(e) => setWeekendPrice(e.target.value)}
          className={inputClass}
          placeholder="Optionnel"
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={saving}
        className="px-5 py-2 bg-tulipe-green text-white text-sm rounded-lg hover:bg-tulipe-green-dark disabled:opacity-50 transition-colors"
      >
        {saving ? "Sauvegarde…" : saved ? "✓ Sauvegardé" : "Sauvegarder"}
      </button>
    </form>
  );
}

export default function ContenuPage() {
  const [activeTab, setActiveTab] = useState<Tab>("textes");

  return (
    <div>
      <h1 className="text-2xl font-heading font-bold text-tulipe-royal mb-6">
        Contenu du site
      </h1>

      {/* Tab bar */}
      <div className="flex gap-1 mb-6 bg-white rounded-xl border border-gray-200 p-1 w-fit">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === tab.id
                ? "bg-tulipe-green text-white"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "textes" && <ContentEditor />}
      {activeTab === "photos" && <PhotoManager />}
      {activeTab === "tarifs" && <TarifsTab />}
      {activeTab === "avis" && <ReviewManager />}
    </div>
  );
}
