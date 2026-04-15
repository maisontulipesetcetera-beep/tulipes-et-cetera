"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ─── Slide config ────────────────────────────────────────────────────────────
const SLIDES = [
  {
    id: "intro",
    side: "center" as const,
    startPct: 2,
    endPct: 14,
  },
  {
    id: "slide1",
    side: "left" as const,
    startPct: 14,
    endPct: 28,
    text: "Un écrin de douceur au fond d'une ruelle sans issue, où le temps s'arrête",
  },
  {
    id: "slide2",
    side: "right" as const,
    startPct: 28,
    endPct: 45,
    text: "Trois chambres de charme, literie haut de gamme et balnéo",
  },
  {
    id: "slide3",
    side: "left" as const,
    startPct: 45,
    endPct: 62,
    text: "Petit-déjeuner fait maison, kougelhopf et produits bio locaux",
  },
  {
    id: "slide4",
    side: "right" as const,
    startPct: 62,
    endPct: 78,
    text: "Vous viendrez en hôte et repartirez en ami",
  },
  {
    id: "cta",
    side: "center" as const,
    startPct: 78,
    endPct: 100,
  },
] as const;

// ─── Frame config ────────────────────────────────────────────────────────────
const FRAME_CONFIG = {
  desktop: { path: "/frames/hero-desktop/frame-", total: 144 },
  mobile: { path: "/frames/hero-mobile/frame-", total: 144 },
} as const;

function frameSrc(cfg: { path: string; total: number }, index: number): string {
  const n = String(index + 1).padStart(4, "0");
  return `${cfg.path}${n}.jpg`;
}

interface ScrollVideoHeroProps {
  lang: string;
}

