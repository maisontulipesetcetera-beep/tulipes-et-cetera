"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

interface ScrollVideoHeroProps {
  lang: string;
}

const slides = [
  {
    range: [0, 0.15],
    position: "center",
    supertitle: "Maison d'hôtes de charme · Sundgau · Alsace",
    title: "Tulipes Et Cetera",
    from: "center",
  },
  {
    range: [0.15, 0.3],
    position: "left",
    text: "Un écrin de douceur au fond d'une ruelle sans issue",
    from: "left",
  },
  {
    range: [0.3, 0.5],
    position: "right",
    text: "Trois chambres de charme, literie haut de gamme, balnéo",
    from: "right",
  },
  {
    range: [0.5, 0.65],
    position: "left",
    text: "Petit-déjeuner fait maison, produits bio et locaux",
    from: "left",
  },
  {
    range: [0.65, 0.8],
    position: "right",
    text: "Vous viendrez en hôte et repartirez en ami",
    from: "right",
  },
  {
    range: [0.8, 1],
    position: "center",
    cta: true,
    from: "center",
  },
];

export default function ScrollVideoHero({ lang }: ScrollVideoHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isMobile = useRef(false);

  useEffect(() => {
    isMobile.current = window.innerWidth < 768;
    if (isMobile.current) return;

    let gsapInstance: typeof import("gsap").gsap | null = null;
    let ScrollTriggerInstance:
      | typeof import("gsap/ScrollTrigger").ScrollTrigger
      | null = null;

    async function init() {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      gsapInstance = gsap;
      ScrollTriggerInstance = ScrollTrigger;

      const video = videoRef.current;
      const container = containerRef.current;
      if (!video || !container) return;

      // Wait for video metadata to load
      await new Promise<void>((resolve) => {
        if (video.readyState >= 1) {
          resolve();
        } else {
          video.addEventListener("loadedmetadata", () => resolve(), {
            once: true,
          });
        }
      });

      const duration = video.duration || 30;

      // Control video currentTime with scroll
      ScrollTrigger.create({
        trigger: container,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        onUpdate: (self) => {
          video.currentTime = self.progress * duration;
        },
      });

      // Animate each slide text panel
      slideRefs.current.forEach((el, i) => {
        if (!el) return;
        const slide = slides[i];
        const [start, end] = slide.range;

        const xFrom =
          slide.from === "left" ? -60 : slide.from === "right" ? 60 : 0;
        const yFrom = slide.from === "center" ? 30 : 0;

        // Fade in
        ScrollTrigger.create({
          trigger: container,
          start: `${start * 100}% top`,
          end: `${(start + (end - start) * 0.35) * 100}% top`,
          scrub: true,
          onUpdate: (self) => {
            const p = self.progress;
            el.style.opacity = String(p);
            el.style.transform = `translate(${xFrom * (1 - p)}px, ${yFrom * (1 - p)}px)`;
          },
        });

        // Fade out
        const fadeOutStart = start + (end - start) * 0.65;
        ScrollTrigger.create({
          trigger: container,
          start: `${fadeOutStart * 100}% top`,
          end: `${end * 100}% top`,
          scrub: true,
          onUpdate: (self) => {
            const p = 1 - self.progress;
            el.style.opacity = String(p);
            el.style.transform = `translate(${xFrom * (1 - p) * -0.3}px, ${yFrom * (1 - p) * -0.3}px)`;
          },
        });
      });
    }

    init();

    return () => {
      if (ScrollTriggerInstance) {
        ScrollTriggerInstance.getAll().forEach((t) => t.kill());
      }
    };
  }, []);

  return (
    <>
      {/* DESKTOP: scroll-driven container */}
      <div
        ref={containerRef}
        className="hidden md:block relative"
        style={{ height: "400vh" }}
      >
        {/* Sticky video viewport */}
        <div className="sticky top-0 h-screen overflow-hidden">
          {/* Video */}
          <video
            ref={videoRef}
            muted
            playsInline
            preload="auto"
            poster="/images/hero-facade.jpg"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ willChange: "transform" }}
          >
            <source src="/images/hero-video.mp4" type="video/mp4" />
          </video>

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent pointer-events-none" />

          {/* Slide text panels */}
          {slides.map((slide, i) => {
            const posClass =
              slide.position === "left"
                ? "items-start justify-end text-left"
                : slide.position === "right"
                  ? "items-end justify-end text-right"
                  : "items-center justify-end text-center";

            return (
              <div
                key={i}
                ref={(el) => {
                  slideRefs.current[i] = el;
                }}
                className={`absolute inset-0 flex flex-col px-12 md:px-20 pb-20 md:pb-28 gap-4 pointer-events-none ${posClass}`}
                style={{ opacity: i === 0 ? 1 : 0 }}
              >
                {/* Slide 0: main hero */}
                {i === 0 && (
                  <>
                    <span
                      className="text-tulipe-gold text-sm md:text-base tracking-[0.3em] uppercase font-body"
                      style={{ textShadow: "0 2px 8px rgba(0,0,0,0.7)" }}
                    >
                      {slide.supertitle}
                    </span>
                    <h1
                      className="font-heading text-5xl md:text-7xl lg:text-8xl text-white leading-[1.05]"
                      style={{ textShadow: "0 4px 20px rgba(0,0,0,0.8)" }}
                    >
                      {slide.title}
                    </h1>
                  </>
                )}

                {/* Slides 1-4: text panels */}
                {i >= 1 && i <= 4 && (
                  <p
                    className="font-heading text-3xl md:text-4xl lg:text-5xl text-white max-w-xl leading-snug"
                    style={{ textShadow: "0 4px 24px rgba(0,0,0,0.85)" }}
                  >
                    {slide.text}
                  </p>
                )}

                {/* Slide 5: CTA */}
                {i === 5 && (
                  <div
                    className="flex flex-col items-center gap-5 pointer-events-auto"
                    style={{ opacity: 1 }}
                  >
                    <h2
                      className="font-heading text-4xl md:text-5xl text-white"
                      style={{ textShadow: "0 4px 20px rgba(0,0,0,0.8)" }}
                    >
                      Réservez votre séjour
                    </h2>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Link
                        href={`/${lang}/reservation`}
                        className="inline-flex items-center justify-center px-10 py-4 bg-tulipe-green hover:bg-tulipe-green-dark text-white font-body font-semibold rounded-[10px] transition-all duration-300 hover:scale-105 text-lg shadow-lg"
                      >
                        Réserver maintenant
                      </Link>
                      <Link
                        href={`/${lang}/maison`}
                        className="inline-flex items-center justify-center px-10 py-4 bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white font-body font-semibold rounded-[10px] transition-all duration-300 border border-white/30 text-lg"
                      >
                        Découvrir la maison
                      </Link>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-tulipe-gold text-lg tracking-wider">
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
                )}
              </div>
            );
          })}

          {/* Scroll indicator — only visible at top */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 animate-bounce">
            <svg
              className="w-6 h-6 text-white/60"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
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

      {/* MOBILE: classic autoplay video hero */}
      <section className="md:hidden relative h-screen min-h-[600px] flex items-end justify-start overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="/images/hero-facade.jpg"
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/images/hero-video.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        <div className="relative z-10 px-6 pb-16 max-w-lg flex flex-col gap-4">
          <span className="font-body text-xs tracking-[0.3em] uppercase text-tulipe-gold">
            Maison d&apos;hôtes · Sundgau · Alsace
          </span>
          <h1
            className="font-heading text-5xl text-white leading-tight"
            style={{ textShadow: "0 4px 20px rgba(0,0,0,0.8)" }}
          >
            Tulipes Et Cetera
          </h1>
          <p className="font-body text-lg text-white/90 leading-relaxed">
            Vous viendrez en hôte et repartirez en ami.
          </p>
          <div className="flex flex-col gap-3 mt-2">
            <Link
              href={`/${lang}/reservation`}
              className="inline-flex items-center justify-center px-8 py-4 bg-tulipe-green text-white font-body font-semibold rounded-[10px] text-lg shadow-lg"
            >
              Réserver votre séjour
            </Link>
            <Link
              href={`/${lang}/maison`}
              className="inline-flex items-center justify-center px-8 py-4 bg-white/15 backdrop-blur-sm text-white font-body font-semibold rounded-[10px] border border-white/30 text-lg"
            >
              Découvrir la maison
            </Link>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-tulipe-gold">★★★★★</span>
            <span className="font-body text-white/80 text-sm">
              9.9/10 sur Booking
            </span>
          </div>
        </div>

        {/* Poster fallback for static display */}
        <div className="absolute inset-0 -z-10">
          <Image
            src="/images/hero-facade.jpg"
            alt="Tulipes Et Cetera"
            fill
            className="object-cover"
            priority
          />
        </div>
      </section>
    </>
  );
}
