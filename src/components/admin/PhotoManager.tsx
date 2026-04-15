"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import {
  Upload,
  Trash2,
  ChevronUp,
  ChevronDown,
  Loader2,
  ImageIcon,
} from "lucide-react";

interface Photo {
  id: string;
  url: string;
  alt: string | null;
  page: string;
  sortOrder: number;
}

const PAGES = [
  { value: "accueil", label: "Accueil" },
  { value: "maison", label: "La Maison" },
  { value: "chambre1", label: "Chambre 1" },
  { value: "chambre2", label: "Chambre 2" },
  { value: "chambres", label: "Chambres (général)" },
  { value: "services", label: "Services" },
  { value: "decouvrir", label: "Découvrir" },
  { value: "exterieur", label: "Extérieur" },
];

export default function PhotoManager() {
  const [selectedPage, setSelectedPage] = useState("accueil");
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchPhotos = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/photos?page=${selectedPage}`, {
      credentials: "include",
    });
    if (res.ok) {
      const data = await res.json();
      setPhotos(data);
    }
    setLoading(false);
  }, [selectedPage]);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError("");

    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("page", selectedPage);
      formData.append(
        "alt",
        file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "),
      );

      const res = await fetch("/api/photos", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Erreur lors de l'upload");
      } else {
        const photo = await res.json();
        setPhotos((prev) => [...prev, photo]);
      }
    }

    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleDelete(photo: Photo) {
    if (!confirm(`Supprimer cette photo ?`)) return;
    setDeletingId(photo.id);

    const res = await fetch("/api/photos", {
      method: "DELETE",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: photo.id, url: photo.url }),
    });

    if (res.ok) {
      setPhotos((prev) => prev.filter((p) => p.id !== photo.id));
    } else {
      setError("Erreur lors de la suppression");
    }
    setDeletingId(null);
  }

  async function handleReorder(photo: Photo, direction: "up" | "down") {
    const idx = photos.indexOf(photo);
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= photos.length) return;

    const swap = photos[swapIdx];
    const newPhotos = [...photos];
    newPhotos[idx] = { ...photo, sortOrder: swap.sortOrder };
    newPhotos[swapIdx] = { ...swap, sortOrder: photo.sortOrder };
    newPhotos.sort((a, b) => a.sortOrder - b.sortOrder);
    setPhotos(newPhotos);

    await Promise.all([
      fetch("/api/photos", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: photo.id, sortOrder: swap.sortOrder }),
      }),
      fetch("/api/photos", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: swap.id, sortOrder: photo.sortOrder }),
      }),
    ]);
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap items-end gap-3">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Page</label>
          <select
            value={selectedPage}
            onChange={(e) => setSelectedPage(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-tulipe-forest"
          >
            {PAGES.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleUpload}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 px-4 py-2 bg-tulipe-forest text-white text-sm rounded-lg hover:bg-tulipe-forest-dark disabled:opacity-50 transition-colors"
          >
            {uploading ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Upload size={14} />
            )}
            {uploading ? "Upload en cours…" : "Ajouter des photos"}
          </button>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
          {error}
        </p>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin text-tulipe-forest" size={28} />
        </div>
      ) : photos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400 bg-white rounded-xl border border-dashed border-gray-200">
          <ImageIcon size={40} className="mb-3 opacity-40" />
          <p className="text-sm">Aucune photo pour cette page</p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="mt-3 text-sm text-tulipe-forest hover:underline"
          >
            Ajouter des photos
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {photos.map((photo, idx) => (
            <div
              key={photo.id}
              className="relative group bg-white rounded-xl border border-gray-200 overflow-hidden"
            >
              <div className="aspect-square relative">
                <Image
                  src={photo.url}
                  alt={photo.alt ?? ""}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              </div>

              {/* Overlay actions */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  onClick={() => handleReorder(photo, "up")}
                  disabled={idx === 0}
                  className="p-1.5 bg-white/90 rounded-lg text-gray-700 hover:bg-white disabled:opacity-30"
                  title="Monter"
                >
                  <ChevronUp size={14} />
                </button>
                <button
                  onClick={() => handleReorder(photo, "down")}
                  disabled={idx === photos.length - 1}
                  className="p-1.5 bg-white/90 rounded-lg text-gray-700 hover:bg-white disabled:opacity-30"
                  title="Descendre"
                >
                  <ChevronDown size={14} />
                </button>
                <button
                  onClick={() => handleDelete(photo)}
                  disabled={deletingId === photo.id}
                  className="p-1.5 bg-red-500/90 rounded-lg text-white hover:bg-red-600 disabled:opacity-50"
                  title="Supprimer"
                >
                  {deletingId === photo.id ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Trash2 size={14} />
                  )}
                </button>
              </div>

              {/* Sort order badge */}
              <div className="absolute top-1.5 left-1.5 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded">
                #{idx + 1}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
