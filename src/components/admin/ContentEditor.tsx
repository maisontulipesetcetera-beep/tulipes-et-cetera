"use client";

import { useState, useEffect, useCallback } from "react";
import { Save, Loader2 } from "lucide-react";

interface PageContent {
  id: string;
  page: string;
  section: string;
  lang: string;
  content: string;
}

const PAGES = [
  { value: "accueil", label: "Accueil" },
  { value: "maison", label: "La Maison" },
  { value: "chambres", label: "Chambres" },
  { value: "tarifs", label: "Tarifs" },
  { value: "services", label: "Services" },
  { value: "decouvrir", label: "Découvrir" },
  { value: "contact", label: "Contact" },
  { value: "livret", label: "Livret d'accueil" },
];

const LANGS = [
  { value: "fr", label: "🇫🇷 Français" },
  { value: "de", label: "🇩🇪 Deutsch" },
  { value: "en", label: "🇬🇧 English" },
];

export default function ContentEditor() {
  const [selectedPage, setSelectedPage] = useState("accueil");
  const [selectedLang, setSelectedLang] = useState("fr");
  const [contents, setContents] = useState<PageContent[]>([]);
  const [edits, setEdits] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  const fetchContents = useCallback(async () => {
    setLoading(true);
    const res = await fetch(
      `/api/pages?page=${selectedPage}&lang=${selectedLang}`,
    );
    if (res.ok) {
      const data: PageContent[] = await res.json();
      setContents(data);
      const initial: Record<string, string> = {};
      for (const c of data) {
        initial[c.section] = c.content;
      }
      setEdits(initial);
    }
    setLoading(false);
  }, [selectedPage, selectedLang]);

  useEffect(() => {
    fetchContents();
  }, [fetchContents]);

  async function saveSection(section: string) {
    setSaving(section);
    const res = await fetch("/api/pages", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        page: selectedPage,
        section,
        lang: selectedLang,
        content: edits[section] ?? "",
      }),
    });
    setSaving(null);
    if (res.ok) {
      setSaved(section);
      setTimeout(() => setSaved(null), 2000);
    }
  }

  // Build sections: those from DB + allow adding new ones
  const sections = Array.from(
    new Set([
      ...contents.map((c) => c.section),
      "hero",
      "description",
      "meta_title",
      "meta_description",
    ]),
  );

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap gap-3">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Page</label>
          <select
            value={selectedPage}
            onChange={(e) => setSelectedPage(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-tulipe-green"
          >
            {PAGES.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Langue</label>
          <select
            value={selectedLang}
            onChange={(e) => setSelectedLang(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-tulipe-green"
          >
            {LANGS.map((l) => (
              <option key={l.value} value={l.value}>
                {l.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin text-tulipe-green" size={28} />
        </div>
      ) : (
        <div className="space-y-4">
          {sections.map((section) => (
            <div
              key={section}
              className="bg-white rounded-xl border border-gray-200 p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700 capitalize">
                  {section.replace(/_/g, " ")}
                </label>
                <button
                  onClick={() => saveSection(section)}
                  disabled={saving === section}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-tulipe-green text-white text-xs rounded-lg hover:bg-tulipe-green-dark disabled:opacity-50 transition-colors"
                >
                  {saving === section ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : saved === section ? (
                    "✓ Sauvegardé"
                  ) : (
                    <>
                      <Save size={12} />
                      Sauvegarder
                    </>
                  )}
                </button>
              </div>
              <textarea
                value={edits[section] ?? ""}
                onChange={(e) =>
                  setEdits((prev) => ({ ...prev, [section]: e.target.value }))
                }
                rows={
                  section.includes("description") || section === "hero" ? 4 : 2
                }
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-tulipe-green resize-y"
                placeholder={`Contenu pour "${section}" en ${selectedLang}…`}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