export default function ScrollVideoHero({ lang }: ScrollVideoHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);
  const slideEls = useRef<(HTMLDivElement | null)[]>([]);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  const [loaded, setLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);

  // ─── Draw a frame on the canvas ──────────────────────────────────────────
  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    const img = framesRef.current[index];
    if (!canvas || !img || !img.complete) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;

    const isMobile = window.innerWidth < 768;

    let scale: number;
    if (isMobile) {
      // contain on mobile
      scale = Math.min(cw / iw, ch / ih);
    } else {
      // cover on desktop (no black bars)
      scale = Math.max(cw / iw, ch / ih);
    }

    const dw = iw * scale;
    const dh = ih * scale;
    const dx = (cw - dw) / 2;
    const dy = (ch - dh) / 2;

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, dx, dy, dw, dh);
  }, []);

  // ─── Resize canvas to fill viewport ──────────────────────────────────────
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drawFrame(currentFrameRef.current);
  }, [drawFrame]);

  // ─── Load all frames ──────────────────────────────────────────────────────
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const cfg = isMobile ? FRAME_CONFIG.mobile : FRAME_CONFIG.desktop;
    const total = cfg.total;
    const imgs: HTMLImageElement[] = [];
    let loaded = 0;

    framesRef.current = imgs;

    for (let i = 0; i < total; i++) {
      const img = new window.Image();
      img.src = frameSrc(cfg, i);
      img.onload = () => {
        loaded++;
        setLoadProgress(Math.round((loaded / total) * 100));
        if (loaded === total) {
          setLoaded(true);
        }
        // Draw first frame as soon as it loads
        if (i === 0) {
          resizeCanvas();
          drawFrame(0);
        }
      };
      imgs.push(img);
    }
  }, [drawFrame, resizeCanvas]);

  // ─── Setup canvas resize listener ─────────────────────────────────────────
  useEffect(() => {
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [resizeCanvas]);

  // ─── Setup GSAP ScrollTrigger once frames are loaded ──────────────────────
  useEffect(() => {
    if (!loaded) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const total = FRAME_CONFIG.desktop.total; // same for both

    // Draw first frame immediately
    drawFrame(0);

    // ── Frame scrub ──
    const frameTrigger = ScrollTrigger.create({
      trigger: container,
      start: "top top",
      end: "bottom bottom",
      scrub: 0,
      onUpdate: (self) => {
        const idx = Math.min(
          total - 1,
          Math.max(0, Math.round(self.progress * (total - 1))),
        );
        if (idx !== currentFrameRef.current) {
          currentFrameRef.current = idx;
          drawFrame(idx);
        }
      },
    });

    // ── Scroll indicator fade-out (1–8%) ──
    const scrollIndicator = scrollIndicatorRef.current;
    let indicatorTrigger: ScrollTrigger | null = null;
    if (scrollIndicator) {
      indicatorTrigger = ScrollTrigger.create({
        trigger: container,
        start: "1% top",
        end: "8% top",
        scrub: true,
        onUpdate: (self) => {
          scrollIndicator.style.opacity = String(1 - self.progress);
        },
      });
    }

    // ── Text slides ──
    const textTriggers: ScrollTrigger[] = [];

    SLIDES.forEach((slide, i) => {
      const el = slideEls.current[i];
      if (!el) return;

      const startPct = slide.startPct / 100;
      const endPct = slide.endPct / 100;
      const duration = endPct - startPct;
      const fadeInEnd = startPct + duration * 0.35;
      const fadeOutStart = startPct + duration * 0.65;

      const xFrom =
        slide.side === "left" ? -60 : slide.side === "right" ? 60 : 0;
      const yFrom = slide.side === "center" ? 30 : 0;

      // Initial state
      el.style.opacity = i === 0 ? "1" : "0";

      // Fade IN
      if (i > 0) {
        // slide 0 starts visible, skip fade-in trigger
        const ti = ScrollTrigger.create({
          trigger: container,
          start: `${startPct * 100}% top`,
          end: `${fadeInEnd * 100}% top`,
          scrub: true,
          onUpdate: (self) => {
            const p = self.progress;
            el.style.opacity = String(p);
            el.style.transform = `translate(${xFrom * (1 - p)}px, ${yFrom * (1 - p)}px)`;
          },
        });
        textTriggers.push(ti);
      }

      // Special: intro (slide 0) fades out as soon as scroll starts (1-8%)
      if (i === 0) {
        const t0 = ScrollTrigger.create({
          trigger: container,
          start: "1% top",
          end: "8% top",
          scrub: true,
          onUpdate: (self) => {
            const p = 1 - self.progress;
            el.style.opacity = String(p);
            el.style.transform = `translateY(${-20 * self.progress}px)`;
          },
        });
        textTriggers.push(t0);
      }

      // Fade OUT (all except last CTA which stays until end)
      if (i < SLIDES.length - 1) {
        const to = ScrollTrigger.create({
          trigger: container,
          start: `${fadeOutStart * 100}% top`,
          end: `${endPct * 100}% top`,
          scrub: true,
          onUpdate: (self) => {
            const p = 1 - self.progress;
            el.style.opacity = String(p);
            el.style.transform = `translate(${xFrom * -0.3 * (1 - p)}px, ${yFrom * -0.3 * (1 - p)}px)`;
          },
        });
        textTriggers.push(to);
      }

      // CTA slide: fade in at 82% and stay
      if (slide.id === "cta") {
        const tc = ScrollTrigger.create({
          trigger: container,
          start: "82% top",
          end: "86% top",
          scrub: true,
          onUpdate: (self) => {
            el.style.opacity = String(self.progress);
            el.style.transform = `translateY(${20 * (1 - self.progress)}px)`;
          },
        });
        textTriggers.push(tc);
      }
    });

    return () => {
      frameTrigger.kill();
      indicatorTrigger?.kill();
      textTriggers.forEach((t) => t.kill());
    };
  }, [loaded, drawFrame]);

  return (
    <>
      {/* ── DESKTOP + MOBILE: scroll-driven canvas hero ── */}
      <div
        ref={containerRef}
        className="relative"
        style={{ height: "500vh" }}
        aria-label="Hero animé scroll-driven"
      >
        {/* Sticky viewport */}
        <div className="sticky top-0 h-screen overflow-hidden">
          {/* Canvas — frames drawn here */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
            style={{ display: "block" }}
          />

          {/* Poster + spinner while loading */}
          {!loaded && (
            <div className="absolute inset-0 z-10">
              <Image
                src="/images/hero-facade.jpg"
                alt="Tulipes Et Cetera — chargement"
                fill
                className="object-cover"
                priority
              />
              {/* Gradient overlay on poster */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
              {/* Spinner */}
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
                <div className="w-10 h-10 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                <span className="font-body text-white/70 text-sm tracking-widest uppercase">
                  {loadProgress}%
                </span>
              </div>
            </div>
          )}

          {/* Gradient overlay */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10 pointer-events-none"
            aria-hidden="true"
          />
          {/* Bottom vignette */}
          <div
            className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"
            aria-hidden="true"
          />

          {/* ── Slide 0 — Intro ── */}
          <div
            ref={(el) => {
              slideEls.current[0] = el;
            }}
            className="absolute inset-0 flex flex-col items-center justify-end pb-24 px-6 text-center pointer-events-none"
            style={{ opacity: 1 }}
          >
            <span
              className="font-body text-xs md:text-sm tracking-[0.3em] uppercase mb-3"
              style={{
                color: "#C8A96E",
                textShadow: "0 2px 12px rgba(0,0,0,0.8)",
              }}
            >
              Cottage de Charme · Sundgau · Alsace 🌷
            </span>
            <h1
              className="text-5xl md:text-7xl lg:text-8xl text-white leading-[1.05]"
              style={{
                textShadow: "0 4px 24px rgba(0,0,0,0.85)",
                fontFamily: "var(--font-script)",
              }}
            >
              Tulipes Et Cetera
            </h1>
          </div>

          {/* ── Slide 1 — gauche ── */}
          <div
            ref={(el) => {
              slideEls.current[1] = el;
            }}
            className="absolute inset-0 flex flex-col items-start justify-end pb-24 px-8 md:px-20 pointer-events-none"
            style={{ opacity: 0, transform: "translateX(-60px)" }}
          >
            <p
              className="font-heading text-3xl md:text-4xl lg:text-5xl text-white max-w-xl leading-snug"
              style={{ textShadow: "0 4px 24px rgba(0,0,0,0.85)" }}
            >
              {SLIDES[1].text}
            </p>
          </div>

          {/* ── Slide 2 — droite ── */}
          <div
            ref={(el) => {
              slideEls.current[2] = el;
            }}
            className="absolute inset-0 flex flex-col items-end justify-end pb-24 px-8 md:px-20 pointer-events-none"
            style={{ opacity: 0, transform: "translateX(60px)" }}
          >
            <p
              className="font-heading text-3xl md:text-4xl lg:text-5xl text-white max-w-xl text-right leading-snug"
              style={{ textShadow: "0 4px 24px rgba(0,0,0,0.85)" }}
            >
              {SLIDES[2].text}
            </p>
          </div>

          {/* ── Slide 3 — gauche ── */}
          <div
            ref={(el) => {
              slideEls.current[3] = el;
            }}
            className="absolute inset-0 flex flex-col items-start justify-end pb-24 px-8 md:px-20 pointer-events-none"
            style={{ opacity: 0, transform: "translateX(-60px)" }}
          >
            <p
              className="font-heading text-3xl md:text-4xl lg:text-5xl text-white max-w-xl leading-snug"
              style={{ textShadow: "0 4px 24px rgba(0,0,0,0.85)" }}
            >
              {SLIDES[3].text}
            </p>
          </div>

          {/* ── Slide 4 — droite ── */}
          <div
            ref={(el) => {
              slideEls.current[4] = el;
            }}
            className="absolute inset-0 flex flex-col items-end justify-end pb-24 px-8 md:px-20 pointer-events-none"
            style={{ opacity: 0, transform: "translateX(60px)" }}
          >
            <p
              className="font-heading text-3xl md:text-4xl lg:text-5xl text-white max-w-xl text-right leading-snug"
              style={{ textShadow: "0 4px 24px rgba(0,0,0,0.85)" }}
            >
              {SLIDES[4].text}
            </p>
          </div>

          {/* ── Slide 5 — CTA centré ── */}
          <div
            ref={(el) => {
              slideEls.current[5] = el;
            }}
            className="absolute inset-0 flex flex-col items-center justify-end pb-20 px-6 text-center"
            style={{ opacity: 0, transform: "translateY(20px)" }}
          >
            <div className="flex flex-col items-center gap-5 pointer-events-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href={`/${lang}/reservation`}
                  className="inline-flex items-center justify-center px-10 py-4 bg-tulipe-forest hover:bg-tulipe-forest-dark text-white font-body font-semibold rounded-[10px] transition-all duration-300 hover:scale-105 text-lg shadow-lg"
                >
                  Réservez votre séjour
                </Link>
                <Link
                  href={`/${lang}/maison`}
                  className="inline-flex items-center justify-center px-10 py-4 border-2 border-white text-white hover:bg-white hover:text-tulipe-blue font-body font-semibold rounded-[10px] transition-all duration-300 hover:scale-105 text-lg"
                >
                  Découvrir la maison
                </Link>
              </div>
              <div className="flex items-center gap-3 mt-1">
                <span
                  className="text-lg tracking-wider"
                  style={{ color: "#C8A96E" }}
                >
                  ★★★★★
                </span>
                <span
                  className="font-body text-white/85 text-base"
                  style={{ textShadow: "0 2px 8px rgba(0,0,0,0.7)" }}
                >
                  9.9/10 sur Booking · 86 avis
                </span>
              </div>
            </div>
          </div>

          {/* ── Scroll indicator ── */}
          <div
            ref={scrollIndicatorRef}
            className="absolute bottom-7 left-1/2 -translate-x-1/2 z-20 animate-bounce pointer-events-none"
          >
            <svg
              className="w-6 h-6 text-white/60"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* ── MOBILE fallback static hero (no JS canvas) ── */}
      <noscript>
        <section className="relative h-screen min-h-[600px] flex items-end justify-start overflow-hidden">
          <Image
            src="/images/hero-facade.jpg"
            alt="Tulipes Et Cetera — Cottage de Charme en Alsace"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="relative z-10 px-6 pb-16 flex flex-col gap-4">
            <span
              className="font-body text-xs tracking-[0.3em] uppercase"
              style={{ color: "#C8A96E" }}
            >
              Cottage de Charme · Sundgau · Alsace
            </span>
            <h1
              className="font-heading text-5xl text-white leading-tight"
              style={{ textShadow: "0 4px 20px rgba(0,0,0,0.8)" }}
            >
              Tulipes Et Cetera
            </h1>
          </div>
        </section>
      </noscript>
    </>
  );
}
