"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Star,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  ChevronUp,
  ChevronDown,
  Loader2,
} from "lucide-react";

interface Review {
  id: string;
  author: string;
  content: string;
  rating: number;
  source: string;
  visible: boolean;
  sortOrder: number;
  createdAt: string;
}

const SOURCE_LABELS: Record<string, string> = {
  direct: "Direct",
  booking: "Booking.com",
  airbnb: "Airbnb",
  google: "Google",
};

const inputClass =
  "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-tulipe-green";

export default function ReviewManager() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  // New review form
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5);
  const [source, setSource] = useState<
    "direct" | "booking" | "airbnb" | "google"
  >("direct");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const fetchReviews = useCallback(async () => {
    const res = await fetch("/api/reviews", { credentials: "include" });
    if (res.ok) {
      const data = await res.json();
      setReviews(data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  async function handleToggleVisible(review: Review) {
    setTogglingId(review.id);
    const res = await fetch("/api/reviews", {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: review.id, visible: !review.visible }),
    });
    if (res.ok) {
      const updated = await res.json();
      setReviews((prev) =>
        prev.map((r) => (r.id === updated.id ? updated : r)),
      );
    }
    setTogglingId(null);
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer cet avis ?")) return;
    setDeletingId(id);
    const res = await fetch("/api/reviews", {
      method: "DELETE",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      setReviews((prev) => prev.filter((r) => r.id !== id));
    }
    setDeletingId(null);
  }

  async function handleReorder(review: Review, direction: "up" | "down") {
    const idx = reviews.indexOf(review);
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= reviews.length) return;

    const swap = reviews[swapIdx];
    await Promise.all([
      fetch("/api/reviews", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: review.id, sortOrder: swap.sortOrder }),
      }),
      fetch("/api/reviews", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: swap.id, sortOrder: review.sortOrder }),
      }),
    ]);

    const newReviews = [...reviews];
    newReviews[idx] = { ...review, sortOrder: swap.sortOrder };
    newReviews[swapIdx] = { ...swap, sortOrder: review.sortOrder };
    newReviews.sort((a, b) => a.sortOrder - b.sortOrder);
    setReviews(newReviews);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setFormError("");

    const res = await fetch("/api/reviews", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ author, content, rating, source }),
    });

    setSubmitting(false);
    if (res.ok) {
      const review = await res.json();
      setReviews((prev) => [...prev, review]);
      setAuthor("");
      setContent("");
      setRating(5);
      setSource("direct");
      setShowForm(false);
    } else {
      const data = await res.json();
      setFormError(data.error ?? "Erreur lors de l'ajout");
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="animate-spin text-tulipe-green" size={28} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-2 px-4 py-2 bg-tulipe-green text-white text-sm rounded-lg hover:bg-tulipe-green-dark transition-colors"
        >
          <Plus size={15} />
          Ajouter un avis
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl border border-gray-200 p-5 space-y-3"
        >
          <h3 className="text-sm font-semibold text-gray-800">Nouvel avis</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Auteur</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                required
                className={inputClass}
                placeholder="Prénom N."
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Source</label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value as typeof source)}
                className={inputClass}
              >
                {Object.entries(SOURCE_LABELS).map(([v, l]) => (
                  <option key={v} value={v}>
                    {l}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Note</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRating(n)}
                  className={`p-1 ${n <= rating ? "text-tulipe-gold" : "text-gray-300"}`}
                >
                  <Star
                    size={20}
                    fill={n <= rating ? "currentColor" : "none"}
                  />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Contenu</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={3}
              className={inputClass + " resize-y"}
            />
          </div>
          {formError && <p className="text-sm text-red-600">{formError}</p>}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-tulipe-green text-white text-sm rounded-lg hover:bg-tulipe-green-dark disabled:opacity-50 transition-colors"
            >
              {submitting ? "Ajout…" : "Ajouter"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 border border-gray-200 text-gray-600 text-sm rounded-lg hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
          </div>
        </form>
      )}

      {reviews.length === 0 ? (
        <div className="text-center py-12 text-gray-400 text-sm">
          Aucun avis
        </div>
      ) : (
        <div className="space-y-2">
          {reviews.map((review, idx) => (
            <div
              key={review.id}
              className={`bg-white rounded-xl border p-4 flex items-start gap-3 transition-opacity ${
                review.visible
                  ? "border-gray-200"
                  : "border-gray-100 opacity-60"
              }`}
            >
              <div className="flex flex-col gap-1 shrink-0">
                <button
                  onClick={() => handleReorder(review, "up")}
                  disabled={idx === 0}
                  className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-20"
                >
                  <ChevronUp size={14} />
                </button>
                <button
                  onClick={() => handleReorder(review, "down")}
                  disabled={idx === reviews.length - 1}
                  className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-20"
                >
                  <ChevronDown size={14} />
                </button>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-sm text-gray-800">
                    {review.author}
                  </span>
                  <span className="text-xs text-gray-400">
                    {SOURCE_LABELS[review.source] ?? review.source}
                  </span>
                  <span className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        className={
                          i < review.rating
                            ? "text-tulipe-gold"
                            : "text-gray-200"
                        }
                        fill={i < review.rating ? "currentColor" : "none"}
                      />
                    ))}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {review.content}
                </p>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => handleToggleVisible(review)}
                  disabled={togglingId === review.id}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                  title={review.visible ? "Masquer" : "Afficher"}
                >
                  {togglingId === review.id ? (
                    <Loader2 size={15} className="animate-spin" />
                  ) : review.visible ? (
                    <Eye size={15} />
                  ) : (
                    <EyeOff size={15} />
                  )}
                </button>
                <button
                  onClick={() => handleDelete(review.id)}
                  disabled={deletingId === review.id}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50"
                  title="Supprimer"
                >
                  {deletingId === review.id ? (
                    <Loader2 size={15} className="animate-spin" />
                  ) : (
                    <Trash2 size={15} />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
