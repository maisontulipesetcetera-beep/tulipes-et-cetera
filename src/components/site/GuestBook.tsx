"use client";

import { useState, useEffect, useRef } from "react";

interface GuestbookEntry {
  id: string;
  author: string;
  message: string;
  photoUrl?: string | null;
  createdAt: string;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
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
          style={{ fontFamily: "'Caveat', cursive" }}
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
    <div className="flex flex-col h-full gap-4 px-2">
      <h3
        className="text-[#5C1A1A] text-2xl text-center"
        style={{ fontFamily: "'Caveat', cursive", fontWeight: 700 }}
      >
        Laissez votre empreinte 🌷
      </h3>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 flex-1">
        <input
          type="text"
          placeholder="Votre prénom..."
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          maxLength={100}
          required
          className="w-full border-b-2 border-dashed border-[#c5a55a] bg-transparent text-[#5C1A1A] placeholder-[#c5a55a]/50 focus:outline-none focus:border-[#5C1A1A] py-1.5 text-lg"
          style={{ fontFamily: "'Caveat', cursive" }}
        />
        <textarea
          placeholder="Votre message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={1000}
          required
          rows={5}
          className="w-full border-2 border-dashed border-[#e8dcc8] rounded-sm bg-transparent text-[#5C1A1A] placeholder-[#c5a55a]/50 focus:outline-none focus:border-[#c5a55a] p-2 text-lg resize-none flex-1"
          style={{ fontFamily: "'Caveat', cursive" }}
        />
        {error && <p className="text-red-500 text-xs">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="mt-auto w-full py-2.5 bg-tulipe-forest hover:bg-tulipe-forest-dark text-white font-semibold rounded transition-colors disabled:opacity-60 cursor-pointer"
          style={{ fontFamily: "'Caveat', cursive", fontSize: "18px" }}
        >
          {submitting ? "Envoi..." : "Signer le livre d'or 🌷"}
        </button>
      </form>
    </div>
  );
}

