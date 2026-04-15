"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Menu, X } from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";
import type { Locale } from "@/i18n/config";

interface HeaderProps {
  lang: Locale;
}

const navKeys = [
  "home",
  "house",
  "rooms",
  "services",
  "discover",
  "booking",
  "reviews",
  "blog",
  "contact",
] as const;

const navHrefs: Record<(typeof navKeys)[number], string> = {
  home: "/",
  house: "/maison",
  rooms: "/chambres",
  services: "/services",
  discover: "/decouvrir",
  booking: "/reservation",
  reviews: "/avis",
  blog: "/blog",
  contact: "/contact",
};

export default function Header({ lang }: HeaderProps) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 100);
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function isActive(href: string) {
    const fullHref = `/${lang}${href === "/" ? "" : href}`;
    return (
      pathname === fullHref || (href !== "/" && pathname.startsWith(fullHref))
    );
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-md" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href={`/${lang}`} className="flex items-center gap-3 shrink-0">
            <Image
              src="/images/logo.jpg"
              alt="Tulipes EtCetera"
              height={56}
              width={56}
              className="rounded-md object-cover h-12 w-12 md:h-14 md:w-14"
              priority
            />
            <span
              className={`font-heading text-lg hidden sm:block leading-tight transition-colors duration-300 ${
                scrolled ? "text-tulipe-royal" : "text-white"
              }`}
            >
              Tulipes
              <br />
              <span className={scrolled ? "text-tulipe-gold" : "text-white/80"}>
                et Cetera
              </span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navKeys.map((key) => (
              <Link
                key={key}
                href={`/${lang}${navHrefs[key] === "/" ? "" : navHrefs[key]}`}
                className={`px-2 xl:px-3 py-1.5 text-sm font-body rounded transition-colors whitespace-nowrap ${
                  isActive(navHrefs[key])
                    ? scrolled
                      ? "text-tulipe-green font-semibold border-b-2 border-tulipe-green"
                      : "text-white font-semibold border-b-2 border-white"
                    : scrolled
                      ? "text-gray-700 hover:text-tulipe-royal"
                      : "text-white/90 hover:text-white"
                }`}
              >
                {t(key)}
              </Link>
            ))}
          </nav>

          {/* Right side: language switcher + hamburger */}
          <div className="flex items-center gap-3">
            <LanguageSwitcher currentLocale={lang} />
            <button
              className={`lg:hidden p-2 rounded-md transition-colors ${
                scrolled
                  ? "text-tulipe-royal hover:bg-tulipe-beige"
                  : "text-white hover:bg-white/20"
              }`}
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav className="lg:hidden bg-white border-t border-tulipe-beige px-4 py-3 flex flex-col gap-1 shadow-md">
          {navKeys.map((key) => (
            <Link
              key={key}
              href={`/${lang}${navHrefs[key] === "/" ? "" : navHrefs[key]}`}
              className={`px-3 py-2.5 rounded text-sm font-body transition-colors ${
                isActive(navHrefs[key])
                  ? "text-tulipe-green font-semibold bg-tulipe-beige"
                  : "text-gray-700 hover:text-tulipe-royal hover:bg-tulipe-beige"
              }`}
              onClick={() => setMobileOpen(false)}
            >
              {t(key)}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
