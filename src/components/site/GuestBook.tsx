"use client";

import { useState, useEffect, useRef } from "react";

interface GuestbookEntry {
  id: string;
  author: string;
  message: string;
  photoUrl?: string | null;
  createdAt: string;
}

// Pair up entries into double-pages [left, right]
function pairEntries(
  entries: GuestbookEntry[],
): Array<[GuestbookEntry | null, GuestbookEntry | null]> {
  const pairs: Array<[GuestbookEntry | null, GuestbookEntry | null]> = [];
  for (let i = 0; i < entries.length; i += 2) {
    pairs.push([entries[i] ?? null, entries[i + 1] ?? null]);
  }
  return pairs;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

interface EntryCardProps {
  entry: GuestbookEntry;
  side: "left" | "right";
}

function EntryCard({ entry, side }: EntryCardProps) {
  return (
    <div
      className={`flex flex-col gap-3 h-full ${side === "left" ? "pr-4 border-r border-[#e8dcc8]" : "pl-4"}`}
    >
      {entry.photoUrl && (
        <img
          src={entry.photoUrl}
          alt={`Photo de ${entry.author}`}
          className="w-full h-24 object-cover rounded-lg opacity-80"
        />
      )}
      <p
        className="text-[#5C1A1A] leading-relaxed text-[15px] flex-1 italic"
        style={{ fontFamily: "'Dancing Script', cursive" }}
      >
        &ldquo;{entry.message}&rdquo;
      </p>
      <div className="mt-auto">
        <p
          className="text-[#8B5E3C] font-semibold text-sm"
          style={{ fontFamily: "'Dancing Script', cursive" }}
        >
          — {entry.author}
        </p>
        <p className="text-[#b0997a] text-xs mt-0.5">
          {formatDate(entry.createdAt)}
        </p>
      </div>
    </div>
  );
}

interface FormPageProps {
  onSuccess: () => void;
}

function FormPage({ onSuccess }: FormPageProps) {
  const [author, setAuthor] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!author.trim() || !message.trim()) return;
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          author: author.trim(),
          message: message.trim(),
        }),
      });

      if (!res.ok) throw new Error("Erreur réseau");

      setDone(true);
      onSuccess();
    } catch {
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-4">
        <div className="text-5xl">✉️</div>
        <p
          className="text-[#5C1A1A] text-xl leading-relaxed"
          style={{ fontFamily: "'Dancing Script', cursive" }}
        >
          Merci pour votre message !
        </p>
        <p className="text-[#8B5E3C] text-sm">
          Il sera ajouté au livre d&apos;or après validation.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full gap-3 px-1">
      <h3
        className="text-[#5C1A1A] text-xl text-center"
        style={{ fontFamily: "'Dancing Script', cursive" }}
      >
        Laissez un mot...
      </h3>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 flex-1">
        <input
          type="text"
          placeholder="Votre prénom"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          maxLength={100}
          required
          className="w-full border-b border-[#c5a55a] bg-transparent text-[#5C1A1A] placeholder-[#c5a55a]/60 focus:outline-none focus:border-[#5C1A1A] py-1 text-sm"
          style={{ fontFamily: "'Dancing Script', cursive" }}
        />
        <textarea
          placeholder="Votre message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={1000}
          required
          rows={5}
          className="w-full border border-[#e8dcc8] rounded-lg bg-white/60 text-[#5C1A1A] placeholder-[#c5a55a]/60 focus:outline-none focus:border-[#c5a55a] p-2 text-sm resize-none flex-1"
          style={{ fontFamily: "'Dancing Script', cursive" }}
        />
        {error && <p className="text-red-500 text-xs">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="mt-auto w-full py-2 bg-[#5C1A1A] hover:bg-[#7a2323] text-[#f5e6c8] text-sm font-semibold rounded-lg transition-colors disabled:opacity-60"
          style={{ fontFamily: "'Dancing Script', cursive", fontSize: "16px" }}
        >
          {submitting ? "Envoi..." : "Signer le livre d'or 🌷"}
        </button>
      </form>
    </div>
  );
}

