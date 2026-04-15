"use client";

import { useState } from "react";
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

  function isActive(href: string) {
    const fullHref = `/${lang}${href === "/" ? "" : href}`;
    return (
      pathname === fullHref || (href !== "/" && pathname.startsWith(fullHref))
    );
  }

  return (
    <header className="sticky top-0 z-50 bg-tulipe-cream shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href={`/${lang}`} className="flex items-center gap-3 shrink-0">
            <Image
              src="/images/logo.jpg"
              alt="Tulipes et Cetera"
              height={60}
              width={60}
              className="rounded-md object-cover"
              priority
            />
            <span className="font-heading text-lg text-tulipe-bordeaux hidden sm:block leading-tight">
              Tulipes
              <br />
              <span className="text-tulipe-gold">et Cetera</span>
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
                    ? "text-tulipe-green font-semibold border-b-2 border-tulipe-green"
                    : "text-gray-700 hover:text-tulipe-bordeaux"
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
              className="lg:hidden p-2 rounded-md text-tulipe-bordeaux hover:bg-tulipe-beige transition-colors"
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
        <nav className="lg:hidden bg-tulipe-cream border-t border-tulipe-beige px-4 py-3 flex flex-col gap-1">
          {navKeys.map((key) => (
            <Link
              key={key}
              href={`/${lang}${navHrefs[key] === "/" ? "" : navHrefs[key]}`}
              className={`px-3 py-2.5 rounded text-sm font-body transition-colors ${
                isActive(navHrefs[key])
                  ? "text-tulipe-green font-semibold bg-tulipe-beige"
                  : "text-gray-700 hover:text-tulipe-bordeaux hover:bg-tulipe-beige"
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