// Single entry card for one-per-page layout
function EntryCard({ entry }: { entry: GuestbookEntry }) {
  return (
    <div className="flex flex-col gap-3 h-full py-2">
      {entry.photoUrl && (
        <img
          src={entry.photoUrl}
          alt={`Photo de ${entry.author}`}
          className="w-full h-24 object-cover rounded opacity-80"
        />
      )}
      <p
        className="text-[#3a1a1a] leading-relaxed text-xl flex-1 italic"
        style={{ fontFamily: "'Caveat', cursive" }}
      >
        &ldquo;{entry.message}&rdquo;
      </p>
      <div className="mt-auto pt-2 border-t border-[#e8dcc8]/50">
        <p
          className="text-tulipe-forest font-semibold text-base"
          style={{ fontFamily: "'Caveat', cursive" }}
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

// Ruled lines background for content pages
function RuledLines() {
  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      aria-hidden
    >
      {Array.from({ length: 18 }).map((_, i) => (
        <div
          key={i}
          className="absolute left-0 right-0 border-b border-[#c5a55a]/15"
          style={{ top: `${48 + i * 28}px` }}
        />
      ))}
      {/* Left margin line */}
      <div className="absolute top-0 bottom-0 left-10 border-l border-[#e8a0a0]/20" />
    </div>
  );
}

export default function GuestBook() {
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0); // 0 = cover
  const [isAnimating, setIsAnimating] = useState(false);
  const [animDir, setAnimDir] = useState<"forward" | "backward">("forward");
  const [showFlipPage, setShowFlipPage] = useState(false);

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

  // Pages: 0=cover, 1..entries.length=one entry per page, last=form
  const totalPages = entries.length + 2; // cover + entries + form
  const lastPage = totalPages - 1;

  function goNext() {
    if (isAnimating || currentPage >= lastPage) return;
    setAnimDir("forward");
    setShowFlipPage(true);
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentPage((p) => p + 1);
      setShowFlipPage(false);
      setIsAnimating(false);
    }, 1200);
  }

  function goPrev() {
    if (isAnimating || currentPage <= 0) return;
    setAnimDir("backward");
    setShowFlipPage(true);
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentPage((p) => p - 1);
      setShowFlipPage(false);
      setIsAnimating(false);
    }, 1200);
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
      // Cover
      return (
        <div className="flex flex-col items-end justify-end h-full pb-6 pr-6">
          {currentPage === 0 && (
            <button
              onClick={goNext}
              className="text-[#f5e6c8]/80 text-sm animate-pulse drop-shadow-lg cursor-pointer hover:text-[#f5e6c8] transition-colors"
              style={{ fontFamily: "'Caveat', cursive", fontSize: "16px" }}
            >
              Ouvrir le livre →
            </button>
          )}
        </div>
      );
    }

    if (pageIndex === lastPage) {
      // Form page
      return (
        <div className="h-full overflow-auto">
          <FormPage onSuccess={() => {}} />
        </div>
      );
    }

    // Entry page (1-based: pageIndex - 1 = entry index)
    const entryIndex = pageIndex - 1;
    const entry = entries[entryIndex];

    if (!entry) {
      return (
        <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
          <span className="text-[#e8dcc8] text-5xl">🌷</span>
          <p
            className="text-[#c5a55a] text-lg"
            style={{ fontFamily: "'Caveat', cursive" }}
          >
            Page vide
          </p>
        </div>
      );
    }

    return (
      <div className="h-full flex flex-col">
        <div className="flex-1 overflow-auto">
          <EntryCard entry={entry} />
        </div>
        {entryIndex < entries.length - 1 && (
          <div className="text-center text-2xl py-1 text-[#c5a55a]/40">🌷</div>
        )}
      </div>
    );
  }

  const isCover = currentPage === 0;

  return (
    <div className="flex flex-col items-center gap-6 py-8">
      {/* Google Fonts — Caveat (handwriting) */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&display=swap');

        @keyframes pageTurnFwd {
          0%   { transform: rotateY(0deg) scaleX(1); }
          30%  { transform: rotateY(-45deg) scaleX(0.97); }
          50%  { transform: rotateY(-90deg) scaleX(0.94); }
          70%  { transform: rotateY(-135deg) scaleX(0.97); }
          100% { transform: rotateY(-180deg) scaleX(1); }
        }

        @keyframes pageTurnBwd {
          0%   { transform: rotateY(0deg) scaleX(1); }
          30%  { transform: rotateY(45deg) scaleX(0.97); }
          50%  { transform: rotateY(90deg) scaleX(0.94); }
          70%  { transform: rotateY(135deg) scaleX(0.97); }
          100% { transform: rotateY(180deg) scaleX(1); }
        }

        @keyframes shadowSweepFwd {
          0%   { opacity: 0; }
          30%  { opacity: 1; }
          70%  { opacity: 1; }
          100% { opacity: 0; }
        }

        @keyframes shadowSweepBwd {
          0%   { opacity: 0; }
          30%  { opacity: 1; }
          70%  { opacity: 1; }
          100% { opacity: 0; }
        }

        .page-flip-fwd {
          animation: pageTurnFwd 1.2s cubic-bezier(0.645, 0.045, 0.355, 1) forwards;
        }

        .page-flip-bwd {
          animation: pageTurnBwd 1.2s cubic-bezier(0.645, 0.045, 0.355, 1) forwards;
        }

        .shadow-sweep-fwd {
          animation: shadowSweepFwd 1.2s ease-in-out forwards;
        }

        .shadow-sweep-bwd {
          animation: shadowSweepBwd 1.2s ease-in-out forwards;
        }

        .book-page-curl {
          position: relative;
        }

        .book-page-curl::after {
          content: '';
          position: absolute;
          bottom: 0;
          right: 0;
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, transparent 50%, rgba(0,0,0,0.08) 50%);
          border-radius: 0 0 4px 0;
          pointer-events: none;
        }
      `}</style>

      {/* Book outer container */}
      <div
        className="relative select-none"
        style={{ perspective: "2000px" }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Realistic book drop shadow */}
        <div
          className="absolute pointer-events-none"
          style={{
            inset: "4px 0 -12px 8px",
            borderRadius: "4px",
            background: "rgba(30,10,10,0.35)",
            filter: "blur(18px)",
            transform: "translateY(8px) skewX(-1deg)",
            zIndex: 0,
          }}
        />

        {/* Book wrapper */}
        <div
          className="relative"
          style={{
            width: "min(650px, 95vw)",
            height: "clamp(320px, 48vw, 490px)",
            transformStyle: "preserve-3d",
            zIndex: 1,
          }}
        >
          {/* ── Static page (current content) ── */}
          <div
            className={`absolute inset-0 overflow-hidden book-page-curl ${isCover ? "" : ""}`}
            style={{
              borderRadius: "4px",
              background: isCover
                ? "url('/images/guestbook-cover.png') center/cover no-repeat, #5C1A1A"
                : "#FFF8E7",
              boxShadow: isCover
                ? "4px 6px 32px rgba(0,0,0,0.45), inset -3px 0 12px rgba(0,0,0,0.2), -2px 0 6px rgba(0,0,0,0.15)"
                : [
                    "4px 6px 32px rgba(0,0,0,0.25)",
                    "inset -3px 0 10px rgba(0,0,0,0.07)",
                    "-1px 0 4px rgba(0,0,0,0.08)",
                    "inset 0 0 60px rgba(196,165,90,0.04)",
                  ].join(", "),
            }}
          >
            {!isCover && <RuledLines />}
            <div className="relative z-10 h-full p-6 md:p-8 overflow-hidden">
              {renderPageContent(currentPage)}
            </div>

            {/* Page number */}
            {currentPage > 0 && (
              <div className="absolute bottom-3 left-0 right-0 flex justify-center pointer-events-none">
                <span
                  className="text-[#c5a55a]/50 text-sm"
                  style={{ fontFamily: "'Caveat', cursive" }}
                >
                  {currentPage} / {lastPage}
                </span>
              </div>
            )}

            {/* Right-edge click zone to go forward */}
            {currentPage < lastPage && (
              <button
                onClick={goNext}
                disabled={isAnimating}
                aria-label="Page suivante"
                className="absolute top-0 right-0 bottom-0 w-10 cursor-pointer z-20 opacity-0 hover:opacity-100 transition-opacity"
                style={{
                  background:
                    "linear-gradient(to right, transparent, rgba(196,165,90,0.15))",
                }}
              />
            )}

            {/* Left-edge click zone to go back */}
            {currentPage > 0 && (
              <button
                onClick={goPrev}
                disabled={isAnimating}
                aria-label="Page précédente"
                className="absolute top-0 left-0 bottom-0 w-10 cursor-pointer z-20 opacity-0 hover:opacity-100 transition-opacity"
                style={{
                  background:
                    "linear-gradient(to left, transparent, rgba(196,165,90,0.15))",
                }}
              />
            )}
          </div>

          {/* ── Flipping page layer ── */}
          {showFlipPage && (
            <div
              className="absolute inset-0 overflow-hidden"
              style={{
                borderRadius: "4px",
                background:
                  animDir === "forward"
                    ? currentPage === 0
                      ? "url('/images/guestbook-cover.png') center/cover no-repeat, #5C1A1A"
                      : "#FFF8E7"
                    : "#FFF8E7",
                transformOrigin:
                  animDir === "forward" ? "left center" : "right center",
                transformStyle: "preserve-3d",
                backfaceVisibility: "hidden",
                boxShadow: "4px 6px 32px rgba(0,0,0,0.3)",
                zIndex: 20,
              }}
              // Apply animation class via inline className trick
            >
              {/* Inner animated wrapper */}
              <div
                className={
                  animDir === "forward" ? "page-flip-fwd" : "page-flip-bwd"
                }
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "4px",
                  background:
                    animDir === "forward"
                      ? currentPage === 0
                        ? "url('/images/guestbook-cover.png') center/cover no-repeat, #5C1A1A"
                        : "#FFF8E7"
                      : "#FFF8E7",
                  transformOrigin:
                    animDir === "forward" ? "left center" : "right center",
                  transformStyle: "preserve-3d",
                  backfaceVisibility: "hidden",
                  boxShadow: "4px 6px 32px rgba(0,0,0,0.25)",
                }}
              >
                {/* Dynamic shadow overlay that sweeps across */}
                <div
                  className={
                    animDir === "forward"
                      ? "shadow-sweep-fwd"
                      : "shadow-sweep-bwd"
                  }
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      animDir === "forward"
                        ? "linear-gradient(to left, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.06) 40%, transparent 70%)"
                        : "linear-gradient(to right, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.06) 40%, transparent 70%)",
                    pointerEvents: "none",
                    zIndex: 2,
                    borderRadius: "4px",
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-5">
        <button
          onClick={goPrev}
          disabled={currentPage === 0 || isAnimating}
          className="flex items-center gap-2 px-4 py-2 rounded border border-[#c5a55a] text-tulipe-forest hover:bg-tulipe-forest hover:text-white transition-all disabled:opacity-25 disabled:cursor-not-allowed text-sm font-semibold cursor-pointer"
          aria-label="Page précédente"
        >
          ← Précédent
        </button>

        {/* Page indicator dots */}
        <div className="flex items-center gap-1.5">
          {Array.from({ length: totalPages }).map((_, i) => (
            <div
              key={i}
              className={`rounded-full transition-all ${
                i === currentPage
                  ? "w-2.5 h-2.5 bg-tulipe-forest"
                  : "w-1.5 h-1.5 bg-[#c5a55a]/35"
              }`}
            />
          ))}
        </div>

        <button
          onClick={goNext}
          disabled={currentPage === lastPage || isAnimating}
          className="flex items-center gap-2 px-4 py-2 rounded border border-[#c5a55a] text-tulipe-forest hover:bg-tulipe-forest hover:text-white transition-all disabled:opacity-25 disabled:cursor-not-allowed text-sm font-semibold cursor-pointer"
          aria-label="Page suivante"
        >
          Suivant →
        </button>
      </div>

      {/* Page label */}
      {currentPage > 0 && (
        <p
          className="text-[#b0997a] text-sm -mt-2"
          style={{ fontFamily: "'Caveat', cursive" }}
        >
          Page {currentPage} sur {lastPage}
        </p>
      )}

      {loading && (
        <p
          className="text-[#c5a55a] text-sm animate-pulse"
          style={{ fontFamily: "'Caveat', cursive" }}
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