export default function GuestBook() {
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0); // 0 = cover
  const [flipping, setFlipping] = useState(false);
  const [flipDir, setFlipDir] = useState<"forward" | "backward">("forward");
  const [submitted, setSubmitted] = useState(false);

  // Touch/swipe support
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    fetch("/api/guestbook")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setEntries(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const pairs = pairEntries(entries);
  // Pages: 0=cover, 1..pairs.length=content pages, last=form
  const totalPages = pairs.length + 2; // cover + content pages + form page
  const lastPage = totalPages - 1;

  function goNext() {
    if (flipping || currentPage >= lastPage) return;
    setFlipDir("forward");
    setFlipping(true);
    setTimeout(() => {
      setCurrentPage((p) => p + 1);
      setFlipping(false);
    }, 800);
  }

  function goPrev() {
    if (flipping || currentPage <= 0) return;
    setFlipDir("backward");
    setFlipping(true);
    setTimeout(() => {
      setCurrentPage((p) => p - 1);
      setFlipping(false);
    }, 800);
  }

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 50) {
      if (dx < 0) goNext();
      else goPrev();
    }
    touchStartX.current = null;
  }

  function renderPageContent(pageIndex: number) {
    if (pageIndex === 0) {
      // Cover — image de fond contient déjà le texte, on affiche uniquement l'invite de navigation
      return (
        <div className="flex flex-col items-end justify-end h-full pb-4 pr-4">
          <p className="text-[#c5a55a] text-sm animate-pulse drop-shadow-lg">
            Tournez la page →
          </p>
        </div>
      );
    }

    // Form page (last page)
    if (pageIndex === lastPage) {
      return (
        <div className="flex h-full">
          {/* Left side: decorative */}
          <div className="w-1/2 flex flex-col items-center justify-center gap-3 pr-4 border-r border-[#e8dcc8] text-center">
            <div className="text-4xl">🌷</div>
            <p
              className="text-[#8B5E3C] text-base leading-relaxed"
              style={{ fontFamily: "'Dancing Script', cursive" }}
            >
              Vous avez séjourné chez nous ?
            </p>
            <p className="text-[#b0997a] text-xs">
              Partagez votre expérience et rejoignez nos hôtes dans ce livre
              d&apos;or.
            </p>
          </div>
          {/* Right side: form */}
          <div className="w-1/2 pl-4 flex flex-col">
            <FormPage onSuccess={() => setSubmitted(true)} />
          </div>
        </div>
      );
    }

    // Content page (pair index = pageIndex - 1)
    const pairIndex = pageIndex - 1;
    const pair = pairs[pairIndex];
    if (!pair) {
      return (
        <div className="flex items-center justify-center h-full">
          <p
            className="text-[#c5a55a] text-lg"
            style={{ fontFamily: "'Dancing Script', cursive" }}
          >
            Page vide
          </p>
        </div>
      );
    }

    const [left, right] = pair;
    return (
      <div className="flex h-full gap-0">
        <div className="w-1/2 flex flex-col justify-start pt-4 px-4">
          {left ? (
            <EntryCard entry={left} side="left" />
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <span className="text-[#e8dcc8] text-4xl">✦</span>
            </div>
          )}
        </div>
        <div className="w-1/2 flex flex-col justify-start pt-4 px-4">
          {right ? (
            <EntryCard entry={right} side="right" />
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <span className="text-[#e8dcc8] text-4xl">✦</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  const isCover = currentPage === 0;

  return (
    <div className="flex flex-col items-center gap-8 py-8">
      {/* Google Font import */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;600;700&display=swap');`}</style>

      {/* Book container */}
      <div
        className="relative select-none"
        style={{ perspective: "1500px" }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Book shadow */}
        <div
          className="absolute inset-x-4 bottom-0 h-8 rounded-full blur-xl opacity-40 bg-[#3a1010]"
          style={{ transform: "translateY(60%)" }}
        />

        {/* Book wrapper */}
        <div
          className="relative w-[min(700px,95vw)]"
          style={{ height: "clamp(320px, 50vw, 500px)" }}
        >
          {/* Spine */}
          <div
            className="absolute left-1/2 top-0 bottom-0 z-10"
            style={{
              width: "12px",
              transform: "translateX(-50%)",
              background:
                "linear-gradient(to right, #3a1010, #5C1A1A 40%, #3a1010)",
              boxShadow: "0 0 8px rgba(0,0,0,0.5)",
            }}
          />

          {/* Page flip animation layer */}
          <div
            className="absolute inset-0"
            style={{
              transformStyle: "preserve-3d",
              transformOrigin: "50% 50%",
            }}
          >
            {/* Previous page (visible behind during flip) */}
            <div
              className="absolute inset-0 rounded-[2px_16px_16px_2px] overflow-hidden"
              style={{
                background: isCover
                  ? "url('/images/guestbook-cover.png') center/cover no-repeat, #5C1A1A"
                  : "#FFF8E7",
                boxShadow:
                  "inset -4px 0 8px rgba(0,0,0,0.08), 2px 4px 20px rgba(0,0,0,0.15)",
              }}
            >
              {/* Decorative page lines for content pages */}
              {!isCover && (
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div
                      key={i}
                      className="border-b border-[#c5a55a]"
                      style={{ marginTop: `${(i + 1) * 36}px` }}
                    />
                  ))}
                </div>
              )}

              <div className="relative z-10 h-full p-6 md:p-8">
                {renderPageContent(currentPage)}
              </div>

              {/* Page number */}
              {currentPage > 0 && (
                <div className="absolute bottom-3 left-0 right-0 flex justify-center">
                  <span
                    className="text-[#c5a55a]/60 text-xs"
                    style={{ fontFamily: "'Dancing Script', cursive" }}
                  >
                    {currentPage} / {lastPage}
                  </span>
                </div>
              )}
            </div>

            {/* Flipping page overlay */}
            {flipping && (
              <div
                className="absolute inset-0 rounded-[2px_16px_16px_2px] overflow-hidden"
                style={{
                  background: flipDir === "forward" ? "#FFF8E7" : "#5C1A1A",
                  transformOrigin:
                    flipDir === "forward" ? "left center" : "right center",
                  animation: `pageTurn${flipDir === "forward" ? "Fwd" : "Bwd"} 0.8s ease-in-out forwards`,
                  transformStyle: "preserve-3d",
                  backfaceVisibility: "hidden",
                  boxShadow:
                    "inset -4px 0 8px rgba(0,0,0,0.08), 2px 4px 20px rgba(0,0,0,0.2)",
                }}
              />
            )}
          </div>
        </div>

        {/* CSS animations */}
        <style>{`
          @keyframes pageTurnFwd {
            0%   { transform: rotateY(0deg); box-shadow: 2px 4px 20px rgba(0,0,0,0.15); }
            50%  { transform: rotateY(-90deg); box-shadow: 8px 4px 30px rgba(0,0,0,0.25); }
            100% { transform: rotateY(-180deg); box-shadow: 2px 4px 20px rgba(0,0,0,0.05); }
          }
          @keyframes pageTurnBwd {
            0%   { transform: rotateY(0deg); box-shadow: 2px 4px 20px rgba(0,0,0,0.15); }
            50%  { transform: rotateY(90deg); box-shadow: 8px 4px 30px rgba(0,0,0,0.25); }
            100% { transform: rotateY(180deg); box-shadow: 2px 4px 20px rgba(0,0,0,0.05); }
          }
        `}</style>
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-6">
        <button
          onClick={goPrev}
          disabled={currentPage === 0 || flipping}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[#c5a55a] text-[#5C1A1A] hover:bg-[#5C1A1A] hover:text-[#f5e6c8] transition-all disabled:opacity-30 disabled:cursor-not-allowed text-sm font-semibold"
          aria-label="Page précédente"
        >
          ← Page précédente
        </button>

        {/* Page dots */}
        <div className="flex items-center gap-1.5">
          {Array.from({ length: totalPages }).map((_, i) => (
            <div
              key={i}
              className={`rounded-full transition-all ${
                i === currentPage
                  ? "w-3 h-3 bg-[#5C1A1A]"
                  : "w-1.5 h-1.5 bg-[#c5a55a]/40"
              }`}
            />
          ))}
        </div>

        <button
          onClick={goNext}
          disabled={currentPage === lastPage || flipping}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[#c5a55a] text-[#5C1A1A] hover:bg-[#5C1A1A] hover:text-[#f5e6c8] transition-all disabled:opacity-30 disabled:cursor-not-allowed text-sm font-semibold"
          aria-label="Page suivante"
        >
          Page suivante →
        </button>
      </div>

      {loading && (
        <p
          className="text-[#c5a55a] text-sm animate-pulse"
          style={{ fontFamily: "'Dancing Script', cursive" }}
        >
          Chargement du livre d&apos;or...
        </p>
      )}

      {!loading && entries.length === 0 && currentPage === 0 && (
        <p className="text-[#b0997a] text-sm text-center max-w-xs">
          Soyez le premier à signer notre livre d&apos;or — tournez la page !
        </p>
      )}
    </div>
  );
}
